instruction to create and load our database:

1.  download MySQL installer from https://dev.mysql.com/downloads/mysql/
    download Python3 from https://www.python.org/downloads/

2.  install mysql, setup a password for the root user.
    install Python3. You could add a Virtual Environment, if you do, remember to use the path of pip of the VirtualEnv.
    Run 'pip install -r requirements.txt' under the root directory of this project, this will install all the required packages for Python.

3.  Run 'CREATE DATABASE popcorn' in MySQL CLI. This will create a database called popcorn
    Change the password in popcorn_api/popcorn_api/settings.py in the 'DATABASES' section
    Run 'python popcorn_api/manage.py migrate' to migrate all the schema to the database
    Now, the database is all set.

4.  Run 'python popcorn_api/manage.py runserver' to start the server
    go to localhost:8000/movies to see the query result for table movies

5.  You can add a entry in MySQL CLI. Use

    INSERT INTO popcorn.Movies (name, description)
    VALUES ('your movie name', "your description")

    to add a movie into the db to view
