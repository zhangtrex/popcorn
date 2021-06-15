import mysql.connector
import pandas as pd
import os


## Settings for how many movies we want to add to DB from IMDB tsv file
maxMovies = 50000
numMovies = 0

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="whatIsLife42?",
    database="popcorn"
)

mycursor = mydb.cursor()

# IMDB rows
rows = pd.read_csv(os.path.join(".", "imdb_movies_to_db", "title.basics.tsv", "data.tsv"), sep="\t",
                   usecols=["titleType", "primaryTitle", "genres"]).values


# Maps to aid inserting into multiple tables
genres = {}
movies = {}
genreToInsert = []
movieToInsert = []


# Add to Genres table and movie table
for row in rows:
    if row[0] == "movie" and numMovies < maxMovies:
        if row[1] != "\\N" and row[2] != "\\N":
            numMovies = numMovies + 1
            movies[row[1]] = {"genres": row[2].split(","), "mid": -1}
            movieToInsert.append((row[1], ))
            for genre in movies[row[1]]["genres"]:
                if genre not in genres and genre != "\\N":
                    genres[genre] = -1
                    genreToInsert.append((genre, ))
    elif numMovies >= maxMovies:
        break

# Execute queries we constructed
mycursor.executemany(
    "INSERT IGNORE INTO Genre(genre) VALUES (%s)", genreToInsert)
mycursor.executemany(
    "INSERT IGNORE INTO Movie(name) VALUES (%s)", movieToInsert)
mydb.commit()


# Get Genres with their ids
mycursor.execute("SELECT genre, gid FROM Genre")
genreResults = mycursor.fetchall()

# Get Movie with their ids
mycursor.execute("SELECT name, mid FROM Movie")
movieResults = mycursor.fetchall()

# Create suitable maps to used to generate parameters to insert into MovieGenre table

for genre, gid in genreResults:
    genres[genre] = gid


for name, mid in movieResults:
    movies[name]["mid"] = mid
    movies[name]["genres"] = [genres[x] for x in movies[name]["genres"]]

movieGenreToInsert = []

# Insert into MovieGenre table
for name, movie in movies.items():
    for gid in movie["genres"]:
        movieGenreToInsert.append((movie["mid"], gid, ))

mycursor.executemany(
    "INSERT IGNORE INTO MovieGenre(mid, gid) VALUES (%s, %s)", movieGenreToInsert)

mydb.commit()
