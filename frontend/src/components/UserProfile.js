import React, { Component } from 'react';
import {Switch, Route, Redirect, withRouter, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, Label, Input, Col, FormFeedback,Row, Card, CardTitle, CardSubtitle, CardText, Modal, ModalHeader, ModalBody, NavbarText } from 'reactstrap';
import NavbarUser from './NavbarUser';

export default class UserProfile extends Component
{
    constructor()
    {
        super();
        this.state = {
            firstname: '',
            lastname: '',
            email:'',
            education: [],
            num_ed: null,
            skills: [],
            num_skill:null,
            edit: false,
            ex_skill:'',
            skills_initial : ['C', 'C++', 'Javascript', 'Python'],
            selectedFile: null,
            selectedFile_r : null,
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
            }
        }
        this.handleEdit = this.handleEdit.bind(this);
        this.incrementSkill = this.incrementSkill.bind(this);
        this.incrementEducation = this.incrementEducation.bind(this);
        this.decrementEducation = this.decrementEducation.bind(this);
        this.decrementSkill = this.decrementSkill.bind(this);
        this.executeStuff = this.executeStuff.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEdChange = this.handleEdChange.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.extraSkill = this.extraSkill.bind(this);
    }

    extraSkill()
    {
        if(this.state.edit === false)
            return false;
        var val = this.state.skills_initial;
        val.push(this.state.ex_skill);
        this.setState({
            skills_initial: val,
            ex_skill: ''
        })
    }

    validateSubmit()
    {
        if(this.state.edit === false)
        {
            alert("Please click on edit button before changing");
            return false;
        }
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

        var select = this.state.type;
        if(select === 'Select Type')
        {
            alert("Select the type of user");
            return false;
        }

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
        if(this.validateSubmit() === false)
            return;
        var data = this.state;
        axios({
            method: "PUT",
            url: "http://localhost:3000/applicants",
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
        this.executeStuff();
    }

    onFileChange = event => { 
     
        // Update the state 
        this.setState({ selectedFile: event.target.files[0] }); 
       
      }; 

      onFileChange_r = event => { 
     
        // Update the state 
        this.setState({ selectedFile_r: event.target.files[0] }); 
       
      }; 
       
      // On file upload (click the upload button) 
      onFileUpload = (event) => { 
        event.preventDefault();
       
        if(this.state.selectedFile === null)
        {
            alert("Please select a valid file");
            return;
        }
        const formData = new FormData(); 
       
        formData.append( 
          "imageFile", this.state.selectedFile
        ); 
              
        axios({
            method: "POST",
            url: "http://localhost:3000/applicants/uploadProfilePicture",
            data: formData,
            config: {
            headers: {
                'Content-Type' : 'multipart/formdata'
            }}

        }).then((response) => {
            alert("Uploaded profile picture successfully");
        })
        .catch((error) => {
            alert(JSON.stringify(error.response));
        })
      }; 
      
      onFileUpload_r = (event) => { 
        event.preventDefault();
       
        if(this.state.selectedFile_r === null)
        {
            alert("Please select a valid file");
            return;
        }
        const formData = new FormData(); 
       
        formData.append( 
          "textFile", this.state.selectedFile_r
        ); 
              
        axios({
            method: "POST",
            url: "http://localhost:3000/applicants/uploadResume",
            data: formData,
            config: {
            headers: {
                'Content-Type' : 'multipart/formdata'
            }}

        }).then((response) => {
            alert("Uploaded resume successfully");
        })
        .catch((error) => {
            alert(JSON.stringify(error.response));
        })
      }; 
  

    validate(firstname, lastname, email)
    {
        var errors = {
            firstname : '',
            lastname : '',
            password : '',
            email : '',
            select:'',
            education:[],
            skills:[]
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

        var i,n = this.state.num_ed;
        console.log(n);
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
        console.log(errors);
        return errors;
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

    handleEdChange(event) {
        if(this.state.edit === false)
            return;
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
        if(this.state.edit === false)
            return;
        const target = event.target;
        const value = target.value;
        var name = target.name;
        var temp = this.state.skills;
        temp[name] = value;
        this.setState({
            skills: temp
        })
    }

    incrementSkill(event)
    {
        if(this.state.edit === true)
        {
            var t_num = this.state.num_skill+1;
            var temp = this.state.skills;
            var temp1 = this.state.touched;
            temp1['skills'].push(false);
            temp.push('Select a skill');
            this.setState({
                skills: temp,
                num_skill: t_num,
                touched: temp1
            });
        }
    }

    incrementEducation(event)
    {
        if(this.state.edit === true)
        {
            var t_num = this.state.num_ed+1;
            var temp = this.state.education;
            var temp1 = this.state.touched;

            temp1['education'].push({education_name: false, education_start: false, education_end: false});
            temp.push({education_name:'', education_start:'', education_end:''});
            this.setState({
                education: temp,
                num_ed: t_num,
                touched: temp1
            });
        }
    }

    decrementEducation(event)
    {
        if(this.state.edit === true)
        {
            if(this.state.num_ed === 0)
            {
                return;
            }
            var temp1 = this.state.touched;
            temp1.education.pop();
            var t_num = this.state.num_ed-1;
            var temp = this.state.education;
            temp.pop();
            
            this.setState({
                education: temp,
                num_ed: t_num,
                touched: temp1
            })
        }
    }

    decrementSkill(event)
    {
        if(this.state.edit === true)
        {
            if(this.state.num_skill === 0)
            {
                return;
            }
            var t_num = this.state.num_skill - 1;
            var temp = this.state.skills;
            var temp1 = this.state.touched;
            temp1.skills.pop();
            temp.pop();
            this.setState({
                skills: temp,
                num_skill: t_num,
                touched: temp1
            });
        }
    }

    executeStuff()
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
            console.log(response);
            var data = response.data;
            var temp = data;
            var temp1 = temp.education;
            temp1 = Array.from(temp1);
            console.log(temp1)
            var temp2 = temp.skills;
            temp2 = Array.from(temp2);
            var i, n1=temp1.length;
            var temp3 = this.state.touched;
            temp3['education'] = [];
            for(i=0;i<n1;i++)
            {
                temp3['education'].push({education_name: false, education_start: false, education_end: false});
                if(temp1[i].education_end === null)
                    temp1[i].education_end = '';
            }
            n1 = temp2.length;
            temp3['skills'] = [];
            for(i=0;i<n1;i++)
            {
                temp3['skills'].push(false);
            }
            this.setState({
                firstname : data.firstname,
                lastname: data.lastname,
                email: data.email,
                education: temp1,
                num_ed: temp1.length,
                skills: temp2,
                num_skill: temp2.length,
                touched: temp3,
                edit: false
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }

    componentDidMount()
    {
        this.executeStuff();
    }

    render()
    {
        let skills = this.state.skills_initial;
        let skills_list = skills.length > 0 && skills.map((item, i) => {
            return(
                <option key={i} value={item}>{item}</option>
            )
        }, this);
        skills_list.push(<option selected disabled>Select a skill</option>)
        var temp_list = [];
        var i;
        var errors = this.validate(this.state.firstname, this.state.lastname, this.state.email);
        for(i=0;i<this.state.num_ed;i++)
        {
            let name_temp = i +"education_name";
            let start_temp = i +"education_start";
            let end_temp = i +"education_end";
            temp_list.push(
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
        var ski_list = [];
        for(i=0;i<this.state.num_skill;i++)
        {
            ski_list.push(
                <FormGroup row>
                    <Label htmlFor="skills" md={2}>Skills</Label>
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
                {temp_list}
            </div>
        );
        var button1 = <Button Col md={{size:3, offset:3}} onClick={this.incrementEducation}>Add one more education</Button>
        var button2 = <Button Col md={{size:3, offset:3}} onClick={this.decrementEducation}>Remove one education</Button>
        var button3 = <Button Col md={{size:3, offset:3}} onClick={this.incrementSkill}>Add one more skill field</Button>
        var button4 = <Button Col md={{size:3, offset:3}} onClick={this.decrementSkill}>Remove one skill field</Button>
        return(
            <div className="container">
                <NavbarUser />
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

                    {val}
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        {button1}
                        </Col>
                        <Col md={{size:3, offset:3}}>
                        {button2}
                        </Col>
                    </FormGroup>
                    {ski_list}
                    <FormGroup row>
                        <Col md={{size:3, offset:3}}>
                        {button3}
                        </Col>
                        <Col md={{size:3, offset:3}}>
                        {button4}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Label htmlFor="email" md={2}>Add to dropdown</Label>
                    <Col md={10}>
                        <Input type="text" name="ex_skill" value={this.state.ex_skill} onChange={this.handleChange} ></Input>
                       <Button onClick={this.extraSkill}>Add skill to dropdown</Button>
                    </Col>
                       
                   </FormGroup>
                   <FormGroup row>
                        <Label htmlFor="resume" md={2}>Resume</Label>
                        <Col md={10}>
                            <Input type="file" name="textFile" onChange={this.onFileChange_r}/>
                            <Button onClick={this.onFileUpload_r}>Upload!</Button>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="profilePic" md={2}>Profile Picture</Label>
                        <Col md={10}>
                            <Input type="file" name="imageFile" onChange={this.onFileChange} />
                            <Button onClick={this.onFileUpload}>Upload!</Button>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col md={{size:2, offset:2}}>
                        < Button  onClick={this.handleEdit}>Edit</Button>
                        </Col>
                        <Col md={{size:2, offset:2}}>
                        < Button  onClick={this.handleClear}>Clear</Button>
                        </Col>
                        <Col md={{size:2, offset:2}}>
                        < Button  onClick={this.handleSubmit}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
    
}