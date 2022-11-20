from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn_extra.cluster import KMedoids

def kmedoids(df,columns,n_clusters,**kwargs):
    df_ = df.copy()
    kmedoids = KMedoids(n_clusters=n_clusters,**kwargs)
    df_["cluster"] = kmedoids.fit_predict(df_[columns])
    return df_,kmedoids

def kmeans(df,columns,n_clusters,**kwargs):
    df_ = df.copy()
    kmeans = KMeans(n_clusters=n_clusters,**kwargs)
    df_["cluster"] = kmeans.fit_predict(df_[columns])
    return df_,kmeans

def agglo_cluster(df,columns,n_clusters,**kwargs):
    df_ = df.copy()
    agglo = AgglomerativeClustering(n_clusters=n_clusters,**kwargs)
    df_["cluster"] = agglo.fit_predict(df_[columns])
    return df_,agglo