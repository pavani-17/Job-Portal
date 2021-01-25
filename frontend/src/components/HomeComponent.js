import React, {Component} from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import NavbarDefault from './LoggedOutNav';

export default class Home extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            isNavOpen: false
        }
        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav()
    {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        })
    }
    render()
    {
        return(
            <div>
                <NavbarDefault />
                <div>
                    <p>New User? Head up to signup and register yourself</p>
                    <Link to={`/register`}><Button>Go to Signup</Button></Link>
                </div>
                <div>
                    <p>Already a customer? Login so that we can recognise you</p>
                    <Link to={`/login`}><Button>Go to Login</Button></Link>
                </div>
            </div>
        )
    }
}