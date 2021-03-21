import React from "react";
import axios from "axios";
import { Nav, NavDropdown, Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import "../styles/dashboard.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "../config";

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint react/forbid-prop-types: 0 */


const close = (session) => alert(`Closing Session ${session}`);

class TaskAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskList: [],
        };
        const { match } = this.props;
        this.session = match.params.Session;
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createTask = this.createTask.bind(this);
    }

    componentDidMount() {
        const config = {
            method: "GET",
            url: `${host}/tasks`,
            params: {
                "user_id": this.session,
            },
        };
        axios(config).then((res) => {
            this.setState({ taskList: res.data });
        }).catch(error => {
            console.log(error);
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        this.createTask().then(() => {
            this.componentDidMount();
            this.hideModal();
        });
    }

    showModal() {
        this.setState({ show: true });
    }

    hideModal() {
        this.setState({ show: false });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async removeTask(id) {
        const config = {
            method: "DELETE",
            url: `${host}/tasks/${id}`,
            data: {
                user_id: parseInt(this.session),
            },
        };
        const deleteState = await axios(config);
        this.componentDidMount();
        return deleteState.data;
    }

    async createTask() {
        const { newTaskName, description} = this.state;
        const config = {
          method: 'POST',
          url: `${host}/tasks`,
          data: {
            "user_id": this.session,
            "title": newTaskName,
            "description": description
          },
        };
        const creationState = await axios(config);
        return creationState.data;
    }

    searchTasks() {
        const { taskList } = this.state;
        if (!taskList || taskList.length === 0) {
            return <div className="task-not-found">There are no Tasks</div>;
        }
        const arr = taskList.map((element) => (
            <div className="task" key={element.id}>
                <div>
                    <p>{element.title}</p>
                    <p>{element.description}</p>
                    <Button
                        variant="success"
                        onClick={() => this.removeTask(element.id)}
                    >
                        ✓
                    </Button>
                </div>
            </div>
        ));
        return arr;
    }

    render() {
        const { show } = this.state;
        return (
            <div className="dashboard">
                <Nav
                    className="justify-content-end top-bar"
                    onSelect={() => close(this.session)}
                >
                    <NavDropdown title="Options" id="nav-dropdown">
                        <NavDropdown.Item eventKey="LogOut" href="/Login">
                            Log Out
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Button
                    variant="dark"
                    className="add-button"
                    onClick={this.showModal}
                >
                    +
                </Button>
                <Modal centered show={show} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Task</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <label htmlFor="newTaskName">
                                <div className="input-label">Task Name:</div>
                                <input
                                    type="text"
                                    id="newTaskName"
                                    name="newTaskName"
                                    value={this.newTaskName}
                                    onChange={this.handleChange}
                                    className="textBox"
                                />
                            </label>
                            <label htmlFor="task-name">
                                <div className="input-label">Description:</div>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={this.description}
                                    onChange={this.handleChange}
                                    className="textBox"
                                />
                            </label>
                        </Modal.Body>
                        <Modal.Footer>
                            <input
                                type="submit"
                                value="Submit"
                                className="btn btn-light"
                            />
                        </Modal.Footer>
                    </form>
                </Modal>
                <div className="task-deck">{this.searchTasks()}</div>
            </div>
        );
    }
}

TaskAdmin.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default TaskAdmin;
