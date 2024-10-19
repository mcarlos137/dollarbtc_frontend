import React, { Component } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import
{
  Segment,
  Grid,
  Button,
  Divider,
  Icon,
  Message,
  Dimmer,
  Loader
} from "semantic-ui-react";
import userService from "../../../services/user";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";
class WalletAccount extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      userAddress: userService.getAddress(),
      copiedAddress: false,
      status: false,
      show: false,
      errorInRed: false,
      translator: props.translate
    };
  }
  componentWillReceiveProps(nextProps, nextContext)
  {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentDidMount()
  {
    let username = userService.getUserName();
    let config = userService.getConfigUserGeneral(username);
    config
      .then(resp =>
      {
        this.setState({ show: true });
        if (resp.data.result.verification === undefined) {
          this.setState({
            status: false
          });
        } else {
          if (resp.data.result.verification.A !== undefined) {
            this.setState({
              status: true
            });
          } else {
            this.setState({
              status: false
            });
          }
        }
      })
      .catch(error =>
      {
        //console.log(error);
        this.setState({ show: true, errorInRed: true });
      });
  }
  onClickCopyBtn = () =>
  {
    this.setState({
      copiedAddress: true
    });
    setTimeout(() =>
    {
      this.setState({
        copiedAddress: false
      });
    }, 7000);
  };
  render()
  {
    let t = this.state.translator;
    let messageCopied;
    if (this.state.copiedAddress) {
      messageCopied = (
        <Message info>
          <Message.Content>
            {t("profile.walletAccount.messages.copiedAddress")}
          </Message.Content>
        </Message>
      );
    }
    let qrView;
    qrView = (
      <div>
        <Segment.Group>
          <Segment id="qrSegmentTitle">
            <p>{t("profile.walletAccount.qrCode")}</p>
          </Segment>
          <Segment color="blue" textAlign="center">
            <QRCode value={this.state.userAddress} size={128} />
            <Divider hidden />
          </Segment>
        </Segment.Group>
      </div>
    );
    return (
      <div>
        <Dimmer.Dimmable dimmed={!this.state.show}>
          <Dimmer active={!this.state.show} inverted>
            <Loader>{t("profile.walletAccount.loading")}</Loader>
          </Dimmer>
          {this.state.status === false && this.state.errorInRed === false && (
            <Segment basic textAlign="center">
              <Message
                info
                content={
                  <div>
                    {t("profile.walletAccount.messages.verifyEmailLink.part1")}
                    <strong> {sessionStorage.getItem("email")}</strong>
                    {t("profile.walletAccount.messages.verifyEmailLink.part2")}
                  </div>
                }
              />
            </Segment>
          )}
          {this.state.errorInRed && (
            <Message
              info
              content={t("profile.walletAccount.messages.errorInRed")}
            />
          )}
          {this.state.status === true && (
            <Grid columns="equal">
              <Grid.Column largeScreen={5} mobile={0} tablet={5} computer={5} />
              <Grid.Column
                textAlign="center"
                largeScreen={5}
                mobile={16}
                tablet={5}
                computer={5}
              >
                {qrView}
              </Grid.Column>
              <Grid.Column largeScreen={5} mobile={0} tablet={5} computer={5} />

              <Grid.Column
                textAlign="center"
                largeScreen={16}
                mobile={16}
                tablet={16}
                computer={16}
              >
                <div style={isMobile ? { color: "#207ef2" } : {}}>
                  {t("profile.walletAccount.header")}
                </div>
                <b
                  id="addressText"
                  style={isMobile ? { color: "#207ef2" } : {}}
                >
                  {this.state.userAddress}
                </b>
                <CopyToClipboard text={this.state.userAddress}>
                  <Button
                    onClick={this.onClickCopyBtn}
                    data-tip={t("profile.walletAccount.buttonCopy")}
                    icon
                    id="orangeCopyBtn"
                  >
                    <Icon name="copy" />
                  </Button>
                </CopyToClipboard>
                {messageCopied}
              </Grid.Column>
            </Grid>
          )}
        </Dimmer.Dimmable>
      </div>
    );
  }
}
export default translate(WalletAccount);
