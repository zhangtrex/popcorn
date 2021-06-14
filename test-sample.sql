-- User registration
INSERT INTO User (username, passwordHash)
VALUE
('rex', '0BE79EDB97498676E587115024035F57')

-- Request a new movie

INSERT INTO NewMovieRequest (uid, movieName, description, reason)
(
    SELECT 1, 'A new movie', 'this is a new movie', 'I want to add this movie'
	WHERE 1 in (
		SELECT User.uid FROM User
		WHERE User.isBlocked = 0
		AND User.isDeleted = 0
	)
)

-- display movie names for a genre

SELECT * FROM Movie
join MovieGenre
WHERE MovieGenre.mid = Movie.mid
AND MovieGenre.gid in
(
	SELECT gid from Genre
    WHERE Genre.genre = 'scifi'
)

-- Display movie name by rating

SELECT Movie.name,avg(MovieRating.stars) FROM MovieRating
JOIN Movie
WHERE Movie.mid = MovieRating.mid
GROUP By Movie.mid
ORDER BY avg(MovieRating.stars) DESC

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
ORDER BY C.created

