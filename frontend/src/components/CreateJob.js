import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row } from 'reactstrap';
import axios from 'axios';
import NavbarRecruitment from './NavbarRecruiter';

export default class CreateJob extends Component
{
    constructor()
    {
        super();
        this.state = {
            job_title: '',
            job_type: 'Select Type',
            duration: 'Select Duration',
            salary: '',
            deadline: '',
            max_positions: '',
            max_applications: '',
            skills: [''],
            num_skill: 1
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.incrementSkill = this.incrementSkill.bind(this);
        this.decrementSkill = this.decrementSkill.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event)
    {
        event.preventDefault();
        console.log(this.state);
        axios({
            method: "POST",
            url: "http://localhost:3000/jobs/",
            data: this.state,
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then((response) => {
            console.log(response);
        }).catch((err) => console.log(err));
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

    handleSkillChange(event) {
        const target = event.target;
        const value = target.value;
        var name = target.name;
        var temp = this.state.skills;
        temp[name] = value;
        this.setState({
            skills: temp
        })
    };

    incrementSkill(event)
    {
        var t_num = this.state.num_skill+1;
        var temp = this.state.skills;
        temp.push('');
        this.setState({
            skills: temp,
            num_skill: t_num
        });
    }

    decrementSkill(event)
    {
        if(this.state.num_skill === 0)
        {
            return;
        }
        var t_num = this.state.num_skill - 1;
        var temp = this.state.skills;
        temp.pop();
        this.setState({
            skills: temp,
            num_skill: t_num
        });
    }

    render()
    {
        var skil_list = [];
        var button1 = <Button Col md={{size:3, offset:3}} onClick={this.incrementSkill}>Add one more skill field</Button>
        var button2 = <Button Col md={{size:3, offset:3}} onClick={this.decrementSkill}>Remove one skill field</Button>
        var i;
        for(i=0;i<this.state.num_skill;i++)
        {
            skil_list.push(
                <FormGroup row>
                <Label htmlFor="skills" md={2}></Label>
                <Col md={10}>
                    <Input type="text" id={i} name={i} value={this.state.skills[i]} onChange={this.handleSkillChange}/>
                </Col>
            </FormGroup>)
        }
        return (
            <div className="container">
                <NavbarRecruitment />
                <Form>
                    <FormGroup row>
                        <Label htmlFor="job_title" md={2}>Job Title</Label>
                        <Col md={10}>
                            <Input type="text" id="job_title" name="job_title" placeholder="Job Title" value={this.state.job_title} onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
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
                        <Label htmlFor="duration" md={2}>Duration</Label>
                        <Col md={3}>
                            <Input type="select" name="duration" id="duration" value={this.state.duration} onChange={this.handleChange}>
                                <option selected disabled> Select Duration</option> 
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>

                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="salary" md={2}>Salary</Label>
                        <Col md={10}>
                            <Input type="number" id="salary" name="salary" value={this.state.salary} onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="max_positions" md={2}>Maximum Number of Positions</Label>
                        <Col md={10}>
                            <Input type="number" id="max_positions" name="max_positions" value={this.state.max_positions} onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="max_applications" md={2}>Maximum Number of Applications</Label>
                        <Col md={10}>
                            <Input type="number" id="max_applications" name="max_applications" value={this.state.max_applications} onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="skills" md={2}>Skills</Label>
                        {skil_list}
                        {button1} {button2}
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="deadline" md={2}>Deadline</Label>
                        <Col md={10}>
                            <Input type="datetime-local" id="deadline" name="deadline" value={this.state.deadline} onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        <   Button  onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}