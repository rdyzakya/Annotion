import string
import regex as re
punctuation = string.punctuation


# uncase, remove mentions, remove links, remove tanda baca?
def clean_a_text(txt_to_clean):
    txt_to_clean = rm_mentions_and_links(txt_to_clean)
    txt_to_clean = uncase(txt_to_clean)
    txt_to_clean = rm_punct(txt_to_clean)
    return txt_to_clean

def uncase(txt_to_clean):
    return txt_to_clean.lower()

def rm_mentions_and_links(txt_to_clean):
    return re.sub(r"(?:\@|https?\://)\S+", "", txt_to_clean)

def rm_punct(txt_to_clean):
    return txt_to_clean.translate(str.maketrans('', '', punctuation))