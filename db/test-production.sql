USE popcorn;
SHOW TABLES;

-- Modified: Return only the top 10 result rows for some queries

-- Basic tests for Genre, Movie, MovieGenre, User tables

SELECT * FROM Genre
ORDER BY gid
LIMIT 10;


SELECT * FROM Movie
ORDER BY mid
LIMIT 10;


SELECT * FROM MovieGenre
ORDER BY mid
LIMIT 10;

SELECT * FROM User
ORDER BY uid DESC
LIMIT 10;


-- Adding  users
INSERT INTO User(password, username, accesslevel, is_superuser, first_name, last_name, email, is_staff, is_active, date_joined, isBlocked, isDeleted)
    VALUES ('passwd1', 'testu1', 0, false, 'u1', 'test', 'testu1@test.ca', false,
        true, '2020-06-01 09:38:08', false, false);

INSERT INTO User(password, username, accesslevel, is_superuser, first_name, last_name, email, is_staff, is_active, date_joined, isBlocked, isDeleted)
    VALUES ('passwd2', 'testu2', 1, false, 'u2', 'test', 'testu2@test.ca', false,
        true, '2020-06-01 01:38:08', false, false);

INSERT INTO User(password, username, accesslevel, is_superuser, first_name, last_name, email, is_staff, is_active, date_joined, isBlocked, isDeleted)
    VALUES ('passwd3', 'testu3', 0, false, 'u3', 'test', 'testu3@test.ca', false,
        true, '2020-06-03 11:38:08', false, false);

-- Check the user-adding
SELECT * FROM User
ORDER BY uid DESC
LIMIT 3;



-- Submit movie-adding requests
INSERT INTO NewMovieRequest(uid, moviename, description, reason, status)
    VALUES (1, 'TestMovie1', 'description of test mv 1', 'no reason', 0);
INSERT INTO NewMovieRequest(uid, moviename, description, reason, status)
    VALUES (1, 'TestMovie2', 'description of test mv 2', 'I like it', 0);
INSERT INTO NewMovieRequest(uid, moviename, description, reason, status)
    VALUES (2, 'TestMovie3', 'description of test mv 3', 'My mom likes it', 0);

-- Check the newly added 3 users correct as added or not
SELECT * FROM NewMovieRequest
ORDER BY uid
LIMIT 10;



-- Submit ratings to movies
INSERT INTO MovieRating(stars, uid, mid, isDeleted)
    VALUES (5, 1, 1, 0);
INSERT INTO MovieRating(stars, uid, mid, isDeleted)
    VALUES (2, 1, 2, 0);
INSERT INTO MovieRating(stars, uid, mid, isDeleted)
    VALUES (3, 2, 2, 0);
INSERT INTO MovieRating(stars, uid, mid, isDeleted)
    VALUES (4, 3, 1, 1);


SELECT * FROM MovieRating
ORDER BY uid
LIMIT 10;




-- Submit comments to movies
INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (1, 1, 'Five Point Palm Exploding Heart Technique! Ha!', 
        '2020-06-01 09:38:08',
        '2020-06-01 09:38:08',
        false);
INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (1, 2, 'Who lives in the pineapple under the sea?',
        '2020-06-03 02:26:17',
        '2020-06-09 07:01:59',
        false);
INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (2, 2, 'Sponge Bob Square Pants!', 
        '2020-01-01 16:54:10',
        '2020-09-01 10:40:02',
        false);
INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (3, 1, 'Okinawa, one way.',
        '2020-02-12 12:22:23',
        '2020-03-11 14:21:12',
        true);


INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (2, 4, 'I Love this',
        NOW(),
        NOW(),
        false);

INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (1, 3, 'I Love this',
        NOW(),
        NOW(),
        false);

INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (1, 5, 'I Love this',
        NOW(),
        NOW(),
        false);

INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (2, 3, 'I Love this',
        NOW(),
        NOW(),
        false);

SELECT * FROM Comment
ORDER BY mid
LIMIT 10;


-- More Tests

-- Get deleted comments (for admin), display top 10 results by mid only
SELECT * FROM Comment
    WHERE isDeleted = True
ORDER BY mid DESC
LIMIT 10;
    
-- Select comments of movie with mid = 1, display top 10 results by stars only
SELECT content FROM Comment
    INNER JOIN Movie
        ON Comment.mid = Movie.mid
    INNER JOIN MovieRating
        ON MovieRating.mid = Comment.mid
    WHERE Comment.mid = 1
ORDER BY stars 
LIMIT 10;

-- Select stars of movie with mid = 2, display top 10 results only
SELECT stars FROM MovieRating INNER JOIN Movie
    Using (mid)
    WHERE mid = 2
ORDER BY stars
LIMIT 10;

-- Count how many users have 'testu1' as their usernames
SELECT COUNT(*) FROM User
    WHERE username = 'testu1';

-- Get all movie-genre pairs, display top 10 result by mid only
SELECT name, genre FROM Movie
    INNER JOIN MovieGenre USING (mid)
    INNER JOIN Genre USING (gid)
ORDER BY mid
LIMIT 10;

-- Get all genres of the movie 'Comedy After Dark starring Mike Burke'
SELECT genre FROM Movie
    INNER JOIN MovieGenre USING (mid) 
    INNER JOIN Genre USING (gid)
    WHERE name = 'Comedy After Dark starring Mike Burke';


-- Get all movies of the genre 'Battles 4'
SELECT name FROM Movie
    INNER JOIN MovieGenre USING (mid) 
    INNER JOIN Genre USING (gid)
    WHERE genre = 'Battles 4';


-- Get movies of the genre 'Animation'
SELECT name FROM Movie
    INNER JOIN MovieGenre USING (mid) 
    INNER JOIN Genre USING (gid)
    WHERE genre = 'Animation'
ORDER BY mid
LIMIT 10;



-- Get all comments for all movies that are not deleted, display top 10 results ordered by mid
SELECT name, content, created, lastUpdated FROM Comment
    INNER JOIN Movie USING (mid)
    WHERE isDeleted = False
ORDER BY mid
LIMIT 10;



-- Get all comments for the Movie 'Battles 4' that are not deleted
SELECT content, created, lastUpdated FROM Comment
    INNER JOIN Movie USING (mid)
    WHERE isDeleted = False AND name = 'Battles 4';


-- Request a new movie

INSERT INTO NewMovieRequest (uid, movieName, description, reason)
(
    SELECT 1, 'A new movie', 'this is a new movie', 'I want to add this movie'
	WHERE 1 in (
		SELECT User.uid FROM User
		WHERE User.isBlocked = 0
		AND User.isDeleted = 0
	)
);

-- display top 10 movie names for a genre by mid

SELECT * FROM Movie
join MovieGenre
WHERE MovieGenre.mid = Movie.mid
AND MovieGenre.gid in
(
	SELECT gid from Genre
    WHERE Genre.genre = 'Family'
)
ORDER BY Movie.mid
LIMIT 10;



-- Display top 10 movies name by rating

SELECT Movie.name,avg(MovieRating.stars) FROM MovieRating
JOIN Movie
WHERE Movie.mid = MovieRating.mid
GROUP By Movie.mid
ORDER BY avg(MovieRating.stars) DESC
LIMIT 10;


-- Display movie name by popularity (having most comments)

SELECT Movie.mid, Movie.name, Movie.description, count(Comment.uid) FROM Comment
JOIN Movie
WHERE Movie.mid = Comment.mid
AND Comment.created < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP By Movie.mid
ORDER BY count(Comment.uid) DESC;


-- View top 10 comments for a movie ordered by create time

SELECT User.username, C.content FROM
(
	SELECT Movie.mid, Comment.content, Comment.uid, Comment.created FROM Comment
	JOIN Movie
	WHERE Movie.mid = Comment.mid
	AND Comment.isDeleted = 0
	AND Movie.mid = 1
) as C
JOIN User
WHERE User.uid = C.uid
ORDER BY C.created
LIMIT 10;


-- Calculate avg/total stars for a moive with mid = 1

SELECT AVG(stars), SUM(stars) FROM Comment
    INNER JOIN Movie
        ON Comment.mid = Movie.mid
    INNER JOIN MovieRating
        ON MovieRating.mid = Comment.mid
    WHERE Comment.mid = 1;

-- Display movie name by popularity (having most comments)

SELECT Movie.mid, Movie.name, Movie.description, count(Comment.uid) FROM Comment
JOIN Movie
WHERE Movie.mid = Comment.mid
AND Comment.created < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP By Movie.mid
ORDER BY count(Comment.uid) DESC;

-- Add a new comment

INSERT INTO Comment(uid, mid, content, created, lastupdated, isdeleted)
    VALUES (1, 4, 'Loving this',
        NOW(),
        NOW(),
        false);

