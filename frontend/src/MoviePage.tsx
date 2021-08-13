import React, {Component} from 'react';
import {Button, Form, Container, Row, Modal} from 'react-bootstrap';

class MoviePage extends Component {
    initialState = {
        mid: 25, // TODO: Passed from above
        uid: 1, // TODO: Passed from above
        accessLevel: 0, // TODO: Passed from above
        auth_token: "acdf23a63be8b0003da542f6114da45323db8ae7", // TODO: Passed from above
        showModal: true,    // TODO: From Prop
        movie: {
            mid: 0,
            name: '',
            description: ''
        },
        movieAvgRating: 0,
        movieTrailerUrl: 'https://www.youtube.com/embed/3nFR7UAip9A', // TODO: Passed from above
        movieComments: [],
        newComment: '',
        newRating: 3,
    };

    state = this.initialState;

    fetchMovieData = () => {
        fetch(`http://localhost:8000/movie/${this.state.mid}`, {
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        }).then(async response => {
            const res = await response.json();
            // console.log(res);
            this.setState({movie: res})
        });
    }

    fetchMovieCommentData = () => {
        fetch(`http://localhost:8000/comments/${this.state.mid}`, {
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        }).then(async response => {
            const res = await response.json();
            // console.log(res);
            this.setState({movieComments: res})
        });
    }

    fetchMovieAvgRatingData = () => {
        fetch(`http://localhost:8000/movie/avg_star/${this.state.mid}`, {
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        }).then(async response => {
            const res = await response.json();
            // console.log(res);
            this.setState({movieAvgRating: res.toFixed(2)})
        });
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        this.setState({
            [name]: value,
        })
    }

    submitComment = () => {

        const newRatingContent = {
            uid: this.state.uid,
            mid: this.state.mid,
            stars: this.state.newRating
        }

        fetch(`http://localhost:8000/new_movie_rating/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Token ${this.state.auth_token}`
            },
            body: JSON.stringify(newRatingContent)
        }).then(async response => {
            if (response.status === 201) {
                this.fetchMovieAvgRatingData();
            }
        });

        const newCommentContent = {
            uid: this.state.uid,
            mid: this.state.mid,
            content: this.state.newComment
        }


        fetch(`http://localhost:8000/new_comment/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Token ${this.state.auth_token}`
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
                "Authorization": `Token ${this.state.auth_token}`
            },
        }).then(async response => {
            if (response.status === 200) {
                this.fetchMovieCommentData();
            } else {
                alert("You have no permissions to delete this comment.")
            }
        });
    }


    componentDidMount() {
        this.fetchMovieData();
        this.fetchMovieCommentData();
        this.fetchMovieAvgRatingData();
    }

    render() {
        const {newComment} = this.state;
        const commentsDivs = this.state.movieComments.map((comment: any, index) => {
            return (
                <Row>
                    <div className="comment mt-4 text-justify float-left">
                        <h4>{comment.uid.username}</h4>
                        <span><i>{new Date(comment.lastupdated).toDateString()}</i>
                            {comment.uid.uid === this.state.uid || this.state.accessLevel === 1 ?
                                <Button onClick={this.deleteComment(comment.cid)}> Delete </Button>
                                : ''}</span>
                        <br/>
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
                            this.setState({newRating: parseInt(e.target.value)});
                        }
                    }}
                />
            )
        })

        return (
            <Modal show={this.state.showModal}
                   onShow={()=>{this.fetchMovieCommentData(); this.fetchMovieAvgRatingData(); this.fetchMovieData()}}
                   onHide={() => this.setState({showModal: false})}>
                <Modal.Header closeButton>
                    {this.state.movie.name}
                </Modal.Header>
                <Modal.Body>
                    <h4>
                        Average Rating: {this.state.movieAvgRating}
                    </h4>
                    <p>
                        {this.state.movie.description}
                    </p>
                    <object width="425" height="344" aria-label="trailer"
                            data={this.state.movieTrailerUrl}/>
                    <Container>
                        {commentsDivs}
                    </Container>
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
                                          onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" onClick={this.submitComment}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default MoviePage;