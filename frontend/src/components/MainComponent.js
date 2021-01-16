import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import Register from './RegisterComponent';
import Login from './LoginComponent';
import axios from 'axios';

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
        this.setState({
            isLoggedIn : true,
            token: token,
            user_id : user_id,
            type : type
        })
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
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
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }

}
