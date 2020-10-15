import sys, os, json

from langdetect import detect

SUPPORTED_LANGUAGES = ["en", "ru", "uk"]

if __name__ == '__main__':
    sys.stdin.reconfigure(encoding='utf-8')
    sys.stdout.reconfigure(encoding='utf-8')
    for line in sys.stdin:
        input_text = json.loads(line)['text']
        if input_text in SUPPORTED_LANGUAGES:
            lang = input_text
        else:
            lang = detect(input_text)
        print(lang)
