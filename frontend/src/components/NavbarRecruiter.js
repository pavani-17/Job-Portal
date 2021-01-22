import React, {Component} from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default class NavbarRecruitment extends Component
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
                                    <NavLink className="nav-link" to='/recruiter/createJob'> Create a Job</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/recruiter/dashboard'>Dashboard</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/recruiter/employees'>My Employees</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/recruiter/profile'>Profile</NavLink>
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