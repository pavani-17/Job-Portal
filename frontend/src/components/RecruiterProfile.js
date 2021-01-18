import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody } from 'reactstrap';

export default class Recruitment extends Component
{
    constructor()
    {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            email:'',
            phone:'',
            bio:'',
            edit: false
        }
        this.executeStuff = this.executeStuff.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    executeStuff()
    {
        axios({
            method: "GET",
            url: "http://localhost:3000/recruiters",
            data: null,
            headers: {
                'Content-Type' : 'application/json',
            }
        })
        .then((response) => {
            console.log(response.data);
            this.setState({
                firstname: response.data.firstname,
                lastname: response.data.lastname,
                email: response.data.email,
                phone: response.data.phone,
                bio: response.data.bio,
                edit: false
            })
        })
        .catch((err) => {
            console.log(err);
        })
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
            url: "http://localhost:3000/recruiters",
            data: data,
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then((response) => {
            console.log(response);
        }).catch((err) => console.log(err));
        this.executeStuff();
    }

    componentDidMount()
    {
        this.executeStuff();
    }

    render()
    {
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
                    <FormGroup row>
                        <Label htmlFor="phone" md={2}>Contact Number</Label>
                        <Col md={10}>
                            <Input type="tel" id="phone" name="phone" placeholder="Contact Number" onChange={this.handleChange} value={this.state.phone} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="bio" md={2}>Your Bio</Label>
                        <Col md={10}>
                            <Input type="textarea" id="bio" name="bio" rows="6" onChange={this.handleChange} value={this.state.bio} />
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