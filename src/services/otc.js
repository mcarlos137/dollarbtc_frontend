import axios from "axios";
import config from "./config.js";
import interceptorHeader from "./interceptor";
const URL_BASE_DBTC = config.apiDollarBtcUrl;

export default {
	addPaymentStatus: false,
	acceptOperationTermsAndConditions(idOperation) {
		return interceptorHeader.createHeaders(
			config.urlDollar.acceptOperationTermsAndConditions + idOperation,
			undefined,
			"GET",
		);
	},

	getFinancialTypes(currency){
		return interceptorHeader.createHeaders(
			config.urlDollar.getFinancialTypes + currency,
			undefined,
			"GET",
		);
	},
	getOperationIndexesAndValues() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperationIndexesAndValues,
			undefined,
			"GET",
		);
	},
	getAutomaticChatMessages(currency) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getAutomaticChatMessages + currency + "/ES",
			undefined,
			"GET",
		);
	},
	getAutomaticChatMessagesOperation(
		currency,
		otcOperationType,
		otcOperationStatus,
	) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getAutomaticChatMessages +
				currency +
				"/ES/" +
				otcOperationType +
				"/" +
				otcOperationStatus,
			undefined,
			"GET",
		);
	},
	getOldOffersAdmin(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOldOffersAdmin + username,
			undefined,
			"GET",
		);
	},
	getOTCAccountsBalance(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOTCMasterAccountBalances + username,
			undefined,
			"GET",
		);
	},
	getOfferByUrl(token) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOfferToken + token,
			undefined,
			"GET",
		);
	},
	getOffers() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOffers,
			undefined,
			"GET",
		);
	},
	getOffersByCurrency(currency) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOffers + "/" + currency,
			undefined,
			"GET",
		);
	},
	async getOffersByCurrencyAsync(currency) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOffers + "/" + currency,
			undefined,
			"GET",
		);
	},
	getOffersNewService(currency, id, operation, type) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOffers +
				"/" +
				currency +
				"/" +
				id +
				"/" +
				operation +
				"/" +
				type,
			undefined,
			"GET",
		);
	},

	getOffersFastChangeCurrentAccounts(currency, paymentId, paymentType) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOffers +
				"/" +
				currency +
				"/" +
				paymentId +
				"/" +
				paymentType,
			undefined,
			"GET",
		);
	},
	async getOffersNewServiceAsyn(currency, id, operation, type) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOffers +
				"/" +
				currency +
				"/" +
				id +
				"/" +
				operation +
				"/" +
				type,
			undefined,
			"GET",
		);
	},
	getPayments(moneda, username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getPayments + username + "/" + moneda,
			undefined,
			"GET",
		);
	},
	getPaymentTypes(moneda) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getPaymentTypes + moneda,
			undefined,
			"GET",
		);
	},
	getAllPaymentsTypes() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getPaymentTypes,
			undefined,
			"GET",
		);
	},
	adminGetBalance(profile) {
		return interceptorHeader.createHeaders(
			config.urlDollar.adminGetBalance + profile + "/true",
			undefined,
			"GET",
		);
	},
	getDollarBTCPaymentBalance(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getDollarBTCPaymentBalance,
			body,
			"POST",
		);
	},
	modifyOperationCheckList(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.modifyOperationCheckList,
			body,
			"POST",
		);
	},
	getOperationsAdmin(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperationsAdmin,
			body,
			"POST",
		);
	},
	getOperationsFilterAdmin(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperationsFilterAdmin,
			body,
			"POST",
		);
	},
	getBalanceMovements(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getBalanceMovements,
			body,
			"POST",
		);
	},
	getDollarBTCPaymentBalanceMovements(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getDollarBTCPaymentBalanceMovements,
			body,
			"POST",
		);
	},
	addPayment(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.addPayment,
			body,
			"POST",
		);
	},
	addDollarBTCPayment(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.addDollarBTCPayment,
			body,
			"POST",
		);
	},
	addBalanceToDollarBTCPayment(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.addBalanceToDollarBTCPayment,
			body,
			"POST",
		);
	},
	async asyncSubstractBalanceToDollarBTCPayment(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.substractBalanceToDollarBTCPayment,
			body,
			"POST",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in susbstract balance");
		}
		return RESPONSE;
	},
	createOperation(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.createOperation,
			body,
			"POST",
		);
	},
	getOperations(bodyGetOperations) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperations,
			bodyGetOperations,
			"POST",
		);
	},
	getOperation(idOperation) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperation + idOperation,
			undefined,
			"GET",
		);
	},
	getContactMessages(idOperation) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getContactMessages + idOperation,
			undefined,
			"GET",
		);
	},
	getUserTypePayments() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getPayments + sessionStorage.getItem("username"),
			undefined,
			"GET",
		);
	},
	getUserTypePaymentsAdmin(user) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getPayments + user,
			undefined,
			"GET",
		);
	},
	getStatusAddPayment() {
		return this.addPaymentStatus;
	},
	addPostOperationMessageSimple(idOperation, message) {
		let msg = message.replace(/ /g, "_");
		return interceptorHeader.createHeaders(
			config.urlDollar.postOperationMessage +
				idOperation +
				"/" +
				sessionStorage.getItem("username") +
				"/" +
				msg,
			undefined,
			"GET",
		);
	},
	addPostOperationMessageWithFile(formData) {
		let url = URL_BASE_DBTC + config.urlDollar.otcPostOperationMessage;
		// ////console.log(url);
		const configuration = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		return axios.post(url, formData, configuration);
	},
	deletePaymentUser(currency, id) {
		return interceptorHeader.createHeaders(
			config.urlDollar.removePayment +
				sessionStorage.getItem("username") +
				"/" +
				currency +
				"/" +
				id,
			undefined,
			"GET",
		);
	},
	async changeOperationStatus(body) {
		return await interceptorHeader.createHeaders(
			config.urlDollar.changeOperationStatus,
			body,
			"POST",
		);
	},
	async changeOperationStatusBuyBalance(body) {
		return await interceptorHeader.createHeaders(
			config.urlDollar.changeOperationStatusBuyBalance,
			body,
			"POST",
		);
	},
	getClientPaymentTypes() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getClientPaymentTypes,
			undefined,
			"GET",
		);
	},
	getClientPaymentTypeForCurrency(currency) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getClientPaymentTypes + "/" + currency,
			undefined,
			"GET",
		);
	},
	getClientPaymentById(username, idPayment) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getClientPayment + username + "/" + idPayment,
			undefined,
			"GET",
		);
	},
	getClientPayment(idPayment) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getClientPayment +
				sessionStorage.getItem("username") +
				"/" +
				idPayment,
			undefined,
			"GET",
		);
	},
	getCurrencies() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getCurrencies,
			undefined,
			"GET",
		);
	},
	getAdminCurrencies(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getCurrenciesUser + username,
			undefined,
			"GET",
		);
	},
	addOffer(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.addOffer,
			body,
			"POST",
		);
	},
	removeOffer(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.removeOffer,
			body,
			"POST",
		);
	},
	editdollarBTCPayment(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.editDollarBTCPayment,
			body,
			"POST",
		);
	},
	getCurrenciesOperator(email) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getCurrenciesUser + email,
			undefined,
			"GET",
		);
	},
	updateCurrenciesToUser(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.editCurrenciesUser,
			body,
			"POST",
		);
	},
	editOffer(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.updateOffer,
			body,
			"POST",
		);
	},
	addDynammicOffer(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.addDynamicOffer,
			body,
			"POST",
		);
	},
	updateDynamicOffer(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.editDynamicOffer,
			body,
			"POST",
		);
	},
	async resetBalanceOperation(currency) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperationReset + currency,
			undefined,
			"GET",
		);
	},
	async getOperationParams(currency) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperationsBalanceParams + currency,
			undefined,
			"GET",
		);
	},
	async setOperationParams(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.setOperationsBalanceParams,
			body,
			"POST",
		);
	},
	createReview(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.addReview,
			body,
			"POST",
		);
	},
	getReviews(quantity) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getReviews + quantity,
			undefined,
			"GET",
		);
	},
	getReviewPerOperation(operation) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getReviewPerOperation + operation,
			undefined,
			"GET",
		);
	},
	getPaymentsAdmin(username, currency) {
		let url;
		if (currency !== undefined) {
			url = config.urlDollar.getPaymentsAdmin + username + "/" + currency;
		} else {
			url = config.urlDollar.getPaymentsAdmin + username;
		}
		return interceptorHeader.createHeaders(url, undefined, "GET");
	},
	getDollarBTCPayment(currency, id) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getDollarBTCPayment + currency + "/" + id,
			undefined,
			"GET",
		);
	},
	getOffersAdmin(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOffersAdmin + username,
			undefined,
			"GET",
		);
	},
	getOperationCheckList(currency, operationType, status) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOperationCheckList +
				currency +
				"/" +
				operationType +
				"/" +
				status,
			undefined,
			"GET",
		);
	},
	getMasterAccount(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOTCMasterAccountNames + username,
			undefined,
			"GET",
		);
	},
	getBalancesNull() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getBalances,
			undefined,
			"GET",
		);
	},
	getBalances(masterAccount) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getBalances + "/" + masterAccount,
			undefined,
			"GET",
		);
	},
	getBalancesMaster(masterAccount) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getBalanceMaster + "/" + masterAccount,
			undefined,
			"GET",
		);
	},
	getOTCMasterAccountProfitsAndChargesBalance(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getOTCMasterAccountProfitsAndChargesBalance,
			body,
			"POST",
		);
	},
	getNames() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getNames,
			undefined,
			"GET",
		);
	},
	getAutomaticRules() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getAutomaticRules,
			undefined,
			"GET",
		);
	},
	getDetails() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getDetails,
			undefined,
			"GET",
		);
	},
	async buyBtcWithPayment(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.buyBitcoinToOtcAccount,
			body,
			"POST",
		);

		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},
	async transferBetweenDollarBTCPayments(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.transferBetweenDollarBTCPayments,
			body,
			"POST",
		);

		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},
	async sellBtcWithOtcAccount(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.sellBitcoinToOtcAccount,
			body,
			"POST",
		);

		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},
	getLimitsOfOperations() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getLimits,
			undefined,
			"GET",
		);
	},
	getCharges() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getCharges,
			undefined,
			"GET",
		);
	},

	getBalanceOtcOperations() {
		return interceptorHeader.createHeaders(
			config.urlDollar.getBalanceOtcOperations,
			undefined,
			"GET",
		);
	},
	getSpecialPayments(username) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getSpecialPayments + username,
			undefined,
			"GET",
		);
	},

	getChargesByOperation(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.getCharges,
			body,
			"POST",
		);
	},
	checkVerification(body) {
		return interceptorHeader.createHeaders(
			config.urlDollar.configVerification,
			body,
			"POST",
		);
	},
	async getOfficesInfoOtc(currency, officeId) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getOfficessInfoByBank + currency + "/" + officeId,
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("Error in reques");
		}
		return RESPONSE;
	},
	async getOperationAsync(idOperation) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getOperation + idOperation,
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},
	async getChangeFactor() {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getChangeFactors,
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},
	async updateFactorsChange(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.updateChangeFactors,
			body,
			"PUT",
		);
		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},

	editAdminUserCommissions(body) {
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.editAdminUserCommissions,
			body,
			"PUT",
		);

		return RESPONSE;
	},

	editDollarBTCPaymentCommissions(body) {
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.editDollarBTCPaymentCommissions,
			body,
			"PUT",
		);

		return RESPONSE;
	},

	async getChargesByOperationOtc(body) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getCharges,
			body,
			"POST",
		);
		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},
	async getThirdPartyData(id) {
		const RESPONSE = await interceptorHeader.createHeaders(
			config.urlDollar.getThirdPartySendData + id,
			undefined,
			"GET",
		);
		if (RESPONSE.status !== 200) {
			throw Error("error in request");
		}
		return RESPONSE;
	},

	getDollarBTCPaymentCommissionsBalance(currency, id) {
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.getDollarBTCPaymentCommissionsBalance +
				currency +
				"/" +
				id,
			undefined,
			"GET",
		);

		return RESPONSE;
	},
	getDollarBTCPaymentCommissionsBalanceMovements(
		currency,
		id,
		initTimestamp,
		finalTimestamp,
	) {
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.getDollarBTCPaymentCommissionsBalanceMovements +
				currency +
				"/" +
				id +
				"/" +
				initTimestamp +
				"/" +
				finalTimestamp,
			undefined,
			"GET",
		);

		return RESPONSE;
  },
  
  sendDollarBTCPaymentCommissionsToMoneyClick(body){
    
		const RESPONSE = interceptorHeader.createHeaders(
			config.urlDollar.sendDollarBTCPaymentCommissionsToMoneyClick,
			body,
			"PUT",
		);

		return RESPONSE;
	},
  
};
