from fastapi import FastAPI
from pydantic import BaseModel

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn_extra.cluster import KMedoids
from sklearn.preprocessing import LabelEncoder

from xgboost import XGBClassifier

class TextClusterDataset(BaseModel):
    text: list
    n_clusters: int

class TextReccomendationDataset(BaseModel):
    annotated_text : list
    annotated_labels : list
    text_to_reccomend : list

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Welcome to the Text Clustering and Reccomendation API"}

@app.post("/text-clustering")
async def text_clustering(dataset: TextClusterDataset):
    try:
        texts = dataset.text
        tfidf = TfidfVectorizer()
        vector = tfidf.fit_transform(texts)
    except Exception as e:
        return {"message": "Error while vectorizing the text", "error": str(e)}
    n_clusters = dataset.n_clusters
    try:
        kmedoids = KMedoids(n_clusters=n_clusters, random_state=0, metric='cosine').fit(vector)
    except Exception as e:
        return {"message": "Error while clustering the text", "error": str(e)}
    labels = kmedoids.labels_
    return {"labels": labels.tolist()}

@app.post("/text-reccomendation-lite")
async def text_reccomendation_lite(dataset : TextReccomendationDataset):
    try:
        texts = dataset.annotated_text + dataset.text_to_reccomend
        tfidf = TfidfVectorizer()
        tfidf.fit(texts)
        vector = tfidf.transform(dataset.annotated_text)
        vector_to_reccomend = tfidf.transform(dataset.text_to_reccomend)
    except Exception as e:
        return {"message": "Error while vectorizing the text", "error": str(e)}
    le = LabelEncoder()
    labels = le.fit_transform(dataset.annotated_labels)
    try:
        xgb = XGBClassifier()
        xgb.fit(vector, labels)
    except Exception as e:
        return {"message": "Error while training the model", "error": str(e)}
    labels_to_reccomend = xgb.predict(vector_to_reccomend)
    labels_to_reccomend = le.inverse_transform(labels_to_reccomend)
    return {"labels": labels_to_reccomend.tolist()}