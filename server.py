from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import httpx
import asyncio
import re

# 1. Initialize the Web App
app = FastAPI(title="Netflix Clone ML API")

# Setup CORS so our React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], # Vite & CRA defaults
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Insert your actual TMDB API key here
TMDB_API_KEY = "44f2cf49bec56e11d7607947260c0cf5"

# 2. Load the pre-trained Retrieval and Ranking models into RAM
print("Loading Recommender Models...")
retrieval_model = None
ranking_model = None

try:
    retrieval_model = tf.saved_model.load("saved_recommender_model")
    print("Retrieval model loaded successfully!")
except Exception as e:
    print(f"Error loading retrieval model: {e}")

try:
    ranking_model = tf.saved_model.load("saved_ranking_model")
    print("Ranking model loaded successfully!")
except Exception as e:
    print(f"Error loading ranking model: {e}")

# Genre mapping from TMDB ID to name strings
GENRE_MAPPING = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
}

def clean_movielens_title(raw_title: str):
    """
    Cleans MovieLens movie titles by extracting the release year and restructuring
    the title string (e.g. 'Bridges of Madison County, The (1995)' -> ('The Bridges of Madison County', '1995')).
    """
    # Match the title and year, e.g. "Bridges of Madison County, The (1995)"
    match = re.search(r'^(.*?)\s*\((\d{4})\)$', raw_title.strip())
    if match:
        title_part = match.group(1).strip()
        year = match.group(2).strip()
    else:
        title_part = raw_title.strip()
        year = None

    # Handle cases like "Bridges of Madison County, The" or "Kid in King Arthur's Court, A"
    articles = [", The", ", A", ", An", ", As"]
    for art in articles:
        if title_part.endswith(art):
            article_word = art.replace(",", "").strip()
            title_part = article_word + " " + title_part[:-len(art)].strip()
            break
            
    return title_part, year

async def fetch_movie_details(title: str, client: httpx.AsyncClient):
    """Queries TMDB API for movie details like poster, backdrop, overview, rating, and genres."""
    cleaned_title, year = clean_movielens_title(title)
    url = "https://api.tmdb.org/3/search/movie"
    
    # Try searching with cleaned title and year constraint
    params = {"query": cleaned_title, "api_key": TMDB_API_KEY, "language": "en-US", "page": 1}
    if year:
        params["year"] = year
        
    try:
        response = await client.get(url, params=params)
        data = response.json()
        
        # Fallback: search without year if year-restricted search failed
        if not data.get("results") and year:
            params.pop("year", None)
            response = await client.get(url, params=params)
            data = response.json()
            
        if data.get("results"):
            # Get the top search result
            movie = data["results"][0]
            poster_path = movie.get("poster_path")
            poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
            
            backdrop_path = movie.get("backdrop_path")
            backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None
            
            genre_ids = movie.get("genre_ids", [])
            genres = [GENRE_MAPPING.get(gid, "Other") for gid in genre_ids if gid in GENRE_MAPPING]
            if not genres and genre_ids:
                genres = ["Other"]
            
            return {
                "title": title, # Original title from our model
                "tmdb_title": movie.get("title"),
                "overview": movie.get("overview", "No description available."),
                "poster_url": poster_url,
                "backdrop_url": backdrop_url,
                "rating": movie.get("vote_average", 0.0),
                "release_date": movie.get("release_date"),
                "genres": genres
            }
    except Exception as e:
        print(f"Error fetching data for {title}: {e}")
    
    # Fallback if TMDB fails or movie not found
    return {
        "title": title,
        "tmdb_title": title,
        "overview": "No description available.",
        "poster_url": None,
        "backdrop_url": None,
        "rating": 0.0,
        "release_date": None,
        "genres": ["Drama"]
    }


# 3. Create the API Endpoint
@app.get("/recommend/{user_id}")
async def get_recommendations(user_id: str):
    """
    When a frontend requests this URL, it passes a user_id.
    We retrieve candidates, rank them, fetch enriched data from TMDB, and return JSON.
    """
    if not retrieval_model:
        return {"status": "error", "message": "Retrieval model not loaded."}

    # Convert string user_id into the numpy array format the model expects
    user_tensor = np.array([user_id])
    
    # Stage 1: Retrieval (Fetch top 25 candidates)
    scores, titles = retrieval_model(user_tensor)
    recommended_movies = [title.decode('utf-8') for title in titles[0, :25].numpy()]
    
    # Stage 2: Ranking (Sort the top 25 candidates using the Ranking model)
    if ranking_model:
        try:
            # Replicate the user_id for all candidate movies
            user_ids_tensor = tf.constant([user_id] * len(recommended_movies), dtype=tf.string)
            movie_titles_tensor = tf.constant(recommended_movies, dtype=tf.string)
            
            # Predict rating scores
            predicted_scores = ranking_model(user_ids_tensor, movie_titles_tensor).numpy().flatten()
            
            # Rank candidates based on scores
            ranked_movies = sorted(zip(recommended_movies, predicted_scores), key=lambda x: x[1], reverse=True)
            top_recommended_movies = [movie for movie, score in ranked_movies[:5]]
            print(f"Ranked movies for user {user_id}: {[(m, float(s)) for m, s in ranked_movies[:5]]}")
        except Exception as e:
            print(f"Error during ranking: {e}")
            top_recommended_movies = recommended_movies[:5]
    else:
        top_recommended_movies = recommended_movies[:5]
    
    # Fetch enriched data from TMDB asynchronously
    async with httpx.AsyncClient() as client:
        tasks = [fetch_movie_details(title, client) for title in top_recommended_movies]
        enriched_recommendations = await asyncio.gather(*tasks)
    
    return {
        "status": "success",
        "user_id": user_id,
        "recommendations": enriched_recommendations
    }