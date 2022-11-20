from sklearn.decomposition import PCA

def pca(df,columns,n_components):
    df_ = df.copy()
    pca = PCA(n_components=n_components)
    df_[columns] = pca.fit_transform(df_[columns])
    return df_,pca