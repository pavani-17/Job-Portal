import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody, NavbarText } from 'reactstrap';
import NavbarUser from './NavbarUser';

export default class UserApplication extends Component {
    constructor()
    {
        super();
        this.state = {
            applications: '',
            applicationId: '',
            rating: 'Select a Rating',
            isModalOpen: false,
            appl_id: '',
            job_id: ''
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event)
    {
        var temp = this.state.job_id;
        var rat = this.state.rating;
        var id = this.state.appl_id;
        rat = {"rating": rat, "application_id":id};    
        axios({
            method: "POST",
            url: "http://localhost:3000/jobs/rateJob/" + temp,
            data: rat,
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then((response) => {
            console.log(response);
            this.setState({
                rating:'Select a Rating',
                isModalOpen: false,
                job_id: '',
                appl_id: ''
            })
        })
        .catch((err) => console.log(err));
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
            var name = event.target.name;
            console.log(name);
            console.log(temp);
            this.setState({
                isModalOpen: true,
                job_id: temp,
                appl_id : name
            });
        }
        else
        {
            this.setState({
                isModalOpen: false,
                job_id: '',
                rating: 'Select a Rating',
                appl_id: ''
            });
        }
    }

    componentDidMount()
    {
        axios({
            method: "GET",
            url : "http://localhost:3000/applications/applicant",
            data: null,
            headers: {
                'Content-Type' : 'application/json',
            }
        })
        .then((response) => {
            console.log(response.data);
            this.setState({
                applications: response.data
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
    render()
    {
        var appl_temp = Array.from(this.state.applications);
        appl_temp = appl_temp.map((application) => {
            var button = null;
            if(application.status === "Selected" && application.rated === false)
            {
                button =  (
                        <Button id={application.job_id._id} name={application._id} onClick={this.toggleModal}>Rate</Button>
                );
            }            
            return(
            <Row>
                <Col>
                    <Card body>
                      <CardTitle tag="h5">{application.job_id.job_title}</CardTitle>
                      <CardText>Id : {application.job_id._id}</CardText>
                      <CardText>Skills : {application.job_id.skills}</CardText>
                      <CardText>Duration: {application.job_id.duration}</CardText>
                      <CardText>Salary: {application.job_id.salary}</CardText>
                      <CardText>Type of Job : {application.job_id.job_type}</CardText>
                      <CardText>{application.job_id.user_id.firstname} {application.job_id.user_id.lastname}</CardText>
                      <CardText>{application.job_id.user_id.email}</CardText>
                      <CardText>{application.status}</CardText>
                      {button}
                    </Card>
                </Col>
            </Row>
            );
        })
        return(
            <div className="container">
                <NavbarUser />
                {appl_temp}
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
            </div>
        )
    }
}