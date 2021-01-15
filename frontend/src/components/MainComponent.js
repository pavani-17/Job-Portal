import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import Register from './RegisterComponent';

export default class Main extends Component {
    constructor(){
        super();
        this.state = {
            isLoggedIn : false,
            token: null,
            user: null
        }
    }
    attemptLogin(token, user) {
        localStorage.setItem("token",token);
        this.setState = {
            isLoggedIn : true,
            token: token,
            user: user
        };
    }    
    render()
    {
        return(
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route path='/register' component={Register} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }

}
