import React, {Component} from 'react';
import BootstrapTable from 'react-bootstrap-table-next'
import './css/App.scss';
import {Button, Form, Row, Col, Modal, Alert} from "react-bootstrap";

class MovieRequest extends Component {
    initialState = {
        uid: 1, // TODO: Passed from above
        accessLevel: 0, // TODO: Passed from above
        auth_token: "8ef410645d332bbf632daf05a57bc13570fcdede", // TODO: Passed from above
        showModal: true,    // TODO: From Prop
        hidePastRequests: true, // TODO: Passed from above
        submitSuccessShow: false,
        submitErrorShow: false,
        newMovieRequests: [],
        movieName: "",
        description: "",
        reason: "",
    };

    state = this.initialState;

    fetchNewMovieRequestsData = () => {
        fetch(`http://127.0.0.1:8000/newmovierequest/`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${this.state.auth_token}`
            },
        }).then(async response => {
            const res = await response.json();
            // console.log(res);
            this.setState({newMovieRequests: res})
        });
    }

    actionOnNewMovieRequest =
        (action: string) => (nid: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            fetch(`http://localhost:8000/${action}movierequest/${nid}`, {
                method: action === "delete" ? "DELETE" : "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${this.state.auth_token}`
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
        const {name, value} = event.target
        this.setState({
            [name]: value,
        })
    }

    submitNewRequest = () => {
        const newRequest = {
            uid: this.state.uid,
            movieName: this.state.movieName,
            description: this.state.description,
            reason: this.state.reason
        }


        fetch(`http://localhost:8000/newmovierequest/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${this.state.auth_token}`
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
        const newMovieRequests = this.state.newMovieRequests.map((req: any, index) => {
            req['status'] =
                req['status'] === '1'
                    ? 'Approved'
                    : req['status'] === '2'
                        ? 'Rejected'
                        : 'Pending';
            if (this.state.uid === req['uid']) {
                req['delete_button'] =
                    <Button onClick={this.actionOnNewMovieRequest("delete")(req['nid'])}> Delete </Button>;
            } else {
                req['delete_button'] =
                    <Button> Not Your Request </Button>;
            }
            if (this.state.accessLevel === 1) {
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

        if (this.state.accessLevel === 1) {
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

        return (
            <Modal show={this.state.showModal}
                   onShow={this.fetchNewMovieRequestsData}
                   onHide={() => this.setState({showModal: false})}>
                <Modal.Header closeButton>
                    New Movie Requests
                </Modal.Header>
                <Modal.Body>
                    {!this.state.hidePastRequests
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
                    {this.state.accessLevel === 0 ? newRequestForm : ''}
                </Modal.Body>
            </Modal>
        );
    }

}

export default MovieRequest;
