from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import pandas as pd

def encode_categorical(df,columns):
    df_ = df.copy()
    label_encoders = {}
    if columns == "all_categorical":
        columns = df_.select_dtypes(include=['object']).columns
        for column in columns:
            label_encoders[column] = LabelEncoder()
            df_[column] = label_encoders[column].fit_transform(df_[column])
    elif isinstance(columns,list):
        for column in columns:
            label_encoders[column] = LabelEncoder()
            df_[column] = label_encoders[column].fit_transform(df_[column])
    else:
        raise ValueError("columns must be a list or 'all_categorical'")
    return df_,label_encoders

def one_hot_encode(df,columns):
    df_ = df.copy()
    if columns == "all_categorical":
        columns = df_.select_dtypes(include=['object']).columns
        df_ = pd.get_dummies(df_,columns=columns)
    elif isinstance(columns,list):
        df_ = pd.get_dummies(df_,columns=columns)
    else:
        raise ValueError("columns must be a list or 'all_categorical'")
    return df_

def normalize(df,columns,option="standard"):
    df_ = df.copy()
    if option == "standard":
        scaler = StandardScaler()
    elif option == "minmax":
        scaler = MinMaxScaler()
    else:
        raise ValueError("option must be 'standard' or 'minmax'")
    if columns == "all":
        columns = df_.columns
        df_[columns] = scaler.fit_transform(df_[columns])
    elif isinstance(columns,list):
        df_[columns] = scaler.fit_transform(df_[columns])
    else:
        raise ValueError("columns must be a list or 'all'")
    
    return df_,scaler

def fillna(df,columns,option="mean"):
    df_ = df.copy()
    if option == "mean":
        for column in columns:
            df_[column] = df_[column].fillna(df_[column].mean())
    elif option == "median":
        for column in columns:
            df_[column] = df_[column].fillna(df_[column].median())
    elif option == "mode":
        for column in columns:
            df_[column] = df_[column].fillna(df_[column].mode()[0])
    elif option == "ffill":
        df_ = df_.fillna(method='ffill')
    elif option == "bfill":
        df_ = df_.fillna(method='bfill')
    elif option == "pad":
        df_ = df_.fillna(method='pad')
    else:
        raise ValueError("option must be 'mean', 'median' or 'mode'")
    return df_