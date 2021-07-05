instruction to create and load our database:

1.  download MySQL installer from https://dev.mysql.com/downloads/mysql/
    download Python3 from https://www.python.org/downloads/

2.  install mysql, setup a password for the root user.
    install Python3. You could add a Virtual Environment, if you do, remember to use the path of pip of the VirtualEnv.
    Run 'pip install -r requirements.txt' under the root directory of this project, this will install all the required packages for Python.

3.  Run 'CREATE DATABASE popcorn' in MySQL CLI. This will create a database called popcorn
    Change the password in popcorn_api/popcorn_api/settings.py in the 'DATABASES' section
    Run 'python popcorn_api/manage.py migrate' to migrate all the schema to the database
    Now, the database is all set. If you still receive errors during migrate, delete the migrations folder (as well as drop and recreate the popcorn database using your SQL client) and run the following commands in order:

'python popcorn_api/manage.py makemigrations popcorn'
'python popcorn_api/manage.py makemigrations'
'python popcorn_api/manage.py migrate popcorn'
'python popcorn_api/manage.py migrate'

4.  Run 'python popcorn_api/manage.py runserver' to start the server
    go to localhost:8000/movies to see the query result for table movies

5.  You can add a entry in MySQL CLI. Use

    INSERT INTO popcorn.Movies (name, description)
    VALUES ('your movie name', "your description")

    to add a movie into the db to view

Running the Features

1. Logging in/out as user
- Either use postman or visit the localhost url http://127.0.0.1:8000/auth/users/ on a browser
- Create your new user by entering a unique username and a password longer than 8 characters
- Once logging in, the response will be an auth token
- Save the token for future authenticated api calls
- After using the API, log out by visiting http://127.0.0.1:8000/auth/token/logout

2. Create a new movie request
- Log in using your account
- Add the auth token returned as an Authorization header with value: Token <enter token>
- Call the endpoint with the following body fields: uid(int, foreign key), movieName(string), description(string), reason(string)

3. Get all comments on a movie
- Select a movie and get its mid (can get this using the http://localhost:8000/movies endpoint)
- Either use postman or visit the localhost url http://127.0.0.1:8000/comments/<int:mid> on a browser
- Will return all the columns

4. Get movies by genre
- Find out the id (i.e. gid) associated with a given genre from the API by using http://localhost:8000/genres/
- Either use postman or visit the localhost url http://127.0.0.1:8000/movies/genre/<int:gid> on a browser
- Will return all the movies associated with the genre specified by the gid

## Populating real IMDB data:
1. Download the titles basic meta data from the IMDB website and put the extracted `data.tsv` file in the `./imdb_movies_to_db/title.basic.tsv` folder in the repo 
   (Note: Data should be retrieved from https://datasets.imdbws.com/title.basics.tsv.gz)

2. To move this real data into the database simply run `python .\imdb_movies_to_db\movie_tsv_to_db.py` after installing the `requirements.txt` file as explained in the instructions above. **Note:** This deletes the data from `MovieGenre`, `Movie`, and `Genre`. So to load further sample data use `test-production.sql` after running this script to get the real data from IMDB.
