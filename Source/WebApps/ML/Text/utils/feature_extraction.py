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

def hf_automodel_vectorizer(texts,model,tokenizer,device,batch_size=16,**kwargs):
    result = []
    for i in range(0,len(texts),batch_size):
        batch = texts[i:i+batch_size]
        tokenized = tokenizer(batch,return_tensors="pt",padding=True,truncation=True,max_length=512,**kwargs)
        tokenized = tokenized.to(device)
        embedding = model(**tokenized)[0].detach().cpu().numpy()
        result.extend(embedding[:,0].tolist())
    return result