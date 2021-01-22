import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class PrivateRoute extends Component {
    render()
    {
        console.log("Came here");
        
        let isLoggedIn = this.props.isLoggedIn;
        let type = this.props.type;
        console.log(isLoggedIn, type, this.props.desiredType);
        console.log(this.props);
        if(!isLoggedIn)
        {
            return <Redirect to="/login" />
        }
        
        else
        {
            if(type !== this.props.desiredType)
            {
                return <Redirect to="/login" />
            }
            else
            {
                if(this.props.hasProps)
                {
                    return <Route to={this.props.path} render={(props) => this.props.component} />
                }
                else
                {
                    return <Route to={this.props.path} component={this.props.component} />
                }
            }
        }
        
    }
}