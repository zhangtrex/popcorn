import React, {Component} from 'react';
import './css/App.scss';
import {Button, Form, Modal, Alert} from "react-bootstrap";
import { User } from './apiTypes';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';


type LoginPageProps = {
    show: boolean;
    onHide: (user?:User, userToken?: string) => void;
}

type LoginPageState = {
    loginSuccessShow: boolean,
    loginErrorShow: boolean,
    username: string,
    password: string,
    auth_token: string,
    user?: User
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {

    constructor(props: LoginPageProps){
        super(props);
        this.state = {
            loginSuccessShow: false,
            loginErrorShow: false,
            username: '',
            password: '',
            user: {
                username: '',
                uid: -1,
                accesslevel: -1,
            },
            auth_token: '',
        };
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        this.setState({
            [name]: value,
        } as any)
    }

    fetchUserInfo = () => {
        fetch(`http://127.0.0.1:8000/getuserinfo/`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${this.state.auth_token}`
            },
        }).then(async response => {
            const res = await response.json();
            // console.log(res);
            this.setState({user: {uid: res.uid, accesslevel: res.accesslevel, username: res.username}, loginSuccessShow: true});
        });
    }

    submitLogin = () => {
        const loginContent = {
            username: this.state.username,
            password: this.state.password,
        }
        // console.log(loginContent);

        fetch(`http://localhost:8000/auth/token/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginContent)
        }).then(async response => {
            if (response.status === 200) {
                const res = await response.json();
                // console.log(res);
                this.setState({auth_token: res.auth_token});
                this.fetchUserInfo();
            } else {
                this.setState({loginErrorShow: true});
            }
        });
    }

    render() {
        return (
            <Modal show={this.props.show}
                   onHide={() => {this.props.onHide(this.state.user, this.state.auth_token);}}>
                <Modal.Header closeButton>
                    Log In
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
                                Don't tell anyone your password.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                                          name="password"
                                          placeholder="Password"
                                          onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" onClick={this.submitLogin}>
                            Submit
                        </Button>
                    </Form>
                    <Alert show={this.state.loginSuccessShow} variant="success">
                        <Alert.Heading>Success</Alert.Heading>
                        <p>
                            Successfully logged in!
                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({loginSuccessShow: false})}
                                    variant="outline-success">
                                Close
                            </Button>
                        </div>
                    </Alert>
                    <Alert show={this.state.loginErrorShow} variant="danger">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>
                            Log in failed. Check your username/password pair.
                        </p>
                        <hr/>
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => this.setState({loginErrorShow: false})}
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

export default LoginPage;
