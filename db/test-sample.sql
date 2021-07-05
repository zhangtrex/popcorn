USE popcorn;
SHOW TABLES;

-- Create genres
INSERT INTO Genre(genre)
    VALUES ('Action');
INSERT INTO Genre(genre)
    VALUES ('Cartoon');
INSERT INTO Genre(genre)
    VALUES ('Crime');
INSERT INTO Genre(genre)
    VALUES ('SciFi');
SELECT * FROM Genre;

-- Create movies
INSERT INTO Movie(name, description)
    VALUES ('Kill Bill', 'Kill Bill: Volume 1 is a 2003 American martial arts film ...');
INSERT INTO Movie(name, description)
    VALUES ('Sponge on the Run', 'The SpongeBob Movie: Sponge on the Run is a 2020 American..');
INSERT INTO Movie(name, description)
    VALUES ('Back to the Future', 'Back to the Future is a 1985 American science fiction ...');
SELECT * FROM Movie;

-- Assign genres to movies
INSERT INTO MovieGenre(mid, gid)
    VALUES (1, 1);
INSERT INTO MovieGenre(mid, gid)
    VALUES (1, 3);
INSERT INTO MovieGenre(mid, gid)
    VALUES (2, 2);
INSERT INTO MovieGenre(mid, gid)
    VALUES (3, 4);
SELECT * FROM MovieGenre;


-- Create users
INSERT INTO User(password, username, accesslevel)
    VALUES ('passwd1', 'testu1', 0);
INSERT INTO User(password, username, accesslevel)
    VALUES ('passwd2', 'testu2', 0);
INSERT INTO User(password, username, accesslevel)
    VALUES ('passwd3', 'testu3', 0);
SELECT * FROM User;

-- Submit movie-adding requests
INSERT INTO NewMovieRequest(uid, moviename, description, reason, status)
    VALUES (1, 'TestMovie1', 'description of test mv 1', 'no reason', 0);
INSERT INTO NewMovieRequest(uid, moviename, description, reason, status)
    VALUES (1, 'TestMovie2', 'description of test mv 2', 'I like it', 0);
INSERT INTO NewMovieRequest(uid, moviename, description, reason, status)
    VALUES (2, 'TestMovie3', 'description of test mv 3', 'My mom likes it', 0);
SELECT * FROM NewMovieRequest;

-- Submit ratings to movies
INSERT INTO MovieRating(stars, uid, mid)
    VALUES (5, 1, 1);
INSERT INTO MovieRating(stars, uid, mid)
    VALUES (2, 1, 2);
INSERT INTO MovieRating(stars, uid, mid)
    VALUES (3, 2, 2);
INSERT INTO MovieRating(stars, uid, mid, isDeleted)
    VALUES (4, 3, 1, 1);
SELECT * FROM MovieRating;

-- Submit comments to movies
INSERT INTO Comment(uid, mid, content)
    VALUES (1, 1, 'Five Point Palm Exploding Heart Technique! Ha!');
INSERT INTO Comment(uid, mid, content)
    VALUES (1, 2, 'Who lives in the pineapple under the sea?');
INSERT INTO Comment(uid, mid, content)
    VALUES (2, 2, 'Sponge Bob Square Pants!');
INSERT INTO Comment(uid, mid, content, isDeleted)
    VALUES (3, 1, 'Okinawa, one way.', 1);
SELECT * FROM Comment;


-- More Tests

-- Get deleted comments (for admin)
SELECT * FROM Comment
    WHERE isDeleted = True;
    
-- Select comments of movie with mid = 1
SELECT content FROM Comment INNER JOIN Movie
    USING (mid)
    WHERE mid = 1;

-- Select stars of movie with mid = 2
SELECT stars FROM MovieRating INNER JOIN Movie
    Using (mid)
    WHERE mid = 2;

-- Count how many users have 'testu1' as their usernames
SELECT COUNT(*) FROM User
    WHERE username = 'testu1';

-- Get all movie-genre pairs
SELECT name, genre FROM Movie
    INNER JOIN MovieGenre USING (mid)
    INNER JOIN Genre USING (gid);

-- Get all genres of the movie 'Kill Bill'
SELECT genre FROM Movie
    INNER JOIN MovieGenre USING (mid) 
    INNER JOIN Genre USING (gid)
    WHERE name = 'Kill Bill';

-- Get all movies of the genre 'Cartoon'
SELECT name FROM Movie
    INNER JOIN MovieGenre USING (mid) 
    INNER JOIN Genre USING (gid)
    WHERE genre = 'Cartoon';

-- Get all comments for all movies that are not deleted
SELECT name, content, created, lastUpdated FROM Comment
    INNER JOIN Movie USING (mid)
    WHERE isDeleted = False;

-- Get all comments for the Movie 'Kill Bill' that are not deleted
SELECT content, created, lastUpdated FROM Comment
    INNER JOIN Movie USING (mid)
    WHERE isDeleted = False AND name = 'Kill Bill';

-- Another user registration
INSERT INTO User (username, password)
VALUE
('rex', '0BE79EDB97498676E587115024035F57');

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

-- display movie names for a genre

SELECT * FROM Movie
join MovieGenre
WHERE MovieGenre.mid = Movie.mid
AND MovieGenre.gid in
(
	SELECT gid from Genre
    WHERE Genre.genre = 'scifi'
);

-- Display movie name by rating

SELECT Movie.name,avg(MovieRating.stars) FROM MovieRating
JOIN Movie
WHERE Movie.mid = MovieRating.mid
GROUP By Movie.mid
ORDER BY avg(MovieRating.stars) DESC;

-- Display movie name by popularity (having most comments)

SELECT Movie.name, count(Comment.uid) FROM Comment
JOIN Movie
WHERE Movie.mid = Comment.mid
AND Comment.created < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP By Movie.mid
ORDER BY count(Comment.mid) DESC;

-- View all comments for a movie ordered by create time

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
ORDER BY C.created;
