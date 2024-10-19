import React, { Component } from "react";
import FormVerificationIdentity from "../FormVerificationIdentity/FormVerificationIdentity";
import FormChatVerification from "../FormChatVerification/FormChatVerification";
import FormVerificationEmail from "../FormVerificationEmail/FormVerificationEmail";
import FormVerificationPhone from "../FormVerificationPhone/FormVerificationPhone";
import FormBuyBitcoin from "../FormBuyBitcoin/FormBuyBitcoin";
import userAPI from "../../../services/user";
import translate from "../../../i18n/translate";
import { Responsive } from "semantic-ui-react";
class FormProcessBuyBitCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      C: "C",
      D: "D",
      toUpdate: 1,
      configUser: this.props.configUser,
      translator: props.translate
    };
    this._isMounted = false;
  }
  handleToUpdate(value) {
    //console.log("value actualizado ", value);
    this.setState({
      toUpdate: value
    });
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentDidUpdate(prevProps, prevState, snapshop) {
    if (this._isMounted === true) {
      //console.log("se ejecuto el componentDidUpdate");
      if (prevState.toUpdate !== this.state.toUpdate) {
        let username = userAPI.getUserName();
        //console.log("obtener la data del usuario actualizada");
        userAPI.getConfigUserGeneral(username).then(resp => {
          this.setState({
            configUser: resp.data.result
          });
        });
      }
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let t = this.state.translator;
    return (
      <div>
        <Responsive minWidth={992}>
          {typeof this.state.configUser.verification === "undefined" && (
            <FormVerificationEmail
              handleToUpdate={this.handleToUpdate.bind(this)}
            />
          )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B === "undefined" && (
              <FormVerificationPhone
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C === "undefined" && (
              <FormVerificationIdentity
                configUser={this.state.configUser}
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C !== "undefined" &&
            (this.state.configUser.verification.C.userVerificationStatus ===
              "PROCESSING" ||
              this.state.configUser.verification.C.userVerificationStatus ===
                "FAIL") && (
              <FormChatVerification
                configUser={this.state.configUser}
                whatVerify={this.state.C}
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C !== "undefined" &&
            this.state.configUser.verification.C.userVerificationStatus ===
              "OK" &&
            (typeof this.state.configUser.verification.D === "undefined" ||
              this.state.configUser.verification.D.userVerificationStatus ===
                "OK") && (
              <FormBuyBitcoin
                handleToUpdate={this.handleToUpdate.bind(this)}
                handleItemClick={this.props.handleItemClick}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C !== "undefined" &&
            this.state.configUser.verification.C.userVerificationStatus ===
              "OK" &&
            typeof this.state.configUser.verification.D !== "undefined" &&
            (this.state.configUser.verification.D.userVerificationStatus ===
              "PROCESSING" ||
              this.state.configUser.verification.D.userVerificationStatus ===
                "FAIL") && (
              <FormChatVerification
                configUser={this.state.configUser}
                whatVerify={this.state.D}
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
        </Responsive>
        <Responsive minWidth={0} maxWidth={991}>
          {typeof this.state.configUser.verification === "undefined" && (
            <FormVerificationEmail
            // handleToUpdate={this.handleToUpdate.bind(this)}
            />
          )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B === "undefined" && (
              <FormVerificationPhone
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C === "undefined" && (
              <FormVerificationIdentity
                configUser={this.state.configUser}
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C !== "undefined" &&
            (this.state.configUser.verification.C.userVerificationStatus ===
              "PROCESSING" ||
              this.state.configUser.verification.C.userVerificationStatus ===
                "FAIL") && (
              <FormChatVerification
                configUser={this.state.configUser}
                whatVerify={this.state.C}
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C !== "undefined" &&
            this.state.configUser.verification.C.userVerificationStatus ===
              "OK" &&
            (typeof this.state.configUser.verification.D === "undefined" ||
              this.state.configUser.verification.D.userVerificationStatus ===
                "OK") && (
              <FormBuyBitcoin
                handleToUpdate={this.handleToUpdate.bind(this)}
                handleItemClick={this.props.handleItemClick}
              />
            )}
          {typeof this.state.configUser.verification !== "undefined" &&
            typeof this.state.configUser.verification.A !== "undefined" &&
            typeof this.state.configUser.verification.B !== "undefined" &&
            typeof this.state.configUser.verification.C !== "undefined" &&
            this.state.configUser.verification.C.userVerificationStatus ===
              "OK" &&
            typeof this.state.configUser.verification.D !== "undefined" &&
            (this.state.configUser.verification.D.userVerificationStatus ===
              "PROCESSING" ||
              this.state.configUser.verification.D.userVerificationStatus ===
                "FAIL") && (
              <FormChatVerification
                configUser={this.state.configUser}
                whatVerify={this.state.D}
                handleToUpdate={this.handleToUpdate.bind(this)}
              />
            )}
        </Responsive>
      </div>
    );
  }
}
export default translate(FormProcessBuyBitCoin);
