import React from "react";
import { Button, Card } from "react-bootstrap";
import axios from "axios";
import host from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/forms.scss";

async function sendData(params) {
    console.log(params);
    const config = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        url: `${host}/signup`,
        data: params,
    };
    const creationState = await axios(config);
    return creationState.data.id;
}

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { history } = this.props;
        sendData(this.state).then(() => {
            history.push(`/Login`);
        });
    }

    render() {
        const { username, email, password } = this.state;
        return (
            <div className="forceCentered">
                <Card bg="dark" text="white" style={{ width: "18rem" }}>
                    <Card.Body>
                        <Card.Title>SignUp</Card.Title>
                        <form onSubmit={this.handleSubmit}>
                            <label htmlFor="username">
                                Username:
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={this.handleChange}
                                    className="textBox"
                                />
                            </label>
                            <label htmlFor="email">
                                Email:
                                <input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    className="textBox"
                                />
                            </label>
                            <label htmlFor="password">
                                Password:
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.handleChange}
                                    className="textBox"
                                />
                            </label>
                            <input
                                type="submit"
                                value="Submit"
                                className="btn btn-light"
                            />
                        </form>
                        <Button variant="dark" href="/Login">
                            Login
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default SignUp;
