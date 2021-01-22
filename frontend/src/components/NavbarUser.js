import React, {Component} from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default class NavbarUser extends Component
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
                <Navbar light expand="md">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to='/applicant/dashboard'>Dashboard</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/applicant/applications'>My Applications</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/applicant/profile'>Profile</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/logout'>Logout</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
            </div>
        )
    }
}