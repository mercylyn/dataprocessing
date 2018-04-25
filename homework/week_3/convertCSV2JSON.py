# Name: Mercylyn Wiemer
# source: https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83452NED/table?dl=8BED

import csv
import json

with open('waste_amsterdam.csv', 'r') as csvfile, open('waste_amsterdam.json', 'w') as jsonfile:
    reader = csv.reader(csvfile)
    writer = csv.writer(jsonfile)
    waste_dict = {rows[0]:rows[1] for rows in reader}
    dataset = {"data" : waste_dict}
    json.dump(dataset, jsonfile)

# csvfile = open('waste_amsterdam.csv', 'r')
# jsonfile = open('waste_amsterdam.json', 'w')
#
# fieldnames = ("Year", "Quantity")
# reader = csv.DictReader(csvfile, fieldnames)
#
# for row in reader:
#     json.dump(row, jsonfile)
#     jsonfile.write('\n')
