import React, { Component ,useState} from "react";

import {
  Segment,
  Modal,
  Divider,
  Grid,
  Form,
  Label,
  Button,
  Card,
  Popup,
  Icon,
  Dropdown,
  Message
} from "semantic-ui-react";
import retails from "../../../../services/moneyclick";

class ModalSend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.retailSeleted.id,
      title: this.props.retailSeleted.title,
      description: this.props.retailSeleted.description,
      // latitude: null,
      // longitude: null,
      email: null,
      sendPost: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      loadForm: false
    };
   
  }

  componentDidMount() {
   
  }
   componentDidUpdate(nexProps) {
 
   }
   handleIdRetail(e, data) {
    this.setState({ id: e.target.value });
  }
  handleEmailRetail(e, data) {
    this.setState({ email: e.target.value });
  }
  handleTitleRetail(e, data) {
    this.setState({ title: e.target.value });
  }
  handleDescriptionRetail(e, data) {
    this.setState({ description: e.target.value });
   }
  // handleLongitudeRetail(e, data) {
  //   this.setState({ longitude: e.target.value });
  // }
  // handleLatitudeRetail(e, data) {
  //   this.setState({ latitude: e.target.value });
  // }

  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
  cancelCustomize() {
    this.setState({
      title: null,
      description: null,
      textMessage: "",
      viewMessage: false,
      colorMessage: "",
      sendPost: false
    });
    this.props.cancel();
  }
   confirmCustomize() {

    //  if (this.state.title !== "") {
    //     let array = [];
    //     for (let curr of this.state.currenciesSave) {
    //      array.push(curr);
    //   //    for (let subFun of funtions.values) {
    //   //      array.push(subFun);
    //   //    }
    //     }
    //    //  //console.log(array);
    //    let body = {
    //      id: this.state.id,
    //      title: this.state.title,
    //      description: this.state.description,
    //      latitude: this.state.latitude,
    //      longitude: this.state.longitude,
    //      currencies: array
    //     // functionsAvailables: array
    //    };
    //    this.setState({ loadForm: true });
    //    retails.addRetail(body)
    //      .then(resp => {
    //        if (resp.data) {
    //          this.setState({
    //            viewMessage: true,
    //            textMessage: "El retail ha sido creado exitosamente",
    //            colorMessage: "blue",
    //            sendPost: true,
    //            loadForm: false
    //          });
    //        } else {
    //          this.setState({
    //           viewMessage: true,
    //            textMessage: "El nombre del retail ya esta en uso ,seleccione otro",
    //            colorMessage: "red",
    //            loadForm: false
    //          });
    //          setTimeout(() => {
    //            this.setState({
    //              viewMessage: false,
    //              textMessage: "",
    //              colorMessage: ""
    //            });
    //          }, 8000);
    //        }
    //      })
    //      .catch(error => {
    //        //console.log(error);
    //        this.setState({
    //          viewMessage: true,
    //          textMessage:
    //            "Disculpe ha ocurrido un error en la conexión intente mas tarde",
    //          colorMessage: "red",
    //          loadForm: false
    //        });
    //      });
    //  } else {
    //    this.setState({
    //      viewMessage: true,
    //     textMessage: "Debe incluir todos los datos requeridos",
    //      colorMessage: "red"
    //    });
    //    setTimeout(() => {
    //      this.setState({
    //        viewMessage: false,
    //        textMessage: "",
    //        colorMessage: ""
    //      });
    //    }, 8000);
    //  }
   }

  render() {
    console.log('datos del retailseleccionado antes',this.props.retailSeleted);
    if (this.props.retailSeleted.title === "") {
      return (
        <Modal open={this.props.show} size={"large"}>
          <Modal.Content>
            <Segment basic loading={this.state.loadForm}>
              <Grid>
                <Grid.Row column={1}>
                  <Grid.Column>
                    <Form>
                      <Form.Group inline>
                      <label>Indique el correo al cual se enviarà el còdigo QR</label>
                        <Form.Input
                          width={8}
                          title="email-retail"
                          value={this.state.email}
                          onChange={this.handleEmailRetail.bind(this)}
                        />
                      </Form.Group>
                      <Divider horizontal><h3>Datos del Retail</h3></Divider>
                      <Form.Group inline>
                        
                      <h4>ID :</h4><label>{this.props.retailSeleted.id}</label>
                      <h4>Tìtulo :</h4><label>{this.props.retailSeleted.title}</label>
                      <h4>Descripciòn :</h4><label>{this.props.retailSeleted.description}</label>
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {this.state.viewMessage && (
                <Message color={this.state.colorMessage}>
                  {this.state.textMessage}
                </Message>
              )}
        
         
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.sendPost && (
              <Button
                color="grey"
                onClick={this.cancelCustomize.bind(this)}
                disabled={this.state.loadForm}
              >
                Cancelar
              </Button>
            )}
            {this.state.sendPost && (
              <Button color="grey" onClick={this.cancelCustomize.bind(this)}>
                Cerrar
              </Button>
            )}
            {!this.state.sendPost && (
              <Button
                color="blue"
                onClick={this.confirmCustomize.bind(this)}
                disabled={this.state.loadForm}
              >
                Guardar
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      );
     }
  }
}

export default ModalSend;