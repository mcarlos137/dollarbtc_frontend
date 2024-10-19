/* eslint-disable no-loop-func */
import React, { Component } from "react";
import "../../Admin.css";
import {
  Button,
  Icon,
  Loader,
  Dimmer,
  Popup,
  Label,
  Modal,
  Header,
  Form,
  Dropdown,
  Input,
  List,
  Segment,
  Image,
  Grid,
  Divider,
  Message,
  Select,
  Container,
} from "semantic-ui-react";
import ReactTable from "react-table";
import NumberFormat from "react-number-format";
import moneyOrder from "../../../../services/moneyOrder";
import "../lot.css";
import { Document, Page } from "react-pdf";
import _ from "underscore";

class MoneyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showOrdersTable: false,
        status:"PROCESSING",
        statusModal:"",
        ordersData: [],
        searchTable:false,
        idOrder: "",
        messageOrderStatusSucess: false,
        messageOrderStatusFailed: false,
        loaderChangeStatus: false,
        changeStatusModal: false,
        selectStatusOrderChange: [],
        additionalInfo:"",
        changeImageModal:false,
        imageOrderModal: null,
        isPdf: false,
        imageOrderShowDimmer:false,
        changeInfoModal: false,
        processTimestamp: "",
        processUserName: "",
        additionalInfo: ""

    };
  }
  componentDidMount() {
      this.orders();
  }
  
 orders = () => {
    this.setState({
      searchTable: true,
    });
     moneyOrder.getMoneyOrder(
      this.state.status
    ).then((resp) => {
        var result = [];
        for (let l of resp.data) {
          if(this.state.status==="PROCESSING"){
            l.statusOrder="PROCESSING";
            l.processTimestamp="";
            l.processUserName="";
          }else{
            if(this.state.status==="OK"){
            l.statusOrder="OK";
             }else{
               l.statusOrder="FAILED";
             }
            l.processTimestamp=l.processTimestamp;
            l.processUserName=l.processUserName;
          }
          
          result.push(l);
        }
        this.setState({
      showOrdersTable: true,searchTable: false,ordersData: result
    });
        
      })
      .catch((error) => {});
    
  };
  formatDate(date) {
    let regi = "es-ES";
    let cad = "";
    var options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: "true",
    };
    let data = date.toLocaleString(regi, options);
    if (regi === "es-ES") {
      data = data.split(" ");
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + " " + date;
      }
    } else {
      cad = data;
    }

    return cad;

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  pickStatusToSearch = (e, data) => {
       this.setState({ status: data.value });
  };

  changeOrderStatus = () => {
    this.setState({
      loaderChangeStatus: true,
    });
    
    let body = {
      userName: sessionStorage.getItem("username"),
      id: this.state.idOrder,
      status: this.state.statusModal,
      additionalInfo: this.state.additionalInfo,
    };

    moneyOrder
      .changeStatusMoneyOrder(body)
      .then((resp) => {
        this.orders();
        if(resp.data==="OK"){
          this.setState({ messageOrderStatusSucess: true }, () => {
          setTimeout(() => {
            this.setState({
              changeStatusModal: false,
              messageOrderStatusSucess: false,
              loaderChangeStatus: false,
            });
          }, 5000);
        });
        }else{
          this.setState({ messageOrderStatusFailed: true }, () => {
          setTimeout(() => {
            this.setState({
              changeStatusModal: false,
              messageOrderStatusFailed: false,
              loaderChangeStatus: false,
            });
          }, 5000);
        });
        }
        
        
      })
      .catch((error) => {});
  };
  floorDecimals = (value, numberDecimals) => {
    let decimales = Math.pow(10, numberDecimals);
    return Math.floor(value * decimales) / decimales;
  };
 
  openChangeStatusModal = (row) => {
    this.getAvailableStatusToChange(row.status);
    this.setState({ changeStatusModal: true, idOrder: row.id});
  };
  closeChangeStatus = () => {
    this.setState({
      changeStatusModal: false,
      statusModal:"",
    });
  };
   openImageModal = async (image) => {
     this.setState({ changeImageModal: true, 
      imageOrderShowDimmer:true
    });
    let imageOrder = {};
    imageOrder.isPdf =
           image !== undefined
             ? image.includes("pdf")
             : "";
             imageOrder.file =  await this.getImageToShow(image);
    this.setState({ imageOrderShowDimmer:false, 
      imageOrderModal:imageOrder
    });
  };
   async getImageToShow(fileName) {
    let result, type;

    if (fileName.includes("pdf")) {
      type = "application/pdf";
    } else if (fileName.includes("jpg") || fileName.includes("jpeg")) {
      type = "image/jpg";
    } else if (fileName.includes("png")) {
      type = "image/png";
    } else {
      type = "";
    }
    try {
      const response = await moneyOrder.getMoneyOrderImage(fileName);
      let blob = new Blob([response.data], {
        type: type !== "" ? type : response.headers["content-type"],
      });

      let image = URL.createObjectURL(blob);
      result = image;
    } catch (error) {
      result = "";
    }
    return result;
  }
  closeImage = () => {
    this.setState({
      changeImageModal: false,imageOrderModal: null
    });
  };
  openInfoModal = (row) => {
     this.setState({ changeInfoModal: true,
      processTimestamp: row.processTimestamp,
      processUserName: row.processUserName,
      additionalInfo: row.additionalInfo
    });
  };
  closeInfo = () => {
    this.setState({
      changeInfoModal: false,
    });
  };
  validateData(value) {
    if (value !== undefined) {
      return " - " + value;
    } else {
      return " ";
    }
  }
  getAvailableStatusToChange = (status) => {
    var allStatus = ["FAILED", "OK"];
    if (status ===
        "FAILED" ||
      status=== "OK"
    ) {
      var index = allStatus.indexOf(
        status
      );
      if (index > -1) {
        var availableStatus = [];
        allStatus.splice(index, 1);
        for (var i = 0; i < allStatus.length; i++) {
          var status = "";
          if (allStatus[i] === "FAILED") {
            status = "FALLIDA";
          } else {
            status = "OK";
          }
          var itemToAdd = {
            key: allStatus[i],
            value: allStatus[i],
            text: status,
          };
          availableStatus.push(itemToAdd);
        }
        this.setState({ selectStatusOrderChange: availableStatus });
      }
    } else {
      var availableStatus = [];
      for (var j = 0; j < allStatus.length; j++) {
        var statusText = "";
        if (allStatus[j] === "FAILED") {
          statusText = "FALLIDA";
        } else {
          statusText = "OK";
        }
        var itemToAdd = {
          key: allStatus[j],
          value: allStatus[j],
          text: statusText,
        };
        availableStatus.push(itemToAdd);
      }
      this.setState({ selectStatusOrderChange: availableStatus });
    }
  };
  pickStatusOrder = (e, data) => {
    this.setState({ statusModal: data.value });
  };
  handleMessage = (e, data) => {
    this.setState({ additionalInfo: data.value });
  };
  

  render() {
    const statusesToSearch = [
      { key: "PROCESSING",icon: "sync", value: "PROCESSING", text: "PROCESANDO" },
      { key: "OK",icon: "check circle", value: "OK", text: "OK" },
      { key: "FAILED",icon: "warning circle", value: "FAILED", text: "FALLIDA" },
    ];

    const ordersTableHeaders = [
      {
        Header: "id",
        accessor: "id",
        Cell: (row) => {
          return row.value.slice(-4);
        },
        width: 55,
      },
      {
        Header: "Teléfono",
        accessor: "userName",
        width: 150,
        Cell: (row) => {
          return row.value;
        },
      },
       {
        Header: "Nombre",
        accessor: "senderName",
        width: 150,
        Cell: (row) => {
          return row.value;
        },
      },
       {
        Header: "Moneda",
        accessor: "currency",
        width: 80,
        Cell: (row) => {
          return row.value;
        },
      },
       {
        Header: "Monto",
        accessor: "amount",
        width: 150,
        Cell: (row) => {
          return(
           <p >
              <NumberFormat
                value={this.floorDecimals(row.value, 2)}
                displayType={"text"}
                thousandSeparator={true}
              />
            </p>)
        },
      },
       {
        Header: "ID Guia",
        accessor: "orderId",
        Cell: (row) => {
           if (row.value !== "") {
            return row.value.slice(-4);
          } else  {
               return "No Posee";
          }
        },
        width: 100,
      },
      {
        Header: "Fecha",
        accessor: "timestamp",
        width: 160,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
       {
        Header: "Estatus",
        accessor: "statusOrder",
        Cell: (row) => {
          if (row.value === "OK") {
            return (
              <Label color="green">
                <Icon name="check circle" />
                OK
              </Label>
            );
          }
           else if (row.value === "FAILED") {
            return (
              <Label color="red">
                <Icon name="warning circle"/>
                FALLIDA
              </Label>
            );
          }
           else if (row.value === "PROCESSING") {
            return (
              <Label color="blue">
                <Icon name="sync" loading />
                PROCESANDO
              </Label>
            );
          }
        },
        width: 150,
      },
      	{
				Header: "Acciones",
				accessor: "actions",
				width: 100,
				Cell: (row) => {
					return (
            <div>
              
              {row.original.statusOrder==="PROCESSING" &&( 
                <Popup
              trigger={
               <Button
                  onClick={() =>
                    this.openChangeStatusModal(row.original)
                  }
                  color="blue"
                  size="tiny"
                  circular
                  icon
                >
                <Icon name="exchange" />
               </Button>
                        }
              content="Cambiar estatus"
            />
            )
          }
						{row.original.imageFileName!==undefined &&( 
            <Popup
              trigger={
               <Button
                  onClick={() =>
                    this.openImageModal(row.original.imageFileName)
                  }
                  color="blue"
                  size="tiny"
                  circular
                  icon
                >
                <Icon name="image" />
               </Button>
                        }
              content="Ver orden"
            /> )
          }
          {row.original.processTimestamp!==undefined && row.original.statusOrder!=="PROCESSING" &&( 
            <Popup
              trigger={
               <Button
                  onClick={() =>
                    this.openInfoModal(row.original)
                  }
                  color="blue"
                  size="tiny"
                  circular
                  icon
                >
                <Icon name="info" />
               </Button>
                        }
              content="Ver información adicional"
            /> )
          }
          
            </div>
					);
				},
			},
      
    ];
    return (
      <div>
        {!this.state.showOrdersTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <Form>
          <Form.Group style={{ marginRight: 70 }}>
            <Form.Field width={5}>
              <label>Estatus a consultar</label>
              <Dropdown
                placeholder="Seleccione un estatus"
                fluid
                search
                selection
                options={statusesToSearch}
                onChange={this.pickStatusToSearch}
                value={this.state.status}
              />
            </Form.Field>
            <Form.Field width={4}>
              <div align="center">
                <Button
                  style={{ marginTop: 22 }}
                  type="submit"
                  onClick={this.orders}
                  color="blue"
                  icon
                  labelPosition="center"
                >
                  <Icon name="search" />
                  Buscar
                </Button>
              </div>
            </Form.Field>
            <Form.Field></Form.Field>
          </Form.Group>
        </Form>
        <Divider section />
         
        <ReactTable
          //key={this.state.keyOperationTable}
          defaultSorted={[
            {
              id: "timestamp",
              desc: true,
            },
          ]}
          style={{ fontSize: 12 }}
          className="transactionTable"
          data={this.state.ordersData}
          columns={ordersTableHeaders}
          defaultPageSize={5}
          previousText="Anterior"
          nextText="Siguiente"
          loading={this.state.searchTable}
          loadingText="Cargando..."
          noDataText="No hay ordenes"
          pageText="Página"
          ofText="de"
          rowsText="filas"
          pageJumpText="ir a la página"
          rowsSelectorText="filas por página"
          minRow={5}
          collapseOnDataChange={false}
        />
        
        <Modal
          open={this.state.changeStatusModal}
          onClose={this.closeChangeStatus}
        >
          <Modal.Header>Cambiar estatus de la Orden</Modal.Header>
          <Modal.Content>
            {this.state.selectStatusOrderChange.length === 0 && (
					<Dimmer active inverted>
						<Loader inverted >
							Cargando...
						</Loader>
					</Dimmer>
				)}
        {this.state.selectStatusOrderChange.length >= 0 && (
            <Form>
                <Form.Field width={16}>
                  <Select
                    placeholder="Escoge el nuevo estatus"
                    label="Seleccione el estatus :"
                    options={this.state.selectStatusOrderChange}
                    onChange={this.pickStatusOrder}
                  />
                </Form.Field >
                <Form.Field width={16}>
                  <Input
											type='text'
											action
											fluid
											// value={this.state.answer}
											placeholder='Información adicional '
											onChange={this.handleMessage.bind(this)}/>
                </Form.Field >
                  {this.state.messageOrderStatusSucess && (
                    <Message positive>
                      <Message.Header>Cambio de estatus exitoso</Message.Header>
                      <p>
                        El cambio de estatus de la orden se ejecuto
                        exitosamente.
                      </p>
                    </Message>
                  )}
                   {this.state.messageOrderStatusFailed && (
                    <Message negative>
                      <Message.Header>Cambio de estatus fallido</Message.Header>
                      <p>
                        El cambio de estatus de la orden no se ejecuto
                        exitosamente.
                      </p>
                    </Message>
                  )}
            </Form>
          )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              type="submit"
              onClick={this.closeChangeStatus}
              color="grey"
              icon
              labelPosition="left"
            >
              <Icon name="cancel" />
              Cancelar
            </Button>
            {!this.state.messageOrderStatusSucess && !this.state.messageOrderStatusFailed && (
              <Button
                type="submit"
                onClick={this.changeOrderStatus}
                color="blue"
                loading={this.state.loaderChangeStatus}
              >
                Cambiar Estatus
              </Button>
            )}
          </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.changeImageModal}
          onClose={this.closeImage}
        >
          <Modal.Header>Orden</Modal.Header>
          <Modal.Content>
            {this.state.imageOrderShowDimmer === true && (
					<Dimmer active inverted>
						<Loader inverted >
							Cargando...
						</Loader>
					</Dimmer>
				)} 
            <Form>
               <Container textAlign="center">
                                      <Grid centered columns={3}>
                                        <Grid.Column></Grid.Column>
                                        <Grid.Column>
                                           {this.state
                                                .imageOrderModal !==
                                                undefined &&
                                              this.state.imageOrderModal!==
                                                null &&
                                              this.state.imageOrderModal !==
                                                "" &&
                                              this.state.imageOrderModal
                                                .isPdf ? ( // primer caso de pdf
                                                <div>
                                                  <List.Item>
                                                    <Document
                                                      file={
                                                        this.state
                                                          .imageOrderModal
                                                          .file
                                                      }
                                                      externalLinkTarget="_blank"
                                                    >
                                                      <Page
                                                        pageNumber={1}
                                                        width={400}
                                                        height={400}
                                                      />
                                                    </Document>
                                                  </List.Item>

                                                  {this.state
                                                    .imageOrderModal
                                                    .file !== "" && (
                                                    <Button
                                                      as="a"
                                                      href={
                                                        this.state
                                                          .imageOrderModal
                                                          .file
                                                      }
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      Descargar PDF
                                                    </Button>
                                                  )}
                                                </div>
                                              ) : this.state
                                                  .imageOrderModal !==
                                                  undefined &&
                                                this.state
                                                  .imageOrderModal !==
                                                  null &&
                                                this.state
                                                  .imageOrderModal !==
                                                  "" ? (
                                                <Modal
                                                  //key={id}
                                                  trigger={
                                                    // <List.Item>
                                                    <Image
                                                    centered
                                                      title="Ver pantalla completa"
                                                      src={
                                                        this.state
                                                          .imageOrderModal
                                                          .file
                                                      }
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      alt=""
                                                      size="medium"
                                                      as="a"
                                                      style={{
                                                        maxHeight: "800px",
                                                      }}
                                                      
                                                    />
                                                  }
                                                >
                                                  <Modal.Content>
                                                    <Image
                                                      centered
                                                      src={
                                                        this.state
                                                          .imageOrderModal
                                                          .file
                                                      }
                                                      size="huge"
                                                    />
                                                  </Modal.Content>
                                                </Modal>
                                              ) : (
                                                <Segment
                                                  size="tiny"
                                                  placeholder
                                                >
                                                  <Header icon>
                                                    <Icon name="file image outline" />
                                                    El usuario no ha subido este
                                                    documento.
                                                  </Header>
                                                </Segment>
                                              )}
                                        </Grid.Column>
                                        <Grid.Column></Grid.Column>
                                        </Grid> </Container>
                
            </Form>
          
          </Modal.Content>
          <Modal.Actions>
            <Button
              type="submit"
              onClick={this.closeImage}
              color="grey"
              icon
              labelPosition="left"
            >
              <Icon name="cancel" />
              Cerrar
            </Button>
          </Modal.Actions>
        </Modal>
         <Modal
          open={this.state.changeInfoModal}
          onClose={this.closeInfo}
        >
          <Modal.Header>Información adicional de la Orden</Modal.Header>
          <Modal.Content>
            <Form>
               <Container textAlign="center">
                 <Grid centered columns={3}>
                   <Grid.Row>
                     <Grid.Column>
                        <Form.Field>
                          <label>Fecha de procesado:</label>
                          <p className="infoUserParagraph">
                            {this.formatDate(new Date(this.state.processTimestamp)
                            )}
                          </p>
                        </Form.Field>
                     </Grid.Column>
                     <Grid.Column>
                        <Form.Field>
                          <label>Usuario responsable:</label>
                          {this.state.processUserName}
                        </Form.Field>
                     </Grid.Column>
                      <Grid.Column>
                        {this.state.additionalInfo !== undefined && ( 
                        <Form.Field>
                          <label>Información Adicional:</label>
                          {this.state.additionalInfo}
                        </Form.Field>)}
                       
                     </Grid.Column>
                   </Grid.Row>
                 </Grid>
                  </Container>
                
            </Form>
          
          </Modal.Content>
          <Modal.Actions>
            <Button
              type="submit"
              onClick={this.closeInfo}
              color="grey"
              icon
              labelPosition="left"
            >
              <Icon name="cancel" />
              Cerrar
            </Button>
          </Modal.Actions>
        </Modal>
       
      </div>
    );
  }
}
export default MoneyOrders;