from sklearn.ensemble import AdaBoostClassifier
from xgboost import XGBClassifier

def xgboost(df,columns,target,**kwargs):
    df_ = df.copy()
    xgb = XGBClassifier(**kwargs)
    xgb.fit(df_[columns],df_[target])
    df_["prediction"] = xgb.predict(df_[columns])
    return df_,xgb

def adaboost(df,columns,target,**kwargs):
    df_ = df.copy()
    ada = AdaBoostClassifier(**kwargs)
    ada.fit(df_[columns],df_[target])
    df_["prediction"] = ada.predict(df_[columns])
    return df_,ada