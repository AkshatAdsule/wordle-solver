#! /usr/bin/env python3

import datetime
import requests as r

base_url = "https://www.nytimes.com/svc/wordle/v2/"

curr_date = datetime.datetime.now().date()

n_days = 0

words_file = open("words.js", "w")
words_file.write("const WORDS = [\n")

while True:
    word_url = base_url + f"{curr_date.year}-{str(curr_date.month).zfill(2)}-{str(curr_date.day).zfill(2)}" + ".json"
    res = r.get(word_url)
    if res.status_code != 200:
        words_file.write("];")
        words_file.close()
        break
    word = res.json()["solution"]
    words_file.write(f'\t"{word}",\n')
    n_days += 1
    curr_date += datetime.timedelta(days=1);
