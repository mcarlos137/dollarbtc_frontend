import React, { Component } from "react";
import {
	Segment,
	Header,
	Message,
	Form,
	Button,
	Grid,
	Divider,
	Icon,
	Modal,
	Dropdown,
} from "semantic-ui-react";
import "./UpdateProfile.css";
import userService from "../../../services/user";
import prefits from "../../../common/prefits";
import config from "../../../services/config";
import Files from "react-files";
import FormData from "form-data";
import self from "../../../img/verifyiconId.png";
import bank from "../../../img/verifyicon2.png";
import location from "../../../img/verifyicon3.png";
import id from "../../../img/verifyicon1.png";
import translate from "../../../i18n/translate";
import Resizer from "react-image-file-resizer";
import { Document, Page } from "react-pdf";
class UpdateProfile extends Component {
	constructor(props) {
		super(props);
		this._Mounted = false;
		this.dniRef = React.createRef();
		this.bankRef = React.createRef();
		this.locationRef = React.createRef();
		this.selfRef = React.createRef();
		this.newresice = this.newresice.bind(this);
		this.state = {
			idImg: id,
			addFileDni: true,
			bankImg: bank,
			addFileBank: true,
			locationImg: location,
			addFileLocation: true,
			selffImg: self,
			addFileSelf: true,
			idFile: {},
			bankFile: {},
			errorNetwork: false,
			locationFile: {},
			selfFile: {},
			errorFileDni: false,
			errorFileBank: false,
			errorFileLocation: false,
			errorFileSelf: false,
			prefit: [],
			firstName: "",
			lastName: "",
			userPhone: "",
			partialPhone: "",
			partialNumber: "",
			birtdate: "",
			birtdateCountry: "",
			sex: "",
			typeDocument: "",
			otherDocument: "",
			numberDocumentId: "",
			direction: "",
			question: "",
			request: "",
			nameFamily: "",
			emailFamily: "",
			userLocalBitcoin: "",
			userFacebook: "",
			companyName: "",
			companyNumberOfFiscalRecord: "",
			locationLegalRegistry: "",
			numberLocationLegalRegistry: "",
			yearRegistry: "",
			formLoad: false,
			viewMessage: false,
			textMessage: "",
			resultUpdate: null,
			viewButton: true,
			selectOther: false,
			twoFactor:
				window.sessionStorage.getItem("twoFactor") === "true" ? true : false,
			email: userService.getUserEmail(),
			sexList: [
				{
					key: "m",
					value: "male",
					text: props.translate("profile.updateProfile.sexList.male"),
				},
				{
					key: "f",
					value: "female",
					text: props.translate("profile.updateProfile.sexList.female"),
				},
			],
			documentType: [
				{
					key: "i",
					value: "id",
					text: props.translate("profile.updateProfile.documentType.id"),
				},
				{
					key: "dn",
					value: "dni",
					text: props.translate("profile.updateProfile.documentType.dni"),
				},
				{
					key: "cd",
					value: "cedula",
					text: props.translate(
						"profile.updateProfile.documentType.identificationCard",
					),
				},
				{
					key: "pass",
					value: "passport",
					text: props.translate("profile.updateProfile.documentType.passport"),
				},
				{
					key: "ot",
					value: "other",
					text: props.translate("profile.updateProfile.documentType.other"),
				},
			],
			open: false,
			endsend: false,
			userData: {},
			userVerifyC: "",
			juridic: false,
			translator: props.translate,
			searchQuery: null,
			actualPhone: "",
			dataNotSet: [],
		};
		// this.resize = this.resize.bind(this);
		this.resizeImageData = this.resizeImageData.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.language !== nextProps.language) {
			this.setState(
				{
					translator: nextProps.translate,
				},
				() => {
					this.setState({
						documentType: [
							{
								key: "i",
								value: "id",
								text: nextProps.translate(
									"profile.updateProfile.documentType.id",
								),
							},
							{
								key: "dn",
								value: "dni",
								text: nextProps.translate(
									"profile.updateProfile.documentType.dni",
								),
							},
							{
								key: "cd",
								value: "cedula",
								text: nextProps.translate(
									"profile.updateProfile.documentType.identificationCard",
								),
							},
							{
								key: "pass",
								value: "passport",
								text: nextProps.translate(
									"profile.updateProfile.documentType.passport",
								),
							},
							{
								key: "ot",
								value: "other",
								text: nextProps.translate(
									"profile.updateProfile.documentType.other",
								),
							},
						],
						sexList: [
							{
								key: "m",
								value: "male",
								text: nextProps.translate("profile.updateProfile.sexList.male"),
							},
							{
								key: "f",
								value: "female",
								text: nextProps.translate(
									"profile.updateProfile.sexList.female",
								),
							},
						],
					});
				},
			);
		}
	}
	componentDidMount() {
		this.setState({
			prefit: prefits.country,
			firstName: window.sessionStorage.getItem("firstName"),
			lastName: window.sessionStorage.getItem("lastName"),
			userPhone: window.sessionStorage.getItem("phone"),
			partialPhone: window.sessionStorage.getItem("countryCode"),
			partialNumber: window.sessionStorage.getItem("phone"),
			actualPhone:
				window.sessionStorage.getItem("countryCode") +
				window.sessionStorage.getItem("phone"),
		});
		let username = userService.getUserName();
		//console.log("username de la session:", username)
		let data = userService.getConfigUserGeneral(username);
		data.then((resp) => {
			this.setDataUser(resp.data.result);
			this.setState(
				{
					existId:
						resp.data.result.identityURL === undefined
							? false
							: resp.data.result.identityURL === ""
							? false
							: resp.data.result.identityURL === null
							? false
							: true,
					existBank:
						resp.data.result.bankURL === undefined
							? false
							: resp.data.result.bankURL === ""
							? false
							: resp.data.result.bankURL === null
							? false
							: true,
					existSelf:
						resp.data.result.selfURL === undefined
							? false
							: resp.data.result.selfURL === ""
							? false
							: resp.data.result.selfURL === null
							? false
							: true,
					existLocation:
						resp.data.result.locationURL === undefined
							? false
							: resp.data.result.locationURL === ""
							? false
							: resp.data.result.locationURL === null
							? false
							: true,
				},
				() => console.log(this.state.existId),
			);
			let userData = userService.getActualUserInfo(resp.data.result);
			// ////console.log(userData.typeDocumentIdentity);
			if (userData.typeDocumentIdentity !== undefined) {
				let document = this.state.documentType.find(function (element) {
					//  ////console.log(element.value);
					return element.value === userData.typeDocumentIdentity;
				});
				if (document === undefined) {
					this.setState({ typeDocument: "other" });
				} else {
					this.setState({ typeDocument: userData.typeDocumentIdentity });
				}
			} else {
				this.setState({ typeDocument: "" });
			}
			this.setState(
				{
					juridic:
						resp.data.result.company !== undefined &&
						resp.data.result.company === "true"
							? true
							: false,
					userData: resp.data.result,
					firstName: userData.firstName !== undefined ? userData.firstName : "",
					lastName: userData.lastName !== undefined ? userData.lastName : "",
					question:
						userData.questionSecurity !== undefined
							? userData.questionSecurity
							: "",
					request:
						userData.answerSecurity !== undefined
							? userData.answerSecurity
							: "",
					birtdate: userData.birthdate !== undefined ? userData.birthdate : "",
					birtdateCountry:
						userData.birthplace !== undefined ? userData.birthplace : "",
					sex: userData.gender !== undefined ? userData.gender : "",

					numberDocumentId:
						userData.numberDocumentIdentity !== undefined
							? userData.numberDocumentIdentity
							: "",
					direction:
						userData.userDirection !== undefined ? userData.userDirection : "",
					nameFamily:
						userData.familyName !== undefined ? userData.familyName : "",
					emailFamily:
						userData.familyEmail !== undefined ? userData.familyEmail : "",
					userLocalBitcoin:
						userData.userLocalBitcoin !== undefined
							? userData.userLocalBitcoin
							: "",
					userFacebook:
						userData.userFacebook !== undefined ? userData.userFacebook : "",
					companyName:
						resp.data.result.company !== undefined
							? resp.data.result.company
							: "",
					numberLocationLegalRegistry:
						resp.data.result.companyNumberOfFiscalRecord !== undefined
							? resp.data.result.companyNumberOfFiscalRecord
							: "",
					locationLegalRegistry:
						resp.data.result.companyTypeOfFiscalRecord !== undefined
							? resp.data.result.companyTypeOfFiscalRecord
							: "",
					yearRegistry:
						resp.data.result.companyYearRegistration !== undefined
							? resp.data.result.companyYearRegistration
							: "",
				},
				() => {
					this._Mounted = true;
				},
			);
			if (resp.data.result.verification === undefined) {
				this.setState({ userVerifyC: "UNINITIATED", show: true });
			} else {
				if (resp.data.result.verification.C === undefined) {
					this.setState({ userVerifyC: "UNINITIATED", show: true });
				} else {
					this.setState({
						userVerifyC: resp.data.result.verification.C.userVerificationStatus,
						show: true,
					});
				}
			}
		});
	}
	setDataUser(data) {
		let dataNotSet = [];
		Object.entries(data).forEach(([key, value]) => {
			dataNotSet.push({ field: key, value: value });
		});
		this.setState({ dataNotSet: dataNotSet });
	}
	handlefirstName(e) {
		this.setState({ firstName: e.target.value });
	}
	handleLastName(e) {
		this.setState({ lastName: e.target.value });
	}
	handlePrefit(e, data) {
		this.setState({ partialPhone: data.value });
	}
	handleNumberPhone(e, data) {
		var numeros = "0123456789";
		let valid;
		if (e.target.value !== "") {
			for (let elem in e.target.value) {
				if (numeros.indexOf(e.target.value.charAt(elem), 0) !== -1) {
					valid = true;
				} else {
					valid = false;
				}
			}
			if (valid) {
				this.setState({ partialNumber: e.target.value });
			} else {
				this.setState({
					errorCode: true,
				});
			}
		} else {
			this.setState({ partialNumber: e.target.value });
		}
	}
	handleBirtdate(e, data) {
		this.setState({ birtdate: e.target.value });
	}
	handleBirtdateCountry(e, data) {
		this.setState({ birtdateCountry: e.target.value });
	}
	handleSex(e, data) {
		this.setState({ sex: data.value });
		let da = this.state.sexList.find(function (ele) {
			return ele.value === e.target.value;
		});
		if (da !== undefined) {
		}
	}
	handleTypeDocument(e, data) {
		if (data.value === "other") {
			this.setState({ selectOther: true });
		} else {
			this.setState({ selectOther: false });
		}
		this.setState({
			typeDocument: data.value,
			typeDocumentText: data.value,
		});
		let da = this.state.documentType.find(function (ele) {
			return ele.text === data.value;
		});
		if (da !== undefined) {
		}
	}
	handleOtherTypeDocument(e, data) {
		this.setState({
			otherDocument: e.target.value,
			typeDocument: e.target.value,
		});
	}
	handleNumberDocumentId(e, data) {
		this.setState({ numberDocumentId: e.target.value });
	}
	handleDirection(e, data) {
		this.setState({ direction: e.target.value });
	}
	handleQuestion(e, data) {
		this.setState({ question: e.target.value });
	}
	handleNameFamily(e, data) {
		this.setState({ nameFamily: e.target.value });
	}
	handleEmailFamily(e, data) {
		this.setState({ emailFamily: e.target.value });
	}
	handleUserLocalBitcoin(e, data) {
		this.setState({ userLocalBitcoin: e.target.value });
	}
	handleUserFacebook(e, data) {
		this.setState({ userFacebook: e.target.value });
	}
	handleRequest(e, data) {
		this.setState({ request: e.target.value });
	}
	handleCancel() {
		this.setState({
			partialPhone: window.sessionStorage.getItem("countryCode"),
			firstName: window.sessionStorage.getItem("firstName"),
			lastName: window.sessionStorage.getItem("lastName"),
			partialNumber: window.sessionStorage.getItem("phone"),
			actualPhone:
				window.sessionStorage.getItem("countryCode") +
				window.sessionStorage.getItem("phone"),
		});

		this.props.changeItem("optionDetail");
	}
	handleTypeRegistryLegaly(e, data) {
		this.setState({ locationLegalRegistry: e.target.value });
	}
	handleNumberRegistryLegaly(e, data) {
		this.setState({ numberLocationLegalRegistry: e.target.value });
	}
	handleCompanyName(e, data) {
		this.setState({ companyName: e.target.value });
	}
	handleYearRegistryCompany(e, data) {
		this.setState({ yearRegistry: e.target.value });
	}
	handleUpdateProfile(e, data) {
		if (this.state.partialPhone !== "") {
			if (this.state.partialNumber.length >= 7) {
				if (this.state.partialNumber !== "") {
					this.setState({ formLoad: true });
					var user = {
						email: this.state.email,
						firstName: this.state.firstName,
						lastName: this.state.lastName,
						countryCode: this.state.partialPhone,
						phone: this.state.partialNumber,
						has2FAEnabled: this.state.twoFactor, //this.state.twoFactor
					};
					let username = window.sessionStorage.getItem("username");
					userService
						.updateProfile(user, username)
						.then((resp) => {
							if (resp.data.payload === true) {
								let fullPhone =
									this.state.partialPhone + this.state.partialNumber;
								if (fullPhone !== this.state.actualPhone) {
									this.removeVeritication();
								}
								sessionStorage.setItem("firstName", this.state.firstName);
								sessionStorage.setItem("lastName", this.state.lastName);
								if (
									this.state.partialNumber !== sessionStorage.getItem("phone")
								) {
									sessionStorage.setItem("phoneVerified", "false");
								}
								sessionStorage.setItem("phone", this.state.partialNumber);
								sessionStorage.setItem("countryCode", this.state.partialPhone);
								sessionStorage.setItem("twoFactor", this.state.twoFactor);
								let array = [
									{
										email: userService.getUserName(),
										field: "firstName",
										data: this.state.firstName,
									},
									{
										email: userService.getUserName(),
										field: "lastName",
										data: this.state.lastName,
									},
									{
										email: userService.getUserName(),
										field: "phone",
										data: this.state.partialPhone + this.state.partialNumber,
									},
									{
										email: userService.getUserName(),
										field: "answerSecurity",
										data: this.state.request,
									},
									{
										email: userService.getUserName(),
										field: "questionSecurity",
										data: this.state.question,
									},
									{
										email: userService.getUserName(),
										field: "typeDocumentIdentity",
										data: this.state.typeDocument,
									},
									{
										email: userService.getUserName(),
										field: "numberDocumentIdentity",
										data: this.state.numberDocumentId,
									},
									{
										email: userService.getUserName(),
										field: "gender",
										data: this.state.sex,
									},
									{
										email: userService.getUserName(),
										field: "birthdate",
										data: this.state.birtdate,
									},
									{
										email: userService.getUserName(),
										field: "birthplace",
										data: this.state.birtdateCountry,
									},
									{
										email: userService.getUserName(),
										field: "familyName",
										data: this.state.nameFamily,
									},
									{
										email: userService.getUserName(),
										field: "familyEmail",
										data: this.state.emailFamily,
									},
									{
										email: userService.getUserName(),
										field: "userLocalBitcoin",
										data: this.state.userLocalBitcoin,
									},
									{
										email: userService.getUserName(),
										field: "userFacebook",
										data: this.state.userFacebook,
									},
									{
										email: userService.getUserName(),
										field: "userDirection",
										data: this.state.direction,
									},
								];
								if (this.state.juridic === false) {
									this.defineDataToAddAndUpdate(array, data.name);
								} else {
									array.push({
										email: userService.getUserName(),
										field: "companyName",
										data: this.state.companyName,
									});
									array.push({
										email: userService.getUserName(),
										field: "companyTypeOfFiscalRecord",
										data: this.state.locationLegalRegistry,
									});
									array.push({
										email: userService.getUserName(),
										field: "companyNumberOfFiscalRecord",
										data: this.state.numberLocationLegalRegistry,
									});
									array.push({
										email: userService.getUserName(),
										field: "companyYearRegistration",
										data: this.state.yearRegistry,
									});
									this.setState({ arrayUserData: array }, () => {
										this.defineDataToAddAndUpdate(array, data.name);
									});
								}
							} else {
								this.setState({ formLoad: false });
								this.setState({
									viewMessage: true,
									textMessage: "profile.updateProfile.errors.repeatedPhone",
								});
								setTimeout(() => {
									this.setState({
										resultUpdate: null,
										viewMessage: false,
										textMessage: "",
									});
								}, 8000);
							}
						})
						.catch((error) => {
							this.setState({ formLoad: false });
							////console.log(error);
							this.setState({
								viewMessage: true,
								textMessage: "profile.updateProfile.errors.errorServer",
							});
							setTimeout(() => {
								this.setState({
									resultUpdate: null,
									viewMessage: false,
									textMessage: "",
								});
							}, 5000);
						});
				} else {
					this.setState({
						viewMessage: true,
						textMessage: "profile.updateProfile.errors.emptyPhone",
					});
					setTimeout(() => {
						this.setState({
							resultUpdate: null,
							viewMessage: false,
							textMessage: "",
						});
					}, 5000);
				}
			} else {
				this.setState({
					viewMessage: true,
					textMessage: "profile.updateProfile.errors.longPhone",
				});
				setTimeout(() => {
					this.setState({
						resultUpdate: null,
						viewMessage: false,
						textMessage: "",
					});
				}, 5000);
			}
		} else {
			this.setState({
				viewMessage: true,
				textMessage: "profile.updateProfile.errors.emptyFields",
			});
			setTimeout(() => {
				this.setState({
					resultUpdate: null,
					viewMessage: false,
					textMessage: "",
				});
			}, 5000);
		}
	}
	async defineDataToAddAndUpdate(data, source) {
		for (let field of data) {
			let findfield = this.state.dataNotSet.find((data) => {
				return field.field === data.field;
			});
			let body = {
				userName: field.email,
				fieldName: field.field,
				fieldValue: field.data,
			};
			if (findfield === undefined) {
				await this.addDataUserAsync(body);
			} else {
				await this.updateDataUser(body);
			}
		}
		if (source === "update") {
			this.setState({
				formLoad: false,
				viewMessage: true,
				viewButton: false,
				textMessage: "profile.updateProfile.successUpdate",
				firstName: window.sessionStorage.getItem("firstName"),
				lastName: window.sessionStorage.getItem("lastName"),
				userPhone: window.sessionStorage.getItem("phone"),
				twoFactor:
					window.sessionStorage.getItem("twoFactor") === "true" ? true : false,
			});
			// this.resultUpdate();
		} else {
			this.onLoadFileSend();
		}
	}
	async addDataUserAsync(body) {
		try {
			let response = await userService.addDataUserAsync(body);
			if (response.data !== "OK") {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			// console.log(error);
			return false;
		}
	}
	async updateDataUser(body) {
		try {
			let response = await userService.updateUserData(body);
			if (response.data !== "OK") {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}
	}
	resultUpdate() {
		setTimeout(() => {
			this.setState({
				resultUpdate: userService.getUpdateUser(),
				formLoad: false,
				viewMessage: true,
				textMessage: "profile.updateProfile.successUpdate",
				firstName: window.sessionStorage.getItem("firstName"),
				lastName: window.sessionStorage.getItem("lastName"),
				userPhone: window.sessionStorage.getItem("phone"),
				twoFactor:
					window.sessionStorage.getItem("twoFactor") === "true" ? true : false,
			});
			this.closeOption();
		}, 8000);
	}
	async removeVeritication() {
		let body = {
			userName: userService.getUserName(),
			userVerificationType: "B",
		};
		try {
			const response = await userService.removeVerificationProccessToUser(body);
			// //console.log(response);
		} catch (error) {
			// //console.log(error);
		}
	}
	showModal() {
		if (this.state.idFile.file !== undefined || this.state.existId === true) {
			if (
				this.state.bankFile.file !== undefined ||
				this.state.existBank === true
			) {
				if (
					this.state.locationFile.file !== undefined ||
					this.state.existLocation === true
				) {
					if (
						this.state.selfFile.file !== undefined ||
						this.state.existSelf === true
					) {
						if (this.state.firstName !== "") {
							if (this.state.lastName !== "") {
								if (this.state.typeDocument !== "") {
									if (this.state.numberDocumentId !== "") {
										if (this.state.juridic === false) {
											this.setState({ open: true });
										} else {
											if (this.state.companyName !== "") {
												if (this.state.yearRegistry !== "") {
													if (this.state.locationLegalRegistry !== "") {
														if (this.state.numberLocationLegalRegistry !== "") {
															this.setState({ open: true });
														} else {
															this.setState({
																viewMessage: true,
																textMessage:
																	"profile.updateProfile.errors.emptyFiscalRecord",
															});
															setTimeout(() => {
																this.setState({
																	viewMessage: false,
																	textMessage: "",
																});
															}, 5000);
														}
													} else {
														this.setState({
															viewMessage: true,
															textMessage:
																"profile.updateProfile.errors.emptyFiscalRecordType",
														});
														setTimeout(() => {
															this.setState({
																viewMessage: false,
																textMessage: "",
															});
														}, 5000);
													}
												} else {
													this.setState({
														viewMessage: true,
														textMessage:
															"profile.updateProfile.errors.emptyFiscalRecordYear",
													});
													setTimeout(() => {
														this.setState({
															viewMessage: false,
															textMessage: "",
														});
													}, 5000);
												}
											} else {
												this.setState({
													viewMessage: true,
													textMessage:
														"profile.updateProfile.errors.emptyFiscalRecordName",
												});
												setTimeout(() => {
													this.setState({
														viewMessage: false,
														textMessage: "",
													});
												}, 5000);
											}
										}
									} else {
										this.setState({
											viewMessage: true,
											textMessage: "profile.updateProfile.errors.emptyIDNumber",
										});
										setTimeout(() => {
											this.setState({ viewMessage: false, textMessage: "" });
										}, 5000);
									}
								} else {
									this.setState({
										viewMessage: true,
										textMessage:
											"profile.updateProfile.errors.emptyIDNumberType",
									});
									setTimeout(() => {
										this.setState({ viewMessage: false, textMessage: "" });
									}, 5000);
								}
							} else {
								this.setState({
									viewMessage: true,
									textMessage: "profile.updateProfile.errors.emptyLastName",
								});
								setTimeout(() => {
									this.setState({ viewMessage: false, textMessage: "" });
								}, 5000);
							}
						} else {
							this.setState({
								viewMessage: true,
								textMessage: "profile.updateProfile.errors.emptyName",
							});
							setTimeout(() => {
								this.setState({ viewMessage: false, textMessage: "" });
							}, 5000);
						}
					} else {
						this.setState({
							viewMessage: true,
							textMessage: "profile.updateProfile.errors.emptySelfie",
						});
						setTimeout(() => {
							this.setState({ viewMessage: false, textMessage: "" });
						}, 5000);
					}
				} else {
					this.setState({
						viewMessage: true,
						textMessage: "profile.updateProfile.errors.emptyAddress",
					});
					setTimeout(() => {
						this.setState({ viewMessage: false, textMessage: "" });
					}, 5000);
				}
			} else {
				this.setState({
					viewMessage: true,
					textMessage: "profile.updateProfile.errors.emptyBank",
				});
				setTimeout(() => {
					this.setState({ viewMessage: false, textMessage: "" });
				}, 5000);
			}
		} else {
			////console.log(this.state.idFile);
			this.setState({
				viewMessage: true,
				textMessage: "profile.updateProfile.errors.emptyID",
			});
			setTimeout(() => {
				this.setState({ viewMessage: false, textMessage: "" });
			}, 5000);
		}
	}
	closeOption() {
		setTimeout(() => {
			this.setState({
				resultUpdate: null,
				viewMessage: false,
				textMessage: "",
			});
			if (this.props.source === "profile") {
				this.props.changeItem("optionDetail");
			} else {
				this.props.endUpdate(true);
			}
		}, 5000);
	}
	async onLoadFileSend() {
		// ////console.log("llgueeee");
		let arrayToFile = [];
		if (this.state.existId !== true) {
			arrayToFile.push({
				name: "attachment",
				file: this.state.idFile.file,
				fileName: this.state.idFile.name,
				fieldName: this.state.idFile.key,
			});
		}
		if (this.state.existBank !== true) {
			arrayToFile.push({
				name: "attachment",
				file: this.state.bankFile.file,
				fileName: this.state.bankFile.name,
				fieldName: this.state.bankFile.key,
			});
		}
		if (this.state.existLocation !== true) {
			arrayToFile.push({
				name: "attachment",
				file: this.state.locationFile.file,
				fileName: this.state.locationFile.name,
				fieldName: this.state.locationFile.key,
			});
		}
		if (this.state.existSelf !== true) {
			arrayToFile.push({
				name: "attachment",
				file: this.state.selfFile.file,
				fileName: this.state.selfFile.name,
				fieldName: this.state.selfFile.key,
			});
		}
		console.log(arrayToFile);
		for (let data of arrayToFile) {
			let findField = this.state.dataNotSet.find((field) => {
				return field.field === data.fieldName;
			});

			if (findField === undefined) {
				let formData = new FormData();
				formData.append("attachment", data.file, data.fileName);
				formData.append("userName", window.sessionStorage.getItem("username"));
				formData.append("fieldName", data.fieldName);
				try {
					await userService.userAddAttachmentAsync(formData);
				} catch (error) {
					this.setState({
						errorNetwork: true,
						textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
						formLoad: false,
						endsend: true,
					});
					break;
				}
			} else {
				try {
					if (findField.value === "" || findField.value === null) {
						let formData = new FormData();
						formData.append("attachment", data.file, data.fileName);
						formData.append(
							"userName",
							window.sessionStorage.getItem("username"),
						);
						formData.append("fieldName", data.fieldName);
						await userService.userAddAttachmentAsync(formData);
					}
				} catch (error) {
					let e = error.toString();
					if (e.includes("Network")) {
						this.setState({
							errorNetwork: true,
							textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
							formLoad: false,
						});
					} else {
						this.setState({
							errorNetwork: true,
							textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
							formLoad: false,
							endsend: true,
						});
					}

					break;
				}
			}
		}
		this.initVerification();
	}
	initVerification() {
		let fields = [];
		if (!this.state.juridic) {
			fields = [
				"identityURL",
				"bankURL",
				"locationURL",
				"selfURL",
				"firstName",
				"lastName",
				"phone",
				"questionSecurity",
				"answerSecurity",
				"typeDocumentIdentity",
				"numberDocumentIdentity",
				"gender",
				"birthdate",
				"birthplace",
				"familyName",
				"familyEmail",
				"userLocalBitcoin",
				"userFacebook",
				"userDirection",
			];
		} else {
			fields = [
				"identityURL",
				"bankURL",
				"locationURL",
				"selfURL",
				"firstName",
				"lastName",
				"phone",
				"questionSecurity",
				"answerSecurity",
				"typeDocumentIdentity",
				"numberDocumentIdentity",
				"gender",
				"birthdate",
				"birthplace",
				"familyName",
				"familyEmail",
				"userLocalBitcoin",
				"userFacebook",
				"userDirection",
				"companyName",
				"companyTypeOfFiscalRecord",
				"companyNumberOfFiscalRecord",
				"companyYearRegistration",
			];
		}

		let body = {
			userName: window.sessionStorage.getItem("username"),
			fieldNames: fields,
			userVerificationType: "C",
			info: "Initial verification user account",
		};
		// ////console.log(body);
		//Axios.post(url, body)
		let url = userService.verifyUserRequestCore(body);
		url
			.then(async (rep) => {
				//   ////console.log(rep);
				if (rep.data !== "OK") {
					let s = rep.data.split("USER DOES NOT HAVE FIELDNAME ");
					if (s[1] === "firstName") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"firstName",
							this.state.firstName,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "lastName") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"lastName",
							this.state.lastName,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "phone") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"phone",
							this.state.partialPhone + this.state.partialNumber,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "questionSecurity") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"questionSecurity",
							this.state.question,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "answerSecurity") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"answerSecurity",
							this.state.request,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "typeDocumentIdentity") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"typeDocumentIdentity",
							this.state.typeDocument,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "numberDocumentIdentity") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"numberDocumentIdentity",
							this.state.numberDocumentId,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "gender") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"gender",
							this.state.sex,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "birthdate") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"birthdate",
							this.state.birtdate,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "birthplace") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"birthplace",
							this.state.birtdateCountry,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "familyName") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"familyName",
							this.state.nameFamily,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "familyEmail") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"familyEmail",
							this.state.emailFamily,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "userLocalBitcoin") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"userLocalBitcoin",
							this.state.userLocalBitcoin,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "userFacebook") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"userFacebook",
							this.state.userFacebook,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "userDirection") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"userDirection",
							this.state.direction,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "companyName") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"companyName",
							this.state.companyName,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "companyTypeOfFiscalRecord") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"companyTypeOfFiscalRecord",
							this.state.locationLegalRegistry,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "companyYearRegistration") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"companyYearRegistration",
							this.state.yearRegistry,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "companyNumberOfFiscalRecord") {
						userService.addInfoToUserDollarBtc(
							userService.getUserName(),
							"companyNumberOfFiscalRecord",
							this.state.numberLocationLegalRegistry,
						);
						setTimeout(() => {
							this.initVerification();
						}, 5000);
					}
					if (s[1] === "identityURL" && this.state.existId === false) {
						let formData = new FormData();
						formData.append(
							"attachment",
							this.state.idFile.file,
							this.state.idFile.name,
						);
						formData.append(
							"userName",
							window.sessionStorage.getItem("username"),
						);
						formData.append("fieldName", this.state.idFile.key);
						this.sendSimpleFile(formData);
					}
					if (s[1] === "bankURL" && this.state.existBank === false) {
						let formDataBank = new FormData();
						formDataBank.append(
							"attachment",
							this.state.bankFile.file,
							this.state.bankFile.name,
						);
						formDataBank.append(
							"userName",
							window.sessionStorage.getItem("username"),
						);
						formDataBank.append("fieldName", this.state.bankFile.key);
						this.sendSimpleFile(formDataBank);
					}
					if (s[1] === "locationURL" && this.state.existLocation === false) {
						let formDataLocation = new FormData();
						formDataLocation.append(
							"attachment",
							this.state.locationFile.file,
							this.state.locationFile.name,
						);
						formDataLocation.append(
							"userName",
							window.sessionStorage.getItem("username"),
						);
						formDataLocation.append("fieldName", this.state.locationFile.key);
						this.sendSimpleFile(formDataLocation);
					}
					if (s[1] === "selfURL" && this.state.existSelf === false) {
						let formDataSelfie = new FormData();
						formDataSelfie.append(
							"attachment",
							this.state.selfFile.file,
							this.state.selfFile.name,
						);
						formDataSelfie.append(
							"userName",
							window.sessionStorage.getItem("username"),
						);
						formDataSelfie.append("fieldName", this.state.selfFile.key);
						this.sendSimpleFile(formDataSelfie);
					}
				} else {
					this.setState({ formLoad: false, endsend: true, viewButton: false });
					this.setState({
						viewMessage: true,
						textMessage: "profile.updateProfile.successSentData",
					});

					this.setState({
						addFileSelf: true,
					});

					this.setState({
						addFileLocation: true,
					});

					this.setState({
						addFileBank: true,
					});

					this.setState({
						addFileDni: true,
					});
					setTimeout(() => {
						this.setState({
							viewMessage: false,
							textMessage: "",
						});
					}, 15000);
				}
			})
			.catch((error) => {
				let e = error.toString();
				if (e.includes("Network")) {
					this.setState({
						errorNetwork: true,
						textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
						formLoad: false,
					});
				} else {
					this.setState({
						errorNetwork: true,
						textMessage: "buy.formVerificationIdentity.errors.errorNetwork",
						formLoad: false,
					});
				}
				// ////console.log(error);
			});
	}
	onRemoveFile(e, data) {
		if (data.id === "file-dni") {
			this.dniRef.current.removeFiles();
			this.setState({
				idFile: {},
				idImg: id,
				addFileDni: true,
			});
		}
		if (data.id === "file-bank") {
			this.bankRef.current.removeFiles();
			this.setState({
				bankFile: {},
				bankImg: bank,
				addFileBank: true,
			});
		}
		if (data.id === "file-location") {
			this.locationRef.current.removeFiles();
			this.setState({
				locationFile: {},
				locationImg: location,
				addFileLocation: true,
			});
		}
		if (data.id === "file-self") {
			this.selfRef.current.removeFiles();
			this.setState({
				selfFile: {},
				selffImg: self,
				addFileSelf: true,
			});
		}
	}
	onFilesChange(files) {
		if (files !== undefined && files.length > 0) {
			// ////console.log(files[0]);
			if (files[0].extension !== "pdf") {
				if (files[0].size > 500000) {
					let obj = files[0];
					//console.log(obj)
					let newname1 = files[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: files[0].extension,
						key: "identityURL",
						file: f,
					};
					let ex = String(files[0].extension);
					this.newresice(f, ex.toLocaleUpperCase(), "idFile", object);
					this.setState({
						idImg: obj.preview.url,
						addFileDni: false,
					});
				} else {
					let obj = files[0];
					//console.log(obj)
					let newname1 = files[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: files[0].extension,
						key: "identityURL",
						file: f,
					};
					this.setState({
						idFile: object,
						idImg: obj.preview.url,
						addFileDni: false,
					});
				}
			} else {
				let obj = files[0];
				//console.log(obj)
				let newname1 = files[0].name.replace(/ /g, "-").toLowerCase();
				let newnamesinn = newname1.replace(/ñ/gi, "n");
				let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
				let newname = sinacentos;
				let f = new File([obj], newname, { type: obj.type });
				var object = {
					img: obj.preview.url,
					name: f.name,
					type: f.type,
					extension: files[0].extension,
					key: "identityURL",
					file: f,
				};

				this.setState({
					idFile: object,
					idImg: obj.preview.url,
					addFileDni: false,
				});
			}
		}
	}
	newresice(file, type, target, ob) {
		Resizer.imageFileResizer(
			file,
			1024,
			678,
			type,
			70,
			0,
			(uri) => {
				var end = new File([uri], ob.name, {
					type: ob.type,
					lastModified: Date.now(),
				});
				ob.file = end;
				this.setState({ [target]: ob });
				//  ////console.log(uri, ob);
			},
			"blob",
		);
	}
	resizeImageData(maxWidth, maxHeight, quality, type, dataUrl, fn, ob, st) {
		var image = new Image();
		image.src = dataUrl;
		var resizedDataUrl;
		let fileend, endFile;
		image.onload = () => {
			var canvas = document.createElement("canvas");
			var width = image.width;
			var height = image.height;

			if (width > height) {
				if (width > maxWidth) {
					height = Math.round((height * maxWidth) / width);
					width = maxWidth;
				}
			} else {
				if (height > maxHeight) {
					width = Math.round((width * maxHeight) / height);
					height = maxHeight;
				}
			}

			canvas.width = width;
			canvas.height = height;
			canvas.toBlob(
				(blog) => {
					////console.log(blog);
				},
				type,
				quality,
			);
			//  ////console.log(canvas.width, canvas.height);
			var byteString;
			resizedDataUrl = canvas.toDataURL(type, quality);
			if (resizedDataUrl.split(",")[0].indexOf("base64") >= 0)
				byteString = atob(resizedDataUrl.split(",")[1]);
			else byteString = unescape(resizedDataUrl.split(",")[1]);
			// separate out the mime component
			var mimeString = resizedDataUrl.split(",")[0].split(":")[1].split(";")[0];
			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			fileend = new Blob([ia], { type: mimeString });
			var end = new File([fileend], ob.name, {
				type: mimeString,
				lastModified: Date.now(),
			});
			ob.file = fileend;
			// ////console.log(end, fileend, ob);
			fn({ [st]: ob });
		};
	}
	onFilesError(error, file) {
		if (error.code === 1) {
			this.setState({
				errorFileDni: true,
				messageText: "profile.updateProfile.errors.fileNotSupported",
			});
			setTimeout(() => {
				this.setState({ errorFileDni: false, messageText: "" });
			}, 5000);
		} else {
			this.setState({
				errorFileDni: true,
				messageText: "profile.updateProfile.errors.fileSize",
			});
			setTimeout(() => {
				this.setState({ errorFileDni: false, messageText: "" });
			}, 5000);
		}
	}
	onFilesChangeBank(file) {
		if (file !== undefined && file.length > 0) {
			if (file[0].extension !== "pdf") {
				if (file[0].size > 500000) {
					let obj = file[0];
					//console.log(obj)
					let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: file[0].extension,
						key: "bankURL",
						file: f,
					};
					this.setState({
						bankImg: obj.preview.url,
						addFileBank: false,
					});
					let ex = String(file[0].extension);
					this.newresice(f, ex.toLocaleUpperCase(), "bankFile", object);
				} else {
					let obj = file[0];
					//console.log(obj)
					let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: file[0].extension,
						key: "bankURL",
						file: f,
					};
					this.setState({
						bankImg: obj.preview.url,
						bankFile: object,
						addFileBank: false,
					});
				}
			} else {
				let obj = file[0];
				//console.log(obj)
				let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
				let newnamesinn = newname1.replace(/ñ/gi, "n");
				let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
				let newname = sinacentos;
				let f = new File([obj], newname, { type: obj.type });
				var object = {
					img: obj.preview.url,
					name: f.name,
					type: f.type,
					extension: file[0].extension,
					key: "bankURL",
					file: f,
				};
				this.setState({
					bankImg: obj.preview.url,
					bankFile: object,
					addFileBank: false,
				});
			}
		}
	}
	onFilesErrorBank(error, file) {
		if (error.code === 1) {
			this.setState({
				errorFileBank: true,
				messageText: "profile.updateProfile.errors.fileNotSupported",
			});
			setTimeout(() => {
				this.setState({ errorFileBank: false, messageText: "" });
			}, 5000);
		} else {
			this.setState({
				errorFileBank: true,
				messageText: "profile.updateProfile.errors.fileSize",
			});
			setTimeout(() => {
				this.setState({ errorFileBank: false, messageText: "" });
			}, 5000);
		}
	}
	onFilesChangeLocation(file) {
		if (file !== undefined && file.length > 0) {
			if (file[0].extension !== "pdf") {
				if (file[0].size > 500000) {
					let obj = file[0];
					//console.log(obj)
					let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: file[0].extension,
						key: "locationURL",
						file: f,
					};
					this.setState({
						locationImg: obj.preview.url,
						addFileLocation: false,
					});
					let ex = String(file[0].extension);
					this.newresice(f, ex.toLocaleUpperCase(), "locationFile", object);
				} else {
					let obj = file[0];
					//console.log(obj)
					let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: file[0].extension,
						key: "locationURL",
						file: f,
					};
					this.setState({
						locationImg: obj.preview.url,
						locationFile: object,
						addFileLocation: false,
					});
				}
			} else {
				let obj = file[0];
				//console.log(obj)
				let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
				let newnamesinn = newname1.replace(/ñ/gi, "n");
				let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
				let newname = sinacentos;
				let f = new File([obj], newname, { type: obj.type });
				var object = {
					img: obj.preview.url,
					name: f.name,
					type: f.type,
					extension: file[0].extension,
					key: "locationURL",
					file: f,
				};
				this.setState({
					locationImg: obj.preview.url,
					locationFile: object,
					addFileLocation: false,
				});
			}
		}
	}
	onFilesErrorLocation(error, file) {
		if (error.code === 1) {
			this.setState({
				errorFileLocation: true,
				messageText: "profile.updateProfile.errors.fileNotSupported",
			});
			setTimeout(() => {
				this.setState({ errorFileLocation: false, messageText: "" });
			}, 5000);
		} else {
			this.setState({
				errorFileLocation: true,
				messageText: "profile.updateProfile.errors.fileSize",
			});
			setTimeout(() => {
				this.setState({ errorFileLocation: false, messageText: "" });
			}, 5000);
		}
	}
	onFilesChangeSelfie(file) {
		if (file !== undefined && file.length > 0) {
			if (file[0].extension !== "pdf") {
				if (file[0].size > 500000) {
					let obj = file[0];
					//console.log(obj)
					let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: file[0].extension,
						key: "selfURL",
						file: f,
					};
					this.setState({
						selffImg: obj.preview.url,
						addFileSelf: false,
					});
					let ex = String(file[0].extension);
					this.newresice(f, ex.toLocaleUpperCase(), "selfFile", object);
				} else {
					let obj = file[0];
					//console.log(obj)
					let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
					let newnamesinn = newname1.replace(/ñ/gi, "n");
					let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
					let newname = sinacentos;
					let f = new File([obj], newname, { type: obj.type });
					var object = {
						img: obj.preview.url,
						name: f.name,
						type: f.type,
						extension: file[0].extension,
						key: "selfURL",
						file: f,
					};
					this.setState({
						selffImg: obj.preview.url,
						selfFile: object,
						addFileSelf: false,
					});
				}
			} else {
				// eslint-disable-next-line no-redeclare
				let obj = file[0];
				//console.log(obj)
				let newname1 = file[0].name.replace(/ /g, "-").toLowerCase();
				let newnamesinn = newname1.replace(/ñ/gi, "n");
				let sinacentos = newnamesinn.replace(/[áäà]/gi, "a");
				let newname = sinacentos;
				let f = new File([obj], newname, { type: obj.type });
				var object = {
					img: obj.preview.url,
					name: f.name,
					type: f.type,
					extension: obj.extension,
					key: "selfURL",
					file: f,
				};
				this.setState({
					selffImg: obj.preview.url,
					selfFile: object,
					addFileSelf: false,
				});
			}
		}
	}
	onFilesErrorSelfie(error, file) {
		if (error.code === 1) {
			this.setState({
				errorFileSelf: true,
				messageText: "profile.updateProfile.errors.fileNotSupported",
			});
			setTimeout(() => {
				this.setState({ errorFileSelf: false, messageText: "" });
			}, 5000);
		} else {
			this.setState({
				errorFileSelf: true,
				messageText: "profile.updateProfile.errors.fileSize",
			});
			setTimeout(() => {
				this.setState({ errorFileSelf: false, messageText: "" });
			}, 5000);
		}
	}
	closeModalEnd() {
		this.setState({ open: false, endsend: false });
		window.location.href = "/profile";
	}
	closeModal() {
		this.setState({ open: false });
	}
	handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
	render() {
		let t = this.state.translator;

		let message,
			messageErrord,
			messageErrorb,
			messageErrorl,
			messageErrors,
			errorNetwork;
		let list = [];
		if (this.state.prefit.length > 0) {
			for (let pre of this.state.prefit) {
				if (pre.value !== "") {
					list.push({
						text: pre.nombre + " (+" + pre.value + ")",
						value: pre.value,
						key: pre.iso2,
					});
				}
			}
		}
		let list2 = this.state.prefit.map((element, i) => (
			<option value={element.value} key={i}>
				{element.text}
			</option>
		));
		if (this.state.viewMessage) {
			message = <Message info floating content={t(this.state.textMessage)} />;
		}
		if (this.state.errorFileDni) {
			messageErrord = (
				<Message color='red' style={{ padding: "inherit" }}>
					<span style={{ fontSize: "9px" }}>{t(this.state.messageText)}</span>
				</Message>
			);
		}
		if (this.state.errorFileBank) {
			messageErrorb = (
				<Message color='red' style={{ padding: "inherit" }}>
					<span style={{ fontSize: "9px" }}>{t(this.state.messageText)}</span>
				</Message>
			);
		}
		if (this.state.errorFileLocation) {
			messageErrorl = (
				<Message color='red' style={{ padding: "inherit" }}>
					<span style={{ fontSize: "9px" }}>{t(this.state.messageText)}</span>
				</Message>
			);
		}
		if (this.state.errorFileSelf) {
			messageErrors = (
				<Message color='red' style={{ padding: "inherit" }}>
					<span style={{ fontSize: "9px" }}>{t(this.state.messageText)}</span>
				</Message>
			);
		}
		let messageFileInstrutionsOne = "";
		let messageFileInstrutionsTwo = "";
		if (
			this.state.existId !== true ||
			this.state.existBank !== true ||
			this.state.existLocation !== true ||
			this.state.existSelf !== true
		) {
			if (!this.state.juridic) {
				messageFileInstrutionsOne = (
					<div style={{ marginTop: "8px", textAlign: "center" }}>
						{t(
							"profile.updateProfile.form.verifyCUninitiatedPersonal.messageFile",
						)}
					</div>
				);
			} else {
				messageFileInstrutionsOne = (
					<div style={{ marginTop: "8px", textAlign: "center" }}>
						{t(
							"profile.updateProfile.form.verifyCUninitiatedCompany.messageFile",
						)}
					</div>
				);
			}
		}
		if (
			this.state.existId !== true ||
			this.state.existBank !== true ||
			this.state.existLocation !== true ||
			this.state.existSelf !== true
		) {
			if (!this.state.juridic) {
				messageFileInstrutionsTwo = (
					<div
						style={{
							marginTop: "5px",
							textAlign: "center",
							marginBottom: "5px",
						}}>
						{t(
							"profile.updateProfile.form.verifyCUninitiatedCompany.supportedTypeFiles",
						)}
					</div>
				);
			} else {
				messageFileInstrutionsTwo = (
					<div
						style={{
							marginTop: "5px",
							textAlign: "center",
							marginBottom: "5px",
						}}>
						{t(
							"profile.updateProfile.form.verifyCUninitiatedCompany.supportedTypeFiles",
						)}
					</div>
				);
			}
		}
		// if (this.state.errorNetwork) {
		//   errorNetwork = (
		//     <Message color="red" style={{ padding: "inherit" }}>
		//       <span style={{ fontSize: "9px" }}>{t(this.state.messageText)}</span>
		//     </Message>
		//   );
		// }
		return (
			<div>
				<Segment
					loading={this.state.formLoad}
					basic={this.props.source !== "profile"}
					color={this.props.source !== "profile" ? "" : "orange"}>
					<Header textAlign='center'>
						{t("profile.updateProfile.header")}
					</Header>
					<Form>
						<Divider hidden />
						<Form.Group>
							<Form.Input
								label={t("profile.updateProfile.form.name")}
								width={4}
								placeholder={t("profile.updateProfile.form.placeholderName")}
								value={this.state.firstName}
								onChange={this.handlefirstName.bind(this)}
							/>
							<Form.Input
								label={t("profile.updateProfile.form.lastName")}
								width={4}
								placeholder={t(
									"profile.updateProfile.form.placeholderLastName",
								)}
								value={this.state.lastName}
								onChange={this.handleLastName.bind(this)}
							/>
							<Form.Select
								width={4}
								id='select-rebeld-sex'
								placeholder={t("profile.updateProfile.form.placeholderSex")}
								value={this.state.sex}
								options={this.state.sexList}
								onChange={this.handleSex.bind(this)}
								label={t("profile.updateProfile.form.sex")}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Select
								width={4}
								id='select-rebeld'
								placeholder={t(
									"profile.updateProfile.form.placeholderDocumentType",
								)}
								value={this.state.typeDocument}
								options={this.state.documentType}
								onChange={this.handleTypeDocument.bind(this)}
								label={t("profile.updateProfile.form.documentType")}
							/>

							{this.state.selectOther && (
								<Form.Input
									width={4}
									label={t("profile.updateProfile.form.other")}
									value={this.state.otherDocument}
									onChange={this.handleOtherTypeDocument.bind(this)}
								/>
							)}
							<Form.Input
								width={4}
								label={t("profile.updateProfile.form.numberId")}
								value={this.state.numberDocumentId}
								onChange={this.handleNumberDocumentId.bind(this)}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Input
								label={t("profile.updateProfile.form.birthday")}
								type='date'
								width={4}
								value={this.state.birtdate}
								onChange={this.handleBirtdate.bind(this)}
							/>
							<Form.Input
								width={4}
								label={t("profile.updateProfile.form.birthplace")}
								value={this.state.birtdateCountry}
								onChange={this.handleBirtdateCountry.bind(this)}
							/>
							<Form.Select
								label={t("profile.updateProfile.form.placeholderCountry")}
								required
								width={4}
								selection
								search={true}
								options={list}
								value={this.state.partialPhone}
								placeholder={t("profile.updateProfile.form.placeholderCountry")}
								onChange={this.handlePrefit.bind(this)}
								onSearchChange={this.handleSearchChange.bind(this)}
							/>
							<Form.Input
								required
								width={4}
								label={t("profile.updateProfile.form.phone")}
								placeholder={t("profile.updateProfile.form.placeholderPhone")}
								value={this.state.partialNumber}
								onChange={this.handleNumberPhone.bind(this)}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Input
								width={4}
								label={t("profile.updateProfile.form.securityQuestion")}
								value={this.state.question}
								onChange={this.handleQuestion.bind(this)}
							/>
							<Form.Input
								width={4}
								label={t("profile.updateProfile.form.securityAnswer")}
								value={this.state.request}
								onChange={this.handleRequest.bind(this)}
							/>
							<Form.Input
								width={4}
								label={
									this.state.juridic === true
										? t("profile.updateProfile.form.contactCompany")
										: t("profile.updateProfile.form.contactFamily")
								}
								value={this.state.nameFamily}
								placeholder={t("profile.updateProfile.form.placeholderContact")}
								onChange={this.handleNameFamily.bind(this)}
							/>
							<Form.Input
								width={4}
								label={
									this.state.juridic === true
										? t("profile.updateProfile.form.contactEmailCompany")
										: t("profile.updateProfile.form.contactEmailFamily")
								}
								value={this.state.emailFamily}
								placeholder='Email '
								type='email'
								onChange={this.handleEmailFamily.bind(this)}
							/>
						</Form.Group>
						{/* <Form.Group>
							<Form.Input
								width={4}
								label={t("profile.updateProfile.form.localbitcoinUser")}
								value={this.state.userLocalBitcoin}
								onChange={this.handleUserLocalBitcoin.bind(this)}
							/>
							<Form.Input
								width={4}
								label={t("profile.updateProfile.form.facebookUser")}
								value={this.state.userFacebook}
								onChange={this.handleUserFacebook.bind(this)}
							/>
						</Form.Group> */}
						<Form.Group>
							<Form.TextArea
								width={16}
								label={
									this.state.juridic === true
										? t("profile.updateProfile.form.addressCompany")
										: t("profile.updateProfile.form.addressPersonal")
								}
								value={this.state.direction}
								onChange={this.handleDirection.bind(this)}
							/>
						</Form.Group>
						<Divider hidden />
						{this.state.userVerifyC === "UNINITIATED" && !this.state.juridic && (
							<Grid>
								<div>
									<Message
										warning
										header={t(
											"profile.updateProfile.form.verifyCUninitiatedPersonal.warning",
										)}
										content={t(
											"profile.updateProfile.form.verifyCUninitiatedPersonal.messageWarning",
										)}
									/>
								</div>
								{messageFileInstrutionsOne}

								{messageFileInstrutionsTwo}
								<Grid.Row textAlign='center'>
									{this.state.existId !== true && (
										<Grid.Column
											largeScreen={8}
											computer={8}
											tablet={16}
											mobile={16}>
											{" "}
											<Form.Field required>
												<Segment placeholder className='sizeSement'>
													<Form.Field>
														<Files
															required
															className='files-dropzone'
															ref={this.dniRef}
															onChange={this.onFilesChange.bind(this)}
															onError={this.onFilesError.bind(this)}
															accepts={["image/*", ".pdf"]}
															multiple={false}
															maxFiles={1}
															id='identity'
															maxFileSize={5000000}
															minFileSize={0}
															clickable={this.state.addFileDni}>
															<Header textAlign='center'>
																{this.state.idFile.extension !== "pdf" && (
																	<img
																		alt=''
																		src={this.state.idImg}
																		className='imageFileV'
																	/>
																)}

																{this.state.idFile.extension === "pdf" && (
																	<div>
																		<Icon
																			name='file pdf'
																			size='big'
																			color='blue'
																		/>
																	</div>
																)}
																{this.state.idFile.name !== undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{this.state.idFile.name}
																	</p>
																)}
																{this.state.idFile.name === undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{t(
																			"profile.updateProfile.form.verifyCUninitiatedPersonal.documentID",
																		)}
																	</p>
																)}
																{messageErrord}
															</Header>
														</Files>

														{!this.state.addFileDni && (
															<Button
																color='blue'
																size='tiny'
																id='file-dni'
																onClick={this.onRemoveFile.bind(this)}>
																{t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.buttonChange",
																)}
															</Button>
														)}
														{this.errorFileDni && (
															<Message
																error
																content={t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.fileNotSupported",
																)}
															/>
														)}
														<br />
													</Form.Field>
												</Segment>
											</Form.Field>
										</Grid.Column>
									)}
									{this.state.existBank !== true && (
										<Grid.Column
											largeScreen={8}
											computer={8}
											tablet={16}
											mobile={16}>
											<Form.Field required>
												{" "}
												<Segment placeholder className='sizeSement'>
													<Form.Field>
														<Files
															className='files-dropzone'
															ref={this.bankRef}
															onChange={this.onFilesChangeBank.bind(this)}
															onError={this.onFilesErrorBank.bind(this)}
															accepts={["image/*", ".pdf"]}
															multiple={false}
															maxFiles={1}
															maxFileSize={5000000}
															minFileSize={0}
															clickable={this.state.addFileBank}>
															<Header textAlign='center'>
																{this.state.bankFile.extension !== "pdf" && (
																	<img
																		alt=''
																		src={this.state.bankImg}
																		className='imageFileV'
																	/>
																)}

																{this.state.bankFile.extension === "pdf" && (
																	<div>
																		<Icon
																			name='file pdf'
																			size='big'
																			color='blue'
																		/>
																	</div>
																)}
																{this.state.bankFile.name !== undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{this.state.bankFile.name}
																	</p>
																)}
																{this.state.bankFile.name === undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{t(
																			"profile.updateProfile.form.verifyCUninitiatedPersonal.bankAccountSupport",
																		)}
																	</p>
																)}
																{messageErrorb}
															</Header>
														</Files>

														{!this.state.addFileBank && (
															<Button
																color='blue'
																size='tiny'
																id='file-bank'
																onClick={this.onRemoveFile.bind(this)}>
																{t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.buttonChange",
																)}
															</Button>
														)}
														{this.errorFileBank && (
															<Message
																error
																content={t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.fileNotSupported",
																)}
															/>
														)}
													</Form.Field>
												</Segment>
											</Form.Field>
										</Grid.Column>
									)}
								</Grid.Row>
								<Grid.Row>
									{this.state.existLocation !== true && (
										<Grid.Column
											largeScreen={8}
											computer={8}
											tablet={16}
											mobile={16}>
											<Form.Field required>
												{" "}
												<Segment placeholder className='sizeSement'>
													<Form.Field>
														<Files
															className='files-dropzone'
															ref={this.locationRef}
															onChange={this.onFilesChangeLocation.bind(this)}
															onError={this.onFilesErrorLocation.bind(this)}
															accepts={["image/*", ".pdf"]}
															multiple={false}
															maxFiles={1}
															maxFileSize={5000000}
															minFileSize={0}
															clickable={this.state.addFileLocation}>
															<Header textAlign='center'>
																{this.state.locationFile.extension !==
																	"pdf" && (
																	<img
																		alt=''
																		src={this.state.locationImg}
																		className='imageFileV'
																	/>
																)}
																{this.state.locationFile.extension ===
																	"pdf" && (
																	<div>
																		<Icon
																			name='file pdf'
																			size='big'
																			color='blue'
																		/>
																	</div>
																)}
																{this.state.locationFile.name !== undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{this.state.locationFile.name}
																	</p>
																)}
																{this.state.locationFile.name === undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{t(
																			"profile.updateProfile.form.verifyCUninitiatedPersonal.addressSupport",
																		)}
																	</p>
																)}
																{messageErrorl}
															</Header>
														</Files>

														{!this.state.addFileLocation && (
															<Button
																color='blue'
																size='tiny'
																id='file-location'
																onClick={this.onRemoveFile.bind(this)}>
																{t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.buttonChange",
																)}
															</Button>
														)}
														{this.errorFileLocation && (
															<Message
																error
																content={t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.fileNotSupported",
																)}
															/>
														)}
													</Form.Field>
												</Segment>
											</Form.Field>
										</Grid.Column>
									)}
									{this.state.existSelf !== true && (
										<Grid.Column
											largeScreen={8}
											computer={8}
											tablet={16}
											mobile={16}>
											<Form.Field required>
												<Segment placeholder className='sizeSement'>
													<Form.Field>
														<Files
															className='files-dropzone'
															ref={this.selfRef}
															onChange={this.onFilesChangeSelfie.bind(this)}
															onError={this.onFilesErrorSelfie.bind(this)}
															accepts={["image/*", ".pdf"]}
															multiple={false}
															maxFiles={1}
															maxFileSize={5000000}
															minFileSize={0}
															clickable={this.state.addFileSelf}>
															<Header textAlign='center'>
																{this.state.selfFile.extension !== "pdf" && (
																	<img
																		alt=''
																		src={this.state.selffImg}
																		className='imageFileV'
																	/>
																)}
																{this.state.selfFile.extension === "pdf" && (
																	<div>
																		<Icon
																			name='file pdf'
																			size='big'
																			color='blue'
																		/>
																	</div>
																)}
																{this.state.selfFile.name !== undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{this.state.selfFile.name}
																	</p>
																)}
																{this.state.selfFile.name === undefined && (
																	<p style={{ fontSize: "11px" }}>
																		{t(
																			"profile.updateProfile.form.verifyCUninitiatedPersonal.selfieSupport",
																		)}
																	</p>
																)}
																{messageErrors}
															</Header>
														</Files>

														{!this.state.addFileSelf && (
															<Button
																color='blue'
																size='tiny'
																id='file-self'
																onClick={this.onRemoveFile.bind(this)}>
																{t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.buttonChange",
																)}
															</Button>
														)}
														{this.errorFileSelf && (
															<Message
																error
																content={t(
																	"profile.updateProfile.form.verifyCUninitiatedPersonal.fileNotSupported",
																)}
															/>
														)}
													</Form.Field>
												</Segment>
											</Form.Field>
										</Grid.Column>
									)}
								</Grid.Row>
							</Grid>
						)}
						{this.state.userVerifyC === "UNINITIATED" &&
							this.state.juridic === true && (
								<Grid>
									<Form.Group>
										<Form.Input
											label={t(
												"profile.updateProfile.form.verifyCUninitiatedCompany.name",
											)}
											value={this.state.companyName}
											onChange={this.handleCompanyName.bind(this)}
										/>
										<Form.Input
											label={t(
												"profile.updateProfile.form.verifyCUninitiatedCompany.registerYear",
											)}
											value={this.state.yearRegistry}
											onChange={this.handleYearRegistryCompany.bind(this)}
										/>
									</Form.Group>
									<Form.Group>
										<Form.Input
											label={t(
												"profile.updateProfile.form.verifyCUninitiatedCompany.registerFiscalType",
											)}
											value={this.state.locationLegalRegistry}
											onChange={this.handleTypeRegistryLegaly.bind(this)}
										/>
										<Form.Input
											label={t(
												"profile.updateProfile.form.verifyCUninitiatedCompany.registerFiscalNumber",
											)}
											value={this.state.numberLocationLegalRegistry}
											onChange={this.handleNumberRegistryLegaly.bind(this)}
										/>
									</Form.Group>
									<div>
										<Message
											warning
											header={t(
												"profile.updateProfile.form.verifyCUninitiatedCompany.warning",
											)}
											content={t(
												"profile.updateProfile.form.verifyCUninitiatedCompany.messageWarning",
											)}
										/>
									</div>
									<br />
									<Divider hidden />
									{messageFileInstrutionsOne}
									{messageFileInstrutionsTwo}
									<Grid.Row textAlign='center'>
										{this.state.existId !== true && (
											<Grid.Column
												largeScreen={8}
												computer={8}
												tablet={16}
												mobile={16}>
												{" "}
												<Form.Field required>
													<Segment placeholder className='sizeSement'>
														<Form.Field>
															<Files
																required
																className='files-dropzone'
																ref={this.dniRef}
																onChange={this.onFilesChange.bind(this)}
																onError={this.onFilesError.bind(this)}
																accepts={["image/*", ".pdf"]}
																multiple={false}
																maxFiles={1}
																id='identity'
																maxFileSize={5000000}
																minFileSize={0}
																clickable={this.state.addFileDni}>
																<Header textAlign='center'>
																	{this.state.idFile.extension !== "pdf" && (
																		<img
																			alt=''
																			src={this.state.idImg}
																			className='imageFileV'
																		/>
																	)}
																	{this.state.idFile.extension === "pdf" && (
																		<div>
																			<Icon
																				name='file pdf'
																				size='big'
																				color='blue'
																			/>
																		</div>
																	)}

																	{this.state.idFile.name !== undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{this.state.idFile.name}
																		</p>
																	)}
																	{this.state.idFile.name === undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{t(
																				"profile.updateProfile.form.verifyCUninitiatedCompany.documentID",
																			)}
																		</p>
																	)}
																	{messageErrord}
																</Header>
															</Files>
															{!this.state.addFileDni && (
																<Button
																	color='blue'
																	size='tiny'
																	id='file-dni'
																	onClick={this.onRemoveFile.bind(this)}>
																	{t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.buttonChange",
																	)}
																</Button>
															)}
															{this.errorFileDni && (
																<Message
																	error
																	content={t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.fileNotSupported",
																	)}
																/>
															)}
															<br />
														</Form.Field>
													</Segment>
												</Form.Field>
											</Grid.Column>
										)}
										{this.state.existBank !== true && (
											<Grid.Column
												largeScreen={8}
												computer={8}
												tablet={16}
												mobile={16}>
												<Form.Field required>
													<Segment placeholder className='sizeSement'>
														<Form.Field>
															<Files
																className='files-dropzone'
																ref={this.bankRef}
																onChange={this.onFilesChangeBank.bind(this)}
																onError={this.onFilesErrorBank.bind(this)}
																accepts={["image/*", ".pdf"]}
																multiple={false}
																maxFiles={1}
																maxFileSize={5000000}
																minFileSize={0}
																clickable={this.state.addFileBank}>
																<Header textAlign='center'>
																	{this.state.bankFile.extension !== "pdf" && (
																		<img
																			alt=''
																			src={this.state.bankImg}
																			className='imageFileV'
																		/>
																	)}
																	{this.state.bankFile.extension === "pdf" && (
																		<div>
																			<Icon
																				name='file pdf'
																				size='big'
																				color='blue'
																			/>
																		</div>
																	)}
																	{this.state.bankFile.name !== undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{this.state.bankFile.name}
																		</p>
																	)}
																	{this.state.bankFile.name === undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{t(
																				"profile.updateProfile.form.verifyCUninitiatedCompany.bankAccountSupport",
																			)}
																		</p>
																	)}
																	{messageErrorb}
																</Header>
															</Files>

															{!this.state.addFileBank && (
																<Button
																	color='blue'
																	size='tiny'
																	id='file-bank'
																	onClick={this.onRemoveFile.bind(this)}>
																	{t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.buttonChange",
																	)}
																</Button>
															)}
															{this.errorFileBank && (
																<Message
																	error
																	content={t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.fileNotSupported",
																	)}
																/>
															)}
														</Form.Field>
													</Segment>
												</Form.Field>
											</Grid.Column>
										)}
									</Grid.Row>
									<Grid.Row>
										{this.state.existLocation !== true && (
											<Grid.Column
												largeScreen={8}
												computer={8}
												tablet={16}
												mobile={16}>
												<Form.Field required>
													<Segment placeholder className='sizeSement'>
														<Form.Field>
															<Files
																className='files-dropzone'
																ref={this.locationRef}
																onChange={this.onFilesChangeLocation.bind(this)}
																onError={this.onFilesErrorLocation.bind(this)}
																accepts={["image/*", ".pdf"]}
																multiple={false}
																maxFiles={1}
																maxFileSize={5000000}
																minFileSize={0}
																clickable={this.state.addFileLocation}>
																<Header textAlign='center'>
																	{this.state.locationFile.extension ===
																		"pdf" && (
																		<img
																			alt=''
																			src={this.state.locationImg}
																			className='imageFileV'
																		/>
																	)}
																	{this.state.locationFile.extension ===
																		"pdf" && (
																		<div>
																			<Icon
																				name='file pdf'
																				size='big'
																				color='blue'
																			/>
																		</div>
																	)}
																	{this.state.locationFile.name !==
																		undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{this.state.locationFile.name}
																		</p>
																	)}
																	{this.state.locationFile.name ===
																		undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{t(
																				"profile.updateProfile.form.verifyCUninitiatedCompany.registerFiscal",
																			)}
																		</p>
																	)}
																	{messageErrorl}
																</Header>
															</Files>

															{!this.state.addFileLocation && (
																<Button
																	color='blue'
																	size='tiny'
																	id='file-location'
																	onClick={this.onRemoveFile.bind(this)}>
																	{t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.buttonChange",
																	)}
																</Button>
															)}
															{this.errorFileLocation && (
																<Message
																	error
																	content={t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.fileNotSupported",
																	)}
																/>
															)}
														</Form.Field>
													</Segment>
												</Form.Field>
											</Grid.Column>
										)}
										{this.state.existSelf !== true && (
											<Grid.Column
												largeScreen={8}
												computer={8}
												tablet={16}
												mobile={16}>
												<Form.Field required>
													<Segment placeholder className='sizeSement'>
														<Form.Field>
															<Files
																className='files-dropzone'
																ref={this.selfRef}
																onChange={this.onFilesChangeSelfie.bind(this)}
																onError={this.onFilesErrorSelfie.bind(this)}
																accepts={["image/*", ".pdf"]}
																multiple={false}
																maxFiles={1}
																maxFileSize={5000000}
																minFileSize={0}
																clickable={this.state.addFileSelf}>
																<Header textAlign='center'>
																	{this.state.selfFile.extension === "pdf" && (
																		<img
																			alt=''
																			src={this.state.selffImg}
																			className='imageFileV'
																		/>
																	)}
																	{this.state.selfFile.extension === "pdf" && (
																		<div>
																			<Icon
																				name='file pdf'
																				size='big'
																				color='blue'
																			/>
																		</div>
																	)}
																	{this.state.selfFile.name !== undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{this.state.selfFile.name}
																		</p>
																	)}
																	{this.state.selfFile.name === undefined && (
																		<p style={{ fontSize: "11px" }}>
																			{t(
																				"profile.updateProfile.form.verifyCUninitiatedCompany.selfieSupport",
																			)}
																		</p>
																	)}
																	{messageErrors}
																</Header>
															</Files>

															{!this.state.addFileSelf && (
																<Button
																	color='blue'
																	size='tiny'
																	id='file-self'
																	onClick={this.onRemoveFile.bind(this)}>
																	{t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.buttonChange",
																	)}
																</Button>
															)}
															{this.errorFileSelf && (
																<Message
																	error
																	content={t(
																		"profile.updateProfile.form.verifyCUninitiatedCompany.fileNotSupported",
																	)}
																/>
															)}
														</Form.Field>
													</Segment>
												</Form.Field>
											</Grid.Column>
										)}
									</Grid.Row>
								</Grid>
							)}
					</Form>
					<Segment textAlign='center' basic>
						{message}
						{this.state.viewButton && (
							<Button
								onClick={this.handleUpdateProfile.bind(this)}
								color='blue'
								name='update'>
								{t("profile.updateProfile.form.buttonSave")}
							</Button>
						)}
						{this.state.userVerifyC === "UNINITIATED" && (
							<Button onClick={this.showModal.bind(this)} color='blue'>
								{t("profile.updateProfile.form.buttonVerify")}
							</Button>
						)}
					</Segment>
					<Segment textAlign='center' basic>
						<Button onClick={this.handleCancel.bind(this)} basic>
							{t("profile.updateProfile.form.buttonBack")}
						</Button>
					</Segment>
				</Segment>
				<Modal open={this.state.open}>
					<Modal.Header>
						{t("profile.updateProfile.modalInitVerification.header")}
					</Modal.Header>
					<Modal.Content>
						{!this.state.errorNetwork && (
							<Segment basic loading={this.state.formLoad}>
								<div>
									{t("profile.updateProfile.modalInitVerification.warning")}
								</div>
								{message}
							</Segment>
						)}

						{this.state.errorNetwork && (
							<div>
								<Message error content={t(this.state.textMessage)} />
							</div>
						)}
					</Modal.Content>
					<Modal.Actions>
						{!this.state.endsend && (
							<Button
								onClick={this.closeModal.bind(this)}
								negative
								disabled={this.state.formLoad}>
								{t("profile.updateProfile.modalInitVerification.buttonNo")}
							</Button>
						)}
						{!this.state.endsend && (
							<Button
								onClick={this.handleUpdateProfile.bind(this)}
								positive
								name='verify'
								disabled={this.state.formLoad}>
								{t("profile.updateProfile.modalInitVerification.buttonYes")}
							</Button>
						)}
						{this.state.endsend && (
							<Button onClick={this.closeModalEnd.bind(this)} color='blue'>
								{t("profile.updateProfile.modalInitVerification.buttonClose")}
							</Button>
						)}
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}
export default translate(UpdateProfile);
