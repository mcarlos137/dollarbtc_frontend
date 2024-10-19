import React, { Component } from 'react';
import '../../Admin.css';
import {
  Button,
  Icon,
  Modal,
  Dimmer,
  Loader
} from 'semantic-ui-react';
import translate from "../../../../i18n/translate";
import giftCardService from '../../../../services/giftCard';


class ModalChangeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      translator: props.translate,
      operationFinished: false,
      giftCardSeleted: this.props.giftCardSeleted,
      loading: false
    }
}

componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }


async changeStatusGiftCard() {
  this.setState({
    loading: true
  })
  console.log(this.props.giftCardSeleted);
  let body = {
    id: this.props.giftCardSeleted.id,
    source: this.props.giftCardSeleted.source !== undefined ? this.props.giftCardSeleted.source : "MONEYCLICK"
  };

  let response;
  if(this.props.action === "send") {
    response = await giftCardService._giftCardSubmit(body);
  } else if(this.props.action === "delete") {
    response = await giftCardService._giftCardDelete(body);
  } else {
    response = await giftCardService._giftCardResend(body);
  }

  if(response.data === "OK") {
    this.props.refresh();
    this.setState({
      message: this.props.action === "send" ? this.state.translator("giftCard.giftCardSubmitSuccess") :
       this.props.action === "delete" ? this.state.translator("giftCard.giftCardDeleteSuccess") : 
      this.state.translator("giftCard.giftCardResendSuccess"),
       loading: false,
       operationFinished: true
    });
  } else {
     this.setState({
      message:  this.state.translator("giftCard.errorChangeStatus"),
      loading: false,
      operationFinished: true
     });
     console.log("Error changue status : ", response);
  }
}
closeModal() {
  this.setState({
    message: "",
    operationFinished: false
  });
  this.props.closeModal();
}

render() {
    return(<Modal
              open={this.props.showModal}
              onClose={this.props.closeModal}
            >
              {this.state.loadingSending && (
						<Dimmer active inverted>
							<Loader inverted>{this.state.translator("giftCard.waiting")}</Loader>
						</Dimmer>
					)}
              <Modal.Header>{this.props.action === "send" ? "Enviar " : this.props.action === "delete " ? "Eliminar ": "Reenviar "} Gift Card</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  {this.props.giftCardSeleted !== null && (<div>
                    <div>
                      <h4>Id</h4>{this.props.giftCardSeleted.id}
                      <h4>Fecha de activación</h4>{this.props.giftCardSeleted.activationTimestamp}
                      <h4>Usuario</h4>{this.props.giftCardSeleted.baseUserName}
                      <h4>Monto</h4>{this.props.giftCardSeleted.amount} {this.props.giftCardSeleted.currency}
                    </div>
                     {this.state.message === "" && (
                     <h3 style={{textAlign: "center"}}>¿Esta seguro de {this.props.action === "send" ? "enviar " 
                     : this.props.action === "delete" ? "eliminar ": "reenviar "} la Gift Card ?</h3>)}
                      {this.state.message !== "" && (
                     <h3 style={{textAlign: "center"}}>
                       {this.state.message}
                     </h3>)}
                    </div>
                  )}
                </Modal.Description>
              </Modal.Content>
              {!this.state.operationFinished && (<Modal.Actions>
                <Button onClick={this.props.closeModal} color='red'>
                  <Icon name='remove' /> No
                </Button>
                <Button onClick={this.changeStatusGiftCard.bind(this)} color='green'>
                  <Icon name='checkmark' /> Si
                </Button>
               
              </Modal.Actions>)}
              {this.state.operationFinished && (<Modal.Actions> 
                <Button onClick={this.closeModal.bind(this)} color='green'>
                  <Icon name='checkmark' /> Aceptar
                </Button></Modal.Actions>)}
            </Modal>)
}
}

export default translate(ModalChangeStatus);
  