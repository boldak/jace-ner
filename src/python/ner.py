#!/usr/bin/python

import sys, os, json

from mitie import *
from collections import defaultdict
# from langdetect import detect

MITIE_MODELS_PATH = "./MITIE-models/"
MITIE_MODEL_FILE_SUFFIX = "_model.dat"

if __name__=='__main__':
#     sys.stdin.reconfigure(encoding='utf-8')
#     sys.stdout.reconfigure(encoding='utf-8')
    lang = sys.argv[1]
    model_name = MITIE_MODELS_PATH + lang + MITIE_MODEL_FILE_SUFFIX
    ner = named_entity_extractor(model_name)
    input_json = None
    for line in sys.stdin:
        input_json = json.loads(line)
        method = input_json['method']
        text = input_json['text']
        output = None
        text = to_bytes(text)
        if method == 'tokenize':
            output = tokenize(text)
            output = [str(x.decode('UTF-8')) for x in output]
        elif method == 'tokenize_with_offsets':
            output = tokenize_with_offsets(text)
            output = [(str(x.decode('UTF-8')), y) for (x, y) in output]
        elif method == 'get_possible_ner_tags':
            output = ner.get_possible_ner_tags()
        elif method == 'extract_entities':
            output = ner.extract_entities(tokenize(text))
        elif method == 'extract_entities_pretty':
            output = ''
            tokens = tokenize(text)
            entities = ner.extract_entities(tokens)
            for e in entities:
                range = e[0]
                tag = e[1]
                score = e[2]
                score_text = "{:0.3f}".format(score)
                entity_text = " ".join(tokens[i].decode() for i in range)
                # change output to json. that's allow \n usage.
                output += "Score=" + score_text + ", tag=" + tag + ", entity=" + entity_text + ", range=(" + str(min(range)) + ", " + str(max(range)) + ")\t"
        print(output)
