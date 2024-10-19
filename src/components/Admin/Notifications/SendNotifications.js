import React, { Component } from 'react';
import ReactTable from 'react-table';
import {
  Button,
  Header,
  Segment,
  Grid,
  Form,
  Checkbox,
  Menu,
  Modal,
  Divider,
  Container,
  Icon,
  Popup,
  Message,
  Step,
  Dimmer,
  Loader
} from 'semantic-ui-react';
import userAPI from '../../../services/user';
import notificationsAPI from '../../../services/notifications';
import translate from '../../../i18n/translate';
import countryPrefits from '../../../common/prefits';
import notificationService from "../../../services/notifications";
class SendNotifications extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      title: '',
      description: '',
      loadingForm: true,
      users: [],
      translator: props.translate,
      viewModalConfirm: false,
      responseSendNotification: false,
      currencies: [],
      countryPrefits: [],
      backupUsers: [],
      seletedCurrencies: [],
      viewMessage: false,
      step: 1,
      segmentOption: 1,
      programmingOption: 'now',
      date: '',
      time: '',
      topics: [],
      topicSelected: "",
      selectUser: false,
      notifications: [],
      showConfirmDeleteUserToTable: false,
      userNotification: "",
      loadingModal: false
    };
  }
  componentDidMount() {

    this.getTopics();
    this.getMessages();
  }

   async getTopics() {
      
    let topics = await notificationService.getTopics();
    let topicSelects = topics.data.map(topic => {
      topic.text = topic.name;
      topic.value = topic.id + "__" + topic.name;
      return topic;
    });
    this.setState({
        topics: topicSelects
    });
  
  }

  async getMessages() {
      
    let messages = await notificationService.getMessages();
    this.setState({
        notifications: messages.data,
        loadingForm: false
    });
  
  }

    handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }


  closeViewModalConfirm = () => {
    if(!this.state.responseSendNotification) {
    this.setState({
      viewModalConfirm: false,
    });
  } else{
    this.setState({
      responseSendNotification: false,
      viewModalConfirm: false,
      title: "",
      description: "",
      users: [],
      seletedCurrencies: []
    });
  }
  };

  closeViewModalConfirmDeleteUser() {
    this.setState({
      showConfirmDeleteUserToTable: false
    })
  }

  confirmSendNotification() {
    if (this.state.title !== '') {
      if (this.state.description !== '') {
        if(this.state.segmentOption === 1){
        if (this.state.users.length > 0) {
          this.setState({
            viewModalConfirm: true,
          });
        } else {
          this.setState({ viewMessage: true });
          setTimeout(() => {
            this.setState({ viewMessage: false });
          }, 5000);
        }
      } else {
        if(this.state.topicSelect !== "") {
            this.setState({
              viewModalConfirm: true,
            });
        } else {
          this.setState({ viewMessage: true });
          setTimeout(() => {
            this.setState({ viewMessage: false });
          }, 5000);
        }
      }
      }
    }
  }
  async sendNotification() {
  
    let body;
    this.setState({
     loadingModal: true
    })
    if(this.state.segmentOption === 1){
      body = this.getBodyByUser();
    } else {
      body = this.getBodyByTopic();
    }

    await notificationsAPI.sendMessage(body);

    this.setState({
      responseSendNotification: true,
      step: 1,
      segmentOption: 1,
      loadingModal: false
    });
  }

  getBodyByUser(){

    let tokens = [];

    this.state.users.map((user) => {
      tokens.push(user.username);
    });
    
    let body = {
      "userNames": tokens,
      "title": this.state.title,
      "content":this.state.description
    };

    return body;

  }

   getBodyByTopic(){

    let body =  {
    "topicId": this.state.topicSelected.split("__")[0],
    "title": this.state.title,
    "content": this.state.description
    };

    return body;
    
  }

  handleTitle(e, data) {
    this.setState({ title: data.value });
  }

  handleDescription(e, data) {
    this.setState({ description: data.value });
  }
  handleChangeCurrencies(e, { value }) {
    this.setState({ seletedCurrencies: value }, () => {
      if (this.state.seletedCurrencies.length === 0) {
        let array = [];
        for (let user of this.state.backupUsers) {
          user.checked = false;
          array.push(user);
        }
        this.setState({ users: array });
      } else {
        this.filterByCountry();
      }
    });
  }
  setTopic(e, { value }) {
    this.setState({ topicSelected: value })
  }

  handleProgramming(e, data) {
    console.log('data.value');
    this.setState({ programmingOption: data.value });
  }

   handleBirtdate(e, data) {
    this.setState({ birtdate: e.target.value });
  }
  
  validateForm(){
  return this.state.title === "" 
  || this.state.description === ""
  || (this.state.segmentOption === 1 && !this.state.users.length > 0) 
  || (this.state.segmentOption === 2 && this.state.topicSelected === "") 
  }
 

  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });
  filterByCountry() {
    let elements = [];
    for (let code of this.state.seletedCurrencies) {
      let filterArray = this.state.backupUsers.filter((user) => {
        return code === user.countryCode;
      });
      for (let user of filterArray) {
        user.checked = true;
        elements.push(user);
      }
    }
    this.setState({ users: elements });
  }

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

  handleUserNotification(e, data) {
    this.setState({ userNotification: data.value });
  }

  async addUserNotification(){
    this.setState({loadingForm: true});
    let user = await userAPI.getConfigUserGeneral(this.state.userNotification);
    if(user.data.result.name){
      let userToAdd = {
        username: user.data.result.name,
        firstName: user.data.result.firstName ? user.data.result.firstName : "No posee",
        lastName: user.data.result.lastName ? user.data.result.lastName : "No posee",
        phone: user.data.result.phone ? user.data.result.phone : "No posee",
        email: user.data.result.email ? user.data.result.email : "No posee",
      };
      this.setState({
        users: [...this.state.users,userToAdd],
        loadingForm: false,
        userNotification: ""
      })
      this.state.users.push();
    } else {
				this.setState({ userNotFound: true, loadingForm: false, userNotification: "" }, () => {
					setTimeout(() => {
						this.setState({
							userNotFound: false,
							userNotification: "",
						});
					}, 5000);
				});
  }
}

showModalConfirmDelete(data) {
 this.setState({
   showConfirmDeleteUserToTable: true,
   userToDelete: data.username
 })
}

deleteUserOfTable() {
  this.setState({loadingModal: true});
  let userFiltered = this.state.users.filter((user) => 
    user.username !== this.state.userToDelete
  );
  this.setState({
    users: userFiltered,
    showConfirmDeleteUserToTable: false,
    loadingModal: false
  })
  
}

  render() {
    let t = this.state.translator;
    const userTableHeaders = [
      {
        Header: 'Nombre de usuario',
        accessor: 'username',
        filterable: true,
      },
      {
        Header: 'Nombre',
        accessor: 'firstName',
        filterable: true,
      },
      {
        Header: 'Apellido',
        accessor: 'lastName',
        filterable: true,
      },
      {
        Header: 'Teléfono',
        accessor: 'phone',
        filterable: true,
      },
      {
        Header: 'Email',
        accessor: 'email',
        filterable: true,
      },
       {
        Header: "Acciones",
        width: 100,
        Cell: (row) => (
          <div>
            <Button
              icon="remove"
              circular
              compact
              size="large"
              color="blue"
              id={row.original.id}
              name="deleteUser"
              title="Quitar"
              onClick={() => this.showModalConfirmDelete(row.original)}
            />
            </div>)
       }
            
    ];

      const messagesTableHeaders = [
      {
        Header: 'Título',
        accessor: 'title',
        filterable: true,
      },
      {
        Header: 'Contenido',
        accessor: 'content',
        filterable: true,
      },
      {
        Header: 'Alcance',
        accessor: 'userNamesCount',
        width: 100,
      },
      {
        Header: 'Fecha',
        accessor: 'timestamp',
        filterable: true,
        width: 200,
        Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
      },
    ];

    return (
      <Segment basic loading={this.state.loadingForm}>
         <Step.Group ordered>
          <Step active={this.state.step === 1} completed={this.state.step === 2 || this.state.step === 3}>
            <Step.Content>
              <Step.Title>Notificación</Step.Title>
              <Step.Description>Datos de la notificación</Step.Description>
            </Step.Content>
          </Step>

    <Step active={this.state.step === 2} completed={this.state.step === 3}>
      <Step.Content>
        <Step.Title>Envio</Step.Title>
        <Step.Description>Segmentación y envío</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
  {this.state.step === 1 && (<Grid>
          <Grid.Column largeScreen={16} mobile={16} tablet={16}>
            <Grid.Row>
              <Form>
                <Form.Field required>
                  <Form.Input
                    fluid
                    label='Título'
                    placeholder='Título'
                    value={this.state.title}
                    onChange={this.handleTitle.bind(this)}
                  />
                </Form.Field>
                <Form.Field required>
                  <Form.TextArea
                    fluid
                    label='Descripción'
                    placeholder='Descripción'
                    value={this.state.description}
                    onChange={this.handleDescription.bind(this)}
                  />
                </Form.Field>
                  <Button onClick={()=>{this.setState({step: 2})}}>
                    Siguiente
                  </Button>
            
              </Form>
            </Grid.Row>
            <Grid.Row style={{paddingTop: 25}}>
              <div style={{paddingBottom: 20}}>
              <label>Historial de notificaciones</label>
              </div>
             <ReactTable
                    data={this.state.notifications}
                    columns={messagesTableHeaders}
                    defaultPageSize={5}
                    previousText='Anterior'
                    nextText='Siguiente'
                    loadingText='Cargando...'
                    noDataText='No hay notificaciones registradas'
                    pageText='Página'
                    ofText='de'
                    rowsText='filas'
                    pageJumpText='ir a la página'
                    rowsSelectorText='filas por página'
                    minRow={5}
                  />
              </Grid.Row>
          </Grid.Column>
        </Grid>)}
       {this.state.step === 2 && (<Grid>
          <Grid.Column largeScreen={4} mobile={4} tablet={4}>
            <Grid.Row>
                <Button onClick={()=>{this.setState({segmentOption: 1})}}>
                  Segmento de usuarios
                </Button>
                <Popup content='Puedes seleccionar hasta 100 usuarios' trigger={<Icon name="info" />} />
            </Grid.Row>
          </Grid.Column>
          <Grid.Column largeScreen={10} mobile={10} tablet={10}>
            <Grid.Row>
              <Button style={{paddingLeft: 20}} onClick={()=>{this.setState({segmentOption: 2})}}>
                Temas
              </Button>
            </Grid.Row>
          </Grid.Column>
  <Grid.Column largeScreen={16} mobile={16} tablet={16}>
           
            {this.state.segmentOption === 1 && (<Grid.Row style={{paddingTop: 25}}>
           
                        <Form.Input
                        fluid
                        label={'Usuario a enviar notificación'}
                          value={this.state.userNotification}
                          onChange={this.handleUserNotification.bind(this)}
                        ></Form.Input>
                         {this.state.userNotFound && (<div style={{paddingTop: 20, paddingBottom: 20}}><label style={{color: "red"}}>
                Usuario no encontrado
              </label></div>)}
                        <div style={{alignContent: "center", paddingTop: 20, paddingBottom: 20}}>
                        <Button disabled={this.state.userNotification === ""} onClick={this.addUserNotification.bind(this)}>
                    Agregar usuario
                  </Button>
                  </div>
             
                  <ReactTable
                    data={this.state.users}
                    columns={userTableHeaders}
                    defaultPageSize={5}
                    previousText='Anterior'
                    nextText='Siguiente'
                    loadingText='Cargando...'
                    noDataText='No hay usuarios registrados'
                    pageText='Página'
                    ofText='de'
                    rowsText='filas'
                    pageJumpText='ir a la página'
                    rowsSelectorText='filas por página'
                    minRow={5}
                  />
              </Grid.Row>)} 
           {this.state.segmentOption === 2 && (<Grid.Row style={{paddingTop: 25}}>
             <Form.Field>
               <label>
                  Tema del mensaje
               </label>
              <Form.Dropdown
                      search
                      clearable
                      placeholder={'Seleccionar el tema'}
                      selection
                      options={this.state.topics}
                      onChange={this.setTopic.bind(this)}
                      value={this.state.topicSelected}
                      width={8}
                    />
             </Form.Field>
                
           </Grid.Row>)}
           {this.state.viewMessage === true && (
                  <Message color='red'>
                    {this.state.segmentOption === 1 ? 'Debe selecionar al menos un usuario': 'Debes seleccionar el tema'}
                  </Message>
                )}
                <Container textAlign={"center"} style={{paddingTop: 30}}>
                  <Button disabled={this.validateForm()} onClick={this.confirmSendNotification.bind(this)}>
                    Enviar Notificación
                  </Button>
                </Container>
            <div style={{paddingTop: 25}}>
            <Button onClick={()=>{this.setState({step: 1})}}>
                    Atras
                  </Button>
                  </div>
          </Grid.Column>
        </Grid>)}
         
        <Modal
          open={this.state.showConfirmDeleteUserToTable}
          onClose={this.closeViewModalConfirmDeleteUser.bind(this)}
        >
          <Header content='Eliminar usuario' />
          <Modal.Content>
            {this.state.loadingModal && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
            <div>
           <label>{'Estas seguro de eliminar a '+ this.state.userToDelete + ' de la lista'}</label>
           </div>
          </Modal.Content>
            <Modal.Actions>
            <Button
              onClick={this.closeViewModalConfirmDeleteUser.bind(this)}
              color='grey'
              icon
              labelPosition='left'
            >
              <Icon name="cancel" />
              {"Cancelar"}
            </Button>
              <Button
                onClick={this.deleteUserOfTable.bind(this)}
                color='blue'
                icon
                labelPosition='left'
              >
                <Icon name='delete' />
                {"Eliminar"}
              </Button>
          </Modal.Actions>
          </Modal>
        <Modal
          open={this.state.viewModalConfirm}
          onClose={this.closeViewModalConfirm.bind(this)}
        >
          <Header content='Enviar notificaciones' />
          <Modal.Content>
            {this.state.loadingModal && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
            <div>
           <label>{'Título: ' + this.state.title}</label>
            </div>
            <div>
              <label>{'Descripción: ' + this.state.description}</label>
            </div>
            <Divider />
            {!this.state.responseSendNotification && (
              <div style={{ textAlign: 'center' }}>
                <label style={{ fontSize: 22, fontWeight: 'bold' }}>
                  ¿Estas seguro de enviar la notificación?
                </label>
              </div>
            )}
            {this.state.responseSendNotification && (
              <div style={{ textAlign: 'center' }}>
                <label style={{ fontSize: 22, fontWeight: 'bold' }}>
                  Notificación enviada con exito.
                </label>
              </div>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.closeViewModalConfirm.bind(this)}
              color='grey'
              icon
              labelPosition='left'
            >
              <Icon name="cancel" />
              {!this.state.responseSendNotification ? "Cancelar": "Aceptar"}
            </Button>
            {!this.state.responseSendNotification && (
              <Button
                onClick={this.sendNotification.bind(this)}
                color='blue'
                icon
                labelPosition='left'
              >
                <Icon name='send' />
                Enviar Notificación
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      </Segment>
    );
  }
}

export default translate(SendNotifications);
