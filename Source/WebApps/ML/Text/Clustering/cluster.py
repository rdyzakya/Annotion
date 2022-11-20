from sklearn.cluster import AgglomerativeClustering
from sklearn_extra.cluster import KMedoids

def kmedoids(df,columns,n_clusters,**kwargs):
    df_ = df.copy()
    kmedoids = KMedoids(n_clusters=n_clusters,metric="cosine",**kwargs)
    df_["cluster"] = kmedoids.fit_predict(df_[columns])
    return df_,kmedoids

def agglo_cluster(df,columns,n_clusters,**kwargs):
    df_ = df.copy()
    agglo = AgglomerativeClustering(n_clusters=n_clusters,linkage="average",affinity="cosine",**kwargs)
    df_["cluster"] = agglo.fit_predict(df_[columns])
    return df_,agglo