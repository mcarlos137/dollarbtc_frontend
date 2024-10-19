import React, { useEffect, useState } from 'react';
import { Menu, Segment, Container } from 'semantic-ui-react';
import DebitCardRequestView from './DebitsCardRequest';
import RechargeCardView from "../Admin/Users/GiftCards/GiftCard";
import userService from '../../services/user';
export default function componentName() {
  const [itemActive, setItemActive] = useState('debitCardRequest');
  const [availableFunctions, setavailableFunctions] = useState([]);
  useEffect(() => {
    setFunctionsUser();
  }, []);
  function setFunctionsUser() {
    let availableFunctionsUser = userService.getUserRol();
    if (availableFunctionsUser !== null) {
      let arrayFunctions = availableFunctionsUser.functionsAvailables;
      let nameItem = '';
      if (arrayFunctions.indexOf('users_verifications') !== -1) {
        nameItem = 'userVerification';
      } else {
        if (arrayFunctions.indexOf('users_data') !== -1) {
          nameItem = 'userBalance';
        } else {
          if (arrayFunctions.indexOf('users_profiles') !== -1) {
            nameItem = 'userProfile';
          } else {
            nameItem = 'userAdministration';
          }
        }
      }
      setavailableFunctions(arrayFunctions);
      console.log(availableFunctionsUser);
    }
  }
  function handleSetItemActive(e, data) {
    setItemActive(data.name);
  }
  return (
    <Container>
      <Menu size='small' pointing >
        {availableFunctions.indexOf('users_verifications') !== -1 && (
          <Menu.Item
            content='Tarjetas de Débito'
            name='debitCardRequest'
            active={itemActive === 'debitCardRequest'}
            onClick={handleSetItemActive}
          />
        )}
        {availableFunctions.indexOf('users_verifications') !== -1 && (
          <Menu.Item
            content='Tarjetas de Recarga'
            name='cardRecharge'
            active={itemActive === 'cardRecharge'}
            onClick={handleSetItemActive}
          />
        )}
      </Menu>
      <Segment color='orange'>
        {itemActive === 'debitCardRequest' && <DebitCardRequestView />}
        {itemActive === 'cardRecharge' && <RechargeCardView />}
      </Segment>
    </Container>
  );
}
