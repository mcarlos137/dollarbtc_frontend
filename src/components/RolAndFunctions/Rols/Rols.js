import React, { Component } from "react";
import ReactTable from "react-table";
import {
  Modal,
  Button,
  Segment,
  Divider,
  Header,
  Grid,
  Message
} from "semantic-ui-react";
import ModalAsignate from "../ModalAsignate/ModalAsignate";
import ModalCustomize from "../ModalCustomize/ModalCustomize";
import funct from "../../../common/functions";
import user from "../../../services/user";
class Rols extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataFormat: [],
      showAsignateModal: false,
      showCustomizeRol: false,
      showDeleleConfirm: false,
      rolSeleted: {
        id: "",
        name: "",
        functionsAvailables: []
      },
      load: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: ""
    };
    this.traslateMap = new Map();
    this.traslateMap = funct.getFunctionsSpanish();
  }
  componentDidMount() {
    this.setState({ load: true });
    let array = [];
    let arrayNoFormat = [];
    user.getAllRols().then(resp => {
      for (let rol of resp.data.payload) {
        let ob = {
          id: rol.id,
          name: rol.name
        };

        let concat = "";
        for (let funt of rol.functionsAvailables) {
          concat = concat + this.traslateMap.get(funt) + " " + ",";
        }
        ob.functionsAvailables = rol.functionsAvailables;
        ob.funtions = concat;
        array.push(ob);
        arrayNoFormat.push(rol);
      }
      // //console.log(array, arrayNoFormat);
      this.setState({ dataFormat: array, data: arrayNoFormat, load: false });
    });
  }
  handleActionButton(e, data) {
    if (data.name === "asignate") {
      let item = this.state.data.find(function(element) {
        return element.id === data.id;
      });
      let selected = {
        id: item.id,
        name: item.name,
        functionsAvailables: item.functionsAvailables
      };
      this.setState({ rolSeleted: selected }, () => {
        this.setState({ showAsignateModal: true });
      });
    }
    if (data.name === "modify") {
      let item = this.state.data.find(function(element) {
        return element.id === data.id;
      });
      let selected = {
        id: item.id,
        name: item.name,
        functionsAvailables: item.functionsAvailables
      };
      this.setState({ rolSeleted: selected }, () => {
        this.setState({ showCustomizeRol: true });
      });
    }
    if (data.name === "delete") {
      let item = this.state.data.find(function(element) {
        return element.id === data.id;
      });
      let selected = {
        id: item.id,
        name: item.name,
        functionsAvailables: item.functionsAvailables
      };
      this.setState({ rolSeleted: selected }, () => {
        this.setState({ showDeleleConfirm: true });
      });
    }
  }
  handleCustomizeRol() {
    this.setState({ showCustomizeRol: true });
  }
  deleteRolConfirm() {
    this.setState({ load: true });
    user
      .deleteRol(this.state.rolSeleted)
      .then(resp => {
        if (resp.data.payload) {
          this.setState({
            load: false,
            sendDelete: true,
            viewMessage: true,
            textMessage: "El rol ha sido eliminado exitosamente",
            colorMessage: "blue"
          });
        } else {
          this.setState({
            load: false,
            sendDelete: true,
            viewMessage: true,
            textMessage: "El rol no se ha podido eliminar intente mas tarde",
            colorMessage: "red"
          });
        }
      })
      .catch(error => {
        //console.log(error);
        this.setState({
          load: false,
          viewMessage: true,
          textMessage: "Ha ocurrido un error de conexión intente de nuevo",
          colorMessage: "red"
        });
        setTimeout(() => {
          this.setState({
            viewMessage: false,
            textMessage: "",
            colorMessage: ""
          });
        }, 8000);
      });
  }
  cancelDelete() {
    this.setState({
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      rolSeleted: {
        id: "",
        name: "",
        functionsAvailables: []
      }
    });
    this.setState({ load: true });
    let array = [];
    let arrayNoFormat = [];
    user.getAllRols().then(resp => {
      for (let rol of resp.data.payload) {
        let ob = {
          id: rol.id,
          name: rol.name
        };

        let concat = "";
        for (let funt of rol.functionsAvailables) {
          concat = concat + this.traslateMap.get(funt) + " " + ",";
        }
        ob.functionsAvailables = rol.functionsAvailables;
        ob.funtions = concat;
        array.push(ob);
        arrayNoFormat.push(rol);
      }
      // //console.log(array, arrayNoFormat);
      this.setState({ dataFormat: array, data: arrayNoFormat, load: false });
    });
    this.setState({ showDeleleConfirm: false });
  }
  handleCancelAsignate() {
    this.setState({ showAsignateModal: false });
    this.setState({
      rolSeleted: {
        id: "",
        name: "",
        functionsAvailables: []
      }
    });
  }
  handleCancelCustomize() {
    this.setState({ load: true });
    let array = [];
    let arrayNoFormat = [];
    user.getAllRols().then(resp => {
      for (let rol of resp.data.payload) {
        let ob = {
          id: rol.id,
          name: rol.name
        };

        let concat = "";
        for (let funt of rol.functionsAvailables) {
          concat = concat + this.traslateMap.get(funt) + " " + ",";
        }
        ob.functionsAvailables = rol.functionsAvailables;
        ob.funtions = concat;
        array.push(ob);
        arrayNoFormat.push(rol);
      }
      //console.log(array, arrayNoFormat);
      this.setState({ dataFormat: array, data: arrayNoFormat, load: false });
    });
    this.setState({
      showCustomizeRol: false,
      rolSeleted: {
        id: "",
        name: "",
        functionsAvailables: []
      }
    });
  }
  render() {
    const currensTableHeaders = [
      {
        Header: "Nombre",
        accessor: "name",
        width: 300
      },
      { Header: "Funciones", accessor: "funtions", width: 650 },
      {
        Header: "Acciónes",
        Cell: row => (
          <div>
            <Button
              icon="bullseye"
              circular
              compact
              size="mini"
              color="blue"
              id={row.original.id}
              name="asignate"
              title="Asignar a operador(s)"
              onClick={this.handleActionButton.bind(this)}
            />
            <Button
              icon="edit"
              circular
              compact
              size="mini"
              color="blue"
              id={row.original.id}
              name="modify"
              title="Editar"
              onClick={this.handleActionButton.bind(this)}
            />
            <Button
              icon="cancel"
              circular
              compact
              size="mini"
              color="blue"
              id={row.original.id}
              name="delete"
              title="Eliminar"
              onClick={this.handleActionButton.bind(this)}
            />
          </div>
        )
      }
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
                noDataText="No hay roles registrados"
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
              <Button
                floated="right"
                color="blue"
                onClick={this.handleCustomizeRol.bind(this)}
              >
                Agregar
              </Button>
              <Divider hidden />
              <Divider hidden />
            </Segment>
          </Grid.Column>
        </Grid>

        <Modal open={this.state.showDeleleConfirm} size="tiny">
          <Header icon="exclamation circle" content="Verificación" />
          <Modal.Content>
            <Segment basic loading={this.state.load}>
              <p>
                Seguro que desea eliminar el Rol, al eliminar el rol también se
                eliminará de los operadores que lo tengan asignado
              </p>
              <p>
                <strong>{this.state.rolSeleted.name}</strong>
              </p>
            </Segment>
            {this.state.viewMessage && (
              <Message color={this.state.colorMessage}>
                {this.state.textMessage}
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            {!this.state.sendDelete && (
              <Button
                disabled={this.state.load}
                color="grey"
                onClick={this.cancelDelete.bind(this)}
              >
                Cancelar
              </Button>
            )}
            {this.state.sendDelete && (
              <Button color="grey" onClick={this.cancelDelete.bind(this)}>
                Cerrar
              </Button>
            )}
            {!this.state.sendDelete && (
              <Button
                disabled={this.state.load}
                color="blue"
                onClick={this.deleteRolConfirm.bind(this)}
              >
                Eliminar
              </Button>
            )}
          </Modal.Actions>
        </Modal>
        <ModalAsignate
          show={this.state.showAsignateModal}
          rolSeleted={this.state.rolSeleted}
          cancelAsig={this.handleCancelAsignate.bind(this)}
        />
        <ModalCustomize
          show={this.state.showCustomizeRol}
          rolSeleted={this.state.rolSeleted}
          cancel={this.handleCancelCustomize.bind(this)}
        />
      </div>
    );
  }
}

export default Rols;
