import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody } from 'reactstrap';

export default class ViewApplicant extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            applications: [],
            sortrating:0,
            sortdate: 0,
            sortname: 0
        }
        this.executeStuff = this.executeStuff.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sortname = this.sortname.bind(this);
        this.sortdate = this.sortdate.bind(this);
        this.sortrating = this.sortrating.bind(this);
    }

    sortname(event)
    {
        var temp = this.state.applications;
        var t = this.state.sortname;
        temp.sort(function(a,b) {
            a = a.user_id.firstname + a.user_id.lastname;
            b = b.user_id.firstname + b.user_id.firstname;
            return (1-2*t)*(a.localeCompare(b))
        });
        this.setState({
            applications: temp,
            sortname: !t
        })
    }
    
    sortdate(event)
    {
        var temp = this.state.applications;
        var t = this.state.sortdate;
        temp.sort(function(a,b)
        {
            console.log((1-2*t)*(new Date(a.application_date) - new Date(b.application_date)), t);
            return (1-2*t)*(new Date(a.application_date) - new Date(b.application_date));
        });
        this.setState({
            applications: temp,
            sortdate: !t
        })
    }

    sortrating(event)
    {
        var temp = this.state.applications;
        var t = this.state.sortname;
        temp.sort(function(a,b)
        {
            return(a.user_id.rating - b.user_id.rating)*(1-2*t);
        })
        this.setState({
            applications: temp,
            sortrating: !t
        })
    }

    handleSubmit(event)
    {
        var name = event.target.name;
        var id = event.target.id;
        var data = {};
        data.status = name;
        axios({
            method: "PUT",
            url:"http://localhost:3000/applications/"+id,
            data: data,
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then((response) => {
            console.log(response);
            this.executeStuff();
            this.render();
        })
    }

    executeStuff()
    {
        var job_id = this.props.job_id;
        axios({
            method:"GET",
            url:"http://localhost:3000/applications/job/" + job_id,
            data: null,
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then((response) => {
            console.log(response.data);
            this.setState({
                applications: response.data
            })
        })
        .catch((err) => console.log(err))
    }

    componentDidMount()
    {
        this.executeStuff();
    }

    render()
    {
        var temp_appl = Array.from(this.state.applications);
        temp_appl = temp_appl.map((application,i) => {
            if(application.status === "Rejected")
            {
                return null;
            }
            var skills_list = application.user_id.skills.map((skill) => {
                return(
                    <p>{skill}</p>
                )
            });
            var ed_list = application.user_id.education.map((education) => {
                return(
                    <div>
                        <p>{education.name}</p>
                        <p>{education.start}</p>
                        <p>{education.end}</p>
                    </div>
                )
            });
            var button;
            var button2;
            if(application.status === "Applied")
            {
                button = <Button id={application._id} name="Shortlisted" onClick={this.handleSubmit}> Shortlist </Button>
                button2 = <Button id={application._id} name="Rejected" onClick={this.handleSubmit}>Reject</Button>
            }
            else if(application.status === "Shortlisted")
            {
                button = <Button id={application._id} name="Selected" onClick={this.handleSubmit}>Accept</Button>
                button2 = <Button id={application._id} name="Rejected" onClick={this.handleSubmit}>Reject</Button>
            }
            return(
                <Row>
                    <Col>
                    <Card body>
                      <CardText>{application.user_id.firstname}</CardText>
                      <CardText> {application.user_id.lastname}</CardText>
                      <CardText>{application.application_date}</CardText>
                      <CardText>{skills_list}</CardText>
                      <CardText>{ed_list}</CardText>
                      <CardText>{application.status}</CardText>
                      <CardText>{application.user_id.rating}</CardText>
                      {button}
                      {button2}
                    </Card>
                    </Col>
                </Row>
                
            )
        })
        return(
            <div className="container">
                {temp_appl}
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="name" id="name" onClick={this.sortname}>Sort By Name</Button></Col>
                </FormGroup>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="sortdate"  onClick={this.sortdate}>Sort By Date</Button></Col>
                </FormGroup>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="sortrating" id="rating" onClick={this.sortrating}>Sort By Rating</Button></Col>
                </FormGroup>
            </div>
        )
    }
} 