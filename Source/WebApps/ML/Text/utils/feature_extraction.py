from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

def count_vectorize(texts,**kwargs):
    vectorizer = CountVectorizer(**kwargs)
    vectorizer.fit(texts)
    vector = vectorizer.transform(texts)
    return vector,vectorizer

def tfidf_vectorize(texts,**kwargs):
    vectorizer = TfidfVectorizer(**kwargs)
    vectorizer.fit(texts)
    vector = vectorizer.transform(texts)
    return vector,vectorizer

def hf_automodel_vectorizer(texts,model,tokenizer,device,**kwargs):
    tokenized = tokenizer(texts,return_tensors="pt",padding=True,truncation=True,**kwargs)
    tokenized = tokenized.to(device)
    embedding = model(**tokenized)[0].detach().cpu().numpy()
    return embedding[:,0]