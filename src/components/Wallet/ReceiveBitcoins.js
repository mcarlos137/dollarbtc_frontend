import React, { Component } from 'react';
import userService from '../../services/user';
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
} from 'semantic-ui-react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import translate from '../../i18n/translate';
import ReactTable from 'react-table';
import { isMobile } from 'react-device-detect';

class ReceiveBitcoins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      userAddress: userService.getAddress(),
      copiedAddress: false,
      activeIndexAccordion: 0,
      show: false,
      translator: props.translate,
      oldAddress: [],
      openNewAddressModal: false,
      loadNewAddress: false,
      errorNewAddress: false,
      successNewAddress: false,
    };
    this.closeNewAddressModal = this.closeNewAddressModal.bind(this);
    this.generateNewAddress = this.generateNewAddress.bind(this);
    this.openNewAddressModal = this.openNewAddressModal.bind(this);
    this.loadUserAddresses = this.loadUserAddresses.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }

  componentDidMount() {
    this.loadUserAddresses();
  }
  loadUserAddresses() {
    let username = userService.getUserName();
    let config = userService.getConfigUserGeneral(username);
    let oldAddress = [];
    let address = {};
    config.then((resp) => {
      if (resp.data.result.wallets !== undefined) {
        let old = resp.data.result.wallets.old;
        let current = {
          address: Object.values(resp.data.result.wallets.current).map((w) => {
            return w.address;
          })[0],
          created: this.formatDate(
            new Date(
              Object.keys(resp.data.result.wallets.current).map((key) => {
                return key;
              })[0]
            )
          ),
        };
        window.sessionStorage.setItem('address', current.address);
        oldAddress = Object.keys(old).map((key) => {
          return {
            address: old[key].address,
            created: this.formatDate(new Date(key)),
          };
        });
        oldAddress.push(current);
      } else {
        address.address = resp.data.result.address;
        address.created = this.formatDate(
          new Date().toLocaleDateString('en-US')
        );
        oldAddress.push(address);
        window.sessionStorage.setItem('address', resp.data.result.address);
      }
      this.setState({
        show: true,
        oldAddress: oldAddress,
        userAddress: userService.getAddress(),
      });
      if (resp.data.result.verification === undefined) {
        this.setState({
          status: false,
        });
      } else {
        if (resp.data.result.verification.A !== undefined) {
          this.setState({
            status: true,
          });
        } else {
          this.setState({
            status: false,
          });
        }
      }
    });
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
  generateNewAddress() {
    this.setState({ loadNewAddress: true });
    let body = {
      userName: window.sessionStorage.getItem('username'), //userService.getUserEmail(),
    };
    userService
      .addNewWalletToUser(body)
      .then((res) => {
        //console.log(res);
        setTimeout(() => {
          this.setState({
            loadNewAddress: false,
            errorNewAddress: false,
            successNewAddress: true,
          });
          this.loadUserAddresses();
        }, 3000);
      })
      .catch((error) => {
        //console.log(error);
        setTimeout(() => {
          this.setState({
            loadNewAddress: false,
            errorNewAddress: true,
            successNewAddress: false,
          });
        }, 3000);
      });
    // userService
    //   .generateAddress(
    //     bodyBushido,
    //     atob(credentials).split(":")[1],
    //     atob(credentials).split(":")[0]
    //   )
    //   .then(resp =>
    //   {
    //     //console.log(resp);
    //     if (resp.data.payload !== "") {
    //       let keys = resp.data.payload.split("__");

    //     }
    //   })
    //   .catch(error =>
    //   {
    //     //console.log(error);
    //     setTimeout(() =>
    //     {
    //       this.setState({
    //         loadNewAddress: false,
    //         errorNewAddress: true,
    //         successNewAddress: false
    //       });
    //     }, 3000);
    //   });
  }
  openNewAddressModal() {
    this.setState({
      openNewAddressModal: true,
    });
  }
  formatDate(date) {
    let regi = 'es-ES';
    let cad = '';
    var options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: 'true',
    };
    let data = date.toLocaleString(regi, options);
    if (regi === 'es-ES') {
      data = data.split(' ');
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + ' ' + date;
      }
    } else {
      cad = data;
    }
    return cad;
  }
  render() {
    let t = this.state.translator;
    let messageCopied, messageResult;
    let data = this.state.oldAddress;
    if (this.state.copiedAddress) {
      messageCopied = (
        <Message info>
          <Message.Content>{t('wallet.receive.addressCopied')}</Message.Content>
        </Message>
      );
    }
    if (this.state.successNewAddress) {
      messageResult = (
        <Message success>
          <Message.Content>
            {t('wallet.receive.modalNewAddress.messageResult.success')}
          </Message.Content>
        </Message>
      );
    }
    if (this.state.errorNewAddress) {
      messageResult = (
        <Message error>
          <Message.Content>
            {t('wallet.receive.modalNewAddress.messageResult.error')}
          </Message.Content>
        </Message>
      );
    }
    const tableHeaders = [
      {
        Header: t('wallet.receive.tableOldAddresses.headers.created'),
        accessor: 'created',
        width: 140,
      },
      {
        Header: t('wallet.receive.tableOldAddresses.headers.address'),
        accessor: 'address',
      },
    ];
    return (
      <Container textAlign='center'>
        <Dimmer.Dimmable dimmed={!this.state.show}>
          <Dimmer active={!this.state.show} inverted>
            <Loader> {t('wallet.receive.loading')}</Loader>
          </Dimmer>
          <Grid columns='equal'>
            {!this.state.status && (
              <Grid.Column
                textAlign='center'
                largeScreen={8}
                mobile={16}
                tablet={8}
                computer={8}
              >
                <Segment basic textAlign='center'>
                  <Message
                    info
                    content={
                      <div>
                        {t('wallet.receive.infoMessage.p1')}
                        <strong> {sessionStorage.getItem('username')}</strong>,
                        {t('wallet.receive.infoMessage.p2')}
                      </div>
                    }
                  />
                </Segment>
              </Grid.Column>
            )}

            {this.state.status === true && (
              <Grid.Column largeScreen={8} mobile={16} tablet={8} computer={8}>
                <Grid columns='equal'>
                  {!isMobile && <Grid.Column mobile={null} />}
                  <Grid.Column largeScreen={9} mobile={16} tablet={10}>
                    <Segment.Group>
                      <Segment id='qrSegmentTitle'>
                        <p>{t('wallet.receive.qrCode')}</p>
                      </Segment>
                      <Segment>
                        <QRCode
                          id='qrCode'
                          value={this.state.userAddress}
                          size={window.innerWidth < 768 ? 80 : 200}
                        />
                      </Segment>
                    </Segment.Group>
                  </Grid.Column>
                  {!isMobile && <Grid.Column mobile={null} />}
                </Grid>
                <Divider hidden />
                <Grid.Row>
                  <Grid.Column largeScreen={3} mobile={null} />
                  <Grid.Column
                    largeScreen={12}
                    mobile={16}
                    tablet={11}
                    textAlign='justified'
                  >
                    <Form>
                      <Form.Field>
                        <label
                          style={{ fontSize: 'medium', fontWeight: 'normal' }}
                        >
                          {t('wallet.receive.myAddress')}
                        </label>
                        <b id='addressText'>{this.state.userAddress}</b>
                        <CopyToClipboard text={this.state.userAddress}>
                          <Button
                            onClick={this.onClickCopyBtn}
                            data-tip={t('wallet.receive.buttonCopy')}
                            icon
                            id='orangeCopyBtn'
                          >
                            <Icon name='copy' />
                          </Button>
                        </CopyToClipboard>
                        {messageCopied}
                      </Form.Field>
                    </Form>
                  </Grid.Column>
                  <Grid.Column />
                </Grid.Row>
              </Grid.Column>
            )}

            <Grid.Column textAlign='justified'>
              {!isMobile && (
                <Grid>
                  <Grid.Column largeScreen={16} computer={16} mobile={16}>
                    <Accordion styled>
                      <Accordion.Title
                        active={this.state.activeIndexAccordion === 0}
                        index={0}
                        onClick={this.handleClick}
                      >
                        <Icon name='dropdown' />
                        {t('wallet.receive.accordion.txTitle')}
                      </Accordion.Title>
                      <Accordion.Content
                        active={this.state.activeIndexAccordion === 0}
                      >
                        <p>{t('wallet.receive.accordion.txBody')}</p>
                      </Accordion.Content>
                      <Accordion.Title
                        active={this.state.activeIndexAccordion === 1}
                        index={1}
                        onClick={this.handleClick}
                      >
                        <Icon name='dropdown' />
                        {t('wallet.receive.accordion.commissionsHeader')}
                      </Accordion.Title>
                      <Accordion.Content
                        active={this.state.activeIndexAccordion === 1}
                      >
                        <List as='ol'>
                          <List.Item as='li' value='-'>
                            {t('wallet.receive.accordion.commissionsBody1')}
                          </List.Item>
                          <List.Item as='li' value='-'>
                            {t('wallet.receive.accordion.commissionsBody2')}
                          </List.Item>
                        </List>
                      </Accordion.Content>
                      {this.state.status && (
                        <div>
                          <Accordion.Title
                            active={this.state.activeIndexAccordion === 2}
                            index={2}
                            onClick={this.handleClick}
                          >
                            <Icon name='dropdown' />
                            {t('wallet.receive.accordion.oldAddresses')}
                          </Accordion.Title>
                          <Accordion.Content
                            active={this.state.activeIndexAccordion === 2}
                          >
                            <ReactTable
                              defaultSorted={[
                                {
                                  id: 'created',
                                  desc: true,
                                },
                              ]}
                              className='transactionTable'
                              data={data}
                              columns={tableHeaders}
                              defaultPageSize={5}
                              previousText={t(
                                'wallet.tx.table.params.previousText'
                              )}
                              nextText={t('wallet.tx.table.params.nextText')}
                              loadingText={t(
                                'wallet.tx.table.params.loadingText'
                              )}
                              noDataText={t(
                                'wallet.tx.table.params.noDataText'
                              )}
                              pageText={t('wallet.tx.table.params.pageText')}
                              ofText={t('wallet.tx.table.params.ofText')}
                              rowsText={t('wallet.tx.table.params.rowsText')}
                              pageJumpText={t(
                                'wallet.tx.table.params.pageJumpText'
                              )}
                              rowsSelectorText={t(
                                'wallet.tx.table.params.rowsSelectorText'
                              )}
                              minRow={3}
                            />
                          </Accordion.Content>
                        </div>
                      )}
                    </Accordion>
                  </Grid.Column>
                </Grid>
              )}
            </Grid.Column>
            {!isMobile && <Divider hidden />}
            {this.state.status && (
              <Grid.Row>
                <Grid.Column
                  largeScreen={12}
                  mobile={16}
                  tablet={12}
                  computer={12}
                  textAlign='justified'
                >
                  <p>{t('wallet.receive.newAddressMessage')}</p>
                </Grid.Column>
                <Grid.Column
                  largeScreen={4}
                  mobile={16}
                  tablet={4}
                  computer={4}
                >
                  {isMobile && <Divider hidden />}
                  {isMobile && (
                    <div align='center'>
                      <Button
                        color='blue'
                        onClick={this.openNewAddressModal}
                        style={{
                          borderRadius: '40px/40px',
                          height: '50px',
                          width: '200px',
                        }}
                      >
                        {t('wallet.receive.buttonNewAddress')}
                      </Button>
                    </div>
                  )}
                  {!isMobile && (
                    <div align='right'>
                      <Button
                        color='blue'
                        onClick={this.openNewAddressModal}
                        style={{ marginTop: window.innerWidth <= 364 ? 8 : 0 }}
                      >
                        {t('wallet.receive.buttonNewAddress')}
                      </Button>
                    </div>
                  )}
                  {isMobile && <Divider hidden />}
                  {isMobile && (
                    <Grid>
                      <Grid.Column largeScreen={16} computer={16} mobile={16}>
                        <Accordion styled>
                          <Accordion.Title
                            active={this.state.activeIndexAccordion === 0}
                            index={0}
                            onClick={this.handleClick}
                          >
                            <Icon name='dropdown' />
                            {t('wallet.receive.accordion.txTitle')}
                          </Accordion.Title>
                          <Accordion.Content
                            active={this.state.activeIndexAccordion === 0}
                          >
                            <p>{t('wallet.receive.accordion.txBody')}</p>
                          </Accordion.Content>
                          <Accordion.Title
                            active={this.state.activeIndexAccordion === 1}
                            index={1}
                            onClick={this.handleClick}
                          >
                            <Icon name='dropdown' />
                            {t('wallet.receive.accordion.commissionsHeader')}
                          </Accordion.Title>
                          <Accordion.Content
                            active={this.state.activeIndexAccordion === 1}
                          >
                            <List as='ol'>
                              <List.Item as='li' value='-'>
                                {t('wallet.receive.accordion.commissionsBody1')}
                              </List.Item>
                              <List.Item as='li' value='-'>
                                {t('wallet.receive.accordion.commissionsBody2')}
                              </List.Item>
                            </List>
                          </Accordion.Content>
                          {this.state.status && (
                            <div>
                              <Accordion.Title
                                active={this.state.activeIndexAccordion === 2}
                                index={2}
                                onClick={this.handleClick}
                              >
                                <Icon name='dropdown' />
                                {t('wallet.receive.accordion.oldAddresses')}
                              </Accordion.Title>
                              <Accordion.Content
                                active={this.state.activeIndexAccordion === 2}
                              >
                                <ReactTable
                                  defaultSorted={[
                                    {
                                      id: 'created',
                                      desc: true,
                                    },
                                  ]}
                                  className='transactionTable'
                                  data={data}
                                  columns={tableHeaders}
                                  defaultPageSize={5}
                                  previousText={t(
                                    'wallet.tx.table.params.previousText'
                                  )}
                                  nextText={t(
                                    'wallet.tx.table.params.nextText'
                                  )}
                                  loadingText={t(
                                    'wallet.tx.table.params.loadingText'
                                  )}
                                  noDataText={t(
                                    'wallet.tx.table.params.noDataText'
                                  )}
                                  pageText={t(
                                    'wallet.tx.table.params.pageText'
                                  )}
                                  ofText={t('wallet.tx.table.params.ofText')}
                                  rowsText={t(
                                    'wallet.tx.table.params.rowsText'
                                  )}
                                  pageJumpText={t(
                                    'wallet.tx.table.params.pageJumpText'
                                  )}
                                  rowsSelectorText={t(
                                    'wallet.tx.table.params.rowsSelectorText'
                                  )}
                                  minRow={3}
                                />
                              </Accordion.Content>
                            </div>
                          )}
                        </Accordion>
                      </Grid.Column>
                    </Grid>
                  )}
                </Grid.Column>
              </Grid.Row>
            )}
          </Grid>
          <Divider hidden />
          <ReactTooltip />
        </Dimmer.Dimmable>
        <Modal
          open={this.state.openNewAddressModal}
          onClose={this.closeNewAddressModal}
          closeOnDimmerClick={false}
          closeOnDocumentClick={false}
        >
          <Modal.Header>
            {t('wallet.receive.modalNewAddress.header')}
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {!this.state.errorNewAddress && !this.state.successNewAddress && (
                <p>{t('wallet.receive.modalNewAddress.body')} </p>
              )}
              {(this.state.errorNewAddress || this.state.successNewAddress) &&
                messageResult}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeNewAddressModal} color='grey'>
              {t('wallet.receive.modalNewAddress.buttonClose')}
            </Button>
            <Button
              onClick={this.generateNewAddress}
              type='submit'
              color='blue'
              loading={this.state.loadNewAddress}
              disabled={
                this.state.errorNewAddress || this.state.successNewAddress
              }
            >
              {t('wallet.receive.modalNewAddress.buttonGenerate')}
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

export default translate(ReceiveBitcoins);
