import React, { Component } from "react";
import otc from "../../../services/otc";
import userService from "../../../services/user";
import {
  Segment,
  Header,
  Flag,
  Button,
  Modal,
  Divider,
  Message,
  Image
} from "semantic-ui-react";
import ReactTable from "react-table";
import "./ListAccount.css";
import Eth from "../../../img/eth.svg";
import WaitingVerificationAccount from "../WaitingVerificationAccount/WaitingVerificationAccount";
import translate from "../../../i18n/translate";
import isoCurrencies from "../../../common/ISO4217";
import { isMobile } from "react-device-detect";
import theter from '../../../img/tether-seeklogo.svg'
class ListAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPayments: [],
      listPaymentsClient: [],
      segmentLoad: false,
      responseError: false,
      activeIndex: "",
      currencyRemove: "",
      idRemove: "",
      paymentRemoved: {},
      viewModal: false,
      loadSegment: false,
      viewMessage: false,
      fail: false,
      statusD: "OK",
      errorInRed: false,
      translator: props.translate
    };
    this.constantPaymentsTypes = new Map();
    this.constantPaymentsTypes.set(
      "TRANSFER_WITH_SPECIFIC_BANK",
      props.translate("profile.addAccount.specificBank")
    );
    this.constantPaymentsTypes.set(
      "TRANSFER_NATIONAL_BANK",
      props.translate("profile.addAccount.thirdBank")
    );
    this.constantPaymentsTypes.set(
      "CHECK_DEPOSIT",
      props.translate("profile.addAccount.checkDeposit")
    );
    this.constantPaymentsTypes.set(
      "CASH_DEPOSIT",
      props.translate("profile.addAccount.cashDeposit")
    );
    this.constantPaymentsTypes.set(
      "WIRE_TRANSFER",
      props.translate("profile.addAccount.wire")
    );
    this.constantPaymentsTypes.set(
      "TRANSFER_INTERNATIONAL_BANK",
      props.translate("profile.addAccount.international")
    );
    this.constantPaymentsTypes.set(
      "TRANSFER_TO_CRYPTO_WALLET",
      props.translate("profile.addAccount.cryptoWallet")
    );
    this.constantPaymentsTypes.set(
      "CREDIT_CARD",
      props.translate("profile.addAccount.creditCard")
    );
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentDidMount() {
    this.getDataUser();
  }
  getDataUser() {
    this.setState({ segmentLoad: true, listPayments: [] });
    let username = userService.getUserName();
    let config = userService.getConfigUserGeneral(username);
    let datauser;
    config
      .then(resp => {
        // //console.log(resp.data.result);
        if (resp.data.result.verification !== undefined) {
          if (resp.data.result.verification.D !== undefined) {
            this.setState({
              statusD: resp.data.result.verification.D.userVerificationStatus
            });
          }
        }
        datauser = userService.getActualUserInfo(resp.data.result);
        // //console.log(datauser);
        let name = datauser.firstName;
        let lastname = datauser.lastName;
        let companyName =
          datauser.companyName !== undefined && datauser.companyName !== ""
            ? datauser.companyName
            : "";
        let list = otc.getUserTypePayments();
        list
          .then(res => {
            //console.log(res);
            Object.entries(res.data).forEach(([key, value]) => {
              let currency = key;
              let currencyISO = isoCurrencies.ISOCURRENCIES.find(function(
                element
              ) {
                return element.key === key;
              });
              let file;
              if (currencyISO !== undefined && key !== "ETH" && key === "USDT") {
                 file = currencyISO.flag;
              } else if (key === "ETH") {
                file = Eth;
              } else if(key === "USDT"){
                 file = theter;
              }
              let array = value;
              for (let val of array) {
                // //console.log(val);
                let type, id, propertyUser;
                let dat = "";
                let keys = Object.keys(val);
                if (keys.indexOf("type") === -1) {
                  type = "Zelle";
                }
                if (val.verified !== undefined) {
                  if (companyName === "") {
                    let fullname = name + " " + lastname;
                    if (val.accountHolderName !== undefined) {
                      let accountName = String(val.accountHolderName);
                      if (accountName.includes(fullname)) {
                        propertyUser = true;
                      } else if (accountName.includes(name)) {
                        propertyUser = true;
                      } else if (accountName.includes(lastname)) {
                        propertyUser = true;
                      } else {
                        propertyUser = false;
                      }
                    } else {
                      propertyUser = true;
                    }
                  } else {
                    let accountName = String(val.accountHolderName);
                    if (accountName.includes(companyName)) {
                      propertyUser = true;
                    } else {
                      if (companyName.indexOf(" ") !== -1) {
                        let splitCompany = companyName.split(" ");
                        for (let partialCompanyName of splitCompany) {
                          if (
                            partialCompanyName !== "CA" &&
                            partialCompanyName !== "SA" &&
                            partialCompanyName !== "C.A" &&
                            partialCompanyName !== "C.A." &&
                            partialCompanyName !== "S.A" &&
                            partialCompanyName !== "S.A."
                          ) {
                            if (
                              accountName
                                .toUpperCase()
                                .includes(partialCompanyName.toUpperCase())
                            ) {
                              propertyUser = true;
                            } else {
                              propertyUser = true;
                            }
                          }
                        }
                      } else {
                        propertyUser = false;
                      }
                    }
                  }
                } else {
                  propertyUser = false;
                }
                Object.entries(val).forEach(([data, val]) => {
                  if (data === "type") {
                    if (this.constantPaymentsTypes.has(val)) {
                      type = this.constantPaymentsTypes.get(val);
                    } else {
                      type = val;
                    }
                  } else {
                    if (data !== "id") {
                      if (data !== "messages") {
                        if (data !== "automaticCharge") {
                          if (data !== "verified") {
                            if (data !== "apiKey") {
                              if (data !== "automatic") {
                                if (data !== "accountCurrency") {
                                  if (data !== "accountBalance") {
                                    if (data !== "accountStatus") {
                                      if (data !== "forceVerification") {
                                        if (dat === "") {
                                          dat = val;
                                        } else {
                                          dat = dat + " - " + val;
                                          if (data === "cardNumber") {
                                            let aux =
                                              "**** **** **** " + val.slice(-4);
                                            dat = dat.replace(val, aux);
                                          }
                                          if (data === "accountHolderName") {
                                            let accountHolderName = val;
                                            if (
                                              dat.includes(accountHolderName)
                                            ) {
                                              dat = dat.replace(
                                                accountHolderName + " -",
                                                ""
                                              );
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    } else {
                      id = val;
                    }
                  }
                });
                let obj = {
                  currency: currency,
                  file: file,
                  type: type,
                  data: dat,
                  id: id,
                  property: propertyUser
                };
                if (obj.property === true) {
                  // //console.log(obj);
                  this.setState({
                    listPayments: [...this.state.listPayments, obj]
                  });
                }
              }
            });
            this.setState({
              segmentLoad: false
            });
          })
          .catch(error => {
            this.setState({
              listPayments: [],
              segmentLoad: false,
              responseError: true,
              errorInRed: true
            });
          });
      })
      .catch(error => {
        this.setState({ segmentLoad: false, errorInRed: true });
      });
  }
  handleClickItem(e, data) {
    if (this.state.activeIndex !== data.index) {
      this.setState({ activeIndex: data.index });
    } else {
      this.setState({ activeIndex: "" });
    }
  }
  deleteAccount(e, data) {
    let value = this.state.listPayments.find(function(element) {
      return element.id === data.id;
    });

    this.setState({
      currencyRemove: value.currency,
      idRemove: data.id,
      paymentRemoved: value,
      viewModal: true
    });
  }
  deleteAccountConfirm() {
    let array = [];
    this.setState({ loadSegment: true });
    let response = otc.deletePaymentUser(
      this.state.currencyRemove,
      this.state.idRemove
    );
    response
      .then(res => {
        for (let data of this.state.listPayments) {
          if (data.id !== this.state.idRemove) {
            array.push(data);
          }
        }
        this.setState({ loadSegment: false, viewMessage: true, fail: false });
        this.setState({
          listPayments: array,
          currencyRemove: "",
          idRemove: "",
          paymentRemoved: {}
        });
      })
      .catch(error => {
        //console.log(error);
        this.setState({ loadSegment: false, viewMessage: true, fail: true });
        this.setState({
          listPayments: array,
          currencyRemove: "",
          idRemove: "",
          paymentRemoved: {}
        });
      });
  }
  cancelDelete() {
    this.setState({
      currencyRemove: "",
      idRemove: "",
      paymentRemoved: {},
      viewModal: false
    });
  }
  closeModal() {
    this.setState({ viewMessage: false, fail: false, viewModal: false });
  }
  changeAddAcount() {
    this.props.changeItemTwo("addOwnAccount");
  }
  handleCancel() {
    this.setState({ statusD: "OK" }, () => {
      this.getDataUser();
    });
  }
  render() {
    let t = this.state.translator;
    const currensTableHeaders = [
      {
        Header: t("profile.listAccountOther.currentTableHeaders.coin"),
        accessor: "currency",
        Cell: row => (
          <div>
            {row.value !== "ETH" && <Flag name={row.original.file} />}
            {(row.value === "ETH" || row.value === "USDT") && (
              <Image src={row.original.file} className={"iconEth"} />
            )}
            {row.value}
          </div>
        ),
        width: 90
      },
      // {
      //   Header: t("profile.listAccountOther.currentTableHeaders.type"),
      //   accessor: "type",
      //   width: 170
      // },
      {
        Header: t("profile.listAccountOther.currentTableHeaders.data"),
        accessor: "data",
        width: 550
      },
      {
        Header: t("profile.listAccountOther.currentTableHeaders.action"),
        width: 90,
        Cell: row => (
          <Button
            icon="cancel"
            circular
            compact
            size="mini"
            color="red"
            id={row.original.id}
            name={row.value}
            title={t("profile.listAccountOther.buttonDelete")}
            onClick={this.deleteAccount.bind(this)}
          />
        )
      }
    ];
    return (
      <div>
        {this.state.statusD !== "OK" && this.state.errorInRed === false && (
          <WaitingVerificationAccount
            status={this.state.statusD}
            cancel={this.handleCancel.bind(this)}
          />
        )}
        {this.state.errorInRed && (
          <Message info content={t("profile.listAccountOther.errorInRed")} />
        )}
        {this.state.statusD === "OK" && this.state.errorInRed === false && (
          <Segment
            basic
            padded
            loading={this.state.segmentLoad}
            textAlign={isMobile ? "center" : ""}
          >
            <ReactTable
              className="transactionTable"
              data={this.state.listPayments}
              columns={currensTableHeaders}
              defaultPageSize={5}
              previousText={t("profile.listAccountOther.currentTable.previous")}
              nextText={t("profile.listAccountOther.currentTable.next")}
              loadingText={t("profile.listAccountOther.currentTable.loading")}
              noDataText={t("profile.listAccountOther.currentTable.noData")}
              pageText={t("profile.listAccountOther.currentTable.page")}
              ofText={t("profile.listAccountOther.currentTable.of")}
              rowsText={t("profile.listAccountOther.currentTable.rows")}
              pageJumpText={t("profile.listAccountOther.currentTable.pageJump")}
              rowsSelectorText={t(
                "profile.listAccountOther.currentTable.rowsSelector"
              )}
              minRow={5}
              defaultFilterMethod={(filter, row, column) => {
                const id = filter.pivotId || filter.id;
                return row[id] !== undefined
                  ? String(row[id]).startsWith(filter.value.toUpperCase())
                  : true;
              }}
            />
            <Divider hidden />
            <Button
              floated={isMobile ? "" : "right"}
              size={isMobile ? "large" : ""}
              style={
                isMobile
                  ? {
                      borderRadius: "40px/40px",
                      height: "50px",
                      width: "200px"
                    }
                  : {}
              }
              color="blue"
              onClick={this.changeAddAcount.bind(this)}
            >
              {t("profile.listAccountOther.buttonAdd")}
            </Button>
          </Segment>
        )}
        <Modal open={this.state.viewModal} size="tiny">
          <Header
            icon="exclamation circle"
            content={t("profile.listAccountOther.modalVerification.header")}
          />
          {this.state.viewMessage === false && (
            <div>
              {" "}
              <Modal.Content>
                <Segment loading={this.state.loadSegment}>
                  <p>
                    {t("profile.listAccountOther.modalVerification.question")}
                  </p>
                  <p>
                    <b>{this.state.currencyRemove}</b>
                  </p>
                  <div>{this.state.paymentRemoved.data} </div>
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Segment basic>
                  <Button
                    floated="right"
                    color="blue"
                    onClick={this.deleteAccountConfirm.bind(this)}
                  >
                    {t(
                      "profile.listAccountOther.modalVerification.buttonDelete"
                    )}
                  </Button>
                  <Button
                    floated="right"
                    color="grey"
                    onClick={this.cancelDelete.bind(this)}
                  >
                    {t(
                      "profile.listAccountOther.modalVerification.buttonClose"
                    )}
                  </Button>
                </Segment>
                <Divider hidden />
              </Modal.Actions>
            </div>
          )}
          {this.state.viewMessage === true && this.state.fail === false && (
            <div>
              <Modal.Content>
                <Segment textAlign="center">
                  <Header>
                    {t("profile.listAccountOther.modalResponse.successMessage")}
                  </Header>
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Segment>
                  <Button
                    floated="right"
                    basic
                    onClick={this.closeModal.bind(this)}
                  >
                    {t("profile.listAccountOther.modalResponse.buttonClose")}
                  </Button>
                  <Divider hidden />
                </Segment>
              </Modal.Actions>
            </div>
          )}
          {this.state.viewMessage === true && this.state.fail === true && (
            <div>
              {" "}
              <Modal.Content>
                <Segment textAlign="center">
                  <Header>
                    {" "}
                    {t("profile.listAccountOther.modalResponse.failMessage")}
                  </Header>
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Segment>
                  <Button
                    floated="right"
                    basic
                    onClick={this.closeModal.bind(this)}
                  >
                    {t("profile.listAccountOther.modalResponse.buttonClose")}
                  </Button>
                </Segment>
                <Divider hidden />
              </Modal.Actions>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default translate(ListAccount);
