import packageJson from '../../package.json';
let urlCore, urlBushido, urlWebSocket;
urlCore = packageJson.coreServiceURL;
urlBushido = packageJson.bushidoServiceURL;
urlWebSocket = packageJson.webSocketServiceURL;
export default {
  // Api Bushidoo
  //apiBushidoBaseUrl: urlBushido,
  apiBushidoBaseUrl:
    'https://service8080.dollarbtc.com/bushido-wallet-service-1.0.3', //Dev Env
  wsBushidoBaseUrl: urlBushido,
  // wsBushidoBaseUrl: "ws://192.168.0.104:8080/bushido-wallet-service"
  urlBushido: {
    tokenTransferred: '/api/v2/user/tokenTransferred',
    listUser: '/api/v2/user',
    findUserByPhone: '/api/v2/user/find/userByPhone/',
    findUserByEmail: '/api/v2/user/valid/email/',
    findUsername: '/api/v2/user/find/',
    registration: '/api/v2/registration/user',
    registrationPin: '/api/v2/registration/pin',
    accountComplete: '/api/v2/user/account/complete',
    auth: '/api/v2/user/auth',
    preferedSecurity: '/api/v2/user/security/update/preferedSecurity',
    authMoneyClick: '/api/v2/user/auth/moneyclick',
    passwordReset: '/api/v2/user/password/reset',
    passwordResetInit: '/api/v2/user/password/reset/init',
    passwordResetToken: '/api/v2/user/password/reset/token',
    passwordResetCode: '/api/v2/user/password/reset/code',
    passwordResetConfirm: '/api/v2/user/password/reset/confirm',
    verifyInit: '/api/v2/user/account/verify/init',
    verifyConfirm: '/api/v2/user/account/verify',
    keyGenerate: '/api/v2/tx/keygenerate', //Genera una direccion de cartera para deposito
    getWallets: '/api/v2/user/get/auth/', //Obtiene las direcciones de cartera de un usuario requiere user email en el body
    updateUser: '/api/v2/update/user/', //Para actualizar datos de usuarios
    generateTokenVerify: '/api/v2/tx/tokentx', //Genera un token de verificacion de usuario
    verifyToken: '/api/v2/tx/tokentxverify', //Verifica el token generado
    addDeposit: '/api/v2/tx/deposit/user/',
    tokenPhone: '/api/v2/user/phone/verify/token',
    sendCode: '/api/v2/user/auth/code/token',
    authCode: '/api/v2/user/auth/code',
    verifyCodePhone: '/api/v2/user/phone/verify/code',
    updateLastConexion: '/api/v2/update/user/lastConexion/',
    updateNickName: '/api/v2/user/update/nickname',
    createRol: '/api/v2/user/rol/create',
    updateRol: '/api/v2/user/rol/update',
    deleteRol: '/api/v2/user/rol/delete',
    asignateRol: '/api/v2/user/rol/asignate',
    multiAsignate: '/api/v2/user/rol/multiAsignate',
    listAllRols: '/api/v2/user/rol/listAll',
    listAllUserWithRol: '/api/v2/user/rol/listUserWithRol',
    deleteRolToUser: '/api/v2/user/rol/deleteRolToUser',
    updateWalletCreation: '/api/v2/user/update/walletCreation/',
    allCategories: '/api/v2/forum/category/all',
    userInactive: '/api/v2/user/inactivate',
    userActive: '/api/v2/user/activate',
    userDelete: '/api/v2/user/delete',
    preferedSecurityTwoFactor:
      '/api/v2/user/security/update/preferedSecurityTwoFactor',
    preferedUserSendCodeTwoFactor:
      '/api/v2/user/find/preferedUserSendCodeTwoFactor/',
    updateDeposit: '/api/v2/deposit/user',
    validatePhone: '/api/v2/user/updatePhoneVerified',
    closeSession: '/api/v2/user/closeSession',
    uptadeLastActivity: '/api/v2/user/updateLastActivity',
    //Forum
    allPosts: '/api/v2/forum/post/all',
    createPost: '/api/v2/forum/post/create',
    updatePost:
      '/api/v2/forum/post/update/' /** Update data in a post by id, add id **/,
    getPost:
      '/api/v2/forum/post/get/' /** Get a specific post by id, add id **/,
    getPostsByUser:
      '/api/v2/forum/post/getByUser/' /** Get a collections of posts by user, add username **/,
    deletePost:
      '/api/v2/forum/post/delete/' /** delete a post by id, add id **/,
    inactivePost:
      '/api/v2/forum/post/inactive/' /** inactive a post by id, add id **/,
    likePost:
      '/api/v2/forum/post/like' /** give a like o unlike a post, add body with username and post's id**/,
    createComment:
      '/api/v2/forum/commentary/create' /** create a comment in a post **/,
    updateComment:
      '/api/v2/forum/commentary/update/' /** update a comment in a post, add commentary's id **/,
    //getComment:"/api/v2/forum/commentary", /** get a comment by id, add commentary's id **/ //OJO ESTA IMCOMPLETA LA URL
    //getCommentsByPost:"/api/v2/forum/commentary", /** get all comments by post, add post's id **/ //OJO ESTA IMCOMPLETA LA URL
    deleteComment:
      '/api/v2/forum/commentary/delete/' /** delete a commentary in a post, add commentary's id **/,
    createReply:
      '/api/v2/forum/reply/create' /** create a reply in a commentary **/,
    updateReply:
      '/api/v2/forum/reply/update/' /** update a reply in a commentary, add reply's id **/,
    deleteReply:
      '/api/v2/forum/reply/delete/' /** delete a reply in a commentary, add reply's id **/,
    getRepliesByComment:
      '/api/v2/forum/' /** get all replies in a comment, add commentary's id **/,
    allComments: '/comments', // Don't work

    //Telegram bot
    sendInvitationTel: '/api/v2/telegram/userdifusion/create', //Invitar a un canal
    sendMessageToChannel: '/api/v2/telegram/message/create', // Enviar mensaje a un canal
    getTelegramGuess: '/api/v2/telegram/telegramguess/all', //Consultar usuarios invitados
    createChannel: '/api/v2/telegram/channel/create', //Crear canal
    getChannels: '/api/v2/telegram/telegramchannels/all', //Consultar canales
    getMessagesSentToChannel: '/api/v2/telegram/telegrambotmessage/all', // Consultar mensajes
    getMembersChannel: '/api/v2/telegram/telegrammemberscount/all/', //consultar cantidad de miembros de un canal

    //Devices
    addDevice: '/api/v2/user/device/add',
    updateDevice: '/api/v2/user/device/update',

    //Chat
    getByUser: '/api/v2/chat/getByUser/', //Concatenar user (email)
    getMessage: '/api/v2/chat/get/', //concatenar message Id
    getAllMessages: '/api/v2/chat/getAll',
    getAdminMessages: '/api/v2/chat/getAdminMessages/', //Concatenar inicio y fin
    deleteMessage: '/api/v2/chat/', //concatenar Id
    deleteAllMessages: '', //pendiente de construir
    markMessageAsRead: '/api/v2/chat/markAsRead',
    getByUserUnregister: '/api/v2/chat/getByUserUnregister/', //concatener user (email)
    updateChatRoom: '/api/v2/chat/chatroom/updateChatRoom/', //concatener admin (email)
    saveChatMessage: '/api/v2/chat/saveChatMessage',
    getChatRoomsByAdminUsername:
      '/api/v2/chat/chatroom/getChatRoomByAdminUsername', //concatener admin (email)

    sendEmail: '/api/v2/sendEmail/',
    setQrCreated: '/api/v2/user/update/qrCreated', // Se manda el username en el body
  },
  // Api DollarBTC
  apiDollarBtcUrl: urlCore,
  //apiDollarBtcUrl: "http://testservice8081.dollarbtc.com",
  testOperationUrl: 'http://dollarbtc.ddns.net:8081',
  urlDollar: {
    //User , // se debe concatenar el username a cada url al final
    getFinancialTypes: '/otcNew/getFinancialTypes/',
    listNamesByIndexAndValue: '/user/listNamesByIndexAndValue/',
    specialOption: '/user/specialOption',
    getGroups: '/notification/getGroups',
    getTopics: '/notification/getTopics',
    createTopic: '/notification/createTopic',
    getMessages: '/notification/getMessages',
    addGroupsToTopic: '/notification/addGroupsToTopic',
    sendMessage: '/notification/sendMessage',
    markMessageAsReaded: '/notification/markMessageAsReaded',
    addTokenToUser: '/notification/addTokenToUser',
    onlyOwnPayments: '/user/allowAssignedPaymentsOnly',
    addFlag: '/user/addFlag',
    getUserByFlag: '/user/listByFlagColor/',
    startVerification: '/user/startVerification',
    userBalance: '/user/getBalance/',
    getReducedOffers: '/website/getReducedOffers',
    getFullPriceInfo: '/analysis/getFullPriceInfo',
    userCreate: '/user/create',
    userConfig: '/user/getConfig/',
    userActive: '/user/activate/',
    userInactive: '/user/inactivate/',
    userDelete: '/user/delete/',
    userList: '/user/list', //Lsita todos los usuarios registrados
    userListNames: '/user/listNames',
    salesBuyFromUser: '/user/getBalanceMovements',
    userMovements: '/user/getBalanceMovements', //ademas de colocar nombre de usuarios se debe concatenar periodos de fecha de inicio y fin en formato timestamp
    userBalanceOperation: '/user/balanceOperation',
    userMcBalanceOperation: '/mcUserNew/balanceOperation',
    addMarterWallaetId: '/user/addMasterWalletIds',
    getMarketPrice: '/user/getMarketPrice/', //añadir target currency y base currency
    getVerifications: '/user/getVerifications',
    cancelVerification: '/user/cancelVerification',
    changeProfile: '/user/changeProfile/', //cambiar perfil de usuario
    markMessageAsRead:
      '/user/markMessageAsReaded/' /** mark a message as read, add userName/id **/,
    userAddInfo: '/user/addInfo',
    userModifyInfo: '/user/modifyInfo',
    getConfigs: '/user/getConfigs',
    processVerification: '/user/processVerification',
    userToOperator: '/user/changeToAdmin/',
    addWallet: '/user/addWallet',
    processBalanceMovement: '/user/processBalanceMovement',
    getProcessingBalance: '/user/getProcessingBalanceMovements',
    removeVerificationUser: '/user/removeUserVerification',
    transferBTC: '/user/transferBTC',
    listSize: '/user/listSize',
    getUserWithReceiveTransactions: '/user/getUsersWithReceivedBTCTransactions',
    getSendOpetarionType: '/user/getSendOpetarionType/',
    getUsersAddressesWithReceivedBTCTransactions:
      '/user/getUsersAddressesWithReceivedTransactions/',
    sendConfirThirParty: '/otc/confirmThirdPartySend',

    //service chat
    postMessage: '/chat/postMessage',
    getAllChatRooms: '/chat/list',
    markAdminMessagesAsReaded: '/chat/markAdminMessagesAsReaded/',
    //-----------------------------------------------------------
    //mfa=======================================================
    createGASecretKey: '/mfa/createGASecretKey', //se concatena el correo del usuario dbtc, este crea el codigo a asociar a ese correo
    getGAQRCodeUrl: '/mfa/getGAQRCodeUrl/', // se concatena el correo del usuario dbtc para ke despues de asociar el correo este retorne el codigo deseado
    authCodeCore: '/mfa/verifyCode',
    sendAuthCodeCore: '/mfa/sendCode',
    verifyGACode: '/mfa/verifyGACode',

    //Models
    getInitialAmounts: '/model/getInitialAmounts/',
    getConfig: '/model/getConfig/',
    getBalanceModel: '/model/getBalance/',
    modelCopy: '/model/copy',
    modelActivate: '/model/activate',
    modelInactivate: '/model/inactivate/',
    modelListAvailable: '/model/listAvailables/',
    modelListUser: '/model/list/',
    modelComments: '/model/getComments/',
    modelData: '/model/getData/',
    modelBalanceOperation: '/model/balanceOperation/',
    modelModifyDescription: '/model/modifyDescription/',
    ordersModel: '/order/getAllOrders/', //para obtener ordenes de un modelo parametros faltantes nombre de exchangue, symbolo, modelo, fecha inicio, fecha fin
    //----------------------------------------------------------------
    //Mercado
    getLocalbitcoinReducedTickers: '/website/getLocalbitcoinReducedTickers',
    getLocalbitcoinTicker: '/website/getLocalbitcoinTicker',
    getOperationCheckList: '/otc/getOperationCheckList/',
    getOperationIndexesAndValues: '/otc/getOperationIndexesAndValues',
    getAutomaticChatMessages: '/otc/getAutomaticChatMessages/',
    getOffers: '/otc/getOffers',
    getOfferToken: '/otc/getOffer/',
    getPayments: '/otc/getPayments/',
    addPayment: '/otc/addPayment',
    addDollarBTCPayment: '/otc/addDollarBTCPayment',
    getPaymentTypes: '/otc/getPaymentTypes/',
    getClientPaymentTypes: '/otc/getClientPaymentTypes',
    getClientPayment: '/otc/getClientPayment/',
    createOperation: '/otc/createOperation/',
    getOperations: '/otc/getOperations/',
    getOperation: '/otc/getOperation/',
    getContactMessages: '/otc/getContactMessages/',
    modelOverview: '/account/overview/', //falta parametro nombre del modelo y periodo a consulta
    getCurrencies: '/otc/getCurrenciesWithCrypto',
    addOffer: '/otc/addOffer',
    removeOffer: '/otc/removeOffer',
    getOldOffers: '/otc/getOldOffers',
    updateOffer: '/otc/editOffer',
    addDynamicOffer: '/otc/addDynamicOffer',
    editDynamicOffer: '/otc/editDynamicOffer',
    changeOperationStatus: '/otc/changeOperationStatus',
    otcPostOperationMessage: '/otcPostOperationMessage',
    userAddAttachment: '/userAddAttachment',
    acceptOperationTermsAndConditions:
      '/otc/acceptOperationTermsAndConditions/',
    getPercentSymbol: '/website/getLocalbitcoinBuyPercent/',
    removePayment: '/otc/removePayment/',
    editAdminUserCommissions: '/otcAdmin/editAdminUserCommissions',
    editDollarBTCPaymentCommissions:
      '/otcAdmin/editDollarBTCPaymentCommissions',
    getDollarBTCPaymentCommissionsBalance:
      '/otcAdmin/getDollarBTCPaymentCommissionsBalance/',
    getDollarBTCPaymentCommissionsBalanceMovements:
      '/otcAdmin/getDollarBTCPaymentCommissionsBalanceMovements/',
    sendDollarBTCPaymentCommissionsToMoneyClick:
      '/otcAdmin/sendDollarBTCPaymentCommissionsToMoneyClick',
    getCurrenciesUser: '/otcAdmin/getCurrencies/',
    editCurrenciesUser: '/otcAdmin/editCurrencies',
    getSpecialPayments: '/otcAdmin/getSpecialPayments/',
    addReview: '/review/create',
    getReviews: '/review/getLasts/',
    getReviewPerOperation: '/review/get/',
    getDollarBTCPayment: '/otc/getDollarBTCPayment/',
    getLimits: '/otc/getLimits',
    getCharges: '/otc/getCharges',
    modifyOperationCheckList: '/otc/modifyOperationCheckList',
    getDollarBTCPaymentBalanceMovements:
      '/otc/getDollarBTCPaymentBalanceMovements',
    getDollarBTCPaymentBalance: '/otc/getDollarBTCPaymentBalance',
    getOfficessInfoByBank: '/otc/getOfficesInfo/',
    fastChangeFromBTC: '/otc/fastChangeFromBTC',
    fastChangeToBTC: '/otc/fastChangeToBTC',
    getThirdPartySendData: '/otc/getThirdPartySendData/', // Se concatena el id
    //Modulator
    getActiveSymbols: '/marketModulator/getActiveSymbols',
    getAutomaticRules: '/marketModulator/getAutomaticRules',
    getManualRules: '/marketModulator/getManualRules',
    updateAutomaticRules: '/marketModulator/modifyAutomaticRules',
    updateManualRules: '/marketModulator/modifyManualRules',
    editDollarBTCPayment: '/otc/editDollarBTCPayment',
    transferBetweenMaster: '/masterAccount/transferBetweenMasters',
    getBalanceMaster: '/masterAccount/getBalance',
    getBalancesMaster: '/masterAccount/getBalances',
    getOTCMasterAccountProfitsAndChargesBalance:
      '/masterAccountNew/getProfitsAndChargesBalance',
    editAutomaticRules: '/masterAccount/editAutomaticRules',
    getBalanceMovementsMaster: '/masterAccount/getBalanceMovements',
    getOTCMasterAccountBalances:
      '/masterAccountNew/getOTCMasterAccountBalances/',
    getOTCMasterAccountNames: '/masterAccountNew/getOTCMasterAccountNames/',
    getAutomaticRulesMaster: '/masterAccount/getAutomaticRules',
    getConfigMasterAccount: '/masterAccount/getConfig/', // Concatena nombre de OTC y /true
    addWalletToMasterAccount: '/masterAccount/addWallet',
    balanceOperationMasterAccountSend: '/masterAccount/balanceOperationSend',
    getMasterAccountsName: '/masterAccount/getNames',
    getMasterAccountDetails: '/masterAccount/getDetails',

    //OTC ADMIN

    getChangeFactors: '/otcAdmin/getChangeFactors', //Octine fatores de cambio ya configurados
    updateChangeFactors: '/otcAdmin/editChangeFactors',
    getBalanceOtcOperations: '/otcAdmin/getClientsBalance',
    getPaymentsAdmin: '/otcAdmin/getDollarBTCPayments/', //requiere user name concatenado al final , opcionalmente se añade currency
    getOffersAdmin: '/otcAdmin/getOffers/', //Se concatena username , opcionalmente se concate currency,para listar por oferta se concatena oferType (BID(ventas),ASK(compras))
    getOperationReset: '/otcAdmin/resetOperationBalance/', // se concatena la moneda a resetear
    addBalanceToDollarBTCPayment: '/otc/addBalanceToDollarBTCPayment',
    substractBalanceToDollarBTCPayment:
      '/otc/substractBalanceToDollarBTCPayment',
    sellBitcoinToOtcAccount: '/otcAdmin/sellFromDollarBTCPayment',
    transferBetweenDollarBTCPayments:
      '/otcAdmin/transferBetweenDollarBTCPayments',
    buyBitcoinToOtcAccount: '/otcAdmin/buyFromDollarBTCPayment',
    configVerification: '/otcAdmin/verification', //habilitar o inhabilitar verificaciones admin
    //Listar ofertas viejas
    getOldOffersAdmin: '/otcAdmin/getOldOffers/', // Se concatena userName
    getOperationsBalanceParams: '/otcAdmin/getOperationBalanceParams/', //Se concatena la moneda
    setOperationsBalanceParams: '/otcAdmin/editOperationBalanceParams', //Se concatena la moneda
    //listar operaciones con filtros
    getOperationsAdmin: '/otcAdmin/getOperations', // aqui se debe utilizar un objeto body completo
    //listar operaciones con filtros multiples
    getOperationsFilterAdmin: '/otcAdmin/getOperationsNew', // aqui se debe utilizar un objeto body completo
    //Contact Us
    sendContactUs: '/mail/sendContact',
    /////////////////////
    getBrokers: '/broker/getAll/',
    //USDA
    getParamsUSDA: '/usda/getParams',
    editParamsUSDA: '/usda/editParams',
    //Forum
    uploadFile: '/uploadFile',
    ////Forex
    getRate: '/forex/getRate/',
    getHistoricalRates: '/forex/getHistoricalRates/',

    //External payments
    createExternalPayment: '/payment/create',
    getExternalPaymentMethod: '/payment/getBalance/',

    //Address
    createAddress: '/address/create',
    getAddressByCurrency: '/address/list/',

    //Moneyclick
    sendQR: '/mcRetail/requestId',
    getRetails: '/mcRetailNew/getRetails',
    addRetail: '/mcRetailNew/create',
    getBalanceRetail: '/mcRetailNew/getBalance/',
    getBalanceMovementsRetail: '/mcRetailNew/getBalanceMovements/',
    getInfoRetail: '/mcRetailNew/getRetail/',
    getBalanceMoneyclick: '/mcUser/getNewBalance/',
    addCurrencyOperationType: '/mcRetailNew/addCurrencyOperationType',
    removeCurrencyOperationType: '/mcRetailNew/removeCurrencyOperationType',
    changeStatusCreationRetail: '/mcRetailNew/changeCreateStatus',
    addAttachmentRetail: '/mcRetailAddAttachment',

    //Broker
    addStaticOfferBroker: '/broker/addOffer',
    addDynamicOfferBroker: '/broker/addDynamicOffer',
    getOfferParams: '/broker/getOfferParams/',
    getOfferUrl: '/broker/getOffer/',
    getOfferBroker: '/broker/getOffers/',
    updateOfferStatic: '/broker/editOffer',
    updateOfferDynamic: '/broker/editDynamicOffer',
    removeOfferBroker: '/broker/removeOffer',
    getOldOffersBroker: '/broker/getOldOffers/',
    sendToPayment: '/broker/sendToPayment',
    getBalanceBroker: '/broker/getBalance/',
    //Security Questions
    getSecurityQuestionsByUser: '/user/getSegurityQuestions/', //Attach user and quantity
    validateSecurityAnswer: '/user/checkSecurityQuestions',
    getBalanceAdmin: '/admin/getBalance/',

    //Atachement Services
    getAttachmentRetail: '/attachment/getRetailFile/', // se concatena id del retail mas nombre del file
    getAttachmentsUser: '/attachment/getUserFile/',
    getQrAttachmentGoogleAuth: '/attachment/getUserGAQRCode/', // se concatena el username
    getOtcOperationFile: '/attachment/getOTCOperationFile/', // se concatena  Otc Operation Id y nombre de Archivo

    setSecretKey: '/hmac/setSecretKey',

    //Buy Balance URL
    changeOperationStatusBuyBalance: '/buyBalance/changeOperationStatus',

    getBatchProcesses: '/transferToBank/getLastProcesses/',
    getOperationsTranfer: '/transferToBank/getOperations',
    createProcessTranfer: '/transferToBank/createProcess',
    changeProcessStatus: '/transferToBank/changeProcessStatus',
    changeOperationsOfProcessStatus:
      '/transferToBank/changeOperationsOfProcessStatus',
    getBalanceMovementsMoneyClick: '/mcUser/getBalanceMovements',
    getProcessFile: '/transferToBank/getProcessFile/',
    applyProcess: '/transferToBank/applyProcess',
    getMoneyOrder: '/moneyOrder/list/',
    changeStatusMoneyOrder: '/moneyOrder/process/',
    getMoneyOrderImage: '/attachment/getMoneyOrderImage/',

    //Debit Card
    listDebitCard: '/debitCard/list',
    changeStatusCard: '/debitCard/changeStatus',
    getGiftCards: '/giftCard/listAll/',
    giftCardSubmit: '/giftCard/submit',
    giftCardDelete: '/giftCard/delete',
    giftCardResend: '/giftCard/resend',

    //CASH PLACE
    getBalanceCashPlace: '/cash/getPlaceBalance/',
    getMovementsCashPlace: ' /cash/getPlaceBalanceMovements/',
    getInfoCashPlace: '/cash/getPlace/',
    getCashPlaces: '/cash/getPlaces',
    addCashPlace: '/cash/createPlace',
    addCurrencyOperationInCashPlace: '/cash/addPlaceCurrencyOperationType',
    removeCurrencyOperationInCashPlace:
      ' /cash/removePlaceCurrencyOperationType',
    changeStatusOperationCashLocation: '/cash/changeCreatePlaceStatus',
    addAttachmentCashLocation: '/cash/addPlaceAttachmentToCreate',
  },
  // Api BlockCypher
  apiBlockCypherUrl: 'https://api.blockcypher.com/v1',
  //API IpApi for geolocalization by IP
  apiIpApiUrl: 'https://ipapi.co/',
  webSocketsDBTC: urlWebSocket,
  // webSocketsMarketOperations: "wss://websocket.dollarbtc.com/marketOperation",
  //webSocketsBalanceTheOperations: "wss://websocket.dollarbtc.com/otcAdmin",
  webSocketsClients: urlWebSocket,
  addnewDat: '/FAF/',
};
