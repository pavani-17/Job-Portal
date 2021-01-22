import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter, Link} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody } from 'reactstrap';
import NavbarRecruitment from './NavbarRecruiter';

export default class RecruiterDashboard extends Component
{
    constructor()
    {
        super();
        this.state = {
            jobs: [],
            isModalOpen:false,
            cur_job:'',
        }
        this.executeStuff = this.executeStuff.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this); 
        this.deleteJob = this.deleteJob.bind(this);
    }

    deleteJob(event)
    {
        var job_id = event.target.id;
        axios({
            method:"DELETE",
            url:"http://localhost:3000/jobs/"+job_id,
            data: null,
            headers: {
                'Content-type' : 'application/json'
            }
        })
        .then((response) => {
            console.log(response);
            this.executeStuff();
            this.render();
        })
        .catch((err) => console.log(err));
    }

    handleChange(event)
    {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const temp1 = this.state.cur_job;
        temp1[name] = value;
        this.setState({
            cur_job: temp1,
        });
    };
    toggleModal(event)
    {
        if(this.state.isModalOpen === false)
        {
            var index = event.target.id;
            var temp = this.state.jobs;
            this.setState({
                isModalOpen: true,
                cur_job: temp[index],
            })
        }
        else
        {
            this.setState({
                isModalOpen: false,
                cur_job: '',
                min_applications:'',
                min_positions:'0'
            })
        }
    }

    handleSubmit(event)
    {
        var job = this.state.cur_job;
        axios({
            method:"PUT",
            url: "http://localhost:3000/jobs/"+job._id,
            data: job, 
            headers: {
                'Content-type' :'application/json'
            }
        })
        .then((response) => {
            console.log(response);
            this.executeStuff();
        })
        .catch((err) => console.log(err));
    }

    executeStuff()
    {
        axios({
            method: "GET",
            url: "http://localhost:3000/jobs/recruiter",
            data: null,
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then((response) => {
            console.log(response.data);
            this.setState({
                jobs: response.data,
                isModalOpen: false
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    componentDidMount()
    {
        this.executeStuff();
    }

    render()
    {
        var temp_job = Array.from(this.state.jobs);
        temp_job = temp_job.map((job,i) => {
            if(job.rem_positions === 0)
            {
                return null;
            }
            return(
                <Row>
                <Col>
                    <Card body>
                      <CardTitle tag="h5">{job.job_title}</CardTitle>
                      <CardText>Id : {job._id}</CardText>
                      <CardText>Skills : {job.skills}</CardText>
                      <CardText>Deadline : {job.deadline}</CardText>
                      <CardText>Duration: {job.duration}</CardText>
                      <CardText>Salary: {job.salary}</CardText>
                      <CardText>Maximum Applications : {job.max_applications}</CardText>
                      <CardText>Maximum Positions : {job.max_positions}</CardText>
                      <CardText>Remaining Applications : {job.rem_applications}</CardText>
                      <CardText>Remaining Positions : {job.rem_positions}</CardText>
                      <CardText>Type of Job : {job.job_type}</CardText>
                      <Button id={i} onClick={this.toggleModal}>Edit</Button>
                      <Button id={job._id} onClick={this.deleteJob}>Delete Job</Button>
                      <Link to={`/recruiter/viewJob/${job._id}`}><Button> View Applications</Button> </Link>
                    </Card>
                </Col>
            </Row>
            )
        })
        console.log(this.state);
        return(
            <div className="container">
                <NavbarRecruitment />
                {temp_job}
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} >
                    <ModalHeader toggle={this.toggleModal}>Apply</ModalHeader>
                    <ModalBody>
                        <Form>
                        <FormGroup row>
                        <Label htmlFor="deadline" md={2}>Deadline</Label>
                        <Col md={10}>
                            <Input type="timedate-local" id="deadline" name="deadline" rows="deadline" onChange={this.handleChange} value={this.state.cur_job.deadline} ></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="max_applications" md={2}>Maximum Applications</Label>
                        <Col md={10}>
                            <Input type="number" id="max_applications" name="max_applications" rows="max_applications" onChange={this.handleChange} value={this.state.cur_job.max_applications} ></Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="max_positions" md={2}>Maximum Positions</Label>
                        <Col md={10}>
                            <Input type="number" id="max_positions" name="max_positions" rows="max_positions" onChange={this.handleChange} value={this.state.cur_job.max_positions} ></Input>
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