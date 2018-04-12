#!/usr/bin/env python
# Name: Mercylyn Wiemer
# Student number: 10749306
# Date: 13-04-2018
#
# Data processing: scraping IMDB
# This program scrapes/acquires data using BeautifulSoup (python web mining module).
# The source of the data: IMDB TV series (see TARGET_URL): top 50 TV Series.
# The data includes: TV title, rating, genres, actors, and runtime.
#
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    tvseries = []
    tv_shows = dom.find_all("div", {"class": "lister-item-content"})

    # acquire data of IMDB page and store in list
    for tv_show in tv_shows:
        show = []
        title = tv_show.find("a").string
        rating = tv_show.find("div", {"class": "inline-block ratings-imdb-rating"}).strong.string
        genres = tv_show.find("span", {"class": "genre"}).string.strip()
        actors = tv_show.select("p")[2].text.strip("Stars: \n").replace("\n", "")
        runtime = tv_show.find("span", {"class": "runtime"}).string.strip(" min")
        show.append(title)
        show.append(rating)
        show.append(genres)
        show.append(actors)
        show.append(runtime)
        tvseries.append(show)

    return tvseries


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write tv-series to csv file
    for show in tvseries:
        writer.writerow(show)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
