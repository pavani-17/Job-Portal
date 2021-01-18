import React, {Component} from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row } from 'reactstrap';
import {useForm} from 'react-hook-form';
import axios from 'axios';

export default class Register extends Component
{
    constructor()
    {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            type: 'Select Type',
            email:'',
            password: '',
            phone: '',
            bio: '',
            education: [{education_name:'', education_start:'', education_end:''}],
            num_ed: 1,
            skills: [''],
            num_skill:1,
            skills_initial : ['C', 'C++', 'Javascript', 'Python']
        }
        this.handleChange = this.handleChange.bind(this);
        this.newPostForm = this.newPostForm.bind(this);
        this.handleEdChange = this.handleEdChange.bind(this);
        this.incrementEducation = this.incrementEducation.bind(this);
        this.decrementEducation = this.decrementEducation.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.incrementSkill = this.incrementSkill.bind(this);
        this.decrementSkill = this.decrementSkill.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event)
    {
        event.preventDefault();
        if(this.state.type==="Applicant")
        {
            axios({
                method: "POST",
                url: "http://localhost:3000/signup/applicant",
                data: this.state,
                headers: {
                    'Content-Type' : 'application/json',
                }
            }).then((response) => {
                console.log(response);
            }).catch((err) => console.log(err));
        }
        else if(this.state.type==="Recruiter")
        {
            axios({
                method: "POST",
                url: "http://localhost:3000/signup/recruiter",
                data: this.state,
                headers: {
                    'Content-Type' : 'application/json',
                }
            }).then((response) => {
                console.log(response);
            }).catch((err) => console.log(err));
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

    handleEdChange(event) {
        const target = event.target;
        const value = target.value;
        var name = target.name;
        var i = name[0];
        var temp = this.state.education;
        name = name.slice(1);
        temp[i][name] = value;
        console.log(temp);
        this.setState({
            education: temp
        })
    }

    handleSkillChange(event) {
        const target = event.target;
        const value = target.value;
        var name = target.name;
        var temp = this.state.skills;
        temp[name] = value;
        this.setState({
            skills: temp
        })
    }
    
    incrementEducation(event)
    {
        var t_num = this.state.num_ed+1;
        var temp = this.state.education;
        temp.push({education_name:'', education_start:'', education_end:''});
        this.setState({
            education: temp,
            num_ed: t_num
        });
    }

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
    
    decrementEducation(event)
    {
        if(this.state.num_ed === 0)
        {
            return;
        }
        var t_num = this.state.num_ed-1;
        var temp = this.state.education;
        temp.pop();
        this.setState({
            education: temp,
            num_ed: t_num
        })
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

    newPostForm = (val) => {
        if(val === "Applicant")
        {
            const skills = this.state.skills_initial;
            let skills_list = skills.length > 0 && skills.map((item, i) => {
                return(
                    <option key={i} value={item}>{item}</option>
                )
            }, this);
            let ed_list = [];
            let i;
            for (i=0;i<this.state.num_ed;i++)
            {
                let name_temp = i +"education_name";
                let start_temp = i +"education_start";
                let end_temp = i +"education_end";
                ed_list.push(
                        <FormGroup row>
                            <Label htmlFor="education" md={2}></Label>
                            <Col md={10}>
                                <Input type="text" id={name_temp} name={name_temp} placeholder="School/College" value={this.state.education[i].education_name} onChange={this.handleEdChange}/>
                                <Input type="number" id={start_temp} name={start_temp} value={this.state.education[i].education_start} onChange={this.handleEdChange}/>
                                <Input type="number" id={end_temp} name={end_temp} value={this.state.education[i].education_end} onChange={this.handleEdChange}/>
                            </Col>
                        </FormGroup>
                        );
            }
            let ski_list =[];
            for(i=0;i<this.state.num_skill;i++)
            {
                ski_list.push(
                    <FormGroup row>
                        <Label htmlFor="skills" md={2}></Label>
                        <Col md={3}>
                            <Input type="select" id={i} name={i} value={this.state.skills[i]} onChange={this.handleSkillChange}>{skills_list}</Input>
                        </Col>
                    </FormGroup>
                );
            }
            let val = (
                <div>
                    <FormGroup row>
                        <Label htmlFor="education" md={2}>Education</Label>
                    </FormGroup>
                    {ed_list}
                </div>
            );
            var button1 = <Button Col md={{size:3, offset:3}} onClick={this.incrementEducation}>Add one more education</Button>
            var button2 = <Button Col md={{size:3, offset:3}} onClick={this.decrementEducation}>Remove one education</Button>
            var button3 = <Button Col md={{size:3, offset:3}} onClick={this.incrementSkill}>Add one more skill field</Button>
            var button4 = <Button Col md={{size:3, offset:3}} onClick={this.decrementSkill}>Remove one skill field</Button>
            return(
                <div className="applicant_form">
                   {val}
                   <FormGroup row>
                       {button1} {button2}
                   </FormGroup>
                   <Label htmlFor="skills" md={2}>Skills</Label>

                    {ski_list}
                    <FormGroup row>
                       {button3} {button4}
                   </FormGroup>
                   <FormGroup row>
                        <Label htmlFor="profilePic" md={2}>Profile Picture</Label>
                        <Col md={10}>
                            <Input type="file"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="resume" md={2}>Resume</Label>
                        <Col md={10}>
                            <Input type="file"/>
                        </Col>
                    </FormGroup>
                </div>
            );
        }
        else if(val === "Recruiter")
        {
            return(
                <div className="recruiter_form">
                    <FormGroup row>
                        <Label htmlFor="phone" md={2}>Contact Number</Label>
                        <Col md={10}>
                            <Input type="tel" id="phone" name="phone" placeholder="Contact Number" onChange={this.handleChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="bio" md={2}>Your Bio</Label>
                        <Col md={10}>
                            <Input type="textarea" id="bio" name="bio" rows="6" onChange={this.handleChange} ></Input>
                        </Col>
                    </FormGroup>
                </div>
            );
        }
        else
        {
            return null
        }
    }
    
    render() {
        let val = this.state.type;
        let temp_form = this.newPostForm(val);
        return(
            <div className="container">
                <Form>
                    <FormGroup row>
                        <Label htmlFor="firstname" md={2}>First Name</Label>
                        <Col md={10}>
                            <Input type="text" id="firstname" name="firstname" placeholder="First Name" onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="lastname" md={2}>Last Name</Label>
                        <Col md={10}>
                            <Input type="text" id="lastname" name="lastname" placeholder="Last Name" onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="email" md={2}>Email</Label>
                        <Col md={10}>
                            <Input type="email" id="email" name="email" placeholder="someone@example.com" onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="password" md={2}>Password</Label>
                        <Col md={10}>
                            <Input type="password" id="password" name="password" onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="type" md={2}>Type of User</Label>
                        <Col md={3}>
                            <Input type="select" name="type" value={this.state.type} onChange={this.handleChange}>
                                <option selected disabled> Select Type</option> 
                                <option>Applicant</option>
                                <option>Recruiter</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    {temp_form}
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        <   Button  onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}