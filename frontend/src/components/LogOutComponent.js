import React, {Component} from 'react';
import { Button} from 'reactstrap';
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
        alert("Logout Successful");
        window.location.replace("/home");
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
                <h2>Log Out</h2>
                <p> Are you sure you want to logout :( ?</p>
                <Button onClick={this.handleSubmit}>LogOut</Button>
            </div>
        )
    }
}