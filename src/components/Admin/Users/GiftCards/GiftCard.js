import React, { Component } from 'react';
import '../../Admin.css';
import {
  Form,
  Button,
  Divider,
  Icon,
  Loader,
  Dimmer,
  Select,
  Message
} from 'semantic-ui-react';
import ReactTable from 'react-table';
import userService from '../../../../services/user';
import ModalChangeStatus from './ModalChangeStatus';

class GiftCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userVerificationTable: [],
      showingOnTable: 'PROCESSING',
      showVerificationTable: false,
      userInfo: {},
      userToVerify: null,
      failAddInfo: false,
      messageAddInfo: '',
      status: "ACTIVATED",
      giftCardSeleted: null
    };
  }


  componentDidMount() {
    this.getGiftCardsByStatus('ACTIVATED');
  }


  makeDataTable = (data, status) => {
    this.setState({
      userVerificationTable: data,
      showingOnTable: status,
      showVerificationTable: true,
    });
  };

  getGiftCardsByStatus = (status) => {
    //console.log('get gift card ', status);
    this.setState({ showVerificationTable: false });
    userService
      ._getGiftCards(status)
      .then((resp) => {
        //console.log("GIFT CARDS ",resp.data);
        this.makeDataTable(resp.data, status);
      })
      .catch((error) => {
        //////console.log(error);
        this.setState({ showVerificationTable: true });
      });
  };
 
  formatDate(date) {
    let regi = 'es-ES';
    let cad = '';
    var options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: 'true',
    };
    let data = date.toLocaleString(regi, options);
    if (regi === 'es-ES') {
      data = data.split(' ');
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + ' ' + date;
      }
    } else {
      cad = data;
    }
   console.log('cad ', cad);
    return cad;
 

    // lunes, 26 de diciembre de 2050 9 a. m.
  }
  closeModal = () => {
    this.setState({ showModal: false });
  };

  handleModal(action,data) {
    console.log(action);
    this.setState({action: action,showModal: true, giftCardSeleted: data})
  }

  pickStatus = (e, data) => {
		this.setState({ status: data.value });
	};

  render() {
    let addInfoMessage;
    if (this.state.failAddInfo) {
      addInfoMessage = (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{this.state.messageAddInfo}</p>
        </Message>
      );
    }
    const statusOptions = [
      { key: 'ACTIVATED', value: 'ACTIVATED', text: 'Activas' },
      { key: 'SUBMITTED', value: 'SUBMITTED', text: 'Enviadas' },
      { key: 'REDEEMED', value: 'REDEEMED', text: 'Canjeadas' },
      { key: 'DELETED', value: 'DELETED', text: 'Eliminadas' },
    ];
    const userVerificationTableHeaders = [
       {
        Header: 'Fecha',
        accessor: 'activationTimestamp',
         Cell: (row) => {
          return this.formatDate(new Date(row.value));
        },
        width: 165,
      },
       {
        Header: 'Tipo',
        accessor: 'source',
        Cell: (row) => {
         if(row.value === "BR") {
           return "BITCOINRECHARGE";
         } else if(row.value === "MC") {
           return "MONEYCLICK";
         } else if(row.value === "USD_MXN") {
           return "USD a MXN";
         } else if(row.value === "USD_COP") {
           return "USD a COP";
         } else if(row.value === "USD_ETH") {
           return "USD a ETH";
         } else if(row.value === "USD_USDT") {
           return "USD a USDT";
         } else {
           return "DEFAULT";
         }
        },
        width: 165,
      },
      {
        Header: 'Id',
        accessor: 'id',
        width: 50,
         Cell: (row) => {
           return row.value.slice(row.value.length - 4);
         }
      },
       {
        Header: 'Moneda',
        accessor: 'currency',
        width: 100,
      },
      {
        Header: 'Monto',
        accessor: 'amount',
        width: 150,
      },
      {
        Header: 'Usuario',
        accessor: 'baseUserName',
      },
       {
        Header: "Acciones",
        width: 200,
        Cell: (row) => (
          <div>
            {this.state.status === "ACTIVATED" && (<Button
              icon="send"
              circular
              compact
              size="large"
              color="blue"
              id={row.original.id}
              name="send"
              title="Enviar"
              onClick={() => this.handleModal("send",row.original)}
            />)}
              {(this.state.status === "ACTIVATED" || this.state.status === "SUBMITTED" ) &&(<Button
                icon="delete"
                circular
                compact
                size="large"
                color="blue"
                id={row.original.id}
                title="Eliminar"
                onClick={() => this.handleModal("delete",row.original)}
              />)}
              {this.state.status === "SUBMITTED" && (<Button
                icon="send"
                circular
                compact
                size="large"
                color="blue"
                id={row.original.id}
                title="Reenviar"
                onClick={() => this.handleModal("resend",row.original)}
              />)}
        </div>),
      },
    ];

    return (
      <div>
        {!this.state.showVerificationTable && (
          <Dimmer active inverted>
            <Loader inverted>Cargando...</Loader>
          </Dimmer>
        )}
        <ModalChangeStatus 
        showModal={this.state.showModal}
         closeModal={this.closeModal.bind(this)} 
         action={this.state.action}
         giftCardSeleted={this.state.giftCardSeleted}
         statusSelected={this.state.status}
         refresh={()=>this.getGiftCardsByStatus(this.state.status)}/>
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Estatus a buscar:</label>
              <Select
                placeholder='Activadas'
                onChange={this.pickStatus}
                options={statusOptions}
                style={{ zIndex: 100 }}
              />
            </Form.Field>
            <Form.Button
              icon
              labelPosition='left'
              color='blue'
              style={{ marginTop: 23 }}
              type='submit'
              onClick={() =>
                this.getGiftCardsByStatus(this.state.status)
              }
            >
              <Icon name='search' />
              Buscar
            </Form.Button>
          </Form.Group>
        </Form>
        <Divider />
        <ReactTable
          defaultSorted={[
            {
              id: 'date',
              desc: false,
            },
          ]}
          className='transactionTable'
          data={this.state.userVerificationTable}
          columns={userVerificationTableHeaders}
          defaultPageSize={5}
          previousText='Anterior'
          nextText='Siguiente'
          loadingText='Cargando...'
          noDataText='No hay verificaciones de este estatus'
          pageText='Página'
          ofText='de'
          rowsText='filas'
          pageJumpText='ir a la página'
          rowsSelectorText='filas por página'
          minRow={5}
        />
      </div>
    );
  }
}
export default GiftCard;
