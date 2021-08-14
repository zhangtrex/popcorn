import React, { Component } from 'react';
import { Button, Form, Container, Row, Modal } from 'react-bootstrap';
import { Movie, MovieComment, User } from './apiTypes';

type MoviePageProps = {
    movie?: Movie;
    user?: User;
    show: boolean;
    movieTrailerUrl: string;
    onHide: () => void;
}

type MoviePageState = {
    movieAvgRating: number;
    movieComments: MovieComment[];
    newCommentContent: string;
    newRating: number;
}

class MoviePage extends Component<MoviePageProps, MoviePageState> {
    constructor(props: MoviePageProps) {
        super(props);
        this.state = {
            movieAvgRating: 0,
            movieComments: [],
            newCommentContent: '',
            newRating: 3,
        }
    }

    fetchMovieCommentData = () => {
        fetch(`http://localhost:8000/comments/${this.props.movie!.mid}`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        }).then(async response => {
            const res = await response.json();
  
            this.setState({ movieComments: res })
        });
    }

    fetchMovieAvgRatingData = () => {
        fetch(`http://localhost:8000/movie/avg_star/${this.props.movie!.mid}`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        }).then(async response => {
            const res = await response.json();
            this.setState({ movieAvgRating: res.toFixed(2) })
        });
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        this.setState({
            newCommentContent: value,
        })
    }

    submitComment = () => {

        const newRatingContent = {
            uid: this.props.user!.uid,
            mid: this.props.movie!.mid,
            stars: this.state.newRating
        }

        fetch(`http://localhost:8000/new_movie_rating/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.token}`
            },
            body: JSON.stringify(newRatingContent)
        }).then(async response => {
            if (response.status === 201) {
                this.fetchMovieAvgRatingData();
            }
        });

        const newCommentContent = {
            uid: this.props.user!.uid,
            mid: this.props.movie!.mid,
            content: this.state.newCommentContent
        }


        fetch(`http://localhost:8000/new_comment/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.token}`
            },
            body: JSON.stringify(newCommentContent)
        }).then(async response => {
            if (response.status === 201) {
                this.fetchMovieCommentData();
            }
        });

    }

    deleteComment = (cid: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        fetch(`http://localhost:8000/delete_comment/${cid}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.token}`
            },
        }).then(async response => {
            if (response.status === 200) {
                this.fetchMovieCommentData();
            } else {
                alert("You have no permissions to delete this comment.")
            }
        });
    }


    render() {
        const { newCommentContent: newComment } = this.state;
        const commentsDivs = this.state.movieComments.map((comment: MovieComment) => {
            return (
                <Row>
                    <div className="comment mt-4 text-justify float-left">
                        <h4>{comment.uid.username}</h4>
                        <span><i>{new Date(comment.lastupdated).toDateString()}</i>
                            {sessionStorage.token && (comment.uid.uid === this.props.user!.uid || this.props.user!.accesslevel === 1) ?
                                <Button onClick={this.deleteComment(comment.cid)}> Delete </Button>
                                : ''}</span>
                        <br />
                        <p>{comment.content}</p>
                    </div>
                </Row>
            );
        })
        const ratingRadios = [1, 2, 3, 4, 5].map((i, _) => {
            return (
                <Form.Check
                    inline
                    label={i.toString()}
                    name={"rating"}
                    type="radio"
                    id={"rating" + i}
                    value={i}
                    onChange={e => {
                        if (e.target.checked) {
                            this.setState({ newRating: parseInt(e.target.value) });
                        }
                    }}
                />
            )
        })

        return (
            <Modal show={this.props.show}
                onShow={() => { this.fetchMovieCommentData(); this.fetchMovieAvgRatingData(); }}
                onHide={() => this.props.onHide()}>
                <Modal.Header closeButton>
                    {this.props.movie ? this.props.movie.name : ""}
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        Average Rating: {this.state.movieAvgRating}
                    </h4>
                    <p>
                        {this.props.movie ? this.props.movie.description : ""}
                    </p>
                    <iframe width="425" height="344" src={this.props.movieTrailerUrl.replace('watch?v=','embed/')} title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                     aria-label="trailer"></iframe>
                    <Container>
                        {commentsDivs}
                    </Container>
                    {sessionStorage.token ?
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="newComment" className="float-left">
                                    <h3>Add a review:</h3>
                                </Form.Label>
                                <div className="float-right">
                                    <Form.Label>
                                        <h5>Rating:</h5>
                                    </Form.Label>
                                    {ratingRadios}
                                </div>
                                <Form.Control id="newComment"
                                    name="newComment"
                                    as="textarea"
                                    value={newComment}
                                    placeholder="Type your comment here."
                                    rows={3}
                                    onChange={this.handleChange} />
                            </Form.Group>
                            <Button variant="primary" onClick={this.submitComment}>
                                Submit
                            </Button>
                        </Form>
                        : ""
                    }
                </Modal.Body>
            </Modal>
        );
    }
}

export default MoviePage;