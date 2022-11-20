from sklearn.ensemble import AdaBoostClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier

def xgboost(train_vectors,prediction_vectors,target,**kwargs):
    xgb = XGBClassifier(**kwargs)
    xgb.fit(train_vectors,target)
    predictions = xgb.predict(prediction_vectors)
    return predictions,xgb

def adaboost(train_vectors,prediction_vectors,target,**kwargs):
    ada = AdaBoostClassifier(**kwargs)
    ada.fit(train_vectors,target)
    predictions = ada.predict(prediction_vectors)
    return predictions,ada

def svm_classifier(train_vectors,prediction_vectors,target,**kwargs):
    svm = SVC(**kwargs)
    svm.fit(train_vectors,target)
    predictions = svm.predict(prediction_vectors)
    return predictions,svm