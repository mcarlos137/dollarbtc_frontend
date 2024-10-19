import axios from "axios";
import config from "./config.js";
import headers from "./headers";
import decode from "./decode";
import _ from "underscore";
import HMACInterceptor from "../hmac/HMACInterceptor";
import interceptorHeader from "./interceptor";
import packageJson from "../../package.json";
const URL_BASE_DBTC = config.apiDollarBtcUrl;
const URL_BASE_BUSHIDO = packageJson.bushidoServiceURL;

export default {
	users: [],
	sussesfullRegister: false,
	result: null,
	requestVerify: false,
	notVerifyUser: true,
	notAuth: false,
	responseAuth: false,
	updateUser: null,
	tokenPasswordUpdate: null,
	validVerifyPhone: null,
	responseSendPhone: null,

	async updateUserData(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.userModifyInfo,
			body,
			"PUT",
		);
		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},
	async addDataUserAsync(body) {
		const response = await interceptorHeader.createHeaders(
			config.urlDollar.userAddInfo,
			body,
			"POST",
		);
		if (response.status !== 200) {
			throw Error("Error in request" + response.toString());
		}
		return response;
	},
	getUsersInfo() {
		return interceptorHeader.createHeaders(
			config.urlDollar.userList,
			undefined,
			"GET",
		);
	},
	getUsers() {
		return interceptorHeader.createHeaders(
			config.urlDollar.userListNames,
			undefined,
			"GET",
		);
	},
	userMovements(user, dateEnd, dateInit) {
		return interceptorHeader.createHeaders(
			config.urlDollar.userMovements +
				"/" +
				user +
				"/" +
				dateEnd +
				"/" +
				dateInit,
			undefined,
			"GET",
		);
	},
	getListUsers() {
		return this.users;
	},
	sigNin(body) {
		////console.log(URL_BASE_BUSHIDO + config.urlBushido.registration);
		return axios.post(URL_BASE_BUSHIDO + config.urlBushido.registration, body);
	},
	setPinUserB(body) {
		////console.log("pind");
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.registrationPin,
			body,
		);
	},
	sigNinDollarBtcB(body) {
		const instance = axios.create();
		let interceptor = new HMACInterceptor(
			"Admin",
			"f0d16792-cdc9-4585-a5fd-bae3d898d8c5",
			"eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==",
			"SHA256",
		);
		let conf = headers.createHeadersPost(
			URL_BASE_DBTC,
			config.urlDollar.userCreate,
			body,
		);

		instance.interceptors.request.use(
			(conf) => {
				interceptor.process(conf);
				return conf;
			},
			(error) => {
				////console.log(error);
				return Promise.reject(error);
			},
		);
		// ////console.log("add payment body", body);
		return instance(conf);
	},
	verifyUserRequestCore(body) {
		// ////console.log("add payment body", body);
		return interceptorHeader.createHeaders(
			config.urlDollar.startVerification,
			body,
			"POST",
		);
	},
	getActualUserInfo(allInfo) {
		var listKeys = Object.keys(allInfo);
		var listActualKeys = [];
		var actualFirstnameKey;
		var actualFlagKey;
		var actualLastnameKey;
		var actualPhoneKey;
		var actualQuestionSecurityKey;
		var actualAnswerSecurityKey;
		var actualTypeDocumentIdentityKey;
		var actualNumberDocumentIdentityKey;
		var actualGenderKey;
		var actualBirthdateKey;
		var actualBirthplaceKey;
		var actualFamilyNameKey;
		var actualFamilyEmailKey;
		var actualUserLocalBitcoinKey;
		var actualUserFacebookKey;
		var actualUserAddressKey;
		var actualNickname;
		let actualCompanyName,
			actualCompanyTypeOfFiscalRecord,
			actualCompanyNumberOfFiscalRecord,
			actualCompanyYearRegistration,
			sourceSignin,
			actualMCWallets,
			actualTokens;
		for (var i = 0; i < listKeys.length; i++) {
			if (listKeys[i].startsWith("firstName")) {
				actualFirstnameKey = listKeys[i];
			} else if (listKeys[i].startsWith("lastName")) {
				actualLastnameKey = listKeys[i];
			} else if (listKeys[i].startsWith("phone")) {
				actualPhoneKey = listKeys[i];
			} else if (listKeys[i].startsWith("questionSecurity")) {
				actualQuestionSecurityKey = listKeys[i];
			} else if (listKeys[i].startsWith("answerSecurity")) {
				actualAnswerSecurityKey = listKeys[i];
			} else if (listKeys[i].startsWith("typeDocumentIdentity")) {
				actualTypeDocumentIdentityKey = listKeys[i];
			} else if (listKeys[i].startsWith("numberDocumentIdentity")) {
				actualNumberDocumentIdentityKey = listKeys[i];
			} else if (listKeys[i].startsWith("gender")) {
				actualGenderKey = listKeys[i];
			} else if (listKeys[i].startsWith("birthdate")) {
				actualBirthdateKey = listKeys[i];
			} else if (listKeys[i].startsWith("birthplace")) {
				actualBirthplaceKey = listKeys[i];
			} else if (listKeys[i].startsWith("familyName")) {
				actualFamilyNameKey = listKeys[i];
			} else if (listKeys[i].startsWith("familyEmail")) {
				actualFamilyEmailKey = listKeys[i];
			} else if (listKeys[i].startsWith("userLocalBitcoin")) {
				actualUserLocalBitcoinKey = listKeys[i];
			} else if (listKeys[i].startsWith("userFacebook")) {
				actualUserFacebookKey = listKeys[i];
			} else if (listKeys[i].startsWith("userDirection")) {
				actualUserAddressKey = listKeys[i];
			} else if (listKeys[i].startsWith("nickname")) {
				actualNickname = listKeys[i];
			} else if (listKeys[i].startsWith("companyName")) {
				actualCompanyName = listKeys[i];
			} else if (listKeys[i].startsWith("companyTypeOfFiscalRecord")) {
				actualCompanyTypeOfFiscalRecord = listKeys[i];
			} else if (listKeys[i].startsWith("companyNumberOfFiscalRecord")) {
				actualCompanyNumberOfFiscalRecord = listKeys[i];
			} else if (listKeys[i].startsWith("companyYearRegistration")) {
				actualCompanyYearRegistration = listKeys[i];
			} else if (listKeys[i].startsWith("sourceSignin")) {
				sourceSignin = listKeys[i];
			} else if (listKeys[i].startsWith("flag")) {
				actualFlagKey = listKeys[i];
			} else if (listKeys[i].startsWith("mcWallets")) {
				actualMCWallets = listKeys[i];
			} else if (listKeys[i].startsWith("otherNotificationTokens")) {
				actualTokens = listKeys[i];
			}
		}
		listActualKeys.push(
			actualFirstnameKey,
			actualLastnameKey,
			actualPhoneKey,
			actualQuestionSecurityKey,
			actualAnswerSecurityKey,
			actualTypeDocumentIdentityKey,
			actualNumberDocumentIdentityKey,
			actualGenderKey,
			actualBirthdateKey,
			actualBirthplaceKey,
			actualFamilyNameKey,
			actualFamilyEmailKey,
			actualUserLocalBitcoinKey,
			actualUserFacebookKey,
			actualUserAddressKey,
			actualNickname,
			actualCompanyName,
			actualCompanyTypeOfFiscalRecord,
			actualCompanyNumberOfFiscalRecord,
			actualCompanyYearRegistration,
			sourceSignin,
			actualFlagKey,
			actualMCWallets,
			actualTokens,
			"address",
			"operationAccount",
			"environment",
			"type",
			"active",
			"email",
			"wallets",
			"name",
			"mcWallets",
		);
		var modifiedObj = _.pick(allInfo, [listActualKeys]);
		var normalizeObject = {};
		Object.entries(modifiedObj).forEach(([key, value]) => {
			if (key.startsWith("firstName")) {
				normalizeObject.firstName = value;
			} else if (key.startsWith("lastName")) {
				normalizeObject.lastName = value;
			} else if (key.startsWith("email")) {
				normalizeObject.email = value;
			} else if (key.startsWith("active")) {
				normalizeObject.active = value;
			} else if (key === "type") {
				normalizeObject.type = value;
			} else if (key.startsWith("environment")) {
				normalizeObject.environment = value;
			} else if (key.startsWith("operationAccount")) {
				normalizeObject.operationAccount = value;
			} else if (key.startsWith("address")) {
				normalizeObject.address = value;
			} else if (key.startsWith("questionSecurity")) {
				normalizeObject.questionSecurity = value;
			} else if (key.startsWith("answerSecurity")) {
				normalizeObject.answerSecurity = value;
			} else if (key.startsWith("typeDocumentIdentity")) {
				normalizeObject.typeDocumentIdentity = value;
			} else if (key.startsWith("numberDocumentIdentity")) {
				normalizeObject.numberDocumentIdentity = value;
			} else if (key.startsWith("gender")) {
				normalizeObject.gender = value;
			} else if (key.startsWith("birthdate")) {
				normalizeObject.birthdate = value;
			} else if (key.startsWith("birthplace")) {
				normalizeObject.birthplace = value;
			} else if (key.startsWith("familyName")) {
				normalizeObject.familyName = value;
			} else if (key.startsWith("familyEmail")) {
				normalizeObject.familyEmail = value;
			} else if (key.startsWith("userLocalBitcoin")) {
				normalizeObject.userLocalBitcoin = value;
			} else if (key.startsWith("userFacebook")) {
				normalizeObject.userFacebook = value;
			} else if (key.startsWith("userDirection")) {
				normalizeObject.userDirection = value;
			} else if (key.startsWith("phone")) {
				normalizeObject.phone = value;
			} else if (key.startsWith("nickname")) {
				normalizeObject.nickname = value;
			} else if (key.startsWith("companyName")) {
				normalizeObject.companyName = value;
			} else if (key.startsWith("companyTypeOfFiscalRecord")) {
				normalizeObject.companyTypeOfFiscalRecord = value;
			} else if (key.startsWith("companyNumberOfFiscalRecord")) {
				normalizeObject.companyNumberOfFiscalRecord = value;
			} else if (key.startsWith("companyYearRegistration")) {
				normalizeObject.companyYearRegistration = value;
			} else if (key.startsWith("wallets")) {
				normalizeObject.wallets = Object.values(value.current)[0].address;
			} else if (key.startsWith("mcWallets")) {
				normalizeObject.mcWallets = Object.values(value.current)[0].address;
			} else if (key.startsWith("name")) {
				normalizeObject.name = value;
			} else if (key.startsWith("sourceSignin")) {
				normalizeObject.sourceSignin = value;
			} else if (key.startsWith("flag")) {
				normalizeObject.flag = value;
			} else if (key.startsWith("otherNotificationTokens")) {
				normalizeObject.otherNotificationTokens = value;
			}
		});
		return normalizeObject;
	},
	generateKeyService(username, password) {
		var bodyBushido = {
			userEmail: username,
			currency: "BTC",
		};
		this.generateAddress(bodyBushido, username, password)
			.then((res) => {
				if (res.data !== null) {
					if (res.data.errors === null && res.data.payload !== null) {
						let address = res.data.payload.split("__")[0];
						let privateKey = res.data.payload.split("__")[1];
						window.sessionStorage.setItem("address", address);
						var btcbody = {
							userName: username,
							balanceOperationType: "RECEIVE",
							address: address,
							privateKey: privateKey,
							amounts: {
								BTC: 0,
							},
							targetAddress: "",
							additionalInfo: "INITIAL DEPOSIT",
						};
						this.balanceOperation(btcbody)
							.then((res) => {
								////console.log(res);
							})
							.catch((error) => {
								////console.log(error);
							});
					}
				}
			})
			.catch((error) => {
				////console.log(error);
			});
	},
	generateAddress(body, username, password) {
		return axios.post(URL_BASE_BUSHIDO + config.urlBushido.keyGenerate, body, {
			auth: {
				username: username,
				password: password,
			},
		});
	},
	balanceOperation(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.userBalanceOperation,
			body,
			"POST",
		);
	},
	verifyUserInit(email) {
		if (
			typeof sessionStorage.getItem("emailSend") !== "undefined" &&
			typeof sessionStorage.getItem("emailSend") !== null &&
			sessionStorage.getItem("emailSend") !== "true"
		) {
			var body = { email: email, reset: false, source: "PORTAL_NORMAL" };
			axios
				.post(URL_BASE_BUSHIDO + config.urlBushido.verifyInit, body)
				.then((res) => {
					sessionStorage.setItem("emailSend", "true");
				})
				.catch((error) => {
					////console.log(error);
				});
		}
	},
	verifyUserRequest(body) {
		////console.log("verificando usuarios");
		var request = body;
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.verifyConfirm,
			request,
		);
	},
	authUser(email, password) {
		// var resp;
		var pass = decode.encode(password);
		var pin = decode.encode("2018");
		var hash = decode.randomBytes(50);
		var pinHash = decode.randomBytes(50);
		var endPass = decode.encode(pass + decode.bytesToBase64(hash));
		var endPin = decode.encode(pin + decode.bytesToBase64(pinHash));
		sessionStorage.setItem("pass", endPass);
		var request = {
			userIdOrEmail: email.toLowerCase(),
			credentials: [endPass, endPin],
			source: "web",
		};

		return axios.post(URL_BASE_BUSHIDO + config.urlBushido.auth, request);
	},
	updateLastConexion(user) {
		let data = new Date();
		// ////console.log(data)
		axios
			.post(
				URL_BASE_BUSHIDO + config.urlBushido.updateLastConexion + user,
				data,
			)
			.then((resp) => {
				//////console.log(resp);
				console.log("6");
			})
			.catch((error) => {
				//  ////console.log(error);
			});
	},
	updateNewNickName(nickname) {
		// ////console.log(data)
		let body = {
			nickname: nickname,
			email: sessionStorage.getItem("username"),
		};
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.updateNickName,
			body,
		);
	},
	setValueTosessionStorage(field, value) {
		sessionStorage.setItem(field, value);
	},
	updateProfile(body, username) {
		return axios
			.put(URL_BASE_BUSHIDO + config.urlBushido.updateUser + username, body, {
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			})
			.catch((error) => {
				console.log(error);
			});
	},
	sentTokenUpdatePassword() {
		var request = {
			email: sessionStorage.getItem("username"),
			reset: false,
			source: "PORTAL_NORMAL",
		};
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.passwordReset,
			request,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			},
		);
	},
	addInfoToUserDollarBtc(user, fieldName, value) {
		let keys = [];
		let field = fieldName;
		////console.log(field, value);
		if (value !== undefined) {
			interceptorHeader
				.createHeaders(
					config.urlDollar.userConfig + user + "/OK",
					undefined,
					"GET",
				)
				.then((respu) => {
					let res = respu.data.result;
					keys = Object.keys(res);
					if (keys.indexOf(fieldName) === -1) {
						let body = {
							userName: this.getUserName(),
							fieldName: fieldName,
							fieldValue: value,
						};
						interceptorHeader
							.createHeaders(config.urlDollar.userAddInfo, body, "POST")
							.then((resp) => {
								////console.log(resp);
							})
							.catch((error) => {
								this.addInfoToUserDollarBtc(user, fieldName, value);
								////console.log(error);
							});
					} else {
						let cont = 0;
						for (let key in res) {
							if (fieldName === key) {
								for (let obj in res) {
									if (obj.indexOf("__") === -1) {
										if (fieldName === obj) {
											cont++;
										}
									} else if (obj.split("__")[0] === fieldName) {
										cont++;
									}
								}
								if (cont > 1) {
									let index = cont - 1;
									let campo = fieldName + "__" + index;
									Object.entries(res).forEach(([k, v]) => {
										if (k === campo) {
											if (v !== value) {
												let newValue = cont;
												fieldName = fieldName + "__" + newValue;
												let bodyTwo = {
													userName: this.getUserName(),
													fieldName: fieldName,
													fieldValue: value,
												};
												interceptorHeader
													.createHeaders(
														config.urlDollar.userAddInfo,
														bodyTwo,
														"POST",
													)
													.then((resp) => {
														////console.log(resp);
													})
													.catch((error) => {
														this.addInfoToUserDollarBtc(user, fieldName, value);
														////console.log(error);
													});
											}
										}
									});
								} else {
									if (value !== res[key]) {
										fieldName = fieldName + "__" + 1;
										let bodyTre = {
											userName: this.getUserName(),
											fieldName: fieldName,
											fieldValue: value,
										};
										interceptorHeader
											.createHeaders(
												config.urlDollar.userAddInfo,
												bodyTre,
												"POST",
											)
											.then((resp) => {
												////console.log(resp);
											})
											.catch((error) => {
												this.addInfoToUserDollarBtc(user, fieldName, value);
												////console.log(error);
											});
									}
								}
							}
						}
					}
				});
		}
	},
	confirChanguePassword(token, password) {
		let urlinit = URL_BASE_BUSHIDO + config.urlBushido.passwordResetInit;
		let urlconfir = URL_BASE_BUSHIDO + config.urlBushido.passwordResetConfirm;
		var hashCredencial = "";
		var request = { token: token };
		axios.post(urlinit, request).then((res) => {
			if (!res.data.errors || res.data.errors.length === 0) {
				this.tokenPasswordUpdate = true;
				if (res.data.payload === true) {
					this.tokenPasswordUpdate = false;
				} else {
					var req = { token: token, password: password };
					axios.post(urlconfir, req).then((res) => {
						if (!res.data.errors || res.data.errors.length === 0) {
							this.tokenPasswordUpdate = true;
							hashCredencial = btoa(
								password + ":" + sessionStorage.getItem("username"),
							);
							sessionStorage.setItem("header", hashCredencial);
						} else {
							this.tokenPasswordUpdate = false;
						}
					});
				}
			}
		});
	},
	sendMessagePhone() {
		let url = URL_BASE_BUSHIDO + config.urlBushido.tokenPhone;
		let body = {
			username: sessionStorage.getItem("username"),
			enforceSms: true,
			phoneNumber:
				sessionStorage.getItem("countryCode") +
				"-" +
				sessionStorage.getItem("phone"),
		};
		//  ////console.log(body, url);
		return axios.post(url, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	confirmPhone(code) {
		let url = URL_BASE_BUSHIDO + config.urlBushido.verifyCodePhone;
		let body = {
			token: sessionStorage.getItem("username"),
			code: code,
		};
		return axios.post(url, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	getBalanceUser(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.userBalance + username,
			undefined,
			"GET",
		);
	},
	getConfigUserGeneral(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.userConfig + username + "/OK",
			undefined,
			"GET",
		);
	},
	async getConfigUserGeneralAsync(username) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.userConfig + username + "/OK",
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw "Error";
		}
		return RESPONSE;
	},
	getVerifications(username, status) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getVerifications +
				"?userName=" +
				username +
				"&userVerificationStatus=" +
				status,
			undefined,
			"GET",
		);
	},
	_getGiftCards(status) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getGiftCards + status,
			undefined,
			"GET",
		);
	},
	getUserConfigs(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getConfigs,
			body,
			"POST",
		);
		//return axios.post(URL_BASE_DBTC + config.urlDollar.getConfigs, body);
	},
	userAddAttachment(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.userAddAttachment,
			body,
			"POST",
			true,
		);
	},
	async userAddAttachmentAsync(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.userAddAttachment,
			body,
			"POST",
			true,
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in complete account");
		}
		return RESPONSE;
	},
	userProcessVerification(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.processVerification,
			body,
			"PUT",
		);
	},
	createOperator(email) {
		let body = {
			userName: email,
		};
		return interceptorHeader.createHeaders(
			config.urlDollar.userToOperator,
			body,
			"PUT",
		);
	},

	transferBTC(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.transferBTC,
			body,
			"PUT",
		);
	},
	// Get Metods generals >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	updateResponse() {
		this.requestVerify = false;
		this.sussesfullRegister = false;
		this.result = "";
		// this.notVerifyUser = true;
		// this.notAuth = false;
	},
	createRol(body) {
		return axios.post(URL_BASE_BUSHIDO + config.urlBushido.createRol, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	updateRol(body) {
		return axios.post(URL_BASE_BUSHIDO + config.urlBushido.updateRol, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	deleteRol(body) {
		return axios.post(URL_BASE_BUSHIDO + config.urlBushido.deleteRol, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	deleteRolAUser(body) {
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.deleteRolToUser,
			body,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			},
		);
	},
	asignateRol(body) {
		return axios.post(URL_BASE_BUSHIDO + config.urlBushido.asignateRol, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	getListAllRolToUser(body) {
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.listAllUserWithRol,
			body,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			},
		);
	},
	getAllRols() {
		return axios.get(URL_BASE_BUSHIDO + config.urlBushido.listAllRols, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	multiAsignateRol(body) {
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.multiAsignate,
			body,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			},
		);
	},
	getNotAuth() {
		return this.notAuth;
	},
	getUpdateUser() {
		return this.updateUser;
	},
	getUserStatus() {
		return sessionStorage.getItem("verify");
	},
	getResponseAuth() {
		return this.responseAuth;
	},
	getUserAuth() {
		return sessionStorage.getItem("auth");
	},
	getUserName() {
		return sessionStorage.getItem("username");
	},
	getUserEmail() {
		return sessionStorage.getItem("email");
	},
	getAddress() {
		return sessionStorage.getItem("address");
	},
	getWallets() {
		return JSON.parse(sessionStorage.getItem("userWallets"));
	},
	getResponseResult() {
		return this.sussesfullRegister;
	},
	getResutlPost() {
		return this.result;
	},
	getRequestVerify() {
		return this.requestVerify;
	},
	getHeader() {
		return sessionStorage.getItem("header");
	},
	getUserLocal() {
		return sessionStorage.getItem("user");
	},
	getResultSendTokenUpdatePassword() {
		return this.tokenPasswordUpdate;
	},
	getResultVerifyPhone() {
		return this.validVerifyPhone;
	},
	getUserVerificationStatus() {
		let data = sessionStorage.getItem("userVerificationStatus");
		if (data !== null && data !== undefined) {
			let js = JSON.parse(data);
			return js;
		} else {
			return null;
		}
	},
	getUserRol() {
		let data = sessionStorage.getItem("r");
		if (data !== null && data !== undefined) {
			let js = JSON.parse(data);
			return js;
		} else {
			return null;
		}
	},
	getBalanceStorageUserBTC() {
		let data = sessionStorage.getItem("userBalanceBTC");
		if (data !== null && data !== undefined && data !== "") {
			let js = JSON.parse(data);
			return js;
		} else {
			let js = {
				available: 0,
				estimated: 0,
			};
			return js;
		}
	},
	getDataUserBTC() {
		let data = sessionStorage.getItem("userDataDBTC");
		if (
			sessionStorage.getItem("userDataDBTC") !== null &&
			sessionStorage.getItem("userDataDBTC") !== undefined
		) {
			let js = JSON.parse(data);
			return js;
		} else {
			return null;
		}
	},
	async logout() {
		try {
			this.closeSession(sessionStorage.getItem("username"));
			window.sessionStorage.clear();
			sessionStorage.removeItem("auth");
			sessionStorage.removeItem("username");
			sessionStorage.removeItem("email");
			sessionStorage.removeItem("header");
			sessionStorage.removeItem("address");
			sessionStorage.removeItem("websocketKey");
			sessionStorage.removeItem("wallets");
			sessionStorage.removeItem("userWallets");
			this.notAuth = true;
			this.notVerifyUser = true;
		} catch (error) {
			window.sessionStorage.clear();
			sessionStorage.removeItem("auth");
			sessionStorage.removeItem("username");
			sessionStorage.removeItem("email");
			sessionStorage.removeItem("header");
			sessionStorage.removeItem("address");
			sessionStorage.removeItem("websocketKey");
			sessionStorage.removeItem("wallets");
			sessionStorage.removeItem("userWallets");
			this.notAuth = true;
			this.notVerifyUser = true;
			// return;
		}
	},
	markMessageAsRead(username, id) {
		let body = {
			userName: username,
			id: id,
		};
		return interceptorHeader.createHeaders(
			config.urlDollar.markMessageAsRead,
			body,
			"PUT",
		);
	},

	cancelVerification(idOperationVerification, userVerificationType) {
		let body = {
			userName: sessionStorage.getItem("username"),
			verificationOperationId: idOperationVerification,
			userVerificationType: userVerificationType,
		};

		// ////console.log("add payment body", body);
		return interceptorHeader.createHeaders(
			config.urlDollar.cancelVerification,
			body,
			"PUT",
		);
	},
	updateWalletCreation(email, address) {
		let url = URL_BASE_BUSHIDO + config.urlBushido.updateWalletCreation + email;
		let body = {
			address: address,
		};
		return axios.post(url, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},

	addNewWalletToUser(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.addWallet,
			body,
			"POST",
		);
	},

	inactivateUser(username) {
		let body = {
			userName: username,
		};
		return interceptorHeader.createHeaders(
			config.urlDollar.userInactive,
			body,
			"PUT",
		);
	},
	deleteUser(username) {
		let body = {
			userName: username,
		};
		return interceptorHeader.createHeaders(
			config.urlDollar.userDelete,
			body,
			"POST",
		);
	},
	activateUser(username) {
		let body = {
			userName: username,
		};
		return interceptorHeader.createHeaders(
			config.urlDollar.userActive,
			body,
			"PUT",
		);
	},
	inactivateUserBushido(email) {
		var url = URL_BASE_BUSHIDO + config.urlBushido.userInactive;
		return axios.post(url, email, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	deleteUserBushido(email) {
		var url = URL_BASE_BUSHIDO + config.urlBushido.userDelete;
		return axios.post(url, email, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
			headers: { "Content-Type": "text/plain" },
		});
	},
	activateUserBushido(email) {
		var url = URL_BASE_BUSHIDO + config.urlBushido.userActive;
		return axios.post(url, email, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
			headers: { "Content-Type": "text/plain" },
		});
	},
	addDeviceToUser(body) {
		let url = URL_BASE_BUSHIDO + config.urlBushido.addDevice;
		return axios.post(url, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	updateDeviceToUser(body) {
		let url = URL_BASE_BUSHIDO + config.urlBushido.updateDevice;
		return axios.post(url, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	processBalanceMovements(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.processBalanceMovement,
			body,
			"POST",
		);
	},
	processBalanceMovementsNNull(body) {
		// ////console.log("add payment body", body);
		return interceptorHeader.createHeaders(
			config.urlDollar.processBalanceMovement,
			body,
			"POST",
		);
	},
	processBalanceMovementsFail(body) {
		// ////console.log("add payment body", body);
		return interceptorHeader.createHeaders(
			config.urlDollar.processBalanceMovement,
			body,
			"POST",
		);
	},
	changeProfile(username, userprofile) {
		let body = {
			userName: username,
			userProfile: userprofile,
		};
		return interceptorHeader.createHeaders(
			config.urlDollar.changeProfile,
			body,
			"PUT",
		);
	},
	getSecurityQuestionsByUser(user, quantity) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getSecurityQuestionsByUser + user + "/" + quantity,
			undefined,
			"GET",
		);
	},
	validateSecurityAnswer(body) {
		axios.defaults.headers.post["Content-Type"] = "application/json";
		axios.defaults.headers.post["Accept"] = "text/plain";
		const instance = axios.create();
		let interceptor = new HMACInterceptor(
			"Admin",
			"f0d16792-cdc9-4585-a5fd-bae3d898d8c5",
			"eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==",
			"SHA256",
		);
		let conf = headers.createHeadersPost(
			URL_BASE_DBTC,
			config.urlDollar.validateSecurityAnswer,
			body,
		);

		instance.interceptors.request.use(
			(conf) => {
				interceptor.process(conf);
				return conf;
			},
			(error) => {
				////console.log(error);
				return Promise.reject(error);
			},
		);
		// ////console.log("add payment body", body);
		return instance(conf);
	},
	async completeAccountService(body) {
		const RESPONSE = await axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.accountComplete,
			body,
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in complete account");
		}
		return RESPONSE;
	},

	preferedSecurity(body) {
		let url = URL_BASE_BUSHIDO + config.urlBushido.preferedSecurity;
		return axios.post(url, body, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},
	createGASecretKey(body) {
		// ////console.log("add payment body", body);
		return interceptorHeader.createHeaders(
			config.urlDollar.createGASecretKey,
			body,
			"POST",
		);
	},
	verifyGACode(body) {
		// ////console.log("add payment body", body);
		return interceptorHeader.createHeaders(
			config.urlDollar.verifyGACode,
			body,
			"POST",
		);
	},
	getGAQRCodeUrl() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getGAQRCodeUrl +
				window.sessionStorage.getItem("username"),
			undefined,
			"GET",
		);
	},
	preferedSecurityTwoFactor(body) {
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.preferedSecurityTwoFactor,
			body,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			},
		);
	},
	preferedUserSendCodeTwoFactor() {
		return axios.get(
			URL_BASE_BUSHIDO +
				config.urlBushido.preferedUserSendCodeTwoFactor +
				this.getUserName(),
		);
	},

	listUserBushido() {
		var url = URL_BASE_BUSHIDO + config.urlBushido.listUser;
		return axios.get(url, {
			auth: {
				username: atob(this.getHeader()).split(":")[1],
				password: atob(this.getHeader()).split(":")[0],
			},
		});
	},

	authCodeCore(body) {
		// ////console.log("add payment body", body);
		return interceptorHeader.createHeaders(
			config.urlDollar.authCodeCore,
			body,
			"POST",
		);
	},
	sendAuthCodeCore(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.sendAuthCodeCore,
			body,
			"POST",
		);
	},
	passwordResetToken(body) {
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.passwordResetToken,
			body,
		);
	},
	passwordResetCode(body) {
		return axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.passwordResetCode,
			body,
		);
	},
	async removeVerificationProccessToUser(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.removeVerificationUser,
			body,
			"PUT",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in remove verification");
		}
		return RESPONSE;
	},
	async sendTokenToEmailUser(body) {
		const RESPONSE = await axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.generateTokenVerify,
			body,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			},
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in send code");
		}
		return RESPONSE;
	},
	async verifyTokenToEmail(token) {
		const RESPONSE = await axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.verifyToken,
			token,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
				headers: { "Content-Type": "text/plain" },
			},
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in send code");
		}
		return RESPONSE;
	},
	async updateDepositToUser(body) {
		const RESPONSE = await axios.post(
			URL_BASE_BUSHIDO + config.urlBushido.updateDeposit,
			body,
			{
				auth: {
					username: atob(this.getHeader()).split(":")[1],
					password: atob(this.getHeader()).split(":")[0],
				},
			},
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in send code");
		}
		return RESPONSE;
	},
	async getBalanceAdmin(profileToSearch) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getBalanceAdmin + profileToSearch + "/true",
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in remove verification");
		}
		return RESPONSE;
	},
	async verifyPhoneBushido(username) {
		const RESPONSE = await axios.put(
			URL_BASE_BUSHIDO + config.urlBushido.validatePhone,
			username,
			{ headers: { "Content-Type": "text/plain" } },
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in get payment for currency");
		}
		return RESPONSE;
	},
	async setAccessTokenAuth(body) {
		const RESPONSE = await axios.post(
			config.apiDollarBtcUrl + config.urlDollar.setSecretKey,
			body,
		);

		if (RESPONSE.status !== 200) {
			throw Error("Error in get getReceiveAuthorization");
		}

		return RESPONSE;
	},
	async setQrDataUser(username) {
		const RESPONSE = await axios.put(
			config.apiBushidoBaseUrl + config.urlBushido.setQrCreated,
			username,
			{ headers: { "Content-Type": "text/plain" } },
		);

		if (RESPONSE.status !== 200) {
			throw Error("Error in get getReceiveAuthorization");
		}

		return RESPONSE;
	},
	async getUserWithBtcBalance() {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getUserWithReceiveTransactions,
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in remove verification");
		}
		return RESPONSE;
	},
	async closeSession(username) {
		const RESPONSE = await axios.put(
			config.apiBushidoBaseUrl + config.urlBushido.closeSession,
			username,
			{ headers: { "Content-Type": "text/plain" } },
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in get payment for currency");
		}
		return RESPONSE;
	},
	async updateLastActivity() {
		const RESPONSE = await axios.put(
			config.apiBushidoBaseUrl + config.urlBushido.uptadeLastActivity,
			this.getUserName(),
			{ headers: { "Content-Type": "text/plain" } },
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in get payment for currency");
		}
		return RESPONSE;
	},

	findUserByPhone(phone, countryCode) {
		return axios.get(
			URL_BASE_BUSHIDO +
				config.urlBushido.findUserByPhone +
				phone +
				"/" +
				countryCode,
		);
	},

	findUserByEmail(email) {
		return axios.get(
			URL_BASE_BUSHIDO + config.urlBushido.findUserByEmail + email,
		);
	},
	findUsername(username) {
		return axios.get(
			URL_BASE_BUSHIDO + config.urlBushido.findUsername + username,
		);
	},
	async getSendOpetarionType(targetAddress) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getSendOpetarionType + targetAddress,
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error getSendOpetarionType, code: " + RESPONSE.status);
		}
		return RESPONSE;
	},
	async sendConfirmUserThirdParty(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.sendConfirThirParty,
			body,
			"POST",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error getSendOpetarionType, code: " + RESPONSE.status);
		}
		return RESPONSE;
	},
	async getMovementsUser(username) {
		var dateEnd = new Date();
		var timeback = 1000 * 60 * 60 * 24 * 90;
		var dateInit = new Date(dateEnd.getTime() - timeback);
		var timeadd = 1000 * 60 * 60 * 48;
		dateEnd = new Date(dateEnd.getTime() + timeadd);
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getBalanceMovementsMoneyClick +
				"/" +
				username +
				"/" +
				dateInit.toISOString() +
				"/" +
				dateEnd.toISOString(),
			undefined,
			"GET",
		);

		if (RESPONSE.status !== 200) {
			throw Error(
				"Error en la operacion  /mcUser/getBalanceMovementsMoneyClick cause: ",
			);
		}
		return RESPONSE;
	},
	async getUsersAddressesWithReceivedBTCTransactions(crypto) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getUsersAddressesWithReceivedBTCTransactions + crypto,
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error getSendOpetarionType, code: " + RESPONSE.status);
		}
		return RESPONSE;
	},

	getUserByFlag(flag) {
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.getUserByFlag + flag,
			undefined,
			"GET",
		);
		return RESPONSE;
	},

	addFlag(body) {
		//	console.log(body);
		return interceptorHeader.createHeaders(
			config.urlDollar.addFlag,
			body,
			"PUT",
		);
	},
	listSize() {
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.listSize,
			undefined,
			"GET",
		);
		return RESPONSE;
	},

	onlyOwnPayments(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.onlyOwnPayments,
			body,
			"PUT",
		);
	},
	UserSpecialOption(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.specialOption,
			body,
			"PUT",
		);
	},
	listNamesByIndexAndValue(index, username) {
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.listNamesByIndexAndValue + index + "/" + username,
			undefined,
			"GET",
		);
		return RESPONSE;
	},
};
