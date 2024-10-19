import React, { Component } from "react";
import userService from "../../../../services/user";
import {
  Button,
  Container,
  Dimmer,
  Divider,
  Icon,
  Loader,
  Message,
  Segment,
  Grid,
  Form,
  Accordion,
  List,
  Modal,
} from "semantic-ui-react";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";
import translate from "../../../../i18n/translate";
import ReactTable from "react-table";
import { isMobile } from "react-device-detect";
import masterAccount from "../../../../services/masterAccount";

class ReceiveBitCoinsTomasterAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      copiedAddress: false,
      activeIndexAccordion: 0,
      show: false,
      translator: props.translate,
      openNewAddressModal: false,
      loadNewAddress: false,
      errorNewAddress: false,
      successNewAddress: false,
    };
    this.closeNewAddressModal = this.closeNewAddressModal.bind(this);
    this.generateNewAddress = this.generateNewAddress.bind(this);
    this.openNewAddressModal = this.openNewAddressModal.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  onClickCopyBtn = () => {
    this.setState({
      copiedAddress: true,
    });
    setTimeout(() => {
      this.setState({
        copiedAddress: false,
      });
    }, 7000);
  };
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = this.state.activeIndexAccordion === index ? -1 : index;
    this.setState({ activeIndexAccordion: newIndex });
  };
  closeNewAddressModal = () => {
    this.setState({
      openNewAddressModal: false,
      loadNewAddress: false,
      errorNewAddress: false,
      successNewAddress: false,
    });
  };
  async generateNewAddress() {
    this.setState({ loadNewAddress: true });
    let body = {
      masterAccountName: this.props.otcName,
    };
    try {
      const response = await masterAccount.generateMasterAccount(body);
      if (response.data === "OK") {
        this.props.getConfigAccountOtc(this.props.otcName);
        this.setState({
          loadNewAddress: false,
          errorNewAddress: false,
          successNewAddress: true,
        });
      } else {
        this.setState({
          loadNewAddress: false,
          errorNewAddress: true,
          successNewAddress: false,
        });
      }
    } catch (error) {
      this.setState({
        loadNewAddress: false,
        errorNewAddress: true,
        successNewAddress: false,
      });
    }
  }
  openNewAddressModal() {
    this.setState({
      openNewAddressModal: true,
    });
  }

  render() {
    let t = this.state.translator;
    let messageCopied, messageResult;
    let data = this.props.oldAddress;
    if (this.state.copiedAddress) {
      messageCopied = (
        <Message info>
          <Message.Content>{t("wallet.receive.addressCopied")}</Message.Content>
        </Message>
      );
    }
    if (this.state.successNewAddress) {
      messageResult = (
        <Message success>
          <Message.Content>
            {t("wallet.receive.modalNewAddress.messageResult.success")}
          </Message.Content>
        </Message>
      );
    }
    if (this.state.errorNewAddress) {
      messageResult = (
        <Message error>
          <Message.Content>
            {t("wallet.receive.modalNewAddress.messageResult.error")}
          </Message.Content>
        </Message>
      );
    }
    const tableHeaders = [
      {
        Header: t("wallet.receive.tableOldAddresses.headers.created"),
        accessor: "created",
        width: 140,
      },
      {
        Header: t("wallet.receive.tableOldAddresses.headers.address"),
        accessor: "address",
      },
    ];
    return (
      <Container textAlign="center">
        <Grid columns="equal">
          <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
            <Grid columns="equal">
              <Grid.Column mobile={null} />
              <Grid.Column largeScreen={9} mobile={16} tablet={10}>
                <Segment.Group>
                  <Segment id="qrSegmentTitle">
                    <p>{t("wallet.receive.qrCode")}</p>
                  </Segment>
                  <Segment>
                    <QRCode
                      id="qrCode"
                      value={this.props.activeAddress}
                      size={window.innerWidth < 768 ? 80 : 200}
                    />
                  </Segment>
                </Segment.Group>
              </Grid.Column>
              <Grid.Column mobile={null} />
            </Grid>
            <Divider hidden />
            <Grid.Row>
              <Grid.Column largeScreen={3} mobile={null} />
              <Grid.Column
                largeScreen={12}
                mobile={16}
                tablet={11}
                textAlign="justified"
              >
                <Form>
                  <Form.Field>
                    <label style={{ fontSize: "medium", fontWeight: "normal" }}>
                      {t("wallet.receive.myAddress")}
                    </label>
                    <b id="addressText">{this.props.activeAddress}</b>
                    <CopyToClipboard text={this.props.activeAddress}>
                      <Button
                        onClick={this.onClickCopyBtn.bind(this)}
                        data-tip={t("wallet.receive.buttonCopy")}
                        icon
                        id="orangeCopyBtn"
                      >
                        <Icon name="copy" />
                      </Button>
                    </CopyToClipboard>
                    {messageCopied}
                  </Form.Field>
                </Form>
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
          </Grid.Column>

          <Grid.Column textAlign="justified">
            <Grid>
              <Grid.Column largeScreen={16} computer={16} mobile={16}>
                <Accordion styled>
                  <Accordion.Title
                    active={this.state.activeIndexAccordion === 0}
                    index={0}
                    onClick={this.handleClick}
                  >
                    <Icon name="dropdown" />
                    {t("wallet.receive.accordion.txTitle")}
                  </Accordion.Title>
                  <Accordion.Content
                    active={this.state.activeIndexAccordion === 0}
                  >
                    <p>{t("wallet.receive.accordion.txBody")}</p>
                  </Accordion.Content>
                  <Accordion.Title
                    active={this.state.activeIndexAccordion === 1}
                    index={1}
                    onClick={this.handleClick}
                  >
                    <Icon name="dropdown" />
                    {t("wallet.receive.accordion.commissionsHeader")}
                  </Accordion.Title>
                  <Accordion.Content
                    active={this.state.activeIndexAccordion === 1}
                  >
                    <List as="ol">
                      <List.Item as="li" value="-">
                        {t("wallet.receive.accordion.commissionsBody1")}
                      </List.Item>
                      <List.Item as="li" value="-">
                        {t("wallet.receive.accordion.commissionsBody2")}
                      </List.Item>
                    </List>
                  </Accordion.Content>
                  <div>
                    <Accordion.Title
                      active={this.state.activeIndexAccordion === 2}
                      index={2}
                      onClick={this.handleClick}
                    >
                      <Icon name="dropdown" />
                      {t("wallet.receive.accordion.oldAddresses")}
                    </Accordion.Title>
                    <Accordion.Content
                      active={this.state.activeIndexAccordion === 2}
                    >
                      <ReactTable
                        defaultSorted={[
                          {
                            id: "created",
                            desc: false,
                          },
                        ]}
                        className="transactionTable"
                        data={data}
                        columns={tableHeaders}
                        defaultPageSize={5}
                        previousText={t("wallet.tx.table.params.previousText")}
                        nextText={t("wallet.tx.table.params.nextText")}
                        loadingText={t("wallet.tx.table.params.loadingText")}
                        noDataText={"No hay Wallets"}
                        pageText={t("wallet.tx.table.params.pageText")}
                        ofText={t("wallet.tx.table.params.ofText")}
                        rowsText={t("wallet.tx.table.params.rowsText")}
                        pageJumpText={t("wallet.tx.table.params.pageJumpText")}
                        rowsSelectorText={t(
                          "wallet.tx.table.params.rowsSelectorText"
                        )}
                        minRow={3}
                      />
                    </Accordion.Content>
                  </div>
                </Accordion>
              </Grid.Column>
            </Grid>
          </Grid.Column>
          <Divider hidden />

          <Grid.Row>
            <Grid.Column
              largeScreen={12}
              mobile={16}
              tablet={12}
              computer={12}
              textAlign="justified"
            >
              <p>{t("wallet.receive.newAddressMessage")}</p>
            </Grid.Column>
            <Grid.Column largeScreen={4} mobile={16} tablet={4} computer={4}>
              <div align="right">
                <Button
                  color="blue"
                  onClick={this.openNewAddressModal}
                  style={{ marginTop: window.innerWidth <= 364 ? 8 : 0 }}
                >
                  {t("wallet.receive.buttonNewAddress")}
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider hidden />
        <ReactTooltip />
        <Modal
          open={this.state.openNewAddressModal}
          onClose={this.closeNewAddressModal}
          closeOnDimmerClick={false}
          closeOnDocumentClick={false}
        >
          <Modal.Header>
            {t("wallet.receive.modalNewAddress.header")}
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {!this.state.errorNewAddress && !this.state.successNewAddress && (
                <p>{t("wallet.send.confirMessage")} </p>
              )}
              {(this.state.errorNewAddress || this.state.successNewAddress) &&
                messageResult}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeNewAddressModal} color="grey">
              {t("wallet.receive.modalNewAddress.buttonClose")}
            </Button>
            <Button
              onClick={this.generateNewAddress}
              type="submit"
              color="blue"
              loading={this.state.loadNewAddress}
              disabled={
                this.state.errorNewAddress || this.state.successNewAddress
              }
            >
              {t("wallet.receive.modalNewAddress.buttonGenerate")}
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

export default translate(ReceiveBitCoinsTomasterAccount);
