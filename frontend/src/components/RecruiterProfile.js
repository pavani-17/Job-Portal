import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import NavbarRecruitment from './NavbarRecruiter';
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
            edit: false,
            touched: {
                firstname : false,
                lastname: false,
                email: false,
                password: false,
                bio: false,
                phone: false
            }
        }
        this.executeStuff = this.executeStuff.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
    }

    validate(firstname, lastname, email)
    {
        var errors = {
            firstname : '',
            lastname : '',
            password : '',
            email : '',
            select:'',
            bio: '',
            phone: ''
        };

        if(this.state.touched.firstname && firstname.length === 0)
        {
            errors.firstname = 'First Name is required';
        }

        if(this.state.touched.lastname && lastname.length === 0)
        {
            errors.lastname = 'Last Name is required';
        }

        if(this.state.touched.email && email.length === 0)
        {
            errors.email = 'Email is required';
        }
        const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/
        if(this.state.touched.email && !reg.test(email) && email.length !== 0)
        {
            errors.email = 'Email is in wrong format'
        }

        const reg1 = /^\d{10}$/;
        if(this.state.touched.phone && !reg1.test(this.state.phone) && this.state.phone !== '')
        {
            errors.phone = "Phone number is in the wrong format"
        }
        var bio = this.state.bio;
        if(this.state.touched.bio && bio.split(' ').length > 250)
        {
            errors.bio = "Bio must have less than 250 words";
        }
        return errors;
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


    validateSubmit()
    {
        var firstname = this.state.firstname;
        if(firstname.length === 0)
        {
            alert("First name is required. Correct before submission");
            return false;
        }

        var lastname = this.state.lastname;
        if(lastname.length === 0)
        {
            alert("Last name is required. Correct before submission");
            return false;
        }

        var email = this.state.email;
        if(email.length === 0)
        {
            alert("email is required. Correct before submission");
            return false;
        }
        const reg = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+.+(?:.[a-zA-Z0-9-]))$/
        if(!reg.test(email))
        {
            alert("Make sure email format is correct");
            return false;
        }

        const reg1 = /^\d{10}$/;
        if(this.state.touched.phone && !reg1.test(this.state.phone) && this.state.phone !== '')
        {
            alert("Please use a valid phone number. Also note that it is not a required field");
            return false;
        }
        var bio = this.state.bio;
        if( bio.split(' ').length > 250)
        {
            alert("Bio must have less than 250 words");
            return false;
        }
        return true;
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

    handleBlur = (field) => (evt) => {
        this.setState({
            touched : { ...this.state.touched, [field]: true}
        }, console.log(this.state.touched));
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
        {
            alert("Please select the edit option");
            return;
        }
        if(this.validateSubmit() === false)
        {
            return;
        }
        var data = this.state;
        axios({
            method: "PUT",
            url: "http://localhost:3000/recruiters",
            data: data,
            headers: {
                'Content-Type' : 'application/json',
            }
        }).then((response) => {
            alert("Successfully updated profile");
            console.log(response);
        }).catch((error) => {
            alert(JSON.stringify(error.response));
        })
    }

    componentDidMount()
    {
        this.executeStuff();
    }

    render()
    {
        var errors = this.validate(this.state.firstname, this.state.lastname, this.state.email);
        return(
            <div className="container">
                
                <NavbarRecruitment />
                <h2>Profile</h2>
                <Form>
                <FormGroup row>
                        <Label htmlFor="firstname" md={2}>First Name</Label>
                        <Col md={10}>
                            <Input type="text" id="firstname" name="firstname" placeholder="First Name" required onChange={this.handleChange} value={this.state.firstname} onBlur={this.handleBlur('firstname')} valid={errors.firstname === ''} invalid={errors.firstname !== ''} />
                            <FormFeedback>{errors.firstname}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="lastname" md={2}>Last Name</Label>
                        <Col md={10}>
                            <Input type="text" id="lastname" name="lastname" placeholder="Last Name" onChange={this.handleChange} value={this.state.lastname} onBlur={this.handleBlur('lastname')} valid={errors.lastname === ''} invalid={errors.lastname !== ''}/>
                            <FormFeedback>{errors.lastname}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="email" md={2}>Email</Label>
                        <Col md={10}>
                            <Input type="email" id="email" name="email" placeholder="someone@example.com" onChange={this.handleChange} value={this.state.email}  onBlur={this.handleBlur('email')} valid={errors.email === ''} invalid={errors.email !== ''}/>
                            <FormFeedback>{errors.email}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="phone" md={2}>Contact Number</Label>
                        <Col md={10}>
                            <Input type="tel" id="phone" name="phone" placeholder="Contact Number" onChange={this.handleChange} onBlur={this.handleBlur('phone')} valid={errors.phone===''} invalid={errors.phone !== ''} value={this.state.phone}/>
                            <FormFeedback>{errors.phone}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="bio" md={2}>Your Bio</Label>
                        <Col md={10}>
                            <Input type="textarea" id="bio" name="bio" rows="6" onChange={this.handleChange} onBlur={this.handleBlur('bio')} valid={errors.bio===''} invalid={errors.bio !== ''} value={this.state.bio} />
                            <FormFeedback>{errors.bio}</FormFeedback>
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