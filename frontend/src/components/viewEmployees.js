import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody, NavbarText } from 'reactstrap';
import NavbarRecruitment from './NavbarRecruiter';

export default class ViewEmployees extends Component
{
    constructor()
    {
        super();
        this.state = {
            applications: '',
            isModalOpen: false,
            rating: 'Select a Rating',
            appl_id: '',
            sortrating:0,
            sortdate: 0,
            sortname: 0,
            sortjobname: 0

        }
        this.executeStuff = this.executeStuff.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sortbytitle = this.sortbytitle.bind(this);
        this.sortdate = this.sortdate.bind(this);
        this.sortrating = this.sortrating.bind(this);
        this.sortname = this.sortname.bind(this);
    }

    sortname(event)
    {
        console.log("Clicked");
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
        console.log(!t);
    }

    sortdate(event)
    {
        var temp = this.state.applications;
        var t = this.state.sortdate;
        temp.sort(function(a,b)
        {
            return (1-2*t)*(new Date(a.joining_date) - new Date(b.joining_date));
        });
        this.setState({
            applications: temp,
            sortdate: !t
        })
    }

    sortbytitle(event)
    {
        var temp = this.state.applications;
        var t = this.state.sortjobname;
        temp.sort(function(a,b) {
            a = a.job_id.job_title;
            b = b.job_id.job_title;
            return (1-2*t)*(a.localeCompare(b));
        })
        this.setState({
            applications: temp,
            sortjobname : !t
        })
    }

    executeStuff()
    {
        axios({
            method: "GET",
            url: "http://localhost:3000/applications/employees",
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

    handleSubmit(event)
    {
        var appl_id = this.state.appl_id;
        var rat = this.state.rating;
        if(rat === "Select a Rating")
        {
            alert("Please select a rating before submitting");
            return;
        }
        rat = {"rating":rat, "application_id":appl_id};
        axios({
            method:"POST",
            url: "http://localhost:3000/applicants/rateApplicant",
            data: rat,
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then((response) => {
            alert("Rated successfully");
            console.log(response);
            this.setState({
                rating: 'Select a Rating',
                isModalOpen: false,
                appl_id: ''
            }, this.executeStuff())
        })
        .catch((error) => {
            alert(JSON.stringify(error.response));
        })
    }

    sortrating(event)
    {
        var temp = this.state.applications;
        var t = this.state.sortrating;
        temp.sort(function(a,b)
        {
            return(a.user_id.rating - b.user_id.rating)*(1-2*t);
        })
        this.setState({
            applications: temp,
            sortrating: !t
        })
        console.log(!t);
    }

    handleChange(event)
    {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name] : value
        });
    };

    toggleModal(event)
    {
        if(this.state.isModalOpen === false)
        {
            var temp = event.target.id;
            console.log(temp);
            this.setState({
                isModalOpen: true,
                appl_id : temp
            });
        }
        else
        {
            this.setState({
                isModalOpen: false,
                rating: 'Select a Rating',
                appl_id: ''
            });
        }
    }

    componentDidMount()
    {
        this.executeStuff()
    }

    render()
    {
        var temp_appl = Array.from(this.state.applications);
        temp_appl = temp_appl.map((application,i) => {
            
            return(
                <Row>
                    <Col>
                    <Card body>
                      <CardText>{application.job_id.job_title}</CardText>
                      <CardText>{application.user_id.firstname} {application.user_id.lastname}</CardText>
                      <CardText> {application.job_id.job_type}</CardText>
                      <CardText>{application.job_id.salary}</CardText>
                      <CardText>{application.status}</CardText>
                      <CardText>{application.user_id.rating}</CardText>
                      <Button id={application._id} onClick={this.toggleModal}>Rate</Button>
                    </Card>
                    </Col>
                </Row>
            )
        });
        return(
            <div className="container">
                <NavbarRecruitment />
                {temp_appl}
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} >
                    <ModalHeader toggle={this.toggleModal}>Rate</ModalHeader>
                    <ModalBody>
                        {this.state.appl_id}
                        <Form>
                        <FormGroup row>
                        <Label htmlFor="rating" md={2}>Rating</Label>
                        <Col md={10}>
                            <Input type="select" id="rating" name="rating" onChange={this.handleChange} value={this.state.rating} >
                                <option selected disabled> Select a Rating</option> 
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        <   Button  onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="name" id="name" onClick={this.sortname}>Sort By Name</Button></Col>
                </FormGroup>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="sortdate"  onClick={this.sortdate}>Sort By Date</Button></Col>
                </FormGroup>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="sortrating" id="rating" onClick={this.sortrating}>Sort By Rating</Button></Col>
                </FormGroup>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="" id="" onClick={this.sortbytitle}>Sort By Job Title</Button></Col>
                </FormGroup>
            </div>
        )
    }

}