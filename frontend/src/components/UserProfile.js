import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody, NavbarText } from 'reactstrap';

export default class UserProfile extends Component
{
    constructor()
    {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            email:'',
            education: '',
            num_ed: null,
            skills: '',
            num_skill:null,
            edit: false,
            skills_initial : ['C', 'C++', 'Javascript', 'Python']
        }
        this.handleEdit = this.handleEdit.bind(this);
        this.incrementSkill = this.incrementSkill.bind(this);
        this.incrementEducation = this.incrementEducation.bind(this);
        this.decrementEducation = this.decrementEducation.bind(this);
        this.decrementSkill = this.decrementSkill.bind(this);
        this.executeStuff = this.executeStuff.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEdChange = this.handleEdChange.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEdit()
    {
        this.setState({
            edit:true
        });
    }

    handleClear()
    {
        this.executeStuff();
    }

    handleSubmit(event)
    {
        if(this.state.edit === false)
            return;
        var data = this.state;
        axios({
            method: "PUT",
            url: "http://localhost:3000/applicants",
            data: data,
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then((response) => {
            console.log(response);
        }).catch((err) => console.log(err));
        this.executeStuff();
    }

    handleChange(event)
    {
        if(this.state.edit === true)
        {
            const target = event.target;
            const value = target.value;
            const name = target.name;
            this.setState({
                [name] : value
            });
        }
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

    incrementSkill(event)
    {
        if(this.state.edit === true)
        {
            var t_num = this.state.num_skill+1;
            var temp = this.state.skills;
            temp.push('');
            this.setState({
                skills: temp,
                num_skill: t_num
            });
        }
    }

    incrementEducation(event)
    {
        if(this.state.edit === true)
        {
            var t_num = this.state.num_ed+1;
            var temp = this.state.education;
            temp.push({education_name:'', education_start:'', education_end:''});
            this.setState({
                education: temp,
                num_ed: t_num
            });
        }
    }

    decrementEducation(event)
    {
        if(this.state.edit === true)
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
    }

    decrementSkill(event)
    {
        if(this.state.edit === true)
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
    }

    executeStuff()
    {
        axios({
            method: "GET",
            url: "http://localhost:3000/applicants",
            data: null,
            headers: {
                'Content-Type' : 'application/json',
            }
        })
        .then((response) => {
            console.log(response);
            var data = response.data;
            var temp = data;
            var temp1 = temp.education;
            temp1 = Array.from(temp1);
            console.log(temp1)
            var temp2 = temp.skills;
            temp2 = Array.from(temp2);
            this.setState({
                firstname : data.firstname,
                lastname: data.lastname,
                email: data.email,
                education: temp1,
                num_ed: temp1.length,
                skills: temp2,
                num_skill: temp2.length,
                edit: false
            });
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
        let skills = this.state.skills_initial;
        let skills_list = skills.length > 0 && skills.map((item, i) => {
            return(
                <option key={i} value={item}>{item}</option>
            )
        }, this);
        var temp_list = [];
        var i;
        for(i=0;i<this.state.num_ed;i++)
        {
            let name_temp = i +"education_name";
            let start_temp = i +"education_start";
            let end_temp = i +"education_end";
            temp_list.push(
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
        var ski_list = [];
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
                {temp_list}
            </div>
        );
        var button1 = <Button Col md={{size:3, offset:3}} onClick={this.incrementEducation}>Add one more education</Button>
        var button2 = <Button Col md={{size:3, offset:3}} onClick={this.decrementEducation}>Remove one education</Button>
        var button3 = <Button Col md={{size:3, offset:3}} onClick={this.incrementSkill}>Add one more skill field</Button>
        var button4 = <Button Col md={{size:3, offset:3}} onClick={this.decrementSkill}>Remove one skill field</Button>
        return(
            <div className="container">
                <Form>
                    <FormGroup row>
                        <Label htmlFor="firstname" md={2}>First Name</Label>
                        <Col md={10}>
                            <Input type="text" id="firstname" name="firstname" placeholder="First Name" onChange={this.handleChange} value={this.state.firstname}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="lastname" md={2}>Last Name</Label>
                        <Col md={10}>
                            <Input type="text" id="lastname" name="lastname" placeholder="Last Name" onChange={this.handleChange} value={this.state.lastname}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="email" md={2}>Email</Label>
                        <Col md={10}>
                            <Input type="email" id="email" name="email" placeholder="someone@example.com" onChange={this.handleChange} value={this.state.email}/>
                        </Col>
                    </FormGroup>
                    {val}
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        {button1}
                        </Col>
                        <Col md={{size:3, offset:3}}>
                        {button2}
                        </Col>
                    </FormGroup>
                    {ski_list}
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        {button3}
                        </Col>
                        <Col md={{size:3, offset:3}}>
                        {button4}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        < Button  onClick={this.handleEdit}>Edit</Button>
                        </Col>
                        <Col md={{size:3, offset:3}}>
                        < Button  onClick={this.handleClear}>Clear</Button>
                        </Col>
                        <Col md={{size:3, offset:3}}>
                        < Button  onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
    
}