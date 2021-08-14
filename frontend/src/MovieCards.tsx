import './css/Cards.scss';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup'
import React, { useEffect, useState } from 'react';
import { Movie, User } from './apiTypes';
import movieTrailer from 'movie-trailer';
import thumbnailYoutubeVimeo from 'thumbnail-youtube-vimeo';

type MovieCardProps = { movies: Movie[], displayMovieView: (movie: Movie, youtubeUrl: string, user?: User) => void, append: boolean, user?: User };


export function MovieCards(props: MovieCardProps) {
    type CardsState = { cards: JSX.Element[] };
    const [cardsState, setCardsState] = useState<CardsState>({ cards: [] });
    const [moviesState, setMoviesState] = useState<Movie[]>([]);
    let cards: JSX.Element[] = cardsState.cards;
    let {movies, append, user, displayMovieView} = props;

    useEffect(() => {
        // assignment to remove warning
        let cardsInternal = cards;
        const updateCards = async () => {

            if (!append) {
                cardsInternal = [];
            }
            for (const movie of movies) {
                const trailer = await movieTrailer(movie.name);
                console.log(cardsInternal)
                if (trailer) {
                    const thumbnailUrl = await thumbnailYoutubeVimeo(trailer);

                    cardsInternal.push(
                        <Col className="container-fluid mt-4">
                            <Card key={movie.mid} id="custom" bg="dark" text="white" onClick={() => displayMovieView(movie, trailer, user)}>
                                <Card.Header><Card.Title>{movie.name}</Card.Title></Card.Header>
                                <Card.Img id="cardImg" variant="top" src={thumbnailUrl} />
                            </Card>
                        </Col>
                    );
                }

            }
            setCardsState({ cards: cardsInternal });
        }
        // We don't want to update unless there are actually new movies
        if (movies === moviesState) return;
        setMoviesState(movies);
        updateCards();
        
    }, [movies, append, user, cards, displayMovieView, moviesState]);


    return (
        <Container>
            <CardGroup>
                {cardsState.cards}
            </CardGroup>
        </Container>
    );
}




