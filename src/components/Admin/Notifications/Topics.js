import React, { Component } from "react";
import {
  Segment,
    Grid,
    Form,
    Input,
    Button,
    Modal,
    Header,
    Dimmer,
    Loader,
    Icon,
    Dropdown
} from "semantic-ui-react";
import ReactTable from "react-table";
import notificationService from "../../../services/notifications";
class Topics extends Component {
  state = {
      loading: true,
      loadingModal: false,
      topicName: "",
      operatorUserName: "",
      showConfirmEditGroup: false,
      groups: [],
      topicToEdit: "",
      topics: [],
      groupOfTopicSelected: [],
  };

  componentDidMount() {
    this.getGroups();
    this.getTopics();
  }

   async getGroups() {
      
    let groups = await notificationService.getGroups();

    let groupSelect = groups.data.map(group => {

      group.value = group.name;
      group.text = group.name;
      return group;
    });

    this.setState({
        groups: groupSelect
    });

  }

  async getTopics() {
      
    let topics = await notificationService.getTopics();
    
    let topicsList = topics.data.map(topic => {
    let groupsContent  = "", groupList= [];
    if(topic.groups) {
       Object.entries(topic.groups).forEach(([infoLabel, infoData]) => {
          groupsContent = groupsContent + "," + infoLabel;
          groupList.push({text: infoLabel, value: infoLabel});
        });
        const editedText = groupsContent.substr(1, groupsContent.length);
        topic.groupsContent = editedText;
        topic.groupList = groupList;
    } else {
      topic.groupsContent = "";
      topic.groupList = [];
    }
   
    return topic;

    });
    this.setState({
        topics: topicsList,
        loading: false
    });
  
  }

  async createTopic() {
    this.setState({loadingModal: true})
      let body = {
          name: this.state.topicName,
          operatorUserName: window.sessionStorage.getItem('username')
      };

      //console.log('body ', body);
      await notificationService.createTopic(body);
       this.getTopics();
      this.setState({loadingModal: false, openModalConfirm: false,topicName: ""})

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

  async showModalEditGroup(data) {

    let optionsGroups =  this.state.groups.filter(group =>{
      return data.groupList.findIndex(groupAux => { return groupAux.value === group.name }) === -1 ; 
    });

    this.setState({
      showConfirmEditGroup: true,
      topicToEdit: data,
      groupOfTopicSelected: data.groupList,
      optionsGroups: optionsGroups
    })
}

closeViewModalConfirmEditGroup(){
   this.setState({
   showConfirmEditGroup: false
 })
}

async addGroupToTopic() {
  this.setState({
    loadingModal: true
  });
  let body = {
    "topicId": this.state.topicToEdit.id ,
    "groups": this.state.groupOfTopicSelected
  };

  let response = await notificationService.addGroupsToTopic(body)
  this.getTopics();
  this.setState({
    loadingModal: false,
    showConfirmEditGroup: false
  });
}

  setGroupByTopic = (e, data) => {

     this.setState({
       groupOfTopicSelected: data.value
    });
    
  };

render() {
     	const topicsTableHeaders = [
			{
				Header: "Nombre",
				accessor: "name",
				filterable: true,
      },{
				Header: "Grupos asociados",
				accessor: "groupsContent"
      },
      	{
				Header: "Creado por",
        accessor: "operatorUserName",
        filterable: true,
      },
			{
				Header: "Fecha",
				accessor: "timestamp",
        width: 200,
         Cell: (row) => {
          return this.formatDate(new Date(row.value));
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
              name="addGroup"
              title="Editar Grupo"
              onClick={() => this.showModalEditGroup(row.original)}
            />
            </div>)
       }
           
		
		];
    return (
      <div>
         
        <Grid>
			<Grid.Column largeScreen={16} mobile={16} computer={16} tablet={16}>
				<Segment basic loading={this.state.loading}>
                      <Form style={{paddingBottom: 30}}>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Nombre del tema</label>
                  <Input
                    placeholder="Nombre de Tema"
                    onChange={(topicName) => {
                        console.log(topicName.target.value);
                        this.setState({topicName: topicName.target.value}
                            )
                        }}
                    type="text"
                    value={this.state.topicName}
                  />
                    </Form.Field>
                      <Form.Field>
    <label style={{color: "white"}}>{"."}</label>
                     <Form.Button
                        content="Agregar tema"
                        color="blue"
                        disabled={this.state.topicName === ""}
                        onClick={()=>{this.setState({openModalConfirm: true})}}
                    />
                    </Form.Field>
                </Form.Group>
            </Form>
						<ReactTable
							data={this.state.topics}
							columns={topicsTableHeaders}
							defaultPageSize={5}
							previousText='Anterior'
							nextText='Siguiente'
							loadingText='Cargando...'
							noDataText='No hay Temas registrados'
							pageText='Página'
							ofText='de'
							rowsText='filas'
							pageJumpText='ir a la página'
							rowsSelectorText='filas por página'
							minRow={5}
							/>
						</Segment>
					</Grid.Column>
				</Grid>
       
        <Modal open={this.state.openModalConfirm}>
    <Modal.Header>{"Agregar nuevo tema"}</Modal.Header>
          <Modal.Content>
               {this.state.loadingModal && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
            <Segment basic>
              <Header as="h3">
                {"Estas seguro de crear el nuevo tema : " + this.state.topicName + " ?"}
              </Header>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.endsend && (
              <Button
                onClick={()=>{this.setState({openModalConfirm: false})}}
                negative
              >
                No
              </Button>
            )}
            {!this.state.endsend && (
              <Button
                onClick={this.createTopic.bind(this)}
                positive
              >
                Si
              </Button>
            )}
            {this.state.endsend && (
              <Button onClick={()=>{this.setState({openModalConfirm: false})}} color="blue">
                Cerrar
              </Button>
            )}
          </Modal.Actions>
        </Modal>
         <Modal
          open={this.state.showConfirmEditGroup}
          onClose={this.closeViewModalConfirmEditGroup.bind(this)}
        >
          <Header content='Agregar nuevos grupos' />
          <Modal.Content>
             {this.state.loadingModal && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
            <div>
              <Dropdown placeholder={'Grupos asociados'}           
               multiple 
               selection 
               options={this.state.optionsGroups} 
              onChange={this.setGroupByTopic}/>
           <label>{}</label>
           </div>
          </Modal.Content>
            <Modal.Actions>
            <Button
              onClick={this.closeViewModalConfirmEditGroup.bind(this)}
              color='grey'
              icon
              labelPosition='left'
            >
              <Icon name="cancel" />
              {"Cancelar"}
            </Button>
              <Button
                onClick={this.addGroupToTopic.bind(this)}
                color='blue'
                icon
                labelPosition='left'
              >
                <Icon name='delete' />
                {"Agregar"}
              </Button>
          </Modal.Actions>
          </Modal>
      </div>)
  }
}

export default Topics;