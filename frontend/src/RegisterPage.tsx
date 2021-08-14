import React, {Component} from 'react';
import './css/App.scss';
import {Button, Form, Modal, Alert} from "react-bootstrap";

class RegisterPage extends Component {
    initialState = {
        showModal: true,    // TODO: From Prop
        registrationSuccessShow: false,
        registrationErrorShow: false,
        username: '',
        password: '',
    };

    state = this.initialState;

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        this.setState({
            [name]: value,
        })
    }

    submitRegsitration = () => {
        const registrationContent = {
            username: this.state.username,
            password: this.state.password,
        }
        // console.log(registrationContent);

        fetch(`http://localhost:8000/auth/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationContent)
        }).then(async response => {
            if (response.status === 201) {
                this.setState({registrationSuccessShow: true});
            } else {
                this.setState({registrationErrorShow: true});
            }
        });
    }

    render() {
        return (
            <Modal show={this.state.showModal}
                   onHide={() => this.setState({showModal: false})}>
                <Modal.Header closeButton>
                    User Registration
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="email"
                                          name="username"
                                          placeholder="Username"
                                          onChange={this.handleChange}/>
                            <Form.Text className="text-muted">
                                Username must be at least 8 characters long.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                                          name="password"
                                          placeholder="Password"
                                          onChange={this.handleChange}/>
                            <Form.Text className="text-muted">
                                Password must be at least 8 characters long.
                                Password cannot be common patterns.
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" onClick={this.submitRegsitration}>
                            Register Now
                        </Button>
                    </Form>
                    <Alert show={this.state.registrationSuccessShow} variant="success">
                        <Alert.Heading>Success</Alert.Heading>
                        <p>
                            Successfully registered!
                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({registrationSuccessShow: false})}
                                    variant="outline-success">
                                Close
                            </Button>
                        </div>
                    </Alert>
                    <Alert show={this.state.registrationErrorShow} variant="danger">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>
                            Registration failed. Check your username/password pair.
                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({registrationErrorShow: false})}
                                    variant="outline-danger">
                                Close
                            </Button>
                        </div>
                    </Alert>
                </Modal.Body>
            </Modal>
        );
    }

}

export default RegisterPage;
