import React, { Component } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import user from '../../services/user';
class MenuNavAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionsUser: new Array(),
    };
  }
  componentDidMount() {
    let availableFunctionsUser = user.getUserRol();
    if (availableFunctionsUser !== null) {
      this.setState({
        actionsUser: availableFunctionsUser.functionsAvailables,
      });
    }
  }
  componentWillUnmount() {
    this.setState({ actionsUser: new Array() });
  }
  render() {
    return (
      <Dropdown text='' icon={<Icon name='desktop' inverted size='big' />}>
        <Dropdown.Menu id='list-options-drop'>
          {this.state.actionsUser.indexOf('balance') !== -1 && (
            <Dropdown.Item as={Link} to='/balancesAndOperations'>
              <span className='list-item-custom-admin'>
                Balances y operaciones de cuentas
              </span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('otc_offers') !== -1 && (
            <Dropdown.Item as={Link} to='/otcOferts'>
              <span className='list-item-custom-admin'>Ofertas OTC</span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('otc_operations') !== -1 && (
            <Dropdown.Item as={Link} to='/otcOperations'>
              <span className='list-item-custom-admin'>Operaciones OTC</span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('balance_of_operations') !== -1 && (
            <Dropdown.Item as={Link} to='/balanceOfOperations'>
              <span className='list-item-custom-admin'>
                Balance de operaciones
              </span>
            </Dropdown.Item>
          )}
          {/* {this.state.actionsUser.indexOf("market_operations") !== -1 && (
            <Dropdown.Item as={Link} to="/marketOperations">
              <span className="list-item-custom-admin">
                Operaciones de Mercados
              </span>
            </Dropdown.Item>
          )}*/}
          {this.state.actionsUser.indexOf('users') !== -1 && (
            <Dropdown.Item as={Link} to='/verifyUsersAccounts'>
              <span className='list-item-custom-admin'>Usuarios</span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('market_modulator') !== -1 && (
            <Dropdown.Item as={Link} to='/marketModulator'>
              <span className='list-item-custom-admin'>
                Modulador de Mercados
              </span>
            </Dropdown.Item>
          )}

          {this.state.actionsUser.indexOf('rols_and_operators') !== -1 && (
            <Dropdown.Item as={Link} to='/rolAndOperators'>
              <span className='list-item-custom-admin'>Roles y operadores</span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('config_retails') !== -1 && (
            <Dropdown.Item as={Link} to='/configRetails'>
              <span className='list-item-custom-admin'>
                Puntos de Intercambio
              </span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('communications') !== -1 && (
            <Dropdown.Item as={Link} to='/communications'>
              <span className='list-item-custom-admin'>Comunicaciones</span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('external_send') !== -1 && (
            <Dropdown.Item as={Link} to='/externalSend'>
              <span className='list-item-custom-admin'>
                Entradas y Salidas Especiales
              </span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('notifications') !== -1 && (
            <Dropdown.Item as={Link} to='/notifications'>
              <span className='list-item-custom-admin'>
                Enviar Notificación
              </span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('manage_request') !== -1 && (
            <Dropdown.Item as={Link} to='/requestUsers'>
              <span className='list-item-custom-admin'>
                Administrar Solicitudes
              </span>
            </Dropdown.Item>
          )}
          {this.state.actionsUser.indexOf('config_cash_locations') !== -1 && (
            <Dropdown.Item as={Link} to='/configCashPlaces'>
              <span className='list-item-custom-admin'>Puntos de Efectivo</span>
            </Dropdown.Item>
          )}
          {/*<Dropdown.Item as={Link} to='/giftCards'>
              <span className='list-item-custom-admin'>
                Administrar Gift Cards
              </span>
          </Dropdown.Item>*/}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default MenuNavAdmin;
