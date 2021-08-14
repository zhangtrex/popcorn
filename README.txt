instruction to create and load our database:

1.  download MySQL installer from https://dev.mysql.com/downloads/mysql/
    download Python3 from https://www.python.org/downloads/

2.  install mysql, setup a password for the root user.
    install Python3. You could add a Virtual Environment, if you do, remember to use the path of pip of the VirtualEnv.
    Run 'pip install -r requirements.txt' under the root directory of this project, this will install all the required packages for Python.

3.  install Node.js.
    open a terminal in frontend/.
    Run 'npm install' to install all the necessary frontend javascript packages.

4.  Run 'CREATE DATABASE popcorn' in MySQL CLI. This will create a database called popcorn
    Change the password in popcorn_api/popcorn_api/settings.py in the 'DATABASES' section
    Run 'python popcorn_api/manage.py migrate' to migrate all the schema to the database
    Now, the database is all set. If you still receive errors during migrate, delete the migrations folder (as well as drop and recreate the popcorn database using your SQL client) and run the following commands in order:

'python popcorn_api/manage.py makemigrations popcorn'
'python popcorn_api/manage.py makemigrations'
'python popcorn_api/manage.py migrate popcorn'
'python popcorn_api/manage.py migrate'

5.  Run 'python popcorn_api/manage.py runserver' to start the server
    go to localhost:8000/movies to see the query result for table movies

6.  You can add a entry in MySQL CLI. Use

    INSERT INTO popcorn.Movies (name, description)
    VALUES ('your movie name', "your description")

    to add a movie into the db to view

Running the Features

1. User Registration (Creating a user) & Log in/Log out::
- Either use postman or visit the localhost url http://127.0.0.1:8000/auth/users/ on a browser
- Create your new user by entering a unique username and a password longer than 8 characters

- Either use postman or visit the localhost url http://127.0.0.1:8000/auth/token/login on a browser
- Enter your username and a password
- Once logging in, the response will be an auth token
- Save the token for future authenticated api calls
- After using the API, log out by visiting http://127.0.0.1:8000/auth/token/logout

- Where we implement this feature:
* 'User' model is inherited from django's AbstractUser and defined in popcorn_api/popcorn/model.py
* 'UserCreateSerializer' in popcorn_api/popcorn/serializers.py
* 'UserView' view in popcorn_api/popcorn/views.py


2. Request to add new movies:
- Log in using your account
- Add the auth token returned as an Authorization header with value: Token <enter token>
- Call the endpoint with the following body fields: movieName(string), description(string), reason(string)
- The endpoint is: http://127.0.0.1:8000/newmovierequest/

- Where we implement this feature:
* 'NewMovieRequest' model in popcorn_api/popcorn/model.py
* 'NewMovieRequestSerializer' serializer in popcorn_api/popcorn/serializers.py
* 'NewMovieRequestView', 'RejectMovieRequestView', 'ApproveMovieRequest', 'DeleteMovieRequestView', 'RejectMovieRequestView' view in popcorn_api/popcorn/views.py
* For the frontend, class 'MovieRequest' defined in frontend/src/movieRequest.tsx


3. Categorize movies by Genre:
- Find out the id (i.e. gid) associated with a given genre from the API by using http://localhost:8000/genres/
- Either use postman or visit the localhost url http://127.0.0.1:8000/movies/genre/<int:gid> on a browser
- Will return all the movies associated with the genre specified by the gid

- Where we implement this feature:
* 'Movie', 'Genre', 'MovieGenre' models in popcorn_api/popcorn/model.py
* 'MovieSerializer', 'GenreSerializer' serializers in popcorn_api/popcorn/serializers.py
* 'MovieGenreView' view in popcorn_api/popcorn/views.py


4. Show average rating:
- go to /movie/avg_star/<int:mid>, this will the avg stars rating for that movie.

- Where we implement this feature:
* 'MovieRating' models in popcorn_api/popcorn/model.py
* 'MovieAvgStarsView' view in popcorn_api/popcorn/views.py
* For the frontend, 'MoviePage.fetchMovieAvgRatingData()' is implemented in frontend/src/movieRequest.tsx


5. Show Popular movies:
- go to /movie/most_popular/, this will gives a list of movies ordered by number of new comments in 30 days.

- Where we implement this feature:
* 'Comment' models in popcorn_api/popcorn/model.py
* 'MoviePopularView' view in popcorn_api/popcorn/views.py


6. Display all comments for a movie:
- Select a movie and get its mid (can get this using the http://localhost:8000/movies endpoint)
- Either use postman or visit the localhost url http://127.0.0.1:8000/comments/<int:mid> on a browser
- Will return all the columns

- Where we implement this feature:
* 'Comment' models in popcorn_api/popcorn/model.py
* 'CommentNestingUserSerializer' serializers in popcorn_api/popcorn/serializers.py
* 'MovieCommentsView' view in popcorn_api/popcorn/views.py
* For the frontend, 'MoviePage.fetchMovieCommentData()' is implemented in frontend/src/movieRequest.tsx


7. Add a comment:
- Log in using your account
- Add the auth token returned as an Authorization header with value: Token <enter token>
- Call the endpoint http://127.0.0.1:8000/new_comment/ with the following body fields: mid(int, foreign key), content(string)

- Where we implement this feature:
* 'Comment' model in popcorn_api/popcorn/model.py
* 'CommentNestingUserSerializer' in popcorn_api/popcorn/serializers.py
* 'DeleteCommentView', 'NewCommentView' view in popcorn_api/popcorn/views.py
* For the frontend, 'MoviePage.submitComment()' is implemented in frontend/src/movieRequest.tsx

8. Role Base Access Control
- In our application we have two authorized roles: Admin and Regular. The admin users will be entitled to perform more actions than the regular users. 
- Users without an account will only be able to call a small subset of api endpoints.
- When signing up with an account, specify your accessLevel. The Admin access level is mapped to 1, and the Normal User access level is mapped to 0.
- MovieView, MovieSingleView, GenreView, MovieGenreView, MovieAvgStarsView, UserView, MovieCommentsView, MoviePopularView: These views and their associated endpoints don't require any authentication and authorization. Thus, all users can make these requests.
- NewMovieRequestView POST: Any logged in user (regular user) can make this request. Since Admin the admin level is above the Regular level, admins can also make the request.
- NewMovieRequestView GET: Only admins can GET all requests. Regular users will only GET their own requests. All other users are unauthorized.
- ApproveMovieRequest: Movies requests can only be accepted by Admins.
- DeleteMovieRequestView: Only authenticated users (at least the regular level) who created the request can delete it.
- NewCommentView: Only authenticated users with level above and including Regular can make this request.
- NewMovieRatingView: Only authenticated users with level above and including Regular can make this request.
- RejectMovieRequestView: Only Admins can reject a movie request.
- GetUserInfoView: Only authenticated users with level above and included Regular can make this request.
- DeleteCommentView: Either an admin or the user who created the comment can delete it.

9. Security
- Passwords must be complex with numbers, letters, and at least a symbol. They must be longer than 8 characters.
- Once the password is entered, it is hashed and only the hashed value is stored in the database. 
- On login, each user will get their user token which is used for authentication and authorization when making API calls

All the above features are implemented in models.py (model definition), serializers.py (serialize the incoming objects to valid models), urls.py (to define endpoints), and views.py (for functional implementation and logic).

## Populating real IMDB data:
1. Download the titles basic meta data from the IMDB website and put the extracted `data.tsv` file in the `./imdb_movies_to_db/title.basic.tsv` folder in the repo 
   (Note: Data should be retrieved from https://datasets.imdbws.com/title.basics.tsv.gz)

2. To move this real data into the database simply run `python .\imdb_movies_to_db\movie_tsv_to_db.py` after installing the `requirements.txt` file as explained in the instructions above. **Note:** This deletes the data from `MovieGenre`, `Movie`, and `Genre`. 
So to load further sample data use `test-production.sql` after running this script which loads the real data from IMDB.
