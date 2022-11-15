import pandas as pd

def read_data(path,sep=','):
    df = pd.read_csv(path,sep=sep)
    return df