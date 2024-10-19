import React, { Component } from "react";
import "../../Admin.css";
import {
	Container,
	Grid,
	Form,
	Label,
	Divider,
	Icon,
	Header,
	Loader,
	Dimmer,
	Select,
	Segment,
	Button,
	List,
	Message,
	Popup,
	Modal,
	Image,
	Menu,
	Flag,
} from "semantic-ui-react";
import config from "../../../../services/config";
import user from "../../../../services/user";
import axios from "axios";
import _ from "underscore";
import attachments from "../../../../services/attachments";
import payment from "../../../../services/payment";
import otc from "../../../../services/otc";
import isoCurrencies from "../../../../common/ISO4217";
import Eth from "../../../../img/eth.svg";
import theter from '../../../../img/tether-seeklogo.svg';
import { Document, Page } from "react-pdf";
import ReactTable from "react-table";
import prefits from "../../../../common/prefits";
import userService from "../../../../services/user";
class EditPersonalData extends Component {
	constructor(props) {
		super(props);
		this.state = {

            firstName: '',
			equalfirstName: true,
            lastName: '',
			equallastName: true,
            gender: '',
			equalgender: true,
            typeDocumentIdentity: '',
			equaltypeDocumentIdentity: true,
            numberDocumentIdentity: '',
			equalnumberDocumentIdentity: true,
            birthdate: '',
			equalbirthdate: true,
            countryOfBirth: '',
			equalcountryOfBirth: true,
            birthplace: '',
			equalbirthplace: true,
            userDirection: '',
			equaluserDirection: true,
            phone: '',
            questionSecurity: '',
			equalquestionSecurity: true,
            answerSecurity: '',
			equalanswerSecurity: true,
            familyName: '',
			equalfamilyName: true,
            familyEmail: '',
			equalfamilyEmail: true,
			email: '',
			equalEmail: true,
			prefit: prefits.country,
            sexList: [
                { key: "m", value: "male", text: "Masculino" },
                { key: "f", value: "female", text: "Femenino" }
            ],
            documentTypes: [
        { key: "i", value: "id", text: "ID" },
        { key: "dn", value: "dni", text: "DNI" },
        { key: "cd", value: "cedula", text: "Cedula" },
        { key: "pass", value: "passport", text: "Pasaporte" },
        { key: "ot", value: "other", text: "Otro" }
      ],
        }
    }
    componentDidMount() {
        this.loadData(this.props.userInfo);
    }

	initializeStatusUpdate(nameFied){
		switch (nameFied) {
			case "firstName": this.setState({equalfirstName: true})
			break;
			case "familyEmail": this.setState({equalfamilyEmail: true})
			break;
			case "familyName": this.setState({equalfamilyName: true})
			break;
			case "birthplace": this.setState({equalbirthplace: true})
			break;
			case "birthdate": this.setState({equalbirthdate: true})
			break;
			case "countryOfBirth": this.setState({equalcountryOfBirth: true})
			break;
			case "questionSecurity": this.setState({equalquestionSecurity: true})
			break;
			case "email": this.setState({equalEmail: true})
			break;
			case "userDirection": this.setState({equaluserDirection: true})
			break;
			case "gender": this.setState({equalgender: true})
			break;
			case "lastName": this.setState({equallastName: true})
			break;
			case "answerSecurity": this.setState({equalanswerSecurity: true})
			break;
			case "typeDocumentIdentity": this.setState({equaltypeDocumentIdentity: true})
			break;
			case "numberDocumentIdentity": this.setState({equalnumberDocumentIdentity: true})
			break;
		
			default:
				break;
		}

	}

	async updateDataExistInUser(user, field, value) {
    let body = {
      userName: user,
      fieldName: field,
      fieldValue: value,
    };
	this.initializeStatusUpdate(field);
    	try {
      		let response = await userService.updateUserData(body);

      	if (response.data === "OK") {
        	return true;
      	} else {
       	 return false;
      	}
    } catch (error) {
      return false;
    }
  	}

    formatDateModal(date) {
		let regi = "es-ES";
		let cad = "";
		var options = {
			year: "numeric",
			month: "short",
			day: "2-digit",
		};
		let data = date.toLocaleString(regi, options);
		if (regi === "es-ES") {
			data = data.split(" ");
			let day = data[0];
			let month = data[1];
			data[0] = month;
			data[1] = day;

			for (date of data) {
				cad = cad + " " + date;
			}
		} else {
			cad = data;
		}

		return cad;
	}


    handleFirstName(e, data) {

		this.setState({
			firstName: data.value,
			equalfirstName: this.props.userInfo.firstName === data.value 
		});

	}

    handleLastName(e, data) {

		this.setState({
			lastName: data.value,
			equallastName: this.props.userInfo.lastName === data.value
		});

	}

    handleGender(e, data) {
		this.setState({ 
			gender: data.value ,
			equalgender: this.props.userInfo.gender === data.value 
		});
	}

    handleTypeDocumentIdentity(e, data) {
		this.setState({ 
			typeDocumentIdentity: data.value ,
			equaltypeDocumentIdentity: this.props.userInfo.typeDocumentIdentity === data.value
		 });
	}

    handleNumberDocumentIdentity(e, data) {
		this.setState({ 
			numberDocumentIdentity: data.value,
			equalnumberDocumentIdentity: this.props.userInfo.numberDocumentIdentity === data.value  
		});
	}

    handleBirthdate(e, data) {
		this.setState({ 
			birthdate: data.value ,
			equalbirthdate: this.props.userInfo.birthdate === data.value 
		});
	}

    handleCountryOfBirth(e, data) {
		this.setState({ 
			countryOfBirth: data.value,
			equalcountryOfBirth: this.props.userInfo.countryOfBirth === data.value 
		});
	}

    handleBirthplace(e, data) {
		this.setState({ 
			birthplace: data.value ,
			equalbirthplace: this.props.userInfo.birthplace === data.value
		});
	}

    handleUserDirection(e, data) {
		this.setState({ 
			userDirection: data.value ,
			equaluserDirection: this.props.userInfo.userDirection === data.value 
		});
	}

    handlePhone(e, data) {
		this.setState({ 
			phone: data.value ,
			equalphone: this.props.userInfo.phone === data.value 
		});
	}

    handleQuestionSecurity(e, data) {
		this.setState({
			 questionSecurity: data.value,
			 equalquestionSecurity: this.props.userInfo.questionSecurity === data.value
		});
	}

	handleEmail(e, data) {
		this.setState({
			 email: data.value,
			 equalEmail: this.props.userInfo.email === data.value
		});
	}

    handleAnswerSecurity(e, data) {
		this.setState({
			answerSecurity: data.value,
			equalanswerSecurity: this.props.userInfo.answerSecurity === data.value
		});
	}


    handleFamilyName(e, data) {
		this.setState({
			familyName: data.value,
			equalfamilyName: this.props.userInfo.familyName === data.value
		});
	}

    handleFamilyEmail(e, data) {
		this.setState({
			familyEmail: data.value,
			equalfamilyEmail: this.props.userInfo.familyEmail === data.value  
		});
	}

    loadData(userInfo) {
		//console.log('userInfo ', userInfo);
        this.setState({
			userName: userInfo.name,
            firstName: userInfo.firstName !== undefined &&
													userInfo.firstName!== ""
														? userInfo.firstName
														: "No posee",
            lastName: userInfo.lastName !== undefined &&
													userInfo.lastName!== ""
														? userInfo.lastName
														: "No posee",
            gender: userInfo.gender !== undefined &&
													userInfo.gender!== ""
														? userInfo.gender
														: "No posee",
            typeDocumentIdentity: userInfo.typeDocumentIdentity !== undefined &&
													userInfo.typeDocumentIdentity!== ""
														? userInfo.typeDocumentIdentity
														: "No posee",
            numberDocumentIdentity: userInfo.numberDocumentIdentity !== undefined &&
													userInfo.numberDocumentIdentity!== ""
														? userInfo.numberDocumentIdentity
														: "No posee",
            birthdate: userInfo.birthdate !== undefined &&
													userInfo.birthdate!== ""
														? userInfo.birthdate
														: "No posee",
            countryOfBirth: userInfo.countryOfBirth !== undefined &&
													userInfo.countryOfBirth!== ""
														? userInfo.countryOfBirth
														: "No posee",
            phone: userInfo.phone !== undefined &&
													userInfo.phone!== ""
														? userInfo.phone
														: "No posee",
            birthplace: userInfo.birthplace !== undefined &&
													userInfo.birthplace!== ""
														? userInfo.birthplace
														: "No posee",
            userDirection: userInfo.userDirection !== undefined &&
													userInfo.userDirection!== ""
														? userInfo.userDirection
														: "No posee",
            questionSecurity: userInfo.questionSecurity !== undefined &&
													userInfo.questionSecurity!== ""
														? userInfo.questionSecurity
														: "No posee",
			email: userInfo.email !== undefined &&
													userInfo.email!== ""
														? userInfo.email
														: "No posee",
            answerSecurity: userInfo.answerSecurity !== undefined &&
													userInfo.answerSecurity!== ""
														? userInfo.answerSecurity
														: "No posee",
            familyName: userInfo.familyName !== undefined &&
													userInfo.familyName!== ""
														? userInfo.familyName
														: "No posee",
            familyEmail: userInfo.familyEmail !== undefined &&
													userInfo.familyEmail!== ""
														? userInfo.familyEmail
														: "No posee"
        });
    }

	updateData(){

		if(!this.state.equalfirstName) {
			console.log('update firstName');
			this.updateDataExistInUser(this.state.userName, "firstName",this.state.firstName);
		}
		if(!this.state.equallastName) {
			console.log('update lastName');
			setTimeout(() => {
				this.updateDataExistInUser(this.state.userName, "lastName",this.state.lastName);
			}, 200);
		}
		if(!this.state.equalanswerSecurity){
			setTimeout(() => {
				this.updateDataExistInUser(this.state.userName, "answerSecurity",this.state.answerSecurity);
			}, 300);
		}
		if(!this.state.equalbirthdate){
			setTimeout(() => {
				this.updateDataExistInUser(this.state.userName, "birthdate",this.state.birthdate);
			}, 400);
			
		}
		if(!this.state.equalbirthplace){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "birthplace",this.state.birthplace);
			}, 500);
		}
		if(!this.state.equalcountryOfBirth){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "countryOfBirth",this.state.countryOfBirth);
			}, 600);
		}
		if(!this.state.equalfamilyEmail){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "familyEmail",this.state.familyEmail);
			}, 700);
		}
		if(!this.state.equalfamilyName){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "familyName",this.state.familyName);
			}, 800);
		}
		if(!this.state.equalgender){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "gender",this.state.gender);
			}, 900);
		}

		if(!this.state.equaltypeDocumentIdentity){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "typeDocumentIdentity",this.state.typeDocumentIdentity);
			}, 1000);
		}

		if(!this.state.equalnumberDocumentIdentity){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "numberDocumentIdentity",this.state.numberDocumentIdentity);
			}, 1100);
		}
		if(!this.state.equalquestionSecurity){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "questionSecurity",this.state.questionSecurity);
			}, 1200);
		}
		if(!this.state.equaluserDirection){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "userDirection",this.state.userDirection);
			}, 1300);
		}

		if(!this.state.equalphone){
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "phone", this.state.phone);
			}, 1300);
		}

		if(!this.state.equalEmail) {
			setTimeout(() => {
			this.updateDataExistInUser(this.state.userName, "email", this.state.email);
			}, 1400);
		}

		this.props.userInfo.firstName = this.state.firstName;
		this.props.userInfo.lastName = this.state.lastName;
		this.props.userInfo.birthdate = this.state.birthdate;
		this.props.userInfo.birthplace = this.state.birthplace;
		this.props.userInfo.answerSecurity = this.state.answerSecurity;
		this.props.userInfo.countryOfBirth = this.state.countryOfBirth;
		this.props.userInfo.familyEmail = this.state.familyEmail;
		this.props.userInfo.familyName = this.state.familyName;
		this.props.userInfo.gender = this.state.gender;
		this.props.userInfo.typeDocumentIdentity = this.state.typeDocumentIdentity;
		this.props.userInfo.numberDocumentIdentity = this.state.numberDocumentIdentity;
		this.props.userInfo.questionSecurity = this.state.questionSecurity;
		this.props.userInfo.userDirection = this.state.userDirection;
		this.props.userInfo.phone = this.state.phone;
		this.props.userInfo.email = this.state.email;

		//console.log('this.props.userInfo ', this.props.userInfo);
		this.props.updateInfo(this.props.userInfo);

		
		this.setState({
				colorMessage: "green",
				message: "Datos actualizados exitosamente"
			}, ()=>{
				setTimeout(() => {
						this.setState({ colorMessage: "", message: "" });
			}, 6000);
		})
	}

    render() {
    	let list = [];
    	if (this.state.prefit.length > 0) {
      		for (let pre of this.state.prefit) {
        		if (pre.value !== "") {
          			if (pre.nombre === "Canada") {
            			let valu2 = pre.value + "C"
         				list.push({ text: pre.nombre, value: valu2, key: pre.iso2 });
          			} else {
            			list.push({ text: pre.nombre, value: pre.value, key: pre.iso2 });
          			}
        		}
      		}
    	}
    return (
		<div>
            	<Form.Group widths='equal'>
											<Form.Field>
												<label>Nombres</label>
                                                <Form.Input
													value={this.state.firstName}
													onChange={this.handleFirstName.bind(
														this,
													)}/>
											</Form.Field>
											<Form.Field>
												<label>Apellidos</label>
												<Form.Input
													value={this.state.lastName}
													onChange={this.handleLastName.bind(
														this,
													)}/>
											</Form.Field>
											<Form.Field><Form.Select
                                                required
                                                placeholder="Seleccione..."
                                                value={this.state.gender}
                                                options={this.state.sexList}
                                                onChange={this.handleGender.bind(this)}
                                                label="Sexo"
                                            />
											</Form.Field>
											<Form.Field>
												<Form.Select
                        							required
                        							id="select-rebeld"
                        							placeholder="Seleccione..."
                        							value={this.state.typeDocumentIdentity}
                                                    options={this.state.documentTypes}
                        							onChange={this.handleTypeDocumentIdentity.bind(this)}
                        							label="Tipo de documento"
                                                />
											</Form.Field>
											<Form.Field>
												<label>Número de documento</label>
												<Form.Input
													value={this.state.numberDocumentIdentity}
													onChange={this.handleNumberDocumentIdentity.bind(
														this,
													)}/>
											</Form.Field>
										</Form.Group>
										<Form.Group widths='equal'>
											<Form.Field >
											 <Form.Input
                                                label="Fecha de nacimiento"
                                                type="date"
                                                value={this.state.birthdate}
                                                onChange={this.handleBirthdate.bind(this)}
                                            />
											</Form.Field>
											<Form.Field >
												  <Form.Select
                          							label={"País de nacimiento"}
                          							selection
                          							options={list}
                          							value={this.state.countryOfBirth}
                          							placeholder={"País de nacimiento"}
                          							onChange={this.handleCountryOfBirth.bind(this)}
                        						/>
											</Form.Field>
											<Form.Field >
												<label>Lugar de nacimiento</label>
												 <Form.Input
													value={this.state.birthplace}
													onChange={this.handleBirthplace.bind(
														this,
													)}/>
											</Form.Field>
											
											<Form.Field >
												<label>Teléfono</label>
											    <Form.Input
												disabled={false}
													value={this.state.phone}
													onChange={this.handlePhone.bind(
														this,
													)}/>
											</Form.Field>
											<Form.Field >
												<label>Dirección</label>
												 <Form.TextArea
													value={this.state.userDirection}
													onChange={this.handleUserDirection.bind(
														this,
													)}/>
											</Form.Field>
										</Form.Group>
										<Form.Group widths='equal'>
											<Form.Field>
												<label>Email</label>
											 <Form.Input
													value={this.state.email}
													onChange={this.handleEmail.bind(
														this,
													)}/>
											</Form.Field>
											<Form.Field>
												<label>Pregunta de seguridad</label>
											 <Form.Input
													value={this.state.questionSecurity}
													onChange={this.handleQuestionSecurity.bind(
														this,
													)}/>
											</Form.Field>
											<Form.Field>
												<label>Respuesta de seguridad</label>
												<Form.Input
													value={this.state.answerSecurity}
													onChange={this.handleAnswerSecurity.bind(
														this,
													)}/>
											</Form.Field>
											<Form.Field>
												<label>Familiar de contacto</label>
												<Form.Input
													value={this.state.familyName}
													onChange={this.handleFamilyName.bind(
														this,
													)}/>
											</Form.Field>
											<Form.Field>
												<label>Email del contacto</label>
											      <Form.Input
													value={this.state.familyEmail}
													onChange={this.handleFamilyEmail.bind(
														this,
													)}/>
											</Form.Field>
										</Form.Group>
										 <div style={{ textAlign: "center" }}>
											{this.state.message && (
												<Message color={this.state.colorMessage}>
													<p>{this.state.message}</p>
												</Message>
											)}
										<Button
											color='blue'
											type='submit'
											onClick={this.updateData.bind(this)}>
												Actualizar Datos
											</Button>
										</div>
        						</div>
    						)
    					}
}

export default EditPersonalData;