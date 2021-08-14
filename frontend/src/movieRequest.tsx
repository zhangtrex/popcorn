import React, {Component} from 'react';
import BootstrapTable from 'react-bootstrap-table-next'
import './css/App.scss';
import {Button, Form, Row, Col, Modal, Alert} from "react-bootstrap";
import { User } from './apiTypes';



type MovieRequest = {
    movieName: string,
    description: string,
    reason: string,
    uid: number,
}

type MovieRequestProps = {
    user?: User;
    show: boolean;
    hidePastRequests: boolean;
    onHide: () => void;
}


type MovieRequestState = {
    submitSuccessShow: boolean,
    submitErrorShow: boolean,
    newMovieRequests: MovieRequest[],
    movieName: string,
    description: string,
    reason: string,
}

class MovieRequestModal extends Component<MovieRequestProps, MovieRequestState> {

    constructor(props: MovieRequestProps){
        super(props);
        this.state = {
            submitSuccessShow: false,
            submitErrorShow: false,
            newMovieRequests: [],
            movieName: '',
            description: '',
            reason:'',
        }
    }

    fetchNewMovieRequestsData = () => {
        fetch(`http://127.0.0.1:8000/newmovierequest/`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.token}`
            },
        }).then(async response => {
            const res = await response.json();
            this.setState({newMovieRequests: res})
        });
    }

    actionOnNewMovieRequest =
        (action: string) => (nid: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            fetch(`http://localhost:8000/${action}movierequest/${nid}`, {
                method: action === "delete" ? "DELETE" : "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${sessionStorage.token}`
                },
            }).then(async response => {
                if (response.status === 200) {
                    this.fetchNewMovieRequestsData();
                } else {
                    alert(`You have no permissions to ${action} this request.`);
                }
            });
        };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value as string
        } as any as MovieRequestState);
    }

    submitNewRequest = () => {
        const newRequest = {
            uid: this.props.user?.uid,
            movieName: this.state.movieName,
            description: this.state.description,
            reason: this.state.reason
        }


        fetch(`http://localhost:8000/newmovierequest/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${sessionStorage.token}`
            },
            body: JSON.stringify(newRequest)
        }).then(async response => {
            if (response.status === 201) {
                this.fetchNewMovieRequestsData();
                this.setState({submitSuccessShow: true})
            } else {
                this.setState({submitErrorShow: true})
            }
        });
    }

    componentDidMount() {
        this.fetchNewMovieRequestsData();
    }

    render() {

        const newMovieRequests = !this.props.user ? [] : this.state.newMovieRequests.map((req: any, index) => {
            req['status'] =
                req['status'] === '1'
                    ? 'Approved'
                    : req['status'] === '2'
                        ? 'Rejected'
                        : 'Pending';
            if (this.props.user) {
                if (this.props.user.uid === req['uid']) {
                    req['delete_button'] =
                        <Button onClick={this.actionOnNewMovieRequest("delete")(req['nid'])}> Delete </Button>;
                } else {
                    req['delete_button'] =
                        <Button> Not Your Request </Button>;
                }
            }
           
            if (this.props.user && this.props.user.accesslevel === 1) {
                req['admin_buttons'] =
                    <div>
                        <Button onClick={this.actionOnNewMovieRequest("approve")(req['nid'])}> Approve </Button>
                        <Button onClick={this.actionOnNewMovieRequest("reject")(req['nid'])}> Reject </Button>
                    </div>;
            }
            return req;
        });

        const newRequestForm = (
            <Form>
                <h3>Request A New Movie:</h3>
                <Form.Group as={Row} className="mb-3" controlId="movie_name_gp">
                    <Form.Label column sm="2">
                        Movie Name
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control name="movieName" placeholder="Titanic" onChange={this.handleChange}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="description_gp">
                    <Form.Label column sm="2">
                        Description
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control name="description"
                                      as="textarea"
                                      placeholder="Write the description here."
                                      onChange={this.handleChange}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="reason">
                    <Form.Label column sm="2">
                        Reason
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control name="reason"
                                      as="textarea"
                                      placeholder="Why do you want to add this movie?"
                                      onChange={this.handleChange}/>
                    </Col>
                </Form.Group>
                <Button variant="primary" onClick={this.submitNewRequest}>
                    Submit
                </Button>
            </Form>
        )

        const columns = [{
            dataField: 'movieName',
            text: 'Movie Name'
        }, {
            dataField: 'description',
            text: 'Description'
        }, {
            dataField: 'reason',
            text: 'Reason to Add'
        }, {
            dataField: 'status',
            text: 'Status'
        }];
        if (this.props.user) {
            if (this.props.user.accesslevel === 1) {
                columns.push({
                    dataField: 'admin_buttons',
                    text: 'Action'
                })
            } else {
                columns.push({
                    dataField: 'delete_button',
                    text: 'Delete?'
                })
            }
        }
        

        return (
            <Modal show={this.props.show}
                   onShow={this.fetchNewMovieRequestsData}
                   onHide={() => { this.props.onHide(); }}>
                <Modal.Header closeButton>
                    New Movie Requests
                </Modal.Header>
                <Modal.Body>
                    {!this.props.hidePastRequests
                        ? <BootstrapTable keyField='uid' data={newMovieRequests} columns={columns}/>
                        : ''}
                    <Alert show={this.state.submitSuccessShow} variant="success">
                        <Alert.Heading>Success</Alert.Heading>
                        <p>
                            Successfully submitted a new movie request!
                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({submitSuccessShow: false})}
                                    variant="outline-success">
                                Close
                            </Button>
                        </div>
                    </Alert>
                    <Alert show={this.state.submitErrorShow} variant="danger">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>
                            Submission failed. A request with the same movie may already exist.
                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({submitErrorShow: false})}
                                    variant="outline-danger">
                                Close
                            </Button>
                        </div>
                    </Alert>
                    {this.props.user && this.props.user.accesslevel === 0 ? newRequestForm : ''}
                </Modal.Body>
            </Modal>
        );
    }

}

export default MovieRequestModal;
