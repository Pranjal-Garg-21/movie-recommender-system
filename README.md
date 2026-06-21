# 🎬 MovieLens Recommender System

Welcome to my Recommendation System repository! This project implements a robust **Two-Tower Neural Retrieval Model** using deep learning and embeddings to serve personalized movie recommendations.

## 🚀 Highlights & Key Achievements
- **Deep Learning Architecture:** Designed and trained a two-tower retrieval algorithm that maps both users and items (movies) into a shared high-dimensional vector space.
- **State-of-the-art Libraries:** Utilized the specialized **TensorFlow Recommenders (TFRS)** library for efficient item retrieval and Top-K similarity evaluations.
- **Production-Ready Export:** Built a fast `BruteForce` scalable index that queries 100K+ interactions and outputs the closest user-item embeddings, saving the finalized model artifacts (`saved_recommender_model/`) for immediate web-server integration.

## 🛠 Tech Stack
- **Frameworks:** TensorFlow Core, TensorFlow Recommenders (TFRS), Keras
- **Data Engineering:** TensorFlow Datasets (`movielens/100k`), NumPy
- **Analysis & Visualization:** Scikit-Learn (PCA for Embedding Projection), Matplotlib
- **Environment:** Jupyter Notebook, Python 3.12

## 🧠 How It Works (The Architecture)
Instead of traditional collaborative filtering, this model utilizes a neural network-based **Two-Tower Architecture**:
1. **User Tower:** Takes raw `user_id`s, passes them through a StringLookup layer, and maps them to dense mathematical vector embeddings representing user preferences.
2. **Movie Tower:** Transforms text-based `movie_title`s into its own dense vector embeddings.
3. **Retrieval Task:** Measures the distance/similarity between both embeddings to output a high-confidence recommendation score.

## 📊 Dataset
Trained and evaluated on the widely recognized **MovieLens 100K dataset**.
- Included 100,000 ratings from real users across 1,600+ movies.
- Evaluated general metrics such as Top-100 categorical accuracy on unseen test data segments.

## 📁 Repository Structure
```text
├── recommender_model.ipynb     # The core notebook: data pipelines, training, PCA viz, and evaluation
├── saved_recommender_model/    # Serialized export of the trained model (ready for deployment)
├── env/                        # Virtual environment folder
└── README.md                   # Project documentation
```

## 💻 Getting Started
1. Clone the repository and navigate to the directory.
2. Ensure you have the required dependencies (found in the first few notebook cells): 
   `pip install tensorflow tensorflow-recommenders tensorflow-datasets scikit-learn matplotlib`
3. Open `recommender_model.ipynb` to step through the data ingestion, training pipelines, and evaluation.
4. To test deployed predictions instantly, you can load the `saved_recommender_model` directory using `tf.saved_model.load()` without retraining.
