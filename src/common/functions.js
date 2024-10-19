export default {
  listFunctions: [
    {
      key: 'balance',
      value: 'balance',
      text: 'Balance y operaciones de cuentas',
    },
    {
      key: 'otc_offers',
      value: 'otc_offers',
      text: 'Ofertas OTC',
    },
    {
      key: 'otc_operations',
      value: 'otc_operations',
      text: 'Operaciones OTC',
    },
    {
      key: 'market_operations',
      value: 'market_operations',
      text: 'Operaciones de Mercados',
    },
    {
      key: 'users',
      value: 'users',
      text: 'Usuarios',
    },
    {
      key: 'market_modulator',
      value: 'market_modulator',
      text: 'Modulador de Mercados',
    },
    {
      key: 'balance_of_operations',
      value: 'balance_of_operations',
      text: 'Balance de operaciones',
    },
    {
      key: 'rols_and_operators',
      value: 'rols_and_operators',
      text: 'Roles y operadores',
    },
    {
      key: 'config_retails',
      value: 'config_retails',
      text: 'Puntos de Intercambio',
    },
    {
      key: 'communications',
      value: 'communications',
      text: 'Comunicaciones',
    },
    {
      key: 'notifications',
      value: 'notifications',
      text: 'Notificaciones',
    },
    {
      key: 'external_send',
      value: 'external_send',
      text: 'Envíos Externos',
    },
    {
      key: 'manage_request',
      value: 'manage_request',
      text: 'Adminitrar Solicitudes',
    },
    {
      key: 'config_cash_locations',
      value: 'config_cash_locations',
      text: 'Puntos de Efectivo',
    },
  ],

  getMap() {
    let functionsMap = new Map();
    // functionsMap.set("balance", [
    //   "balance_master_accounts",
    //   "balance_payments",
    //   "balance_wallets",
    //   "balance_send_external_wallets",
    //   "balance_payments_add",
    //   "master_account_send_bitcoins",
    //   "master_account_receive_bitcoins",
    // ]);
    functionsMap.set('balance', [
      'consult_master_accounts',
      'otc_account_configuration',
      'otc_account_transactions',
      'send_bitcoins',
      'receive_bitcoins',
      'consult_operations_report',
      'create_means_of_payment',
      'edit_payment_methods',
      'consult_balance',
      'create_crypto_portfolios',
      'check_crypto_portfolios',
    ]);
    functionsMap.set('otc_offers', [
      'otc_offers_add',
      'otc_offers_list',
      'otc_offers_old',
      'otc_offers_factorChange',
    ]);
    functionsMap.set('otc_operations', []);
    functionsMap.set('market_operations', []);
    functionsMap.set('users', [
      'users_verifications',
      'users_data',
      'users_profiles',
      'users_administration',
    ]);
    functionsMap.set('market_modulator', []);
    functionsMap.set('notifications', []);
    functionsMap.set('balance_of_operations', []);
    functionsMap.set('rols_and_operators', []);
    functionsMap.set('config_retails', []);
    functionsMap.set('config_cash_locations', []);
    // functionsMap.set("rols_and_operators", []);
    functionsMap.set('communications', [
      'communications_chat',
      'communications_telegram',
    ]);
    functionsMap.set('external_send', []);
    functionsMap.set('manage_request', [
      'debit_card_request',
      'gift_card_request',
    ]);
    return functionsMap;
  },
  geList() {
    return this.listFunctions;
  },
  // getFunctionsSpanish() {
  //   let map = new Map();
  //   map.set("balance", "Balance");
  //   map.set("Balance", "Balance");
  //   map.set("balance_master_accounts", "Balance de cuentas maestras");
  //   map.set(
  //     "master_account_send_bitcoins",
  //     "Enviar Bitcoins desde cuentas maestras"
  //   );
  //   map.set(
  //     "master_account_receive_bitcoins",
  //     "Recibir Bitcoin en cuenta maestra"
  //   );
  //   map.set("balance_payments", "Medios de pago");
  //   map.set("balance_wallets", "Balance de Wallets");
  //   map.set("balance_send_external_wallets", "Envios a Wallet externas");
  //   map.set("balance_payments_add", "Crear medios de pago");
  //   map.set("Ofertas OTC", "Ofertas OTC");
  //   map.set("otc_offers", "Ofertas OTC");
  //   map.set("otc_offers_add", "Agregar oferta");
  //   map.set("otc_offers_list", "Lista de ofertas");
  //   map.set("otc_offers_old", "Historial de ofertas");
  //   map.set("otc_offers_factorChange", "Factor de cambio");
  //   map.set("Operaciones OTC", "Operaciones OTC");
  //   map.set("otc_operations", "Operaciones OTC");
  //   map.set("market_operations", "Operaciones de Mercados");
  //   map.set("users", "Usuarios");
  //   map.set("users_verifications", "Verificación de usuarios");
  //   map.set("users_administration", "Administrar usuarios");
  //   map.set("users_data", "Datos de usuarios");
  //   map.set("users_profiles", "Perfiles de usuario");
  //   map.set("market_modulator", "Modulador de Mercado");
  //   map.set("balance_of_operations", "Balance de operaciones");
  //   map.set("rols_and_operators", "Roles y operadores");
  //   // map.set("rols_and_operators", "Roles y operadores");
  //   map.set("config_retails", "Puntos de Intercambio");
  //   map.set("communications", "Comunicaciones");
  //   map.set("notifications", "Notificaciones");
  //   map.set("external_send", "Envíos Externos");
  //   map.set("communications_chat", "Operar Chat");
  //   map.set("communications_telegram", "Operar Telegram");
  //   return map;
  // },
  getFunctionsSpanish() {
    let map = new Map();
    map.set('balance', 'Balance y operaciones de cuentas');
    map.set('consult_master_accounts', 'Consultar cuentas maestras');
    map.set('otc_account_configuration', 'Configuración de cuentas OTC');
    map.set('otc_account_transactions', 'Transacciones de cuentas OTC');
    map.set('send_bitcoins', 'Enviar Bitcoins');
    map.set('receive_bitcoins', 'Recibir Bitcoins');
    map.set('consult_operations_report', 'Consultar informe de operaciones');
    map.set('create_means_of_payment', 'Crear medios de pago');
    map.set('edit_payment_methods', 'Editar medios de pago');
    map.set('consult_balance', 'Consultar Balances');
    map.set('create_crypto_portfolios', 'Crear criptocarteras');
    map.set('check_crypto_portfolios', 'Consultar criptocarteras');
    map.set('otc_offers', 'Ofertas OTC');
    map.set('otc_offers_add', 'Agregar oferta');
    map.set('otc_offers_list', 'Lista de ofertas');
    map.set('otc_offers_old', 'Historial de ofertas');
    map.set('otc_offers_factorChange', 'Factor de cambio');
    map.set('otc_operations', 'Operaciones OTC');
    map.set('market_operations', 'Operaciones de Mercados');
    map.set('users', 'Usuarios');
    map.set('users_verifications', 'Verificación de usuarios');
    map.set('users_administration', 'Administrar usuarios');
    map.set('users_data', 'Datos de usuarios');
    map.set('users_profiles', 'Perfiles de usuario');
    map.set('market_modulator', 'Modulador de Mercado');
    map.set('balance_of_operations', 'Balance de operaciones');
    map.set('rols_and_operators', 'Roles y operadores');
    // map.set("rols_and_operators", "Roles y operadores");
    map.set('config_retails', 'Puntos de Intercambio');
    map.set('communications', 'Comunicaciones');
    map.set('notifications', 'Notificaciones');
    map.set('external_send', 'Envíos Externos');
    map.set('communications_chat', 'Operar Chat');
    map.set('communications_telegram', 'Operar Telegram');
    map.set('manage_request', 'Administrar Solicitudes');
    map.set('debit_card_request', 'Tarjetas de débito');
    map.set('config_cash_locations', 'Puntos de Efectivo');
    return map;
  },
};
