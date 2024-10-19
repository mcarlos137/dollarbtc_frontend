import React, { Component } from "react";
import {
  Segment,
  Modal,
  List,
  Grid,
  Form,
  Label,
  Button,
  Card,
  Icon,
  Dropdown,
  Message,
} from "semantic-ui-react";
import funct from "../../../common/functions";
import user from "../../../services/user";
class ModalCustomize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listFunctions: funct.geList(),
      setFuntions: [],
      rolFunctions: [],
      name: null,
      sendPost: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      loadForm: false,
    };
    this.mapFunctions = new Map();
    this.mapFunctions = funct.getMap();
    this.traslateMap = new Map();
    this.traslateMap = funct.getFunctionsSpanish();
  }
  componentDidMount() {}
  componentDidUpdate(nexProps) {
    if (
      this.props.rolSeleted.name !== undefined &&
      this.props.rolSeleted.functionsAvailables !== undefined
    ) {
      if (this.props.rolSeleted.name !== "" && this.state.name === null) {
        this.setState({ name: this.props.rolSeleted.name });
        let arrayFun = [],
          arraySub = [];
        for (let data of this.props.rolSeleted.functionsAvailables) {
          let ob = {
            name: "",
            values: [],
            list: [],
          };
          if (this.mapFunctions.has(data)) {
            ob.name = data;
            let array = this.mapFunctions.get(data);
            for (let value of array) {
              if (
                this.props.rolSeleted.functionsAvailables.indexOf(value) !== -1
              ) {
                ob.values.push(value);
              }
              let subfuction = {};
              subfuction.key = value;
              subfuction.value = value;
              if (this.traslateMap.has(value) === true) {
                subfuction.text = this.traslateMap.get(value);
              } else {
                subfuction.text = value;
              }
              ob.list.push(subfuction);
            }
            arrayFun.push(data);
            arraySub.push(ob);
          }
        }
        this.setState({
          setFuntions: arraySub,
          rolFunctions: arrayFun,
        });
      }
    }
  }
  handleNameRol(e, data) {
    this.setState({ name: e.target.value });
  }
  handleChange(e, { value }) {
    let newValues = [];
    for (let val of value) {
      if (this.state.setFuntions.indexOf(val) === -1) {
        let ob = {
          name: "",
          values: [],
          list: [],
        };

        let arr = this.mapFunctions.get(val);
        if (arr.length > 0) {
          for (let sub of arr) {
            let subfuction = {};
            subfuction.key = sub;
            subfuction.value = sub;
            if (this.traslateMap.has(sub) === true) {
              subfuction.text = this.traslateMap.get(sub);
            } else {
              subfuction.text = sub;
            }
            ob.values.push(sub);
            ob.list.push(subfuction);
          }
        }

        ob.name = val;
        newValues.push(ob);
      }
    }

    this.setState({
      rolFunctions: value,
      setFuntions: newValues,
    });
  }
  handleFuctionChange(e, { value, name }) {
    let newValues = [];
    for (let item of this.state.setFuntions) {
      let ob = {
        name: "",
        values: [],
        list: [],
      };
      if (item.name === name) {
        for (let val of value) {
          ob.name = name;
          ob.values.push(val);
        }
        for (let l of item.list) {
          ob.list.push(l);
        }
      } else {
        ob.name = item.name;
        for (let val of item.values) {
          ob.values.push(val);
        }
        for (let l of item.list) {
          ob.list.push(l);
        }
      }
      newValues.push(ob);
    }
    console.log("newValues", newValues);
    this.setState({
      setFuntions: newValues,
    });
  }
  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
  handleSearchFunctionChange = (e, { searchQueryFunction }) =>
    this.setState({ searchQueryFunction });
  cancelCustomize() {
    this.setState({
      setFuntions: [],
      rolFunctions: [],
      name: null,
      textMessage: "",
      viewMessage: false,
      colorMessage: "",
      sendPost: false,
    });
    this.props.cancel();
  }
  confirmCustomize() {
    if (this.state.name !== "" && this.state.setFuntions.length > 0) {
      let array = [];
      for (let funtions of this.state.setFuntions) {
        array.push(funtions.name);
        for (let subFun of funtions.values) {
          array.push(subFun);
        }
      }
      let body = {
        name: this.state.name,
        functionsAvailables: array,
      };
      this.setState({ loadForm: true });
      user
        .createRol(body)
        .then((resp) => {
          if (resp.data.payload) {
            this.setState({
              viewMessage: true,
              textMessage: "El rol ha sido creado exitosamente",
              colorMessage: "blue",
              sendPost: true,
              loadForm: false,
            });
          } else {
            this.setState({
              viewMessage: true,
              textMessage: "El nombre del rol ya esta en uso seleccione otro",
              colorMessage: "red",
              loadForm: false,
            });
            setTimeout(() => {
              this.setState({
                viewMessage: false,
                textMessage: "",
                colorMessage: "",
              });
            }, 8000);
          }
        })
        .catch((error) => {
          this.setState({
            viewMessage: true,
            textMessage:
              "Disculpe ha ocurrido un error en la conexión intente mas tarde",
            colorMessage: "red",
            loadForm: false,
          });
        });
    } else {
      this.setState({
        viewMessage: true,
        textMessage: "Debe incluir todos los datos requeridos",
        colorMessage: "red",
      });
      setTimeout(() => {
        this.setState({
          viewMessage: false,
          textMessage: "",
          colorMessage: "",
        });
      }, 8000);
    }
  }
  updateCustomizeRol() {
    if (this.state.name !== "" && this.state.setFuntions.length > 0) {
      let array = [];
      for (let funtions of this.state.setFuntions) {
        array.push(funtions.name);
        for (let subFun of funtions.values) {
          array.push(subFun);
        }
      }
      let body = {
        id: this.props.rolSeleted.id,
        name: this.state.name,
        functionsAvailables: array,
      };
      this.setState({ loadForm: true });
      user
        .updateRol(body)
        .then((resp) => {
          if (resp.data.payload) {
            this.setState({
              viewMessage: true,
              textMessage: "El rol ha sido actualizado exitosamente",
              colorMessage: "blue",
              sendPost: true,
              loadForm: false,
            });
          } else {
            this.setState({
              viewMessage: true,
              textMessage: "El nombre del rol ya esta en uso seleccione otro",
              colorMessage: "red",
              loadForm: false,
            });
            setTimeout(() => {
              this.setState({
                viewMessage: false,
                textMessage: "",
                colorMessage: "",
              });
            }, 8000);
          }
        })
        .catch((error) => {
          this.setState({
            viewMessage: true,
            textMessage:
              "Disculpe ha ocurrido un error en la conexión intente mas tarde",
            colorMessage: "red",
            loadForm: false,
          });
        });
    } else {
      this.setState({
        viewMessage: true,
        textMessage: "Debe incluir todos los datos requeridos",
        colorMessage: "red",
      });
      setTimeout(() => {
        this.setState({
          viewMessage: false,
          textMessage: "",
          colorMessage: "",
        });
      }, 8000);
    }
  }
  deleteSubFunctions(e, data) {
    let array = [];
    for (let funt of this.state.setFuntions) {
      if (funt.values.indexOf(e.target.id) === -1) {
        array.push(funt);
      } else {
        funt.values.splice(funt.values.indexOf(e.target.id), 1);
        let newOb = {
          name: funt.name,
          values: funt.values,
        };
        array.push(newOb);
      }
    }
    this.setState({ setFuntions: array });
  }
  render() {
    if (this.props.rolSeleted.name === "") {
      return (
        <Modal open={this.props.show} size={"large"}>
          <Modal.Content>
            <Segment basic loading={this.state.loadForm}>
              <Grid>
                <Grid.Row column={1}>
                  <Grid.Column>
                    <label>Nombre del rol</label>
                    <Form>
                      <Form.Group inline>
                        <Form.Input
                          width={4}
                          name="name-rol"
                          value={this.state.name}
                          onChange={this.handleNameRol.bind(this)}
                        />
                        <Dropdown
                          placeholder="Funciones"
                          multiple
                          search
                          selection
                          onChange={this.handleChange.bind(this)}
                          onSearchChange={this.handleSearchChange.bind(this)}
                          value={this.state.rolFunctions}
                          options={this.state.listFunctions}
                        />
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Card.Group>
                    {this.state.setFuntions.map((item, i) => (
                      <Card width={4} key={i}>
                        <Card.Content>
                          <Card.Header>
                            Función{" "}
                            {this.traslateMap.has(item.name)
                              ? this.traslateMap.get(item.name)
                              : item.name}
                          </Card.Header>
                          <br />
                          <Card.Description>
                            <p>Sub-funciones</p>{" "}
                            <List>
                              {item.values.map((val, j) => (
                                <List.Item key={j}>
                                  <Label color="blue">
                                    {this.traslateMap.has(val)
                                      ? this.traslateMap.get(val)
                                      : val}
                                    <Icon
                                      name="delete"
                                      id={val}
                                      onClick={this.deleteSubFunctions.bind(
                                        this
                                      )}
                                    />
                                  </Label>
                                </List.Item>
                              ))}
                            </List>
                          </Card.Description>
                        </Card.Content>
                      </Card>
                    ))}
                  </Card.Group>
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
    } else {
      return (
        <Modal open={this.props.show} size="large">
          <Modal.Content>
            <Segment basic loading={this.state.loadForm}>
              <Grid>
                <Grid.Row column={1}>
                  <Grid.Column>
                    <label>Nombre del rol</label>
                    <Form>
                      <Form.Group inline>
                        <Form.Input
                          width={4}
                          name="name-rol"
                          value={this.state.name}
                          onChange={this.handleNameRol.bind(this)}
                        />
                        <Dropdown
                          placeholder="Funciones"
                          multiple
                          search
                          selection
                          onChange={this.handleChange.bind(this)}
                          onSearchChange={this.handleSearchChange.bind(this)}
                          value={this.state.rolFunctions}
                          options={this.state.listFunctions}
                        />
                      </Form.Group>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Card.Group>
                    {this.state.setFuntions.map((item, i) => (
                      <Card width={4} key={i}>
                        <Card.Content>
                          <Card.Header>
                            Función{" "}
                            {this.traslateMap.has(item.name)
                              ? this.traslateMap.get(item.name)
                              : item.name}
                          </Card.Header>
                          <br />
                          <Card.Description>
                            <p>Sub-funciones</p>{" "}
                            {item.list.length === 0 && <Label>No Posee</Label>}
                            {item.list.length > 0 && (
                              <Dropdown
                                style={{ color: "blue" }}
                                placeholder="SubFunciones"
                                multiple
                                search
                                selection
                                onChange={this.handleFuctionChange.bind(this)}
                                onSearchChange={this.handleSearchFunctionChange.bind(
                                  this
                                )}
                                name={item.name}
                                value={item.values}
                                options={item.list}
                              />
                            )}
                          </Card.Description>
                        </Card.Content>
                      </Card>
                    ))}
                  </Card.Group>
                </Grid.Row>
                {this.state.viewMessage && (
                  <Message color={this.state.colorMessage}>
                    {this.state.textMessage}
                  </Message>
                )}
              </Grid>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.sendPost && (
              <Button color="grey" onClick={this.cancelCustomize.bind(this)}>
                Cancelar
              </Button>
            )}
            {this.state.sendPost && (
              <Button color="grey" onClick={this.cancelCustomize.bind(this)}>
                Cerrar
              </Button>
            )}
            {!this.state.sendPost && (
              <Button color="blue" onClick={this.updateCustomizeRol.bind(this)}>
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
