from sklearn.feature_selection import SelectKBest, SelectFromModel, chi2
from sklearn.svm import LinearSVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import ExtraTreesClassifier

available_model = ["linear_svc","logistic_regression","extra_trees_classifier"]

def get_estimator(estimator,**kwargs):
    if estimator == "linear_svc":
        return LinearSVC(penalty="l1",dual=False,**kwargs)
    elif estimator == "logistic_regression":
        return LogisticRegression(penalty="l1",solver="liblinear",**kwargs)
    elif estimator == "extra_trees_classifier":
        return ExtraTreesClassifier(**kwargs)
    else:
        raise ValueError("estimator not available, please choose from {}".format(available_model))

def select_k_best(df,columns,target,k):
    df_ = df.copy()
    selector = SelectKBest(chi2,k=k)
    selector.fit(df_[columns],df_[target])
    df_ = df_[columns].iloc[:,selector.get_support()]
    return df_,selector

def select_from_model(df,columns,target,estimator="linear_svc"):
    estimator = get_estimator(estimator)
    df_ = df.copy()
    selector = SelectFromModel(estimator)
    selector.fit(df_[columns],df_[target])
    df_new = df_[columns].iloc[:,selector.get_support()]
    return df_new,selector