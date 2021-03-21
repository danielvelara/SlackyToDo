import React from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import TaskAdmin from './TaskAdmin';
import Login from './Login';
import SignUp from './SignUp';
import '../styles/App.css';
import host from "../config";

axios.defaults.baseURL = host;
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

function Session() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/Dashboard/:Session" component={TaskAdmin} />
          <Route path="/SignUp" component={SignUp} />
          <Route path="/" component={Login} />
        </Switch>
      </div>
    </Router>
  );
}

export default Session;
