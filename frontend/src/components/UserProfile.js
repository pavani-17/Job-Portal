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
            num_skill:null
        }
    }
    componentDidMount()
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
            var data = response.data;
            this.setState({
                firstname : data.firstname,
                lastname: data.lastname,
                email: data.email,
                education: data.education,
                num_ed: data.education.length,
                skills: data.skills,
                num_skill: data.skills.len,
                edit:false
            })
        })
    }

    render()
    {
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
                        <Col md={{size:3, offset:3}}>
                        <   Button  onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
    
}