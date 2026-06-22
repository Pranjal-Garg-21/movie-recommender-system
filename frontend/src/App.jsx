import { useState, useEffect } from 'react';

// Mock profiles for "Who's Watching" screen
const MOCK_PROFILES = [
  { id: '42', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80', color: 'bg-red-600' },
  { id: '123', name: 'Blake', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', color: 'bg-blue-600' },
  { id: '88', name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80', color: 'bg-green-600' },
  { id: '250', name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', color: 'bg-yellow-600' },
  { id: '500', name: 'Taylor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80', color: 'bg-purple-600' }
];

// Verified Trending Movies list with working TMDB poster/backdrop URLs
const TRENDING_MOVIES = [
  {
    title: "Dark Knight, The (2008)",
    tmdb_title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg",
    rating: 8.5,
    release_date: "2008-07-16",
    genres: ["Action", "Crime", "Drama", "Thriller"]
  },
  {
    title: "Inception (2010)",
    tmdb_title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    poster_url: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    rating: 8.4,
    release_date: "2010-07-15",
    genres: ["Action", "Sci-Fi", "Adventure"]
  },
  {
    title: "Pulp Fiction (1994)",
    tmdb_title: "Pulp Fiction",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    poster_url: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    rating: 8.5,
    release_date: "1994-09-10",
    genres: ["Thriller", "Crime"]
  },
  {
    title: "Interstellar (2014)",
    tmdb_title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_url: "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/2ssWTSVklAEc98frZUQhgtGHx7s.jpg",
    rating: 8.4,
    release_date: "2014-11-05",
    genres: ["Adventure", "Drama", "Sci-Fi"]
  },
  {
    title: "Spirited Away (2001)",
    tmdb_title: "Spirited Away",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    poster_url: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/dyJvKsNs2KP8qQnAXbRwDjblViy.jpg",
    rating: 8.5,
    release_date: "2001-07-20",
    genres: ["Animation", "Family", "Fantasy"]
  }
];

// Verified TV Series list with working TMDB poster/backdrop URLs
const TV_SERIES = [
  {
    title: "Stranger Things",
    tmdb_title: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    poster_url: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    rating: 8.6,
    release_date: "2016-07-15",
    genres: ["Sci-Fi", "Drama", "Mystery"]
  },
  {
    title: "Wednesday",
    tmdb_title: "Wednesday",
    overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates twisted mysteries while making new friends — and foes — at Nevermore Academy.",
    poster_url: "https://image.tmdb.org/t/p/w500/36xXlhEpQqVVPuiZhfoQuaY4OlA.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
    rating: 8.3,
    release_date: "2022-11-23",
    genres: ["Comedy", "Mystery", "Fantasy"]
  },
  {
    title: "Squid Game",
    tmdb_title: "Squid Game",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    poster_url: "https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/2meX1nMdScFOoV4370rqHWKmXhY.jpg",
    rating: 7.9,
    release_date: "2021-09-17",
    genres: ["Action", "Drama", "Thriller"]
  },
  {
    title: "The Witcher",
    tmdb_title: "The Witcher",
    overview: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    poster_url: "https://image.tmdb.org/t/p/w500/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/foGkPxpw9h8zln81j63mix5B7m8.jpg",
    rating: 7.9,
    release_date: "2019-12-20",
    genres: ["Action", "Adventure", "Fantasy"]
  },
  {
    title: "Black Mirror",
    tmdb_title: "Black Mirror",
    overview: "Twisted tales run wild in this mind-bending anthology series that reveals humanity's worst traits, greatest innovations and more.",
    poster_url: "https://image.tmdb.org/t/p/w500/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg",
    backdrop_url: "https://image.tmdb.org/t/p/original/dg3OindVAGZBjlT3xYKqIAdukPL.jpg",
    rating: 8.3,
    release_date: "2011-12-04",
    genres: ["Sci-Fi", "Drama", "Thriller"]
  }
];

function App() {
  const [currentView, setCurrentView] = useState('profiles'); // 'profiles' | 'dashboard'
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  // Navigation tabs state: 'home' | 'movies' | 'series' | 'mylist'
  const [activeTab, setActiveTab] = useState('home');
  
  // User profile list state, loaded from local storage
  const [myList, setMyList] = useState([]);
  
  // Modal & Notification states
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [customUserId, setCustomUserId] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Sync scroll navbar opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Retrieve user saved My List from localStorage when profile is loaded
  useEffect(() => {
    if (selectedProfile) {
      const savedList = localStorage.getItem(`netflix_my_list_${selectedProfile.id}`);
      if (savedList) {
        setMyList(JSON.parse(savedList));
      } else {
        setMyList([]);
      }
    }
  }, [selectedProfile]);

  // Persist user saved My List to localStorage when myList updates
  const saveMyListToLocalStorage = (updatedList) => {
    setMyList(updatedList);
    if (selectedProfile) {
      localStorage.setItem(`netflix_my_list_${selectedProfile.id}`, JSON.stringify(updatedList));
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleMyList = (movie, e) => {
    if (e) e.stopPropagation();
    const isAlreadyAdded = myList.some(item => item.title === movie.title);
    
    if (isAlreadyAdded) {
      const updatedList = myList.filter(item => item.title !== movie.title);
      saveMyListToLocalStorage(updatedList);
      showToast(`Removed "${movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}" from My List`);
    } else {
      const updatedList = [...myList, movie];
      saveMyListToLocalStorage(updatedList);
      showToast(`Added "${movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}" to My List`);
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    fetchRecommendations(profile.id);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customUserId.trim()) return;
    
    const customProfile = {
      id: customUserId,
      name: `User ${customUserId}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      color: 'bg-gray-700'
    };
    setSelectedProfile(customProfile);
    fetchRecommendations(customUserId);
  };

  const fetchRecommendations = async (userId) => {
    setLoading(true);
    setError(null);
    setIsUsingFallback(false);
    setActiveTab('home');
    setSearchQuery('');
    setSearchOpen(false);
    setCurrentView('dashboard');
    
    try {
      const response = await fetch(`http://localhost:8000/recommend/${userId}`);
      if (!response.ok) {
        throw new Error('Backend server returned an error status.');
      }
      
      const data = await response.json();
      if (data.status === 'success' && data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('No recommendations retrieved.');
      }
    } catch (err) {
      console.warn("Failed to fetch from backend, loading fallback mock data...", err);
      setError("Note: Connection to local machine learning API failed. Displaying cached trending recommendations instead.");
      setIsUsingFallback(true);
      setRecommendations(TRENDING_MOVIES);
    } finally {
      setLoading(false);
    }
  };

  const switchProfile = () => {
    setCurrentView('profiles');
    setSelectedProfile(null);
    setRecommendations([]);
    setSelectedMovie(null);
    setCustomUserId('');
    setActiveTab('home');
    setMyList([]);
    setSearchQuery('');
    setSearchOpen(false);
  };

  // The hero banner movie is the top recommender item
  const heroMovie = recommendations[0];

  // Dynamic "Because you watched" logic
  // Grabs the last movie in user's saved list. If empty, falls back to the top recommendation or a trending movie.
  const getWatchedReference = () => {
    if (myList.length > 0) {
      return myList[myList.length - 1];
    }
    return heroMovie || TRENDING_MOVIES[0];
  };

  const watchedReference = getWatchedReference();

  const getRelatedMovies = () => {
    if (!watchedReference) return [];
    
    const watchedGenres = watchedReference.genres || [];
    const watchedTitle = watchedReference.title;

    // Filter recommendations that share a genre (and aren't the same movie)
    let related = [...recommendations, ...TRENDING_MOVIES].filter(movie => 
      movie.title !== watchedTitle &&
      (movie.genres || []).some(g => watchedGenres.includes(g))
    );

    // Remove duplicates
    const seen = new Set();
    related = related.filter(movie => {
      if (seen.has(movie.title)) return false;
      seen.add(movie.title);
      return true;
    });

    // Fallback if no matching genres
    if (related.length === 0) {
      related = TRENDING_MOVIES.filter(movie => movie.title !== watchedTitle);
    }

    return related;
  };

  const relatedMovies = getRelatedMovies();

  // Search filtering logic
  const filterList = (list) => {
    if (!searchQuery.trim()) return list;
    return list.filter(item => {
      const query = searchQuery.toLowerCase();
      const matchTitle = (item.tmdb_title || item.title).toLowerCase().includes(query);
      const matchOverview = (item.overview || '').toLowerCase().includes(query);
      const matchGenres = (item.genres || []).some(g => g.toLowerCase().includes(query));
      return matchTitle || matchOverview || matchGenres;
    });
  };

  const filteredRecommendations = filterList(recommendations);
  const filteredTrending = filterList(TRENDING_MOVIES);
  const filteredSeries = filterList(TV_SERIES);
  const filteredMyList = filterList(myList);
  const filteredRelated = filterList(relatedMovies);

  const isSearchActive = searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-[#141414] text-white selection:bg-[#E50914] selection:text-white">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#E50914] text-white px-5 py-3 rounded-md shadow-2xl flex items-center gap-3 font-semibold tracking-wide text-sm animate-fade-in border border-red-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Profile Select View */}
      {currentView === 'profiles' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-fade-in bg-radial from-[#1a1a1a] to-[#141414]">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-wide mb-8 md:mb-12 text-white/95">Who's watching?</h1>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-4xl">
            {MOCK_PROFILES.map((profile) => (
              <div 
                key={profile.id}
                onClick={() => handleProfileSelect(profile)}
                className="group flex flex-col items-center cursor-pointer text-gray-400 hover:text-white transition duration-300"
              >
                <div className="relative overflow-hidden rounded-md border-3 border-transparent group-hover:border-white transition-all duration-300 shadow-xl group-hover:scale-105 group-hover:shadow-2xl">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-24 h-24 md:w-32 md:h-32 object-cover group-hover:brightness-110 transition duration-300"
                  />
                  <div className={`absolute bottom-0 inset-x-0 h-1.5 ${profile.color}`}></div>
                </div>
                <span className="mt-3 text-base md:text-lg font-light tracking-wide group-hover:text-white transition">{profile.name}</span>
                <span className="text-xs text-gray-500 mt-1">ID: {profile.id}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 w-full max-w-sm border-t border-gray-800 pt-8">
            <form onSubmit={handleCustomSubmit} className="flex flex-col items-center">
              <label htmlFor="userId" className="text-gray-400 text-sm mb-3 font-light">Or enter custom ML User ID:</label>
              <div className="flex w-full rounded overflow-hidden shadow-lg border border-gray-800 focus-within:border-[#E50914] transition">
                <input 
                  type="text" 
                  id="userId"
                  placeholder="e.g. 42" 
                  value={customUserId}
                  onChange={(e) => setCustomUserId(e.target.value)}
                  className="bg-[#2a2a2a] text-white px-4 py-2 flex-grow focus:outline-none text-sm font-light"
                />
                <button 
                  type="submit" 
                  className="bg-[#E50914] hover:bg-[#b80710] text-white px-5 py-2 font-semibold tracking-wide text-sm transition duration-150 active:scale-95 cursor-pointer"
                >
                  Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Loading State Spinner */}
      {currentView === 'dashboard' && loading && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#E50914] animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-400 text-sm tracking-widest uppercase font-light animate-pulse">Loading Recommendations...</p>
        </div>
      )}

      {/* 3. Main Dashboard View */}
      {currentView === 'dashboard' && !loading && (
        <div className="relative pb-24 animate-fade-in">
          
          {/* Header/Navbar */}
          <nav className={`fixed top-0 inset-x-0 z-40 nav-bg-transition px-4 md:px-12 py-3 flex items-center justify-between ${scrolled ? 'bg-[#141414]/95 backdrop-blur-md shadow-md border-b border-gray-900/50' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
            <div className="flex items-center gap-6 md:gap-10">
              <span 
                onClick={switchProfile}
                className="text-[#E50914] font-black tracking-tighter text-2xl md:text-3xl cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-150"
              >
                NETFLIX
              </span>
              <div className="hidden md:flex gap-5 text-sm text-gray-300 font-light">
                <span 
                  onClick={() => { setActiveTab('home'); setSearchQuery(''); }}
                  className={`hover:text-white cursor-pointer transition ${activeTab === 'home' && !isSearchActive ? 'text-white font-semibold' : ''}`}
                >
                  Home
                </span>
                <span 
                  onClick={() => { setActiveTab('series'); setSearchQuery(''); }}
                  className={`hover:text-white cursor-pointer transition ${activeTab === 'series' && !isSearchActive ? 'text-white font-semibold' : ''}`}
                >
                  Series
                </span>
                <span 
                  onClick={() => { setActiveTab('movies'); setSearchQuery(''); }}
                  className={`hover:text-white cursor-pointer transition ${activeTab === 'movies' && !isSearchActive ? 'text-white font-semibold' : ''}`}
                >
                  Movies
                </span>
                <span 
                  onClick={() => { setActiveTab('mylist'); setSearchQuery(''); }}
                  className={`hover:text-white cursor-pointer transition ${activeTab === 'mylist' && !isSearchActive ? 'text-white font-semibold' : ''}`}
                >
                  My List {myList.length > 0 && <span className="ml-1 bg-[#E50914] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{myList.length}</span>}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              {/* Expandable Search Input */}
              <div className="flex items-center gap-2 bg-black/50 border border-gray-800/80 rounded px-2.5 py-1.5 transition-all duration-300 focus-within:border-gray-600">
                <svg 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {(searchOpen || searchQuery) && (
                  <input 
                    type="text" 
                    placeholder="Titles, genres..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-32 md:w-48 transition-all duration-300 animate-fade-in"
                  />
                )}
              </div>

              {isUsingFallback && (
                <span className="text-[10px] md:text-xs bg-yellow-600/30 text-yellow-300 px-2.5 py-1 rounded border border-yellow-500/30 font-medium">
                  DEMO MODE (ML Server Offline)
                </span>
              )}
              
              <div className="flex items-center gap-2 group cursor-pointer relative" onClick={switchProfile}>
                <img 
                  src={selectedProfile?.avatar} 
                  alt={selectedProfile?.name} 
                  className="w-8 h-8 rounded object-cover border border-gray-700 hover:border-white transition"
                />
                <span className="text-xs text-gray-300 hidden sm:inline group-hover:text-white transition">{selectedProfile?.name}</span>
                <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </nav>

          {/* Connection Error Banner */}
          {error && (
            <div className="absolute top-16 left-0 right-0 z-30 mx-auto max-w-4xl px-4">
              <div className="bg-amber-950/80 border border-amber-600/50 text-amber-200 px-4 py-3 rounded-lg flex items-center justify-between text-xs md:text-sm shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <span>{error}</span>
                </div>
                <button 
                  onClick={() => setError(null)} 
                  className="text-amber-400 hover:text-amber-100 transition p-1 ml-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* -------------------- DYNAMIC VIEW RENDERING -------------------- */}

          {/* A. SEARCH RESULTS STATE */}
          {isSearchActive && (
            <div className="px-4 md:px-12 pt-28 min-h-[70vh]">
              <h2 className="text-xl md:text-3xl font-bold mb-8 text-gray-300">
                Search results for: <span className="text-white italic">"{searchQuery}"</span>
              </h2>
              
              {(() => {
                const combined = [];
                const titlesSeen = new Set();
                
                [...filteredRecommendations, ...filteredTrending, ...filteredSeries].forEach(item => {
                  if (!titlesSeen.has(item.title)) {
                    titlesSeen.add(item.title);
                    combined.push(item);
                  }
                });

                if (combined.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                      <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-lg">No movies or TV shows matched your search.</p>
                      <p className="text-sm mt-1">Check your spelling or try different keywords.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {combined.map((movie, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedMovie(movie)}
                        className="transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:z-10 hover:shadow-2xl cursor-pointer rounded-md overflow-hidden bg-[#181818] border border-gray-800/80 group"
                      >
                        <div className="relative aspect-[2/3] w-full">
                          {movie.poster_url ? (
                            <img src={movie.poster_url} alt={movie.tmdb_title || movie.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#202020] flex items-center justify-center p-4 text-center text-xs text-gray-500">{movie.title}</div>
                          )}
                        </div>
                        <div className="p-3 bg-[#181818]">
                          <h4 className="text-xs font-semibold text-white truncate mb-1">{movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}</h4>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-green-500 font-medium">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'N/A'}</span>
                            <span className="text-gray-400 font-light">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* B. HOME TAB */}
          {activeTab === 'home' && !isSearchActive && (
            <>
              {/* Hero Banner (Top Recommended Movie) */}
              {heroMovie && (
                <div className="relative h-[65vh] md:h-[85vh] w-full flex items-end">
                  {/* Background Backdrop Image */}
                  <div className="absolute inset-0 z-0">
                    {heroMovie.backdrop_url ? (
                      <img 
                        src={heroMovie.backdrop_url} 
                        alt={heroMovie.tmdb_title || heroMovie.title} 
                        className="w-full h-full object-cover object-center brightness-[0.55]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-800 to-black flex items-center justify-center opacity-60">
                        <span className="text-gray-500 italic text-lg">No Backdrop Available</span>
                      </div>
                    )}
                    {/* Horizontal & Vertical Fade-out Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent"></div>
                    <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                  </div>

                  {/* Movie Details Content */}
                  <div className="relative z-10 px-4 md:px-12 pb-8 md:pb-20 max-w-3xl animate-fade-in">
                    {heroMovie.genres && heroMovie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {heroMovie.genres.map((g, idx) => (
                          <span key={idx} className="bg-black/55 border border-gray-700/30 text-xs text-gray-300 px-2 py-0.5 rounded font-light backdrop-blur-sm">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight text-white mb-3">
                      {heroMovie.tmdb_title || heroMovie.title.replace(/\s*\(\d{4}\)$/, '')}
                    </h2>
                    
                    <div className="flex items-center gap-3.5 mb-4 text-sm font-semibold">
                      {heroMovie.rating > 0 && (
                        <span className="text-green-500 flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                          </svg>
                          {heroMovie.rating.toFixed(1)} / 10
                        </span>
                      )}
                      {heroMovie.release_date && (
                        <span className="text-gray-300 font-light">
                          {new Date(heroMovie.release_date).getFullYear()}
                        </span>
                      )}
                      <span className="text-gray-400 border border-gray-600 px-1 py-0.2 rounded text-[10px]">HD</span>
                    </div>

                    <p className="text-sm md:text-base text-gray-200 line-clamp-3 md:line-clamp-4 font-light leading-relaxed mb-6 max-w-2xl">
                      {heroMovie.overview}
                    </p>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedMovie(heroMovie)}
                        className="bg-white hover:bg-white/80 text-black px-6 md:px-8 py-2.5 rounded font-bold flex items-center justify-center gap-2 transition duration-200 active:scale-95 text-sm shadow-md cursor-pointer"
                      >
                        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"></path>
                        </svg>
                        Play
                      </button>
                      <button 
                        onClick={() => setSelectedMovie(heroMovie)}
                        className="bg-gray-500/40 hover:bg-gray-500/30 text-white px-5 md:px-7 py-2.5 rounded font-bold flex items-center justify-center gap-2 transition duration-200 active:scale-95 text-sm backdrop-blur-sm border border-gray-500/10 cursor-pointer"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 1: Netflix Top 10 Personalized Recommendations with Giant Numbers */}
              <div className="px-4 md:px-12 mt-8 relative z-20">
                <h3 className="text-lg md:text-2xl font-bold mb-4 tracking-wide text-white flex items-center gap-2">
                  <span>Top 10 Recommendations for You</span>
                  <span className="text-xs text-gray-500 font-normal">Ranked by Stage-2 model</span>
                </h3>
                
                <div className="relative group/row">
                  <button 
                    onClick={() => document.getElementById('carousel-recs').scrollBy({ left: -450, behavior: 'smooth' })}
                    className="absolute left-0 inset-y-0 z-30 w-12 bg-black/70 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/90 border-r border-gray-800/50 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>

                  <div id="carousel-recs" className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-8 pt-4">
                    {recommendations.map((movie, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedMovie(movie)}
                        className="flex-none w-44 sm:w-52 md:w-60 transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-30 hover:shadow-2xl cursor-pointer relative flex items-center pl-10 md:pl-14 group"
                      >
                        {/* Giant outline rank number */}
                        <span 
                          className="absolute left-0 bottom-[-1rem] text-[9rem] md:text-[12rem] font-black leading-none text-black select-none z-0 tracking-tighter"
                          style={{ 
                            WebkitTextStroke: '2px #444', 
                            textShadow: '0 0 10px rgba(0,0,0,0.9)',
                            fontFamily: '"Outfit", sans-serif'
                          }}
                        >
                          {idx + 1}
                        </span>

                        <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-[#181818] border border-gray-800 shadow-lg z-10 transition-opacity duration-300 group-hover:opacity-90">
                          {movie.poster_url ? (
                            <img src={movie.poster_url} alt={movie.tmdb_title || movie.title} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full bg-[#202020] flex flex-col items-center justify-center p-4 text-center">
                              <span className="text-xs text-gray-400 font-light truncate w-full">{movie.title}</span>
                            </div>
                          )}
                          
                          {/* Inner hover metadata */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-3 z-20">
                            <h4 className="text-xs md:text-sm font-bold text-white truncate">{movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}</h4>
                            <div className="flex items-center justify-between text-[9px] md:text-[10px] mt-1">
                              <span className="text-green-500 font-semibold">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'N/A'}</span>
                              <span className="text-gray-300 font-light">{movie.release_date ? new Date(movie.release_date).getFullYear() : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => document.getElementById('carousel-recs').scrollBy({ left: 450, behavior: 'smooth' })}
                    className="absolute right-0 inset-y-0 z-30 w-12 bg-black/70 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/90 border-l border-gray-800/50 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Row 2: Dynamic "Because you watched [Movie]" Row */}
              {watchedReference && filteredRelated.length > 0 && (
                <div className="px-4 md:px-12 mt-8 relative z-20">
                  <h3 className="text-lg md:text-xl font-bold mb-4 tracking-wide text-white flex items-center gap-2">
                    <span>Because you watched <span className="text-[#E50914]">{watchedReference.tmdb_title || watchedReference.title.replace(/\s*\(\d{4}\)$/, '')}</span></span>
                  </h3>
                  
                  <div className="relative group/row">
                    <button 
                      onClick={() => document.getElementById('carousel-related').scrollBy({ left: -350, behavior: 'smooth' })}
                      className="absolute left-0 inset-y-0 z-30 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/80 border-r border-gray-800/50 cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>

                    <div id="carousel-related" className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2">
                      {filteredRelated.map((movie, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedMovie(movie)}
                          className="flex-none w-36 sm:w-44 md:w-52 transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-20 hover:shadow-2xl cursor-pointer relative rounded-md overflow-hidden bg-[#181818] border border-gray-800/80 group"
                        >
                          <div className="relative aspect-[2/3] w-full">
                            <img src={movie.poster_url} alt={movie.tmdb_title || movie.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="p-3 bg-[#181818]">
                            <h4 className="text-xs font-semibold text-white truncate mb-1">{movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}</h4>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-green-500 font-semibold">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'N/A'}</span>
                              <span className="text-gray-400 font-light">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => document.getElementById('carousel-related').scrollBy({ left: 350, behavior: 'smooth' })}
                      className="absolute right-0 inset-y-0 z-30 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/80 border-l border-gray-800/50 cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Row 3: My List (Persisted) */}
              {myList.length > 0 && (
                <div className="px-4 md:px-12 mt-10 relative z-20">
                  <h3 className="text-lg md:text-xl font-bold mb-4 tracking-wide text-white flex items-center gap-2">
                    <span>My List</span>
                  </h3>
                  
                  <div className="relative group/row">
                    <button 
                      onClick={() => document.getElementById('carousel-list').scrollBy({ left: -350, behavior: 'smooth' })}
                      className="absolute left-0 inset-y-0 z-30 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/80 border-r border-gray-800/50 cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>

                    <div id="carousel-list" className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2">
                      {myList.map((movie, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedMovie(movie)}
                          className="flex-none w-36 sm:w-44 md:w-52 transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-20 hover:shadow-2xl cursor-pointer relative rounded-md overflow-hidden bg-[#181818] border border-gray-800/80 group"
                        >
                          <div className="relative aspect-[2/3] w-full">
                            <img src={movie.poster_url} alt={movie.tmdb_title || movie.title} className="w-full h-full object-cover" />
                            <button 
                              onClick={(e) => toggleMyList(movie, e)}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 border border-gray-700 text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-95 transition z-30"
                              title="Remove from My List"
                            >
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                          <div className="p-3 bg-[#181818]">
                            <h4 className="text-xs font-semibold text-white truncate mb-1">{movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}</h4>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-green-500 font-semibold">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'N/A'}</span>
                              <span className="text-gray-400 font-light">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => document.getElementById('carousel-list').scrollBy({ left: 350, behavior: 'smooth' })}
                      className="absolute right-0 inset-y-0 z-30 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/80 border-l border-gray-800/50 cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Row 4: Trending Now */}
              <div className="px-4 md:px-12 mt-10 relative z-20">
                <h3 className="text-lg md:text-xl font-bold mb-4 tracking-wide text-white flex items-center gap-2">
                  <span>Trending Now</span>
                  <span className="text-xs text-gray-500 font-normal">Popular globally</span>
                </h3>
                
                <div className="relative group/row">
                  <button 
                    onClick={() => document.getElementById('carousel-trending').scrollBy({ left: -350, behavior: 'smooth' })}
                    className="absolute left-0 inset-y-0 z-30 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/80 border-r border-gray-800/50 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>

                  <div id="carousel-trending" className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2">
                    {filteredTrending.map((movie, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedMovie(movie)}
                        className="flex-none w-36 sm:w-44 md:w-52 transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-20 hover:shadow-2xl cursor-pointer relative rounded-md overflow-hidden bg-[#181818] border border-gray-800/80 group"
                      >
                        <div className="relative aspect-[2/3] w-full">
                          <img src={movie.poster_url} alt={movie.tmdb_title || movie.title} className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-85" loading="lazy" />
                        </div>
                        <div className="p-3 bg-[#181818]">
                          <h4 className="text-xs font-semibold text-white truncate mb-1">{movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}</h4>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-green-500 font-semibold">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'N/A'}</span>
                            <span className="text-gray-400 font-light">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => document.getElementById('carousel-trending').scrollBy({ left: 350, behavior: 'smooth' })}
                    className="absolute right-0 inset-y-0 z-30 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition duration-300 flex items-center justify-center hover:bg-black/80 border-l border-gray-800/50 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* C. SERIES TAB */}
          {activeTab === 'series' && !isSearchActive && (
            <div className="px-4 md:px-12 pt-28 min-h-[70vh] animate-fade-in">
              <h2 className="text-xl md:text-3xl font-bold mb-8">Popular TV Series</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredSeries.map((series, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedMovie(series)}
                    className="transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-10 hover:shadow-2xl cursor-pointer rounded-md overflow-hidden bg-[#181818] border border-gray-800/80 group"
                  >
                    <div className="relative aspect-[2/3] w-full">
                      <img src={series.poster_url} alt={series.tmdb_title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 bg-[#181818]">
                      <h4 className="text-xs font-semibold text-white truncate mb-1">{series.tmdb_title}</h4>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-green-500 font-semibold">{series.rating} / 10</span>
                        <span className="text-gray-400 font-light">{new Date(series.release_date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D. MOVIES TAB */}
          {activeTab === 'movies' && !isSearchActive && (
            <div className="px-4 md:px-12 pt-28 min-h-[70vh] animate-fade-in">
              <h2 className="text-xl md:text-3xl font-bold mb-8">Personalized Movies for You</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredRecommendations.map((movie, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedMovie(movie)}
                    className="transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-10 hover:shadow-2xl cursor-pointer rounded-md overflow-hidden bg-[#181818] border border-gray-800/80 group"
                  >
                    <div className="relative aspect-[2/3] w-full">
                      {movie.poster_url ? (
                        <img src={movie.poster_url} alt={movie.tmdb_title || movie.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#202020] flex items-center justify-center p-4 text-center text-xs text-gray-500">{movie.title}</div>
                      )}
                    </div>
                    <div className="p-3 bg-[#181818]">
                      <h4 className="text-xs font-semibold text-white truncate mb-1">{movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}</h4>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-green-500 font-semibold">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'N/A'}</span>
                        <span className="text-gray-400 font-light">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. MY LIST TAB */}
          {activeTab === 'mylist' && !isSearchActive && (
            <div className="px-4 md:px-12 pt-28 min-h-[70vh] animate-fade-in">
              <h2 className="text-xl md:text-3xl font-bold mb-8">My List</h2>
              
              {filteredMyList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                  <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-lg">Your list is empty.</p>
                  <p className="text-sm mt-1">Explore titles and click "+ My List" to save movies here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {filteredMyList.map((movie, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedMovie(movie)}
                      className="transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:z-10 hover:shadow-2xl cursor-pointer rounded-md overflow-hidden bg-[#181818] border border-gray-800/80 group relative"
                    >
                      <div className="relative aspect-[2/3] w-full">
                        <img src={movie.poster_url} alt={movie.tmdb_title || movie.title} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => toggleMyList(movie, e)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 border border-gray-700 text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-95 transition z-20 cursor-pointer"
                          title="Remove from My List"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="p-3 bg-[#181818]">
                        <h4 className="text-xs font-semibold text-white truncate mb-1">{movie.tmdb_title || movie.title.replace(/\s*\(\d{4}\)$/, '')}</h4>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-green-500 font-semibold">{movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : 'N/A'}</span>
                          <span className="text-gray-400 font-light">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 4. Movie Detail Modal overlay */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm transition duration-300">
          <div className="relative w-full max-w-3xl bg-[#181818] rounded-xl overflow-hidden border border-gray-800 shadow-2xl animate-fade-in my-8">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            {/* Backdrop visual */}
            <div className="relative h-48 sm:h-72 w-full">
              {selectedMovie.backdrop_url ? (
                <img 
                  src={selectedMovie.backdrop_url} 
                  alt={selectedMovie.tmdb_title || selectedMovie.title} 
                  className="w-full h-full object-cover brightness-[0.7]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-850 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                  </svg>
                </div>
              )}
              {/* Bottom backdrop fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
            </div>

            {/* Movie details */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
              
              {/* Left poster */}
              <div className="w-28 sm:w-36 flex-shrink-0 mx-auto md:mx-0 -mt-20 md:-mt-24 relative z-10 rounded-md overflow-hidden border-2 border-gray-800 shadow-xl bg-[#202020]">
                {selectedMovie.poster_url ? (
                  <img 
                    src={selectedMovie.poster_url} 
                    alt={selectedMovie.tmdb_title || selectedMovie.title} 
                    className="w-full aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] flex items-center justify-center p-3 text-center text-xs text-gray-500 italic">
                    No Poster
                  </div>
                )}
              </div>

              {/* Right text details */}
              <div className="flex-grow">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                  {selectedMovie.tmdb_title || selectedMovie.title.replace(/\s*\(\d{4}\)$/, '')}
                </h3>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3.5 text-xs text-gray-400 mb-4">
                  {selectedMovie.rating > 0 && (
                    <span className="text-green-500 font-semibold flex items-center gap-0.5">
                      <svg className="w-3.5 h-3.5 text-green-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                      </svg>
                      {selectedMovie.rating.toFixed(1)} / 10
                    </span>
                  )}
                  {selectedMovie.release_date && (
                    <span className="text-gray-300 font-light">
                      Released: {new Date(selectedMovie.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                  <span className="text-gray-500 border border-gray-700 px-1 py-0.2 rounded text-[10px]">HD</span>
                </div>

                {/* Genre chips */}
                {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedMovie.genres.map((genre, index) => (
                      <span key={index} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs font-light">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview/Plot */}
                <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  {selectedMovie.overview}
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => { alert('Starting movie playback demo...'); setSelectedMovie(null); }}
                    className="bg-[#E50914] hover:bg-[#b80710] text-white px-5 py-2 rounded text-xs font-semibold transition active:scale-95 cursor-pointer shadow"
                  >
                    Play Movie
                  </button>
                  <button 
                    onClick={(e) => toggleMyList(selectedMovie, e)}
                    className="bg-gray-800 hover:bg-gray-750 text-white px-4 py-2 rounded text-xs font-semibold border border-gray-700 transition active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    {myList.some(item => item.title === selectedMovie.title) ? (
                      <>
                        <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Added
                      </>
                    ) : (
                      '+ My List'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
