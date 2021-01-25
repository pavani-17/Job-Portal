import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import Register from './RegisterComponent';
import Login from './LoginComponent';
import axios from 'axios';
import CreateJob from './CreateJob';
import UserDashboard from './UserDashboard';
import UserApplication from './UserApplications';
import UserProfile from './UserProfile';
import RecruiterProfile from './RecruiterProfile';
import RecruiterDashboard from './RecruiterDashboard';
import ViewApplicant from './viewApplicants';
import ViewEmployees from './viewEmployees';
import PrivateRoute from './PrivateRoute';
import Logout from './LogOutComponent';
import Home from './HomeComponent';

export default class Main extends Component {
    constructor(){
        super();
        this.state = {
            isLoggedIn : false,
            token: null,
            user_id: null,
            type: null
        };
        this.attemptLogin = this.attemptLogin.bind(this);
        this.attemptLogout = this.attemptLogout.bind(this);
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

    attemptLogout()
    {
        if(localStorage && localStorage.token && localStorage.user_id && localStorage.type)
        {
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_id");
        }
        this.setState({
            isLoggedIn: false,
            token: null,
            type: null,
            user_id: null
        });
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

        const viewApplicants = ({match}) => {
            if(this.state.isLoggedIn === false || this.state.type !== "Recruiter")
            {
                return(
                    <Redirect to="/login" />
                )
            }
            return(
                <ViewApplicant job_id={match.params.jobId}/>
            );
        }

        return(
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route path='/home' component={Home} />
                        <Route path='/register' component={Register} />
                        <Route path='/login' component={() => <Login attemptLogin={this.attemptLogin} />} />
                        <Route path='/recruiter/createJob'  
                            render={
                                (props) => <PrivateRoute {...props} isLoggedIn={this.state.isLoggedIn} type={this.state.type} desiredType="Recruiter" path="/recruiter/createJob"  hasProps={false} component={CreateJob}/>
                            }/>
                        <Route path='/applicant/dashboard' 
                            render={
                                (props) => <PrivateRoute {...props} isLoggedIn={this.state.isLoggedIn} type={this.state.type} desiredType="Applicant" path="/applicant/dashboard" hasProps={false} component={UserDashboard} />
                            }/>
                        <Route path='/applicant/applications' 
                            render={
                                (props) => <PrivateRoute {...props} isLoggedIn={this.state.isLoggedIn} type={this.state.type} desiredType="Applicant" path="/applicant/applications" hasProps={false} component={UserApplication} />
                            }/>
                        <Route path='/applicant/profile' 
                            render={
                                (props) => <PrivateRoute {...props} isLoggedIn={this.state.isLoggedIn} type={this.state.type} desiredType="Applicant" path="/applicant/profile" hasProps={false} component={UserProfile} />
                            }/>
                        <Route path='/recruiter/profile' 
                            render={
                                (props) => <PrivateRoute {...props} isLoggedIn={this.state.isLoggedIn} type={this.state.type} desiredType="Recruiter" path="/recruiter/profile" hasProps={false} component={RecruiterProfile} />
                            }/>
                        <Route path='/recruiter/dashboard' 
                            render={
                                (props) => <PrivateRoute {...props} isLoggedIn={this.state.isLoggedIn} type={this.state.type} desiredType="Recruiter" path="/recruiter/dashboard" hasProps={false} component={RecruiterDashboard} />
                            }/>
                        <Route path='/recruiter/viewJob/:jobId' component={viewApplicants} />
                        <Route path='/recruiter/employees'
                            render={
                                (props) => <PrivateRoute {...props} isLoggedIn={this.state.isLoggedIn} type={this.state.type} desiredType="Recruiter" path="/recruiter/employees" hasProps={false} component={ViewEmployees} />
                            }/>
                        <Route path='/logout' component={() => <Logout type={this.state.type} attemptLogout={this.attemptLogout}/>} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }

}
