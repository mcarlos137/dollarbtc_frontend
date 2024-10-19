import React, { Component } from "react";
import {
  Segment,
    Grid,
} from "semantic-ui-react";
import ReactTable from "react-table";
import notificationService from "../../../services/notifications";
class Groups extends Component {
  state = {
      load: true,
      data: []
  };
  componentDidMount(){
    this.getGrups();
  }

  async getGrups() {
      
    let groups = await notificationService.getGroups();
    this.setState({
		data: groups.data,
		load: false
    });
    //console.log('groups ', groups.data);
  }

  	
  render() {
    
      	const groupsTableHeaders = [
			{
				Header: "Nombre",
				accessor: "name",
				filterable: true,
			},
			{
				Header: "Alcance",
				accessor: "userNamesCount",
				 Cell: (row) => (
				 <div style={{textAlign: "center"}}>{row.value}</div>),
				width: 150,
			}
		
		];
    return (
      <div>
        <Grid>
			<Grid.Column largeScreen={16} mobile={16} computer={16} tablet={16}>
				<Segment basic loading={this.state.load}>
						<ReactTable
							data={this.state.data}
							columns={groupsTableHeaders}
							defaultPageSize={5}
							previousText='Anterior'
							nextText='Siguiente'
							loadingText='Cargando...'
							noDataText='No hay grupos registrados'
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
      </div>
    );
  }
}

export default Groups;