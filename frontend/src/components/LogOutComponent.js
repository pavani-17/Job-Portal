import React, {Component} from 'react';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row } from 'reactstrap';
import NavbarUser from './NavbarUser';
import NavbarRecruitment from './NavbarRecruiter';

export default class Logout extends Component
{
    constructor(props)
    {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayNavbar = this.displayNavbar.bind(this);
    }

    handleSubmit()
    {
        this.props.attemptLogout();
        window.location.replace("/login");
    }

    displayNavbar()
    {
        if(this.props.type === "Applicant")
        {
            return <NavbarUser />
        }
        else
        {
            return <NavbarRecruitment />
        }
    }

    render()
    {
        const dis = this.displayNavbar();   
        return(
            <div className="container">
                {dis}
                <p> Are you sure you want to logout :( ?</p>
                <Button onClick={this.handleSubmit}>LogOut</Button>
            </div>
        )
    }
}