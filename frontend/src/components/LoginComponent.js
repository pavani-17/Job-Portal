import React, {Component} from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row } from 'reactstrap';
import axios from 'axios';
import NavbarDefault from './LoggedOutNav';
export default class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state ={
            email: '',
            password: '',
            type: 'Select Type'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event)
    {
        event.preventDefault();
        if(this.state.type==="Applicant")
        {
            axios({
                method: "POST",
                url: "http://localhost:3000/login/applicant",
                data: this.state,
                headers: {
                    'Content-Type' : 'application/json',
                }
            }).then((response) => {
                if(response.data.success === true)
                {
                    this.props.attemptLogin(response.data.token, response.data.user_id, this.state.type);
                    alert("Login successful");
                    window.location.replace("/applicant/dashboard");
                }
            }).catch((error) => {
                alert(JSON.stringify(error.response));
            })
        }
        else if(this.state.type==="Recruiter")
        {
            axios({
                method: "POST",
                url: "http://localhost:3000/login/recruiter",
                data: this.state,
                headers: {
                    'Content-Type' : 'application/json',
                }
            }).then((response) => {
                if(response.data.success === true)
                {
                    this.props.attemptLogin(response.data.token, response.data.user_id, this.state.type);
                    alert("Login successful");
                    window.location.replace("/recruiter/dashboard");
                }
            }).catch((error) => {
                alert(JSON.stringify(error.response));
            })
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

    render()
    {
        return(
            <div className="container">
                <NavbarDefault/>
                <Form>
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
                    <FormGroup row>
                        <Label htmlFor="email" md={2}>Email</Label>
                        <Col md={10}>
                            <Input type="email" id="email" name="email" value={this.state.email} placeholder="someone@example.com" onChange={this.handleChange}/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="password" md={2}>Password</Label>
                        <Col md={10}>
                            <Input type="password" id="password" name="password" value={this.state.password} onChange={this.handleChange}/>
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