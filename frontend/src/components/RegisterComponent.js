import React, {Component} from 'react';
import { Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';
import axios from 'axios';
import NavbarDefault from './LoggedOutNav';

export default class Register extends Component
{
    constructor()
    {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            type: 'Select Type',
            email:'',
            password: '',
            phone: '',
            bio: '',
            ex_skill: '',
            education: [{education_name:'', education_start:'', education_end:''}],
            num_ed: 1,
            skills: ['Select a skill'],
            num_skill:1,
            skills_initial : ['C', 'C++', 'Javascript', 'Python'],
            touched: {
                firstname : false,
                lastname: false,
                email: false,
                password: false,
                select: false,
                education: [{education_name: false, education_start: false, education_end: false}],
                skills: [false],
                bio: false,
                phone: false
            }        }
        this.handleChange = this.handleChange.bind(this);
        this.newPostForm = this.newPostForm.bind(this);
        this.handleEdChange = this.handleEdChange.bind(this);
        this.incrementEducation = this.incrementEducation.bind(this);
        this.decrementEducation = this.decrementEducation.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.incrementSkill = this.incrementSkill.bind(this);
        this.decrementSkill = this.decrementSkill.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.validateApplicant = this.validateApplicant.bind(this);
        this.validateRecruiter = this.validateRecruiter.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
        this.extraSkill = this.extraSkill.bind(this);
    }

    extraSkill()
    {
        var val = this.state.skills_initial;
        val.push(this.state.ex_skill);
        this.setState({
            skills_initial: val,
            ex_skill: ''
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

        var password = this.state.password;
        if(password.length === 0)
        {
            alert("Password is required. Correct before submission");
            return false;
        }

        var select = this.state.type;
        if(select === 'Select Type')
        {
            alert("Select the type of user");
            return false;
        }

        if(select === "Applicant")
        {
            var i,n = this.state.num_ed;
            for(i=0;i<n;i++)
            {
                if(this.state['education'][i]['education_name'].length === 0)
                {
                    alert("Make sure all education fields have School/College");
                    return false;
                }

                if(this.state['education'][i]['education_start'] <= 0 && this.state['education'][i]['education_start'] !== '')
                {
                    alert("All education start years must be positive");
                    return false;
                }
                
                if(this.state['education'][i]['education_start'] === '')
                {
                    alert("All education start years are required fields");
                    return false;
                }

                if(this.state['education'][i]['education_end'] <= 0 && this.state['education'][i]['education_end'] !== '')
                {
                    alert("All education end years must be positive");
                    return false;
                }
            }
            n = this.state.num_skill;
            for(i=0;i<n;i++)
            {
                if(this.state['skills'][i] === 'Select a skill')
                {
                    alert("Please remove unnecessary skill fields");
                    return false;
                }
            }
        }
        else if(select === "Recruiter")
        {
            const reg = /^\d{10}$/;
            if(this.state.touched.phone && !reg.test(this.state.phone) && this.state.phone !== '')
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
        }
        return true;
    }

    validate(firstname, lastname, email, password, select)
    {
        var errors = {
            firstname : '',
            lastname : '',
            password : '',
            email : '',
            select:'',
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

        if(this.state.touched.password && password.length === 0)
        {
            errors.password = 'Password is required';
        }
        if(this.state.touched.select && select === 'Select Type')
        {
            errors.select = 'Please select the type of user';
        }
        return errors;
    }

    validateApplicant()
    {
        var errors = {
            education: [],
            skills : []
        }

        if(this.state.type === "Applicant")
        {
            var i,n = this.state.num_ed;
            for(i=0;i<n;i++)
            {
                errors.education.push({education_name:'', education_start: '', education_end:''});
                if(this.state.touched['education'][i]['education_name'] && this.state['education'][i]['education_name'].length === 0)
                {
                    errors.education[i]['education_name'] = 'School/College is required';
                }

                if(this.state.touched['education'][i]['education_start'] && this.state['education'][i]['education_start'] <= 0 && this.state['education'][i]['education_start'] !== '')
                {
                    errors.education[i]['education_start'] = 'Education Start Year must be positive';
                }
                
                if(this.state.touched['education'][i]['education_start'] && this.state['education'][i]['education_start'] === '')
                {
                    errors.education[i]['education_start'] = 'Education Start Year is required';
                }

                if(this.state.touched['education'][i]['education_end'] && this.state['education'][i]['education_end'] <= 0 && this.state['education'][i]['education_end'] !== '')
                {
                    errors.education[i]['education_end'] = 'Education End Year must be positive';
                }
            }

            n = this.state.num_skill;
            for(i=0;i<n;i++)
            {
                errors.skills.push('');
                console.log(this.state.touched['skills'][i]);
                if(this.state.touched['skills'][i] && this.state['skills'][i] === 'Select a skill')
                {
                    errors['skills'][i] = "Skill is compulsory. Please remove the skill if not required"
                }
            }
        }
        return errors;
    }

    validateRecruiter()
    {
        var errors= {
            bio: '',
            phone: '',
        };

        if(this.state.type === "Recruiter")
        {
            const reg = /^\d{10}$/;
            if(this.state.touched.phone && !reg.test(this.state.phone) && this.state.phone !== '')
            {
                errors.phone = "Phone number is in the wrong format"
            }
            var bio = this.state.bio;
            if(this.state.touched.bio && bio.split(' ').length > 250)
            {
                errors.bio = "Bio must have less than 250 words";
            }
        }
        return errors;
    }

    handleSubmit(event)
    {
        event.preventDefault();
        if(this.state.type === "Select Type")
        {
            alert("Select a type of user before proceeding");
            return;
        }
        if(this.validateSubmit() === false)
        {
            return;
        }
        if(this.state.type==="Applicant")
        {
            axios({
                method: "POST",
                url: "http://localhost:3000/signup/applicant",
                data: this.state,
                headers: {
                    'Content-Type' : 'application/json',
                }
            }).then((response) => {
                console.log(response);
                alert("Your registration is successful");
                window.location.replace("/login");
            }).catch((error) => {
                alert(JSON.stringify(error.response));
            })
        }
        else if(this.state.type==="Recruiter")
        {
            axios({
                method: "POST",
                url: "http://localhost:3000/signup/recruiter",
                data: this.state,
                headers: {
                    'Content-Type' : 'application/json',
                }
            }).then((response) => {
                console.log(response);
                alert("Your registration is successful");
                window.location.replace("/login");
            }).catch((error) => {
                alert(JSON.stringify(error.response));
            })
        }
        
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched : { ...this.state.touched, [field]: true}
        }, console.log(this.state.touched));
    }

    handleBlurEd = (i, field) => (evt) => {
        var temp = this.state.touched;
        temp['education'][i][field] = true;
        this.setState({
            touched: temp
        })
        console.log(temp);
    }

    handleBlurSkill = (i) => (evt) => {
        var temp = this.state.touched;
        temp['skills'][i] = true;
        this.setState({
            touched: temp
        })
        console.log(temp);
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
    
    incrementEducation(event)
    {
        var t_num = this.state.num_ed+1;
        var temp = this.state.education;
        var temp1 = this.state.touched;

        temp.push({education_name:'', education_start:'', education_end:''});
        temp1['education'].push({education_name: false, education_start: false, education_end: false});
        this.setState({
            education: temp,
            num_ed: t_num,
            touched: temp1
        });
    }

    incrementSkill(event)
    {
        var t_num = this.state.num_skill+1;
        var temp = this.state.skills;
        var temp1 = this.state.touched;
        temp1['skills'].push(false);
        temp.push('Select a skill');
        console.log(temp1);
        this.setState({
            skills: temp,
            num_skill: t_num,
            touched: temp1
        });
    }
    
    decrementEducation(event)
    {
        if(this.state.num_ed === 0)
        {
            return;
        }
        var t_num = this.state.num_ed-1;
        var temp = this.state.education;
        var temp1 = this.state.touched;
        temp1.education.pop();
        temp.pop();
        this.setState({
            education: temp,
            num_ed: t_num,
            touched: temp1
        })
    }
    decrementSkill(event)
    {
        if(this.state.num_skill === 0)
        {
            return;
        }
        var t_num = this.state.num_skill - 1;
        var temp = this.state.skills;
        temp.pop();
        var temp1 = this.state.touched;
        temp1['skills'].pop();
        this.setState({
            skills: temp,
            num_skill: t_num,
            touched: temp1
        });
    }

    newPostForm = (val) => {
        if(val === "Applicant")
        {
            var errors = this.validateApplicant();
            const skills = this.state.skills_initial;
            let skills_list = skills.length > 0 && skills.map((item, i) => {
                return(
                    <option key={i} value={item}>{item}</option>
                )
            }, this);
            skills_list.push(<option selected disabled>Select a skill</option>)
            let ed_list = [];
            let i;
            for (i=0;i<this.state.num_ed;i++)
            {
                let name_temp = i +"education_name";
                let start_temp = i +"education_start";
                let end_temp = i +"education_end";
                ed_list.push(
                        <FormGroup row>
                            <Label htmlFor="education" md={2}></Label>
                            <Col md={10}>
                                <Input type="text" id={name_temp} name={name_temp} placeholder="School/College" value={this.state.education[i].education_name} onChange={this.handleEdChange} onBlur={this.handleBlurEd(i, "education_name")} valid={errors.education[i]['education_name'] === ''} invalid={errors.education[i]['education_name'] !== ''}/>
                                <FormFeedback>{errors.education[i]['education_name']}</FormFeedback>
                                <Input type="number" id={start_temp} name={start_temp} value={this.state.education[i].education_start} onChange={this.handleEdChange} onBlur={this.handleBlurEd(i, "education_start")} valid={errors.education[i]['education_start'] === ''} invalid={errors.education[i]['education_start'] !== ''}/>
                                <FormFeedback>{errors.education[i]['education_start']}</FormFeedback>
                                <Input type="number" id={end_temp} name={end_temp} value={this.state.education[i].education_end} onChange={this.handleEdChange}  onBlur={this.handleBlurEd(i, "education_end")} valid={errors.education[i]['education_end'] === ''} invalid={errors.education[i]['education_end'] !== ''}/>
                                <FormFeedback>{errors.education[i]['education_end']}</FormFeedback>
                            </Col>
                        </FormGroup>
                        );
            }
            let ski_list =[];
            for(i=0;i<this.state.num_skill;i++)
            {
                ski_list.push(
                    <FormGroup row>
                        <Label htmlFor="skills" md={2}></Label>
                        <Col md={3}>
                            <Input type="select" id={i} name={i} value={this.state.skills[i]} onChange={this.handleSkillChange} onBlur={this.handleBlurSkill(i)} valid={errors.skills[i] === ''} invalid={errors.skills[i] !== ''}>{skills_list}</Input>
                            <FormFeedback>{errors.skills[i]}</FormFeedback>
                        </Col>
                    </FormGroup>
                );
            }
            let val = (
                <div>
                    <FormGroup row>
                        <Label htmlFor="education" md={2}>Education</Label>
                    </FormGroup>
                    {ed_list}
                </div>
            );
            var button1 = <Button Col md={{size:3, offset:3}} onClick={this.incrementEducation}>Add one more education</Button>
            var button2 = <Button Col md={{size:3, offset:3}} onClick={this.decrementEducation}>Remove one education</Button>
            var button3 = <Button Col md={{size:3, offset:3}} onClick={this.incrementSkill}>Add one more skill field</Button>
            var button4 = <Button Col md={{size:3, offset:3}} onClick={this.decrementSkill}>Remove one skill field</Button>
            return(
                <div className="applicant_form">
                   {val}
                   <FormGroup row>
                       {button1} {button2}
                   </FormGroup>
                   <Label htmlFor="skills" md={2}>Skills</Label>

                    {ski_list}
                    <FormGroup row>
                       {button3} {button4}
                   </FormGroup>
                   <FormGroup row>
                       <Label md={2} htmlFor="extra_ed">Add education</Label>
                       <Col md={10}>
                       <Input type="text" name="ex_skill" value={this.state.ex_skill} onChange={this.handleChange} ></Input>
                       </Col>
                       <Button onClick={this.extraSkill}>Add skill to dropdown</Button>
                   </FormGroup>
                </div>
            );
        }
        else if(val === "Recruiter")
        {
            const errors = this.validateRecruiter();
            return(
                <div className="recruiter_form">
                    <FormGroup row>
                        <Label htmlFor="phone" md={2}>Contact Number</Label>
                        <Col md={10}>
                            <Input type="tel" id="phone" name="phone" placeholder="Contact Number" value={this.state.phone} onChange={this.handleChange} onBlur={this.handleBlur('phone')} valid={errors.phone===''} invalid={errors.phone !== ''}/>
                            <FormFeedback>{errors.phone}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="bio" md={2}>Your Bio</Label>
                        <Col md={10}>
                            <Input type="textarea" id="bio" name="bio" rows="6" onChange={this.handleChange} value={this.state.bio} onBlur={this.handleBlur('bio')} valid={errors.bio===''} invalid={errors.bio !== ''} />
                            <FormFeedback>{errors.bio}</FormFeedback>
                        </Col>
                    </FormGroup>
                </div>
            );
        }
        else
        {
            return null
        }
    }
    
    render() {
        let val = this.state.type;
        let temp_form = this.newPostForm(val);
        const errors = this.validate(this.state.firstname, this.state.lastname, this.state.email, this.state.password, this.state.type);
        return(
            <div className="container">
                <NavbarDefault/>
                <h2>Create a New User</h2>
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
                        <Label htmlFor="password" md={2}>Password</Label>
                        <Col md={10}>
                            <Input type="password" id="password" name="password" onChange={this.handleChange} onBlur={this.handleBlur('password')} valid={errors.password === ''} invalid={errors.password !== ''}/>
                            <FormFeedback>{errors.password}</FormFeedback>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="type" md={2}>Type of User</Label>
                        <Col md={3}>
                            <Input type="select" name="type" value={this.state.type} onChange={this.handleChange} onBlur={this.handleBlur('select')} valid={errors.select === ''} invalid={errors.select !== ''}>
                                <option selected disabled> Select Type</option> 
                                <option>Applicant</option>
                                <option>Recruiter</option>
                            </Input>
                            <FormFeedback> {errors.select}</FormFeedback>
                        </Col>
                    </FormGroup>
                    {temp_form}
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        <   Button  onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}