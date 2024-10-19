
import React, { Component ,useState} from "react";
import ReactMapGL, { Marker  } from 'react-map-gl';

import {
  Segment,
  Modal,
  List,
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
import "./ModalCustomize.css";
import currency from "../../../../common/currency";
import retails from "../../../../services/moneyclick";

class ModalCustomize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 1000,
        height: 400,
        latitude: 10.072752,
        longitude: -69.316039,
        zoom: 15
      },
      dataMap: [],
      listCurrencies: currency.currencies,
      retailSeleted: this.props.retailSeleted,
      currencies: [],
      currenciesSave: null,
      id: null,
      title: null,
      description: null,
      latitude: null,
      longitude: null,
      sendPost: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      loadForm: false
    };
    //this.mapFunctions = new Map();
   // this.mapFunctions = funct.getMap();
   // this.traslateMap = new Map();
   // this.traslateMap = funct.getFunctionsSpanish();
   
  }

  componentDidMount() {
   
    // this.setState({
    //   data: this.props.data
    // });
    //console.log(this.mapFunctions);
  }
   componentDidUpdate(nexProps) {
     if (this.props.retailSeleted.title !== undefined) 
     {
     if (this.props.retailSeleted.title !== "" && this.state.title === null) {
        this.setState({ title: this.props.retailSeleted.title });
        let arrayCurr = [];
  //       for (let data of this.props.retailSeleted.functionsAvailables) {
  //         let ob = {
  //           title: "",
  //           values: []
  //         };
  //          if (this.mapFunctions.has(data)) {
  //            let array = this.mapFunctions.get(data);
  //            for (let value of array) {
  //              if (this.props.retailSeleted.functionsAvailables.indexOf(value) !== -1) 
  //                {
  //                ob.values.push(value);
  //              }
  //            }
  //            arrayFun.push(data);
  //            arraySub.push(ob);
  //          }
  // }
         this.setState({
           currencies: arrayCurr
         });
       }
     }
   }
   handleIdRetail(e, data) {
    this.setState({ id: e.target.value });
  }
  handleTitleRetail(e, data) {
    this.setState({ title: e.target.value });
  }
  handleDescriptionRetail(e, data) {
    this.setState({ description: e.target.value });
  }
  handleLongitudeRetail(e, data) {
    this.setState({ longitude: e.target.value });
  }
  handleLatitudeRetail(e, data) {
    this.setState({ latitude: e.target.value });
  }

  handleChange = (e, data) => {
    console.log(data.value)
    this.setState({ currenciesSave: data.value });
 
  };

  
  handleCoordinates = (e) => {
    let dataMap = [];
    this.setState({ longitude: e.lngLat[0] , 
      latitude: e.lngLat[1]
    });
      let retail = {
        title: 'nuevo retail',
        description: ' ',
        coordinate:{
          longitude: e.lngLat[0],
          latitude: e.lngLat[1]
        }
        
      };
      dataMap.push(retail);
      console.log('nuevo arreglo',dataMap);
      this.setState({ dataMap: dataMap});
  };


  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
  cancelCustomize() {
    this.setState({
      setFuntions: [],
      currencies: [],
      title: null,
      description: null,
      latitiude: null,
      longitude: null,
      textMessage: "",
      viewMessage: false,
      colorMessage: "",
      sendPost: false
    });
    this.props.cancel();
  }
   confirmCustomize() {

     if (this.state.title !== "") {
        let array = [];
        for (let curr of this.state.currenciesSave) {
         array.push(curr);
      //    for (let subFun of funtions.values) {
      //      array.push(subFun);
      //    }
        }
       //  //console.log(array);
       let body = {
         id: this.state.id,
         title: this.state.title,
         description: this.state.description,
         latitude: this.state.latitude,
         longitude: this.state.longitude,
         currencies: array
        // functionsAvailables: array
       };
       this.setState({ loadForm: true });
       retails.addRetail(body)
         .then(resp => {
           if (resp.data) {
             this.setState({
               viewMessage: true,
               textMessage: "El retail ha sido creado exitosamente",
               colorMessage: "blue",
               sendPost: true,
               loadForm: false
             });
           } else {
             this.setState({
              viewMessage: true,
               textMessage: "El nombre del retail ya esta en uso ,seleccione otro",
               colorMessage: "red",
               loadForm: false
             });
             setTimeout(() => {
               this.setState({
                 viewMessage: false,
                 textMessage: "",
                 colorMessage: ""
               });
             }, 8000);
           }
         })
         .catch(error => {
           //console.log(error);
           this.setState({
             viewMessage: true,
             textMessage:
               "Disculpe ha ocurrido un error en la conexión intente mas tarde",
             colorMessage: "red",
             loadForm: false
           });
         });
     } else {
       this.setState({
         viewMessage: true,
        textMessage: "Debe incluir todos los datos requeridos",
         colorMessage: "red"
       });
       setTimeout(() => {
         this.setState({
           viewMessage: false,
           textMessage: "",
           colorMessage: ""
         });
       }, 8000);
     }
   }
//   updateCustomizeRol() {
//     if (this.state.title !== "" && this.state.setFuntions.length > 0) {
//       let array = [];
//       for (let funtions of this.state.setFuntions) {
//         array.push(funtions.title);
//         for (let subFun of funtions.values) {
//           array.push(subFun);
//         }
//       }
//       //  //console.log(this.state.setFuntions);
//       let body = {
//         id: this.props.retailSeleted.id,
//         title: this.state.title,
//         functionsAvailables: array
//       };
//       this.setState({ loadForm: true });
//       user
//         .updateRol(body)
//         .then(resp => {
//           if (resp.data.payload) {
//             this.setState({
//               viewMessage: true,
//               textMessage: "El rol ha sido actualizado exitosamente",
//               colorMessage: "blue",
//               sendPost: true,
//               loadForm: false
//             });
//           } else {
//             this.setState({
//               viewMessage: true,
//               textMessage: "El nombre del rol ya esta en uso seleccione otro",
//               colorMessage: "red",
//               loadForm: false
//             });
//             setTimeout(() => {
//               this.setState({
//                 viewMessage: false,
//                 textMessage: "",
//                 colorMessage: ""
//               });
//             }, 8000);
//           }
//         })
//         .catch(error => {
//           //console.log(error);
//           this.setState({
//             viewMessage: true,
//             textMessage:
//               "Disculpe ha ocurrido un error en la conexión intente mas tarde",
//             colorMessage: "red",
//             loadForm: false
//           });
//         });
//     } else {
//       this.setState({
//         viewMessage: true,
//         textMessage: "Debe incluir todos los datos requeridos",
//         colorMessage: "red"
//       });
//       setTimeout(() => {
//         this.setState({
//           viewMessage: false,
//           textMessage: "",
//           colorMessage: ""
//         });
//       }, 8000);
//     }
//   }


  render() {
     
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
                      <label>Id</label>
                        <Form.Input
                          width={4}
                          title="id-retail"
                          value={this.state.id}
                          onChange={this.handleIdRetail.bind(this)}
                        />
                      <label>Tìtulo</label>
                        <Form.Input
                          width={4}
                          title="title-retail"
                          value={this.state.title}
                          onChange={this.handleTitleRetail.bind(this)}
                        />
                        <label>Descripciòn</label>
                        <Form.Input
                          width={4}
                          title="description-retail"
                          value={this.state.description}
                          onChange={this.handleDescriptionRetail.bind(this)}
                        />
                      </Form.Group>
                      <Form.Group inline>
                      <label>Latitud</label>
                        <Form.Input
                          width={4}
                          title="latitude-retail"
                          value={this.state.latitude}
                          onChange={this.handleLatitudeRetail.bind(this)}
                          disabled
                        />
                        <label>Longitud</label>
                        <Form.Input
                          width={4}
                          title="longitude-retail"
                          value={this.state.longitude}
                          onChange={this.handleLongitudeRetail.bind(this)}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group inline>
                      <label>Monedas</label>
                      <Dropdown
                          placeholder="Monedas"
                          multiple
                          search
                          selection
                          onChange={this.handleChange.bind(this)}
                          onSearchChange={this.handleSearchChange.bind(this)}
                         // value={this.state.currencies}
                          options={this.state.listCurrencies}
                        />
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
        
              <ReactMapGL
        {...this.state.viewport} mapboxApiAccessToken = {'pk.eyJ1Ijoia29ueTE0OTQiLCJhIjoiY2sybmxvZWlsMDNxYTNjczY1bDJveGhncSJ9.Hfw6xVcid-3EY3ea4QpqrQ'}
        onViewportChange={(viewport) => this.setState({viewport})}  onDblClick={this.handleCoordinates.bind(this)}
      >
             {this.state.dataMap.map(m => (
         
            <Marker
            key={m.id}
            latitude= {m.coordinate.latitude}
            longitude={m.coordinate.longitude}
            >
           
             <Popup
          trigger={<Icon name='map marker alternate' color='blue' size='large' circular />}
          content={"Tìtulo : " + m.title + "\n\n" + "Descripciòn : " + m.description}
          position='top left'
        />


          </Marker>
            
          ))}  
           {this.props.data.map(m => (
         
         <Marker
         key={m.id}
         latitude= {m.coordinate.latitude}
         longitude={m.coordinate.longitude}
         >
        
          <Popup
       trigger={<Icon name='map marker alternate' color='orange' size='large' circular />}
       content={"Tìtulo : " + m.title + "\n\n" + "Descripciòn : " + m.description}
       position='top left'
     />


       </Marker>
         
       ))}
         </ReactMapGL>
         
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

export default ModalCustomize;