import os
import json
import numpy as np
import tensorflow as tf
import tensorflow_recommenders as tfrs
import tensorflow_datasets as tfds

# Force Keras 2 engine
os.environ["TF_USE_LEGACY_KERAS"] = "1"

print("1. Loading MovieLens 100k Dataset...")
ratings = tfds.load("movielens/100k-ratings", split="train")
movies = tfds.load("movielens/100k-movies", split="train")

# Select inputs including user demographics
ratings_mapped = ratings.map(lambda x: {
    "movie_title": x["movie_title"],
    "user_id": x["user_id"],
    "user_rating": x["user_rating"],
    "raw_user_age": x["raw_user_age"],
    "user_gender": x["user_gender"],
    "user_occupation_text": x["user_occupation_text"]
})
movies = movies.map(lambda x: x["movie_title"])

# Vocabularies
user_ids_vocabulary = np.unique(np.concatenate(list(ratings_mapped.batch(1000).map(lambda x: x["user_id"]))))
movie_titles_vocabulary = np.unique(np.concatenate(list(movies.batch(1000))))
occupations = np.unique(np.concatenate(list(ratings_mapped.batch(1000).map(lambda x: x["user_occupation_text"]))))

# 2. Extract demographics database for runtime lookup on backend
print("2. Extracting user demographics JSON database...")
user_demographics = {}
for x in ratings_mapped.batch(10000):
    uids = x["user_id"].numpy()
    ages = x["raw_user_age"].numpy()
    genders = x["user_gender"].numpy()
    occs = x["user_occupation_text"].numpy()
    
    for i in range(len(uids)):
        uid_str = uids[i].decode("utf-8")
        if uid_str not in user_demographics:
            user_demographics[uid_str] = {
                "raw_user_age": float(ages[i]),
                "user_gender": bool(genders[i]),
                "user_occupation_text": occs[i].decode("utf-8")
            }

with open("user_demographics.json", "w") as f:
    json.dump(user_demographics, f, indent=2)
print("User demographics saved to user_demographics.json successfully!")

# 3. Ranking Model definition
class RankingModel(tf.keras.Model):
    def __init__(self):
        super().__init__()
        embedding_dimension = 32

        # User Tower Embeddings
        self.user_id_embeddings = tf.keras.Sequential([
            tf.keras.layers.StringLookup(vocabulary=user_ids_vocabulary, mask_token=None),
            tf.keras.layers.Embedding(len(user_ids_vocabulary) + 1, embedding_dimension)
        ])
        
        self.gender_embeddings = tf.keras.Sequential([
            tf.keras.layers.StringLookup(vocabulary=["true", "false", "True", "False", "1", "0"], mask_token=None),
            tf.keras.layers.Embedding(7, 8)
        ])

        self.occupation_embeddings = tf.keras.Sequential([
            tf.keras.layers.StringLookup(vocabulary=occupations, mask_token=None),
            tf.keras.layers.Embedding(len(occupations) + 1, 8)
        ])

        # Movie Tower Embeddings
        self.movie_embeddings = tf.keras.Sequential([
            tf.keras.layers.StringLookup(vocabulary=movie_titles_vocabulary, mask_token=None),
            tf.keras.layers.Embedding(len(movie_titles_vocabulary) + 1, embedding_dimension)
        ])

        # MLP layer
        self.ratings = tf.keras.Sequential([
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dense(1)
        ])

    def call(self, inputs):
        user_id, raw_user_age, user_gender, user_occupation_text, movie_title = inputs
        
        user_id_emb = self.user_id_embeddings(user_id)
        
        gender_str = tf.strings.as_string(user_gender)
        gender_emb = self.gender_embeddings(gender_str)
        
        occupation_emb = self.occupation_embeddings(user_occupation_text)
        
        age_feature = tf.reshape(tf.cast(raw_user_age, tf.float32) / 100.0, [-1, 1])
        
        user_representation = tf.concat([user_id_emb, gender_emb, occupation_emb, age_feature], axis=1)
        movie_representation = self.movie_embeddings(movie_title)
        
        concatenated = tf.concat([user_representation, movie_representation], axis=1)
        return self.ratings(concatenated)

# Assemble TFRS Model wrapper
class MovieLensRankingModel(tfrs.models.Model):
    def __init__(self):
        super().__init__()
        self.ranking_model = RankingModel()
        self.task = tfrs.tasks.Ranking(
            loss=tf.keras.losses.MeanSquaredError(),
            metrics=[tf.keras.metrics.RootMeanSquaredError()]
        )

    def call(self, features):
        return self.ranking_model((
            features["user_id"],
            features["raw_user_age"],
            features["user_gender"],
            features["user_occupation_text"],
            features["movie_title"]
        ))

    def compute_loss(self, features, training=False):
        labels = features.pop("user_rating")
        rating_predictions = self(features)
        return self.task(labels=labels, predictions=rating_predictions)

# 4. Train the Model
tf.random.set_seed(42)
shuffled = ratings_mapped.shuffle(100_000, seed=42, reshuffle_each_iteration=False)

train = shuffled.take(80_000).batch(8192).cache()
test = shuffled.skip(80_000).take(20_000).batch(8192).cache()

model = MovieLensRankingModel()
model.compile(optimizer=tf.keras.optimizers.Adagrad(learning_rate=0.1))

print("3. Starting training of Demographic-enriched Stage-2 Model...")
model.fit(train, epochs=5)

print("\n4. Evaluating on unseen test data...")
results = model.evaluate(test, return_dict=True)
print(f"Final RMSE with Demographics: {results['root_mean_squared_error']:.4f}")

# 5. Export saved model
class InferenceModel(tf.Module):
    def __init__(self, ranking_model):
        self.ranking_model = ranking_model

    @tf.function(input_signature=[
        tf.TensorSpec(shape=[None], dtype=tf.string, name="user_id"),
        tf.TensorSpec(shape=[None], dtype=tf.float32, name="raw_user_age"),
        tf.TensorSpec(shape=[None], dtype=tf.bool, name="user_gender"),
        tf.TensorSpec(shape=[None], dtype=tf.string, name="user_occupation_text"),
        tf.TensorSpec(shape=[None], dtype=tf.string, name="movie_title")
    ])
    def __call__(self, user_id, raw_user_age, user_gender, user_occupation_text, movie_title):
        return self.ranking_model((user_id, raw_user_age, user_gender, user_occupation_text, movie_title))

inference_model = InferenceModel(model.ranking_model)
export_path = "./saved_ranking_model"
tf.saved_model.save(inference_model, export_path)
print(f"Success! Enriched ranking model exported to {export_path}")
