# Name: Mercylyn Wiemer
# Course: Data Processing
# Date: 28-04-2018
#
# This program converts data in csv format into JSON format.

import csv
import json

# convert data from csv format to json format
with open('waste_amsterdam.csv', 'r') as csvfile, open('waste_amsterdam.json', 'w') as jsonfile:
    fieldnames = ("year", "quantity")
    reader = csv.DictReader(csvfile, fieldnames)
    dataset = {"data": [row for row in reader]}
    json.dump(dataset, jsonfile)
