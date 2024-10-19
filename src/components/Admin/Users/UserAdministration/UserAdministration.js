import React, { Component } from 'react';
import ReactTable from 'react-table';
import {
  Modal,
  Button,
  Segment,
  Grid,
  Message,
  Popup,
  Label,
  Form,
  Icon,
  Checkbox,
  Select,
} from 'semantic-ui-react';
import user from '../../../../services/user';
import { element } from 'prop-types';

class UserAdministration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      core: [],
      bushido: [],
      loadModal: false,
      enableOption: false,
      openModalOptions: false,
      usernamespecial: '',
      specialOption: '',
      openModal: false,
      users: {},
      colorlabel: '',
      colorlabel2: '',
      colorSelected2: '',
      colorSelected: '',
      load: false,
      view: false,
      showUserRemove: false,
      loading: false,
      showInactivateConfirm: false,
      showDeleteConfirm: false,
      showMessage: false,
      colorMessage: '',
      showMessage2: false,
      showMessageRemove: false,
      colorMessageRemove: '',
      message: '',
      change: false,
      waitRemoveUsers: false,
      showModalBroker: false,
      usernameToCloseSession: '',
      usernameSelected: '',
      typeSelected: '',
      showCloseSessionManually: false,
      selectTypeChange: [],
      userToSearch: '',
      loadSearch: false,
      userSelected: {
        name: '',
        firstName: '',
        lastName: '',
        phone: '',
        type: '',
        active: '',
      },
    };
  }
  closeConfigShow = (closeOnDimmerClick) => () => {
    this.setState({
      closeOnDimmerClick,
      showInactivateConfirm: true,
      showDeleteConfirm: true,
    });
  };

  close = () => {
    this.setState({
      showInactivateConfirm: false,
      showDeleteConfirm: false,
      showMessage: false,
      showCloseSessionManually: false,
      message: '',
      colorMessage: '',
      viewButtons: false,
      showModalBroker: false,
    });
    if (this.state.change) {
      this.getUser();
    }
    this.setState({ change: false });
  };

  closeModal() {
    this.setState({
      waitRemoveUsers: false,
    });
  }

  componentDidMount() {
    //this.getUsers();
    //this.getUsersBoth();
  }

  getUser() {
    this.setState({ load: true, view: false, data: [] });
    user
      .getConfigUserGeneral(this.state.userToSearch)
      .then(async (resp) => {
        this.setState({
          enableRequestDebitCards:
            resp.data.result.enableRequestDebitCards !== undefined &&
            resp.data.result.enableRequestDebitCards
              ? true
              : false,
          enableActivateGiftCards:
            resp.data.result.enableActivateGiftCards !== undefined &&
            resp.data.result.enableActivateGiftCards
              ? true
              : false,
          enableOneDepositVerification:
            resp.data.result.enableOneDepositVerification !== undefined &&
            resp.data.result.enableOneDepositVerification
              ? true
              : false,
        });
        let core = [];
        let userList = user.getActualUserInfo(resp.data.result);
        core.push(userList);
        user
          .findUsername(this.state.userToSearch)
          .then((resp) => {
            let bushido = [];
            if (resp.data.payload !== null) {
              bushido.push(resp.data.payload);
              this.userCore(core, bushido);
              this.userBushido(core, bushido);
            } else {
              this.setState({ load: false, data: [] });
              this.setState({ view: true });
            }
          })
          .catch((error) => {
            this.setState({ load: false, data: [] });
            this.setState({ view: true });
            //console.log(error);
          });
      })
      .catch((error) => {
        this.setState({ load: false, data: [] });
        this.setState({ view: true });
      });
  }

  userCore(core, bushido) {
    for (let x of bushido) {
      let cont = 0;

      for (let y of core) {
        if (x.username === y.name) {
          cont = cont + 1;
        }
      }
      if (cont !== 0) {
        var result = [];
        for (let y of core) {
          if (y !== undefined || y !== null) {
            if (y.phone === undefined) {
              y.phone = '';
            }

            if (y.checked === undefined) {
              y.checked = false;
            }
            if (y.sourceSignin !== undefined) {
              y.origin = y.sourceSignin;
            } else {
              if (y.name !== undefined) {
                if (y.name.includes('@')) {
                  y.origin = 'DollarBTC';
                } else {
                  y.origin = 'MoneyClick';
                }
              } else {
                y.origin = 'No Definido';
              }
            }
            result.push(y);
          }
        }
      }

      this.setState({ data: result });
    }
  }

  userBushido(core, bushido) {
    // console.log("core", core);
    // console.log("bushido", bushido);
    let n = 0;
    for (let x of bushido) {
      let cont = 0;

      for (let y of core) {
        if (x.username === y.name) {
          cont = cont + 1;
        }
      }
      //	console.log("cont", cont);
      if (cont === 0) {
        if (x !== undefined || x !== null) {
          if (x.username !== undefined || x !== null) {
            x.name = x.username;
          }
          if (x.name === null) {
            x.name = 'No posee';
          }
          if (x.lastName === null) {
            x.lastName = 'No posee';
          }
          if (x.email === null) {
            x.email = 'No posee';
          }
          if (x.phone === undefined || x.phone === null) {
            x.phone = 'No posee';
          }

          if (x.checked === undefined) {
            x.checked = false;
          }
          if (
            x.username === undefined ||
            x.username === null ||
            x.username === ' '
          ) {
            x.origin = 'No Definido';
          } else {
            if (x.username.includes('@')) {
              x.origin = 'DollarBTC';
            } else {
              x.origin = 'MoneyClick';
            }
          }
          this.setState({ data: [...this.state.data, x] });
        }
      }
    }
    this.setState({ load: false, view: true });
  }

  getUsers() {
    this.setState({ load: true, view: false, data: [] });
    user
      .listNamesByIndexAndValue('type', 'ADMIN')
      .then((resp) => {
        console.log(resp);
        var result = [];
        for (let l of resp.data.result.users) {
          let userList = user.getActualUserInfo(l);
          //console.log(userList)
          if (userList !== undefined || userList !== null) {
            if (userList.phone === undefined) {
              userList.phone = '';
            }

            if (userList.checked === undefined) {
              userList.checked = false;
            }
            if (userList.sourceSignin !== undefined) {
              userList.origin = userList.sourceSignin;
            } else {
              if (userList.name !== undefined) {
                if (userList.name.includes('@')) {
                  userList.origin = 'DollarBTC';
                } else {
                  userList.origin = 'MoneyClick';
                }
              } else {
                userList.origin = 'No Definido';
              }
            }
            result.push(userList);
          }
          this.setState({ load: false, data: result });
          this.setState({ view: true });
        }
      })
      .catch((error) => {
        this.setState({ load: false, data: [] });
        this.setState({ view: true });
        //console.log(error);
      });
  }
  handleCloseSessionUser(e, data) {
    this.setState({ usernameToCloseSession: data.name }, () => {
      this.setState({ showCloseSessionManually: true });
    });
  }
  handleInactiveButton(e, data) {
    let item = this.state.data.find(function (element) {
      return element.name === data.name;
    });

    let selected = {
      name: item.name,
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone,
      type: item.type,
      active: item.active,
    };
    this.setState({ userSelected: selected }, () => {
      this.setState({ showInactivateConfirm: true });
    });
  }
  handleDeleteButton(e, data) {
    let item = this.state.data.find(function (element) {
      return element.name === data.name;
    });

    let selected = {
      name: item.name,
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone,
      type: item.type,
      active: item.active,
    };
    this.setState({ userSelected: selected }, () => {
      this.setState({ showDeleteConfirm: true });
    });
  }

  inactivationUser() {
    user
      .inactivateUser(this.state.userSelected.name)
      .then((resp) => {
        if (resp.data === 'OK') {
          this.changeStatusLocalUser(this.state.userSelected.name, false);
          this.inactivationUserBushido();
        }
      })
      .catch((error) => {
        this.setState({
          showMessage: true,
          viewButtons: true,
          colorMessage: 'red',
          message: 'Error al inactivar usuario',
        });
      });
  }

  activationUser() {
    user
      .activateUser(this.state.userSelected.name)
      .then((resp) => {
        if (resp.data === 'OK') {
          this.changeStatusLocalUser(this.state.userSelected.name, true);
          this.activationUserBushido();
        }
      })
      .catch((error) => {
        this.setState({
          showMessage: true,
          viewButtons: true,
          colorMessage: 'red',
          message: 'Error al activar usuario',
        });
      });
  }
  // deleteUser() {
  //   this.setState({ loading: true });
  //   user
  //     .deleteUser(this.state.userSelected.name)
  //     .then((resp) => {
  //       //console.log("entranndo bien")
  //       if (resp.data === "OK") {
  //         this.deleteUserLocality(this.state.userSelected.name);
  //         this.deleteUserBushidoM(this.state.userSelected.name);
  //         this.setState({ loading: false });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       this.setState({
  //         loading: false,
  //         showMessage: true,
  //         viewButtons: true,
  //         colorMessage: "red",
  //         message: "Error al eliminar usuario",
  //       });
  //     });
  // }
  deleteUser() {
    this.setState({ loading: true });
    user.deleteUser(this.state.userSelected.name);
    this.deleteUserLocality(this.state.userSelected.name);
    this.deleteUserBushidoM(this.state.userSelected.name);
    this.close();
    this.setState({ loading: false });
  }
  changeStatusLocalUser(user, status) {
    this.setState((state) => {
      const data = state.data.map((element) => {
        if (element.name === user) {
          element.active = status;
          return element;
        } else {
          return element;
        }
      });
      return { data };
    });
  }
  inactivationUserBushido() {
    user
      .inactivateUserBushido(this.state.userSelected.name)
      .then((resp) => {
        if (
          resp.data.payload ||
          resp.data.errors[0].code === 60 ||
          resp.data.errors[0].code === 32
        ) {
          this.setState({
            showMessage: true,
            viewButtons: true,
            colorMessage: 'green',
            message: 'Usuario inactivado con éxito',
            change: false,
          });
        } else {
          this.setState({
            showMessage: true,
            viewButtons: true,
            colorMessage: 'green',
            message: 'Usuario inactivado con éxito',
            change: false,
          });
        }

        setTimeout(() => {
          this.close();
        }, 7000);
      })
      .catch((error) => {
        this.setState({
          showMessage: true,
          viewButtons: true,
          colorMessage: 'red',
          message: 'Error al inactivar usuario',
        });
      });
  }
  activationUserBushido() {
    user
      .activateUserBushido(this.state.userSelected.name)
      .then((resp) => {
        if (
          resp.data.payload ||
          resp.data.errors[0].code === 60 ||
          resp.data.errors[0].code === 32
        ) {
          this.setState({
            showMessage: true,
            viewButtons: true,
            colorMessage: 'green',
            message: 'Usuario activado con éxito',
            change: false,
          });
        } else {
          this.setState({
            showMessage: true,
            viewButtons: true,
            colorMessage: 'green',
            message: 'Usuario activado con éxito',
            change: false,
          });
        }
        setTimeout(() => {
          this.close();
        }, 7000);
      })
      .catch((error) => {
        this.setState({
          showMessage: true,
          colorMessage: 'red',
          message: 'Error al activar usuario',
        });
      });
  }
  async closeSessionUser() {
    this.setState({ loading: true });
    try {
      await user.closeSession(this.state.usernameToCloseSession);
      this.setState({
        showMessage: true,
        viewButtons: true,
        colorMessage: 'green',
        message: 'La sesión del usuario ha sido cerrada con éxito',
        change: false,
        loading: false,
      });

      setTimeout(() => {
        this.setState({ showCloseSessionManually: false });
        this.close();
      }, 5000);
    } catch (error) {
      this.setState({
        showMessage: true,
        loading: false,
        colorMessage: 'red',
        message: 'Error no se pudo cerrar la sesión',
      });
    }
  }
  deleteUserBushidoM(userdelete) {
    user.deleteUserBushido(userdelete);
  }
  // deleteUserBushidoM(userdelete) {
  //   user
  //     .deleteUserBushido(userdelete)
  //     .then((resp) => {
  //       this.setState({
  //         showMessage: true,
  //         viewButtons: true,
  //         colorMessage: "green",
  //         message: "Usuario eliminado con éxito",
  //         change: false,
  //       });

  //       setTimeout(() => {
  //         this.close();
  //       }, 3000);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       this.setState({
  //         showMessage: true,
  //         colorMessage: "red",
  //         message: "Error al eliminar usuario",
  //       });
  //     });
  // }
  handleBrokerButton(e, data) {
    let item = this.state.data.find(function (element) {
      return element.name === data.name;
    });
    this.getTypeChange(item.type);
    let selected = {
      name: item.name,
      firstName: item.firstName,
      lastName: item.lastName,
      phone: item.phone,
      type: item.type,
      active: item.active,
    };
    this.setState({
      showModalBroker: true,
      userSelected: selected,
    });
  }

  changeToBroker() {
    let profile = this.state.typeSelected;
    // let profile = "";
    // if (this.state.userSelected.type === "BROKER") {
    //   profile = "NORMAL";
    // } else {
    //   profile = "BROKER";
    // }
    user
      .changeProfile(this.state.userSelected.name, profile)
      .then((resp) => {
        if (resp.data === 'OK') {
          this.changueProfileUserInTable(this.state.userSelected.name, profile);
          this.setState({
            showMessage: true,
            colorMessage: 'green',
            message: 'Perfil cambiado con éxito',
            change: false,
            viewButtons: true,
          });

          setTimeout(() => {
            this.close();
          }, 7000);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  }
  changueProfileUserInTable(name, profile) {
    this.setState((state) => {
      const data = state.data.map((element) => {
        if (element.name === name) {
          element.type = profile;
          return element;
        } else {
          return element;
        }
      });
      return { data };
    });
  }
  handleChecked = (e, data) => {
    var labelValue = data.value;
    var checkedValue = data.checked;
    var objectToSet = this.state.data;
    for (var i = 0; i < objectToSet.length; i++) {
      if (objectToSet[i].name === labelValue) {
        objectToSet[i].checked = checkedValue;
        break;
      }
    }
    this.setState({ data: objectToSet });
    this.showButtonRemove();
  };

  handleCheckedOption = (e, data) => {
    var checkedValue = data.checked;

    this.setState({ enableOption: checkedValue });
  };

  showButtonRemove() {
    let cont = 0;
    this.state.data.map(function (key) {
      if (key.checked === true) {
        cont = cont + 1;
      }
    });

    if (cont >= 1) {
      this.setState({ showUserRemove: true });
    } else {
      this.setState({ showUserRemove: false });
    }
  }
  deleteUserLocality(user) {
    let arrayUser = this.state.data.filter((element) => {
      return element.name !== user;
    });
    this.setState({ data: arrayUser });
  }
  removeUserList = () => {
    this.setState({
      waitRemoveUsers: true,
      showMessageRemove: false,
      showUserRemove: false,
    });

    let userNames = [];
    this.state.data.map(function (key) {
      if (key.checked === true) {
        userNames.push(key.name);
      }
    });

    let arrayUser = this.state.data;

    for (let key of userNames) {
      //	console.log("arrayUser", arrayUser);
      user.deleteUser(key);
      this.deleteUserBushidoM(key);
      arrayUser = arrayUser.filter((element) => {
        return element.name !== key;
      });
    }

    this.setState({ data: arrayUser });

    setTimeout(() => {
      this.setState({
        colorMessageRemove: 'blue',
        showMessageRemove: true,
        messageRemove: 'Los Usuarios se han eliminado exitosamente',
      });
      setTimeout(() => {
        this.setState({ waitRemoveUsers: false });
      }, 7000);
    }, 7000);
  };

  getTypeChange = (a) => {
    //	console.log("type", a);
    var allTypes = ['NORMAL', 'BROKER', 'BANKER', 'ADMIN'];
    var index = allTypes.indexOf(a);
    if (index > -1) {
      var availableTypes = [];
      allTypes.splice(index, 1);
      for (var i = 0; i < allTypes.length; i++) {
        var status = '';
        if (allTypes[i] === 'NORMAL') {
          status = 'NORMAL';
        } else if (allTypes[i] === 'BROKER') {
          status = 'BROKER';
        } else if (allTypes[i] === 'ADMIN') {
          status = 'ADMIN';
        } else {
          status = 'BANQUERO';
        }
        var itemToAdd = {
          key: allTypes[i],
          value: allTypes[i],
          text: status,
        };
        availableTypes.push(itemToAdd);
      }
      this.setState({ selectTypeChange: availableTypes });
    }
  };

  SelectType(e, value) {
    this.setState({
      typeSelected: value.value,
    });
  }

  setUserNameTable(e, data) {
    //	console.log(data.name);
    // let item = this.state.data.find(function (element) {
    // 	return element.name === data.name;
    // });

    this.setState({
      usernameSelected: data.name,
    });
    this.OpenModal();
  }

  closeModal() {
    this.setState({ openModal: false, colorSelected2: '' });
  }

  addFlag() {
    let body = {
      operatorUserName: window.sessionStorage.getItem('username'),
      userName: this.state.usernameSelected,
      flagColor: this.state.colorSelected2.toUpperCase(),
    };
    //	console.log(body);
    this.setState({ loadModal: true });
    user
      .addFlag(body)
      .then((res) => {
        //console.log(res);
        if (res.data !== 'OK') {
          this.setState({
            loadModal: false,
            message: 'Error de la actualizacion',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
            });
          }, 5000);
          this.closeModal();
        } else {
          this.setState({
            loadModal: false,
            message: 'Actualizacion exitosa',
            colorMessage: 'green',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
              colorSelected: '',
            });
            //	this.getUsersBoth();
            this.getUser();
            this.closeModal();
          }, 5000);
        }
      })
      .catch((error) => {
        //	console.log(error);
        if (error.toString().includes('network')) {
          this.setState({
            loadModal: false,
            message: 'Error de conexion',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({
              message: '',
              showMessage2: false,
            });
          }, 5000);
          this.closeModal();
        } else {
          this.setState({
            loadModal: false,
            message:
              'Ha ocurrido un error inesperado, por favor intente mas tarde',
            colorMessage: 'red',
            showMessage2: true,
          });
          setTimeout(() => {
            this.setState({ message: '', showMessage2: false });
          }, 5000);
          this.closeModal();
        }
      });
  }

  OpenModal() {
    this.setState({ openModal: true });
  }

  handleColors(e, data) {
    this.setState({ colorSelected: data.value });
  }

  handleColors2(e, data) {
    this.setState({
      colorSelected2: data.value,
      colorlabel2: data.text,
    });
  }

  handleSearchUser = (e) => {
    this.setState({ userToSearch: e.target.value });
  };

  handleSpecialOptions(e, data) {
    this.setState({
      specialOption: data.value,
    });
  }

  openModalSpecialOptions() {
    this.setState({});
  }

  updateSpecialOption(option, status) {
    if (option === 'ACTIVATE_GIFT_CARDS') {
      this.setState({
        enableActivateGiftCards: status,
      });
    } else if (option === 'REQUEST_DEBIT_CARDS') {
      this.setState({
        enableRequestDebitCards: status,
      });
    } else if (option === 'ONE_DEPOSIT_VERIFICATION') {
      this.setState({
        enableOneDepositVerification: status,
      });
    }
  }
  specialOption() {
    let body = {
      userName: this.state.usernamespecial,
      option: this.state.specialOption,
      enable: this.state.enableOption,
    };
    this.setState({
      loadingSpecial: true,
    });
    user
      .UserSpecialOption(body)
      .then((resp) => {
        if (resp.data === 'OK') {
          this.updateSpecialOption(
            this.state.specialOption,
            this.state.enableOption
          );
          this.setState({
            loadingSpecial: false,
            message: 'Operación Exitosa',
            colorMessage: 'green',
            showMessageSpecial: true,
            specialOption: '',
          });
          setTimeout(() => {
            this.setState({ message: '', showMessageSpecial: false });
            this.closeModalOptions();
          }, 5000);
        }
      })
      .catch((error) => {
        this.setState({
          //	specialOption: "",
          loadingSpecial: false,
          message:
            'Ha ocurrido un error inesperado, por favor intente mas tarde',
          colorMessage: 'red',
          showMessageSpecial: true,
        });
        setTimeout(() => {
          this.setState({ message: '', showMessageSpecial: false });
        }, 5000);
        //this.closeModalOptions();
        //	console.log(error);
      });
  }

  closeModalOptions() {
    this.setState({
      openModalOptions: false,
      enableOption: false,
    });
  }

  openModalOptions(e, data) {
    this.setState({
      openModalOptions: true,
      usernamespecial: data.name,
    });
  }

  render() {
    let closeOnDimmerClick;
    const customOptionsNameMethod = (filter, row) => {
      if (filter.value === '') {
        return true;
      }
      let name;

      if (row.firstName === undefined || row.firstName === null) {
        name = 'No posee';
      } else {
        name = row.firstName;
      }

      if (name.toLowerCase().includes(filter.value.toLowerCase()) === false) {
        return name.includes(filter.value);
      } else {
        return true;
      }
    };

    const customOptionsLastNameMethod = (filter, row) => {
      if (filter.value === '') {
        return true;
      }
      let lastName;

      if (row.lastName === undefined) {
        lastName = 'No posee';
      } else {
        lastName = row.lastName;
      }

      if (
        lastName.toLowerCase().includes(filter.value.toLowerCase()) === false
      ) {
        return lastName.includes(filter.value);
      } else {
        return true;
      }
    };

    const customOptionsPhoneMethod = (filter, row) => {
      if (filter.value === '') {
        return true;
      }
      let phone;

      if (row.phone === undefined) {
        phone = 'No posee';
      } else {
        phone = row.phone;
      }

      if (phone.toLowerCase().includes(filter.value.toLowerCase()) === false) {
        return phone.includes(filter.value);
      } else {
        return true;
      }
    };

    const customOptionsEmailMethod = (filter, row) => {
      if (filter.value === '') {
        return true;
      }

      let email;

      if (row.email === undefined) {
        email = 'No posee';
      } else {
        email = row.email;
      }

      if (email.toLowerCase().includes(filter.value.toLowerCase()) === false) {
        return email.includes(filter.value);
      } else {
        return true;
      }
    };

    const listspecialOptions = [
      {
        key: 'ACTIVATE_GIFT_CARDS',
        text: 'Activación de Tarjetas de Recarga',
        value: 'ACTIVATE_GIFT_CARDS',
      },
      {
        key: 'REQUEST_DEBIT_CARDS',
        text: 'Solicitud de Tarjetas de Débito',
        value: 'REQUEST_DEBIT_CARDS',
      },
      {
        key: 'ONE_DEPOSIT_VERIFICATION',
        text: 'Verificación de un depósito',
        value: 'ONE_DEPOSIT_VERIFICATION',
      },
    ];

    const listColors = [
      {
        key: 'select',
        text: 'seleccione',
        value: null,
        //description: "",
      },
      {
        key: 'red',
        text: 'Rojo',
        value: 'red',
        //description: "Usuario Estafador",
      },
      {
        key: 'purple',
        text: 'Violeta',
        value: 'purple',
        //description: "Usuario problemático",
      },
      {
        key: 'green',
        text: 'Verde',
        value: 'green',
        //description: "Usuario Confiable",
      },
      {
        key: 'yellow',
        text: 'Amarillo',
        value: 'yellow',
        //description: "Usuario Sospechoso",
      },
      {
        key: 'black',
        text: 'Negro',
        value: 'black',
        //description: "Usuario Suspendido",
      },
      {
        key: 'orange',
        text: 'Naranja',
        value: 'orange',
        //	description: "Usuario en Investigacion",
      },
      {
        key: 'blue',
        text: 'Azul',
        value: 'blue',
        //	description: "Usuario en Investigacion",
      },
      {
        key: 'grey',
        text: 'Gris',
        value: 'grey',
        //	description: "Usuario en Investigacion",
      },
    ];

    const userTableHeaders = [
      {
        Header: <Icon name='trash' />,
        accessor: 'checked',
        width: 32,
        Cell: (row) => {
          if (row.value !== '' || row.value !== undefined) {
            var icon;
            return (icon = (
              <Checkbox
                value={row.original.name}
                onClick={this.handleChecked.bind(this)}
                checked={row.value}
              />
            ));
          }
          return <div>{icon}</div>;
        },
      },
      {
        Header: 'Alerta',
        accessor: 'flag',
        width: 100,
        Cell: (row) => {
          let colorflag;
          Object.entries(row.original).forEach(([k, v]) => {
            if (k === 'flag') {
              colorflag = v.color.toLowerCase();
            }
          });
          if (
            colorflag !== undefined &&
            colorflag !== '' &&
            colorflag !== null
          ) {
            return <Label circular color={colorflag} />;
          } else {
            return <div>No posee</div>;
          }
        },
      },
      {
        Header: 'Nombre de usuario',
        accessor: 'name',
        width: 150,
        filterable: true,
      },
      {
        Header: 'Nombre',
        accessor: 'firstName',
        width: 120,
        filterable: true,
        filterMethod: (filter, row) => customOptionsNameMethod(filter, row),
        Cell: (row) => {
          if (row.value === '' || row.value === undefined) {
            return <div>No posee</div>;
          } else {
            return <div>{row.value}</div>;
          }
        },
      },
      {
        Header: 'Apellido',
        accessor: 'lastName',
        width: 120,
        filterable: true,
        filterMethod: (filter, row) => customOptionsLastNameMethod(filter, row),
        Cell: (row) => {
          if (row.value === '' || row.value === undefined) {
            return <div>No posee</div>;
          } else {
            return <div>{row.value}</div>;
          }
        },
      },
      {
        Header: 'Telefono',
        accessor: 'phone',
        width: 120,
        filterable: true,
        filterMethod: (filter, row) => customOptionsPhoneMethod(filter, row),
        Cell: (row) => {
          if (
            row.value === '' ||
            row.value === undefined ||
            row.value === 'undefined'
          ) {
            return <div>No posee</div>;
          } else {
            return <div>{row.value}</div>;
          }
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        width: 250,
        filterable: true,
        filterMethod: (filter, row) => customOptionsEmailMethod(filter, row),
        Cell: (row) => {
          if (row.value === '' || row.value === undefined) {
            return <div>No posee</div>;
          } else {
            return <div>{row.value}</div>;
          }
        },
      },
      {
        Header: 'Tipo de usuario',
        accessor: 'type',
        width: 100,
        Cell: (row) => {
          if (row.value === 'BANKER') {
            return <div>BANQUERO</div>;
          } else {
            return <div>{row.value}</div>;
          }
        },
      },
      {
        Header: 'Registro desde',
        accessor: 'origin',
        width: 100,
      },
      {
        Header: 'Estatus',
        accessor: 'active',
        width: 60,
        Cell: (row) => {
          if (row.value === true) {
            return <div>Activo</div>;
          } else {
            return (
              <div>
                <div>Inactivo</div>
              </div>
            );
          }
        },
      },
      {
        Header: 'Acción',
        width: 230,
        Cell: (row) => {
          return (
            <div>
              <Button
                icon={row.original.active ? 'minus circle' : 'check circle'}
                circular
                compact
                size='tiny'
                color='blue'
                title={row.original.active ? 'Inactivar' : 'Activar'}
                style={{ marginLeft: 45 }}
                name={row.original.name}
                onClick={this.handleInactiveButton.bind(this)}
              />
              {(row.original.type === 'NORMAL' ||
                row.original.type === 'BROKER' ||
                row.original.type === 'BANKER') && (
                <Button
                  icon='gem'
                  circular
                  compact
                  size='small'
                  color='blue'
                  title='Cambiar perfil'
                  name={row.original.name}
                  onClick={this.handleBrokerButton.bind(this)}
                />
              )}
              <Button
                icon='delete'
                circular
                compact
                size='tiny'
                color='blue'
                title='Eliminar'
                name={row.original.name}
                onClick={this.handleDeleteButton.bind(this)}
              />
              <Button
                icon='lock'
                circular
                compact
                size='tiny'
                color='blue'
                title='Cerrar Sesión Manualmente'
                name={row.original.name}
                onClick={this.handleCloseSessionUser.bind(this)}
              />
              <Button
                icon='flag'
                circular
                compact
                size='tiny'
                color='blue'
                title='Agregar Alerta'
                name={row.original.name}
                onClick={this.setUserNameTable.bind(this)}
              />
              <Button
                circular
                icon='magic'
                compact
                size='tiny'
                color='blue'
                title='Opciones Especiales'
                name={row.original.name}
                onClick={this.openModalOptions.bind(this)}
              />
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Form>
          <Form.Group>
            <Form.Field>
              <label>Usuario a consultar:</label>
              <input
                placeholder='Indique un usuario'
                onChange={this.handleSearchUser}
              />
            </Form.Field>
            <Form.Button
              disabled={this.state.userToSearch === ''}
              icon
              labelPosition='left'
              color='blue'
              style={{ marginTop: 23 }}
              type='submit'
              onClick={this.getUser.bind(this)}
              loading={this.state.loadSearch}
            >
              <Icon name='search' />
              Buscar
            </Form.Button>
          </Form.Group>
        </Form>
        <Grid>
          <Grid.Column largeScreen={16} mobile={16} computer={16} tablet={16}>
            <Segment basic loading={this.state.load}>
              {this.state.view && (
                <ReactTable
                  data={this.state.data}
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
                  /*defaultFilterMethod={(filter, row, column) => {
            const id = filter.pivotId || filter.name;
            return row[id] !== undefined
              ? String(row[id]).startsWith(filter.value.toUpperCase())
              : true;
          }}*/
                />
              )}
            </Segment>
          </Grid.Column>
        </Grid>
        {this.state.showUserRemove && (
          <Button
            color='blue'
            type='submit'
            style={{ marginLeft: 20 }}
            onClick={this.removeUserList}
          >
            Eliminar Usuarios Seleccionados
          </Button>
        )}
        <Modal
          closeIcon
          open={this.state.openModal}
          onClose={this.closeModal.bind(this)}
        >
          <Modal.Header>{'Seleccione el Tipo de la Alerta'}</Modal.Header>

          <Modal.Content>
            <Segment loading={this.state.loadModal}>
              <p>
                ¿Está seguro que desea este color para la nueva alerta de este
                usuario?
              </p>
              <Form>
                <Form.Group inline>
                  <label>
                    <b>Tipo de Alerta</b>
                  </label>
                  <Form.Select
                    search
                    options={listColors}
                    onChange={this.handleColors2.bind(this)}
                  ></Form.Select>

                  {this.state.colorSelected2 !== '' && (
                    <Label
                      circular
                      color={this.state.colorSelected2}
                      style={{ marginLeft: '20px' }}
                    />
                  )}

                  {this.state.colorSelected2 !== '' && (
                    <Label style={{ marginLeft: '20px' }}>
                      {this.state.colorSelected2.toLowerCase() === 'green'
                        ? 'Usuario Confiable'
                        : this.state.colorSelected2.toLowerCase() === 'purple'
                        ? 'Usuario problemático'
                        : this.state.colorSelected2.toLowerCase() === 'red'
                        ? 'Posible Estafador'
                        : this.state.colorSelected2.toLowerCase() === 'black'
                        ? 'Usuario Suspendido'
                        : this.state.colorSelected2.toLowerCase() === 'orange'
                        ? 'Usuario en Investigación'
                        : this.state.colorSelected2.toLowerCase() === 'yellow'
                        ? 'Usuario Sospechoso'
                        : this.state.colorSelected2.toLowerCase() === 'blue'
                        ? 'Usuario VIP'
                        : this.state.colorSelected2.toLowerCase() === 'grey'
                        ? 'Usuario de pruebas'
                        : ''}
                    </Label>
                  )}
                </Form.Group>
              </Form>
              {this.state.showMessage2 && (
                <Message color={this.state.colorMessage}>
                  <p>{this.state.message}</p>
                </Message>
              )}
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {this.state.colorSelected2 !== '' &&
              this.state.colorSelected2 !== undefined && (
                <div>
                  <Button onClick={this.closeModal.bind(this)} negative>
                    <Icon name='remove' />
                    No
                  </Button>
                  <Button onClick={this.addFlag.bind(this)} positive>
                    <Icon name='checkmark' />
                    Si
                  </Button>
                </div>
              )}
          </Modal.Actions>
        </Modal>

        <Modal
          open={this.state.showInactivateConfirm}
          onClose={this.close.bind(this)}
        >
          <Modal.Header>
            {this.state.userSelected.active
              ? 'Inactivar Usuario'
              : 'Activar Usuario'}
          </Modal.Header>

          <Modal.Content>
            <p>
              ¿Está seguro que desea{' '}
              {this.state.userSelected.active ? 'inactivar' : 'activar'} este
              usuario?
            </p>
            {this.state.showMessage && (
              <Message color={this.state.colorMessage}>
                <p>{this.state.message}</p>
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            {!this.state.viewButtons && (
              <div>
                <Button onClick={this.close} negative>
                  <Icon name='remove' />
                  No
                </Button>

                <Button
                  onClick={
                    this.state.userSelected.active
                      ? this.inactivationUser.bind(this)
                      : this.activationUser.bind(this)
                  }
                  positive
                >
                  <Icon name='checkmark' />
                  Si
                </Button>
              </div>
            )}
          </Modal.Actions>
        </Modal>

        <Modal
          open={this.state.showDeleteConfirm}
          onClose={this.close}
          loading={this.state.loading}
        >
          <Modal.Header>Eliminar Usuario</Modal.Header>

          <Modal.Content>
            <Segment loading={this.state.loading}>
              <p>¿Está seguro que desea eliminar este usuario?</p>
              {this.state.showMessage && (
                <Message color={this.state.colorMessage}>
                  <p>{this.state.message}</p>
                </Message>
              )}
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.viewButtons && (
              <div>
                <Button onClick={this.close} negative>
                  <Icon name='remove' />
                  No
                </Button>

                <Button onClick={this.deleteUser.bind(this)} positive>
                  <Icon name='checkmark' />
                  Si
                </Button>
              </div>
            )}
          </Modal.Actions>
        </Modal>

        <Modal
          open={this.state.showModalBroker}
          onClose={this.close.bind(this)}
        >
          <Modal.Header>Cambiar perfil</Modal.Header>

          <Modal.Content>
            <p>
              ¿Está seguro que desea cambiar el perfil de{' '}
              <strong>{this.state.userSelected.name}</strong>?
            </p>
            <Select
              style={{ marginLeft: 15 }}
              search
              placeholder='Seleccione un perfil'
              options={this.state.selectTypeChange}
              onChange={this.SelectType.bind(this)}
              value={this.state.typeSelected}
            />
            {this.state.showMessage && (
              <Message color={this.state.colorMessage}>
                <p>{this.state.message}</p>
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            {!this.state.viewButtons && (
              <div>
                <Button onClick={this.close.bind(this)} negative>
                  <Icon name='remove' />
                  No
                </Button>

                <Button onClick={this.changeToBroker.bind(this)} positive>
                  <Icon name='checkmark' />
                  Si
                </Button>
              </div>
            )}
          </Modal.Actions>
        </Modal>

        <Modal
          open={this.state.waitRemoveUsers}
          onClose={!this.state.waitRemoveUsers}
        >
          <Modal.Header>Eliminar Usuarios</Modal.Header>

          <Modal.Content>
            {!this.state.showMessageRemove && (
              <p>Espere, este proceso puede tardar algunos minutos ...</p>
            )}
            {this.state.showMessageRemove && (
              <Message color={this.state.colorMessageRemove}>
                <p>{this.state.messageRemove}</p>
              </Message>
            )}
          </Modal.Content>
          <Modal.Actions>
            {this.state.showMessageRemove && (
              <Button color='grey' onClick={this.closeModal.bind(this)}>
                Cerrar
              </Button>
            )}
          </Modal.Actions>
        </Modal>

        <Modal
          open={this.state.showCloseSessionManually}
          onClose={this.close.bind(this)}
          loading={this.state.loading}
        >
          <Modal.Header>Cerrar Sesión de usuario manualmente</Modal.Header>

          <Modal.Content>
            <Segment loading={this.state.loading}>
              <p>
                ¿Está seguro que desea cerrar manualmente la sesión de este
                usuario?
              </p>
              {this.state.showMessage && (
                <Message color={this.state.colorMessage}>
                  <p>{this.state.message}</p>
                </Message>
              )}
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {!this.state.viewButtons && (
              <div>
                <Button onClick={this.close} negative>
                  <Icon name='remove' />
                  No
                </Button>

                <Button onClick={this.closeSessionUser.bind(this)} positive>
                  <Icon name='checkmark' />
                  Si
                </Button>
              </div>
            )}
          </Modal.Actions>
        </Modal>

        <Modal
          closeIcon
          open={this.state.openModalOptions}
          onClose={this.closeModalOptions.bind(this)}
        >
          <Modal.Header>{'Seleccione la opcion a habilitar'}</Modal.Header>

          <Modal.Content>
            <Segment loading={this.state.loadingSpecial}>
              <p>
                ¿Está seguro que desea habilitar la nueva opcion para este
                usuario?
              </p>
              <Form>
                <Form.Group inline>
                  <label>
                    <b>Tipo de Opción a Habilitar</b>
                  </label>
                  <Form.Select
                    search
                    options={listspecialOptions}
                    onChange={this.handleSpecialOptions.bind(this)}
                  ></Form.Select>
                  <Form.Field>
                    <label>Activo:</label>
                  </Form.Field>
                  <Form.Field>
                    <Form.Checkbox
                      //	value={this.state.enableOption}
                      onClick={this.handleCheckedOption.bind(this)}
                      checked={this.state.enableOption}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group inline>
                  {this.state.enableActivateGiftCards && (
                    <Icon name='check' color='green' />
                  )}
                  {!this.state.enableActivateGiftCards && (
                    <Icon name='ban' color='red' />
                  )}
                  <label>
                    <b>Activación de Tarjetas de Recarga</b>
                  </label>
                  {this.state.enableRequestDebitCards && (
                    <Icon name='check' color='green' />
                  )}
                  {!this.state.enableRequestDebitCards && (
                    <Icon name='ban' color='red' />
                  )}
                  <label>
                    <b>Solicitud de Tarjetas de Débito</b>
                  </label>
                  {this.state.enableOneDepositVerification && (
                    <Icon name='check' color='green' />
                  )}
                  {!this.state.enableOneDepositVerification && (
                    <Icon name='ban' color='red' />
                  )}
                  <label>
                    <b>Verificación de un depósito</b>
                  </label>
                </Form.Group>
              </Form>
              {this.state.showMessageSpecial && (
                <Message color={this.state.colorMessage}>
                  <p>{this.state.message}</p>
                </Message>
              )}
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            {this.state.specialOption !== '' &&
              this.state.specialOption !== undefined && (
                <div>
                  <Button onClick={this.closeModalOptions.bind(this)} negative>
                    <Icon name='remove' />
                    No
                  </Button>
                  <Button onClick={this.specialOption.bind(this)} positive>
                    <Icon name='checkmark' />
                    Si
                  </Button>
                </div>
              )}
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default UserAdministration;
