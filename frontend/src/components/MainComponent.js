import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import Register from './RegisterComponent';
import Login from './LoginComponent';
import axios from 'axios';
import CreateJob from './CreateJob';
import UserDashboard from './UserDashboard';

export default class Main extends Component {
    constructor(){
        super();
        this.state = {
            isLoggedIn : false,
            token: null,
            user_id: null,
            type: null
        }
        this.attemptLogin = this.attemptLogin.bind(this);
    }
    attemptLogin(token, user_id, type) {
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("type",type);
        this.setState({
            isLoggedIn : true,
            token: token,
            user_id : user_id,
            type : type
        })
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }    
    componentWillMount() {
        console.log("This will print");
        if(localStorage && localStorage.token)
        {
            this.attemptLogin(localStorage.token, localStorage.user_id, localStorage.type);
        }
    }
    componentDidMount() {
        console.log(this.state);
    }
    render()
    {
        return(
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route path='/register' component={Register} />
                        <Route path='/login' component={() => <Login attemptLogin={this.attemptLogin} />} />
                        <Route path='/createJob' component={CreateJob} />
                        <Route path='/userDashboard' component={UserDashboard} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }

}
