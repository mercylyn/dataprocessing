# Name: Mercylyn Wiemer

import csv
import json

with open('waste_amsterdam.csv', 'r') as csvfile, open('waste_amsterdam.json', 'w') as jsonfile:
    fieldnames = ("year", "quantity")
    reader = csv.DictReader(csvfile, fieldnames)
    dataset = {"data": [row for row in reader]}
    json.dump(dataset, jsonfile)
