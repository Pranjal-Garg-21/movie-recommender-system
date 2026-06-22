import os
import numpy as np
import tensorflow as tf
import tensorflow_recommenders as tfrs
import tensorflow_datasets as tfds

# Force Keras 2 engine
os.environ["TF_USE_LEGACY_KERAS"] = "1"

# 1. Ingest datasets
print("Loading MovieLens 100k Dataset...")
ratings = tfds.load("movielens/100k-ratings", split="train")
movies = tfds.load("movielens/100k-movies", split="train")

# Select inputs
ratings = ratings.map(lambda x: {
    "movie_title": x["movie_title"],
    "user_id": x["user_id"],
    "user_rating": x["user_rating"]
})
movies = movies.map(lambda x: x["movie_title"])

# Vocabularies
user_ids_vocabulary = np.unique(np.concatenate(list(ratings.batch(1000).map(lambda x: x["user_id"]))))
movie_titles_vocabulary = np.unique(np.concatenate(list(movies.batch(1000))))

# 2. Ranking Model definition
class RankingModel(tf.keras.Model):
    def __init__(self):
        super().__init__()
        embedding_dimension = 32

        # User Tower
        self.user_embeddings = tf.keras.Sequential([
            tf.keras.layers.StringLookup(vocabulary=user_ids_vocabulary, mask_token=None),
            tf.keras.layers.Embedding(len(user_ids_vocabulary) + 1, embedding_dimension)
        ])

        # Movie Tower
        self.movie_embeddings = tf.keras.Sequential([
            tf.keras.layers.StringLookup(vocabulary=movie_titles_vocabulary, mask_token=None),
            tf.keras.layers.Embedding(len(movie_titles_vocabulary) + 1, embedding_dimension)
        ])

        # MLP to predict ratings
        self.ratings = tf.keras.Sequential([
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dense(1)
        ])

    def call(self, inputs):
        user_id, movie_title = inputs
        user_embedding = self.user_embeddings(user_id)
        movie_embedding = self.movie_embeddings(movie_title)
        
        # Concatenate user and movie embeddings
        concatenated = tf.concat([user_embedding, movie_embedding], axis=1)
        return self.ratings(concatenated)

# 3. Assemble and Compile the TFRS Model
class MovieLensRankingModel(tfrs.models.Model):
    def __init__(self):
        super().__init__()
        self.ranking_model = RankingModel()
        self.task = tfrs.tasks.Ranking(
            loss=tf.keras.losses.MeanSquaredError(),
            metrics=[tf.keras.metrics.RootMeanSquaredError()]
        )

    def call(self, features):
        return self.ranking_model((features["user_id"], features["movie_title"]))

    def compute_loss(self, features, training=False):
        labels = features.pop("user_rating")
        rating_predictions = self(features)
        return self.task(labels=labels, predictions=rating_predictions)

# 4. Train the Model
tf.random.set_seed(42)
shuffled = ratings.shuffle(100_000, seed=42, reshuffle_each_iteration=False)

train = shuffled.take(80_000).batch(8192).cache()
test = shuffled.skip(80_000).take(20_000).batch(8192).cache()

model = MovieLensRankingModel()
model.compile(optimizer=tf.keras.optimizers.Adagrad(learning_rate=0.1))

print("Starting training of Stage-2 Ranking Model...")
model.fit(train, epochs=5)

print("\nEvaluating on unseen test data...")
results = model.evaluate(test, return_dict=True)
print(f"\nFinal RMSE: {results['root_mean_squared_error']:.4f}")

# 5. Export inference signature to disk
class InferenceModel(tf.Module):
    def __init__(self, ranking_model):
        self.ranking_model = ranking_model

    @tf.function(input_signature=[
        tf.TensorSpec(shape=[None], dtype=tf.string, name="user_id"),
        tf.TensorSpec(shape=[None], dtype=tf.string, name="movie_title")
    ])
    def __call__(self, user_id, movie_title):
        return self.ranking_model((user_id, movie_title))

inference_model = InferenceModel(model.ranking_model)
export_path = "./saved_ranking_model"
tf.saved_model.save(inference_model, export_path)
print(f"\nSuccess! Your ranking model has been exported to: {export_path}")
