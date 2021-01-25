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
            num_skill: 1,
            touched: {
                job_title: false,
                job_type: false,
                salary: false,
                duration: false,
                deadline: false,
                max_positions: false,
                max_applications: false,
                skills: [false]
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.incrementSkill = this.incrementSkill.bind(this);
        this.decrementSkill = this.decrementSkill.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
    }

    validateSubmit()
    {
        if(this.state.job_title.length === 0)
        {
            alert("Job Title is a required field");
            return false;
        }
        if(this.state.job_type==='Select Type')
        {
            alert("Job Type is a required field");
            return false;
        }
        if(this.state.duration==='Select Duration')
        {
            alert("Duration is a required field");
            return false;
        }
        if(this.state.salary <= 0 && this.state.salary !== '')
        {
            alert("Salary must be positive")
            return false;
        }
        if(this.state.salary === '')
        {
            alert("Salary is a required field");
            return false;
        }

        if(this.state.max_positions <= 0 && this.state.max_positions !=='')
        {
            alert("Maximum positions must be a positive number");
            return false;
        }
        if(this.state.max_positions==='')
        {
            alert("Maximum positions is a required field");
            return false;
        }
        
        if(this.state.max_applications <= 0 && this.state.max_applications !== '')
        {
            alert("Maximum applications must be positive");
            return false;
        }
        if(this.state.max_applications==='')
        {
            alert("Maximum applications is a required field");
            return false;
        }
        if(this.state.deadline === '')
        {
            alert("Deadline is a required field");
            return false;
        }
        if(new Date(this.state.deadline) - new Date(Date.now()) < 0)
        {
            alert("Deadline must be after the current date and time");
            return false;
        }
        var i, n = this.state.num_skill;
        for(i=0;i<n;i++)
        {
            if(this.state.touched.skills[i] && this.state.skills[i] === '')
            {
                alert("Every skill tab must be filled. Close the ones not required");
                return false;
            }
        }
        return true;
    }

    validate()
    {
        var errors = {
            job_title:'',
            job_type: '',
            duration: '',
            max_positions: '',
            max_applications: '',
            salary: '',
            deadline: '',
            skills:[]
        };

        if(this.state.touched.job_title && this.state.job_title.length === 0)
        {
            errors.job_title = "Job Title is a required field";
        }
        if(this.state.job_type==='Select Type' && this.state.touched.job_type)
        {
            errors.job_type = "Job Type is a required field";
        }
        if(this.state.duration==='Select Duration' && this.state.touched.duration)
        {
            errors.duration = "Duration is a required field";
        }
        if(this.state.salary <= 0 && this.state.touched.salary)
        {
            errors.salary = "Salary must be positive";
        }
        if(this.state.salary === '' && this.state.touched.salary)
        {
            errors.salary = "Salary is a required field";
        }

        if(this.state.max_positions <= 0 && this.state.touched.max_positions)
        {
            errors.max_positions = "Maximum positions must be a positive number";
        }
        if(this.state.max_positions==='' && this.state.touched.max_positions)
        {
            errors.max_positions = "Maximum positions is a required field";
        }
        
        if(this.state.max_applications <= 0 && this.state.touched.max_applications)
        {
            errors.max_applications = "Maximum applications must be a positive number";
        }
        if(this.state.max_applications==='' && this.state.touched.max_applications)
        {
            errors.max_applications = "Maximum applications is a required field";
        }
        if(this.state.deadline === '' && this.state.touched.deadline)
        {
            errors.deadline = "Deadline is a required field"
        }
        var i, n = this.state.num_skill;
        for(i=0;i<n;i++)
        {
            errors.skills.push('');
            if(this.state.touched.skills[i] && this.state.skills[i] === '')
            {
                errors.skills[i] = "Every skill tab must be filled. Close the ones not required";
            }
        }
        return errors;
    }

    handleSubmit(event)
    {
        event.preventDefault();
        if(this.validateSubmit() === false)
            return;
        console.log(this.state);
        axios({
            method: "POST",
            url: "http://localhost:3000/jobs/",
            data: this.state,
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then((response) => {
            alert("Job Creation successful");
            console.log(response);
            this.setState({
                job_title: '',
                job_type: 'Select Type',
                duration: 'Select Duration',
                salary: '',
                deadline: '',
                max_positions: '',
                max_applications: '',
                skills: [''],
                num_skill: 1,
                touched: {
                    job_title: false,
                    job_type: false,
                    salary: false,
                    duration: false,
                    deadline: false,
                    max_positions: false,
                    max_applications: false,
                    skills: [false]
                }})
        }).catch((error) => {
            alert(JSON.stringify(error.response));
        })
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

    handleBlur = (field) => (evt) => {
        this.setState({
            touched : { ...this.state.touched, [field]: true}
        }, console.log(this.state.touched));
    }

    handleBlurSkill = (i) => (evt) => {
        var temp = this.state.touched;
        console.log(temp);
        temp['skills'][i] = true;
        this.setState({
            touched: temp
        })
        console.log(temp);
    }

    incrementSkill(event)
    {
        var t_num = this.state.num_skill+1;
        var temp = this.state.skills;
        var temp1 = this.state.touched;
        temp1['skills'].push(false);
        temp.push('');
        this.setState({
            skills: temp,
            num_skill: t_num,
            touched: temp1
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
        var temp1 = this.state.touched;
        temp1['skills'].pop();
        temp.pop();
        this.setState({
            skills: temp,
            num_skill: t_num,
            touched: temp1
        });
    }

    render()
    {
        const errors = this.validate();
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
                    <Input type="text" id={i} name={i} value={this.state.skills[i]} onChange={this.handleSkillChange} onBlur={this.handleBlurSkill(i)} valid={errors.skills[i]=== ''} invalid={errors.skills[i] !== ''}/>
                    <FormFeedback>{errors.skills[i]}</FormFeedback>
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
                            <Input type="text" id="job_title" name="job_title" placeholder="Job Title" value={this.state.job_title} onChange={this.handleChange} onBlur={this.handleBlur('job_title')} valid={errors.job_title === ''} invalid={errors.job_title !== ''}/>
                            <FormFeedback>{errors.job_title}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="job_type" md={2}>Job Type</Label>
                        <Col md={3}>
                            <Input type="select" name="job_type" id="job_type" value={this.state.job_type} onChange={this.handleChange} onBlur={this.handleBlur('job_type')} valid={errors.job_type === ''} invalid={errors.job_type !== ''}>
                                <option selected disabled> Select Type</option> 
                                <option>Full-Time</option>
                                <option>Part-Time</option>
                                <option>Work From Home</option>
                            </Input>
                            <FormFeedback>{errors.job_type}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="duration" md={2}>Duration</Label>
                        <Col md={3}>
                            <Input type="select" name="duration" id="duration" value={this.state.duration} onChange={this.handleChange} onBlur={this.handleBlur('duration')} valid={errors.duration === ''} invalid={errors.duration !== ''}>
                                <option selected disabled> Select Duration</option> 
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                            </Input>
                            <FormFeedback>{errors.duration}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="salary" md={2}>Salary</Label>
                        <Col md={10}>
                            <Input type="number" id="salary" name="salary" value={this.state.salary} onChange={this.handleChange} onBlur={this.handleBlur('salary')} valid={errors.salary === ''} invalid={errors.salary !== ''}/>
                            <FormFeedback>{errors.salary}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="max_positions" md={2}>Maximum Number of Positions</Label>
                        <Col md={10}>
                            <Input type="number" id="max_positions" name="max_positions" value={this.state.max_positions} onChange={this.handleChange} onBlur={this.handleBlur('max_positions')} valid={errors.max_positions === ''}  invalid={errors.max_positions !== ''}/>
                            <FormFeedback>{errors.max_positions}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="max_applications" md={2}>Maximum Number of Applications</Label>
                        <Col md={10}>
                            <Input type="number" id="max_applications" name="max_applications" value={this.state.max_applications} onChange={this.handleChange} onBlur={this.handleBlur('max_applications')} valid={errors.max_applications === ''}  invalid={errors.max_applications !== ''}/>
                            <FormFeedback>{errors.max_applications}</FormFeedback>
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
                            <Input type="datetime-local" id="deadline" name="deadline" value={this.state.deadline} onChange={this.handleChange} onBlur={this.handleBlur('deadline')} valid={errors.deadline===''} invalid={errors.deadline!==''}/>
                            <FormFeedback>{errors.deadline}</FormFeedback>
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