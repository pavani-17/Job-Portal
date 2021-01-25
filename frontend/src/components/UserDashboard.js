import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody, Table } from 'reactstrap';
import NavbarUser from './NavbarUser';
import Fuse from 'fuse.js';

export default class UserDashboard extends Component {
    constructor()
    {
        super();
        this.state = {
            jobs: '',
            applications: '',
            displayed_arr: '',
            sortsalary: 0,
            sortduration:0,
            sortrating:0,
            job_type: 'Select Type',
            begin_sal:null,
            end_sal:null,
            duration:'Select Duration',
            isModalOpen: false,
            job_id:'',
            sop:'',
            search: ''
        }
        this.sort = this.sort.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filter_val = this.filter_val.bind(this);
        this.updatearr = this.updatearr.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.executeStuff = this.executeStuff.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch()
    {
        var temp = this.state.displayed_arr;
        const fuse = new Fuse(temp, {
            keys: [
                'job_title'
            ]
        });
        temp = fuse.search(this.state.search);
        console.log(temp);
        var results = temp.map((val) => val.item);
        this.setState({
            displayed_arr: results
        })
    }

    validateSubmit()
    {
        if(this.state.sop === '')
        {
            alert("Please enter the SOP before submitting");
            return false;
        }
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

    handleClear(event)
    {
        window.location.reload();
    }
    handleSubmit(event)
    {
        if(this.validateSubmit() === false)
        {
            return;
        }
        var temp={};
        temp.job_id = this.state.job_id;
        temp.sop = this.state.sop;
        temp.status = "Applied";
        axios({
            method: "POST",
            url: "http://localhost:3000/applications/",
            data: temp,
            headers: {
                'Content-Type' : 'application/json',
            }
        })
        .then((response) =>  {
            console.log(response);
            alert("Applied successfully");
            this.executeStuff();
            this.toggleModal();
        })
        .catch((error) => {
            alert(JSON.stringify(error.response));
        })
    }

    toggleModal(event)
    {
        if(this.state.isModalOpen === false)
        {
            var temp = event.target.id;
            console.log(temp);
            this.setState({
                isModalOpen: true,
                job_id: temp
            });
        }
        else
        {
            this.setState({
                isModalOpen: false,
                job_id: '',
                sop:''
            });
        }
    }

    sort(event)
    {
        var temp = this.state.displayed_arr;
        var name = event.target.name;
        var id = event.target.id;
        var t = this.state[name];
        temp.sort(function(a, b) {
            if(a[id]!==undefined && b[id]!==undefined)
                return (1-2*t)*(a[id] - b[id]);
            else
                return 1;
        })
        this.setState({
            displayed_arr: temp,
            [name]: !t
        });
    }

    filter_val(event)
    {
        var temp = this.state.displayed_arr;
        if(this.state.job_type !== 'Select Type')
        {
            var check = this.state.job_type;
            temp = temp.filter(function(job){
                return job.job_type === check;
            }
            );
        }
        if(this.state.begin_sal !== null && this.state.end_sal!== null)
        {
            var begin = this.state.begin_sal;
            var end = this.state.end_sal;
            temp = temp.filter(function(job){
                return job.salary >= begin && job.salary <= end
            });
        }

        if(this.state.duration !== 'Select Duration')
        {
            check = this.state.duration;
            temp = temp.filter(function(job){
                return job.duration < check;
            });
        }

        this.setState({
            displayed_arr: temp
        })
    }

    updatearr()
    {
        let jobtemp = Array.from(this.state.jobs);
        let applications = Array.from(this.state.applications);
        applications = applications.map((appl) => {
            return appl.job_id._id;
        });
        jobtemp = jobtemp.map((job) => {
            var boolVar = applications.includes(job._id);
            if(boolVar=== true)
            {
                job.state = "Applied";
                return job;
            }
            else
            {
                if(job.rem_applications === 0 || job.rem_positions === 0)
                {
                    console.log("I am here")
                    job.state = "Full";
                    return job;
                }
                else
                {
                    job.state = "Apply";
                    return job;
                }
            }
        });
        this.setState({
            jobs: jobtemp,
            displayed_arr: jobtemp,
        });
    }

    executeStuff()
    {
        axios({
            method: "GET",
            url: "http://localhost:3000/jobs/",
            data: null,
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then((response) => {
            this.setState({
                jobs : response.data
            });
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
                    applications: response.data,
                }, function(){
                    this.updatearr()}
                    );
            })
            .catch((err) => console.log(err));
        }).catch((err) => console.log(err));
    }
    componentDidMount()
    {
        this.executeStuff();
    }
    render()
    {
        let jobtemp = Array.from(this.state.displayed_arr);
        let data = jobtemp.map((job) => {
            if(new Date(job.deadline) - new Date(Date.now()) < 0)
                return null;
            if(job.rem_positions === 0)
                return null;
            var button;
            if(job.state === "Apply")
            {
                button = <Button id={job._id} onClick={this.toggleModal}>{job.state}</Button>
            }
            else
            {
                button = <Button id={job._id}>{job.state}</Button>
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
                      <CardText>Remaining Applications : {job.rem_applications}</CardText>
                      <CardText>Remaining Positions : {job.rem_positions}</CardText>
                      <CardText>Type of Job : {job.job_type}</CardText>
                      <CardText>{job.user_id.firstname} {job.user_id.lastname}</CardText>
                      <CardText>{job.user_id.email}</CardText>
                      <CardText>{job.rating}</CardText>
                      {button}
                    </Card>
                  </Col>
                  </Row>
                )
            });
        return(
            <div className="container">
                <NavbarUser />
                {data}
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="sortsalary" id="salary" onClick={this.sort}>Sort By Salary</Button></Col>
                </FormGroup>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="sortduration" id="duration" onClick={this.sort}>Sort By Duration</Button></Col>
                </FormGroup>
                <FormGroup row>
                <Col md={{size:6, offset:3}}> <Button row name="sortrating" id="rating" onClick={this.sort}>Sort By Rating</Button></Col>
                </FormGroup>
                <Form>
                    <FormGroup row>
                        <Label htmlFor="job_type" md={2}>Job Type</Label>
                        <Col md={3}>
                            <Input type="select" name="job_type" id="job_type" value={this.state.job_type} onChange={this.handleChange}>
                                <option selected disabled> Select Type</option> 
                                <option>Full-Time</option>
                                <option>Part-Time</option>
                                <option>Work From Home</option>
                            </Input>
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label htmlFor="salary" md={2}>Salary</Label>
                            <Col md={{size:3, offset:2}}>
                                <Input type="number" name="begin_sal"value={this.state.begin_sal} onChange={this.handleChange}></Input>
                                <Input type="number" name="end_sal"value={this.state.end_sal} onChange={this.handleChange}></Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Label htmlFor="duration" md={2}>Duration</Label>
                        <Col md={3}>
                            <Input type="select" name="duration" id="duration" value={this.state.duration} onChange={this.handleChange}>
                                <option selected disabled> Select Duration</option> 
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                            </Input>
                        </Col>
                    </FormGroup>
                        <FormGroup row >
                            <Col md={{size:6, offset:3}}>
                        <Button name="filter_type" onClick={this.filter_val}> Apply</Button>
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Col md={{size:6, offset:3}}>
                        <Button onClick={this.handleClear}>Clear</Button>
                        </Col>
                        </FormGroup>
                </Form>
                <Form>
                    <Input type="text" name="search" value={this.state.search} onChange={this.handleChange}></Input>
                    <Button onClick={this.handleSearch}>Search</Button>
                    <Button onClick={this.handleClear}>Clear</Button>
                </Form>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} >
                    <ModalHeader toggle={this.toggleModal}>Apply</ModalHeader>
                    <ModalBody>
                        <Form>
                        <FormGroup row>
                        <Label htmlFor="sop" md={2}>SOP</Label>
                        <Col md={10}>
                            <Input type="textarea" id="sop" name="sop" rows="6" onChange={this.handleChange} value={this.state.sop} ></Input>
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