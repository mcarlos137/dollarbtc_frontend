//Resources
import React, { Component } from 'react';
import './App.css';
import { Container, Responsive } from 'semantic-ui-react';
import publicIP from 'react-native-public-ip';
import I18nProvider from '../i18n/I18nProvider';
import { Provider } from '../common/createConsumer';
import packageJson from '../../package.json';
import config from '../services/config';
// Components
import Nav from './Nav/Nav';
import NavAdmin from './NavAdmin/NavAdmin';
import NavPublic from './NavPublic/NavPublic';
import Home from './Home/Home';
import Registration from './Registration/Registration';
import Login from './Login/Login';
import BuyBitcoins from './BuyBitcoins/BuyBitcoins';
import SellBitcoins from './SellBitcoins/SellBitcoins';
import Verification from './Verification/Verification';
import Wallet from './Wallet/Wallet';
import Brokers from './Brokers/Brokers';
import user from '../services/user';
import Profile from './Profile/Profile';
//import SendingRemittances from "./SendingRemittances/SendingRemittances";
import Forum from './Forum/Forum';
import LoginTwoFactor from './LoginTwoFactor/LoginTwoFactor';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import { Route, Redirect } from 'react-router-dom';
import IdleTimer from 'react-idle-timer';
import HFTplans from './HFTplans/HFTplans';
import ContainerAdSettings from './Containers/ContainerAdSettings';
import OperationsControl from './OTC/OperationsControl/OperationsControl';
import ContainerBalancesAndOperations from './Containers/ContainerBalancesAndOperations';
import ContainerExternalSend from './Containers/ContainerExternalSend';
import ContainerUsers from './Containers/ContainerUsers';
import MarketModulator from './MarketModulator/MarketModulator';
import ContactUs from './ContactUs/ContactUs';
import WhoWeAre from './Help/WhoWeAre/WhoWeAre';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import MarketOperations from './Admin/MarketOperations/MarketOperations';
import BalanceOfOperations from './BalanceOfOperations/BalanceOfOperations';
import Faqs from './Faqs/Faqs';
//import CacheBuster from "./CacheBuster";
import CompleteAccountComponent from './Registration/CompleteAccount';
// Constants
//import franc from "franc";
import apiUtils from '../services/utils';
import { createStore } from '../common/createStore';
import uuid from 'uuid';
import Sockette from 'sockette';
import ContainerOperationControl from './Containers/ContainerOperationControl';
import RolAndFunctions from './RolAndFunctions/RolAndFunctions';
import ConfigRetailsAdmin from './Moneyclick/RetailsAdmin/ConfigRetails';
import ConfigCashLocations from './Moneyclick/CashPlaces/ConfigCashPlaces';
import Footer from './Footer/Footer';
import ModalSession from './ModalsApp/ModalSession';
import ModalSessionExpired from './ModalsApp/ModalSessionExpired';
import FastChange from './FastChange/FastChange';
import MoneyClick from './Moneyclick/Moneyclick';
import Legal from './Legal/Legal';
import ContainerLogin from './Containers/ContainerLogin';
import Notifications from './Admin/Notifications/Notifications';
//import ManageTelegram from "./ManageTelegram/ManageTelegram";
//import Suggestions from "./Suggestions/Suggestions";
import {
  browserVersion,
  isChrome,
  isEdge,
  isFirefox,
  isIE,
  isMobile,
  isMobileSafari,
  isOpera,
  isSafari,
} from 'react-device-detect';
import ChatClientForm from './ChatClient/ChatClientForm/ChatClientForm';
import ChatClient from './ChatClient/ChatClient';
import chatApi from '../services/chat';
import ContainerChatAgent from './Containers/ContainerChatAgent';
import PrivacyPolicyMC from './Moneyclick/PrivacyPolicy/PrivacyPolicyMC';
import PrivacyPolicyMCCashier from './Moneyclick/PrivacyPolicy/PrivacyPolicyMCCashier';
import UserBroker from './UserBroker/UserBroker';
//import PresentationBroker from "./PresentationBroker/PresentationBroker";
import TransferConfirm from './TransferConfirm/TransferConfirm';
import LimitsOfOperations from './LimitsOfOperations/LimitsOfOperations';
import RequestUsersView from './RequestUsers/RequestUsers';
import Charges from './Charges/Charges';
class App extends Component {
  constructor(props) {
    super(props);
    this.idleTimer = null;
    this.onIdle = this._onIdle.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onAction = this._onAction.bind(this);
    this.state = {
      socket: null,
      endIdle: false,
      viewModal: false,
      seconds: 60,
      conexion: '',
      viewModalEndSession: false,
      active: false,
      homeactive: false,
      language: window.sessionStorage.getItem('language') || 'es',
      notificationsAdmin: '',
      unreadAdmin: false,
      rolUserAdminFunctions: [],
      registeredInChat: window.sessionStorage.getItem('auth') === 'true',
      infoChat: {},
      socketChat: null,
      chatStack: '',
      newChatMessage: false,
      brokerPresentation: false,
      tokenSession: '',
      idOperation: '',
    };
    this.session = this.session.bind(this);
    this.handleLanguage = this.handleLanguage.bind(this);
    this.createSocketAdmin = this.createSocketAdmin.bind(this);
    this.closeSocket = this.closeSocket.bind(this);
    this.determinateBrowserVersion = this.determinateBrowserVersion.bind(this);
    this.handleRegisterInChat = this.handleRegisterInChat.bind(this);
    // this.initWebSocketChatAdmin = this.initWebSocketChatAdmin.bind(this);
    // this.onConnectedWsChat = this.onConnectedWsChat.bind(this);
    // this.onCloseWsChat = this.onCloseWsChat.bind(this);
    // this.onErrorWsChat = this.onErrorWsChat.bind(this);
    // this.pushNewChatNotification = this.pushNewChatNotification.bind(this);
    global.appVersion = packageJson.version;
  }
  _onAction(e) {
    if (
      sessionStorage.getItem('lastSession') !== null &&
      sessionStorage.getItem('lastSession') !== 'null'
    ) {
      let actualTime = new Date().getTime();
      let lastSession = Number(sessionStorage.getItem('lastSession'));
      if (actualTime - lastSession >= 240000) {
        sessionStorage.setItem('lastSession', actualTime);
        try {
          user.updateLastActivity();
        } catch (error) {}
      }
    }
  }
  componentDidMount() {
    // let domain = window.location.href.split("/")[3];
    // if (domain === "presentationBroker") {
    //   this.setState({ brokerPresentation: true });
    // }

    this.getIp();
    if (window.sessionStorage.getItem('userType') === 'ADMIN') {
      let availableFunctionsUser = user.getUserRol();
      if (availableFunctionsUser !== null) {
        this.setState({
          rolUserAdminFunctions: availableFunctionsUser.functionsAvailables,
        });
      }
      this.createSocketAdmin();
      //this.initWebSocketChatAdmin();
    }
  }
  componentWillUnmount() {
    if (window.sessionStorage.getItem('userType') === 'ADMIN') {
      this.closeSocket();
      //this.onCloseWsChat();
    }

    user.logout();
  }
  componentWillMount() {
    this.determinateBrowserVersion();
  }
  determinateBrowserVersion() {
    let version = parseInt(browserVersion.split('.')[0]);
    let message =
      this.state.language === 'es'
        ? 'Esta versión de su navegador no es compatible con dollarBTC.com, le invitamos a actualizar para tener una mejor experiencia'
        : 'This version of your browser is not compatible with dollarBTC.com, we invite you to update to have a better experience';
    let messageIncompatible =
      this.state.language === 'es'
        ? 'Su navegador no es compatible con nuestra aplicación. Le recomendamos descargar Google Chrome o Firefox'
        : 'Your browser is not compatible with our application, we recommend downloading Google Chrome or Firefox';
    if (isMobile) {
      if (isMobileSafari) {
        if (version < 10.1) alert(message);
      } else if (isChrome) {
        if (version <= 54) alert(message);
      } else if (isFirefox) {
        if (version < 47) alert(message);
      }
    } else {
      if (isFirefox) {
        if (version < 47) alert(message);
      } else if (isChrome) {
        if (version < 54) alert(message);
      } else if (isSafari) {
        if (version < 10.1) alert(message);
      } else if (isEdge) {
        alert(messageIncompatible);
      } else if (isIE) {
        alert(messageIncompatible);
      } else if (isOpera) {
        alert(messageIncompatible);
      }
    }
  }
  closeSocket() {
    let auxSocket = this.state.socket;
    if (auxSocket !== undefined && auxSocket !== null) {
      if (!this.state.socket.open) this.state.socket.close();
      ////console.log("cerrando");
    }
  }
  createSocketAdmin() {
    window.sessionStorage.setItem('websocketKey', uuid.v4());
    this.setState({
      socket: new Sockette(config.webSocketsClients + '/otc', {
        timeout: 60000,
        onopen: (e) => {
          this.socketReady();
        },
        onmessage: (e) => {
          this.handleResponseSocket(e.data);
        },
      }),
    });
  }
  setUserData(token) {
    this.setState({ tokenSession: token });
  }
  socketReady() {
    let men = {
      method: 'getAdminOperationMessages',
      params: {
        maxQuantity: 10,
        websocketKey: window.sessionStorage.getItem('websocketKey'),
      },
    };
    if (this.state.socket !== null) {
      try {
        this.state.socket.json(men);
      } catch (e) {}
    }
  }
  handleResponseSocket(data) {
    ////console.log(data);
    let data2 = JSON.parse(data),
      notAdm;
    ////console.log(this.state.notificationsAdmin);
    if (this.state.notificationsAdmin !== '') {
      notAdm = JSON.parse(this.state.notificationsAdmin);
    }
    let notifs = this.state.notificationsAdmin === '' ? [] : notAdm.params.data;
    let unread = 0;
    if (notifs.length > 0) {
      data2.params.data.map((n) => {
        if (n !== null && n.readed === undefined) {
          n.readed = false;
          unread++;
        }
        notifs.push(n);
      });
      data2.params.data = notifs;
    }
    this.setState({
      notificationsAdmin: JSON.stringify(data2),
      unreadAdmin: !this.state.unreadAdmin,
      unreadMessages: unread,
    });
  }
  calculeConexionSpired() {
    if (this.idleTimer !== null) {
      this.setState({ endIdle: false, viewModal: false });
      let actualTime = new Date().getTime();
      sessionStorage.setItem('lastSession', actualTime);
      try {
        user.updateLastActivity();
      } catch (error) {}

      this.idleTimer.reset();
    }
  }
  session() {
    // console.log("session")
    // let time;
    // if(window.sessionStorage.getItem("userType") === "ADMIN" && window.sessionStorage.getItem("modeAdmin") === true)
    // {
    //   time = 240000;
    // }else{
    //   time = 60000;
    // }
    // console.log("tiempo",time)
    setTimeout(() => {
      if (this.state.endIdle) {
        this.setState({ viewModalEndSession: true, viewModal: false });
        user.logout();
      }
    }, 60000);
  }
  handleCloseModal() {
    window.location.href = '/';
  }
  _onIdle(e) {
    console.log('entrando en onidle');
    this.setState({ viewModal: true, endIdle: true });
    this.session();
  }
  getBalanceUserUpdate() {
    this.setState({ active: !this.state.active });
  }
  getIp() {
    publicIP()
      .then((ip) => {
        ////console.log(ip);
        let previosIp = window.sessionStorage.getItem('ipAddress');
        if (previosIp !== ip) {
          window.sessionStorage.setItem('ipAddress', ip);
          apiUtils
            .getAllInfo(ip)
            .then((res) => {
              let languages = res.data.languages.split(',');
              let isSpanish = false;
              if (languages.length > 0) {
                for (let i = 0; i < languages.length; i++) {
                  let value = languages[i].split('-');

                  if (value.length > 1) {
                    if (value[0] === 'es' && value[1] !== 'US') {
                      isSpanish = true;
                      window.sessionStorage.setItem('language', 'es');
                      this.setState({
                        language: 'es',
                      });
                    }
                  } else {
                    if (value[0] === 'es') {
                      isSpanish = true;
                      window.sessionStorage.setItem('language', 'es');
                      this.setState({
                        language: 'es',
                      });
                    } else if (value[0] === 'en') {
                      window.sessionStorage.setItem('language', 'en');
                      this.setState({
                        language: 'en',
                      });
                    }
                  }
                }
              }
              if (!isSpanish) {
                window.sessionStorage.setItem('language', 'en');
                this.setState({
                  language: 'en',
                });
              }
            })
            .catch((error) => {
              //console.log(error);
            });
        }
        // '47.122.71.234'
      })
      .catch((error) => {
        //console.log(error);
        // 'Unable to get IP address.'
      });
  }
  setItem(data) {
    this.setState({ item: data });
  }
  setView(data) {
    this.setState({ homeactive: data });
  }
  handleLanguage = (e, data) => {
    window.sessionStorage.setItem('language', data.value);
    this.setState({
      language: data.value,
    });
  };
  validateRouterNormal(Component, validate) {
    let auth = window.sessionStorage.getItem('auth');
    if (validate) {
      return auth === 'true' ? (
        <Component token={this.state.tokenSession} />
      ) : (
        <Redirect to='/' />
      );
    } else {
      return auth !== 'true' ? <Component /> : <Redirect to='/' />;
    }
  }
  validateRouterAdmin(Component, value) {
    let auth = window.sessionStorage.getItem('auth');
    let type = window.sessionStorage.getItem('userType');
    let availableFunctionsUser = user.getUserRol();
    let functions = [];
    if (availableFunctionsUser !== null) {
      functions = availableFunctionsUser.functionsAvailables;
    }
    let index = functions.indexOf(value);
    if (type === 'ADMIN') {
      let valid = auth === 'true' && index !== -1;
      return valid ? <Component /> : <Redirect to='/dashboard' />;
    } else {
      return auth === 'true' ? <Component /> : <Redirect to='/' />;
    }
  }
  handleRegisterInChat(values) {
    let body = {
      name: values.name,
      email: values.email,
      messages: values.messages,
    };
    this.setState({
      registeredInChat: values.registered,
      infoChat: body,
    });
  }
  createConsumerComponent(Component) {}
  initWebSocketChatAdmin() {
    const socket = new Sockette(
      'ws://192.168.0.105:8080/bushido-wallet-service/chat/admin/ws',
      {
        onopen: (e) => this.onConnectedWsChat(e),
        onmessage: (e) => this.onMessageReceivedWsChat(e),
        onerror: (e) => this.onErrorWsChat(e),
        onclose: (e) => this.onCloseWsChat(e),
        onreconnect: (e) => {
          console.log('Trying to reconnect', e);
        },
      }
    );
    this.setState(
      {
        socketChat: socket,
      },
      () => {
        this.retryChatAdminMessages(0, 100);
      }
    );
  }
  onConnectedWsChat(e) {
    //console.log("Connected to WebSocket, ", e);
  }
  onErrorWsChat(error) {
    console.log(`WebSocket error: ${error}`);
  }
  onCloseWsChat(e) {
    let chatBody = {
      msg: '[logout]',
      receiver: 'admin',
      type: 'CHAT',
      sender: 'admin',
      isPrivate: true,
      time: new Date().getTime(),
      user: {
        username: 'admin',
        name: window.sessionStorage.getItem('username'),
        loginDate: new Date().getTime(),
        type: 'REGISTER',
      },
      language: 'NA',
    };
    // this.state.socketChat.json(chatBody);
  }
  onMessageReceivedWsChat(e) {
    //console.log(e.data);
    if (e.data.startsWith('{')) {
      this.pushNewChatNotification('NEW_CHAT_MESSAGE');
    }
    this.setState({
      newChatMessage: !this.state.newChatMessage,
      chatStack: e.data,
    });
  }
  retryChatAdminMessages(begin, end) {
    chatApi
      .getAdminMessages(begin, end)
      .then((resp) => {
        if (resp.data.payload !== null) {
          let unread = this.state.unreadMessages;
          let ctPendingMessages = resp.data.payload.length;
          if (ctPendingMessages > 0) {
            this.pushNewChatNotification('PENDING_CHAT_MESSAGE');
          }
        }
      })
      .catch((error) => {
        console.log('Error retrying admin messages, ', error);
      });
  }
  pushNewChatNotification(message) {
    let oldNotifications = {},
      oldMessages = [];
    let unread = this.state.unreadMessages;
    let currentURL = window.location.href;

    if (!currentURL.includes('communications')) {
      if (this.state.notificationsAdmin !== '') {
        oldNotifications = JSON.parse(this.state.notificationsAdmin);
        oldMessages = oldNotifications.params.data;

        if (oldMessages !== undefined && oldMessages !== null) {
          oldMessages.push({
            id: uuid.v4(),
            timestamp: new Date().getTime(),
            message: message,
            readed: false,
            redirectionPath: 'communications',
          });
        } else {
          oldMessages = [];
          oldMessages.push({
            id: uuid.v4(),
            timestamp: new Date().getTime(),
            message: message,
            readed: false,
            redirectionPath: 'communications',
          });
        }
        unread++;
        oldNotifications.params.data = oldMessages;
      } else {
        oldNotifications = {
          jsonrpc: '2.0',
          method: 'getAdminOperationMessages',
          params: {
            data: [],
          },
        };
        oldMessages.push({
          id: uuid.v4(),
          timestamp: new Date().getTime(),
          message: message,
          readed: false,
          redirectionPath: 'communications',
        });
        oldNotifications.params.data = oldMessages;
      }
    }

    //console.log(oldNotifications);
    this.setState({
      notificationsAdmin: JSON.stringify(oldNotifications),
      unreadMessages: unread,
      unreadAdmin: !this.state.unreadAdmin,
    });
  }
  _onActive(e) {}

  render() {
    let idOperation = this.state.idOperation;
    let navView;
    let auth = window.sessionStorage.getItem('auth');
    let modeAdmin = window.sessionStorage.getItem('modeAdmin');
    let userType = window.sessionStorage.getItem('userType');

    if (
      window.sessionStorage.getItem('userType') === 'ADMIN' &&
      window.sessionStorage.getItem('auth') === 'true'
    ) {
      navView = <NavAdmin />;
      //navView = <ContainerNavAdmin/>
    } else if (window.sessionStorage.getItem('auth') === 'true') {
      navView = (
        <div>
          <Nav
            active={this.state.active}
            handleClick={this.handleLanguage}
            token={this.state.tokenSession}
          />
          <br />
        </div>
      );
    } else {
      navView = <NavPublic handleClick={this.handleLanguage} />;
    }
    return (
      // <CacheBuster>
      // {
      //   ({ loading, isLatestVersion, refreshCacheAndReload }) =>
      // {
      //   if (loading) return null;
      //   if (!loading && !isLatestVersion) {
      //     refreshCacheAndReload();
      //   }
      // return (
      <Provider value={createStore(this)}>
        <I18nProvider language={this.state.language}>
          <div className='App'>
            {auth === 'true' && userType !== 'ADMIN' && (
              <IdleTimer
                ref={(ref) => {
                  this.idleTimer = ref;
                }}
                element={document}
                onActive={this.onActive}
                onIdle={this.onIdle}
                onAction={this.onAction}
                timeout={1000 * 60 * 29}
              />
            )}
            {auth === 'true' && userType === 'ADMIN' && modeAdmin === 'true' ? (
              <IdleTimer
                ref={(ref) => {
                  this.idleTimer = ref;
                }}
                element={document}
                onActive={this.onActive.bind(this)}
                onIdle={this.onIdle}
                onAction={this.onAction}
                timeout={1000 * 3600 * 4}
              />
            ) : (
              <IdleTimer
                ref={(ref) => {
                  this.idleTimer = ref;
                }}
                element={document}
                onActive={this.onActive.bind(this)}
                onIdle={this.onIdle}
                onAction={this.onAction}
                timeout={1000 * 60 * 29}
              />
            )}
            <header id='nav-container-dollar'>{navView}</header>
            <main className='App-content'>
              <Responsive minWidth={992}>
                <Container
                  style={{
                    marginTop:
                      user.getUserAuth() &&
                      window.sessionStorage.getItem('userType') === 'ADMIN'
                        ? '65px'
                        : '5px',
                    paddingTop:
                      window.sessionStorage.getItem('userType') === 'ADMIN'
                        ? '10px'
                        : '0px',
                  }}
                >
                  {' '}
                  <Route
                    exact
                    path='/'
                    render={(props) => (
                      <Home
                        {...props}
                        setItem={this.setItem.bind(this)}
                        setView={this.setView.bind(this)}
                        token={this.state.tokenSession}
                      />
                    )}
                  />
                  <Route
                    exact
                    path='/transferConfirm'
                    render={(props) => (
                      <TransferConfirm
                        {...props}
                        setItem={this.setItem.bind(this)}
                        setView={this.setView.bind(this)}
                        idOperation={idOperation}
                      />
                    )}
                  />
                  <Route
                    path='/login'
                    render={(props) => (
                      <Login
                        {...props}
                        session={this.session}
                        setToken={this.setUserData.bind(this)}
                      />
                    )}
                  />
                  <Route
                    path='/loginTwoFactor'
                    render={(props) => (
                      <LoginTwoFactor
                        {...props}
                        session={this.session}
                        token={this.state.tokenSession}
                      />
                    )}
                  />
                  <Route path='/registration' component={Registration} />
                  <Route
                    path='/completeAccount'
                    component={CompleteAccountComponent}
                  />
                  <Route
                    path='/wallet'
                    render={() => this.validateRouterNormal(Wallet, true)}
                  />
                  <Route path='/forum' component={Forum} />
                  {/* <Route
                    path="/presentationBroker"
                    component={PresentationBroker}
                  /> */}
                  <Route path='/buy' component={BuyBitcoins} />
                  <Route path='/brokers' component={Brokers} />
                  <Route path='/sell' component={SellBitcoins} />
                  <Route
                    path='/profile'
                    render={() => this.validateRouterNormal(Profile, true)}
                  />
                  <Route
                    path='/verify'
                    render={() => this.validateRouterNormal(Verification, true)}
                  />
                  <Route
                    path='/HFTplans'
                    render={(props) => (
                      <HFTplans
                        {...props}
                        setItem={this.setItem.bind(this)}
                        token={this.state.tokenSession}
                      />
                    )}
                  />
                  <Route
                    path='/forgotPassword'
                    render={() =>
                      this.validateRouterNormal(ForgotPassword, false)
                    }
                  />
                  <Route
                    path='/otcOferts'
                    render={() =>
                      this.validateRouterAdmin(
                        ContainerAdSettings,
                        'otc_offers'
                      )
                    }
                  />
                  <Route
                    path='/otcOperations'
                    render={() =>
                      this.validateRouterAdmin(
                        ContainerOperationControl,
                        'otc_operations'
                      )
                    }
                  />
                  <Route
                    path='/verifyUsersAccounts'
                    render={() =>
                      this.validateRouterAdmin(ContainerUsers, 'users')
                    }
                  />
                  <Route path='/dashboard' component={AdminDashboard} />
                  <Route
                    path='/balancesAndOperations'
                    render={() =>
                      this.validateRouterAdmin(
                        ContainerBalancesAndOperations,
                        'balance'
                      )
                    }
                  />
                  <Route
                    path='/externalSend'
                    render={() =>
                      this.validateRouterAdmin(
                        ContainerExternalSend,
                        'external_send'
                      )
                    }
                  />
                  <Route
                    path='/marketModulator'
                    render={() =>
                      this.validateRouterAdmin(
                        MarketModulator,
                        'market_modulator'
                      )
                    }
                  />
                  <Route
                    path='/marketOperations'
                    component={MarketOperations}
                    render={() =>
                      this.validateRouterAdmin(
                        MarketOperations,
                        'market_operations'
                      )
                    }
                  />
                  {/* <Route
                    path="/SendingRemittances"
                    component={SendingRemittances}
                    render={() =>
                      this.validateRouterAdmin(
                        SendingRemittances,
                        "SendingRemittances"
                      )
                    }
                  /> */}
                  <Route
                    path='/fastExchange'
                    render={() => this.validateRouterNormal(FastChange, true)}
                    /*render={() =>
                this.validateRouterAdmin(
                  MarketOperations,
                  "market_operations"
                )
              }*/
                  />
                  <Route path='/moneyclick' component={MoneyClick} />
                  <Route
                    path='/broker'
                    render={() => this.validateRouterNormal(UserBroker, true)}
                  />
                  <Route
                    path='/balanceOfOperations'
                    component={BalanceOfOperations}
                    render={() =>
                      this.validateRouterAdmin(
                        BalanceOfOperations,
                        'balance_of_operations'
                      )
                    }
                  />
                  {/* <Route
                          path="/manageTelegram"
                          component={ManageTelegram}
                        /> */}
                  {/* <Route path="/suggestions" component={Suggestions} /> */}
                  <Route path='/contact' component={ContactUs} />
                  <Route path='/whoweare' component={WhoWeAre} />
                  <Route path='/faqs' component={Faqs} />
                  <Route path='/legal' component={Legal} />
                  <Route path='/limits' component={LimitsOfOperations} />
                  <Route path='/charges' component={Charges} />
                  <Route
                    path='/rolAndOperators'
                    render={() =>
                      this.validateRouterAdmin(
                        RolAndFunctions,
                        'rols_and_operators'
                      )
                    }
                  />
                  {/*<Route path="/configRetails" component={ConfigRetailsAdmin} />*/}
                  <Route
                    path='/configRetails'
                    render={() =>
                      this.validateRouterAdmin(
                        ConfigRetailsAdmin,
                        'config_retails'
                      )
                    }
                  />
                  <Route
                    path='/configCashPlaces'
                    render={() =>
                      this.validateRouterAdmin(
                        ConfigCashLocations,
                        'config_cash_locations'
                      )
                    }
                  />
                  <Route
                    path='/communications'
                    render={() =>
                      this.validateRouterAdmin(
                        ContainerChatAgent,
                        'communications_chat'
                      )
                    }
                  />
                  <Route
                    path='/notifications'
                    render={() =>
                      this.validateRouterAdmin(Notifications, 'notifications')
                    }
                  />
                  <Route
                    path='/requestUsers'
                    render={() =>
                      this.validateRouterAdmin(
                        RequestUsersView,
                        'manage_request'
                      )
                    }
                  />
                  <Route path='/mc/privacyPolicy' component={PrivacyPolicyMC} />
                  <Route
                    path='/mcCashier/privacyPolicy'
                    component={PrivacyPolicyMCCashier}
                  />
                  {/* <Route path="/communications" component={ChatAgent} /> */}
                  <ModalSession
                    viewModal={this.state.viewModal}
                    loadForm={this.state.loadForm}
                    seconds={this.state.seconds}
                    calculateConnectionExpired={this.calculeConexionSpired.bind(
                      this
                    )}
                  />
                  <ModalSessionExpired
                    viewModalEndSession={this.state.viewModalEndSession}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                  />
                </Container>
              </Responsive>
              {this.state.registeredInChat &&
                !this.state.brokerPresentation &&
                window.sessionStorage.getItem('userType') !== 'ADMIN' && (
                  <ChatClient infoChat={this.state.infoChat} />
                )}
              {!this.state.registeredInChat &&
                !this.state.brokerPresentation &&
                window.sessionStorage.getItem('userType') !== 'ADMIN' && (
                  <ChatClientForm handleRegister={this.handleRegisterInChat} />
                )}
            </main>
            {!this.state.brokerPresentation && (
              <footer id='footer-app'>
                <Footer />
              </footer>
            )}
          </div>
        </I18nProvider>
      </Provider>
      // );
      //}
      // }
      // </CacheBuster>
    );
  }
}

export default App;
