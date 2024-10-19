import React, { Component } from "react";
import ReactTable from "react-table";
import {
  Modal,
  Button,
  Segment,
  Divider,
  Header,
  Grid,
  Message,
  Form,
  Select,
  List,
  Image,
  Dropdown,
} from "semantic-ui-react";
import retails from "../../../services/moneyclick";
import attachmentServices from "../../../services/attachments";
import otc from "../../../services/otc";
import userService from "../../../services/user";
import ISOCURRENCIES from "../../../common/ISO4217";
import Files from "react-files";
import Resizer from "react-image-file-resizer";
import FormData from "form-data";
import id from "../../../img/verifyicon1.png";
import { element } from "prop-types";
import theter from '../../../img/tether-seeklogo.svg';
class ListRetails extends Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
    this.state = {
      data: [],
      dataFormat: [],
      showAsignateModal: false,
      showSendRetail: false,
      showCustomizeRetail: false,
      showModalConfig: false,
      showDeleleConfirm: false,
      retailSelected: {},
      load: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      saved: false,
      statusSelected: "",
      statusCreated: [],
      addFile: true,
      fileName: "",
      selectedFile: null,
      filesToSave: [],
      operationsType: [],
      operationToSave: [],
      currenciesToAdd: [],
      currencySelected: "",
      showModalOperationsType: false,
      operationTypeRetail: [],
      showFormOperationType: false,
      messageErrorAdjuntar: false,
      message: "",
      fileToSave: {},
      fileImg: id,
      showMessageStatusSuccess: false,
      viewButtonAddCurrencyOperation: false,
      attachmentRetailSelected: [],
      savedChange: false,
    };
    this.traslateMap = new Map();
    this.handleModalConfig = this.handleModalConfig.bind(this);
    this.handleModalOperationsType = this.handleModalOperationsType.bind(this);
    this.removeOperation = this.removeOperation.bind(this);
  }
  componentDidMount() {
    this.setState({ load: true });
    this.getRetails();
    this.getCurrencies();
  }
  getRetails() {
    let array = [];
    let arrayNoFormat = [];
    retails.getListRetails().then((resp) => {
      for (let retail of resp.data) {
        let currencyShow = [];
        for (let i = 0; i < retail.currencies.length; i++) {
          currencyShow.push(retail.currencies[i] + " ");
        }

        let ob = {
          id: retail.id,
          title: retail.title,
          username: retail.userName,
          description: retail.description,
          currencies: retail.currencies,
          currenciesShow: currencyShow,
          statusCreate: retail.mcRetailCreateStatus,
          email: retail.email,
          coordinate: retail.coordinate,
          attachments: retail.attachments,
          operations: retail.operations,
          typeRequest:
            retail.onlyForMap,
        };
        array.push(ob);
        arrayNoFormat.push(retail);
      }
      this.setState({ dataFormat: array, data: arrayNoFormat, load: false });
    });
  }
  getCurrencies = () => {
    let currency = otc.getAdminCurrencies(userService.getUserName());
    currency
      .then((resp) => {
        let currencies = resp.data;
        let selectCurrencies = [];
        let currencyCurrent = {};
        for (let i = 0; i < currencies.length; i++) {
          let currencyToAddSelect = {};
          let countryCoin = currencies[i].shortName.split("_");
          currencyCurrent = ISOCURRENCIES.ISOCURRENCIES.filter((c) => {
            if (countryCoin.length > 1)
              return c.flag === countryCoin[0].toLowerCase();
            else return c.key === countryCoin[0];
          })[0];
         if (currencyCurrent !== undefined && currencyCurrent.key !== 'USDT' && currencyCurrent.key !== 'ETH') {
            currencyToAddSelect.flag = currencyCurrent.flag;
          } else if(currencies[i].shortName === "ETH") {
					  currencyToAddSelect.icon = "ethereum";
          } else if(currencies[i].shortName === "USDT") {
            currencyToAddSelect.image =  { avatar: true, size: 'mini',src: theter };
          };
          currencyToAddSelect.key = currencies[i].shortName;
          currencyToAddSelect.value = currencies[i].shortName;
          currencyToAddSelect.text = currencies[i].fullName;
          selectCurrencies.push(currencyToAddSelect);
        }
        this.setState({ currenciesToAdd: selectCurrencies, load: false });
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  handleModalOperationsType(data) {
    this.setState({ load: true });

    this.setState(
      {
        showModalOperationsType: true,
        retailSelected: data,
        operationTypeRetail: data.operations,
      },
      () => {
        this.setState({ load: false });
      }
    );
  }
  closeModalOperationsType() {
    this.setState({
      showModalOperationsType: false,
      currencySelected: "",
      operationToSave: [],
      savedChange: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      showFormOperationType: false,
    });
  }
  loadStatus(status) {
    let statusArray = [];
    if (status === "SENDED") {
      statusArray.push({
        key: "ANALYSING",
        value: "ANALYSING",
        text: "ANALIZANDO",
      });
    } else if (status === "ANALYSING") {
      statusArray.push({
        key: "ACTIVATED",
        value: "ACTIVATED",
        text: "APROBADO",
      });
      statusArray.push({ key: "FAILED", value: "FAILED", text: "RECHAZADO" });
    } else if (status === "FAILED") {
      statusArray.push({
        key: "ANALYSING",
        value: "ANALYSING",
        text: "ANALIZANDO",
      });
    } else if (status === "ACTIVATED") {
      statusArray.push({
        key: "ANALYSING",
        value: "ANALYSING",
        text: "ANALIZANDO",
      });
      statusArray.push({ key: "FAILED", value: "FAILED", text: "RECHAZADO" });
    }
    this.setState({ statusCreated: statusArray });
  }
  handleCustomizeRetail() {
    this.setState({ showCustomizeRetail: true });
  }

  async handleModalConfig(data) {
    //  console.log(data);
    this.setState({ load: true, showModalConfig: true });
    this.loadStatus(data.statusCreate);
    let arrayAttach = [];
    if (data.attachments !== undefined) {
      for (let nameAttach of data.attachments) {
        try {
          const response = await attachmentServices.getAttachementByRetail(
            data.id,
            nameAttach
          );
          //b64Response = btoa(response.data);
          let blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          let image = URL.createObjectURL(blob);
          //console.log(image);
          arrayAttach.push(image);
        } catch (error) {
          // console.log(error);
          continue;
        }
      }
      this.setState({
        load: false,
        retailSelected: data,
        attachmentRetailSelected: arrayAttach,
      });
    }
  }
  pickOperationToSave(e, data) {
    this.setState({ operationToSave: data.value });
  }

  pickStatusToSave(e, data) {
    this.setState({ statusSelected: data.value,savedChange:true });
  }
  closeModalConfig() {
    if (this.state.saved) {
      this.getRetails();
    }
    this.setState({
      showModalConfig: false,
      statusSelected: "",
      filesToSave: {},
      savedChange: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      showMessageStatusSuccess: false,
      saved: false,
      addFile: true,
    });
  }

  onFilesChange(files) {
    if (files !== undefined && files.length > 0) {
      if (files[0].extension !== "pdf") {
        if (files[0].size > 500000) {
          var object = {
            img: files[0].preview.url,
            name: files[0].name,
            type: files[0].type,
            extension: files[0].extension,
            file: files[0],
          };
          let ex = String(files[0].extension);
          this.newresice(
            files[0],
            ex.toLocaleUpperCase(),
            "fileToSave",
            object
          );
          this.setState({
            fileImg: files[0].preview.url,
            addFile: false,
          });
        } else {
          var object = {
            img: files[0].preview.url,
            name: files[0].name,
            type: files[0].type,
            extension: files[0].extension,
            file: files[0],
          };
          this.setState({
            fileToSave: object,
            fileImg: files[0].preview.url,
            addFile: false,
          });
        }
      } else {
        var object = {
          img: files[0].preview.url,
          name: files[0].name,
          type: files[0].type,
          extension: files[0].extension,
          file: files[0],
        };
        this.setState({
          fileToSave: object,
          fileImg: files[0].preview.url,
          addFile: false,
        });
      }
    }
  }
  newresice(file, type, target, ob) {
    Resizer.imageFileResizer(
      file,
      1024,
      678,
      type,
      70,
      0,
      (uri) => {
        var end = new File([uri], ob.name, {
          type: ob.type,
          lastModified: Date.now(),
        });
        ob.file = end;
        this.setState({ [target]: ob });
        //  //console.log(uri, ob);
      },
      "blob"
    );
  }
  onRemoveFile(e, data) {
    console.log("onRemoveFile",this.fileRef.current)
   // this.fileRef.current.removeFiles();
    this.setState({
      fileToSave: {},
      fileImg: id,
      addFile: true,
    });
  }
  handleCurrency(e, data) {
    let operationsTypeArray = [];
    let typeAvailable = this.state.operationTypeRetail.filter(function (
      element
    ) {
      return element.currency === data.value;
    });
    if (typeAvailable.length === 0) {
      operationsTypeArray = [
        { key: "SELL_BALANCE", value: "SELL_BALANCE", text: "Vender saldo" },
        {
          key: "BUY_BALANCE",
          value: "BUY_BALANCE",
          text: "Comprar saldo",
        },
      ];
    } else if (typeAvailable.length === 2) {
      operationsTypeArray = [];
      this.setState({
        viewMessage: true,
        colorMessage: "red",
        textMessage: "No hay operaciones disponibles para esta moneda",
      });
      setTimeout(() => {
        this.setState({
          viewMessage: false,
          colorMessage: "",
          textMessage: "",
        });
      }, 5000);
    } else {
      let operation = typeAvailable.find(function (value) {
        return value.type === "SELL_BALANCE";
      });
      if (operation !== undefined) {
        operationsTypeArray = [
          {
            key: "BUY_BALANCE",
            value: "BUY_BALANCE",
            text: "Comprar saldo",
          },
        ];
      } else {
        operationsTypeArray = [
          { key: "SELL_BALANCE", value: "SELL_BALANCE", text: "Vender saldo" },
        ];
      }
    }
    this.setState({
      currencySelected: data.value,
      operationsType: operationsTypeArray,
    });
  }
  handleCancelCustomize() {
    this.setState({ load: true });
    let array = [];
    let arrayNoFormat = [];
    retails.getListRetails().then((resp) => {
      for (let retail of resp.data) {
        let ob = {
          id: retail.id,
          title: retail.title,
          description: retail.description,
          currencies: retail.currencies,
        };

        array.push(ob);
        arrayNoFormat.push(retail);
      }
      this.setState({ dataFormat: array, data: arrayNoFormat, load: false });
    });
    this.setState({
      showCustomizeRetail: false,
      rolSeleted: {
        id: "",
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        functionsAvailables: [],
      },
    });
  }
  fileChangedHandlerError(error) {
    if (error.code === 1) {
      this.setState({
        messageErrorAdjuntar: true,
        message: "Tipo de archivo no soportado",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    } else {
      this.setState({
        messageErrorAdjuntar: true,
        message: "Tamaño de archivo excede el permitido",
      });
      setTimeout(() => {
        this.setState({ messageErrorAdjuntar: false, message: "" });
      }, 5000);
    }
  }
  saveFilesRetail() {
    let formData = new FormData();
    formData.append("attachment", this.state.fileToSave.file);
    formData.append("retailId", this.state.retailSelected.id);
    this.setState({ load: true });
    retails
      .addAttachmentRetail(formData)
      .then((resp) => {
        this.setState({ load: false });
        console.log(resp);
        if (resp.status === 200) {
          this.setState({
            viewMessage: true,
            textMessage: "Archivo agregado exitosamente",
            colorMessage: "green",
            fileImg: id,
            addFile: true,
            savedChange: true,
            fileToSave: {},
            attachmentRetailSelected: [
              ...this.state.attachmentRetailSelected,
              this.state.fileToSave.file.preview.url,
            ],
          });
          setTimeout(() => {
            this.setState({ viewMessage: false, textMessage: "" });
          }, 5000);
        } else {
          this.setState({
            viewMessage: true,
            textMessage:
              "Disculpe ha ocurrido un error inesperado intente mas tarde",
            color: "red",
            fileImg: id,
            fileToSave: {},
          });
          setTimeout(() => {
            this.setState({ viewMessage: false, textMessage: "", color: "" });
          }, 5000);
        }
      })
      .catch((error) => {
        this.setState({
          viewMessage: true,
          textMessage:
            "Disculpe ha ocurrido un error inesperado intente mas tarde",
          color: "red",
          fileImg: id,
          fileToSave: {},
        });
        setTimeout(() => {
          this.setState({ viewMessage: false, textMessage: "", color: "" });
        }, 5000);
        this.setState({ load: false });
        console.log(error);
      });
  }
  saveChangeStatus() {
    let body = {
      id: this.state.retailSelected.id,
      mcRetailCreateStatus: this.state.statusSelected,
    };
    this.setState({ load: true });
    retails
      .changeStatusCreationRetail(body)
      .then((resp) => {
        this.setState({ load: false });
        console.log(resp.data);
        if (resp.data === "OK") {
          this.setState({
            showMessageStatusSuccess: true,
            textMessage: "Cambios realizados exitosamente",
            saved: true,
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              textMessage: "",
              showMessageStatusSuccess: false,
            });
          }, 5000);
        } else {
          this.setState({
            viewMessage: true,
            textMessage: resp.data,
            colorMessage: "red",
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              textMessage: "",
              colorMessage: "",
            });
          }, 5000);
        }
      })
      .catch((error) => {
        this.setState({ load: false });
        console.log(error);
      });
  }
  saveOperationCurrency() {
    this.setState({
      viewMessage: true,
      textMessage: "Cambios realizados exitosamente",
      colorMessage: "green",
    });
    setTimeout(() => {
      this.setState({ viewMessage: false, textMessage: "", colorMessage: "" });
      this.closeModalOperationsType();
      this.getRetails();
    }, 5000);
  }
  addCurrencyOperation() {
    for (let i = 0; i < this.state.operationToSave.length; i++) {
      let body = {
        id: this.state.retailSelected.id,
        currency: this.state.currencySelected,
        mcRetailOperationType: this.state.operationToSave[i],
      };
      let operation = {
        currency: this.state.currencySelected,
        type: this.state.operationToSave[i],
      };
      this.setState({ loadModal: true });
      retails
        .addCurrencyOperationType(body)
        .then((resp) => {
          this.setState({ loadModal: false });
          if (resp.data === "OK") {
            this.setState({
              viewMessage: true,
              colorMessage: "green",
              textMessage: "Operación agregada exitosamente",
              savedChange: true,
              operationTypeRetail: [
                ...this.state.operationTypeRetail,
                operation,
              ],
            });
            setTimeout(() => {
              this.setState({
                viewMessage: false,
                operationToSave: [],
                currencySelected: "",
                showFormOperationType: false,
                colorMessage: "",
                textMessage: "",
              });
            }, 5000);
          } else if (resp.data === "RETAIL ID DOES NOT EXIST") {
            this.setState({
              viewMessage: true,
              colorMessage: "red",
              textMessage: "",
            });
            setTimeout(() => {
              this.setState({
                viewMessage: false,
                operationToSave: [],
                currencySelected: "Este Punto de intercambio no existe",
                showFormOperationType: false,
                colorMessage: "",
                textMessage: "",
              });
            }, 5000);
          } else {
            this.setState({
              viewMessage: true,
              colorMessage: "red",
              textMessage: resp.data,
            });
            setTimeout(() => {
              this.setState({
                viewMessage: false,
                operationToSave: [],
                currencySelected: "",
                showFormOperationType: false,
                colorMessage: "",
                textMessage: "",
              });
            }, 5000);
          }
        })
        .catch((error) => {
          this.setState({ loadModal: false });
        });
    }
  }
  removeOperation(operation) {
    let body = {
      id: this.state.retailSelected.id,
      currency: operation.currency,
      mcRetailOperationType: operation.type,
    };
    this.setState({ loadModal: true });
    retails
      .removeCurrencyOperationType(body)
      .then((resp) => {
        this.setState({ loadModal: false });
        if (resp.data === "OK") {
          let operationAvailable = this.state.operationTypeRetail.filter(
            function (element) {
              return (
                element.currency !== operation.currency ||
                element.type !== operation.type
              );
            }
          );
          this.setState({
            viewMessage: true,
            colorMessage: "green",
            textMessage: "Operación eliminada exitosamente",
            operationTypeRetail: operationAvailable,
            savedChange: true,
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              colorMessage: "",
              textMessage: "",
            });
          }, 5000);
        } else {
          this.setState({
            viewMessage: true,
            colorMessage: "red",
            textMessage: resp.data,
          });
          setTimeout(() => {
            this.setState({
              viewMessage: false,
              colorMessage: "",
              textMessage: "",
            });
          }, 5000);
        }
      })
      .catch((error) => {
        this.setState({ loadModal: false });
      });
  }
  render() {
   console.log("render",this.fileRef.current)
    let labelMessageErrorAdjunto, messageToShow, messageStatus;
    if (this.state.messageErrorAdjuntar) {
      labelMessageErrorAdjunto = (
        <Message color="red">{this.state.message}</Message>
      );
    }
    if (this.state.viewMessage) {
      messageToShow = (
        <Message color={this.state.colorMessage}>
          {this.state.textMessage}
        </Message>
      );
    }
    if (this.state.showMessageStatusSuccess) {
      messageStatus = <Message color="green">{this.state.textMessage}</Message>;
    }
    const operationsTypeTableHeaders = [
      {
        Header: "Moneda",
        accessor: "currency",
      },
      {
        Header: "Tipo de operación",
        accessor: "type",
        Cell: (row) => {
          if (row.value === "BUY_BALANCE") {
            return "Comprar saldo";
          } else if (row.value === "SELL_BALANCE") {
            return "Vender Saldo";
          } else {
            return row.value;
          }
        },
      },
      {
        width: 80,
        Cell: (row) => (
          <div>
            <Button
              icon="x"
              circular
              compact
              size="large"
              color="red"
              id={row.original.id}
              name="operationType"
              title="Eliminar operación"
              onClick={() => this.removeOperation(row.original)}
            />
          </div>
        ),
      },
    ];
    const currensTableHeaders = [
      {
        Header: "id",
        filterable: true,
        accessor: "id",
        width: 120,
        Cell: (row) => {
          return row.value.slice(-8);
        },
      },
      {
        Header: "Titulo",
        accessor: "title",
        filterable: true,
        width: 200,
      },
      { Header: "Descripcion", accessor: "description" },
      {
        Header: "Tipo",
        accessor: "typeRequest",
        Cell: (row) => {
          if (row.value) {
            return "Básico";
          } else {
            return "Profesional";
          }
        },
      },
      {
        Header: "Usuario",
        filterable: true,
        accessor: "username",
        width: 100,
      },
      {
        Header: "Moneda",
        filterable: true,
        accessor: "currenciesShow",
        width: 100,
      },
      {
        Header: "Estatus",
        filterable: true,
        accessor: "statusCreate",
        width: 100,
        Cell: (row) => {
          if (row.value === "SENDED") {
            return "ENVIADO";
          } else if (row.value === "ANALYSING") {
            return "ANALIZANDO";
          } else if (row.value === "ACTIVATED") {
            return "APROBADO";
          } else if (row.value === "FAILED") {
            return "RECHAZADO";
          } else {
            return row.value;
          }
        },
      },
      {
        Header: "Acciones",
        width: 100,
        Cell: (row) => (
          <div>
            <Button
              icon="cog"
              circular
              compact
              size="large"
              color="blue"
              id={row.original.id}
              name="configRetail"
              title="Configurar"
              onClick={() => this.handleModalConfig(row.original)}
            />
            {row.original.statusCreate === "ACTIVATED" && !row.original.typeRequest &&(
              <Button
                icon="exchange"
                circular
                compact
                size="large"
                color="blue"
                id={row.original.id}
                name="operationType"
                title="Gestionar Operaciones"
                onClick={() => this.handleModalOperationsType(row.original)}
              />
            )}
          </div>
        ),
      },
    ];

    return (
      <div>
        <Grid>
          <Grid.Column largeScreen={16} mobile={16} computer={16} tablet={16}>
            <Segment color="orange" loading={this.state.load}>
              <ReactTable
                className="rolTable"
                data={this.state.dataFormat}
                columns={currensTableHeaders}
                defaultPageSize={5}
                previousText="Anterior"
                nextText="Siguiente"
                loadingText="Cargando..."
                noDataText="No hay puntos de intercambio"
                pageText="Página"
                ofText="de"
                rowsText="filas"
                pageJumpText="ir a la página"
                rowsSelectorText="filas por página"
                minRow={5}
                defaultFilterMethod={(filter, row, column) => {
                  const id = filter.pivotId || filter.id;
                  return row[id] !== undefined
                    ? String(row[id]).startsWith(filter.value.toUpperCase())
                    : true;
                }}
              />
              <Divider hidden />
              {/* <Button
                floated="right"
                color="blue"
                onClick={() => this.handleCustomizeRetail.bind(this)}
              >
                Crear Retail
              </Button> */}
              <Divider hidden />
              <Divider hidden />
            </Segment>
          </Grid.Column>
        </Grid>

        <Modal
          open={this.state.showModalConfig}
          onClose={this.closeModalConfig.bind(this)}
        >
          <Header content="Configurar Punto de Intercambio" />
          <Modal.Content>
            <Segment basic loading={this.state.load}>
              {messageStatus}
              {messageToShow}
              <Form>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Id</label>
                    <p>{this.state.retailSelected.id}</p>
                  </Form.Field>
                  <Form.Field>
                    <label>Título</label>
                    <p>{this.state.retailSelected.title}</p>
                  </Form.Field>
                  <Form.Field>
                    <label>Descripción</label>
                    <p>{this.state.retailSelected.description}</p>
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Correo electrónico</label>
                    <p>{this.state.retailSelected.email}</p>
                  </Form.Field>
                  <Form.Field>
                    <label>Estado actual</label>
                    {this.state.retailSelected.statusCreate === "SENDED" && (
                      <p>ENVIADO</p>
                    )}
                    {this.state.retailSelected.statusCreate === "ACTIVATED" && (
                      <p>APROBADO</p>
                    )}
                    {this.state.retailSelected.statusCreate === "FAILED" && (
                      <p>RECHAZADO</p>
                    )}
                    {this.state.retailSelected.statusCreate === "ANALYSING" && (
                      <p>ANALIZANDO</p>
                    )}
                  </Form.Field>
                </Form.Group>
                <Divider />
                <Form.Field>
                  {this.state.attachmentRetailSelected.length > 0 &&
                    this.state.attachmentRetailSelected.map((item, index) => (
                      <List horizontal>
                        <List.Item key={index}>
                          <Image
                            src={item}
                            size="small"
                            as="a"
                            style={{
                              marginLeft: "1em",
                              maxWidth: " 70px",
                              maxHeight: "160px",
                            }}
                          />
                        </List.Item>
                      </List>
                    ))}
                  {this.state.retailSelected.statusCreate === "ANALYSING" &&
                    !this.state.addFile && (
                      <Header textAlign="center">
                        <img
                          alt=""
                          src={this.state.fileImg}
                          className="imageFileV"
                        />
                        {this.state.fileToSave.name !== undefined && (
                          <p style={{ fontSize: "11px" }}>
                            {this.state.fileToSave.name}
                          </p>
                        )}
                        {!this.state.addFile && (
                          <div>
                            <Button
                              color="blue"
                              size="tiny"
                              onClick={this.onRemoveFile.bind(this)}
                            >
                              Cambiar
                            </Button>
                            <Button
                              color="blue"
                              size="tiny"
                              onClick={this.saveFilesRetail.bind(this)}
                            >
                              Subir
                            </Button>
                          </div>
                        )}
                      </Header>
                    )}
                </Form.Field>
                {this.state.retailSelected.statusCreate === "ANALYSING" && this.state.addFile ===true && (
                  <div>
                    <Form.Field width={6}>
                      {labelMessageErrorAdjunto}
                    </Form.Field>
                    <Form.Field>
                      <Files
                        ref={this.fileRef}
                        onChange={this.onFilesChange.bind(this)}
                        onError={this.fileChangedHandlerError.bind(this)}
                        accepts={["image/*", ".pdf"]}
                        multiple
                        maxFiles={5}
                        maxFileSize={500000}
                        minFileSize={0}
                        clickable={this.state.addFile}
                      >
                        <Button size="medium" color="blue">
                          Agregar adjunto
                        </Button>
                      </Files>
                    </Form.Field>
                    <Divider />
                  </div>
                 )} 
                {/* {(this.state.retailSelected.statusCreate !== "ANALYSING" ||
                  this.state.savedChange) && ( */}
                  <Form.Field
                    width={8}
                    control={Select}
                    options={this.state.statusCreated}
                    value={this.state.statusSelected}
                    onChange={this.pickStatusToSave.bind(this)}
                    label="Cambiar estatus"
                    placeholder="Seleccione un estado"
                    search
                  />
                {/* )} */}
              </Form>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.saved && (
              <Button
                disabled={this.state.load}
                color="grey"
                onClick={this.closeModalConfig.bind(this)}
              >
                Cancelar
              </Button>
            )}
            {!this.state.saved && (
              <Button
                color="blue"
                onClick={this.saveChangeStatus.bind(this)}
                disabled={
                  this.state.retailSelected.statusCreate === "ANALYSING"
                    ? this.state.statusSelected === "" ||
                      !this.state.savedChange
                    : this.state.statusSelected === ""
                }
              >
                Guardar
              </Button>
            )}
            {this.state.saved && (
              <Button color="grey" onClick={this.closeModalConfig.bind(this)}>
                Cerrar
              </Button>
            )}
          </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.showModalOperationsType}
          onClose={this.closeModalOperationsType.bind(this)}
        >
          <Header content="Gestionar operaciones" />
          <Modal.Content>
            <Segment basic loading={this.state.loadModal}>
              {messageToShow}
              {this.state.showFormOperationType && (
                <div>
                  <Form>
                    <Form.Group>
                      <Form.Field
                        width={8}
                        control={Dropdown}
                        options={this.state.currenciesToAdd}
                        label="Moneda"
                        placeholder="Seleccione una moneda"
                        onChange={this.handleCurrency.bind(this)}
                        search
                      />

                      {this.state.currencySelected !== "" &&
                        this.state.operationsType.length !== 0 && (
                          <Form.Field>
                            <label>Tipo de operación</label>
                            <Select
                              multiple
                              placeholder="Seleccione tipo de operación"
                              value={this.state.operationToSave}
                              options={this.state.operationsType}
                              onChange={this.pickOperationToSave.bind(this)}
                            />
                          </Form.Field>
                        )}
                    </Form.Group>
                  </Form>
                  <Button
                    disabled={this.state.load}
                    color="blue"
                    onClick={this.addCurrencyOperation.bind(this)}
                  >
                    Agregar
                  </Button>
                  <Divider hidden />
                </div>
              )}

              {!this.state.showFormOperationType && (
                <Button
                  disabled={this.state.load}
                  color="blue"
                  onClick={() => {
                    this.setState({ showFormOperationType: true });
                  }}
                >
                  Agregar tipo de operación
                </Button>
              )}
              <Divider />
              <Grid>
                <Grid.Column
                  largeScreen={16}
                  mobile={16}
                  computer={16}
                  tablet={16}
                >
                  <Segment color="orange" loading={this.state.load}>
                    <ReactTable
                      className="rolTable"
                      data={this.state.operationTypeRetail}
                      columns={operationsTypeTableHeaders}
                      defaultPageSize={5}
                      previousText="Anterior"
                      nextText="Siguiente"
                      loadingText="Cargando..."
                      noDataText="No hay operaciones"
                      pageText="Página"
                      ofText="de"
                      rowsText="filas"
                      pageJumpText="ir a la página"
                      rowsSelectorText="filas por página"
                      minRow={5}
                      defaultFilterMethod={(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        return row[id] !== undefined
                          ? String(row[id]).startsWith(
                              filter.value.toUpperCase()
                            )
                          : true;
                      }}
                    />
                  </Segment>
                </Grid.Column>
              </Grid>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.saved && (
              <Button
                disabled={this.state.load}
                color="grey"
                onClick={this.closeModalOperationsType.bind(this)}
              >
                Cancelar
              </Button>
            )}
            {!this.state.saved && (
              <Button
                color="blue"
                disabled={!this.state.savedChange}
                onClick={this.saveOperationCurrency.bind(this)}
              >
                Guardar
              </Button>
            )}
            {this.state.saved && (
              <Button
                color="grey"
                onClick={this.closeModalOperationsType.bind(this)}
              >
                Cerrar
              </Button>
            )}
          </Modal.Actions>
        </Modal>

        {/* <ModalCustomize
          data={this.state.data}
          show={this.state.showCustomizeRetail}
          retailSeleted={this.state.retailSelected}
          cancel={this.handleCancelCustomize.bind(this)}
        /> */}
      </div>
    );
  }
}

export default ListRetails;
