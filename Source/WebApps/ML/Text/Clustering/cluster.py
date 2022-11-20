from sklearn.cluster import AgglomerativeClustering
from sklearn_extra.cluster import KMedoids

def kmedoids(vectors,n_clusters,**kwargs):
    kmedoids = KMedoids(n_clusters=n_clusters,metric="cosine",**kwargs)
    clusters = kmedoids.fit_predict(vectors)
    return clusters,kmedoids

def agglo_cluster(vectors,n_clusters,**kwargs):
    agglo = AgglomerativeClustering(n_clusters=n_clusters,linkage="average",affinity="cosine")
    clusters = agglo.fit_predict(vectors)
    return clusters,agglo