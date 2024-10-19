import termsAndConditions from "../common/termsAndConditions";
import termsAndConditionsEng from "../common/termsAndConditionsEnglish";
import termsSell from "../common/termAndConditionsSell";
import termsSellEng from "../common/termAndConditionsSellEnglish";
import termsBuy from "../common/termsAndConditionsBuy";
import termsBuyEng from "../common/termsAndConditionsBuyEnglish";
import MessageGiftCard_en from "../common/MessageGiftCard_en";
import MessageGiftCard_es from "../common/MessageGiftCard_es";
export default {
  es: {
	giftCard: MessageGiftCard_es,
    app: {
      modalSession: {
        header: "Notificación",
        content: {
          part1: "Su sesión expira en ",
          part2: " segundos, ¿desea continuar en el portal?",
        },
        buttonYes: "Si",
      },
      modalSessionExpired: {
        header: "Notificación",
        content: "Su sesión ha expirado",
        buttonClose: "Cerrar",
      },
    },
    commons: {
      benefits: {
        header: "Beneficios de trabajar con nosotros",
        items: {
          first: {
            header: "Pago rápido y seguro",
            content:
              "En nuestra comunidad sus pagos serán más rápidos y seguros.",
          },
          second: {
            header: "La seguridad es nuestro pilar operativo.",
            content:
              "Nuestras operaciones cuentan con altos niveles de seguridad para resguardar tus datos.",
          },
          third: {
            header: "No hay riesgo en sus transacciones",
            content:
              "Vender tus bitcoins o comprar con nosotros es libre y seguro.",
          },
        },
      },
      coins: {
        usd: "Dólar estadounidense",
        ves: "Bolívar",
        cop: "Peso Colombiano",
        eur: "Euro",
        rd$: "Dólar Dominicano",
        clp: "Peso Chileno",
        pen: "Sol Peruano",
        brl: "Real Brasileño",
        ars: "Peso Argentino",
        mxn: "Peso Méxicano",
        eth: "Ether",
        cad: "Dólar canadiense",
        cny: "Yuan renminbi",
        rub: "Rublo ruso",
        inr: "Rupia",
        jpy: "Yen japonés",
        chf: "Franco suizo",
        crc: "Colón costarricense",
        pab: "Balboa panameño",
        paUsd: "USD en Panamá",
      },
      avgSell: "Venta promedio",
      avgBuy: "Compra promedio",
    },
    nav: {
      init: "Inicio",
      availableBalance: "Saldo Disponible",
      profile: "Perfil",
      logout: "Cerrar Sesión",
      newAddressModal: {
        header: "Actualización de Address",
        body: {
          successMessage:
            "Su address ha sido renovada. Recuerde que las address tienen un tiempo limitado y son renovadas al caducar.",
          errorMessage:
            "Su address ha caducado y no ha podido ser renovada de forma automática, lo invitamos a dirigirse a Wallet para renovar manualmente su address.",
          commonMessage: {
            part1: "Todas ",
            part2: "sus address anteriores son válidas ",
            part3: "para seguir operando con ellas.",
          },
        },
        buttonClose: "Cerrar",
        buttonOk: "Ir a Wallets",
      },
    },
    navPublic: {
      lang: {
        es: "Español",
        en: "Inglés",
        resume: {
          es: "Esp",
          en: "Ing",
        },
      },
      account: {
        header: "Cuenta",
        options: {
          login: "Iniciar Sesión",
          signup: "Registrarse",
          hft: "Planes HFT",
          transactions: "Transacciones",
          wallet: "Wallet",
          sell: "Vender Bitcoins",
          buy: "Comprar Bitcoins",
          forum: "Foro",
          fixedTermAccounts: "Cuentas A Plazo Fijo",
        },
      },
    },
    navCommons: {
      market: "Mercado: ",
      buy: "COMPRAR BITCOINS",
      buyMobile: "Comprar Bitcoins",
      sell: "VENDER BITCOINS",
      sellMobile: "Vender Bitcoins",
      forum: "FORO",
      forumMobile: "Foro",
      help: {
        header: "AYUDA",
        headerMobile: "Ayuda",
        options: {
          who: "Quiénes Somos",
          support: "Soporte",
          faqs: "Preguntas Frecuentes",
          guide: "Guía de Cryptos",
          blockchain: "Blockchain: La revolución industrial del internet",
          contact: "Contáctenos",
          limits: "Límites de operaciones",
          legal: "Legal",
          charges: "Cargos por operaciones",
        },
      },
      coins: {
        buy: "Comprar",
        sell: "Vender",
        options: {
          placeholder: "Seleccione moneda",
          usd: "US Dólar",
          ves: "Bolívar Venezolano",
          cop: "Peso Colombiano",
          eur: "Euro",
          rd$: "Dólar Dominicano",
          clp: "Peso Chileno",
          pen: "Sol Peruano",
          brl: "Real Brasileño",
          ars: "Peso Argentino",
          mxn: "Peso Méxicano",
          crc: "Colón costarricense",
          pab: "Balboa panameño",
          paUsd: "USD en Panamá",
          eth: "Ether",
        },
      },
    },
    contact: {
      header: "Contáctenos",
      name: "Nombre Completo",
      email: "Email",
      phone: "Teléfono",
      subject: "Asunto",
      buttonSend: "Enviar",
      placeholder: {
        name: "Nombre y Apellido",
        email: "Email",
        subject: "Asunto",
        message: "Mensaje",
      },
      post: {
        error: {
          header: "Error",
          message: "Ha ocurrido un error. Intente de nuevo por favor",
          type: {
            name: "El campo Nombre Completo es requerido",
            email: "El campo Email es requerido",
            phone: "El campo Teléfono es requerido",
            subject: "El campo Asunto es requerido",
            message: "El campo Mensaje es requerido",
          },
        },
        success: {
          header: "Genial",
          message:
            "Gracias por contactarnos. Te responderemos a la brevedad posible",
        },
      },
    },
    login: {
      header: "Iniciar Sesión",
      compleAccount: "DATOS USUARIO MONEYCLICK",
      compleAccount2: "Completar Datos",
      form: {
        email: "Email de usuario",
        password: "Contraseña",
        captcha: "Por favor, demuestre que usted es humano",
        forgotPassword: "Olvidé mi contraseña",
        userMoney: "Soy usuario MoneyClick",
        continue: "Continuar",
        optionsUser: "O",
      },
      errors: {
        credentials: {
          header: "Error en las credenciales",
          content: "Su usuario no ha podido ser autenticado.",
          previusSession:
            "Hemos detectado que existe un inicio de sesión en dollarbtc o en una de nuestras plataformas asociadas y por su seguridad no podemos permitir el ingreso. Le recordamos que solo puede mantener una sesión activa. Cualquier duda, comuníquese con Atención al Cliente a través de: +17865805417  +17862669272",
        },
        errorCaptcha:
          "Ha ocurrido un error inesperado. Por favor, intente más tarde.",
        errorProTrader: "Su usuario es PRO_TRADER debe ingresar en:",
        errorCaptcha2: "No verifico si es humano",
        errorRequired: "Este campo es requerido",
        errorCaptcha3: " El usuario no esta registrado o no esta activo",
        UserMcIncomplete:
          "Usted es un usuario MoneyClick, Por favor presione 'Soy usuario MoneyClick'",
        deviceInUser: "Este dispositivo ya está agregado",
        userNotFound: "No se encuentra el usuario asociado a este dispositivo",
        unexpectedError: "Ha ocurrido error inesperado. Intente más tarde",
        notContent: "",
        individualField:
          "Por favor acceda con uno de los dos campos (email o teléfono)",
        completeFields:
          "Complete los campos necesarios para su inicio de sesión",
        deviceNotAllowedByUser:
          "No se ha autorizado este navegador. No puede iniciar sesión",
      },
      modalUpdateDevice: {
        header: "Control de dispositivos",
        contentUpdate:
          "El navegador desde el cual intenta acceder se encuentra inactivo. ¿Desea activarlo ahora? ",
        contentAdd:
          "Está intentando acceder desde un dispositivo que no usa frecuentemente. Recomendamos, sólo utilizar dispositivos confiables y de uso personal. ¿Desea acceder de todos modos?",
        buttonYes: "Si",
        buttonNo: "No",
        loading: "Cargando...",
      },
      successUpdating: {
        updateDevice: "Este navegador ha sido reactivado exitosamente",
        addDevice: "Este navegador ha sido agregado exitosamente",
      },
    },
    moneyclick: {
      menu: {
        moneyclick: "MoneyClick",
        retail: " Punto de venta",
      },
      balanceAvailable: "Saldo MoneyClick disponible",
      downloadMoneyclick: "Descarga MoneyClick",
      downloadMoneyclickRetail: "Descarga MoneyClick Retail",
      downloadMoneyclickRetailAdmin: "Descarga MoneyClick Retail Admin",
    },
    registration: {
      header: "Registro de usuario",
      continue: "Enviar",
      completeAccount: "Completar Registro",
      signup: "Registrar",
      form: {
        username: "Nombre de usuario",
        email: "Email",
        password: {
          label: "Contraseña",
          placeholder: "Ingrese un mínimo de cuatro caracteres",
        },
        confirmPassword: "Confirmar contraseña",
        captcha: "Por favor, demuestre que usted es un humano",
        companyText: "¿Desea registrarse como empresa?",
        terms: {
          first: "Acepta los ",
          second: "Términos y Condiciones",
        },
      },
      alreadyExists: "Ya estoy registrado",
      cancelAccount: "Regresar",
      modalTerms: {
        header: "Términos y Condiciones",
        content: termsAndConditions,
        agreeButton: "De acuerdo",
        closeButton: "Cerrar",
      },
      modalResult: {
        headerSuccess: "Bienvenido",
        headerError: "Notificacion",
        headerCompleteAccount:
          "Querido usuario para ingresar al portal es necesario que agregues tu correo electrónico y un nombre de usuario",
        closeButton: "Cerrar",
        resultPost: {
          headerComplete:
            "Enhorabuena acabas de completar tu registro en dollarBTC.com, a partir de ahora podrás ingresar con tu correo electrónico y además",
          header:
            " Enhorabuena acabas de registrarte en dollarBTC.com, a partir de ahora podrás",
          items: {
            line1: " Guardar tus bitcoins de forma segura. ",
            line2:
              "Enviar o recibir pagos en bitcoins y otras altcoins desde cualquier parte del mundo.",
            line3: "Recibir líneas de crédito sobre tus BTC (Próximamente).",
            line4:
              "Invertir en nuestros planes HFT generando ganancias con tus BTC.",
            line5: "Saber el precio real de dólar americano en cualquier país.",
          },
          warningMessage:
            "Para operar en nuestro portal es necesario verificar tu usuario. Puedes iniciar este proceso desde tu perfil en la opción Actualizar datos",
          infoMessage:
            "Te enviamos un correo, por favor revisa y sigue las instrucciones.",
        },
      },
      errors: {
        form: {
          username: "Nombre de usuario ya existe",
          email: "Direccion de correo invalida",
          alreadyEmail: "Email ya está en uso",
          password: "Este campo debe contener más de 4 caracteres",
          confirmPassword: "Este campo no coincide con la contraseña",
          captcha: "No ha verificado que es un humano",
          phone: "teléfono del usuario ya existe",
          terms:
            "Es necesario que acepte los términos y condiciones de nuestra plataforma ",
        },
        resultPost:
          "Disculpe no hemos podido registrar su cuenta disculpe las molestias intente mas tarde",
        errorRequiredField: "Este campo es requerido",
        unexpectedError:
          "Disculpe ha ocurrido un error inesperado intente mas tarde.",
        errorMaxLongitude: "La Longitud máxima es de 20 caracteres",
        errorBlankSpace: "No se permiten espacios en blanco",
      },
    },
    who: {
      us: {
        title: "Quiénes Somos",
        content:
          "Dollarbtc.com es un portal financiero y dominio web registrado\n" +
          "            perteneciente a Sinep Financing llc. Nuestra empresa está\n" +
          "            constituida legalmente en el Estado de New Jersey/USA y registrada\n" +
          "            en el Departamento de Banca y Seguros. Autorizada para comercializar\n" +
          "            con cryptoactivos. Las Leyes de Estados Unidos, salvo en el Estado\n" +
          "            de Nueva York (donde es obligatorio tener una licencia especial si\n" +
          "            se comercia un equivalente de más de diez mil dólares diarios en\n" +
          "            cryptoactivos) permiten la libre compra venta de bitcoin.\n" +
          "            Actualmente nuestra empresa se encuentra en un proceso de registro y\n" +
          "            tramitación de permisos en varios países para poder operar como\n" +
          "            agente de intercambio de valores fiduciarios, por lo cual esperamos\n" +
          "            ir sumando más monedas locales a nuestra plataforma de manera\n" +
          "            progresiva.",
      },
      products: {
        title: "Nuestros Desarrollos",
        content:
          "Sinep Financing llc, ha desarrollado proyectos y software para\n" +
          "            gobiernos, empresas privadas o grupos de inversores en las\n" +
          "            siguientes áreas:",
      },
      opt: {
        title: "Operación Financiera",
        questions: {
          first: {
            title: "¿Qué tipo de Operador Financiero es dollarbtc.com?",
            answer:
              "Dollarbtc.com es un portal web que brinda varias soluciones\n" +
              "            digitales financieras para nuestros Usuarios:",
          },
        },
        items: {
          first:
            "• Análisis de precios reales del Bitcoin en cada país expresado en\n" +
            "            su propia moneda.",
          second:
            "• Plataforma de pagos por medio de Wallets calientes en la\n" +
            "            Blockchain de bitcoin.",
          third: "• Sistema de Arbitarje.",
          four: "• Depositos en Garantía.",
          five: "• Brokerage House.",
          six: "• Remesas.",
          seven: "• Trading.",
          eight: "• CryptoExchange.",
          nine: "• Lending.",
          ten: "• Portafolios de Inversión HFT.",
        },
        content: {
          p1:
            "Nuestra interface utiliza un sistema automatizado de scalping para\n" +
            "            hacer cruces de compra y venta entre diferentes cryptoactivos y\n" +
            "            optimizar el rendimiento por medio de repeticiones cíclicas de\n" +
            "            operaciones aprovechando las pequeñas variaciones de mercado,\n" +
            "            siempre con niveles máximos prefijados de ganancia y pérdidas para\n" +
            "            minimizar riesgos.",
          p2:
            "Los inversores disponen de acceso inmediato a sus inversiones donde\n" +
            "            podrán constatar las tasas ejecutadas de rentabilidad en tiempo\n" +
            "            real.",
          p3:
            "Nuestro sistema robotizado de operaciones permite participar del\n" +
            "            mercado de cryptos y tomar decisiones ante variaciones\n" +
            "            imperceptibles a la mente humana, realizando millones de operaciones\n" +
            "            simultaneas cuando las condiciones de mercado son ideales para\n" +
            "            operar y sacar beneficios.",
          p4:
            "Nuestra tecnología y lenguaje propio nos permite operar en modo HFT\n" +
            "            (trading de alta frecuencia en español) lo que significa que todas\n" +
            "            las operaciones se ejecutan en tiempo real y con parámetros\n" +
            "            preestablecidos para garantizar que el nivel de riesgo este\n" +
            "            minimizado en todo momento.",
          p5:
            "No usamos contratos por diferencia (CFD), ni ningún tipo de\n" +
            "            herramienta especulativa ni de simulación financiera. NO ARRIESGAMOS\n" +
            "            LOS BITCOIN DE NUESTRIOS CLIENTES EN INVERSIONES DE ALTO RIESGO NI\n" +
            "            QUE SUPEREN UNA PERDIDA MAXIMA DEL 6% DE SU CAPITAL. Nuestras\n" +
            "            operaciones se limitan a la compra/venta de cryptoactivos\n" +
            "            previamente analizados y escogidos bajo un estricto criterio de\n" +
            "            selección, por lo que en todo momento su inversión está respaldada\n" +
            "            por altcoin de altos niveles de capitalización y confiabilidad.\n" +
            "            Nuestra estrategia se basa en ganar poco pero seguido, usando la\n" +
            "            tecnología en beneficio de nuestras inversiones.",
          p6:
            "¿Para que existe la tecnología si no la podemos aplicar en nuestro\n" +
            "            beneficio de generar ingresos?",
          p7:
            "Por los momentos nuestra plataforma está limitada a operaciones\n" +
            "            dentro del ecosistema blockchain.",
          p8: "Valores de dollarbtc.com",
          p9: "• Confianza",
          p10: "• Seguridad",
          p11: "• Transparencia",
          p12: "• Rapidez",
          p13: "• Uso de la tecnología para mejorar las condiciones de vida",
        },
      },
      benefits: {
        title: "Beneficios",
        questions: {
          first: {
            title: "¿Cómo se benefician nuestros clientes?",
            answer:
              "Los más importantes Exchange del mundo proporcionan la información\n" +
              "            instantánea a nuestros bots por medio de su API. Con el\n" +
              "            procesamiento instantáneo de toda esa información se ejecutan\n" +
              "            millones de operaciones en tiempo real, esa es la forma en que\n" +
              "            multiplicamos sus bitcoin. Nuestra obligación frente a nuestros\n" +
              "            inversionistas es obtener los mejores beneficios con la recolección\n" +
              "            y procesamiento de toda la información obtenida y la aplicación de\n" +
              "            nuestros potentes algoritmos en las operaciones de trading.",
          },
        },
      },
      functioning: {
        title: "Funcionamiento",
        questions: {
          q1: {
            title: "¿Cómo nos conectamos a los principales Exchange Mundiales?",
            answer: {
              p1:
                "Usamos la API para estar directamente conectados a los libros de\n" +
                "            compra venta de las principales Exchange del mundo.",
              p2:
                "Por medio de un lenguaje de programación (open source) algunas de\n" +
                "            estas casas de cambio como Binance, Coinbase o HitBTC, permiten que\n" +
                "            usuarios Pro ingresen a sus plataformas para manejar múltiples\n" +
                "            cuentas de manera simultánea (master account).",
              p3:
                "Nuestro lenguaje se conecta directamente con la API de la casa de\n" +
                "            cambio y nos permite visualizar electrónicamente los libros de\n" +
                "            compra/venta y realizar operaciones directamente en la plataforma\n" +
                "            interna.",
            },
          },
          q2: {
            title: "¿Qué es API?",
            answer:
              "Una API representa la capacidad de comunicación entre componentes de\n" +
              "            software. Se trata del conjunto plataformas que ofrecen acceso a\n" +
              "            ciertos servicios desde los modulos de los niveles o capas\n" +
              "            inferiores y superiores del software. Uno de los principales\n" +
              "            propósitos de una API consiste en proporcionar un conjunto de\n" +
              "            funciones de uso general, por ejemplo, para concretar operaciones\n" +
              "            sin necesidad del uso de una interfase de usuario. De esta forma,\n" +
              "            los programadores pueden conectarse a través del API haciendo uso de\n" +
              "            su funcionalidad, evitándose el trabajo de programar o usar la\n" +
              "            interfase de usuario. Las API asimismo son abstractas: el software\n" +
              "            que proporciona una API generalmente se comunica a través de un\n" +
              "            lenguaje abierto por medio de un canal especial para la integración.",
          },
          q3: {
            title: " ¿Como se logra?",
            answer: {
              p1:
                " - Barrido en segmentos de tiempo de las órdenes de compra y venta de\n" +
                "            cada Altcoin.",
              p2:
                " - Creación de una matriz de tendencia que permita identificar el\n" +
                "            comportamiento de ese activo según la sucesión de operaciones\n" +
                "            inscritas.",
              p3:
                " - Mediante instrucciones desarrolladas en nuestros algoritmos,\n" +
                "            escribe la información de la matriz en la interfaz del modulo\n" +
                "            central AI.",
              p4:
                " - Mediante la instrucción adecuada el bot realiza el volcado de esa\n" +
                "            información colocando su orden sobre la partida ya sea de compra o\n" +
                "            de venta.",
              p5:
                "Por medio de un sistema operativo lógico hace el siguiente trabajo:",
              p6:
                " - Carga una fuente matriz de la tendencia proporcionada por el\n" +
                "            sistema de programación.",
              p7:
                "- El sistema operativo automáticamente decide cuando abrir o cerrar\n" +
                "            la operación.",
              p8:
                "- El sistema operativo realiza un histórico cargado al módulo\n" +
                "            central que le permite analizar más información para ajustar en\n" +
                "            tiempo real la calibración de sus operaciones.",
              p9:
                "Usando la Inteligencia artificial (que a su vez usa el sistema\n" +
                "            operativo) para realizar la mayor parte del trabajo:",
              p10:
                "- Analiza y compara trillones de datos por segundos suministrados\n" +
                "            por todos los bots (algoritmos) y toma decisiones matrices para\n" +
                "            iniciar o cerrar operaciones del módulo central (Switche).",
              p11:
                " La primera opción requiere más pasos, y cada paso subsecuente se\n" +
                "            encadena sin soslayar la información suministrada en los pasos\n" +
                "            anteriores. Cada uno de los cuales es mucho más complicado que los\n" +
                "            pasos anteriores. La capacidad de tomar las decisiones correctas\n" +
                "            depende del procesamiento adecuado de la información para\n" +
                "            representar una gran cantidad de datos de forma inteligible para el\n" +
                "            sistema.",
              p12:
                "La segunda fase simplifica la tarea eliminando las operaciones menos\n" +
                "            favorables y enfocado las operaciones en las tablas de históricos\n" +
                "            con mejores resultados.",
              p13:
                "Un último pero muy importante paso es el que toma el Modulo central\n" +
                "            pivotearle (AI), que está en capacidad de analizar factores de\n" +
                "            entorno fuera de las operaciones netas para protegerse de\n" +
                "            variaciones de BTC/dólar demasiado bruscas y que puedan afectar el\n" +
                "            rendimiento global de las operaciones.",
              p14:
                "Este módulo central (AI) permite que el sistema cierre masivamente\n" +
                "            todas las operaciones cambiando de manera instantánea a BTC/dólar o\n" +
                "            viceversa según sea las condiciones del mercado en cada momento.",
              p15:
                "Las API de alto nivel generalmente pueden procesar y manejar grandes\n" +
                "            de volúmenes de información adelantándose vertiginosamente a la\n" +
                "            capacidad de procesamiento, análisis y toma de decisión de un\n" +
                "            humano.",
              p16:
                "Sin embargo todas nuestras operaciones son supervisadas en todo\n" +
                "            momento por personal especializado de control de calidad.",
            },
          },
          q4: {
            title: "¿Qué es una HFT?",
            answer:
              "Una plataforma automatizada de HFT (trading de alta frecuencia) es\n" +
              "            un software programado para realizar trillones de operaciones por\n" +
              "            segundo en un mercado de valores dinámico que esté conectado a una\n" +
              "            API.",
          },
        },
      },
      strategies: {
        title: "Estrategias",
        questions: {
          first: {
            title: "¿Cómo diseña dolarbtc.com sus estrategias de Mercado?",
            answer: {
              p1:
                "Podemos ofrecer la ejecución de alta variedad de estrategias de\n" +
                "            inversión gracias a nuestra combinación de algoritmos diseñados para\n" +
                "            ganar con diferentes niveles de tolerancia al riesgo y en\n" +
                "            condiciones de mercados alcistas o bajistas. Nuestros protocolos de\n" +
                "            operación se activan únicamente cuando hay una combinación de 98% de\n" +
                "            condiciones ideales para operar. El máximo nivel de pérdida ocurre\n" +
                "            al momento de colocar la orden por el diferencial o ventana de\n" +
                "            entrada necesario para poder ejecutar operaciones en un mercado\n" +
                "            dinámico. Las calibraciones del factor de tolerancia de pérdida está\n" +
                "            tabulado según el nivel de riesgo escogido en el plan de inversión\n" +
                "            seleccionado por cada cliente. Es una máxima del mercado que a mayor\n" +
                "            volatilidad mayor riesgo y a mayor riesgo mayor ganancia, por eso\n" +
                "            nuestros modelos más agresivos permiten un nivel de tolerancia mayor\n" +
                "            a las fluctuaciones del mercedo antes de liquidar o abrir\n" +
                "            posiciones. Contrario ocurre a los bots o planes más conservadores.",
              p2:
                "Esto significa que la exposición conjunta de variables y factores de\n" +
                "            corrección de algunas operaciones se remite automáticamente a\n" +
                "            valores previamente preestablecidos.",
              p3:
                "Nuestras estrategias se fundamentan en los siguientes parámetros:",
              p4:
                " - Análisis Macro de condiciones internas y externas del mercado de\n" +
                "            cryptoactivos.",
              p5: "- Nivel de Capitalización de mercado.",
              p6:
                "- Inputs; subida o bajada durante períodos de barridos\n" +
                "            predeterminados para ser tomados como tendencia factorial de\n" +
                "            mercado.",
              p7:
                "- Correlación de ordenes compra/venta colocadas en los libros\n" +
                "            respectivos.",
              p8: "- Periodos de análisis (tiempos de cortes o barrido).",
              p9:
                "- Rango de tolerancia a la pérdida y a la Ganancia (factor de\n" +
                "            corrección).",
              p10: "- Espejos (mirrors) de protección.",
              p11:
                " - Llaves y protocolos de Seguridad en custodia de empresas\n" +
                "            auditables (servicios outsourcing).",
              p12:
                "Nuestra tecnología crea una matriz informativa que retroalimenta al\n" +
                "            sistema aumentando la capacidad para generar rendimientos continuos\n" +
                "            en operaciones cíclicas.",
            },
          },
        },
      },
    },
    faqs: {
      title: "Guía de Preguntas Frecuentes (FAQ)",
      questions: {
        q1: {
          title: "¿Qué es www.dollarbtc.com?",
          answer: {
            link: "www.dollarbtc.com ",
            p1:
              "es una plataforma de intercambio desarrollada por un grupo de comerciantes\n" +
              "entusiastas del bitcoin.",
            p2:
              "Reconocemos a localbitcoin.com como pionero en la creación y desarrollo \n" +
              " de la comunidad más grande de comerciantes de bitcoin en el mundo.  \n" +
              " Pero actualmente esta convertido en un sitio tóxico e inseguro por la \n" +
              "gran cantidad de estafadores que se aprovechan de las deficiencias  \n" +
              "  de seguridad de la plataforma.",
            p3:
              "Por eso decidimos unirnos con la misión de desarrollar una nueva plataforma \n" +
              "capaz de brindar posibilidad de crecimiento e igualdad en un ambiente seguro \n" +
              "y confiable.",
            p4:
              "Al principio la tarea parecía fácil, pero realmente fue todo lo contrario.\n" +
              "Muchos obstáculos legales y operativos aparecieron en el camino. \n",
            p5:
              "Decidimos hacer el mayor esfuerzo para lograr un producto versátil y confiable.\n",
            p6: "Tal vez hacerlo fácil fue lo más difícil.\n",
            p7:
              "Como parte de la iniciativa, buscamos los mejores ingenieros y desarrolladores especializados en productos financieros y bancarios.\n",
            p8:
              "Después de dos años de desarrollo, investigación y muchas,  \n" +
              "muchísimas pruebas, logramos un producto seguro, fácil de manejar y confiable.\n",
            p9:
              "Dollarbitcoin es un plataforma abierta, hecha para la comunidad, flexible y con especial énfasis en la seguridad. Nuestra misión principal es evitar o neutralizar \n" +
              "la participación de las diferentes modalidades de estafa y usurpación de \n" +
              "identidad que han perjudicado tanto al ecosistema de localbitcoin. \n",
            p10:
              "Para eso hemos implementado medidas activas de seguridad para\n" +
              "garantizar el debido cobro tanto en criptomoneda como en moneda fiat.\n",
            p11:
              "Además de seguridad hemos dotado nuestra plataforma de una robusta base \n" +
              "legal y fiscal para certificar operaciones y permitir a nuestros usuarios \n" +
              "operar de manera legal y transparente. Cumpliendo regulaciones y  \n" +
              " procedimientos BSA/AML exigidos por las autoridades de la mayoría\n" +
              " de los países incluyendoa los Estados Unidos de América.",
            p12:
              "Consideramos que este será un lugar de encuentro para los cripto trader, \n" +
              "donde podamos apoyarnos y crecer juntos, en un ambiente seguro, \n" +
              "igualitario y protegido con firmeza.",
            p13:
              "Actualmente estamos en una fase inicial donde los que decidan participar \n" +
              "tendrán la ventaja de poder ser los primeros en operar en mercados \n" +
              "con amplia demanda y escasa presencia de broker certificados.",
            p14:
              "Nuestras puertas están abiertas para los que quieran unirse a nuestra red \n" +
              "de asociados comerciales.",
            p15: "En www.dollarbtc.com",
            p16:
              " podrás validar tu trayectoria en localbitcoin si quieres unirte a \n" +
              "nosotros. Somos una plataforma de trading, hecha por traders, para los traders!!!",
            // ,
            // p17:"Para crear un ambiente amigable y seguro para poder comerciar criptomonedas de manera legal y por medio de procesos Certificados."
          },
        },
        q2: {
          title: "¿Cuales son los Servicios del portal?",
          answer: {
            p1: "Compra y Venta de Bitcoin y Ether.",
            p2: "Intercambio de Monedas Soberanas por Medio de Bitcoin",
            p3: "Transferencias de Dinero",
            p4: "Plataformas de Trading e Inversión",
            p5: "E-wallet de monedas soberanas en la nube",
            p6: "Servicio de indexación de tasas de intercambio automatizado.",
          },
        },
        q3: {
          title: "¿Cómo trabaja Dollarbtc?",
          answer: {
            link: "www.dollarbtc.com ",
            p1:
              "Por medio de un sistema de indexación en la nube que combina de manera simple\n" +
              "la comercialización de criptomonedas por monedas soberanas.",
            p2: "Para operaciones en moneda local soberana ",
            p3: "cuenta con una red de ",
            p4: "Operadores ",
            p5:
              "asociados en distintos países, encargados de recibir y realizar los pagos bancarios. El sistema actúa como un garante e indexador de operaciones. \n" +
              "Unifica las tasas de comercio en las operaciones con valores cruzados y \n" +
              "certifica los usuarios y sus pagos.\n",
            p6:
              "Adicionalmente, dollarbtc.com proporciona una versátil plataforma para \n" +
              "administrar desde un mismo panel diversos instrumentos comerciales como: \n" +
              "wallets, e-wallets, cuentas bancarias, listas de pagos \n" +
              "y herramientas de trading e inversión.",
          },
        },
        q4: {
          title:
            "¿Cuales son la fuentes de información de donde sacan las tasas de intercambio?",
          answer: {
            p1:
              "Para proveer a los Contratos de tasas reales, competitivas y actualizadas \n" +
              "en tiempo real, nuestros scan bots detectan, recopilan y procesan con \n" +
              "algoritmos propios una serie de datos relativos a precios, volumen,\n" +
              "medios de pago y otros indicadores dentro de los mercados OTC con mayor \n" +
              "actividad bursátil en cada país. De dicho análisis se emiten tasas reales y \n" +
              "competitivas para el comercio e intercambio.",
            p2:
              "Aquí les damos un link de los principales exchange del mundo de donde \n" +
              "nuestros scan bots obtienen y procesan la mayor parte de su información:\n",
            link: "Exchanges - Bitcoin",
          },
        },
        q5: {
          title:
            "¿En qué consisten las Operaciones Certificadas de Intercambio?",
          answer: {
            p1:
              "Consisten en un proceso virtual generador de contratos electrónicos que compilan y verifican la siguiente data:\n",
            p2: " Registro Certificado de Usuarios (Compliance).",
            p3: " Tasas, montos transados y fechas de intercambio.",
            p4: " Fondos de Garantías subyacentes.",
            p5: " Certificación de Pagos y facturas asociadas.",
            p6:
              " Verificación de coincidencias con datos suministrados (track ID).",
          },
        },
        q6: {
          title: "¿Quién garantiza la seguridad de mis pagos y operaciones?",
          answer: {
            p1:
              "Nuestra plataforma garantiza todas las operaciones sellando un trato \n" +
              "con datos de registro certificados por los participantes y bloqueando el \n" +
              "depósito de garantía por medio de ",
            p2: "  Contratos de Garantía Inteligentes",
            p3:
              ", que son liberados cuando se acrediten y validen los compromisos\n" +
              " adquiridos asegurando que coinciden con los datos previamente certificados.",
          },
        },
        q7: {
          title:
            "¿Que es un Contrato de Garantía Inteligente (CGI) y cómo funciona?",
          answer: {
            p1: "El ",
            p2: "Contrato de Garantía Inteligente (CGI)",
            p3:
              " es un acuerdo realizado por un sistema de validación electronico entre\n" +
              " dos partes, donde www.dollarbtc.com funge como garante de la operación \n" +
              "mediante los siguientes pasos:",
            p4:
              "Certifica por medio de un protocolo electrónico que ambas partes han comprobado su información de registro (firma electrónica) y aceptan el acuerdo pactado.",
            p5: "Certifica los fondos de garantía exigidos.",
            p6:
              "Valida la titularidad de las cuentas bancarias involucradas para evitar fraudes, pagos de terceros o suplantación de identidad.",
            p7:
              "Emite y fija en tiempo real la tasa de intercambio, competitiva y transparente para celebrar el Contrato.",
            p8:
              "Certifica que la Operación y los participantes cumplen con las regulaciones BSA/AML internacionales.",
            p9:
              "Debita y/o carga automáticamente a cada operación las tasas bancarias o tributarias correspondientes.",
            p10:
              "Emite la factura legal correspondiente para el respectivo asiento contable de la    operación.",
            p11:
              "Certifica que el pago se recibe desde una cuenta verificada antes de liberar la garantía.",
            p12: "Cierra el ",
            p13:
              "CGI guardando los datos y el registro contable de cada operación para efectos legales.",
            p14:
              "Una vez que generas una orden de compra o venta el sistema inmediatamente genera un Contrato de Garantía, de esta manera cuando concluyes tu \n" +
              "operación los bitcoin o activos subyacentes son liberados a quien corresponda.\n" +
              " Caso contrario se reintegran y el Contrato de Garantía queda disuelto.\n",
            p15: "Las probabilidades de que un ",
            p16: "CGI ",
            p17:
              "se incumpla son virtualmente imposibles, ya que para generar cualquier \n" +
              "operación el sistema debe tener todos los requisitos de comprobación activos \n" +
              "o simplemente no cargará la orden, diciendo que no hay una oferta \n" +
              "correspondiente. De esta manera se garantiza la seguridad de cualquier \n" +
              " operación que vayas a realizar.",
          },
        },
        q8: {
          title: "¿Qué legislación regula los CGI?",
          answer: {
            p1:
              "A nivel internacional nuestros procedimientos están homologados con la \n" +
              "Convención de Basilea y el Convenio de Viena de la Organización de\n" +
              " Naciones Unidas sobre operaciones financieras desarrolladas entre distintos\n" +
              "países e instituciones financieras. Dichos Convenios están firmados\n" +
              " por la mayoría de países del mundo, también incluyen lo relativo a las \n" +
              "regulaciones que contemplan las normas para la prevención de lavado de dinero \n" +
              "y legitimación de capitales, prevención de financiamiento para actividades \n" +
              "terroristas, y protección de datos privados y seguridad bancaria de los \n" +
              "usuarios del sistema financiero mundial.",
            p2:
              "A nivel local las transacciones se adaptan a los requerimientos y normativas\n " +
              "fiscales vigentes en cada país.",
            p3:
              "Dado que la mayoría de los países no cuentan con una legislación uniforme \n" +
              "ni específica sobre el intercambio de bitcoin, nuestros",
            p4: " Operadores Locales",
            p5:
              " deben cumplir con los requisitos exigidos por los órganos correspondientes \n" +
              "para poder operar comercialmente. Debido a ello en algunos casos las\n" +
              " operaciones podrán ser sujetas a impuestos locales o procedimientos de \n" +
              "verificación adicionales.",
            p6:
              "Aquí les dejamos los link donde pueden estudiar la información actualizada de\n" +
              " los distintos estados de desarrollo legal del comercio de bitcoin alrededor \n" +
              "del mundo: ",
            p7:
              "Coin Dance - Global Bitcoin Political Support & Public Opinion",
            p8:
              "  Documento de la ONU sobre Prevención de Lavado de Dinero y Legitimación de Capitales",
            p9: "IMOLIN - PDF",
            p10: "Comité de Supervisión Bancaria de Basilea: ",
            p11:
              "Adecuada Gestión de Riesgos relacionadas con el Blanqueo de Capitales \n" +
              " y Financiación del Terrorismo (Enero 2014) En español.",
            p12:
              "BIS - Adecuada gestión de los riesgos relacionados con el blanqueo de capitales y \n" +
              "la financiación del terrorismo - PDF",
            p13:
              "Protección de Derechos de Usuarios del Gobierno Federal de Estados \n" +
              "Unidos de América.",
            p14: " Oficina para la Protección Financiera del Consumidor ",
            p15: " Regulación de Envíos de Dinero del Fincen (USA) en inglés",
            p16: " FINCEN - Money Transmitter Regulators - PDF",
          },
        },
        q9: {
          title: "¿Quiénes participan en el CGI?",
          answer: {
            p1:
              "Por un lado el Usuario que genera la operación de compra o venta y por otro \n" +
              "un Operador Legal Certificado",
            p2: " (OLC) ",
            p3:
              "que posee un registro de broker oficial y una cuenta de garantía en \n" +
              "la plataforma. Como tercera parte está el registrador\n" +
              " y garante de la transacción que es el sistema electrónico de \n" +
              "dollarbitcoin.",
            p4:
              "DLBTC es el encargado de fungir como notario virtual del trato, comprobando\n" +
              " que todos los pasos se cumplan de acuerdo al pacto sellado \n" +
              "para la celebración exitosa del convenio comercial.",
          },
        },
        q10: {
          title:
            "¿Que pasa si quiero comprar Bitcoin pero no puedo cumplir con el pago dentro del lapso establecido?",
          answer: {
            p1: "Si generas una ",
            p2: "Orden de Compra ",
            p3:
              "de bitcoin como Usuario y no realizas el pago correspondiente dentro del \n" +
              "lapso establecido en la ventana de pago, tu transacción se cancela \n" +
              "automáticamente. Para realizar tu compra deberás abrir una nueva Orden de Compra.",
            p4:
              "La cancelación automática no genera compromisos ni penalidades. Sin embargo \n" +
              "es recomendable, por el bien de todos, que si no puedes cumplir con tu pago\n" +
              " en el lapso estipulado, canceles lo antes posible para no \n" +
              "generar retrasos ni perjudicar el récord de tu cuenta.",
          },
        },
        q11: {
          title:
            "¿Que pasa si quiero vender mis Bitcoin pero el sistema no tiene ofertas disponibles en la moneda de destino?",
          answer: {
            p1: "Si generas una ",
            p2: "Orden de Venta ",
            p3:
              "de bitcoin el sistema ubicará un OLC correspondiente con tu operación dentro \n" +
              "de nuestra lista de OLC disponibles.",
            p4:
              "En el caso de que no haya un OLC disponible para compensar tu transacción el\n" +
              "sistema te informará que no hay contraparte disponible para tu intercambio en\n" +
              "ese momento.",
            p5: "En ese caso podrás elegir entre las siguientes opciones:",
            p6:
              "Cancelar e intentar más tarde (puedes habilitar notificación automática de oferta disponible).",
            p7:
              "Dejar una Orden Automática de Venta (aunque el precio podría variar).",
            p8:
              "Realizar una venta virtual, esto significa tokenizar creando en un e-wallet\n" +
              "el valor nominal de la moneda soberana objeto de tu transacción.\n" +
              " Desde ese momento ya tus bitcoin quedarán indexados al respectivo valor,\n" +
              "pudiendo convertirlos a bitcoin nuevamente o a dinero real en cualquier \n" +
              "otro momento.",
          },
        },
        q12: {
          title: "¿Que es un Operador Legal Certificado (OLC)?",
          answer: {
            p1: "Un ",
            p2: "Operador Legal Certificado ",
            p3:
              "en un broker que se ha certificado en nuestra plataforma como Comerciante\n" +
              "Profesional. Puede ser un ente natural o jurídico dependiendo de las \n" +
              "regulaciones locales de su país de operación y el volumen de comercio que\n" +
              " pueda soportar de acuerdo a su depósito de garantía.",
          },
        },
        q13: {
          title: "¿Quiénes pueden registrarse como OLC?",
          answer: {
            p1:
              "Cualquier comerciante puede asociarse a nuestra plataforma como OLC. \n" +
              "Si tienes una trayectoria demostrable en localbitcoin con un buen récord de \n" +
              "operaciones y alto nivel de reputación eso te servirá como parte de los\n" +
              " requisitos exigidos para certificarte.",
            p2:
              "Adicionalmente es posible que debas cumplir requisitos adicionales en\n" +
              " tu país de operación que te permitan actuar como broker de cripto activos \n" +
              " de acuerdo a tu volumen de comercio y las regulaciones locales.",
            p3:
              "Para mayor información debes registrarte en la plataforma y solicitar tu \n" +
              "registro como empresa o socio comercial.",
          },
        },
        q14: {
          title: "¿Qué requisitos debe cumplir un OLC?",
          answer: {
            p1: "El ",
            p2: "OLC ",
            p3:
              "o broker local asociado debe cumplir los siguientes requisitos: \n",
            p4:
              "Poseer un permiso válido en su país base para comerciar cripto activos \n" +
              "en caso de ser necesario.\n",
            p5:
              "Depositar cierta cantidad de bitcoin en la plataforma como depósito en \n" +
              "custodia, según su volumen comercial.",
            p6:
              "Certificar cuentas bancarias aptas para realizar el comercio en \n" +
              "moneda soberana local.",
            p7: "Suscribir una licencia comercial para la operación de",
            p8: " www.dollarbtc.com.",
          },
        },
        q15: {
          title: "¿Qué beneficios obtengo si me registro como OLC?",
          answer: {
            p1: "Compra y venta de bitcoin a precios de broker.",
            p2: "Acceso al Panel Administrativo Profesional.",
            p3: "Servicio de Certificación de Usuarios.",
            p4:
              "Servicios legales asociados a tus operaciones a nivel local e internacional.",
            p5: "Aumento de tu flujo comercial.",
            p6: "Sistema legal de facturación.",
            p7: "Posibilidad de incluir sub operadores en tu propia red.",
            p8: "Participación directa en todos los mercados.",
            p9:
              "Ganancias automáticas por el factor diferencial cambiario GIC, (Ganancia \n" +
              "Implícita Cambiaria GIC) y por los fees de operaciones.",
            p10: "Sistema de Administración. ",
            p11: "Conciliación de cuentas y saldos bancarios.",
            p12: "Cálculo y pago de impuestos y tasas bancarias.",
            p13: "Balances y estadísticas automatizadas.",
          },
        },
        q16: {
          title: "¿Cómo opera un OLC en la práctica?",
          answer: {
            acronym1: "OLC ",

						acronym2: "CGI.",
						p1:
							"Un OLC puede interconectar sus cuentas bancarias directamente al sistema \n" +
							"para que los Pagos por Órdenes de Compra sean recibidos directamente en \n" +
							"sus cuentas bancarias, e igualmente estas sean debitadas \n" +
							"automáticamente cuando se conecten Órdenes de Ventas concordantes.",
						p2:
							"Cuando se genera una orden el sistema selecciona automáticamente un \n",
						p3:
							"asociado a la operación de acuerdo a la geoubicación, bancos disponibles,\n" +
							" idioma y/o nivel de liquidez de garantía en el sistema.",
						p4: "Una vez asociada la operación el sistema genera una orden al ",
						p5: "para liquidar la misma a través del ",

						p6:
							"Una vez hechos los créditos o débitos correspondientes y verificados los \n" +
							"soportes de conciliación y verificación, el sistema automáticamente carga\n" +
							" sus respectivas comisiones de ventas y operaciones en el wallet del ",
						p7: " por sus servicios.\n",
						p8: "El ",
						p9:
							"debe mantener un saldo mínimo en su cuenta de garantía para poder soportar \n" +
							"operaciones automáticamente o el sistema ubicará el siguiente OLC disponible\n" +
							" según el ranking para la próxima operación.\n",
						p10:
							"Mientras mayor sea su nivel de liquidez mayor posibilidad de ser\n" +
							" seleccionado por el sistema y a mayor volumen de comercio mayores \n" +
							"ganancias operativas.",
					},
				},
				q17: {
					title: "¿Con qué otros Servicios cuenta la Plataforma? ",
					answer: {
						p1:
							"Información en tiempo real sobre la tasa de cambio de cualquier moneda\n" +
							"soberana a través de la tasa Bitcoin (producto exclusivo).",
						p2:
							"Comercio de Bitcoin en diferentes monedas soberanas a través de nuestros\n" +
							"operadores locales certificados o socios comerciales (*operaciones conexas).",
						p3:
							"Aplicación híbrida para manejar Valores Fiduciarios y Virtuales dentro \n" +
							"del mismo panel de control.",
						p4:
							"Panel de control fácil y amigable para administrar cuentas bancarias, \n" +
							"e-wallets, listas de proveedores o clientes e instrumentos de comercio virtual.",
						p5:
							"Servicio certificado de conexión segura a Blockchain a través de Wallets \n" +
							"dinámicas.",
						p6: "Acceso a todos los mercados internacionales de criptomonedas.",
						p7: "Plataforma automatizada de HFT* para clientes fuera de USA.",
						p8:
							"Transferencias de dinero dentro y fuera de tu país (*a través de nuestros socios comerciales).",
						p9:
							"Sistema de e-wallets y micro pagos para pagos frecuentes o rápidos.",
					},
				},
				q18: {
					title: "¿Cuales son las condiciones de Uso? ",
					answer: {
						link: "www.dollarbtc.com",
						p1:
							"Nuestras condiciones (las “Condiciones de Uso”) regulan el acceso y la utilización del sitio web alojado  bajo el nombre de dominio ",
						p2:
							" (el “Sitio Web”) y bajo cualquiera de los subdominios o páginas web\n" +
							"dependientes del mismo, así como los contenidos y servicios que el titular \n" +
							"del Sitio Web pone a disposición de sus usuarios (los “Usuarios”) \n" +
							"y establecen junto con la Política de Privacidad y Cookies, relativas a \n" +
							"la gestión de datos de carácter personal de los Usuarios, los términos y\n" +
							" condiciones por los que se rige el Sitio Web.",
					},
				},
				q19: {
					title: "¿Quién puede registrarse como usuario de dollarbtc.com? ",
					answer: {
						p1:
							"Cualquier persona que quiera comercializar bitcoin y posea un \n" +
							"documento válido de identidad y una o varias cuentas bancarias registradas\n" +
							" a su nombre.",
						p2:
							"Debe tener un correo electrónico válido y una linea de teléfono celular \n" +
							"personal con un número verificable (No Virtual).",
						p3:
							"Debe estar dispuesto a suministrar toda la información requerida para \n" +
							"el cumplimiento de las ",
						p4:
							"Leyes Internacionales de Identificación y Comprobación de Clientes (KWC)\n",
						p5:
							" y todos los datos suministrados deben ser reales y verificables.",
					},
				},
				q20: {
					title: "¿Cuales son los Límites y requisitos para Comerciar? ",
					answer: {
						p1:
							"Para cualquier operación debe completar exitosamente el registro de Usuario y aceptar los Términos y Condiciones.",
						p2:
							"Para operaciones mayores a mil dólares americanos ($ 1.000) o su equivalente\n" +
							" en moneda local debe tener una cuenta bancaria certificada por nuestro sistema\n" +
							" y aceptar las Condiciones de Comercio o Contrato Electrónico.",
						p3:
							"Para operaciones mayores a diez mil dólares americanos ($ 10.000,00) o \n" +
							"su equivalente, además de los pasos previos, debe contestar una llamada de \n" +
							"verificación de nuestro ",
						p4: "Oficial de Cumplimiento ",
						p5: "y validar las preguntas de seguridad.",
						p6:
							"Para operaciones de más de Cien mil dólares americanos ($ 100.000,00) o su \n" +
							"equivalente en moneda local debe tener  una dirección válida  postal para \n" +
							"recibir un Contrato el cual debe devolver con todos los datos solicitados y \n" +
							"firmado a nuestra dirección por correo certificado.",
						p7:
							"Para operaciones de más de Un millón de dólares americanos ($ 1.000.000,00) o \n" +
							"su equivalente debe presentarse ante el notario público más cercano\n" +
							"a su domicilio y firmar un Contrato con uno de nuestros Representantes.",
						p8: "Nota:",
						p9:
							" En cualquier caso si el Oficial de Cumplimiento no valida la transacción la \n" +
							"misma será cancelada de manera unilateral sin obligación de explicación\n" +
							" alguna antes de efectuarse ningún pago por cualquiera de las partes.",
					},
				},
				q21: {
					title: "¿Por qué debo registrarme como Usuario en dollarbtc.com? ",
					answer: {
						p1:
							"No tiene ninguna obligación de registrarse como nuestro usuario, salvo (i) si quieres comprar y vender bitcoin desde tu \n" +
							"país y en tu moneda local o (ii) si quieres ser operador certificado para integrar al sistema de pago de nuestra plataforma.",
					},
				},
				q22: {
					title: "Quiero Comprar o vender una sola vez. ¿Debo registrarme? ",
					answer: {
						p1:
							"En DLBTC no queremos que nadie comercie sin tener antes muy claro qué nuestras condiciones son que todo usuario debe registrarse\n" +
							"correctamente para proteger nuestro ecosistema de posibles estafadores, impostores o transgresores del sistema legal vigente a \n" +
							"nivel local e internacional. La seguridad y protección del comercio de cripto activos y de la comunidad de usuarios es nuestra\n" +
							"principal preocupación.",
					},
				},
				q23: {
					title: "¿Cómo me registro como usuario de dollarbtc? ",
					answer: {
						p1:
							"Tu registro como usuario al objeto de solicitar nuestros servicios de indexación electrónica de ofertas de compra y venta para\n" +
							"la adquisición de un producto o servicio de la plataforma, se producirá en el momento en que hayas introducido en nuestro sistema\n" +
							"tus datos personales: nombre y apellidos, tu número de teléfono móvil, tu número de D.N.I, fecha de nacimiento y demás datos \n" +
							"solicitados, y que hayas hecho clic en el botón que dice “Crear cuenta”. Asimismo, deberás aceptar de manera expresa nuestras \n" +
							"Condiciones Generales y la Política de Privacidad.",
						p2:
							"Desde ese momento, tu número de teléfono personal recibirá una clave secreta, de forma que cada vez que quieras tener acceso\n" +
							"a tu cuenta o a los servicios de la plataforma deberás identificarte mediante dicha clave. Una vez identificado, DLBTC te enviará \n" +
							"por SMS un código PIN de un solo uso a través del cual podrás acceder al servicio.",

						p3:
							"De esta forma, solo con tu contraseña y teléfono podrás acceder a DLBTC. Simplemente tendrás que tener tu teléfono móvil a mano.\n" +
							" Asimismo, y en la medida en que ninguna persona malintencionada tenga acceso a tu móvil, no tendrás que preocuparte de que nadie \n" +
							"acceda a tus datos sin tu consentimiento. ¡Justo como hacen algunos bancos antes de ordenar una transferencia!",

						p4:
							"Como te hemos dicho antes, la contratación del servicio garantiza tu seguridad así como la de tus fondos de manera activa y preventiva\n" +
							"para evitar accesos no autorizados a tu cuenta.",
					},
				},
				q24: {
					title:
						"¿Cómo puedo acceder a mis datos personales, consumos, pagos y demás? ",
					answer: {
						p1:
							"Toda tu información estará siempre disponible para ti en nuestro Sitio Web. Para acceder a tu cuenta dirígete al Sitio Web,\n" +
							" haz clic en el botón “Sign On” y sigue las instrucciones. Deberás tener tu móvil a mano para acceder al código PIN de un sólo uso\n" +
							"que te enviaremos por SMS y que tendrás que introducir para validar tu identidad.",
					},
				},

				q25: {
					title: "¿Qué puedo hacer en el Sitio Web de Dollarbtc?",
					answer: {
						p1:
							"Después de identificarse en el Sitio Web con tu número de móvil y el PIN de un solo uso que te habremos enviado, tendrás acceso\n" +
							"a tu área personal de cliente donde podrás consultar tus transacciones, pagos, facturas, compras, tus datos de contacto, medios de \n" +
							"pago activos, historial, etcétera.",

						p2:
							"A través de nuestro Sitio Web también podrás comprar bitcoin, altcoin o enviar pagos a través de nuestra red de Operadores \n" +
							"Certificados. También podrás hacer compras y ventas disfrutando de un servicio de indexación de precios en tiempo real que te \n" +
							"permitirá saber en cualquier momento tu posición real en el mercado y, en definitiva, acceder a cualquier producto o servicio \n" +
							"que podamos ofrecerte en cada momento.",
					},
				},

				q26: {
					title:
						"¿Como están guardados mis BTC y cómo se protegen de los hacker?",
					answer: {
						p1:
							"Una de las ventajas de usar nuestra plataforma es que tus datos y tus \n" +
							"bitcoin estarán guardados en bóvedas frías, es decir que no están on\n" +
							"line, por eso están fuera del alcance de cualquier hacker incluso si \n" +
							"la plataforma fuera atacada no hay forma de acceder a tus datos o a tus bitcoin.",

						p2:
							"Otra ventaja adicional es que disponemos de wallets dinámicos para tus \n" +
							"transferencias en bitcoin, lo que garantiza que no podrán ser rastreados \n" +
							"ni seguidos por ningún malware o personas inescrupulosas.\n",
						p3:
							"Nuestra alianza comercial con Amazon, AWS (Amazon Web Service) nos permite \n" +
							"ofrecerte protección y seguridad, además de estabilidad y rapidez en todas \n" +
							"tus transacciones. Al tener tus datos alojados en los servidores de Amazon \n" +
							"puedes estar absolutamente seguro que tu información está totalmente protegida\n" +
							"y resguardada en la mejor plataforma de hosting que existe en planeta.",
					},
				},
				q27: {
					title: "¿Qué uso puedo hacer del Sitio Web de DLBTC?",
					answer: {
						p1:
							"Desde DLBTC te pedimos que hagas un uso responsable de nuestro Sitio Web y de los servicios que te ofrecemos.",
						p2:
							"Si cambias de teléfono móvil, o cualquier otro dato de contacto, te pedimos que nos informes cuanto antes para poder darte siempre \n" +
							"el mejor servicio. Por supuesto, también deberás informarnos de inmediato de cualquier cambio en los datos de la tarjeta  o cuentas\n" +
							"registradas con nosotros, con la que quieres realizar los pagos, en particular, si tu banco te ha enviado una tarjeta nueva por robo \n" +
							"o extravío, o si la fecha de caducidad está vencida.",
						p3:
							"Si sospechas que alguien se ha hecho pasar por ti, te rogamos que nos lo hagas saber lo antes posible para que procedamos a denunciarlo\n" +
							"a las autoridades competentes. Recuerda que el proceso de acceso a tu cuenta siempre se lleva a cabo a través de tu teléfono móvil, así que\n" +
							"es responsabilidad tuya que nadie le dé un uso malintencionado. Te recomendamos que uses la funcionalidad de tu teléfono móvil de activar una\n" +
							"contraseña para acceder al mismo. Es una buena práctica que añade una capa de seguridad adicional.",
						p4:
							"Recuerda que todos los servicios, gráficos, interfaz de usuario, los clips de vídeo, el contenido editorial, los scripts y el software \n" +
							"utilizados son de la exclusiva titularidad de DLBTC en cuanto que forman parte de su propiedad intelectual e industrial y se encuentran \n" +
							"protegidos por las leyes internacionales.",

						p5:
							"Dollarbtc, el logotipo de Dollarbtc, y las demás marcas, signos distintivos, gráficos y logotipos son marcas registradas de Dollarbtc OU.\n" +
							" Nadie está autorizado a usarlas sin nuestro consentimiento previo y por escrito.",
					},
				},

				q28: {
					title: "¿Cuáles son Mis Derechos como Usuario?",
					answer: {
						p1:
							"Somos un Sujeto Obligado a cumplir diferentes cláusulas de protección según las leyes de cada país.",

						p2:
							"Sin embargo para proveer a todos nuestros Usuarios y Socios Comerciales de un servicio uniforme con protocolos de comercio estandarizados\n" +
							"y debidamente acoplados a la universalidad y el espíritu de las distintas legislaciones nacionales e internacionales hemos decidido dotar\n" +
							"la plataforma una instancias para la resolución de Conflictos y el debido procesamiento de Reclamos de Nuestros Usuarios, a través de un:",

						p3: "Ombudsman Office",
						p4:
							"Se encarga de representar los intereses del público mediante la investigación y el tratamiento de las quejas de mala administración o una\n" +
							"violación de los derechos. El Ombudsman es designado por la Junta Directiva, pero con un grado significativo de independencia. El  Ombudsman\n" +
							"Office funge como Contralor de Servicios y defensor de los usuarios. ",
						p5:
							"Los deberes típicos de un ombudsman son investigar las quejas y tratar de resolverlas, generalmente a través de recomendaciones\n" +
							" (vinculantes o no) o mediación.",

						p6: "Cláusula de Renuncia de Derechos",
						p7:
							"Ponemos en tu conocimiento que, como consecuencia de la realización de trabajos de mantenimiento, en determinados casos pueden\n" +
							"producirse interrupciones temporales en el Sitio Web y por ende en los Servicios ofrecidos a través de los mismos.",
						p8:
							"Informamos, además de los indicados anteriormente, existe una gran variedad de factores que pueden afectar al Sitio Web y/o a su\n" +
							" calidad, tales como, a título enunciativo, pero no limitativo: condiciones ambientales, saturación de redes, conectividad, software \n" +
							"de terceros, etc.",
						p9:
							"Asimismo, DLBTC podrá eliminar, limitar o impedir el acceso a su Sitio Web cuando surjan dificultades técnicas por hechos o \n" +
							"circunstancias ajenos al portal que, a su criterio, disminuyan o anulen los niveles de seguridad o estándares adoptados para el \n" +
							"adecuado funcionamiento del Sitio Web.",
						p10:
							"El Usuario se abstendrá de utilizar el Sitio Web para realizar cualquier actividad ilícita. En particular, pero sin limitación,\n" +
							" el Usuario se abstendrá de utilizar el Sitio Web para:",
						p11: "Suplantar la identidad de otros Usuarios o terceros.",
						p12: "Falsedad en las operaciones.",
						p13: "Falsificación de datos.",
						p14: "Cualquier conducta que suponga un acto fraudulento; y",
						p15:
							"El Usuario no llevará a cabo ninguna actividad que pueda causar un \n" +
							"daño o perjuicio a cualquier tercero así como a DLBTC así \n" +
							"como al funcionamiento y/o desarrollo del Sitio Web.",
						p16: "En ningún caso DLBTC será responsable de:",
						p17:
							"Las pérdidas, daños o perjuicios de cualquier tipo que surjan por \n" +
							"acceder y hacer uso del Sitio Web, incluyéndose, pero no\n" +
							"limitándose a los producidos en los sistemas informáticos o los provocados por la introducción de virus y/o ataques informáticos.",
						p18:
							"Los daños que pudieran sufrir los Usuarios cuando un uso inadecuado del Sitio\n" +
							" Web, y en modo alguno de las caídas, interrupciones, ausencia o \n" +
							"defecto en las telecomunicaciones.",
						p19:
							"La veracidad, integridad o actualización de las informaciones que no sean de elaboración propia.",
						p20:
							"De las informaciones que indique otra fuente ni de las contenidas en otras webs mediante hipervínculo desde el Sitio Web.",
						p21:
							"De las penalizaciones incurridas por DLBTC debido a que el Usuario ha \n" +
							"suministrado datos erróneos o incorrectos de sus cuentas.",
						p22:
							"Los daños, incluyendo entre otros, y sin limitarse a éstos: daños, pérdidas \n" +
							"o gastos directos o indirectos, inherentes o consecuentes, que surjan en\n" +
							" relación con este Sitio Web o su uso o imposibilidad de uso por alguna \n" +
							"de las partes, o en relación con cualquier fallo en el rendimiento, error,\n" +
							" omisión, interrupción, defecto, demora en la operación o transmisión, virus\n" +
							"informáticos o fallos de sistema o línea.",
					},
				},
				q29: {
					title: "¿Cómo tratará DLBTC los datos proporcionados por el Usuario?",
					answer: {
						p1:
							"En virtud de lo establecido por la normativa aplicable en materia de protección de datos, todos los datos de carácter personal \n" +
							"facilitados por los Usuarios a través de los correspondientes formularios durante la utilización del Sitio Web serán tratados por\n" +
							"DLBTC según lo dispuesto en la Política de privacidad del Sitio Web. Aceptada por el usuario al momento de registrarse.",
					},
				},
			},
		},
		limits: {
			title: "Límites de operaciones",
			contentLimit: {
				dayly: "Diario",
				monthly: "Mensual",
				contentTitle: {
					normal: "Normal",
					company: "Empresa",
					broker: "Broker",
					SEND_IN: "Envíos entre wallets dollarBTC",
					SEND_OUT: "Envíos a wallets fuera de dollarBTC",
					RECEIVE_IN: "Recibir de wallets dollarBTC",
					RECEIVE_OUT: "Recibir de wallets fuera de dollarBTC",
					SELL: "Vender",
					BUY: "Comprar",
					MC_SEND_SMS_NATIONAL: "Envíos nacionales MoneyClick SMS",
					MC_SEND_SMS_INTERNATIONAL: "Envíos internacionales MoneyClick SMS",
					MC_SEND_TO_PAYMENT: "Envíos a cuentas bancarias desde MoneyClick",
					MC_FAST_CHANGE: "Cambio rápido de MoneyClick",
					MC_RETAIL_BUY_BALANCE: "Comprar saldo en punto MC",
					MC_RETAIL_SELL_BALANCE: "Vender saldo en punto MC",
					MC_AUTOMATIC_CHANGE: "Cambio automático de MoneyClick",
					BROKER_SEND_TO_PAYMENT: "Envíos a cuentas bancarias",
				},
			},
		},
		charges: {
			title: "Cargos por operaciones",
			content: {
				SEND_IN__COMMISSION: "Comisión por envío entre wallets dollarBTC",
				SEND_OUT__COMMISSION: "Comisión por envío a wallets fuera de dollarBTC",
				RECEIVE_IN__COMMISSION: "Comisión por recibir de wallets dollarBTC",
				RECEIVE_OUT__COMMISSION:
					"Comisión por recibir de wallets fuera de dollarBTC",
				BROKER_SEND_TO_PAYMENT__COMMISSION:
					"Comisión por envíos a cuentas para usuarios Brokers",
				MC_CASHBACK__COMMISSION:
					"Comisión por retiro de efectivo en MoneyClick",
				MC_SEND_TO_PAYMENT__COMMISSION:
					"Comisión por envíos a cuentas desde MoneyClick",
				MC_SEND_SMS_NATIONAL__COMMISSION:
					"Comisión por envíos nacionales MoneyClick por SMS",
				MC_SEND_SMS_INTERNATIONAL__COMMISSION:
					"Comisión por envíos internacionales MoneyClick por SMS",
				MC_FAST_CHANGE__COMMISSION: "Comisión por cambio rápido MoneyClick",
				BUY__VAT: "Impuesto por compra",
				BUY__COMMISSION: "Comisión por compra",
				BUY__COMMISSION__CREDIT_CARD:
					"Comisión por compra a través de Tarjeta de Crédito",
				SELL__COMMISSION: "Comisión por venta",
				FAST_CHANGE__COMMISSION: "Comisión por cambio rápido",
				MC_AUTOMATIC_CHANGE__COMMISSION:
					"Comisión por cambio automático MoneyClick",
				MC_RETAIL_BUY_BALANCE__COMMISSION:
					"Comisión por compra de saldo en Punto MoneyClick",
				MC_RETAIL_SELL_BALANCE__COMMISSION:
					"Comisión por venta de saldo en Punto MoneyClick",
				MC_BUY_BALANCE__COMMISSION: "Comisión por compra de saldo MoneyClick",
				SEND_TO_PAYMENT__COMMISSION: "Comisión por envío a cuenta bancaria",
			},
		},
		hft: {
			commons: {
				plansName: {
					defensive: "Defensivo",
					moderate: "Moderado",
					intense: "Intenso",
					aggressive: "Agresivo",
					arbitrage: "Arbitraje",
				},
			},
			listPlans: {
				title: "Planes HFT",
				errors: {
					requiredField: "Este campo es requerido",
					numberFormat: "Este campo debe poseer un formato numérico",
					minimalAmount:
						"El monto a invertir debe ser mayor al mínimo permitido por el plan.",
					exceededAmount:
						"El monto a invertir es mayor al que posee en su cartera de dollarBTC.",
					tokenNotFound: {
						header: "Token no encontrado",
						message:
							"El token suministrado no es correcto, por favor intente realizar la operación de nuevo.",
					},
					tokenExpired: {
						header: "Token expirado",
						content:
							"El token suministrado ha expirado, por favor intente realizar la operación de nuevo.",
					},
				},
				loading: "Cargando...",
				investing: "Realizando inversión...",
				opening: "APERTURA",
				period: "Periodo",
				days: "días",
				profit: "Ganancia",
				risk: "Riesgo",
				rendi: "Rendimiento por año",
				ganan: "ganancia demostrada en btc",
				minplace: "Plazos minimos",
				periodColocation: "días de colocación",
				holdingPeriod1: "Se puede inactivar el plan antes de los",
				holdingPeriod2: "days but not charged benefits.",
				activateButton: "Activar",
				modal: {
					header: {
						part1: "Comienza a ganar dinero con el plan",
						part2: "",
					},
					body: {
						desc: {
							p1:
								"Para activar este plan ingrese el monto en BTC que desea invertir en el plan",
							p2: "recuerde que el monto mínimo para este plan es de",
						},
						yourWallet: "En tu cartera:",
						toInvest: "Monto a invertir",
					},
					actions: {
						buttonCancel: "Cancelar",
						buttonAccept: "Aceptar",
						buttonClose: "Cerrar",
					},
				},
				features: {
					header: "Características de nuestros planes",
					content: {
						trading: {
							header: "Trading automático",
							subheader: "Intercambio de criptomonedas automáticamente.",
						},
						trailing: {
							header: "Trailing stops",
							subheader: "Trailing stop-loss (parada de arrastre) & compra.",
						},
						backtesting: {
							header: "Backtesting",
							subheader:
								"Usa información del pasado, para incrementar el rendimiento.",
						},
						exchanges: {
							subheader: "Usa distintos exchanges como HitBTC® y Binance®.",
						},
					},
				},
				calculatorContainer: {
					header: "Compra y Venta local",
					buy: "COMPRA",
					sell: "VENTA",
					buttons: {
						buy: "Compra",
						sell: "Vender",
					},
				},
				modalConfirm: {
					header: "Confirmar transacción",
					description:
						"Hemos enviado un token a su dirección de correo electrónico para validar la transacción, ingrese el token en el campo requerido.",
					actions: {
						buttonCancel: "Cancelar",
						buttonClose: "Cerrar",
						buttonAccept: "Aceptar",
					},
				},
				modalSuccess: {
					header: "Plan activado",
					description: "El plan ha sido activado exitosamente.",
				},
				modalFail: {
					header: "Lo sentimos",
					description:
						"El plan no ha podido ser activado en este momento, intente de nuevo mas tarde.",
				},
				inactivePlanHft: "No esta disponible en este momento",
				goActivePlan: "Activar este plan",
			},
			myPlans: {
				title: "Mis planes HFT",
				loading: "Cargando...",
				description: "Descripción: ",
				buttonInactivate: "Inactivar",
				addDescription: "Agregar descripción",
				initialBalance: "Balance inicial: ",
				currentBalance: "Balance actual: ",
				initialDate: "Fecha de inicio:",
				finalDate: "Fecha de fin: ",
				notMovements: "Este plan aún no ha realizado movimientos",
				yield: "Rendimiento",
				projectedYield: "Rendimiento proyectado",
				seeMore: "Ver más",
				errors: {
					tokenNotFound: {
						header: "Token no encontrado",
						content:
							"El token suministrado no es correcto, por favor intente realizar la\n" +
							"            operación de nuevo.",
					},
					tokenExpired: {
						header: "Token expirado",
						content:
							"El token suministrado ha expirado, por favor intente realizar la operación de nuevo.",
					},
				},
				modalDetails: {
					header: "Detalle de los movimientos de",
					subheader:
						"En la gráfica se puede observar los distintos movimientos que se han realizado.",
				},
				modalModifyDesc: {
					header: "Añadir descripción",
					planDesc: "Descripción del plan",
					placeholderDesc: "Fondo de inversión familiar",
				},
				modalConfirm: {
					header: "Confirmar Inactivación",
					description:
						"Hemos enviado un token a su dirección de correo electrónico para\n" +
						"                validar la transacción, ingrese el token en el campo requerido.\n" +
						"                La inactivacion del plan antes de la fecha de cierre le hará\n" +
						"                perder las ganancias acumuladas. ¿Desea continuar?",
					actions: {
						buttonYes: "Si",
						buttonNo: "No",
					},
				},
				modalSuccess: {
					header: "Transacción exitosa",
					content: "El plan ha sido desactivado exitosamente.",
				},
				modalFail: {
					header: "Transacción fallida",
					content:
						"El plan no ha podido ser desactivado en este momento, intente de nuevo mas tarde.",
				},
			},
		},
		home: {
			notificationEmailVerify: {
				content: "ahora puede disfrutar de todos nuestros servicios",
				header: {
					line1: "El correo",
					line2: " ha sido verificado exitosamente.",
				},
			},
			loading: "Cargando...",
			banner: {
				items: {
					first: {
						header: "rápido y seguro",
						content:
							"Compra y vende tus bitcoins rápido y seguro desde cualquier parte del mundo",
					},
					second: {
						header: "Envíos a tasas bajas",
						content:
							"Envía tu dinero desde cualquier parte del mundo a una tasa baja y con rápidez",
					},
					third: {
						header: "gana bitcoins en sólo dos clicks",
						content:
							"Conoce de nuestros distintos planes de inversión para seguir creciendo tu capital con nosotros",
					},
				},
			},
			shortcut: {
				header: "Compra y Venta local",
				buy: "COMPRA",
				sell: "VENTA",
				buyVerb: "Comprar",
				sellVerb: "Vender",
				atention: "Precios Referenciales",
				seeMore: "Ver Más",
				hide: "Ocultar",
				priceReferential: "Precios referenciales de mercados locales",
			},
			homeLogue: {
				accountCurrent: "CUENTA CORRIENTE",
				accountFixedTerm: "CUENTA PLAZO FIJO",
				accountFixedTerm2: "Cuenta Plazo Fijo",
				fastChange: "Cambio rápido",
				deposit: "DEPOSITAR",
				transfer: "TRANSFERIR",
				change: "CAMBIO",
				changeTitleModal: "Cambio",
				fastchangeTitleModal: "Cambio rápido",
				WalletAndBalance: {
					typeChange: "Tipo de cambio",
					placeholderTypeChange: "Seleccione el tipo de cambio",
					usdToBtc: "Desde USD a BTC",
					btcToUsd: "Desde BTC a USD",
					availableBalance: "Saldo Disponible",
					amount: "Monto en",
					price: "Precio",
					amountReceive: "Monto a recibir",
					businessLimits: "Limites por Transacción",
					amountMaxLimitAvalible: "El monto es superior a su saldo ",
					amountMinLimit: "El monto es menor el límite comercial",
					amountMaxLimit: "El monto ha alcanzado el límite comercial",
					avalibleOption: "Opción no disponible",
					send: {
						confirmTx: "Confirmar transacción",
						confirMessage: "¿Está seguro que desea continuar con la operación?",
						buttonClose: "Cerrar",
						buttonAccept: "Aceptar",
						success: "Transacción exitosa",
						successmessage: "Su operacion fue realizada con exito",
						fail: "Transacción Fallida",
						failBalance: "El monto indicado es superior a su balance",
						failBalanceAmount: "No posee saldo en",
						failLimits:
							"Los montos indicados se encuentran fuera del rango de limites",
					},
				},
				moneyClickHome: {
					typeChange: "Tipo de cambio",
					placeholderTypeChange: "Seleccione el tipo de cambio",
					dollarBtcToMoneyclick: "Desde DollarBTC a MoneyClick",
					moneyclickToDollarBtc: "Desde MoneyClick a DollarBTC",
					buttonChangeMoneyclick: "Cambio rápido",
					availableBalance: "Saldo Disponible",
					amount: "Monto",
					change: "CAMBIO",
					send: {
						confirmTx: "Confirmar transacción",
						confirMessage: "¿Está seguro que desea continuar con la operación?",
						buttonClose: "Cerrar",
						buttonAccept: "Aceptar",
						success: "Transacción exitosa",
						successmessage: "Su operacion fue realizada con exito",
						fail: "Transacción Fallida",
						failBalanceAmount: "No posee saldo en",
						failmessage: "El monto indicado es superior a su balance",
						failmessage2: "El monto debe ser distinto de 0",
					},
				},
			},
			fiatGaugeModal: {
				sell: "Vender",
				buy: "Comprar",
				table: {
					headers: {
						type: "Tipo de operación",
						price: "Precio",
						change6H: "Cambio % 6H",
						change24H: "Cambio % 24H",
					},
				},
				buttonClose: "Cerrar",
			},
			review: {
				header: "Comentarios",
				lastComments: "Recientes",
				allComments: "Todos",
				featuredComments: "Destacados",
				rating: "Calificación",
				comment: "Comentario",
				userName: "Usuario",
			},
			statistic: {
				btcStatistic: "BTC negociados en las últimas 24 horas",
				operationStatistic: "Cantidad de operaciones",
			},
		},
		fiatCarouselStatistics: {
			buy: "Compra:",
			sell: "Venta:",
			usdChange: "Cambio USD",
			forexPrice: "Precio Forex",
			statistics: "Estadísticas",
			footerLabel:
				"Precios Referenciales del Bitcoin a Nivel Local en todo el Mundo",
		},
		calculator: {
			errors: {
				target: "Error: Seleccione una moneda diferente a la objetivo",
				base: "Error: Seleccione una moneda diferente a la base",
			},
			header: "Calculadora de cambios",
			placeholderBase: "Seleccione moneda base",
			placeholderTarget: "Seleccione moneda objetivo",
			placeholderCoinBase: "Moneda base",
			placeholderCoinTarget: "Moneda objetivo",
			footer:
				"Todas las cifras son tipos de cambio del mercado medio en tiempo\n" +
				"              real, que no están disponibles para clientes individuales y sirven\n" +
				"              solo de referencia. Para los tipos que cotizamos para las\n" +
				"              transferencias de dinero, use nuestro servicios de transferencias",
			footerMobile:
				"Todas las cifras son tipos de cambio del mercado medio en tiempo\n" +
				"              real, que no están disponibles para clientes individuales\n" +
				"              y sirven solo de referencia.",
		},
		carousel: {
			openAccount: "Abrir Cuenta",
			buttonGetAccess: "Obten fácil acceso",
		},
		dynamicForm: {
			labels: {
				bank: "Banco",
				accountNumber: "N° de cuenta",
				accountHolderName: "Nombre del Titular",
				accountInterbankCode : "Código interbancario",
				accountHolderPhone : "Teléfono del titular",
				remember: "Recuerde completar todos los campos en la opcion de perfil",
				accountHolderId: "N° de documento ",
				accountType: "Tipo de cuenta",
				officesInfoId: "ID de oficina",
				text: "Tipo de pago",
				description: "Descripción",
				descriptionContent: "No posee",
				bankLogin: "Usuario del banco",
				bankPassword: "Contraseña del banco",
				optionsTextOne: "Sin credenciales",
				optionsTextTwo: "Con credenciales",
				optionsSelect: "Opciones",
				emailReceiver: "Email del Receptor",
				accountWireNumber: "N° de cuenta wire",
				commission: "Comisión",
				vat: "VAT",
				cardType: "Tipo de Tarjeta de Crédito",
				cardNumber: "N° de Tarjeta de Crédito",
				cardHolderName: "Nombre del titular de la tarjeta",
				expDate: "Fecha de expiración",
				csc: "Código de Seguridad (CSC)",
				zipCode: "Código Postal",
				placeholderTypePayment: "Tipo de Medio",
				creditCard: "Tarjeta de Crédito",
				type: "Tipo de pago",
				CREDIT_CARD: "Tarjeta de Crédito",
				bankAccount: "Cuenta bancaria",
				accountAddress: "Dirección de la cuenta",
				accountZip: "Código postal",
				bankRoutingNumber: "N° routing bancario",
				bankSwiftCode: "Código de swift bancario",
				accountWireRoutingNumber: "N° routing bancario wire",
				bankAndOffice: "Banco/Oficina",
				officesInfoId: "Oficina",
			},
			placeholderOption: "Seleccione una opción...",
			buttonAdd: "Crear Medio de pago",
			buttonVerify: "Verificar Medio de pago",
		},
		fastChange: {
			title: "Cambio rápido",
			buy: {
				title: "Comprar",
				availableBalance: "Saldo disponible",
				amount: "Monto",
				price: "Precio",
				commission: "Comisión",
				amountReceive: "Monto a recibir",
			},
			sell: {
				title: "Vender",
				availableBalance: "Saldo disponible",
				amount: "Monto",
				price: "Precio",
				commission: "Comisión",
				amountReceive: "Monto a recibir",
			},
		},
		forgotPassword: {
			header: "Recuperar contraseña",
		},
		sendTokenResetPassword: {
			form: {
				title: "Ingrese su email para iniciar el proceso",
				captchaLabel: "Por favor, demuestre que usted es un humano",
				buttonConfirm: "Confirmar",
				buttonCancel: "Cancelar",
				buttonClose: "Cerrar",
			},
			errors: {
				incompleteData: "Datos incompletos.",
			},
		},
		tokenResetPassword: {
			errors: {
				failToken: "Disculpe, su token no ha podido ser confirmado",
				serverError: "Ha ocurrido un error el servidor, intente más tarde",
				emptyToken: "Debe ingresar un token para confirmar",
			},
			message:
				"Hemos enviado un token de verificación a tu correo electrónico. Copia y pega ese valor para continuar el proceso.",
			buttonContinue: "Continuar",
			buttonCancel: "Cancelar",
			buttonClose: "Cerrar",
		},
		codeResetPassword: {
			message:
				"Hemos enviado un código a tu número telefónico, por favor ingresa el código para continuar con el proceso",
			errors: {
				failToken: "Disculpe, su token no ha podido ser confirmado",
				serverError: "Ha ocurrido un error el servidor, intente más tarde",
				serverError2:
					"Ha ocurrido un error el servidor, reenvíe el código o intente más tarde",
			},
			responseAccept: "Su solicitud ha sido procesada, espere por favor",
			labelCode: "Código",
			buttonContinue: "Continuar",
			buttonCancel: "Cancelar",
			buttonClose: "Cerrar",
		},
		resetFormPassword: {
			errors: {
				wrongData: "Debe ingresar los datos correctamente",
				minimalLength: "La contraseña debe tener mínimo cuatro caracteres",
				notMatch: "Las contraseñas no coinciden",
				failChange: "No hemos podido cambiar su contraseña, intente mas tarde",
			},
			successChange: "Tu contraseña ha sido cambiada exitosamente",
			form: {
				labelNew: "Nueva Contraseña",
				labelRepeat: "Repetir Contraseña",
				buttonSend: "Enviar",
			},
		},
		login2FA: {
			errors: {
				failAuth:
					"Código no ha podido ser autenticado. Ingrese nuevamente el código.",
				serverError: "Disculpe ha ocurrido un error en el servidor",
				serverError2:
					"Disculpe ha ocurrido un error en el servidor, intente más tarde",
				requiredField: "Este campo no puede estar en blanco",
				failVerifyToken: "Disculpe no hemos podido verificar su token",
				failVerifyAnswer: "Su respuesta de seguridad es incorrecta",
			},
			helpMessage:
				"Para casos de robo, pérdida o cualquier situación extraordinaria puede inhabilitar la autenticación de dos pasos enviando un token a su correo electrónico y seguir los pasos que se mencionan",
			endHelpMessage:
				"El factor de autenticación de dos pasos ha sido desactivado , por favor ve a inicio de sesión para ingresar.",
			successSendToken:
				"Por favor revise su correo electronico e ingrese el token que le hemos enviado para verificar su identidad y culminar con el proceso gracias",
			modalSendToken: {
				header: "Necesitas ayuda",
				send: {
					labelToken: "Token de verificación",
					labelSecurityQuestion: "Pregunta de Seguridad: ",
					buttonCancel: "Cancelar",
					buttonClose: "Cerrar",
					buttonConfirm: "Confirmar",
				},
				notSend: {
					labelQuestion: "¿Desea que enviemos un token de seguridad?",
					buttonYes: "Si",
					buttonNo: "No",
				},
			},
			header: "Autenticación de dos pasos",
			body2:
				"Por favor ingrese su código de seguridad proporcionado por Google Autenticator\n" +
				"                     para proceder con tu inicio de sesión.",
			body:
				"Hemos enviado un código de seguridad a tu número de teléfono\n" +
				"                    móvil. Ingresa el código para autenticar tu inicio de\n" +
				"                    sesión.",
			form: {
				label: "Código de verificación",
				buttonConfirm: "Confirmar",
				buttonResend: "Solicitar SMS",
				iNeedHelp: "Necesito ayuda",
			},
		},
		homeMobile: {
			placeholderSelectCoin: "Seleccione moneda",
			carousel: {
				item1: {
					header: "Abre tu cuenta en BITCOIN",
					content: "Es muy fácil",
				},
				item2: {
					header: "Disfruta",
					content: "Beneficios de Depósitos a plazos fijos",
				},
				item3: {
					header: "Te brindamos una plataforma segura para:",
					content:
						"Depósitos/Retiros en nuestras oficinas y Transferencias locales e internacionales",
				},
				hft: {
					header: "PLANES HFT",
					content:
						"Utilice nuestros planes HFT para generar bitcoins y ganancias automáticamente.",
				},
				opt: {
					header: "COMPRA Y VENTA",
					content:
						"Compra y vende tus bitcoins en todo el mundo. Sin cargos por adelantado.",
				},
				exchange: {
					header: "INTERCAMBIO MUNDIAL",
					content: "Envíe dinero a todos rápidamente y a precios bajos.",
				},
				cryptoExchange: {
					header: "CRIPTOMONEDAS, FOREX Y LIQUIDEZ CFD",
					content:
						"Más de 800 instrumentos comerciales de 7 clases de activos disponibles a través de una sola cuenta marginal",
				},
				creditCards: {
					header: "TARJETAS DE CRÉDITO",
					content: "Tarjetas de crédito con cuentas asociadas y prepagadas",
				},
			},
			operations: {
				header: "OPERACIONES",
				button: {
					buy: "Comprar Bitcoins",
					sell: "Vender Bitcoins",
				},
			},
			balance: {
				header: "BALANCE",
				content: {
					balance: "Saldo:",
					hft: "HFT:",
					forex: "Forex: ",
					cryptoExchange: "Crypto Exchange: ",
				},
			},
			otherOptions: {
				header: "OTRAS OPCIONES",
				content: {
					profile: "Perfil",
					forum: "Foro",
					who: "¿Quienes somos?",
					retail: "Punto de venta",
				},
			},
			help: {
				header: "AYUDA",
				content: {
					limits: "Límites de operaciones",
					charges: "Cargos por operaciones",
					faq: "Preguntas Frecuentes",
					guide: "Guía de Cryptos",
					contact: "Contáctenos",
					legal: "Legal",
				},
			},
			moneyClick: {
				header: "MONEYCLICK",
				download: "Descarga App",
				moneyClickRetail: "App MoneyClick Retail",
				moneyClickRetailAdmin: "App MoneyClick Retail Admin",
			},
			retail: {
				header: "RETAIL",
				content: {
					balanceEscrow: "Depósito: ",
					actualLimit: "Límite",
					name: "Nombre: ",
				},
			},
		},
		forum: {
			errors: {
				emptyCategory: "Debe seleccionar una categoría",
				postingError: "Hubo un error al crear su post. Intente de nuevo",
				notSupportFileError: "Archivo no soportado",
			},
			successPosting: "Su Post se ha creado exitosamente",
			menu: {
				feed: "Mis Posts",
				all: "Todos",
				categories: "Categorias",
				vertical: {
					placeholderSearch: "Buscar posts...",
					notResults: "No se encontraron resultados",
					forumHeader: "Foros",
					regionsHeader: "Regiones",
				},
			},
			notAuth: {
				please: "Por favor ",
				login: "inicie sesión ",
				signup: "regístrese",
				or: "o ",
				end: " para publicar o comentar en el foro",
			},
			newPost: {
				writeAPost: "ESCRIBE UN POST",
				placeholderTitle: "Título",
				placeholderContent: "Escriba aquí su contenido",
				placeholderCategory: "Categoría",
				attachment:
					"Haga click sobre el icono o arrastre para incluir su imagen",
				buttonChangeAttachment: "Cambiar",
				buttonPost: "Publicar",
			},
			feed: {
				editPost: "Editar Post",
				deletePost: "Eliminar Post",
				closePost: "Cerrar Post",
				emptyFeed: "No tiene posts para mostrar",
				options: "Opciones",
			},
			replies: {
				header: "Comentarios",
				reply: "Responder",
				form: {
					replyBody: "Escriba su respuesta aquí",
					successHeader: "¡Publicado!",
					successPublish: "Tu respuesta ha sido pulicada exitosamente",
					failHeader: "Lo sentimos mucho",
					failPublish:
						"Un error ha ocurrido mientras publicamos tu respuesta, disculpe",
				},
				comments: {
					form: {
						commentBody: "Escriba su comentario aquí",
						successHeader: "¡Publicado!",
						successPublish: "Tu comentario ha sido publicado exitosamente",
						failHeader: "Lo sentimos mucho",
						failPublish:
							"Un error ha ocurrido mientras publicabamos tu comentario",
						buttonComment: "Comentar",
					},
				},
			},
			myFeed: {
				actions: {
					edit: {
						successHeader: "Edición Exitosa",
						successBody: "La modificación de su publicación ha sido exitosa",
						failHeader: "Edición Fallida",
						failBody: "Ha ocurrido un error en la edición de su publicación",
					},
					inactivation: {
						successHeader: "Inactivación Exitosa",
						successBody:
							"Su publicación ha sido inactivada. No podrá recibir más comentarios",
						failHeader: "Inactivación Fallida",
						failBody:
							"Ha ocurrido un error durante la inactivación de su publicación. Intente más tarde",
					},
					deleting: {
						successHeader: "Eliminación Exitosa",
						successBody:
							"Su publicación ha sido eliminada. No podrá visualizarla de nuevo en su feed",
						failHeader: "Error",
						failBody:
							"Ha ocurrido un error durante la eliminación de su publicación. Intente más tarde",
					},
				},
				modalEdit: {
					header: "Editar tu publicación",
					title: "Título",
					content: "Contenido",
					buttonCancel: "Cancelar",
					buttonClose: "Cerrar",
					buttonSave: "Guardar",
				},
				modalDelete: {
					header: "Eliminar publicación",
					question:
						" ¿Está seguro que desea eliminar su publicación? Esta operación es irreversible",
					buttonYes: "Si",
					buttonNo: "No",
				},
				modalInactivate: {
					header: "Inactivar publicación",
					question:
						"Al inactivar una publicación esta no será visible para los demas usuarios y no podrá recibir más respuestas\n" +
						"              ¿Está seguro que desea inactivar su publicación?",
					buttonYes: "Si",
					buttonNo: "No",
				},
				notAuth: "No ha iniciado sesión",
				notPosts: "No tiene posts para mostrar",
				empty: "Sin resultados",
			},
		},
		wallet: {
			menu: {
				send: "Enviar Bitcoins",
				receive: "Recibir Bitcoins",
				tx: "Transacciones",
				btc_tx: "Bitcoins",
				usd_tx: "Dolares",
			},
			menuMobile: {
				send: "Enviar",
				receive: "Recibir",
				tx: "Transacciones",
				btc_tx: "Bitcoins",
				usd_tx: "Dolares",
			},
			send: {
				errors: {
					required: "Este campo es requerido",
					format:
						"La dirección no corresponde con una dirección de cartera bitcoin",
					equalAddress:
						"Debe indicar una dirección de cartera distinta a las propias",
					numberFormat: "Este campo debe poseer un formato numérico",
					maxAllow: "El monto a enviar supera el máximo disponible",
					maxAllow2: "El monto maximo a enviar es de :",
					positiveNumber: "El monto a enviar debe ser mayor a 0.",
					tokenNotFoundHeader: "Token no encontrado",
					tokenNotFoundBody:
						"El token suministrado no es correcto, por favor intente realizar la\n" +
						"            operación de nuevo.",
					tokenExpiredHeader: "Token expirado",
					tokenExpiredBody:
						"El token suministrado ha expirado, por favor intente realizar la\n" +
						"            operación de nuevo.",
					weSorry: "Lo sentimos",
					failTransaction:
						"La operación no se puede realizar en estos momentos. Intente de\n" +
						"            nuevo en unos minutos.",
				},
				token: "Token",
				code: "Código",
				successTxHeader: "Transacción exitosa",
				successTxBody: "Los fondos han sido transferidos exitosamente.",
				loading: "Cargando...",
				waiting: "Realizando transacción...",
				availableBalance: "Saldo disponible: ",
				verifiedBalance: "Saldo por verificar: ",
				addressReceiver: "Dirección bitcoin del receptor",
				amountBTC: "Monto en bitcoins",
				description: "Descripción",
				placeholderDescription: "Identifica tus envíos (opcional)",
				buttonContinue: "Continuar",
				confirmTx: "Confirmar transacción",
				descriptionTx:
					"Hemos enviado un token a su dirección de correo\n" +
					"  electrónico para validar la transacción, ingrese el token en el campo requerido.",
				descriptionTxSms:
					"Hemos enviado un código a su numero teléfonico\n" +
					"  para validar la transacción, ingrese el código en el campo requerido.",
				buttonCancel: "Cancelar",
				buttonClose: "Cerrar",
				buttonAccept: "Aceptar",
				buttonYes: "Si",
				buttonNot: "No",
				confirMessage: "¿Está seguro que desea continuar con la operación?",
				sended: "su código ha sido enviado",
				notsended: "ocurrio un error al enviar su código",
				info: {
					question: "¿Cuánto tarda una transacción de bitcoins?",
					answer1: "Inmediato para wallets dentro de dollarBTC.",
					answer2: "24 horas continuas para wallets fuera de dollarBTC.",
					commissions: "Comisiones por bitcoins salientes",
					internal: "Entre wallets dollarBTC NO se aplica comisión.",
					external:
						"Para envío a wallets fuera de dollarBTC existe un cargo fijo de ",
				},
			},
			receive: {
				addressCopied: "Tu address ha sido copiada al portapapeles",
				loading: "Cargando...",
				infoMessage: {
					p1:
						"Para utilizar la Wallet es necesario que verifique su correo electrónico. Hemos enviado un email a",
					p2:
						"por favor revisa tu correo electrónico y sigue las instrucciones.",
				},
				qrCode: "Código QR",
				myAddress: "Utiliza esta dirección para recibir bitcoins",
				buttonCopy: "Copiar address",
				accordion: {
					txTitle: "Transacciones entrantes",
					txBody:
						"Recibir bitcoins suele llevar 30 minutos. No obstante, puede llevar hasta 14 días o más. La transacción\n" +
						" entrante debe recibir 3 confirmaciones en la red Bitcoin para que aparezca en su wallet.",
					commissionsHeader: "Comisiones por bitcoins entrantes",
					commissionsBody1: "Entre wallets dollarBTC NO se aplica comisión.",
					commissionsBody2:
						"Para recibir de wallets fuera de dollarBTC existe un cargo fijo de 0.00015 BTC.",
					oldAddresses: "Direcciones antiguas",
				},
				newAddressMessage:
					"Si deseas generar una nueva address para realizar\n" +
					'                    tus transacciones puedes presionar el botón "Generar address".\n' +
					"                    Recuerda que cada address tiene una duración de un mes, pero aún estará habilitada para realizar transacciones",
				buttonNewAddress: "Generar address",
				tableOldAddresses: {
					headers: {
						created: "Creada",
						address: "Dirección",
					},
				},
				modalNewAddress: {
					header: "Generar nueva address",
					body:
						"¿Desea generar una nueva address? Recuerde que esta nueva address tendrá una\n" +
						"                duración de un mes, pero aún estará habilitada para realizar transacciones al igual\n" +
						"                que todas la address previas.",
					buttonCancel: "Cancelar",
					buttonGenerate: "Generar",
					buttonClose: "Cerrar",
					messageResult: {
						success: "Nueva address generada exitosamente",
						error:
							"Ha ocurrido un error generando su nueva address. Intente más tarde",
					},
				},
			},
			tx: {
				operationType: {
					transferFromBALANCEToMC: "Envío de Balance a MoneyClick",
					transferFromMCToBALANCE: "Envío de MoneyClick a Balance",
					currencyChange: "Cambio de Moneda",
					withdraw: "Envío de BTC",
					initialDeposit: "Movimiento inicial",
					deposit: "BTC recibidos",
					transferToDollarBTC: "Envío de BTC",
					transferFromDollarBTC: "BTC recibidos",
					receive: "BTC recibidos",
					send: "Envío de BTC",
					credit: "Compra",
					debit: "Venta",
					planActivation: "Activación del plan ",
					planInactivation: "Inactivación del plan ",
					from: " de ",
					to: " a ",
					change: "Cambio",
					fastChange: "Cambio Rápido",
				},
				table: {
					headers: {
						type: "Tipo",
						date: "Fecha",
						amountBTC: "Monto BTC",
						description: "Descripción",
						status: "Estado",
						amount: "Monto",
					},
					cells: {
						coin: "\nMoneda: ",
						price: "\nPrecio: ",
						amount: "\nMonto: ",
						processing: "PROCESANDO",
						failure: "FALLIDA",
					},
					params: {
						previousText: "Anterior",
						nextText: "Siguiente",
						loadingText: "Cargando...",
						noDataText: "No hay transacciones",
						pageText: "Página",
						ofText: "de",
						rowsText: "filas",
						pageJumpText: "ir a la página",
						rowsSelectorText: "filas por página",
					},
				},
				loading: "Cargando...",
				totalReceived: "Total BTC recibidos",
				totalSent: "Total BTC enviados",
				totalReceivedUsd: "Total USD recibidos",
				totalSentUsd: "Total USD enviados",
			},
		},
		profile: {
			emptyMessage: "",
			menu: {
				myInfo: "Tus datos",
				paymentMethods: "Medios de pago",
				accountSecurity: "Cuenta",
				pointsOfSales: "Punto de venta",
				logout: "Cerrar sesión",
			},
			optionDetail: {
				sexList: {
					male: "Masculino",
					female: "Femenino",
				},
				documentType: {
					identificationCard: "Cédula",
					passport: "Pasaporte",
					other: "Otro",
				},
				docsImages: {
					identity: "Cédula de identidad",
					bank: "Documento de cuenta bancario",
					location: "Documento de dirección",
					selfie: "Selfie con documento de identidad",
				},
				messages: {
					modalMessage:
						"Hemos enviado un código de verificación a tu teléfono móvil registrado. Ingresa el código para completar la verificación.",
					phoneVerified: "Su teléfono ha sido verificado satisfactoriamente",
					phoneVerificationFail:
						"Su teléfono no ha podido ser verificado. Intente de nuevo o chequee su número de telefóno móvil.",
					emptyField: "Disculpe debe ingresar un dato en el campo",
					nicknameCreated:
						"Tu nombre de usuario ha sido creado satisfactoriamente",
					duplicatedNickname: "Este nombre de usuario ya existe",
					errorServer: "Error en el servidor",
					requiredField: "El campo es requerido",
					emailVerification:
						"Hemos enviado un email a tu dirección de correo electrónico para verificar tu correo",
					close: "Cerrar",
					errorInRed: "Verifique su conexión a internet e intente de nuevo",
					yourData: "Tus datos",
					emptyMessage: "No hay un mensaje para mostrar",
				},
				nickname: {
					value: "Nombre de usuario",
					create: "Crear",
					popup: "Crear nombre de usuario",
				},
				stepUser: {
					user: "Usuario",
					popup:
						"Por verificar. Inicie el proceso a través de la opción Actualizar datos",
					notInit: "Sin iniciar",
					contactUs: "Contáctenos",
					fail: "Fallido, Contáctenos",
				},
				stepPhone: {
					verified: "Verificado",
					phone: "Teléfono",
					popup: "Por verificar. Agregue su teléfono móvil",
					buttonVerify: "Verificar Teléfono",
					notVerify: "Sin verificar",
					byVerify: "Por verificar",
					verify: "Verificar",
					buttonCancel: "Cancelar",
					buttonClose: "Cerrar",
				},
				stepEmail: {
					email: "Correo",
					verified: "Verificado",
					buttonVerify: "Verificar",
					notVerify: "Sin verificar",
					popup: "Por verificar. Revise su correo",
				},
				stage: {
					verified: "Verificado",
					processing: "En proceso",
					fail: "Fallida",
				},
				loading: "Cargando...",
				fields: {
					name: "Nombre",
					lastName: "Apellido",
					email: "Correo",
					phone: "Teléfono móvil",
					id: "Documento de identidad",
					number: "N° de documento",
					sex: "Sexo",
					birthday: "Fecha de nacimiento",
					birthplace: "Lugar de nacimiento",
					familyContact: "Familiar de contacto",
					emailContact: "Email de contacto",
					securityQuestion: "Pregunta de seguridad",
					securityAnswer: "Respuesta de seguridad",
					localbitcoinUser: "Usuario de Localbitcoin",
					userFacebook: "Usuario de Facebook",
					companyName: "Nombre de la empresa",
					documentTypeFiscalRecord: "Documento de registro fiscal",
					numberFiscalRecord: "N° de registro",
					registrationYear: "Año de registro",
					companyAddress: "Dirección de la empresa",
					address: "Dirección",
					documents: "Documentos",
				},
				buttonUpdate: "Actualizar datos",
				modalVerification: {
					header: "Verificación",
					labelCode: "Código",
				},
				modalNickname: {
					header: "Nombre de usuario",
					subHeader: "Crea tu nombre de usuario",
					labelNickname: "Nombre de usuario",
					buttonCancel: "Cancelar",
					buttonSave: "Guardar",
					buttonClose: "Cerrar",
				},
			},
			addAccount: {
				specificBank: "Desde el Mismo Banco",
				thirdBank: "Desde otro Banco",
				wire: "Wire (Transferencia Bancaria)",
				international: "Banco Internacional (Swift o Aba)",
				cryptoWallet: "Transferencia a Crypto Wallet",
				checkDeposit: "Depósito en Cheque",
				cashDeposit: "Depósito en Efectivo",
				transfer: "Transferencia Bancaria",
				electronicTrans: "Transferencia Electrónica",
				creditCard: "Tarjeta de crédito",
				personalCheckDeposit: "Cheque Personal",
				cashierCheckDeposit: "Cheque de Gerencia",
				moneyOrder: "Orden de Dinero",

				messages: {
					addAccountSuccess:
						"Su medio de pago ha sido agregado satisfactoriamente",
					errorServer:
						"Disculpe ha ocurrido un error en el servidor intente mas tarde",
					errorEmailReceiverEmpty: "El email no puede estar vacío",
					errorEmailReceiverWrong: "Debe ser un email válido",
					errorExternalPaymentCreate:
						"No se pudo crear el medio de pago por error del sistema",
					errorExistExternalPayment:
						"No se pudo crear el medio de pago porque ya existe",
				},
				addPaymentMethod: "Agregar medio de pago",
				placeholderCoin: "Seleccione una moneda",
				placeholderMethodPayment: "Seleccione un medio de pago",
				buttonAdd: "Agregar",
				buttonBack: "Regresar",
				emailReceiver: "Email del destinatario",
				placeholderEmailReceiver: "ejemplo@mail.com",
			},
			addOwnAccount: {
				messages: {
					addPaymentMethod:
						" Atención: Los medios de pago propios deben ser verificados. Por favor, manténgase en línea y siga las instrucciones de uno de nuestros moderadores.",
					statusAFail: {
						part1:
							"Para agregar medios de pago propios es necesario que verifique su correo electrónico. Hemos enviado un email a",
						part2:
							", por favor revisa tu correo electrónico y sigue las instrucciones.",
					},
					statusBFail:
						"Para agregar medios de pago propios es necesario que verifique su número de teléfono móvil, puedes hacerlo a través de la opción tus datos.",
					statusCUninitiated:
						"Para agregar medios de pago propios es necesario que verifique su usuario, puedes iniciar este proceso a través de la opcion actualizar datos en la opción tus datos.",
					statusCProcessing:
						"Para agregar medios de pago propios es necesario que verifique su usuario, este proceso ya ha sido iniciado.",
					statusCFail: {
						part1:
							"Para agregar medios de pago propios es necesario que verifique su usuario, su usuario no ha podido ser verificado.",
						contactUs: "Contáctenos",
					},
				},
			},
			listAccountOther: {
				currentTableHeaders: {
					coin: "Moneda",
					type: "Tipo",
					data: "Datos",
					action: "Acción",
				},
				buttonDelete: "Eliminar",
				errorInRed: "Verifique su conexión a internet a intente de nuevo",
				currentTable: {
					previous: "Anterior",
					next: "Siguiente",
					loading: "Cargando...",
					noData: "No hay medios de pago registrados",
					page: "Página",
					of: "de",
					rows: "filas",
					pageJump: "ir a la página",
					rowsSelector: "filas por página",
				},
				buttonAdd: "Agregar",
				modalVerification: {
					header: "Verificación",
					question: "¿Seguro que desea eliminar los datos de la cuenta?",
					buttonDelete: "Eliminar",
					buttonCancel: "Cancelar",
					buttonClose: "Cerrar",
				},
				modalResponse: {
					successMessage: "Su solicitud se ha procesado con éxito",
					failMessage: "Su solicitud no se ha podido procesar en este momento",
					buttonClose: "Cerrar",
				},
			},
			optionCurrent: {
				paymentMethods: "Medios de pago",
				menu: {
					wallet: "Wallet",
					holder: "Propios / Para Comprar y Vender",
					other: "Terceros / Para Enviar Dinero",
				},
				menuMobile: {
					wallet: "Wallet",
					holder: "Propios/Comprar y Vender",
					other: "Terceros/Enviar Dinero",
				},
			},
			optionPointsOfSales: {
				pointsOfSales: "Punto de venta",
				menu: {
					information: "Información",
					operations: "Operaciones disponibles",
					sellBalance: "Venta de saldo",
					buyBalance: "Compra de saldo",
					informationMobile: "Información",
					operationsMobile: "Operaciones disponibles",
					cashbackMobile: "Avance",
					buyBtcMobile: "Compra",
					retail: {
						header: "Retail",
						escrow: "Depósito de garantía",
						escrowLimit: "Límite depósito de garantía:",
						cash: "Efectivo:",
						noCash: "Otros medios:",
						id: "ID",
						coordinates: "Coordenadas",
						name: "Nombre",
						description: "Descripción",
						currencies: "Moneda",
						email: "Correo electrónico",
						statusCreated: "Estado de creación",
						ACTIVATED: "Activado",
						FAIL: "Fallido",
						SENDED: "Enviado",
						ANALYSING: "Analizando",
						selectCurrency: "Seleccionar moneda",
						operationsTable: {
							currency: "Moneda",
							type: "Tipo",
							sellBalance: "Vender saldo",
							buyBalance: "Comprar saldo",
						},
						movements: "Movimientos",
					},

					linkedDevices: "Dispositivos vinculados",
				},
				movementsSearch: {
					search: "Buscar",
					typeBalance: "Tipo de balance",
					selectSearch: "Seleccione un tipo",
					escrow: "Depósito de garantía",
					cash: "Efectivo",
					noCash: "Otros medios",
				},
				movementsTable: {
					date: "Fecha",
					amount: "Monto",
					status: "Estatus",
					type: "Tipo",
					info: "Información",
					typeOperation: "Tipo Operación",
				},
				buttonAddEscrow: "Agregar depósito de garantía",
				buttonRemoveEscrow: "Quitar saldo de garantía",
				messages: {
					errorLimit: "Límite de balance excedido",
					successAdd: "Operación exitosa",
					errorAdd: "En estos momentos no se puede realizar la operación",
					errorPriceChange: "El precio de la oferta ha cambiado",
					addEscrow: "Está a punto de realizar un deposito al punto de venta ",
					addEscrow1: " cuyo ID es ",
					balanceAvailable: "Saldo en cartera insuficiente",
				},
				title: "Descarga también nuestras apps",
				titleMobile: "Descarga Moneyclick",
			},
			optionSecurity: {
				activeTwoFactor1:
					"Seleccione una opción para proceder con su activación,recuerde que para iniciar\n" +
					" sesión luego de habilitar esta opción no será requerido durante un período menor a una hora desde su\n" +
					" última conexión, en caso contrario se le solicitará un nuevo código para ingresar ¿Estás seguro que deseas activar la autenticación de dos pasos? ",
				activeTwoFactorGA:
					"El código proporcionado por la app de Google Autenticator sera utilizado \n" +
					" para iniciar sesión luego de habilitar esta opción, tenga en cuenta el \n" +
					"vencimiento de cada código , este tiene un lapso de validez de un minuto, \n" +
					"luego de eso se le solicitará un nuevo código para ingresar ¿Estás seguro \n" +
					"que deseas activar la autenticación de dos pasos?",
				activeTwoFactor:
					"El código enviado a su teléfono utilizado para iniciar sesión luego de habilitar esta opción no será requerido durante un período menor a una hora desde su última conexión, en caso contrario se le solicitará un nuevo código para ingresar ¿Estás seguro que deseas activar la autenticación de dos pasos?",
				inactivateTwoFactor:
					"¿Estas seguro que deseas inhabilitar la autenticación de dos pasos?",
				errors: {
					failUpdate:
						"Disculpe no hemos podido realizar su solicitud intente mas tarde",
				},
				successUpdate: "Tus datos han sido actualizados satisfactoriamente",
				buttonYes: "Si",
				buttonNo: "No",
				buttonAccept: "Aceptar",
				buttonClose: "Cerrar",
				buttonDisabled2FA: "Inhabilitar dos pasos",
				popUpActivated: "Activada",
				buttonCreate: "Crear",
				buttonVerify: "Verificar",
				popUpInactivated:
					"No está activada, para activar esta opción debe configurar su número teléfonico y verificarlo, además debe configurar una pregunta y respuesta de seguridad, si ya lo hizo puede activarla",
				buttonEnabled2FA: "Activar dos pasos",
				percents: {
					low: "Bajo",
					middle: "Medio",
					high: "Alto",
				},
				header: "Seguridad de tu cuenta",
				progress: "El nivel de seguridad de tu cuenta es:",
				verify: "Verificación",
				list: {
					header: "Configure las distintas opciones que posee:",
					options: {
						changePassword: "Cambio de contraseña",
						recommendation:
							"Es recomendable cambiar tu contraseña con regularidad para mantener tu cuenta más segura",
						twoFA: "Autenticación de dos pasos",
						labelSmsorEmail: "Envío de Codigo",
						SendSmsorEmail: "Envío de código para operaciones",
						prefered2F: "autenticacion de 2 pasos via",
					},
				},
				buttonChangePassword: "Cambiar contraseña",
				twoFactorOptions: {
					preferedTwoFactorRequest: {
						sms: "SMS",
						google: "Google Authenticator",
					},
				},
				secureCodeProcessRequest: {
					prefered: {
						email: "Correo electrónico",
						sms: "SMS",
					},
				},
			},
			updatePasswordUser: {
				errors: {
					wrongData: "Debe ingresar los datos correctamente",
					server:
						"Disculpe ha ocurrido un error en el servidor, intente más tarde",
					genericError: "Ha ocurrido un error, intente más tarde",
					wrongToken:
						"El token que ha ingresado es incorrecto intente de nuevo",
					wrongPassword: "La contraseña es incorrecta",
					minimalChar: "La contraseña debe tener un minimo de 4 caracteres",
					notMatch: "Las contraseñas no coinciden",
					emptyToken: "Debe ingresar el token para confirmar",
				},
				modalMessage:
					"Hemos enviado un token de verificación a tu correo electrónico. Ingresa ese valor para completar el cambio de contraseña. ",
				successPasswordUpdate: "Tu contraseña ha sido cambiada exitosamente",
				changePassword: "Cambio de contraseña",
				currentPassword: "Contraseña actual",
				newPassword: "Nueva Contraseña",
				placeholderNewPassword: "Debe poseer mínimo 4 caracteres",
				repeatPassword: "Repetir Contraseña",
				buttonSend: "Enviar",
				buttonCancel: "Cancelar",
				buttonClose: "Cerrar",
				buttonVerify: "Verificar",
				verify: "Verificación",
			},
			updateProfile: {
				sexList: {
					male: "Masculino",
					female: "Femenino",
				},
				documentType: {
					id: "ID",
					dni: "DNI",
					identificationCard: "Cedula",
					passport: "Pasaporte",
					other: "Otro",
				},
				errors: {
					repeatedPhone: "Disculpe el número telefónico ya esta en uso",
					errorServer: "Disculpe ha ocurrido un error en el servicio",
					emptyPhone:
						"Disculpe debe ingresar el número teléfonico si ha selecionado un código de area",
					longPhone:
						"Disculpe el numero telefonico debe incluir 7 digitos o mas ",
					emptyFields:
						"Disculpe debe por lo menos incluir su número teléfonico para actualizar sus datos ",
					emptyFiscalRecord:
						"Disculpe debe incluir el número de registro fiscal del país donde se encuentra la empresa",
					emptyFiscalRecordType:
						"Disculpe debe incluir el tipo de registro fiscal del país donde se encuentra la empresa",
					emptyFiscalRecordYear: "Disculpe debe incluir el año de registro",
					emptyFiscalRecordName:
						"Disculpe debe incluir el nombre de la empresa",
					emptySecurityAnswer:
						"Disculpe debe incluir la respuesta de seguridad",
					emptySecurityDirection: "Disculpe debe incluir una direccion",
					emptySecurityQuestion:
						"Disculpe debe incluir la pregunta de seguridad",
					emptyBirthplace: "Disculpe debe incluir el lugar de nacimiento",
					emptyBirthday: "Disculpe debe incluir su fecha de nacimiento",
					emptyIDNumber:
						"Disculpe debe incluir el numero de documento de identidad",
					emptyIDNumberType:
						"Disculpe debe incluir el tipo de documento de identidad",
					emptyLastName: "Disculpe debe incluir su apellido",
					emptyName: "Disculpe debe incluir su nombre",
					emptySelfie: "Disculpe debe incluir la selfie",
					emptyAddress: "Disculpe debe incluir el comprobante de dirección",
					emptyBank: "Disculpe debe incluir el comprobante de cuenta bancaria",
					emptyID: "Disculpe debe incluir el archivo de identificación",
					fileNotSupported: "Tipo de archivo no soportado",
					fileSize: "Tamaño de archivo excede el permitido",
				},
				successUpdate: "Sus datos han sido actualizados satisfactoriamente",
				successSentData:
					"Sus datos han sido enviados satisfactoriamente. Este proceso de verificación puede tardar hasta 72 horas.",
				header: "Actualizar Datos",
				form: {
					name: "Nombres",
					placeholderName: "Ingrese nombres",
					lastName: "Apellidos",
					placeholderLastName: "Ingrese apellidos",
					sex: "Sexo",
					placeholderSex: "Seleccione...",
					documentType: "Tipo de documento",
					placeholderDocumentType: "Seleccione...",
					other: "Especifique",
					numberId: "N° de documento",
					birthday: "Fecha de nacimiento",
					birthplace: "Lugar de nacimiento",
					country: "Código de país",
					placeholderCountry: "Seleccione un país...",
					phone: "Teléfono móvil",
					placeholderPhone: "Ejemplo 1234567",
					securityQuestion: "Pregunta de seguridad",
					securityAnswer: "Respuesta de seguridad",
					contactFamily: "Familiar de contacto",
					contactCompany: "Persona de contacto",
					placeholderContact: "Nombre del familiar",
					contactEmailFamily: "Email de contacto",
					contactEmailCompany: "Email de contacto ",
					localbitcoinUser: "Usuario de Localbitcoin",
					facebookUser: "Usuario Facebook",
					addressPersonal: "Dirección",
					addressCompany: "Dirección de la empresa",
					verifyCUninitiatedPersonal: {
						warning: "¡Atención!",
						messageWarning:
							"Si desea iniciar el proceso de verificación incluya los documentos que se indican a continuación .",
						messageFile:
							"Haga click sobre el icono o arrastre para cargar el archivo correspondiente.",
						supportedTypeFiles:
							"Tipos de archivos permitidos: jpg, jpeg, png, gif, pdf. Tamaño máximo de los archivos 5Mb",
						documentID: "Documento de identificación (DNI, Pasporte, ID)",
						bankAccountSupport: "Comprobante de cuenta bancaria asociada",
						addressSupport: "Comprobante de dirección",
						selfieSupport: "Selfie con documento de dirección",
						buttonChange: "Cambiar",
						fileNotSupported: "Archivo no soportado",
					},
					verifyCUninitiatedCompany: {
						warning: "¡Atención!",
						messageWarning:
							"Si desea iniciar el proceso de verificación de su empresa incluya los documentos que se indican a continuación .",
						name: "Nombre de la empresa",
						registerYear: "Año de registro",
						registerFiscalType: "Tipo de registro fiscal",
						registerFiscalNumber: "N° de registro fiscal",
						messageFile:
							"Haga click sobre el icono o arrastre para cargar el archivo correspondiente.",
						supportedTypeFiles:
							"Tipos de archivos permitidos: jpg, jpeg, png, gif, pdf. Tamaño máximo de los archivos 5Mb",
						documentID:
							"Documento de identidad de la persona que se está verificando y debe coincidir con una de las personas firmantes en el registro mercantil.",
						bankAccountSupport:
							"Comprobante de cuenta bancaria jurídica asociada",
						registerFiscal:
							"Registro mercantil (especificamente la hoja donde aparezcan los socios con sello húmedo)",
						selfieSupport: "Selfie con documento de identidad de la empresa",
						buttonChange: "Cambiar",
						fileNotSupported: "Archivo no soportado",
					},
					buttonSave: "Guardar",
					buttonVerify: "Verificar",
					buttonBack: "Regresar",
				},
				modalInitVerification: {
					header: "Iniciar Verificación",
					warning:
						"Sus Datos Personales estarán protegidos por protocolos de Seguridad Digital Encriptados. Toda su información está amparada por las  Regulaciones Legales  estipuladas en la Ley de Instituciones de Tecnología Financiera y sus  apartados de Privacidad de Contenidos y Protección de Usuarios de los Estados Unidos de México, solo podrán acceder a ella Oficiales de Cumplimiento de DLBTC Trade S.A. de CV autorizados y certificados para validar sus datos en la plataforma. En caso de ser necesario se comunicarán con usted para validar su información.",
					buttonYes: "Si",
					buttonNo: "No",
					buttonClose: "Cerrar",
				},
			},
			waitingVerification: {
				listLabelDataToVerify: {
					bank: "Banco",
					accountNumber: "N° de cuenta",
					accountHolderName: "Nombre",
					accountInterbankCode : "Código interbancario",
				    accountHolderPhone : "Teléfono del titular",
					accountHolderId: "ID",
					type: "Tipo de pago",
					currency: "Moneda",
					accountType: "Tipo de cuenta",
					officesInfoId: "ID de oficina",
					cardType: "Tipo de tarjeta",
					cardNumber: "N° de tarjeta de credito",
					cardHolderName: "Titular de la tarjeta",
					expDate: "Fecha de expiración",
					csc: "Código de Seguridad",
					zipCode: "Código postal",
				},
				messages: {
					processing: {
						header: "Verificación de medio de pago en PROCESO",
						content:
							"Se enviará un microdepósito a tu cuenta para verificar que efectivamente existe y eres el dueño de la misma. Adjunte la captura de pantalla del microdepósito en el chat para que el moderador pueda terminar el proceso. Al concluir el proceso se le notificará para que pueda continuar con su COMPRA. Verifique nuevamente los datos de su cuenta y de presentar algún error, cancele la verificación. No dude en comunicarse con nuestro staff de moderadores para cualquier duda relacionada al proceso.",
						creditCardContent:
							"Se debe adjuntar foto del lado frontal de la tarjeta de crédito. Solo las tarjetas de crédito que permiten cargos internacionales son aceptadas, consulte con su operador bancario para mas información.",
					},
					fail: {
						header: "Verificación de medio de pago FALLIDA",
						content:
							"Normalmente el fallo de este proceso se debe a error en los datos proporcionados. Comuníquese por nuestro chat con nuestros moderadores para conocer más detalles del proceso o cancele la verificación e intente el nuevamente.",
					},
					success: {
						header: "Verificación de medio de pago EXITOSA",
						content:
							"Ahora puede realizar operaciones con su medio de pago, gracias por preferirnos.",
					},
					canceled: {
						header: "Verificación de medio de pago CANCELADA",
						content:
							"Usted ha cancelado la verificación de su medio de pago, tenga en cuenta que dicho medio de pago no podra ser utilizado para realizar operaciones en el portal, puede eliminarlo e intentar de nuevo el proceso de verificación, Gracias.",
					},
					data: {
						header: "Datos de cuenta",
					},
				},
				buttonBack: "Regresar",
				chatWaiting: {
					errors: {
						requiredField: "Este campo es requerido",
						fileNotSupported: "Tipo de archivo no soportado",
						exceededSize: "El tamaño del archivo excede el permitido",
					},
					placeholderMessage: "Escribe tu mensaje aquí",
					buttonAttachment: "Adjuntar documento",
					buttonCancelVerification: "Cancelar verificación",
					buttonCloseVerification: "Cerrar verificación",
					buttonSend: "Enviar",
					labelMe: "Yo",
					labelModerator: "Moderador",
					operationTimeLeft: "Quedan 10 minutos para cerrar la operación",
					operationTimeExpired: "El tiempo de operación ha expirado",
					buttonSeeAttachment: "Ver archivo adjunto",
				},
			},
			walletAccount: {
				messages: {
					copiedAddress: "Tu dirección ha sido copiada al portapapeles",
					verifyEmailLink: {
						part1:
							"Para utilizar la Wallet es necesario que verifique su correo electrónico. Hemos enviado un email a",
						part2:
							", por favor revisa tu correo electrónico y sigue las instrucciones.",
					},
					errorInRed: "Verifique su conexion a internet e intente nuevamente",
				},
				qrCode: "Código QR",
				loading: "Cargando...",
				header: "Utiliza esta dirección para recibir bitcoins",
				buttonCopy: "Copiar address",
			},
			optionAccount: {
				header: "Cuenta",
				menu: {
					security: "Seguridad",
					devices: "Dispositivos",
				},
			},
			optionDevices: {
				errors: {
					userNotFound: "El usuario no fue encontrado",
					unexpectedError: "Ha ocurrido un error inesperado. Intente más tarde",
				},
				tableHeader: {
					id: "ID",
					name: "Nombre",
					model: "Módelo",
					so: "Sistema operativo",
					source: "Fuente",
					date: "Fecha",
					status: "Estatus",
					actions: "Acciones",
				},
				table: {
					previous: "Anterior",
					next: "Siguiente",
					loading: "Cargando...",
					noData: "No hay dispositivos registrados",
					page: "Página",
					of: "de",
					rows: "filas",
					pageJump: "ir a la página",
					rowsSelector: "filas por página",
				},
				buttonRemove: "Remover permiso",
				buttonAdd: "Autorizar permiso",
				statusActive: "Activo",
				statusInactive: "Inactivo",
				modalRemovePermission: {
					header: "Remover dispositivo",
					content:
						"¿Está seguro que desea remover el acceso a este dispositivo?",
					buttonYes: "Si",
					buttonNo: "No",
					headerAdd: "Autorizar dispositivo",
					contentAdd:
						"¿Está seguro que desea permitir el acceso a este dispositivo?",
				},
				successRemoving: "Su dispositivo se ha removido exitosamente",
				successAdd: "Su dispositivo ha sido autorizado",
			},
			optionMovements: {
				tableHeader: {
					id: "ID",
					amount: "Monto",
					date: "Fecha",
				},
				table: {
					previous: "Anterior",
					next: "Siguiente",
					loading: "Cargando...",
					noData: "No hay datos",
					page: "Página",
					of: "de",
					rows: "filas",
					pageJump: "ir a la página",
					rowsSelector: "filas por página",
				},
			},
		},
		sell: {
			loading: "Cargando...",
			notAuth: {
				part1: "Por favor, ",
				part2: "inicie sesión",
				part3: " o ",
				part4: "regístrese",
				part5: " para vender Bitcoins",
			},
			notVerifiedA: {
				part1:
					"Para realizar operaciones de venta es necesario que verifique su correo electrónico. Hemos enviado un email a ",
				part2:
					", por favor revisa tu correo electrónico para continuar con la operación.",
			},
			menu: {
				sell: "Vender Bitcoins",
				mySells: "Mis Ventas",
			},
			form: {
				errors: {
					notPaymentMethods:
						"Actualmente no contamos con medios de pago para la moneda seleccionada",
					paymentMethodsNotAvailable:
						"Actualmente no hay medios de pago disponibles para la moneda seleccionada",
					notOffers:
						"Disculpe, en este momento no podemos realizar su operación. Intente más tarde.",
					notOffersByCurrency:
						"Actualmente no hay ofertas para la moneda seleccionada",
					errorServer: "Disculpe ha ocurrido un error en el servidor",
					notOffersAndPaymentMethod:
						"Actualmente no hay ofertas para la moneda y el medio de pago seleccionado",
					amountMaxLimit: "El monto ha alcanzado el límite comercial",
					requiredField: "Este campo es requerido",
					outBordersAmount:
						"El valor debe estar entre el monto mínimo y el monto máximo",
					incompleteData: "Debe incluir todos los datos",
					acceptTerms: "Debe aceptar los términos y condiciones",
					accountTypeReceiverEmpty:
						"Debe seleccionar un tipo de cuenta de destino",
					emailReceiverEmpty: "Este campo es obligatorio",
					emailReceiverWrongFormat:
						"Debe introducir un correo electrónico válido",
					conceptOperationEmpty: "El concepto no puede estar vacío",
					tokenInvalid: "Debe ingresar el código/token solicitado",
				},
				coin: "Moneda",
				receiptOfFunds: "Recepción de fondos",
				placeholderCoin: "Seleccionar",
				paymentMethods: "Cuenta destino",
				placeholderPaymentMethods: "Seleccionar",
				type: "Tipo de Pago",
				typeElectro: "Tipo de Transferencia Electrónica",
				placeholderType: "Seleccionar",
				addToFrequent: "Agregar a frecuentes",
				businessLimits: "Límites comerciales",
				amountIn: "Monto en ",
				amount: "Monto",
				amountFiat: "Monto Fiat",
				amountBTC: "Monto en BTC",
				forexRate: "Tasa Forex",
				averagePriceReference: "Precio referencial promedio",
				comment: "Mensaje para el Moderador",
				placeholderComment: "Escriba su comentario para nuestros moderadores.",
				accept: "Aceptar",
				terms: "Términos y Condiciones",
				sell: "Vender",
				reject: "Abandonar oferta",
				buttonClose: "Cerrar",
				buttonAcceptTerms: "Aceptar Términos y Condiciones",
				create: "Crear",
				messages: {
					redAlert:
						"Advertencia: Verifique que su código wallet contenga los datos correctos y correspondan a\n" +
						"esta criptomoneda. En caso de poner código erróneo puede perder el monto de su\n" +
						"transacción. El sistema no admite reintegros ni cancelaciones.",
					greenAlert:
						"Aviso: El pago se emitirá dentro de un plazo de 90 minutos.",
					blueAlert:
						"Nota: En algunos casos ciertas transferencias pueden tardar, por causa del monto, el banco,\n" +
						"el país, la diferencia horaria o incluso fechas festivas, llegando incluso a demorar hasta 72\n" +
						"horas en liberarse. Regularmente las transferencias de cualquier tipo estarán disponibles\n" +
						"dentro de las primeras seis horas o al día hábil siguiente. Si necesita disponer del pago de\n" +
						"manera mas rapida recomendamos utilice una cuenta de destino de uno de los bancos\n" +
						"disponibles en Tipo de Transferencia / Desde el Mismo Banco (xxxx). Recuerde que las\n" +
						"transferencias pueden generar cargos bancarios o tributarios en algunos países. El sistema no\n" +
						"admite devoluciones ni cancelaciones.",
					recomended: " ** Bancos recomendados para transacciones inmediatas",
				},
				typeReceiverAccount: {
					own: "CUENTAS PROPIAS",
					thirdParties: "ENVÍOS DE DINERO",
					moneyClick: "Transferir a MoneyClick",
					creditCard: "Recargar Tarjeta Visa/Mastercard",
				},
				typeReceiverFund: {
					cash: "Efectivo",
					electronicTransfer: "Transferencia electrónica",
				},
				accountTypeReceiver: "Tipo de Cuenta Destino",
				placeholderAccountTypeReceiver: "Seleccionar",
				emailReceiver: "Email del destinatario",
				placeholderEmailReceiver: "ejemplo@mail.com",
				operationConcept: "Concepto de la operación",
				placeholderOperationConcept: "Ejemplo: Pago del alquiler",
				placeholderTypeReceiverFunds: "Seleccionar",
			},
			mySells: {
				errors: {
					requiredField: "Este campo es requerido",
					fileNotSupported: "Tipo de archivo no soportado",
					exceededSize: "Tamaño de archivo excede el permitido",
					failCancelSell:
						"Hubo un error al cancelar la operación. Intente más tarde",
				},
				bill: {
					pdfHeader: "Factura",
					ticket: "Ticket",
					time: "Hora",
					date: "Fecha",
					amountIn: "Cantidad en ",
					amountBTC: "Cantidad en BTC",
					appliedRate: "Tasa aplicada",
					tax: "Impuesto",
					bankRate: "Tasa bancaria",
					issuingBank: "Banco Emisor del Pago",
					namePayer: "Nombre del Pagador",
					receivingBank: "Banco de Recepción",
				},
				terms: termsSell.ters,
				tableHeaders: {
					id: "ID",
					date: "Fecha",
					btc: "BTC",
					amount: "Monto",
					coin: "Moneda",
					status: "Estado",
					transactions: "Transacciones",
					statusValues: {
						started: "Iniciado",
						success: "Exitosa",
						waitingPayment: "Esperando por pago",
						canceled: "Cancelada",
						paid: "Pagado",
						claim: "Reclamo",
						waitingConfirmation: "Esperando confirmación de receptor",
						waitingToStartOperation: "Esperando para iniciar",
					},
				},
				table: {
					previous: "Anterior",
					next: "Siguiente",
					loading: "Cargando...",
					noData: "No hay operaciones",
					page: "Página",
					of: "de",
					rows: "filas",
					pageJump: "ir a la página",
					rowsSelector: "filas por página",
				},
				accordion: {
					details: "Detalles de la operación",
					operation: "Operación",
					terms: "Términos y Condiciones",
					seeMore: "...Ver más",
					digitalBill: "Factura digital",
					buttonDownload: "Descargar",
				},
				warningClaim: "La operación está en un proceso de reclamo",
				placeholderMessage: "Escribe tu mensaje aquí",
				claimNotificationSent: "Notificación de reclamo enviada",
				buttonClaim: "Realizar Reclamo",
				buttonSend: "Enviar",
				buttonAttachment: "Adjuntar documento",
				labelMe: "Yo",
				labelModerator: "Moderador",
				operationTimeLeft: "Quedan 10 minutos para cerrar la operación",
				operationTimeout: "El tiempo de operación ha expirado",
				buttonSeeAttachment: "Ver archivo adjunto",
				modalTerms: {
					header: "Términos y Condiciones",
					buttonClose: "Cerrar",
				},
				modalSendSell: {
					messages: {
						notMatchOffer: "La oferta fue cancelada",
						notBalanceMaster:
							"En este momento no se puede procesar su operación.",
						notBalanceUser: "No tiene suficientes fondos.",
						notAvailable:
							"Este medio de pago no está disponible en este momento.",
						newPrice: "El precio cambio, nuevo precio ",
						notBetweenMinMax: "El monto no está entre el mínimo y el máximo ",
						confirmSell: " Su solicitud de venta ha sido confirmada.",
						confirmChange: "deseas continuar la operación ?",
					},
					header: "Enviar solicitud de venta",
					requestSell: "Solicitud de venta de",
					btcBy: "BTC por ",
					buttonCancel: "Cancelar",
					buttonAccept: "Aceptar",
					buttonClose: "Cerrar",
				},
				modalCancel: {
					header: "Cancelar venta",
					content: "¿Está seguro que desea cancelar esta operación de venta?",
					buttonCancel: "No",
					buttonClose: "No",
					buttonAccept: "Si",
					successCancelSell: "La operación de venta ha sido cancelada",
				},
				buttonCancel: "Cancelar venta",
				buttonClose: "Cerrar venta",
				cancellationWindow: "Puede cancelar esta venta en los próximos: ",
			},
		},
		buy: {
			loading: "Cargando...",
			notAuth: {
				part1: "Por favor, ",
				part2: "inicie sesión",
				part3: " o ",
				part4: "regístrese",
				part5: " para vender Bitcoins",
			},
			menu: {
				buy: "Comprar Bitcoins",
				myBuys: "Mis Compras",
			},
			modalNotVerify: {
				notVerifiedA:
					"Para enviar y recibir bitcoin es necesaria la verificación de su correo electrónico, si deseas realizar compras dentro de la plataforma usando medios bancarios se debe completar y verificar tus datos para ello ve a la opción de perfil de usuario. Debes ser el titular de las cuentas, luego de pasar la verificación el sistema te permitirá continuar las compras de forma exitosa.",
				header: "Atención",
				buttonClose: "Cerrar",
			},
			formVerificationEmail: {
				message: {
					part1: "Hemos enviado un email a ",
					part2:
						", por favor revisa tu correo electrónico para continuar con la operación.",
				},
			},
			formVerificationPhone: {
				messages: {
					sentToken: {
						part1:
							"Hemos enviado un código de verificación a tu teléfono móvil ",
						part2: "******",
						part3:
							". Ingresa el código para completar la verificación. Podrás reenviar nuevamente el código despues de transcurridos 60 segundos",
					},
					verifiedPhone: {
						part1: "El teléfono móvil ",
						part2: "******",
						part3: " ha sido verificado exitosamente.",
					},
					failVerification:
						"Su teléfono no ha podido ser verificado. Intente de nuevo o chequee su número de teléfon móvil.",
					notVerifyB:
						"Para realizar operaciones de compra es necesario que verifique su teléfono móvil, por favor presiona Enviar código para iniciar la verificación.",
				},
				errors: {
					tokenNotSent:
						"Ha ocurrido un problema al enviar el código, por favor intente nuevamente.",
					phoneUsed: "El número de teléfono ya se encuentra en uso.",
				},
				formRequestCode: {
					countryCode: "Código del país",
					placeholderCountryCode: "Seleccione un país...",
					phone: "Teléfono Móvil",
					buttonSend: "Enviar código",
				},
				formCodeSent: {
					code: "Código",
					buttonVerify: "Verificar",
					buttonResend: "Reenviar código",
					buttonBack: "Regresar",
				},
			},
			formVerificationIdentity: {
				sexList: {
					male: "Masculino",
					female: "Femenino",
				},
				documentType: {
					id: "ID",
					dni: "DNI",
					identificationCard: "Cedula",
					passport: "Pasaporte",
					other: "Otro",
				},
				errors: {
					fileNotSupported: "Tipo de archivo no soportado",
					fileSize: "Tamaño de archivo excede el permitido",
					missingFiles: "Disculpe debe incluir todos los archivos",
					errorNetwork:
						"Error de Red, verifique su conexión e intente más tarde",
					emptyIDNumber: "Disculpe debe incluir el numero de identificación",
					emptyIDNumberType:
						"Disculpe debe incluir el tipo de documento de identidad",
					emptySecurityAnswer:
						"Disculpe debe incluir la respuesta de seguridad",
					emptySecurityQuestion:
						"Disculpe debe incluir la pregunta de seguridad",
					selectTypeDocument:
						"Disculpe debe seleccionar un tipo de documento de identificación",
				},
				successFilesFiles:
					"Sus archivos han sido enviados satisfactoriamente. Este proceso de verificación puede tardar hasta 72 horas.",
				form: {
					name: "Nombres",
					placeholderName: "Ingrese nombres",
					lastName: "Apellidos",
					placeholderLastName: "Ingrese apellidos",
					sex: "Sexo",
					placeholderSex: "Seleccione...",
					documentType: "Tipo de documento",
					placeholderDocumentType: "Seleccione...",
					other: "Especifique",
					numberId: "N° de documento",
					birthday: "Fecha de nacimiento",
					birthplace: "Lugar de nacimiento",
					country: "Código de país",
					placeholderCountry: "Seleccione un país...",
					phone: "Teléfono móvil",
					placeholderPhone: "Ejemplo 1234567",
					securityQuestion: "Pregunta de seguridad",
					securityAnswer: "Respuesta de seguridad",
					contactFamily: "Familiar de contacto",
					contactCompany: "Persona de contacto de la empresa",
					placeholderContact: "Nombre del familiar",
					contactEmailFamily: "Email de contacto",
					contactEmailCompany: "Email de contacto de la empresa",
					localbitcoinUser: "Usuario de Localbitcoin",
					facebookUser: "Usuario Facebook",
					addressPersonal: "Dirección",
					addressCompany: "Dirección de la empresa",
					verifyCUninitiatedPersonal: {
						warning: "¡Atención!",
						messageWarning:
							"Si desea iniciar el proceso de verificación incluya los documentos que se indican a continuación .",
						messageFile:
							"Haga click sobre el icono o arrastre para cargar el archivo correspondiente.",
						supportedTypeFiles:
							"Tipos de archivos permitidos: jpg, jpeg, png, gif, pdf. Tamaño máximo de los archivos 5Mb",
						documentID: "Documento de identificación (DNI, Pasporte, ID)",
						bankAccountSupport: "Comprobante de cuenta bancaria asociada",
						addressSupport: "Comprobante de dirección",
						selfieSupport: "Selfie con documento de dirección",
						buttonChange: "Cambiar",
						fileNotSupported: "Archivo no soportado",
					},
					verifyCUninitiatedCompany: {
						warning: "¡Atención!",
						messageWarning:
							"Si desea iniciar el proceso de verificación de su empresa incluya los documentos que se indican a continuación .",
						name: "Nombre de la empresa",
						registerYear: "Año de registro",
						registerFiscalType: "Tipo de registro fiscal",
						registerFiscalNumber: "N° de registro fiscal",
						messageFile:
							"Haga click sobre el icono o arrastre para cargar el archivo correspondiente.",
						supportedTypeFiles:
							"Tipos de archivos permitidos: jpg, jpeg, png, gif, pdf. Tamaño máximo de los archivos 5Mb",
						documentID:
							"Documento de identidad de la persona que se está verificando y debe coincidir con una de las personas firmantes en el registro mercantil.",
						bankAccountSupport: "Comprobante de cuenta jurídica asociada",
						registerFiscal: "Registro mercantil (con sello humedo)",
						selfieSupport: "Selfie con documento de registro fiscal",
						buttonChange: "Cambiar",
						fileNotSupported: "Archivo no soportado",
					},
					buttonSave: "Guardar",
					buttonVerify: "Verificar",
					buttonBack: "Regresar",
				},
			},
			formChatVerification: {
				dataToVerify: {
					email: "Email",
					phone: "Teléfono",
					firstName: "Nombre",
					lastName: "Apellido",
					answerSecurity: "Respuesta de seguridad",
					questionSecurity: "Pregunta de seguridad",
					typeDocumentIdentity: "Tipo de documento",
					numberDocumentIdentity: "N° de documento",
					gender: "Sexo",
					female: "Femenino",
					male: "Masculino",
					birthdate: "Fecha de nacimiento",
					birthplace: "Lugar de nacimiento",
					userLocalBitcoin: "Usuario de LocalBitcoins",
					userFacebook: "Usuario de Facebook",
					nickname: "Nombre de Usuario",
					familyName: "Contacto",
					familyEmail: "Email de contacto",
					userDirection: "Dirección",
					bank: "Banco",
					accountNumber: "N° de cuenta",
					accountHolderName: "Nombre",
					accountInterbankCode : "Código interbancario",
				    accountHolderPhone : "Teléfono del titular",
					accountHolderId: "N° de documento",
					type: "Medio de Pago",
					currency: "Moneda",
					accountType: "Tipo de cuenta",
					officesInfoId: "ID de oficina",
					companyName: "Nombre de la empresa",
					documentTypeFiscalRecord: "Documento de registro fiscal",
					numberFiscalRecord: "N° de registro",
					registrationYear: "Año de registro",
					cardType: "Tipo de Tarjeta de Crédito",
					cardNumber: "N° de Tarjeta",
					cardHolderName: "Nombre del Titular",
					expDate: "Fecha de expiración",
					csc: "Código de Seguridad (CSC)",
					zipCode: "Código Postal",
					accountAddress: "Dirección de la cuenta",
					accountZip: "Código Postal",
					bankRoutingNumber: "N° routing bancario",
					bankSwiftCode: "Código de swift bancario",
					accountWireRoutingNumber: "N° routing bancario wire",
				},
				errors: {
					fileNotSupported: "Tipo de archivo no soportado",
					fileSize: "Tamaño de archivo excede el permitido",
					requiredField: "Este campo es requerido",
				},
				verifyC: {
					processing: {
						header: "Verificación de usuario en PROCESO",
						content:
							"Al concluir el proceso se le notificará para que pueda continuar con su COMPRA. No dude en comunicarse con nuestro staff de moderadores para cualquier duda relacionada al proceso.",
					},
					fail: {
						header: "Verificación de usuario FALLIDA",
						content:
							"Comuníquese por nuestro chat con nuestros moderadores para conocer detalles del proceso.",
					},
					success: {
						content: "Usuario verificado exitosamente",
						buttonContinue: "Continuar mi compra",
					},
				},
				verifyD: {
					processing: {
						header: "Verificación de medio de pago en PROCESO",
						content:
							"Se enviará un microdepósito a tu cuenta para verificar que efectivamente existe y eres el dueño de la misma. Adjunte la captura de pantalla del microdepósito en el chat para que el moderador pueda terminar el proceso. Al concluir el proceso se le notificará para que pueda continuar con su COMPRA. Verifique nuevamente los datos de su cuenta y de presentar algún error, cancele la verificación. No dude en comunicarse con nuestro staff de moderadores para cualquier duda relacionada al proceso.",
						creditCardContent:
							"Se debe adjuntar foto del lado frontal de la tarjeta de crédito. Solo las tarjetas de crédito que permiten cargos internacionales son aceptadas, consulte con su operador bancario para mas información",
					},
					fail: {
						header: "Verificación de medio de pago FALLIDA",
						content:
							"Normalmente el fallo de este proceso se debe a error en los datos proporcionados. Comuníquese por nuestro chat con nuestros moderadores para conocer más detalles del proceso o cancele la verificación e intente el nuevamente.",
					},
					success: {
						content: "Medio de pago verificado exitosamente.",
						buttonContinue: "Continuar mi compra",
					},
					cancel: {
						content: "La verificación del medio de pago fue cancelada.",
						buttonContinue: "Continuar mi compra",
					},
				},
				placeholderChat: "Escribe tu mensaje aquí",
				buttonCancel: "Cancelar verificación",
				buttonClose: "Cerrar verificación",
				buttonAttachment: "Adjuntar documento",
				buttonSend: "Enviar",
				labelMe: "Yo",
				labelModerator: "Moderador",
				operationTimeLeft: "Quedan 10 minutos para cerrar la operación",
				operationTimeExpired: "El tiempo de operación ha expirado",
				buttonSeeAttachment: "Ver archivo adjunto",
			},
			form: {
				errors: {
					userdaylyLimit: "Limite diario de usuario alcanzado",
					usermonthlyLimit: "Limite mensual de usuario alcanzado",
					requiredField: "Este campo es requerido",
					minAndMax:
						"El valor debe estar entre el monto mínimo y el monto máximo",
					acceptTerms: "Debe aceptar los términos y condiciones",
					notAmount: "Ya no hay montos para operar con esta oferta",
					notOffersForCurrencyAndBank:
						"Disculpe, en este momento no podemos realizar su operación. Intente más tarde.",
					notOffersForCurrency:
						"Actualmente no hay ofertas para la moneda seleccionada",
					notProcessed:
						"Actualmente no podemos procesar su oferta, intente más tarde.",
					amountBetween: "El monto seleccionado debe estar entre ",
					comercialLimit: "Un monto maximo de $ 2,000 es permitido ",
					firstBuy:
						"Tenga en cuenta que para su primera operación con nosotros, le solicitamos que inicie la transferencia en persona en su banco.",
					notBalance: "Usted no tiene balance suficiente.",
					changePrice: "Cambio el precio de la oferta",
					amountMaxLimit: "El monto actual ha alcanzado el límite comercial",
					notOffers:
						"Actualmente no existen ofertas, por favor intente con otras opciones.",
					notBalanceExternal: "Su saldo no es suficiente",
					server:
						"Disculpe ha ocurrido un error en el servidor, intente más tarde",
				},
				messages: {
					successRequest: "Su solicitud de compra ha sido confirmada.",
					blueAlert:
						"Nota: Sus bitcoins estarán diferidos hasta que su depósito esté acreditado y sea verificado por\n" +
						"nuestro Operador. El sistema no admite reintegros ni cancelaciones. En algunos casos los\n" +
						"bancos pueden demorar en liberar los pagos, ésto depende del banco, la cuenta, el monto o si\n" +
						"se requieren validaciones adicionales.",
					redAlert:
						"Atención: La transferencia sólo podrá realizarla desde su cuenta bancaria verificada y\n" +
						"asociada a esta operación. En caso de hacerla desde otra cuenta su operación será anulada y\n" +
						"el pago reversado. Debe realizar el pago dentro del lapso establecido, marcar como Pago\n" +
						"Realizado y enviar un capture nítido al Operador. Coloque en Concepto de Pago: Compra de\n" +
						"Bitcoin con el código ID de la operación.",
					ethAlert:
						"Advertencia: Verifique que su código wallet contenga los datos correctos y correspondan a\n" +
						"esta criptomoneda. En caso de poner código erróneo puede perder el monto de su\n" +
						"transacción. El sistema no admite reintegros ni cancelaciones.",

          //greenAlert:"Un monto maximo de $ 2,000 es permitido "
        },
        fields: {
          banks: "Bancos/Oficinas",
          currency: "Moneda",
          typeCheck: "Tipo de cheque",
          placeholderCurrency: "Seleccionar",
          paymentMethods: "Medio de Pago",
          paymentsType: "Tipo de Pago",
          messageToTheModerator: "Mensaje para el Moderador",
          placeholderPaymentMethods: "Seleccionar",
          placeholderSelect: "Seleccionar",
          ownPaymentMethods: "Medios de Pago Propios",
          typeElectro: "Tipo de Transferencia Electrónica",
          placeholderOwnPaymentMethods: "Seleccionar",
          commercialLimits: "Límites comerciales",
          amount: "Monto",
          amountFiat: "Monto Fiat",
          amountBTC: "Monto en BTC",
          forexRate: "Tasa Forex",
          averagePriceReference: "Precio referencial promedio",
          placeholderType: "Seleccionar",
          placeholderComments:
            "Escriba su comentario para nuestros moderadores.",
          identifyBuy: "Descripción de la operación (opcional)",
          accept: "Aceptar",
          terms: "Términos y Condiciones",
          buttonBuy: "Comprar",
          reject: "Abandonar oferta",
          createPaymentMethod: "Crear",
          bankAccountBalance: "Saldo bancario",
        },
      },
      modalConfirm: {
        header: "Enviar solicitud de compra",
        request: {
          part1: "Solicitud de compra de ",
          part2: "BTC por",
        },
        payWindow: {
          part1: "Una vez enviada su solicitud de compra, dispone de ",
          part2:
            " minutos para finalizar la operación, en caso contrario será cancelada automáticamente.",
        },
        charges: {
          header: "Cargos por operación",
          VAT: "Impuesto: ",
          COMMISSION: "Comisión: ",
        },
        buttonCancel: "Cancelar",
        buttonAccept: "Aceptar",
        buttonClose: "Cerrar",
      },
      modalCreatePayment: {
        header: "Atención!",
        // body: {
        //   h3:
        //     "Antes de Seleccionar su Medio de Pago, lea detenidamente las siguientes instrucciones.",
        //   p1:
        //     "Las normas para transacciones bancarias cambian de país en país e incluso entre bancos. Esto puede afectar sus operaciones.",
        //   p2:
        //     "Tenga en cuenta las siguientes indicaciones antes de realizar su Pago: ",
        //   list: {
        //     item1: {
        //       recommended: "Recomendada",
        //       header: " Transferencias desde un Banco Específico",
        //       body: {
        //         p1:
        //           "Si Usted posee una cuenta bancaria dentro de alguno de los bancos que especificamos en nuestro listado de cuentas habilitadas para recibir su pago, Usted podrá realizar su Transferencia Electrónica y su pago será recibido y verificado de inmediato. Por lo tanto este medio de pago le garantiza rapidez en su transacción y salvo en muy pocos países genera comisiones bancarias.",
        //         p2:
        //           "Tenga en cuenta que en algunos casos este proceso puede demorar varias horas, lo que puede retardar la liberación de su Bitcoin.",
        //         p3:
        //           "Nota Importante: Solo use esta Opción si Usted es el dueño de la cuenta desde la cual realizara el pago, y si la misma esta dentro de alguno de los bancos especificados. Si realiza el pago desde un banco diferente su transacción tendrá un posible ajuste de tarifa de compra y puede generar cargos adicionales."
        //       }
        //     },
        //     item2: {
        //       header: "Transferencia desde un Tercer Banco",
        //       body: {
        //         p1:
        //           "Dependiendo del país y del banco este pago generalmente es reflejado en un lapso de 6, 24 o 48 horas hábiles. Si el pago entra el mismo día laboral el Precio de Compra de su BTC se mantendrá igual, pero si el pago entra a partir del día siguiente o días sub siguientes se podrá efectuar un ajuste en su tarifa de Precio de Compra de BTC.",
        //         p2:
        //           "Nuestra política comercial estipula beneficiar a nuestros Usuarios y al comercio, pero debido a las fuertes variaciones de precios su compra será traducida al precio vigente para el momento en que su dinero este disponible en nuestra cuenta.",
        //         p3:
        //           "También tenga en cuenta que este tipo de Medio de Pago puede generar cargos bancarios adicionales.",
        //         p4:
        //           "Los cargos extras cobrados por el banco y la variación del Precio de Compra del BTC determinaran el monto que se acreditara en su wallet una vez finalizada la Compra. ",
        //         p5:
        //           "Nota Importante: No olvide que solo aceptamos pagos efectuados desde una cuenta a su nombre y que una vez realizada la Operación esta no será reversible bajo ningún concepto. "
        //       }
        //     },
        //     item3: {
        //       header: "Depósito en Efectivo",
        //       body: {
        //         p1:
        //           "Dependiendo del País y la Institución Bancaria, se pueden recibir depósitos en efectivo (Cash). En la mayoría de los casos deben ser cantidades limitadas y se debe consultar con cada Banco si recibe o no depósitos en efectivo.",
        //         p2:
        //           "Es posible que el banco le pida justificación de los fondos.",
        //         p3:
        //           "Siempre debe colocar en el Recibo Bancario el numero de Recibo o Transacción emitido por nuestra plataforma, y escribir a mano y en letra legible “COMPRA DE BITCOIN NO REEMBOLSABLE”, una vez hecho esto tomar una foto y enviar el capture antes de Marcar el botón de Pago Realizado.",
        //         p4:
        //           "El Pago le será acreditado de Inmediato si cumple con todas las Instrucciones.",
        //         p5:
        //           "Para Depósitos en Efectivo de mas de Mil dólares o su equivalente en cualquier moneda, debe consultar al moderador. ",
        //         p6:
        //           "Nota Importante: Si Usted escoge la opción Deposito en Efectivo y realiza cualquier otro método de pago como Cheque o Giro Bancario por ejemplo, su transacción quedara diferida y podrá ser reversada por el Operador de DollarBTC, además de generar una penalidad y una Red Flag a su Cuenta de Usuario Para pagos en Efectivo debe cumplir estos requisitos y cualquier otro que le pida el Operador de DLBTC o que sea exigido por las Leyes para Prevención de Lavado de Dinero o Prevención de Actividades Terroristas vigentes. "
        //       }
        //     },
        //     item4: {
        //       header: "Wire (Transferencia Cablegráfica)",
        //       body: {
        //         p1:
        //           " Este medio de pago solo esta disponible en algunos países, el pago se acreditará en las siguientes 24 o 48 horas hábiles.",
        //         p2: "Debe enviar soporte de la operación totalmente legible.",
        //         p3:
        //           "El pagador debe comprobar que es el dueño de la cuenta de donde salen los fondos.",
        //         p4:
        //           "Este Medio de Pago esta disponible para Operaciones de cinco mil dólares americanos en adelante. "
        //       }
        //     },
        //     item5: {
        //       header: "Transferencia Internacional (Swift o Aba)",
        //       body: "Para este tipo de Pago debe Consultar al Moderador. "
        //     },
        //     item6: {
        //       header: "Depósito en Cheque",
        //       body:
        //         "Para este tipo de pago debe ponerse en contacto con el Moderador. "
        //     }
        //   }
        // },
        body: {
          h3:
            "Before selecting your payment method, carefully read the following instructions.",
          p1:
            "The rules for banking transactions change from country to country and even between banks. This can affect your operations.",
          p2:
            "Keep in mind the following indications before making your Payment: ",
          list: {
            item1: {
              recommended: "Recommended",
              header: " Transfers from a Specific Bank",
              body: {
                p1:
                  "If you have a bank account within one of the banks that we specify in our list of accounts enabled to receive your payment, you can make your Electronic Transfer and your payment will be received and verified immediately. Therefore this means of payment guarantees speed in your transaction and except in very few countries generates bank fees.",
                p2:
                  "Note that in some cases this process may take several hours, which may delay the release of your Bitcoin..",
                p3:
                  "Important Note: Only use this option if you are the owner of the account from which you made the payment, and if it is within one of the specified banks. If you make the payment from a different bank your transaction will have a possible adjustment of the purchase rate and may generate additional charges.",
              },
            },
            item2: {
              header: "Transfer from a Third Bank",
              body: {
                p1:
                  "Depending on the country and the bank, this payment is usually reflected in a period of 6, 24 or 48 working hours. If the payment falls on the same business day, the Purchase Price of your BTC will remain the same, but if the payment enters from the next day or following sub days, an adjustment can be made in your BTC Purchase Price rate..",
                p2:
                  "Our commercial policy stipulates to benefit our Users and to the commerce, but due to the strong variations of prices your purchase will be translated to the current price for the moment in which your money is available in our account.",
                p3:
                  "Also keep in mind that this type of Payment Method can generate additional bank charges.",
                p4:
                  "The extra charges charged by the bank and the variation of the BTC Purchase Price will determine the amount that will be credited to your wallet once the Purchase is completed.. ",
                p5:
                  "Important Note: Do not forget that we only accept payments made from an account in your name and that once the Transaction is made it will not be reversible under any circumstances. ",
              },
            },
            item3: {
              header: "Cash deposit",
              body: {
                p1:
                  "Depending on the Country and the Banking Institution, cash deposits can be received (Cash). In most cases they must be limited amounts and you should check with each bank whether or not you receive cash deposits.",
                p2: "The bank may ask you to justify the funds.",
                p3:
                  'You must always place on the Banking Receipt the Receipt or Transaction number issued by our platform, and write by hand and in legible handwriting "PURCHASE OF BITCOIN NON REFUNDABLE", once this is done take a photo and send the capture before you press the button of Payment Made.',
                p4:
                  "Payment will be credited immediately if you comply with all the instructions.",
                p5:
                  "For Cash Deposits of more than one thousand dollars or its equivalent in any currency, you must consult the moderator. ",
                p6:
                  "Important Note: If you choose the Cash Deposit option and make any other payment method such as Check or Bank Draft for example, your transaction will be deferred and may be reversed by the DollarBTC Operator, in addition to generating a penalty and a Red Flag to Your User Account For cash payments you must comply with these requirements and any other that the DLBTC Operator requests or that is required by the Laws for Prevention of Money Laundering or Prevention of Terrorist Activities in force.. ",
              },
            },
            item4: {
              header: "Wire ",
              body: {
                p1:
                  " This means of payment is only available in some countries, the payment will be credited in the following 24 or 48 business hours.",
                p2: "You must send fully readable operation support.",
                p3:
                  "The payer must check that he owns the account where the funds come from.",
                p4:
                  "This means of payment is available for operations of five thousand dollars and more. ",
              },
            },
            item5: {
              header: "International transfer (Swift o Aba)",
              body:
                "For this type of payment you should consult the Moderator. ",
            },
            item6: {
              header: "Deposit in Check",
              body:
                "For this type of payment you should consult the Moderator. ",
            },
          },
        },
        buttonAccept: "Aceptar",
      },
      modalTerms: {
        header: "Términos y Condiciones",
        terms: termsBuy,
        buttonClose: "Cerrar",
        buttonAcceptTerms: "Aceptar Términos y Condiciones",
      },
      history: {
        terms: termsBuy,
        errors: {
          requiredField: "Este campo es requerido",
          fileNotSupported: "Tipo de archivo no soportado",
          exceededSize: "Tamaño de archivo excede el permitido",
        },
        bill: {
          pdfHeader: "Factura",
          header: "Factura Digital",
          ticket: "Ticket",
          time: "Hora",
          date: "Fecha",
          amountIn: "Cantidad en ",
          amountBTC: "Cantidad en BTC",
          amountFiat: "Monto Fiat",
          currencyFiat: "Moneda Fiat",
          appliedRate: "Tasa aplicada",
          tax: "Impuesto",
          bankRate: "Tasa bancaria",
          issuingBank: "Banco Emisor del Pago",
          namePayer: "Nombre del Pagador",
          receivingBank: "Banco de Recepción",
        },
        messages: {
          waitingPaymentExpired: "Expiró el tiempo de su pago.",
          payVerificationSent: "Notificación de pago enviada con éxito.",
          sentProofValidPayment:
            "Para concluir su compra exitosamente debe adjuntar un comprobante de pago válido, claramente visible y con el número de transacción en el concepto de pago. Si no adjunta un comprobante de pago con estas características su operación no podrá ser verificada por el árbitro. Recuerde que debe concluir su pago antes del lapso establecido. Una vez adjunte el comprobante, presione el botón Marcar pago.",
          sentProof2:
            "Para concluir su compra exitosamente debe adjuntar un\n" +
            "                      recibo válido, visible y claro, con el número de\n" +
            "                      transacción en el concepto de pago si no adjunta un\n" +
            "                      comprobante de pago claro y visible su operación no podra\n" +
            "                      ser verificada por el árbitro. Debe concluir su pago antes\n" +
            "                      del lapso establecido. Una vez que alla adjuntado el\n" +
            "                      recibo precione el boton",
        },
        tableHeaders: {
          date: "Fecha",
          amount: "Monto",
          currency: "Moneda",
          status: "Estado",
          transactions: "Transacciones",
          statusValues: {
            started: "Iniciado",
            success: "Exitosa",
            waitingPayment: "Esperando por pago",
            canceled: "Cancelada",
            paid: "Pagado",
            claim: "Reclamo",
            payVerification: "Verificando pago",
          },
        },
        table: {
          previous: "Anterior",
          next: "Siguiente",
          loading: "Cargando...",
          noData: "No hay operaciones",
          page: "Página",
          of: "de",
          rows: "filas",
          pageJump: "ir a la página",
          rowsSelector: "filas por página",
        },
        accordion: {
          details: "Detalles de la operación",
          operation: "Operación #:",
          terms: "Términos y Condiciones",
          seeMore: "...Ver más",
          digitalBill: "Factura digital",
          buttonDownload: "Descargar",
          qualify: "Calificar",
        },
        payWindow: "Ventana de pago:",
        minutes: "Min.",
        buttonMarkPayment: "Marcar pago",
        warningClaim: "La operación está en un proceso de reclamo",
        placeholderMessage: "Escribe tu mensaje aquí",
        claimNotificationSent: "Notificación de reclamo enviada",
        buttonClaim: "Realizar Reclamo",
        buttonSend: "Enviar",
        buttonAttachment: "Adjuntar documento",
        buttonCancel: "Cancelar Compra",
        buttonClose: "Cancelar Compra",
        labelMe: "Yo",
        labelModerator: "Moderador",
        operationTimeLeft: "Quedan 10 minutes para cerrar la operación",
        operationTimeout: "El tiempo de operación ha expirado",
        buttonSeeAttachment: "Ver archivo adjunto",
        theOperation: "La operación",
        wasCreated: " fue creada exitosamente.",
        wasClaimed: " ha entrado a un proceso de reclamo.",
        modalCancel: {
          header: "Cancelar compra",
          content: "¿Está seguro que desea cancelar esta operación de compra?",
          buttonCancel: "Cancelar",
          buttonClose: "Cerrar",
          buttonAccept: "Aceptar",
        },
        modalQualify: {
          header: "Calificar operación",
          comment: "Comentario",
          qualify: "Calificar",
          send: "Enviar",
          messageSuccess: "Calificación realizada con éxito",
          messageError: "Ha ocurrido un error, por favor intente más tarde",
        },
      },
    },
    footer: {
      contact: "Contáctenos",
      about: "Acerca de nosotros",
      allRights: "Todos los derechos reservados",
    },
    inbox: {
      messages: {
        finished: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: FINALIZADA",
        },
        newMessage: {
          part1: "La operación ",
          part2: " ha recibido un nuevo mensaje",
        },
        canceled: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: CANCELADA",
        },
        waitingPayment: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: ESPERANDO POR PAGO",
        },
        fail: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: FALLIDA",
        },
        operationTimeLeft: "Quedan 10 minutos para cerrar la operación",
        operationTimeExpired: "El tiempo de operación ha expirado",
        paid: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: PAGADA",
        },
        created: {
          part1: "La operación ",
          part2: " ha sido CREADA",
        },
        success: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: EXITOSA",
        },
        claim: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: RECLAMO",
        },
        payVerification: {
          part1: "La operación ",
          part2: " ha cambiado su estado a: VERIFICACIÓN DE PAGO",
        },
        receiverConfirmation: {
          part1: "La operación ",
          part2:
            " ha cambiado su estado a: ESPERANDO POR CONFIRMACIÓN DEL RECEPTOR",
        },
        noMessages: "No tiene mensajes para mostrar",
      },
      read: "Leídas",
      unread: "No Leídas",
      notNotifications: "No tiene notificaciones pendientes",
      popupSafari: {
        headerAuthSession: "Autorizar audio",
        messageAuthSession:
          "Haga click en el botón para autorizar la reproducción de audio en esta sesión",
        buttonAuthorize: "Autorizar",
        headerAuthPermanent: "Autorización permanente",
        messageAuthPermanent:
          "Diríjase a configuraciones del navegador para autorizar a dollarBTC.com la reproducción automática de audio (solo para propósitos informativos sin publicidad de terceros)",
      },
    },
    guide: {
      header: "CURSO DE CRYPTOECONOMÍA",
      commons: {
        specificObjectives: "Objetivos Específicos",
        generalObjectives: "Objetivos Generales",
        content: "Contenido",
        theoreticalSection: "Sección teorica",
        practicalSection: "Sección práctica",
        conclusions: "Conclusiones",
      },
      modules: {
        one: {
          header: "MÓDULO I",
          sub: "Introducción a las Cryptoeconomía",
          generals: {
            one:
              "El participante de este módulo puede ser una persona con conocimientos nulos, básicos " +
              "o incluso intermedios. No para personas avanzadas.",
            two:
              "Este módulo pretende servir como una introducción general para aquellas personas que" +
              " participan ocasionalmente o quieren ingresar de alguna manera a la cryptoeconomía para" +
              " que puedan manejar los conceptos básicos y abrir su mente a las ilimitadas posibilidades de" +
              " este Nuevo tipo de economía.",
            three:
              "Una vez el participante de este Módulo de Introducción termine el mismo debe ser capaz de" +
              " poder entender y manejar claramente la base conceptual de la cryptoeconomía, las" +
              " diferencias con la economía tradicional, las ventajas y desventajas de ingresar, crecer " +
              "o mantenerse además de su capacidad como participante para evaluar el ambiente, sus" +
              " implicaciones, sus riesgos y responsabilidades además de poder estar en capacidad de " +
              "informar a cualquier persona del marco básico conceptual que involucra el manejo de activos" +
              " cryptoeconómicos.",
          },
          specifics: {
            one: "Manejo de Conceptos Básicos (BTC y Blockchain)",
            two:
              "Distinguir entre economía tradicional y economía descentralizada (BC/Fiat)",
            three: "Implicaciones de Participar en este ecosistema",
            four:
              "Saber Distinguir riesgos, oportunidades y esquemas de fraude",
            five: "Herramientas",
            six: "Tipos de Wallet",
            seven: "Exchange",
            eight: "Trade",
            nine: "Lending",
            ten: "Sistemas de pagosn",
            eleven: "Sistemas de producciónn",
            twelve: "Como Comprar/Vender (teórico)",
            thirteen:
              "Conocer los modelos de Inversión o de negocio para comenzar a participar" +
              "\t\nMinería" +
              "\t\nTrade" +
              "\t\nAhorro" +
              "\t\nInversión\n",
            fourteen: "Herramientas para sistema de Pagos local/internacional",
            fifteen:
              "Capacidad para analizar y entender el ecosistema y poder tomar decisiones basado en sus conocimientos para minimizar riesgos propios del desconocimiento de información",
            sixteen:
              "Al concluir el módulo el participante debe saber crear su wallet y hacer pagos, depósitos o transferencias. Crear su cuenta Exchange y una cuenta de intercambio para comprar sus primeros token e intercambiarlos por otros.",
          },
          content: {
            l1: "\u2022 Que es la Cryptoeconomía",
            l2:
              "\u2022 Que es Blockchain, cómo funciona, cuál es su fundamentación",
            l3:
              "\u2022 Economía Tradicional Vs Economía Descentralizada (blockchain)",
            l4: "\u2022 Ventajas",
            l5: "\u2022 Desventajas",
            l6: "\u2022 Fundamentos subyacentes",
            l7: "\u2022 Qué es Bitcoin",
            l8: "\u2022 Qué es Altcoin",
            l9:
              "\u2022 Diferentes tipos ALTCOIN\n" +
              "\t\t\xBA Ether\n" +
              "\t\t\xBA ZCHASH\n" +
              "\t\t\xBA SIACOIN\n" +
              "\t\t\xBA RIPLEY\n",
            l10:
              "\u2022 Minería como Concepto de Negocio\n" +
              "\t\xBA Qué son los Minadores\n" +
              "\t\t\u2022 Tipos de Minadores\n" +
              "\t\t\u2022 Nube\n" +
              "\t\t\u2022 Aschi\n" +
              "\t\t\u2022 GPU\t\n" +
              "\t\xBA Qué son Los Protocolos\n" +
              "\t\xBA Niveles de Dificultad\n" +
              "\t\xBA Tasas de Rendimiento\n" +
              "\t\xBA Recuperación de la Inversión\n" +
              "\t\xBA Ventajas y desventajas de la Minería\n" +
              "\t\t\u2022 Implicaciones\n" +
              "\t\t\u2022 Inversión\n" +
              "\t\t\u2022 Desarrollo\n",
            l11: "\u2022 Qué es Moneda Fiat",
            l12: "\u2022 Convertibilidad",
            l13:
              "\u2022 Gráficos  y análisis de Comportamiento desde su creación\n" +
              "\t\xBA BTC\n" +
              "\t\xBA Ether\n",
            l14:
              "\u2022 Principios Legales en Usa / Asia / América Latina y Europa\n" +
              "\t\xBA Marcos Regulatorios Vigentes\n",
            l15: "\u2022 Tasa BTC / Dólar, principios y aplicaciones\n",
            l16:
              "\u2022 Que es un Wallet\n" +
              "\t\xBA Wallet Dinámico\n" +
              "\t\xBA Wallet Estático\n" +
              "\t\xBA Wallet Frío\n" +
              "\t\xBA Wallet Caliente\n" +
              "\t\xBA Wallet tipo Dispositivo USB\n",
            l17:
              "\u2022 Como comprar Bitcoin\n" +
              "\t\xBA Que es una Exchange\n" +
              "\t\xBA Que un Pair To Pair\n" +
              "\t\xBA Seguridad de la Inversión\n" +
              "\t\xBA Manejo como Instrumento de pago\n" +
              "\t\xBA Manejo como inversión\n" +
              "\t\xBA Manejo como Ahorro\n" +
              "\t\xBA Herramientas de Compra -  Venta\n",
            l18: "\u2022 Preguntas y respuestas\n",
            l19: "\u2022 Aportaciones de los participantes\n",
            l20: "\u2022 Testimonios de emprendedores reales\n",
            l21: "\u2022 Conclusiones Finales\n",
            l22: "\u2022 Evaluación\n",
            l23: "\u2022 Entrega de Certificados y Reconocimiento\n",
          },
        },
        two: {
          header: "MÓDULO II",
          sub: "Minería",
          intro:
            "Veinte Horas / Modalidad Intensiva (6 días) / Grupo Mínimo tres personas / Costo 400 $ p.p.",
          generals: {
            one:
              "Personas con nivel de conocimiento técnico básico que estén interesadas en crear o incrementar un negocio de Minería y desean contar con las herramientas técnico-financieras necesarias para poder evaluar objetiva y profesionalmente en invertir o crear un negocio de minado autónomo ya sea en pequeña o gran escala.",
            two:
              "El participante de este módulo obtendrá las herramientas necesarias para comenzar a minar inmediatamente, tanto en software como desde el punto de vista de negocios.  Contará con la experticia técnico, financiera y legal para poder operar y evaluar con herramientas reales  los distintos escenarios económicos que implica la creación de este modelo de negocios, de una manera objetiva y cualitativa podrá tomar la decisión de invertir o no en el minado como negocio y responsabilidad a largo plazo.",
            three:
              "El participante  de este módulo obtendrá las nociones elementales desde el punto de vista técnico y de negocios para la operación y gerencia de una mina, pero bajo ningún aspecto este curso lo graduará o certificará como técnico, ya que el técnico propiamente dicho es una persona especializada en manejo de software y hardware que debe contar con sólidos conocimientos de electrónica y programación y estar certificado por universidades especializadas en el área.",
          },
          specifics: {
            one:
              "Saber cuál tipo de mina se adecua a sus posibilidades y expectativas",
            two:
              "Reconocer y analizar con datos reales implicaciones técnicas y financieras",
            three: "Poder armar un proyecto de mina sustentable",
            four:
              "Conocer el marco legal, técnico y financiero para poder limitar el alcance del proyecto",
            five:
              "Conocer las máquinas a nivel vivencial\n" +
              "\tFuncionamiento\n" +
              "\tComponentes\n" +
              "\tProgramación\n" +
              "\tMonitoreo y Control\n",
            six:
              "Estar en capacidad de operar desde un equipo doméstico hasta equipos de alto rendimiento",
            seven:
              "Poder analizar con herramientas reales sus fortalezas, carencias y debilidades en el emprendimiento de este negocio. Análisis DOFA. ",
          },
          content: {
            theoretical: {
              l1: "\u2022 Conceptos Básicos",
              l2:
                "\u2022 Tipos de Minería\n" +
                "\t\t\xBA Ashic\n" +
                "\t\t\xBA GPU\n" +
                "\t\t\xBA Nube\n",
              l3:
                "\u2022 Aspectos Técnicos Financieros\n" +
                "\t\t\xBA Inversión\n" +
                "\t\t\xBA Tasa de Retorno (ROI)\n" +
                "\t\t\xBA Nivel de Dificultad (Bomba de Dificultad)\n",
              l4:
                "\u2022 Administración de una Mina\n" +
                "\t\t\xBA Instalaciones eléctricas, aclimatación y red.\n" +
                "\t\t\xBA Aspectos de Seguridad\n" +
                "\t\t\xBA Aspectos Legales\n" +
                "\t\t\xBA Registro Nacional de Minería de la Superintendencia de Minería del Gobierno de Venezuela\n",
              l5: "\u2022 Equipos e instalaciones necesarias",
              l6: "\u2022 Responsabilidades de la Minería",
              l7: "\u2022 Ganancia Súbita",
              l8:
                "\u2022 Tasa de Dificultad y cómo afecta el rendimiento de la Inversión",
              l9: "\u2022 Administración de la Mina",
              l10: "\u2022 Ventajas y desventajas",
              l11: "\u2022 Minar como Pasatiempos o Minar Como negocio",
              l12:
                "\u2022 Análisis de variables\n" +
                "\t\t\xBA Costos fijos\n" +
                "\t\t\xBA Rendimiento\n" +
                "\t\t\xBA Tasa de Dificultad\n" +
                "\t\t\xBA Complejidad Técnica\n",
              l13:
                "\u2022 Proyección de Crecimiento\n" +
                "\t\t\xBA Costos de Iniciación\n" +
                "\t\t\xBA Análisis de Rentabilidad\n",
            },
            practical: {
              l1: "\u2022 Componentes de un Rig",
              l2: "\u2022 Ensamblaje de un Rig",
              l3: "\u2022 Configuración del Rig en vivo",
              l4:
                "\u2022 Software de Minado\n" +
                "\t\t\xBA Ambiente Linux\n" +
                "\t\t\t\u2022 Ethos\n" +
                "\t\t\t\u2022 Simple Mining\n" +
                "\t\t\xBA Minado bajo ambiente Windows (herramientas)\n" +
                "\t\t\u2022 Claymore\n" +
                "\t\t\u2022 Nicehash\n",
              l5:
                "\u2022 Conocimiento de una máquina Plug and Play Antminer\n" +
                "\t\t\xBA Programación\n" +
                "\t\t\xBA Conexión al Pool\n" +
                "\t\t\xBA Seguimiento \n" +
                "\t\t\xBA Análisis y evaluación de Resultados\n" +
                "\t\t\xBA Software de Monitoreo y Control\n",
              l6: "\u2022 Creación de Proyecto",
              l7: "\u2022 Viabilidad, costo y Evaluación del Proyecto",
              l8: "\u2022 Evaluación y Certificación",
              l9: "\u2022 Conclusiones y Evaluación Final",
            },
          },
          conclusions:
            "El participante de este módulo estará en capacidad de iniciar un  negocio de minería, en caso de que el participante desiste de la idea propiamente operativa, podrá declinar realizar la parte segunda del curso que es netamente técnica y podrá tener una visión más clara del negocio en la primera parte al conocer la implicaciones técnicas y financieras de la minera como modelo de negocio.\n" +
            "Es importante recalcar que la minería es un negocio ilimitado y la información se actualiza vertiginosamente por lo tanto el verdadero minero es una persona que  se debe mantener al día informado y actualizado acerca de los numerosos avances y técnicas de este dinámico mundo, este curso le prepara para las herramientas básicas y la parte estructural del negocio como tal, para el desarrollo del mismo el emprendedor debe mantenerse atento, informado y actualizado en todo momento.\n" +
            "Este módulo no es prelatorio del siguiente, ya que puede ser saltado si la persona no considera dedicarse a la minería como negocio (requiere altos niveles de inversión), sin embargo es recomendable hacer por lo menos la mitad de este para tener una cosmovisión más amplia del negocio. En ese caso se puede cancelar la mitad del curso y ver sólo a parte teórica de la Minería.\n",
        },
        three: {
          header: "MÓDULO III",
          sub: "Trade o Comercio con Cryptomonedas",
          intro:
            "Ocho Horas / Modalidad Intensiva (3 días) / Grupo Mínimo tres personas / Costo 200 $ p.p.",
          generals: {
            o1:
              "Este módulo es principalmente práctico, el participante debe tener conocimientos generales y conceptuales para poder realizar este módulo.",
            o2:
              "Aprender a utilizar la plataforma Blockchain como medio de ahorro, pagos o inversión",
            o3:
              "Aprenderá de manera vivencial a crear diferentes tipos de Wallet, manejar y evaluar distintas plataformas de intercambio.",
            o4:
              "Analizar riesgos y potencialidades de los distintos tipos de inversión",
            o5: "Cartera de Cryptos",
            o6: "Creación y operación de una plataforma Exchange",
            o7: "Creación y operación de una Plataforma Pair to Pair",
            o8: "Trade intracryptos",
            o9: "Trade crypto/fiat",
            o10: "Protocolos de intercambio",
            o11: "Seguridad en el manejo de datos",
            o12: "Marco regulatorio en USA",
            o13: "Riesgos y limitaciones bancarias",
          },
          specifics: {
            o1:
              "Saber crear y administrar distintas Wallet según su tipo y funcionabilidad",
            o2: "Operar en un entorno seguro",
            o3:
              "Hacer pagos utilizando la plataforma Blockchain por medio de distintas cryptomonedas\n" +
              "\tBTC\n" +
              "\tBTCash\n" +
              "\tEther",
            o4:
              "Aprender a leer la blockchain y cómo funciona el sistema como medio de pagos global e instantáneo\n" +
              "\tEjercicios reales",
            o5:
              "Operar plataformas específicas\n" +
              "\tPoloniex\n" +
              "\tLocalbitcoin\n" +
              "\tUphold\n" +
              "\tCryptocompare",
            o6: "Aprender a leer analizar los principales indicadores",
            o7:
              "Este módulo le prevendrá de los scam, fraudes o errores más comunes de un principiante",
            o8:
              "Prácticas en tiempo real con operaciones para prevenir errores o dudas que se presentan regularmente por falta de orientación",
            o9:
              "Brindará herramientas verificables y confiables para poder hacer sus operaciones alejado de los análisis superfluos o manipulados que abundan en la red de datos.",
            o10:
              "El participante saldrá capacitado para hacer sus operaciones, evaluar los riesgos y tomar decisiones con la seguridad suficiente que le brindará la práctica por los ejercicios realizados",
          },
          content: {
            theoretical: {
              t1: "\u2022 Conceptos Básicos",
              t2: "\u2022 Que es un cryptoactivo",
              t3: "\u2022 Aspectos legales",
              t4: "\u2022 Situación impositiva",
              t5: "\u2022 Convertibilidad en monedas Fiat",
              t6: "\u2022 Herramientas de Inversión",
              t7:
                "\u2022 Tipos de Trade\n" +
                "\t\xBA Compra-Venta\n" +
                "\t\xBA Lending\n" +
                "\t\xBA Apalancamiento\n" +
                "\t\xBA Ahorro o inversión\n",
              t8:
                "\u2022 Aspectos Técnicos Financieros\n" +
                "\t\xBA Inversión\n" +
                "\t\xBA Tasa de Retorno (ROI)\n" +
                "\t\xBA Nivel de Riesgo",
            },
            practical: {
              p1:
                "\u2022 Abrir tu Wallet\n" +
                "\t\xBA Seleccionar un Exchange\n" +
                "\t\xBA Operación en Poloniex en tiempo real\n" +
                "\t\xBA Tradear Intracrypto\n" +
                "\t\xBA Operación de plataforma de intercambio de pagos\n" +
                "\t\xBA Abrir Una cuenta y aprender a comerciar en Localbitcoin\n" +
                "\t\xBA Tardear Crypto/fiat tiempo real\n",
              p2: "\u2022 Ciclo de ejercicios individuales supervisados",
              p3:
                "\u2022 Exposición de logros de los participantes\n" +
                "\t\xBA Compartir\n" +
                "\t\xBA Evaluación\n" +
                "\t\xBA Certificación\n",
            },
          },
          conclusions:
            "Una vez terminado este módulo el participante debe considerarse un operador de cryptovalores . Esto es una nueva rama de la economía totalmente en ciernes, por lo que no existe a nivel mundial ningún tipo de ente de certificación o regulación universalmente aceptado. Los resultados de esta experiencia es que dependiendo de las destrezas y aptitudes del participante puede convertirse en germinador o pionero de esta incipiente industria que en el futuro es posible termine desplazando al mundo de la inversión tradicional controlado por bancos y grandes entidades financieras que a la vez de ser intermediarios y custodios son también monopolistas del flujo del dinero y de las transacciones económicas.\n" +
            "No hay una exigencia académica o de credenciales específica para ser un  trade. El desempeño, las cualidades, las aptitudes y la honestidad de la persona podrán permitirle en un futuro crecer como asesor o intermediador para amigos y parientes o simplemente le brindara la oportunidad y libertad de ejecutar sus destrezas para el manejo y administración de sus propios fondos.\n" +
            "A pesar de no haber una carrera específica para tradear o ser un profesional del a cryptoeconomía algunos conocimientos básicos como economía, administración y manejo financiero pueden ser muy importantes para ayuda al participante a obtener mejores beneficios. Sin embargo no se debe confundir el conocimiento tradicional con esta nueva rama de la ciencia económica por que el manejo férreo de un paradigma tradicional puede socavar los resultados posibles si estos conocimientos se convierten en una barrera o una camisa de fuerza para comprender que esto es un nuevo modelo que posee su propia filosofía y dinámica.\n" +
            "Recordemos que los que han obtenido más éxito económico y financiero en este mundo, son muchachos de incluso menos de veinte años que han amasado grandes fortunas justamente por su desapego a las normas de la economía tradicional y a sus paradigmas. Su fortaleza ha sido creer y confiar que una nueva economía libertaria es posible y que la emancipación financiera del hombre apenas está comenzando. Estamos al comienzo de una revolución no perdamos esta oportunidad de sumarnos al principio de la ola. Aún estamos a tiempo.\n",
        },
      },
    },
    chat: {
      headerTitle: "¡Hola!",
      subtitle: "¿Tienes alguna duda? Estamos listos para ayudar",
      placeholderSender: "Escriba su pregunta... ",
      welcome: "Bienvenido ",
      messageWelcomeRegister: "¿Cómo te podemos ayudar hoy?",
      messageWelcomeUnregister:
        "Por favor, indique su email para comenzar o continuar una conversacion reciente en este navegador",
      todayLabel: "HOY",
      letsContinue: "Continuemos...",
      userTaken:
        "Usted ya tiene una sesión iniciada en otro navegador o ventana",
      form: {
        name: "Nombre",
        email: "Email",
        buttonSend: "Enviar",
        error: {
          emailWrong: "Formato incorrecto",
          name: "Campo requerido",
          email: "Campo requerido",
        },
      },
    },
    broker: {
      addOffer: "Añadir oferta",
      actualOffer: "Ofertas actuales",
      historyOffer: "Historial de ofertas",
      balanceOption: {
        balance: "Saldo disponible",
        sendToPayments: "Enviar a medios de pago",
        paymenthMethod: "Medios de pago",
        own: "Propios",
        thirdParties: "Terceros",
        amount: "Monto",
        description: "Descripción",
        cancel: "Cancelar",
        send: "Enviar",
        balanceSendToPayment: "Saldo disponible para enviar a medio de pago",
        messageConfirmation: "¿Está seguro que desea enviar ",
        messageConfirmation1: "al medio de pago ",
        confirm: "Confirmar",
        message: {
          success: "Operación finalizada con éxito",
          noOffer: "No hay ofertas para esta moneda",
          errorOperation:
            "No se puede realizar la operación en estos momentos. Intente más tarde",
          errorAmount: "El monto no se encuentra dentro del límite",
          noBalance: "No posee balance suficiente para realizar la operación",
        },
        tableHeaders: {
          date: "Fecha",
          amount: "Monto",
          price: "Precio",
          currency: "Moneda",
          status: "Estado",
          transactions: "Transacciones",
          type: "Tipo de operación",
          statusValues: {
            started: "Iniciado",
            success: "Exitosa",
            waitingPayment: "Esperando por pago",
            canceled: "Cancelada",
            paid: "Pagado",
            claim: "Reclamo",
            payVerification: "Verificando pago",
          },
          typeValue: {
            buy: "COMPRA",
            sell: "VENTA",
          },
        },
        table: {
          previous: "Anterior",
          next: "Siguiente",
          loading: "Cargando...",
          noData: "No hay operaciones",
          page: "Página",
          of: "de",
          rows: "filas",
          pageJump: "ir a la página",
          rowsSelector: "filas por página",
        },
        accordion: {
          details: "Detalles de la operación",
          operation: "Operación #:",
          terms: "Términos y Condiciones",
          seeMore: "...Ver más",
          digitalBill: "Factura digital",
          buttonDownload: "Descargar",
          qualify: "Calificar",
        },
      },
      addOfferOption: {
        buy: "Compra",
        sell: "Venta",
        referencePrices: "Precios de referencia",
        askMin: "Precio mín. de venta",
        bidMax: "Precio máx. de compra",
        MinPercentMargin: "Margen min.",
        MinPercentSpread: "Propagación min. ",
        limitPerOperation: "Min - Máx por operación",
        static: "Estática",
        dynamic: "Dinámica",
        typeOperation: "Tipo de operación",
        selectType: "Seleccione el tipo",
        currency: "Moneda",
        selectCurrency: "Seleccione la moneda",
        paymentMethod: "Medio de pago",
        selectPaymentMethod: "Seleccione el medio de pago",
        typeOfPayment: "Tipo de medio de pago",
        selectTypeOfPayment: "Seleccione tipo de pago",
        price: "Precio",
        priceLimit: "Precio límite",
        minPerOperation: "Mínimo por operación",
        maxPerOperation: "Máximo por operación",
        totalAccumulated: "Total máximo acumulado",
        amountBtc: "Monto en BTC",
        source: "Fuente",
        marginPercentage: "Porcentaje de Margen",
        propagationPercentage: "Porcentaje de Propagación",
        add: "Añadir",
        messages: {
          addOffer: "Oferta añadida",
          alertAddOffer: "La oferta ha sido añadida exitosamente.",
          limitExceded:
            "El monto por operación no se encuentra dentro de los límites",
          limitPercents: "El valor excede el límite de porcentaje mínimo",
          limitPriceBid: "El precio excede el límite mínimo",
          limitPriceAsk: "El precio excede el límite máximo",
          errorOperation:
            "No se ha podido realizar la operación en este momento. Intente de nuevo.",
          errorPaymentMethod:
            "No hay metodos de pago disponibles para esa moneda",
          incompleteInfo:
            "Debe llenar la información de todos los campos para poder añadir la oferta",
        },
      },
      actualOfferTable: {
        currency: "Moneda",
        date: "Fecha",
        paymentMethod: "Medio de pago / Tipo de pago",
        payMethod: "Medio de pago",
        typeOfPayment: "Tipo de pago",
        typeOperation: "Tipo de operación",
        priceLimit: "Precio límite",
        price: "Precio",
        accumulated: "Acumulado / Total",
        source: "Fuente",
        marginPropagation: "Margen - Propagación",
        actions: "Acciones",
        buttonEdit: "Editar oferta",
        buttonInactivate: "Inactivar oferta",
        table: {
          previous: "Anterior",
          next: "Siguiente",
          loading: "Cargando...",
          noData: "No hay ofertas",
          page: "Página",
          of: "de",
          rows: "filas",
          pageJump: "ir a la página",
          rowsSelector: "filas por página",
        },
        message: {
          offerInactivate: "Oferta inactivada",
          alertOfferInactivate: "La oferta ha sido inactivada exitosamente.",
          url: "Enlace copiado",
          errorAmount1:
            "El monto mínimo por operación no puede ser mayor o igual que el monto máximo por operación",
          errorAmount2:
            "El monto mínimo por operación no puede ser mayor o igual que el monto máximo por operación actual",
          errorAmount3:
            "El monto máximo por operación no puede ser menor o igual que el monto mínimo por operación actual",
          errorPrice: "El precio excede el límite máximo para la oferta",
          errorLimitMin:
            "El monto mínimo por operación excede el límite mínimo de la oferta",
          errorLimitMax:
            "El monto máximo por operación excede el límite máximo de la oferta",
          errorLimitOffer:
            "El monto total acumulado excede el límite máximo de la oferta",
          errorLimitMinPercent:
            "Excede el límite del porcentaje mínimo de margen",
          errorLimitMinSpread:
            "Excede el límite del porcentaje mínimo de propagación",
          errorPriceMaxOffer:
            "El precio excede el límite mínimo para la oferta",
          successEditOffer:
            "La edición de la oferta se ha realizado exitosamente",
          errorEditOffer:
            "La edición de la oferta no se ha podido completar de forma exitosa. Intente más tarde",
          errorOperation:
            "No se ha podido realizar la operación en este momento. Intente de nuevo.",
        },
        modalEdit: {
          header: "Editar oferta",
          limitOffer: "Límites de oferta",
          descriptionEdit1:
            "Ud. está editando la información de la oferta con la moneda",
          descriptionEdit2: "cuyo tipo de operación es",
          descriptionEdit3: "el medio de pago es el",
          descriptionEdit4: "y el tipo de pago es",
          buy: "COMPRA",
          sell: "VENTA",
          actualPrice: "Precio actual: ",
          previousValues: "Valores previos",
          buttonCancel: "Cancelar",
          buttonSave: "Guardar",
        },
        modalInactivate: {
          header: "Inactivar oferta",
          content1:
            "¿Estás seguro que deseas inactivar la oferta de la moneda ",
          content2: " cuyo tipo de operación es ",
          content3: " el medio de pago es el ",
          content4: " y el tipo de pago es ",
          buttonYes: "Si",
          buttonNegative: "No",
        },
      },
    },
    takePhoto: {
      header: "Tomar una foto",
      buttonSave: "Guardar",
      buttonCancel: "Cancelar",
      buttonTake: "Tomar",
      buttonRetake: "Repetir",
      errorSaving: "Ha ocurrido un error guardando la foto. Intente de nuevo",
    },
    officeInfo: {
      name: "Oficina",
      website: "Sitio Web",
      workTime: "Horario de trabajo",
      address: "Dirección",
      phone: "Teléfono",
    },
    legal: {
      title: "Legal",
      term: "Términos y Condiciones",
      cookies: "Políticas de Cookies",
      documents: "Documentos",
      relationship: "1. Nuestra relación con nuestro público",
      accounts: "2. Cuentas",
      minutes: "3. Minutas",
      payment: "4. Pagos",
      cancellations: "5. Cancelación de Transacciones",
      accountBalances: "6. Balances de Cuentas",
      closeAccount: "7. Cierre de Cuenta",
      rate: "8. Cargos",
      risk: "9. Riesgos",
      rules: "10. Reglas de Comportamiento",
      responsibility: "11. La responsabilidad del Cliente",
      disputes: "12. Disputas ",
      generalProvisions: "13. Previsiones Generales",
      definitions: "14. Definiciones",
    },
    receibeExternalConfirm: {
      title: "Usted Posee una solicitud de tranferencia con los datos:",
      question: "¿Esta usted de acuerdo con recibir está transacción?",
      buttonYes: "Si",
      buttonNo: "No",
      successMessage: "Su respuesta ha sido enviada satisfactoriamente",
      errorConexion: "Ha ocurrido un error de conexión, intente nuevamente",
      errorServer: "Ha ocurrido un error en el servidor, intente más tarde",
      buttonEnd: "Cerrar",
    },
  },
  en: {
	giftCard: MessageGiftCard_en,
    app: {
      modalSession: {
        header: "Notification",
        content: {
          part1: "Your session expires in ",
          part2: " seconds, do you want to continue in the portal?",
        },
        buttonYes: "Yes",
      },
      modalSessionExpired: {
        header: "Notification",
        content: "Your session has expired",
        buttonClose: "Close",
      },
    },
    commons: {
      benefits: {
        header: "Benefits of working with us",
        items: {
          first: {
            header: "Fast and secure payment",
            content: "In our community your payments will be faster and safer.",
          },
          second: {
            header: "Security is our operational pillar.",
            content:
              "Our operations have high levels of security to safeguard your data.",
          },
          third: {
            header: "There is no risk in your transactions",
            content: "Sell your bitcoins or buy with us is free and safe.",
          },
        },
      },
      coins: {
        usd: "American dollar",
        ves: "Bolívar",
        cop: "Colombian peso",
        eur: "Euro",
        rd$: "Dominican Dollar",
        clp: "Chilean peso",
        pen: "Peruvian Sol",
        brl: "Brazilian real",
        ars: "Argentine Peso",
        mxn: "Mexican peso",
        eth: "Ether",
        cad: "Canadian dollar",
        cny: "Yuan renminbi",
        rub: "Russian ruble",
        inr: "Rupee",
        jpy: "Japanese Yen",
        chf: "Swiss franc",
        crc: "Costa Rican Colon",
        pab: "Panamanian balboa",
        paUsd: "USD in Panamá",
      },
      avgSell: "Average sale",
      avgBuy: "Average buy",
    },
    nav: {
      init: "Home",
      availableBalance: "Available Balance",
      profile: "Profile",
      logout: "Logout",
      newAddressModal: {
        header: "Address Update",
        body: {
          successMessage:
            "Your address has been renewed. Remember that the addresses have a limited time and are renewed upon expiration.",
          errorMessage:
            "Your address has expired and could not be renewed automatically, we invite you to go to Wallet to manually renew your address.",
          commonMessage: {
            part1: "All ",
            part2: "your previous addresses are valid ",
            part3: "to continue operating with them.",
          },
        },
        buttonClose: "Close",
        buttonOk: "Go to Wallets",
      },
    },
    navPublic: {
      lang: {
        es: "Spanish",
        en: "English",
        resume: {
          es: "Spa",
          en: "Eng",
        },
      },
      account: {
        header: "Account",
        options: {
          login: "Login",
          signup: "Sign Up",
          hft: "HFT Plans",
          transactions: "Transactions",
          wallet: "Wallet",
          sell: "Sell Bitcoins",
          buy: "Buy Bitcoins",
          forum: "Forum",
          fixedTermAccounts: "Fixed Term Accounts",
        },
      },
    },
    navCommons: {
      market: "Market: ",
      buy: "BUY BITCOINS",
      buyMobile: "Buy Bitcoins",
      sell: "SELL BITCOINS",
      sellMobile: "Sell Bitcoins",
      forum: "FORUM",
      forumMobile: "Forum",
      help: {
        header: "HELP",
        headerMobile: "Help",
        options: {
          who: "Who we are?",
          support: "Support",
          guide: "Guide of cryptos",
          blockchain: "Blockchain: The industrial revolution of the internet",
          faqs: "FAQ's",
          contact: "Contact Us",
          limits: "Limits of operations",
          legal: "Legal",
          charges: "Operating charges",
        },
      },
      coins: {
        buy: "Buy",
        sell: "Sell",
        options: {
          placeholder: "Choose a currency",
          usd: "US Dollar",
          ves: "Venezuelan Bolívar",
          cop: "Colombian Peso",
          eur: "Euro",
          rd$: "Dominican Dollar",
          clp: "Chilean peso",
          pen: "Peruvian Sol",
          brl: "Brazilian Real",
          ars: "Argentine Peso",
          mxn: "Mexican Peso",
          crc: "Costa Rican Colon",
          pab: "Panamanian balboa",
          paUsd: "USD in Panamá",
          eth: "Ether",
        },
      },
    },
    contact: {
      header: "Contact Us",
      name: "Full name",
      email: "Email",
      phone: "Phone",
      subject: "Subject",
      buttonSend: "Send",
      placeholder: {
        name: "First name and last name",
        email: "Email",
        subject: "Subject",
        message: "Message",
      },
      post: {
        error: {
          header: "Error",
          message: "An error has occurred. Try again please",
          type: {
            name: "The Full Name field is required",
            email: "The Email field is required",
            phone: "The Telephone field is required",
            subject: "The Subject field is required",
            message: "The Message field is required",
          },
        },
        success: {
          header: "Great!",
          message:
            "Thank you for contacting us. We will respond as soon as possible",
        },
      },
    },
    login: {
      header: "Login",
      compleAccount: "MONEYCLICK USER DATA",
      compleAccount2: "Complete the Data",
      form: {
        email: "Email",
        password: "Password",
        captcha: "Please prove that you are human",
        forgotPassword: "Forgot my password",
        userMoney: "I am a MoneyClick user",
        continue: "Continue",
        optionsUser: "Or",
      },
      errors: {
        credentials: {
          header: "Wrong Credentials",
          content: "Your user could not be authenticated.",
          previusSession:
            "We have detected that there is a login to dollarbtc or one of our associated platforms and for your security we cannot allow entry. We remind you that you can only have one session active. Any questions, contact Customer Service through: +17865805417  +17862669272",
        },
        errorCaptcha: "An unexpected error has occurred. Please, try later.",
        errorProTrader: "Your user is PRO TRADER must enter in: ",
        errorCaptcha2: "You did not verify if you are human",
        errorRequired: "This field is required",
        errorCaptcha3: " Unregistered user or Inactive user",
        UserMcIncomplete:
          "You are a MoneyClick user, Please select the option 'I am a MoneyClick user'",
        deviceInUser: "This device is already added",
        userNotFound: "The user associated with this device is not found",
        unexpectedError: "Unexpected error has occurred. Try again later",
        notContent: "",
        completeFields: "Please complete the necessary fields for login ",
        individualField: "Please complete one of the fields (email or phone)",
        deviceNotAllowedByUser:
          "This browser has not been authorized. You can not log in",
      },
      modalUpdateDevice: {
        header: "Device management",
        contentUpdate:
          "The browser from which you are trying to access is inactive. Do you want activate it now? ",
        contentAdd:
          "You are trying to access from a device that you do not use frequently. We recommend, only use reliable devices for personal use. Do you want to access anyway?",
        buttonYes: "Yes",
        buttonNo: "No",
        loading: "Loading...",
      },
      successUpdating: {
        updateDevice: "This browser has been reactivated successfully",
        addDevice: "This browser has been successfully added",
      },
    },
    moneyclick: {
      menu: {
        moneyclick: "MoneyClick",
        retail: " Retail",
      },
      balanceAvailable: "Balance MoneyClick available",
      downloadMoneyclick: "Download MoneyClick",
      downloadMoneyclickRetail: "Download MoneyClick Retail",
      downloadMoneyclickRetailAdmin: "Download MoneyClick Retail Admin",
    },
    registration: {
      header: "Sign Up",
      continue: "Send",
      completeAccount: "Complete Registration",
      signup: "Sign up",
      form: {
        username: "Username",
        email: "Email",
        password: {
          label: "Password",
          placeholder: "Enter a minimum of four characters",
        },
        confirmPassword: "Confirm password",
        captcha: "Please prove that you are a human",
        companyText: "Do you want to register as a company?",
        terms: {
          first: "Accept the ",
          second: "Terms and Conditions",
        },
      },
      alreadyExists: "I'm already registered",
      cancelAccount: "Return",
      modalTerms: {
        header: "Terms and Conditions",
        content: termsAndConditionsEng,
        agreeButton: "I Agree",
        closeButton: "Close",
      },
      modalResult: {
        headerSuccess: "Welcome",
        headerError: "Notification",
        headerCompleteAccount:
          "Dear user to enter the portal you need to add your email and username",
        closeButton: "Close",
        resultPost: {
          headerComplete:
            "Congratulations, you have just completed your registration at dollarBTC.com, from now on you will be able to log in with your email and add it",
          header:
            " Congratulations you just registered at dollarBTC.com, from now on you can",
          items: {
            line1: " Save your Bitcoins safely. ",
            line2:
              "Send or receive payments in bitcoins and other altcoins from anywhere in the world.",
            line3: "Receive lines of credit on your BTC (Coming soon).",
            line4: "Invest in our HFT plans generating profits with your BTC.",
            line5: "Know the real price of the US dollar in any country.",
          },
          warningMessage:
            "To operate in our portal it is necessary to verify your user. You can start this process from your profile in the Update information option",
          infoMessage:
            "We send you an email, please check and follow the instructions.",
        },
      },
      errors: {
        form: {
          username: "Username already exists",
          email: "Invalid email address",
          alreadyEmail: "Email is already in use",
          password: "This field must contain more than 4 characters",
          confirmPassword: "This field does not match the password entered",
          captcha: "You have not verified that you are a human",
          phone: "User phone already exists",
          terms:
            "It is necessary that you accept the terms and conditions of our platform",
        },
        resultPost:
          "Sorry we could not register your account sorry for the inconvenience. Try later",
        errorRequiredField: "This field is required",
        unexpectedError: "Excuse me for an unexpected error, try later.",
        errorMaxLongitude: "The maximum length is 20 characters",
        errorBlankSpace: "Blank spaces are not allowed",
      },
    },
    who: {
      us: {
        title: "About us",
        content:
          "Dollarbtc.com is a financial portal " +
          "and registered web domain belonging to Sinep Financing llc." +
          " Our company is legally incorporated in the State of New Jersey / USA " +
          "and registered in the Department of Banking and Insurance. " +
          "Authorized to market with cryptoactives. " +
          "The Laws of the United States, except in the State of New York " +
          "(where it is mandatory to have a special license if you trade an equivalent " +
          "of more than ten thousand dollars a day in cryptoactives)" +
          " allow the free sale of bitcoin. Currently our company is in the process " +
          "of registering and processing permits in several countries to be able to operate" +
          " as an agent of fiduciary securities exchange, which is why we expect to add more local" +
          " currencies to our platform progressively.",
      },
      products: {
        title: "Our developments",
        content:
          "Sinep Financing llc, has developed projects and software " +
          "for governments, private companies or groups of investors in the" +
          " following areas:",
      },
      opt: {
        title: "Financial operation",
        questions: {
          first: {
            title: "What type of Financial Operator is dollarbtc.com?",
            answer:
              "Dollarbtc.com is a web portal that offers several digital financial solutions for our Users:",
          },
        },
        items: {
          first:
            "• Analysis of real Bitcoin prices in each country expressed in its own currency.",
          second:
            "• Payment platform through hot Wallets in the bitcoin Blockchain.",
          third: "• Arbitration system.",
          four: "• Deposits in guarantee.",
          five: "• Brokerage House.",
          six: "• Remittances",
          seven: "• Trading.",
          eight: "• CryptoExchange.",
          nine: "• Lending.",
          ten: "• HFT Investment Portfolios.",
        },
        content: {
          p1:
            "Our interface uses an automated scalping system to make purchase and sale " +
            "crossings between different cryptoactives and optimize performance by means " +
            "of cyclic repetitions of operations taking advantage of small market variations, always with maximum fixed levels of profit and losses to minimize risks.",
          p2:
            "Investors have immediate access to their investments where they can verify the executed rates of profitability in real time.",
          p3:
            "Our robotic operations system allows us to participate in the market of cryptos and make decisions against imperceptible variations to the human mind, making millions of simultaneous operations when the market conditions are ideal to operate and make profits.",
          p4:
            "Our technology and our own language allow us to operate in HFT mode (high frequency trading in Spanish) which means that all operations are executed in real time and with pre-established parameters to guarantee that the level of risk is minimized at all times.",
          p5:
            "We do not use contracts for difference (CFD), nor any type of speculative tool or financial simulation. WE DO NOT RAISE THE BITCOIN OF OUR CLIENTS IN HIGH RISK INVESTMENTS OR THAT THEY EXCEED A MAXIMUM LOSS OF 6% OF THEIR CAPITAL. Our operations are limited to the purchase / sale of cryptoactives previously analyzed and chosen under strict selection criteria, so that at all times your investment is backed by high levels of capitalization and reliability. Our strategy is based on winning little but often, using technology to benefit our investments.",
          p6:
            "For what technology exists if we can not apply it to our benefit to generate income?",
          p7:
            "At the moment our platform is limited to operations within the blockchain ecosystem.",
          p8: "Dollarbtc.com values",
          p9: "• Trust",
          p10: "• Security",
          p11: "• Transparency",
          p12: "• Speed",
          p13: "• Use of technology to improve living conditions",
        },
      },
      benefits: {
        title: "Benefits",
        questions: {
          first: {
            title: "How do our customers benefit?",
            answer:
              "The most important Exchange in the world provide instant information to our bots through its API. With the instant processing of all that information, millions of operations are executed in real time, that's the way we multiply your bitcoin. Our obligation to our investors is to obtain the best benefits with the collection and processing of all the information obtained and the application of our powerful algorithms in trading operations.",
          },
        },
      },
      functioning: {
        title: "Functioning",
        questions: {
          q1: {
            title: "How do we connect to the major World Exchange?",
            answer: {
              p1:
                "We use the API to be directly connected to the sale books of the main Exchange in the world.",
              p2:
                "Through a programming language (open source) some of these exchange houses like Binance, Coinbase or HitBTC, allow Pro users to enter their platforms to manage multiple accounts simultaneously (master account).",
              p3:
                "Our language connects directly with the API of the exchange house and allows us to electronically view the purchase / sale books and perform operations directly on the internal platform.",
            },
          },
          q2: {
            title: "What is API?",
            answer:
              "An API represents the ability to communicate between software components. This is the set of platforms that offer access to certain services from the modules of the levels or lower and upper layers of the software. One of the main purposes of an API is to provide a set of functions of general use, for example, to specify operations without the need of using a user interface. In this way, programmers can connect through the API making use of its functionality, avoiding the work of programming or using the user interface. The APIs are also abstract: the software that provides an API is usually communicated through an open language through a special channel for integration.",
          },
          q3: {
            title: " How is it achieved?",
            answer: {
              p1:
                " -Sweep in time segments of the purchase and sale orders of each Altcoin.",
              p2:
                " - Creation of a trend matrix that allows identifying the behavior of that asset according to the succession of registered operations.",
              p3:
                " - Using instructions developed in our algorithms, write the information of the matrix in the interface of the central module AI.",
              p4:
                " - By means of the appropriate instruction the bot carries out the dump of that information placing its order on the game, either of purchase or of sale.",
              p5:
                "By means of a logical operating system it does the following work:",
              p6:
                " - Load a matrix source of the trend provided by the programming system.",
              p7:
                "- The operating system automatically decides when to open or close the operation.",
              p8:
                "- The operating system performs a history loaded to the central module that allows it to analyze more information to adjust the calibration of its operations in real time.",
              p9:
                "Using artificial intelligence (which in turn uses the operating system) to perform most of the work:",
              p10:
                "- Analyze and compare trillions of data per second supplied by all bots (algorithms) and make matrix decisions to start or close operations of the central module (Switche).",
              p11:
                " The first option requires more steps, and each subsequent step is linked without circumventing the information provided in the previous steps. Each of which is much more complicated than the previous steps. The ability to make the right decisions depends on the adequate processing of the information to represent a large amount of data in a way that is intelligible to the system.",
              p12:
                "The second phase simplifies the task by eliminating less favorable operations and focusing operations on the historical tables with better results.",
              p13:
                "A last but very important step is the one taken by the central pivot module (AI), which is able to analyze environmental factors outside of net operations to protect itself from BTC / dollar variations that are too sharp and that could affect the overall performance of the operations.",
              p14:
                "This central module (AI) allows the system to massively close all operations by changing instantaneously to BTC / dollar or vice versa according to the market conditions at each moment.",
              p15:
                "High-level APIs can generally process and handle large volumes of information by dizzyingly overtaking a human's processing, analysis, and decision-making capacity.",
              p16:
                "However, all our operations are supervised at all times by specialized quality control personnel.",
            },
          },
          q4: {
            title: "What is an HFT?",
            answer:
              "An automated HFT platform (high frequency trading) is software programmed to perform trillions of operations per second in a dynamic stock market that is connected to an API.",
          },
        },
      },
      strategies: {
        title: "Strategies",
        questions: {
          first: {
            title: "How does dolarbtc.com design its Market strategies?",
            answer: {
              p1:
                "We can offer the execution of a high variety of investment strategies thanks to our combination of algorithms designed to earn with different levels of risk tolerance and in bullish or bearish market conditions. Our operation protocols are activated only when there is a combination of 98% ideal conditions to operate. The maximum level of loss occurs at the moment of placing the order by the differential or entry window necessary to be able to execute operations in a dynamic market. The calibrations of the loss tolerance factor are tabulated according to the level of risk chosen in the investment plan selected by each client. It is a market maxim that greater volatility greater risk and higher risk greater profit, that's why our more aggressive models allow a higher level of tolerance to the fluctuations of the mercedo before liquidating or opening positions. Contrary to bots or more conservative plans.",
              p2:
                "This means that the joint exposure of variables and correction factors of some operations is automatically sent to pre-established values.",
              p3: "Our strategies are based on the following parameters:",
              p4:
                "- Macro analysis of internal and external conditions of the cryptoactive market.",
              p5: "- Level of market capitalization.",
              p6:
                "- Inputs; rise or fall during periods of predetermined sweeps to be taken as a factorial market trend.",
              p7:
                "- Correlation of purchase / sale orders placed in the respective books.",
              p8: "- Periods of analysis (times of cuts or sweeping).",
              p9: "- Tolerance range for loss and gain (correction factor).",
              p10: "- Mirrors (protection mirrors).",
              p11:
                "- Security keys and protocols in the custody of auditable companies (outsourcing services).",
              p12:
                "Our technology creates an informative matrix that feeds back into the system increasing the capacity to generate continuous returns in cyclical operations.",
            },
          },
        },
      },
    },
    faqs: {
      title: "Frequently Asked Questions (FAQ)",
      questions: {
        q1: {
          title: "What is www.dollarbtc.com?",
          answer: {
            link: "www.dollarbtc.com ",
            p1:
              "is an exchange platform developed by a group of merchants \n" +
              "Bitcoin enthusiasts.",
            p2:
              "We recognize localbitcoin.com as a pioneer in creation and development \n" +
              "of the largest bitcoin merchant community in the world. \n" +
              "But it is currently becoming a toxic and insecure site for the \n" +
              "large number of scammers who take advantage of the shortcomings \n" +
              "platform security.",
            p3:
              "That is why we decided to join the mission of developing a new platform \n" +
              "capable of providing the possibility of growth and equality in a safe and \n" +
              "reliable environment.",
            p4:
              "At first the task seemed easy, but it was really the opposite. Many legal \n" +
              "and operational obstacles appeared along the way.",
            p5:
              "We decided to make the greatest effort to achieve a versatile and \n" +
              "reliable product.",
            p6: "Maybe making it easy was the hardest thing. \n",
            p7:
              "As part of the initiative, we are looking for the best engineers and\n" +
              " developers specialized in financial and banking products.",
            p8:
              "After two years of development, research and many, \n" +
              "Many tests, we achieve a safe, easy to handle and reliable product.",
            p9:
              "Dollarbitcoin is an open platform, made for the community, flexible and \n" +
              "with special emphasis on security, our main mission is to avoid or neutralize \n" +
              "the participation of the different forms of fraud and usurpation of \n" +
              "identity that have harmed both the localbitcoin ecosystem. \n",
            p10:
              "For that we have implemented active security measures for \n" +
              "guarantee due payment in both cryptocurrency and fiat currency. \n",
            p11:
              "In addition to security we have endowed our platform with a robust legal and \n" +
              "fiscal base to certify operations and allow our users to operate in a manner \n" +
              "legal and transparent, complying with required BSA/AML regulations and \n" +
              "procedures by the authorities of most countries including \n" +
              "to the United States of America.",
            p12:
              "We believe that this will be a meeting place for the crypto trader, where \n" +
              "we can support each other and grow together, in a secure environment, \n" +
              "egalitarian and firmly protected.",
            p13:
              "We are currently in an initial phase where those who decide to participate \n" +
              "will have the advantage of being the first to operate in markets \n" +
              "with ample demand and limited presence of certified brokers.",
            p14:
              "Our doors are open for those who want to join our network of busines associates.",
            p15: "In ",
            p16:
              "You can validate your trajectory in localbitcoin if you want to join \n" +
              "We are a trading platform, made by traders, for traders !!!",
          },
        },
        q2: {
          title: "What are the services of the portal?",
          answer: {
            p1: "Purchase and Sale of Bitcoin and Ether.",
            p2: "Exchange of Sovereign Currency through Bitcoin.",
            p3: "Money transfers.",
            p4: "Trading and Investment Platforms.",
            p5: "E-wallet of sovereign currencies in the cloud.",
            p6: "Service of indexation of automated exchange rates.",
          },
        },
        q3: {
          title: "How does Dollarbtc work?",
          answer: {
            link: "www.dollarbtc.com ",
            p1:
              "Through an indexing system in the cloud that combines in a simple way \n" +
              "the commercialization of cryptocurrencies by sovereign currencies.",
            p2: "For operations in sovereign local currency ",
            p3: "has a network of ",
            p4: "Operators ",
            p5:
              "associates in different countries, in charge of receiving and making bank \n" +
              "payments. The system acts as a guarantor and indexer of operations. \n " +
              "Unify trade rates in transactions with cross-values ​​and \n" +
              "certify users and their payments. \n",
            p6:
              "Additionally, dollarbtc.com provides a versatile platform for \n" +
              "administering from a single panel various commercial instruments such as: \n" +
              "wallets, e-wallets, bank accounts, payment lists \n" +
              "and trading and investment tools.",
          },
        },
        q4: {
          title:
            "What are the sources of information from where the exchange rates are obtained?",
          answer: {
            p1:
              "To provide Contracts with real, competitive and up-to-date rates \n" +
              "In real time, our scan bots detect, collect and process with \n" +
              "own algorithms a series of data relating to prices, volume, \n" +
              "means of payment and other indicators within the OTC markets with greater \n" +
              "stock market activity in each country, from which real rates are emitted and \n" +
              "competitive for trade and exchange.",
            p2:
              "Here we give you a link to the main world exchanges where \n" +
              "our scan bots obtain and process most of their information: \n",
            link: "Exchanges - Bitcoin",
          },
        },
        q5: {
          title: "What are the Certified Exchange Transactions?",
          answer: {
            p1:
              "They consist of a virtual process generating electronic contracts\n" +
              "that compile and verify the following data: ",
            p2: "Registry of Users (Compliance).",
            p3: "Rates, amounts traded and dates of exchange.",
            p4: "Underwriting Funds.",
            p5: "Certification of Payments and associated invoices.",
            p6: "Verification of matches with supplied data (track ID).",
          },
        },
        q6: {
          title: "Who guarantees the security of my payments and operations?",
          answer: {
            p1:
              "Our platform guarantees all operations by sealing a deal with registration \n" +
              "data certified by the participants and blocking the guarantee deposit by \n" +
              "means of ",
            p2: "Intelligent Guarantee Contracts",
            p3:
              ", which are released when the acquired commitments are accredited and\n" +
              " validated ensuring that they coincide with the previously certified data.\n",
          },
        },
        q7: {
          title:
            "What is an Intelligent Guarantee Contract (IGC) and how does it work?",
          answer: {
            p1: "The ",
            p2: "Intelligent Guarantee Contract (IGC) ",
            p3:
              "is an agreement made by an electronic validation system between \n" +
              "two parts, where www.dollarbtc.com serves as guarantor of the operation \n" +
              "using the following steps:",
            p4:
              "Certifies by means of an electronic protocol that both parties have verified \n" +
              "their registration information (electronic signature) and accept the agreed \n" +
              "agreement.",
            p5: "Certify the required guarantee funds.",
            p6:
              "Validate the ownership of the bank accounts involved to prevent fraud, \n" +
              "third-party payments or identity theft.",
            p7:
              "Issues and sets in real time the exchange rate, competitive and transparent  \n" +
              "to enter into the Contract.",
            p8:
              "Certifies that the Operation and the participants comply with \n" +
              "international BSA/AML regulations.",
            p9:
              "Debit and/or automatically charge each transaction with the corresponding\n" +
              "bank or tax rates.",
            p10:
              "Issues the corresponding legal invoice for the respective accounting \n" +
              "entry of the operation.",
            p11:
              "Certifies that the payment is received from a verified account before \n" +
              "releasing the guarantee.",
            p12: "Close the ",
            p13:
              "IGC keeping the data and the accounting record of each operation for \n" +
              "legal purposes.",
            p14:
              "Once you generate a purchase or sale order the system immediately generates \n" +
              "a Guarantee Contract, in this way when you complete your \n" +
              "operation the bitcoin or underlying assets are released to whom it corresponds.\n" +
              "Otherwise, they are reinstated and the Guarantee Contract is dissolved.",
            p15: "The odds of a ",
            p16: "IGC ",
            p17:
              "failure is virtually impossible, because to generate any \n" +
              "operation the system must have all the active verification requirements \n" +
              "or simply not load the order, saying there is no offer \n" +
              "corresponding. This ensures the security of any \n " +
              "operation you are going to perform.",
          },
        },
        q8: {
          title: "What legislation regulates the IGC?",
          answer: {
            p1:
              "At the international level our procedures are approved with the \n" +
              "Basel Convention and the Vienna Convention of the Organization \n" +
              "United Nations on financial operations developed between \n" +
              "countries and financial institutions, these agreements are signed \n" +
              "for the majority of countries in the world, they also include what is \n" +
              "related to regulations that contemplate the rules \n" +
              "for the prevention of money laundering and legitimization of capital,\n" +
              " prevention of financing for activities terrorists, and private data \n" +
              "protection and banking security of the users of the\n" +
              " global financial system.",
            p2:
              "At a local level, transactions are adapted to the current fiscal \n" +
              "requirements and regulations in each country.",
            p3:
              "Since most countries do not have uniform legislation \n" +
              "nor specific about the exchange of bitcoin, ours ",
            p4: "Local Operators ",
            p5:
              "must comply with the requirements demanded by the corresponding bodies \n" +
              "to be able to operate commercially, due to which in some cases \n" +
              "Operations may be subject to local taxes or procedures \n" +
              "additional verification.",
            p6:
              "Here is the link where you can study the updated information of \n" +
              "the different states of legal development of the bitcoin trade around \n" +
              "of the world: ",
            p7:
              "Coin Dance - Global Bitcoin Political Support & Public Opinion",
            p8:
              "UN Document on the Prevention of Money Laundering and Money Laundering",
            p9: "IMOLIN - PDF",
            p10: "Basel Banking Supervision Committee: ",
            p11:
              "Adequate Risk Management related to Money Laundering \n" +
              "and Financing of Terrorism (January 2014) In Spanish.",
            p12:
              " BIS - Proper management of the risks related to money laundering and \n " +
              "financing of terrorism - PDF",
            p13:
              "Protection of Rights of Users of the Federal Government of the United States \n" +
              "United of America.",
            p14: "Consumer Financial Protection Bureau",
            p15: "Regulation of Money Transfers from Fincen (USA) in English",
            p16: " FINCEN - Money Transmitters Regulators - PDF",
          },
        },
        q9: {
          title: "Who participates in the IGC?",
          answer: {
            p1:
              "On the one hand the User who generates the purchase or sale operation \n" +
              "and on the other a Certified Legal Operator ",
            p2: "(CLO) ",
            p3:
              "who has an official broker record and a guarantee account on the platform. \n" +
              "The third party is the registrar and guarantor of the transaction, \n" +
              "which is the electronic system of dollarbitcoin.",
            p4:
              "DLBTC is in charge of acting as virtual notary of the deal, verifying that all the steps are carried out\n" +
              " according to the sealed agreement for the successful conclusion of the commercial agreement.",
          },
        },
        q10: {
          title:
            "What happens if I want to buy Bitcoin but I can not fulfill the payment within the established period?",
          answer: {
            p1: "If you generate one ",
            p2: "Purchase Order ",
            p3:
              "of bitcoin as User and you do not make the corresponding payment within \n" +
              "established window in the payment window, your transaction is automatically \n" +
              "canceled. To make your purchase you must open a new Sales Order.",
            p4:
              "Automatic cancellation does not generate commitments or penalties, however \n" +
              "It is recommended, for the good of all, that if you can not meet your payment\n" +
              "within the stipulated period, cancel as soon as possible so as not to \n" +
              "generate delays or damage your account record.",
          },
        },
        q11: {
          title:
            "What happens if I want to sell my Bitcoin but the system does not have offers available in the destination currency?",
          answer: {
            p1: "If you generate one ",
            p2: "Sale order ",
            p3:
              "from bitcoin the system will place a corresponding CLO with your operation \n" +
              "inside from our list of available CLOs.",
            p4:
              "In the event there is not an CLO available to compensate your transaction, \n" +
              "system will inform you that there is no counterpart available for your \n" +
              "exchange in that moment.",
            p5: "In that case you can choose between the following options:",
            p6:
              "Cancel and try later (you can enable automatic notification of available offer).",
            p7: "Leave an Automatic Sales Order (although the price may vary).",
            p8:
              "Make a virtual sale, this means tokenize creating in an e-wallet \n" +
              "the nominal value of the sovereign currency object of your transaction. \n" +
              "From that moment on, your bitcoin will be indexed to the respective value, \n" +
              "being able to convert them to bitcoin again or to real money in any \n" +
              "another moment.",
          },
        },
        q12: {
          title: "What is a Certified Legal Operator (CLO)?",
          answer: {
            p1: "An ",
            p2: "Authorized Legal Operator ",
            p3:
              "in a broker that has been certified in our platform as a Professional Trader. \n" +
              "It can be a natural or legal entity depending on the local regulations of \n" +
              "your country of operation and the volume of trade that can\n" +
              " be supported according to your guarantee deposit.",
          },
        },
        q13: {
          title: "Who can register as an CLO?",
          answer: {
            p1:
              "Any merchant can join our platform as CLO. If you have a proven track \n" +
              "record in localbitcoin with a good record of operations and a high level \n" +
              " of reputation that will serve you as part of the requirements required \n" +
              "to certify you.",
            p2:
              "Additionally, you may have to meet additional requirements in your country \n" +
              "of operation that allow you to act as an active crypto\n" +
              " broker according to your trade volume and local regulations.",
            p3:
              "For more information you must register on the platform and request \n" +
              "your registration as a company or business partner.",
          },
        },
        q14: {
          title: "What requirements must an CLO meet?",
          answer: {
            p1: "The ",
            p2: "CLO ",
            p3:
              "or associated local broker must meet the following requirements: \n",
            p4:
              "Possess a valid permit in your base country to trade active crypto \n" +
              "if necessary.",
            p5:
              "Deposit a certain amount of bitcoin on the platform as a deposit in \n" +
              "custody, according to its commercial volume.",
            p6:
              "Certify eligible bank accounts to perform the trade in \n" +
              "local sovereign currency.",
            p7: "Subscribe a commercial license for the operation of ",
            p8: "www.dollarbtc.com.",
          },
        },
        q15: {
          title: "What benefits do I get if I register as an CLO?",
          answer: {
            p1: "Purchase and sale of bitcoin at broker prices.",
            p2: "Access to the Professional Administrative Panel.",
            p3: "User Certification Service.",
            p4:
              "Legal services associated with your operations locally and internationally.",
            p5: "Increase your commercial flow.",
            p6: "Legal billing system.",
            p7: "Possibility to include sub operators in your own network.",
            p8: "Direct participation in all markets.",
            p9:
              "Automatic gains for the EIG exchange differential factor (EIG Exchange \n" +
              "Implicit Gain) and operating fees.",
            p10: "Administration System",
            p11: "Reconciliation of accounts and bank balances.",
            p12: "Calculation and payment of taxes and bank fees.",
            p13: "Balances and automated statistics.",
          },
        },
        q16: {
          title: "How does an CLO operate in practice?",
          answer: {
            acronym1: "CLO ",
            acronym2: "CGI.",
            p1:
              "An CLO can interconnect its bank accounts directly to the system \n" +
              "so that the Payments for Purchase Orders are received directly in \n" +
              "your bank accounts, and likewise these are debited \n" +
              "automatically when matching Sales Orders are connected.",
            p2:
              "When an order is generated the system automatically selects a \n",
            p3:
              "associated with the operation according to the location, available banks, \n" +
              "language and/or level of guarantee liquidity in the system.",
            p4:
              "Once the operation is associated, the system generates an order ",
            p5: "to liquidate it through ",

						p6:
							"Once the corresponding credits and debits have been made and verified \n" +
							"the reconciliation and verification supports, the system automatically loads \n" +
							"their respective sales and operations commissions in the wallet ",
						p7: "for your services. \n",
						p8: "The ",
						p9:
							"You must maintain a minimum balance in your guarantee account in order to \n" +
							"support operations automatically or the system will locate the next  \n" +
							"available CLO according to the ranking for the next operation.",
						p10:
							"The higher your liquidity level, the greater the chance of being \n" +
							"selected by the system and with greater volume of commerce greater \n" +
							"operating profits.",
					},
				},
				q17: {
					title: "With what other Services does the Platform count?",
					answer: {
						p1:
							"Real-time information on the exchange rate of any sovereign currency \n" +
							"through the Bitcoin rate (exclusive product).",
						p2:
							"Bitcoin trading in different sovereign currencies through our certified \n" +
							"local operators or business partners(* related operations).",
						p3:
							"Hybrid application to manage Fiduciary and Virtual Values ​​within the \n" +
							"same control panel.",
						p4:
							"Easy and friendly control panel to manage bank accounts, e-wallets, \n" +
							"lists of suppliers or customers and virtual commerce tools.",
						p5:
							"Certified service of secure connection to Blockchain through dynamic, \n" +
							"static, cold, hot Wallets and cryptocurrency custody.",
						p6: "Access to all international cryptocurrency markets.",
						p7: "Automated HFT platform * for customers outside the USA.",
						p8: "Money transfers within (* through our business partners).",
						p9:
							"System of e-wallets and micro payments for frequent or fast payments.",
					},
				},
				q18: {
					title: "What are the conditions of use?",
					answer: {
						link: "www.dollarbtc.com",
						p1:
							"Our conditions (the Terms of Use) regulate access to and use of the website hosted under the domain name ",
						p2:
							" (the Website) and under any of the subdomains or web pages depending on it, \n" +
							"as well as the contents and services that the owner of the Website\n" +
							" makes available to its users (the Users) and establish together with\n" +
							" the Privacy and Cookies Policy, relating to the management of personal \n" +
							"data of Users, the terms and conditions by which the Website is governed.",
					},
				},
				q19: {
					title: "Who can register as a dollarbtc.com user?",
					answer: {
						p1:
							"Anyone who wants to market bitcoin and has a \n" +
							"valid identity document and one or more registered bank accounts \n" +
							"in his name.",
						p2:
							"You must have a valid email address and a personal cell phone line \n" +
							"with a verifiable number (Not Virtual).",
						p3:
							"You must be willing to provide all the information required for \n" +
							"the fulfillment of the ",
						p4:
							"International Laws of Identification and Checking of Clients (KWC) \n",
						p5: "and all the data provided must be real and verifiable.",
					},
				},

				q20: {
					title: "What are the limits and requirements to trade?",
					answer: {
						p1:
							"For any operation you must successfully complete the User registration \n" +
							"and accept the Terms and Conditions.",
						p2:
							"For operations greater than one thousand dollars ($ 1,000) or its equivalent \n" +
							"in local currency you must have a bank account certified by our system \n" +
							"and accept the Conditions of Commerce or Electronic Contract.",
						p3:
							"For operations greater than ten thousand American dollars ($ 10,000.00) or your\n" +
							"equivalent, in addition to the previous steps, you must answer a call from \n" +
							"verification of our ",
						p4: "Compliance officer ",
						p5: "and validate the security questions.",
						p6:
							"For operations of more than one hundred thousand American dollars \n" +
							"($ 100,000.00) or its equivalent in local currency you must have a valid \n" +
							"postal address for to receive a Contract which must return with all the \n" +
							"requested data and signed to our address by certified mail.",
						p7:
							"For operations of more than One million US dollars ($ 1,000,000.00) or \n" +
							"its equivalent must be presented before the nearest notary public \n" +
							"to your home and sign a Contract with one of our Representatives.",
						p8: "Note:",
						p9:
							" In any case, if the Compliance Officer does not validate the transaction, \n" +
							"same will be canceled unilaterally without obligation of explanation \n" +
							"any before any payment is made by either party.",
					},
				},

				q21: {
					title: "Why should I register as a User on dollarbtc.com?",
					answer: {
						p1:
							"There is no obligation to register as our user, except (i) if you want to buy and sell bitcoin from your\n" +
							"country and in your local currency or (ii) if you want to be a certified operator to integrate the payment system of our platform.",
					},
				},
				q22: {
					title: "I want to Buy or sell only once. Should I register?",
					answer: {
						p1:
							"In DLBTC we do not want anyone to trade without first having very clear what our conditions are that\n" +
							"every user must register correctly to protect our ecosystem from potential fraudsters, impostors or \n" +
							"transgressors of the current legal system at local and international level. The security and protection \n" +
							"of the commerce of active crypto and the community of users is our main concern.",
					},
				},
				q23: {
					title: "How do I register as a dollarbtc user?",
					answer: {
						p1:
							"Your registration as a user to request our services of electronic indexing of offers of purchase and sale\n" +
							"for the acquisition of a product or service of the platform, will take place at the moment in which you \n" +
							"have entered in our system your personal data: name and surnames , your mobile phone number, your ID number,\n" +
							"date of birth and other information requested, and that you have clicked on the button that says Create account.\n" +
							"Also, you must expressly accept our General Conditions and the Privacy Policy.",

						p2:
							"From that moment, your personal phone number will receive a secret key, so that every time you want to access\n" +
							"your account or the services of the platform you will have to identify yourself by means of this key. Once \n" +
							"identified, DLBTC will send you by SMS a one-time PIN code through which you can access the service.",
						p3:
							"In this way, only with your password and phone you can access DLBTC. You will simply have to have your mobile\n" +
							"phone at hand. Also, and to the extent that no malicious person has access to your mobile, you will not have \n" +
							"to worry about anyone accessing your data without your consent. Just like some banks do before ordering a transfer!",
						p4:
							"As we have said before, the hiring of the service guarantees your security as well as that of your funds in an active\n" +
							"and preventive way to avoid unauthorized access to your account.",
					},
				},
				q24: {
					title:
						"How can I access my personal data, consumption, payments and others?",
					answer: {
						p1:
							"All your information will always be available to you on our Website. To access your account, go to the Website.\n" +
							"click on the Sign On button and follow the instructions. You must have your mobile phone at hand to access the \n" +
							"one-time PIN code that we will send you by SMS and that you will have to enter to validate your identity.",
					},
				},
				q25: {
					title: "What can I do on the Dollarbtc Website?",
					answer: {
						p1:
							"After identifying yourself on the Website with your mobile number and the one-time PIN that we have sent you, you \n" +
							"will have access to your personal client area where you can view your transactions, payments, invoices, purchases,\n" +
							"your contact information, media of payment assets, history, etcetera.",

						p2:
							"Through our Website you can also buy bitcoin, altcoin or send payments through our network of Certified Operators.\n" +
							"You can also make purchases and sales enjoying a price indexing service in real time that will let you know at any \n" +
							"time your real position in the market and, ultimately, access any product or service that we can offer at any time.",
					},
				},
				q26: {
					title:
						"How are my BTCs stored and how do they protect themselves from hackers?",
					answer: {
						p1:
							"One of the advantages of using our platform is that your data and your \n" +
							"Bitcoin will be stored in cold vaults, meaning they are not on \n" +
							"line, that's why they are out of reach of any hacker even if \n" +
							"the platform was attacked there is no way to access your data or \n" +
							"your bitcoin.",
						p2:
							"Another additional advantage is that we have dynamic wallets for your \n" +
							"bitcoin transfers, which guarantees that they cannot be tracked \n" +
							"or followed by any malware or unscrupulous people. \n",
						p3:
							"Our commercial alliance with Amazon, AWS (Amazon Web Service) allows us \n" +
							"to offer you protection and security, as well as stability and speed in\n" +
							"your transactions. By having your data hosted on Amazonall \n" +
							"servers, you can be absolutely sure that your information is fully \n" +
							"potected and sheltered in the best hosting platform that exists on the \n" +
							"planet.",
					},
				},

				q27: {
					title: "What use can I make of the DLBTC Website?",
					answer: {
						p1:
							"From DLBTC we ask you to make responsible use of our Website and the services we offer you.",
						p2:
							"If you change your mobile phone, or any other contact information, we ask you to inform us as soon as possible\n" +
							"in order to always give you the best service.Of course, you must also inform us immediately of any changes in the\n" +
							"card data or accounts registered with us, with which you want to make payments, in particular, if your bank has \n" +
							"sent you a new card for theft or loss, or if the expiration date is expired.",
						p3:
							"If you suspect that someone has passed for you, we ask you to let us know as soon as possible so that we can \n" +
							"report it to the competent authorities. Remember that the process of accessing your account is always carried out \n" +
							"through your mobile phone, so it is your responsibility that nobody gives a malicious use. We recommend that you use \n" +
							"the functionality of your mobile phone to activate a password to access it. It is a good practice that adds an additional \n" +
							" layer of security.",
						p4:
							"Remember that all services, graphics, user interface, video clips, editorial content, scripts and software used are the \n" +
							"exclusive property of DLBTC insofar as they are part of your intellectual and industrial property and are protected by  \n" +
							"international laws.",

						p5:
							"Dollarbtc, the Dollarbtc logo, and all other brands, distinctive signs, graphics and logos are registered trademarks \n" +
							"of Dollarbtc OU. No one is authorized to use them without our prior written consent.",
					},
				},
				q28: {
					title: "What are My Rights as a User?",
					answer: {
						p1:
							"We are a Subject Obliged to comply with different protection clauses according\n" +
							" to the laws of each country.",

						p2:
							"However, in order to provide all our Users and Business Partners with a \n" +
							"uniform service with standardized trade protocols and duly coupled with the\n" +
							" universality and spirit of the different national and international \n" +
							"legislations, we have decided to provide the platform with an instance\n" +
							" for the resolution of conflicts and the due processing of Claims of Our \n" +
							"Users, through a:",

						p3: "Ombudsman Office",
						p4:
							"It is responsible for representing the interests of the public through \n" +
							"the investigation and treatment of complaints of mismanagement or a \n" +
							"violation of rights. The Ombudsman is appointed by the Board of Directors, \n" +
							"but with a significant degree of independence. The Ombudsman\n" +
							" Office serves as Comptroller of Services and defender of users.",
						p5:
							"The typical duties of an ombudsman are to investigate complaints and try to resolve them, usually through recommendations (binding or not) or mediation.",

						p6: "Rights Waiver Clause",
						p7:
							"We inform you that, as a result of carrying out maintenance work, in certain \n" +
							" cases there may be temporary interruptions in the Website and\n" +
							" therefore in the Services offered through them.",
						p8:
							"We inform, in addition to those indicated above, there is a wide variety of \n" +
							"factors that may affect the Website and/or its quality, such as, but not \n" +
							"limited to: environmental conditions, network saturation, connectivity,\n" +
							"third-party software, etc.",
						p9:
							"In addition, DLBTC may eliminate, limit or prevent access to its Website\n" +
							"when technical difficulties arise due to events or circumstances beyond\n" +
							" the portal that, in its sole discretion, reduce or cancel the security \n" +
							"levels or standards adopted for the proper functioning of the Website.",
						p10:
							"The User will refrain from using the Website to carry out any illegal \n" +
							"activity. In particular, but without limitation, the User will\n" +
							" refrain from using the Website to:",
						p11: "Impersonate the identity of other Users or third parties",
						p12: "Falsehood in operations",
						p13: "Data falsification",
						p14: "Any behavior that involves a fraudulent act",
						p15:
							"The User will not carry out any activity that may cause damage or prejudice\n" +
							" to any third party as well as DLBTC as well as the operation and/or\n" +
							" development of the Website.",
						p16: "Under no circumstances will DLBTC be responsible for:",
						p17:
							"Losses, damages or losses of any kind arising from accessing and using \n" +
							"the Website, including, but not limited to those produced in computer \n" +
							"systems or those caused by the introduction of viruses and/or computer attacks.\n",
						p18:
							"The damages that Users may suffer when an inappropriate use of the Website, \n" +
							"and in any way of the falls, interruptions, absence or defect in\n" +
							" telecommunications.",
						p19:
							"The veracity, integrity or updating of the information that is not of \n" +
							"own elaboration.",
						p20:
							"Of the information indicated by another source or of those contained \n" +
							"in other websites by means of a hyperlink from the Website.",
						p21:
							"Of the penalties incurred by DLBTC because the User has supplied erroneous \n" +
							"or incorrect data of their accounts.",
						p22:
							"The damages, including but not limited to: damages, losses or direct or \n" +
							"indirect, inherent or consequential expenses arising in connection with this\n" +
							" Website or its use or impossibility of use by any of the parties, or in\n" +
							" relation to with any failure in performance, error, omission,\n" +
							" interruption, defect, delay in operation or transmission, computer viruses or \n" +
							"system or line failures.",
					},
				},

				q29: {
					title: "How will DLBTC treat the data provided by the User?",
					answer: {
						p1:
							"By virtue of what is established by the applicable regulations on data protection, all personal data provided by Users\n" +
							"through the corresponding forms during the use of the Website will be treated by DLBTC as provided in the Privacy Policy of\n" +
							" the Website. Accepted by the user when registering.",
					},
				},
			},
		},
		limits: {
			title: "Limits of operations",
			contentLimit: {
				dayly: "Daily",
				monthly: "Monthly",
				contentTitle: {
					normal: "Normal",
					company: "Company",
					broker: "Broker",
					SEND_IN: "Send in to dollarBTC wallets",
					SEND_OUT: "Send out to foreign wallets",
					RECEIVE_IN: "Receive from dollarBTC wallets",
					RECEIVE_OUT: "Receive from foreign wallets",
					SELL: "Sell",
					BUY: "Buy",
					MC_SEND_SMS_NATIONAL: "National MoneyClick send SMS",
					MC_SEND_SMS_INTERNATIONAL: "International MoneyClick send SMS",
					MC_SEND_TO_PAYMENT: "Sending to bank accounts from MoneyClick",
					MC_FAST_CHANGE: "MoneyClick fast change",
					MC_RETAIL_BUY_BALANCE: "Buy balance at MoneyClick Retail",
					MC_RETAIL_SELL_BALANCE: "Sell balance at MoneyClick Retail",
					MC_AUTOMATIC_CHANGE: "MoneyClick automatic change",
					BROKER_SEND_TO_PAYMENT: "Send to bank accounts",
				},
			},
		},
		charges: {
			title: "Operating charges",
			content: {
				SEND_IN__COMMISSION:
					"Commission for shipping between dollarBTC wallets",
				SEND_OUT__COMMISSION:
					"Commission for shipping to wallets outside dollarBTC",
				RECEIVE_IN__COMMISSION: "Commission to receive dollarBTC wallets",
				RECEIVE_OUT__COMMISSION:
					"Commission for receiving wallets outside dollarBTC",
				BROKER_SEND_TO_PAYMENT__COMMISSION:
					"Commission for shipments to accounts for Brokers users",
				MC_CASHBACK__COMMISSION: "Cash withdrawal commission on MoneyClick",
				MC_SEND_TO_PAYMENT__COMMISSION:
					"Commission for shipments to accounts from MoneyClick",
				MC_SEND_SMS_NATIONAL__COMMISSION:
					"Commission for national MoneyClick shipments by SMS",
				MC_SEND_SMS_INTERNATIONAL__COMMISSION:
					"Commission for MoneyClick international shipments by SMS",
				MC_FAST_CHANGE__COMMISSION: "Commission for fast change MoneyClick",
				BUY__VAT: "Purchase tax",
				BUY__COMMISSION: "Commission for purchase",
				BUY__COMMISSION__CREDIT_CARD:
					"Commission for purchase through Credit Card",
				SELL__COMMISSION: "Commission for sale",
				FAST_CHANGE__COMMISSION: "Commission for fast change",
				MC_AUTOMATIC_CHANGE__COMMISSION:
					"Commission for automatic change MoneyClick",
				MC_RETAIL_BUY_BALANCE__COMMISSION:
					"Commission for buy balance MoneyClick Retail",
				MC_RETAIL_SELL_BALANCE__COMMISSION:
					"Commission for sell balance MoneyClick Retail",
				MC_BUY_BALANCE__COMMISSION: "Commission for buy balance MoneyClick",
				SEND_TO_PAYMENT__COMMISSION: "Commission for send to payment",
			},
		},
		hft: {
			commons: {
				plansName: {
					defensive: "Defensive",
					moderate: "Moderate",
					intense: "Intense",
					aggressive: "Aggressive",
					arbitrage: "Arbitrage",
				},
			},
			listPlans: {
				title: "HFT Plans",
				errors: {
					requiredField: "This field is required",
					numberFormat: "This field must have a numeric format",
					minimalAmount:
						"The amount to invest must be greater than the minimum allowed by the plan.",
					exceededAmount:
						"The amount to invest is greater than the amount in your dollarBTC wallet.",
					tokenNotFound: {
						header: "Token not found",
						message:
							"The supplied token is not correct, please try to perform the operation again.",
					},
					tokenExpired: {
						header: "Token expired",
						content:
							"The supplied token has expired, please try to perform the operation again.",
					},
				},
				loading: "Loading...",
				investing: "Making investment...",
				opening: "OPENING",
				period: "Period",
				days: "days",
				profit: "Profit",
				risk: "Risk",
				rendi: "Redeeming per year",
				ganan: "profit shown in btc",
				minplace: "Minimum terms",
				periodColocation: "placement days",
				holdingPeriod1: "The plan can be inactivated before the",
				holdingPeriod2: " days but not charged benefits.",
				activateButton: "Activate",
				modal: {
					header: {
						part1: "Start earning money with the plan",
						part2: "",
					},
					body: {
						desc: {
							p1:
								"To activate this plan enter the amount in BTC that you want to invest in the plan",
							p2: "remember that the minimum amount for this plan is",
						},
						yourWallet: "In your wallet:",
						toInvest: "Amount to invest",
					},
					actions: {
						buttonCancel: "Cancel",
						buttonAccept: "Accept",
						buttonClose: "Close",
					},
				},
				features: {
					header: "Characteristics of our plans",
					content: {
						trading: {
							header: "Automatic trading",
							subheader: "Exchange of cryptocurrencies automatically.",
						},
						trailing: {
							header: "Trailing stops",
							subheader: "Trailing stop-loss & purchase.",
						},
						backtesting: {
							header: "Backtesting",
							subheader:
								"Use information from the past to increase performance.",
						},
						exchanges: {
							subheader:
								"Use different exchanges such as HitBTC® and Binance®.",
						},
					},
				},
				calculatorContainer: {
					header: "Buy and Sell locally",
					buy: "BUY",
					sell: "SELL",
					buttons: {
						buy: "Buy",
						sell: "Sell",
					},
				},
				modalConfirm: {
					header: "Confirm transaction",
					description:
						"We have sent a token to your email address to validate the transaction, enter the token in the required field.",
					actions: {
						buttonCancel: "Cancel",
						buttonClose: "Close",
						buttonAccept: "Accept",
					},
				},
				modalSuccess: {
					header: "Plan activated",
					description: "The plan has been activated successfully.",
				},
				modalFail: {
					header: "We sorry!",
					description:
						"The plan could not be activated at this time, try again later.",
				},
				inactivePlanHft: "The plan is not available now",
				goActivePlan: "Activate this plan",
			},
			myPlans: {
				title: "My HFT plans",
				loading: "Loading...",
				description: "Description: ",
				buttonInactivate: "Inactivate",
				addDescription: "Add description",
				initialBalance: "Initial balance: ",
				currentBalance: "Current balance: ",
				initialDate: "Start date:",
				finalDate: "Ending date: ",
				notMovements: "This plan has not yet made movements",
				yield: "Yield",
				projectedYield: "Projected yield",
				seeMore: "See more",
				errors: {
					tokenNotFound: {
						header: "Token not found",
						content:
							"The supplied token is not correct, please try to perform the operation again.",
					},
					tokenExpired: {
						header: "Token expired",
						content:
							"The supplied token has expired, please try to perform the operation again.",
					},
				},
				modalDetails: {
					header: "Detail of the movements of ",
					subheader:
						"In the graph you can see the different movements that have been made.",
				},
				modalModifyDesc: {
					header: "Add description",
					planDesc: "Plan description",
					placeholderDesc: "Family investment fund",
				},
				modalConfirm: {
					header: "Confirm Inactivation",
					description:
						"We have sent a token to your email address to validate the transaction, enter the token in the required field. Inactivation of the plan before the closing date will cause you to lose the accumulated earnings. Do you wish to continue?",
					actions: {
						buttonYes: "Yes",
						buttonNo: "No",
					},
				},
				modalSuccess: {
					header: "Successful transaction",
					content: "The plan has been successfully deactivated.",
				},
				modalFail: {
					header: "Failed transaction",
					content:
						"The plan could not be deactivated at this time, try again later.",
				},
			},
		},
		home: {
			notificationEmailVerify: {
				content: "now you can enjoy of all our benefits",
				header: {
					line1: "The email",
					line2: " had been verified successfully.",
				},
			},
			loading: "Loading...",
			banner: {
				items: {
					first: {
						header: "Fast and Secure",
						content:
							"Buy and sell your Bitcoins fast and secure since anywhere in the world",
					},
					second: {
						header: "Send money at low rates", //"Shipments at low rates",
						content:
							"Send your money from anywhere in the world at a low rate and quickly",
					},
					third: {
						header: "Win Bitcoins in just a couple of clicks",
						content:
							"Learn about our different investment plans to continue growing your capital with us",
					},
				},
			},
			shortcut: {
				header: "Buy and Sell locally",
				buy: "BUY",
				sell: "SELL",
				buyVerb: "Buy",
				sellVerb: "Sell",
				atention: "Referential Prices",
				seeMore: "See More",
				hide: "hide",
				priceReferential: "Referential prices of local markets",
			},
			homeLogue: {
				accountCurrent: "CURRENT ACCOUNT",
				accountFixedTerm: "FIXED TERM ACCOUNT",
				accountFixedTerm2: "Fixed Term Account",
				fastChange: "Fast Change",
				deposit: "DEPOSIT",
				transfer: "TRANSFER",
				change: "CHANGE",
				changeTitleModal: "Change",
				fastchangeTitleModal: "Fast Change",
				WalletAndBalance: {
					typeChange: "Exchange rate",
					placeholderTypeChange: "Select the exchange rate",
					usdToBtc: "From USD to BTC",
					btcToUsd: "From BTC to USD",
					availableBalance: "Available Balance",
					amount: "Amount in",
					price: "Price",
					amountReceive: "Amount Receive",
					businessLimits: "transaction limits",
					amountMaxLimitAvalible: "The amount is greater than your balance",
					amountMinLimit: "The amount is less than the commercial limit",
					amountMaxLimit: "The amount has reached the commercial limit",
					avalibleOption: "Option not available",
					send: {
						confirmTx: "Confirm transaction",
						confirMessage: "Are you sure to continue with the operation?",
						buttonClose: "Close",
						buttonAccept: "Accept",
						success: "Successful transaction",
						successmessage: "His operation was carried out successfully",
						fail: "fail transaction",
						failBalance: "The indicated amount is higher than your balance",
						failBalanceAmount: "Has no balance in",
						failLimits: "The amounts indicated are outside the range of limits",
					},
				},
				moneyClickHome: {
					typeChange: "Exchange rate",
					placeholderTypeChange: "Select the exchange rate",
					dollarBtcToMoneyclick: "From DollarBTC to MoneyClick",
					moneyclickToDollarBtc: "From MoneyClick to DollarBTC",
					buttonChangeMoneyclick: "Fast Change",
					availableBalance: "Available Balance",
					amount: "Amount",
					change: "CHANGE",
					send: {
						confirmTx: "Confirm transaction",
						confirMessage: "Are you sure to continue with the operation?",
						buttonClose: "Close",
						buttonAccept: "Accept",
						success: "Successful transaction",
						successmessage: "His operation was carried out successfully",
						fail: "fail transaction",
						failBalanceAmount: "Has no balance in",
						failmessage: "The indicated amount is higher than your balance",
						failmessage2: "The amount must be different from 0",
					},
				},
			},
			fiatGaugeModal: {
				sell: "Sell",
				buy: "Buy",
				table: {
					headers: {
						type: "Operation type",
						price: "Price",
						change6H: "Change % 6H",
						change24H: "Change % 24H",
					},
				},
				buttonClose: "Close",
			},
			review: {
				header: "Comments",
				lastComments: "Recent",
				allComments: "All",
				featuredComments: "Featured",
				rating: "Rating",
				comment: "Comment",
				userName: "User",
			},
			statistic: {
				btcStatistic: "BTC negotiated in the last 24 hours",
				operationStatistic: "Number of operations",
			},
		},
		fiatCarouselStatistics: {
			buy: "Buy:",
			sell: "Sell:",
			usdChange: "USD change",
			forexPrice: "Forex price",
			statistics: "Statistics",
			footerLabel: "Bitcoin Reference Prices at the Local Level Worldwide",
		},
		calculator: {
			errors: {
				target: "Error: Select a different currency to the target",
				base: "Error: Select a different currency to the base",
			},
			header: "Exchange",
			placeholderBase: "Select a currency base",
			placeholderTarget: "Select a target currency",
			placeholderCoinBase: "Currency base",
			placeholderCoinTarget: "Target currency",
			footer:
				"All the amounts are type of changes from middle market in real time that are not availables from individuals clients\n" +
				"and work just as a reference. For the types to we price for transferences of money use our transferences service",
			footerMobile:
				"All the amounts are type of changes from middle market in real time that are not availables from individuals clients\n" +
				"and work just as a reference.",
		},
		carousel: {
			openAccount: "Open Account",
			buttonGetAccess: "Get easy access",
		},
		dynamicForm: {
			labels: {
				bank: "Bank",
				accountNumber: "Account number",
				accountHolderName: "Account Holder Name",
				accountInterbankCode : "Account Interbank Code",
				accountHolderPhone : "Account Holder Phone",
				remember:
					"Please remember to complete all the fields in the profile option",
				accountHolderId: "Account Holder Id",
				accountType: "Account Type",
				text: "Payment type",
				description: "Description",
				descriptionContent: "Does not have",
				bankLogin: "User bank",
				bankPassword: "Password bank",
				optionsTextOne: "Without credentials",
				optionsTextTwo: "With credentials",
				optionsSelect: "Options",
				emailReceiver: "Email Receiver",
				accountWireNumber: "Account number",
				commission: "Commission",
				vat: "VAT",
				cardType: "Card Type",
				cardNumber: "Card Number",
				cardHolderName: "Card Holder Name",
				expDate: "Expiration Date",
				csc: "CSC",
				zipCode: "Zip Code",
				placeholderTypePayment: "Payment Type",
				creditCard: "Credit Card",
				type: "Payment Type",
				CREDIT_CARD: "Credit Card",
				bankAccount: "Bank Account",
				accountAddress: "Account Address",
				accountZip: "Account Zip",
				bankRoutingNumber: "Bank Routing Number",
				bankSwiftCode: "Bank Swift Code",
				accountWireRoutingNumber: "Account wire routing number",
				bankAndOffice: "Bank/Office",
				officesInfoId: "Office",
			},
			placeholderOption: "Select an option...",
			buttonAdd: "Create payment method",
			buttonVerify: "Verify payment method",
		},
		fastChange: {
			title: "Fast exchange",
			buy: {
				title: "Buy",
				availableBalance: "Available balance",
				amount: "Amount",
				price: "Price",
				commission: "Commission",
				amountReceive: "Amount to receive",
			},
			sell: {
				title: "Sell",
				availableBalance: "Available balance",
				amount: "Amount",
				price: "Price",
				commission: "Commission",
				amountReceive: "Amount to receive",
			},
		},
		forgotPassword: {
			header: "Recover password",
		},
		sendTokenResetPassword: {
			form: {
				title: "Enter the email to start the process",
				captchaLabel: "Please, prove that you are human",
				buttonConfirm: "Confirm",
				buttonCancel: "Cancel",
				buttonClose: "Close",
			},
			errors: {
				incompleteData: "Incomplete data.",
			},
		},
		tokenResetPassword: {
			errors: {
				failToken: "Sorry, your token have not been confirmed",
				serverError: "An internal error has occurred on the server, try later",
				emptyToken: "You must enter a token to continue",
			},
			message:
				"We have sent a verification token to your email. Copy and paste that value to continue",
			buttonContinue: "Continue",
			buttonCancel: "Cancel",
			buttonClose: "Close",
		},
		codeResetPassword: {
			message:
				"We have sent a code to your phone number, please enter the code to continue with the process",
			errors: {
				failToken: "Sorry, your token have not been confirmed",
				serverError: "An internal error has occurred on the server, try later",
				serverError2:
					"An internal error has occurred on the server, resend the code or try later",
			},
			responseAccept: "Your request have been processed, please wait a moment",
			labelCode: "Code",
			buttonContinue: "Continue",
			buttonCancel: "Cancel",
			buttonClose: "Close",
		},
		resetFormPassword: {
			errors: {
				wrongData: "Enter the date correctly",
				minimalLength: "The password must have at least four digits",
				notMatch: "The passwords does not match",
				failChange: "We can not change the password now, please try later",
			},
			successChange: "Your password have been update successfully",
			form: {
				labelNew: "New Password",
				labelRepeat: "Repeat Password",
				buttonSend: "Send",
			},
		},
		login2FA: {
			errors: {
				failAuth: "Your code can not be authenticated. Enter the code again.",
				serverError: "Sorry, an internal error has occurred on the server",
				serverError2:
					"Sorry, an internal error has occurred on the server, try later",
				requiredField: "This field can not be empty",
				failVerifyToken: "Sorry, your can not be processed",
				failVerifyAnswer: "Sorry, your answer isn't correct",
			},
			helpMessage:
				"For cases of theft, loss or any extraordinary situation you can disable 2 factor authentication by sending a token to your email and follow the steps mentioned.",
			endHelpMessage:
				"The 2 factor authentication have been disabled , please go to login section.",
			successSendToken:
				"Please check your email and enter the token that we have been sent to you to verify your identity and finish the process",
			modalSendToken: {
				header: "Do you need help?",
				send: {
					labelToken: "Verification Token",
					labelSecurityQuestion: "Security Question: ",
					buttonCancel: "Cancel",
					buttonConfirm: "Confirm",
					buttonClose: "Close",
				},
				notSend: {
					labelQuestion: "Do you want that we send a token?",
					buttonYes: "Yes",
					buttonNo: "No",
				},
			},
			header: "Two factor authentication",
			body2:
				"Please enter your security code provided by Google Autenticator, to proceed with your login",

			body:
				"We have send a security code to your phone number. Enter the code to authenticate your login.",
			form: {
				label: "Verification code",
				buttonConfirm: "Confirm",
				buttonResend: "Request SMS",
				iNeedHelp: "I Need Help",
			},
		},
		homeMobile: {
			placeholderSelectCoin: "Select currency",
			carousel: {
				item1: {
					header: "Open your account in BITCOIN",
					content: "Too easy",
				},
				item2: {
					header: "Enjoy",
					content: "Benefits of Time Deposits",
				},
				item3: {
					header: "We provide you with a secure platform for:",
					content:
						"Deposits / Withdrawals at our offices and local and international transfers",
				},

				hft: {
					header: "HFT PLANS",
					content:
						"Use our HFT plans to generate bitcoins and profits automatically.",
				},
				opt: {
					header: "BUY AND SELL",
					content:
						"Buy and sell your bitcoins around the world. No charges in advance.",
				},
				exchange: {
					header: "WORLD EXCHANGE",
					content: "Send money to everyone quickly and at low prices.",
				},
				cryptoExchange: {
					header: "CRIPTOCURRENCY, FOREX AND CFD LIQUIDITY",
					content:
						"More than 800+ trading instrument of 7 classes of assets available through one single marginal account",
				},
				creditCards: {
					header: "CREDIT CARDS",
					content: "Credit cards with associated and prepaid accounts",
				},
			},
			operations: {
				header: "OPERATIONS",
				button: {
					buy: "Buy Bitcoins",
					sell: "Sell Bitcoins",
				},
			},
			balance: {
				header: "BALANCE",
				content: {
					balance: "Balance:",
					hft: "HFT:",
					forex: "Forex:",
					cryptoExchange: "Crypto Exchange:",
				},
			},
			otherOptions: {
				header: "OTHER OPTIONS",
				content: {
					profile: "Profile",
					forum: "Forum",
					who: "Who we are?",
					retail: "Retail",
				},
			},
			help: {
				header: "HELP",
				content: {
					limits: "Operating limits",
					charges: "Operating charges",
					faq: "FAQ's",
					guide: "Guide of cryptos",
					contact: "Contact Us",
					legal: "Legal",
				},
			},
			moneyClick: {
				header: "MONEYCLICK",
				download: "Download App",
				moneyClickRetail: "App MoneyClick Retail",
				moneyClickRetailAdmin: "App MoneyClick Retail Admin",
			},
			retail: {
				header: "RETAIL",
				content: {
					balanceEscrow: "Escrow: ",
					actualLimit: "Limit",
					name: "Name: ",
				},
			},
		},
		forum: {
			errors: {
				emptyCategory: "Please, select a category",
				postingError: "There was an error when posting your post. Try later",
				notSupportFileError: "File not supported",
			},
			successPosting: "Your Post have been created successfully",
			menu: {
				feed: "My Posts",
				all: "All",
				categories: "Categories",
				vertical: {
					placeholderSearch: "Search posts...",
					notResults: "Nothing found",
					forumHeader: "Forums",
					regionsHeader: "Regions",
				},
			},
			notAuth: {
				please: "Please ",
				login: "log in ",
				signup: "sign up",
				or: "or ",
				end: " to publish or write a comment in the forum",
			},
			newPost: {
				writeAPost: "WRITE A POST",
				placeholderTitle: "Title",
				placeholderContent: "Write here your content",
				placeholderCategory: "Category",
				attachment: "Click in the icon or drag to include your image",
				buttonChangeAttachment: "Change",
				buttonPost: "Publish",
			},
			feed: {
				editPost: "Edit Post",
				deletePost: "Delete Post",
				closePost: "Close Post",
				emptyFeed: "You don't have posts to show",
				options: "Options",
			},
			replies: {
				header: "Comment",
				reply: "Reply",
				form: {
					replyBody: "Write your answer here",
					successHeader: "¡Success!",
					successPublish: "Your reply have been posting successfully",
					failHeader: "We sorry",
					failPublish: "There was an error when posting your reply, sorry",
				},
				comments: {
					form: {
						commentBody: "Write your comment here",
						successHeader: "Success",
						successPublish: "Your Comment have been posting successfully",
						failHeader: "We sorry",
						failPublish: "There was an error when posting your comment, sorry",
						buttonComment: "Comment",
					},
				},
			},
			myFeed: {
				actions: {
					edit: {
						successHeader: "Successfully Edition",
						successBody: "The edition of your post have been successfully",
						failHeader: "Fail Edition",
						failBody: "There was an error editing your post, sorry",
					},
					inactivation: {
						successHeader: "Successfully Inactivation",
						successBody:
							"Your post have been inactivate. You can not receive more comments",
						failHeader: "Fail Inactivation",
						failBody:
							"There was an error inactivating your post, sorry. Try later",
					},
					deleting: {
						successHeader: "Successfully elimination",
						successBody:
							"Your post have been eliminated. You will not see it again in your feed",
						failHeader: "Error",
						failBody:
							"There was an error eliminating your post, sorry. Try later",
					},
				},
				modalEdit: {
					header: "Edit your Post",
					title: "Title",
					content: "Content",
					buttonCancel: "Cancel",
					buttonClose: "Close",
					buttonSave: "Save",
				},
				modalDelete: {
					header: "Delete your post",
					question:
						"Are you sure you want to delete your publication? This operation is irreversible",
					buttonYes: "Yes",
					buttonNo: "No",
				},
				modalInactivate: {
					header: "Inactivate your post",
					question:
						"When you inactivate a post, it will not be visible to other users and you will not be able to receive more replies." +
						" Are you want to inactivate your publication?",
					buttonYes: "Yes",
					buttonNo: "No",
				},
				notAuth: "You are not authenticated",
				notPosts: "You don't have posts to show",
				empty: "Not results",
			},
		},
		wallet: {
			menu: {
				send: "Send Bitcoins",
				receive: "Receive Bitcoins",
				tx: "Transactions",
				btc_tx: "Bitcoins",
				usd_tx: "Dollars",
			},
			menuMobile: {
				send: "Send",
				receive: "Receive",
				tx: "Transactions",
				btc_tx: "Bitcoins",
				usd_tx: "Dollars",
			},
			send: {
				errors: {
					required: "This field is required",
					format: "The address does not correspond to a bitcoin wallet address",
					numberFormat: "This field must be a numeric format",
					equalAddress:
						"You must indicate a portfolio address other than your own",
					maxAllow: "The amount to send is greater than maximum allow",
					maxAllow2: "The maximum amount to send is",
					positiveNumber: "The amount to send have to be grater than 0.",
					tokenNotFoundHeader: "Token not found",
					tokenNotFoundBody: "The token is not correct, please try again",
					tokenExpiredHeader: "Token expired",
					tokenExpiredBody: "The token is expired, please try again",
					weSorry: "We sorry",
					failTransaction:
						"The operation can not be done right now. Please try again in a few minutes",
				},
				token: "Token",
				code: "Code",
				successTxHeader: "Successful Transaction",
				successTxBody: "The funds have been successfully withdrawn",
				loading: "Loading...",
				waiting: "Processing transaction...",
				availableBalance: "Available balance: ",
				verifiedBalance: "Balance to verified: ",
				addressReceiver: "Bitcoin address of the receiver",
				amountBTC: "Amount in Bitcoins",
				description: "Description",
				placeholderDescription: "Identify your transactions (optional)",
				buttonContinue: "Continue",
				confirmTx: "Confirm transaction",
				descriptionTx:
					"We have sent a token to your email address to validate the transaction, enter the token in the required field.",
				descriptionTxSms:
					"We have sent a code to your phone number to validate the transaction, enter the code in the required field.",
				buttonCancel: "Cancel",
				buttonClose: "Close",
				buttonAccept: "Accept",
				buttonYes: "Yes",
				buttonNot: "No",
				confirMessage: "Are you sure to continue with the operation?",
				sended: "your code has been sent",
				notsended: "An error occurred while sending your code",
				info: {
					question: "How long does a transaction in bitcoins?",
					answer1: "Immediately between wallets from dollarBTC.",
					answer2: "24 continuous hours for wallets out of dollarBTC.",
					commissions: "Commissions for outgoing bitcoins",
					internal: "Between dollarBTC's wallets no commission is applied",
					external:
						"For shipping to wallets outside of dollarBTC there is a fixed charge of ",
				},
			},
			receive: {
				addressCopied: "Your address has been copied to the clipboard",
				loading: "Loading...",
				infoMessage: {
					p1:
						"To use the wallet you need to verify your email. We have sent an email to ",
					p2: "Please check your email and follow the instructions.",
				},
				qrCode: "QR Code",
				myAddress: "Use this address to receive bitcoins",
				buttonCopy: "Copy address",
				accordion: {
					txTitle: "Incoming transactions",
					txBody:
						"Receiving bitcoins usually takes 30 minutes. However, it can take up to 14 days or more. " +
						"The incoming transaction must receive 3 confirmations in the Bitcoin network so that it appears in its wallet.",
					commissionsHeader: "Incoming bitcoins commissions",
					commissionsBody1:
						"Between dollarBTC's wallets no commission is applied",
					commissionsBody2:
						"For receiving to wallets outside of dollarBTC there is a fixed charge of 0.00015 BTC.",
					oldAddresses: "Old addresses",
				},
				newAddressMessage:
					'If you want to generate a new address to perform your transactions you can press the "Generate address" button. Remember that each address has a duration of one month, but will still be able to perform transactions',
				buttonNewAddress: "Generate address",
				tableOldAddresses: {
					headers: {
						created: "Created",
						address: "Address",
					},
				},
				modalNewAddress: {
					header: "Generate new address",
					body:
						"Do you want to generate a new address? Remember that this new address will have a duration of one month, but it will still be able to perform transactions like all previous addresses.",
					buttonCancel: "Cancel",
					buttonClose: "Close",
					buttonGenerate: "Generate",
					messageResult: {
						success: "New address generated successfully",
						error:
							"An error has occurred generating your new address. Try again later",
					},
				},
			},
			tx: {
				operationType: {
					transferFromBALANCEToMC: "Sending Balance to MoneyClick",
					transferFromMCToBALANCE: "Sending MoneyClick to Balance",
					currencyChange: "Currency Change",
					withdraw: "BTC sent",
					initialDeposit: "Initial deposit",
					deposit: "BTC received",
					transferToDollarBTC: "BTC sent",
					transferFromDollarBTC: "BTC received",
					receive: "BTC received",
					send: "BTC sent",
					credit: "Buy",
					debit: "Sell",
					planActivation: "Plan Activation ",
					planInactivation: "Plan Inactivation ",
					from: " from ",
					to: " to ",
					change: "Change",
					fastChange: "Fast Change",
				},
				table: {
					headers: {
						type: "Type",
						date: "Date",
						amountBTC: "BTC Amount",
						description: "Description",
						status: "Status",
						amount: "Amount",
					},
					cells: {
						coin: "\nCurrency: ",
						price: "\nPrice: ",
						amount: "\nAmount: ",
						processing: "PROCESSING",
						failure: "FAIL",
					},
					params: {
						previousText: "Previous",
						nextText: "Next",
						loadingText: "Loading...",
						noDataText: "There is not transactions",
						pageText: "Page",
						ofText: "of",
						rowsText: "rows",
						pageJumpText: "go to page",
						rowsSelectorText: "rows by page",
					},
				},
				loading: "Loading...",
				totalReceived: "Total BTC received",
				totalSent: "Total BTC sent",
				totalReceivedUsd: "Total USD received",
				totalSentUsd: "Total USD sent",
			},
		},
		profile: {
			emptyMessage: "",
			menu: {
				myInfo: "Your info",
				paymentMethods: "Payment Methods",
				accountSecurity: "Account Security",
				pointsOfSales: "Retail",
				logout: "Log out",
			},
			optionDetail: {
				sexList: {
					male: "Male",
					female: "Female",
				},
				documentType: {
					identificationCard: "Identification card",
					passport: "Passport",
					other: "Other",
				},
				docsImages: {
					identity: "Identification Card",
					bank: "Bank account document",
					location: "Address document",
					selfie: "Selfie with identity document",
				},
				messages: {
					modalMessage:
						"We have sent a verification code to your registered mobile phone. Enter the code to complete the verification.",
					phoneVerified: "Your phone has been satisfactorily verified",
					phoneVerificationFail:
						"Your phone could not be verified. Try again or check your mobile phone number.",
					emptyField: "Excuse me, you must enter a data in the field",
					nicknameCreated: "Your nickname has been created successfully",
					duplicatedNickname: "This nickname already exists",
					errorServer: "Error on the server",
					requiredField: "The field is required",
					emailVerification:
						"We have sent an email to your email address to verify your email",
					close: "Close",
					errorInRed: "Check your internet connection and try again",
					yourData: "Your Info",
					emptyMessage: "Not message to show",
				},
				nickname: {
					value: "Nickname",
					create: "Create",
					popup: "Create Nickname",
				},
				stepUser: {
					user: "User",
					popup:
						"To be checked. Start the process through the Update data option",
					notInit: "Without starting",
					contactUs: "Contact Us",
					fail: "Failed, Contact Us",
				},
				stepPhone: {
					verified: "Verified",
					phone: "Phone",
					popup: "To be verified. Add your mobile phone",
					buttonVerify: "Verify Phone",
					notVerify: "Not verified",
					byVerify: "To be verified",
					verify: "Verify",
					buttonCancel: "Cancel",
					buttonClose: "Close",
				},
				stepEmail: {
					email: "Email",
					verified: "Verified",
					buttonVerify: "Verify",
					notVerify: "Not verified",
					popup: "To be verified. Check your email",
				},
				stage: {
					verified: "Verified",
					processing: "In process",
					fail: "Failed",
				},
				loading: "Loading...",
				fields: {
					name: "Name",
					lastName: "Last name",
					email: "Email",
					phone: "Phone",
					id: "Identification card",
					number: "ID number",
					sex: "Sex",
					birthday: "Birthdate",
					birthplace: "Place of birth",
					familyContact: "Family contact",
					emailContact: "Contact email",
					securityQuestion: "Security Question",
					securityAnswer: "Security Response",
					localbitcoinUser: "Localbitcoin's user",
					userFacebook: "Facebook's user",
					companyName: "Company name",
					documentTypeFiscalRecord: "Tax registration document",
					numberFiscalRecord: "Registry number",
					registrationYear: "Year of registration",
					companyAddress: "Company address",
					address: "Address",
					documents: "Documents",
				},
				buttonUpdate: "Update data",
				modalVerification: {
					header: "Verfication",
					labelCode: "Code",
				},
				modalNickname: {
					header: "Nickname",
					subHeader: "Create your nickname",
					labelNickname: "Nickname",
					buttonCancel: "Cancel",
					buttonSave: "Save",
					buttonClose: "Close",
				},
			},
			addAccount: {
				specificBank: "From the same bank",
				thirdBank: "From another bank",
				wire: "Wire",
				international: "International bank (Swift or Aba)",
				electronicTrans: "Electronic transfer",
				cryptoWallet: "Transfer to Crypto Wallet",
				checkDeposit: "Deposit in Check",
				cashDeposit: "Cash deposit",
				transfer: "Wire transfer",
				creditCard: "Credit Card",
				personalCheckDeposit: "Personal Check",
				cashierCheckDeposit: "Cashier Check",
				moneyOrder: "Money Order",
				messages: {
					addAccountSuccess: "Your payment method has been successfully added",
					errorServer: "Sorry, an error has occurred on the server, try later",
					errorEmailReceiverEmpty: "The email can not be empty",
					errorEmailReceiverWrong: "It must be a valid email",
					errorExternalPaymentCreate:
						"The payment method could not be created because it already exists or due to system error",
					errorExistExternalPayment:
						"The payment method could not be created because it already exists",
				},
				addPaymentMethod: "Add payment method",
				placeholderCoin: "Select a currency",
				placeholderMethodPayment: "Select a payment method",
				buttonAdd: "Add",
				buttonBack: "Back",
				emailReceiver: "Recipient email",
				placeholderEmailReceiver: "example@mail.com",
			},
			addOwnAccount: {
				messages: {
					addPaymentMethod:
						" Attention: Own means of payment must be verified. Please stay online and follow the instructions of one of our moderators.",
					statusAFail: {
						part1:
							"To add your own means of payment you need to verify your email. We have sent an email to ",
						part2: ", please check your email and follow the instructions.",
					},
					statusBFail:
						"To add your own means of payment you need to verify your mobile phone number, you can do so through the option your data.",
					statusCUninitiated:
						"To add your own means of payment it is necessary to verify your user, you can start this process through the option to update data in the option Your Info.",
					statusCProcessing:
						"To add your own means of payment it is necessary to verify your user, this process has already been initiated.",
					statusCFail: {
						part1:
							"To add your own means of payment you need to verify your user, your user has not been verified",
						contactUs: "Contact us",
					},
				},
			},
			listAccountOther: {
				currentTableHeaders: {
					coin: "Currency",
					type: "Type",
					data: "Data",
					action: "Action",
				},
				buttonDelete: "Delete",
				errorInRed: "Check your internet connection to try again",
				currentTable: {
					previous: "Previous",
					next: "Next",
					loading: "Loading...",
					noData: "There are no registered means of payment",
					page: "Page",
					of: "of",
					rows: "rows",
					pageJump: "go to the page",
					rowsSelector: "rows per page",
				},
				buttonAdd: "Add",
				modalVerification: {
					header: "Verification",
					question: "Are you sure you want to delete the account data?",
					buttonDelete: "Delete",
					buttonCancel: "Cancel",
					buttonClose: "Close",
				},
				modalResponse: {
					successMessage: "Your request has been processed successfully",
					failMessage: "Your request could not be processed",
					buttonClose: "Close",
				},
			},
			optionCurrent: {
				paymentMethods: "Payment methods",
				menu: {
					wallet: "Wallet",
					holder: "Own / To Buy and Sell",
					other: "Third parties / To Send Money",
				},
			},
			optionPointsOfSales: {
				pointsOfSales: "Retail",
				menu: {
					information: "Information",
					operations: "Operations availables",
					sellBalance: "Sell balance",
					buyBalance: "Buy balance",
					informationMobile: "Information",
					operationsMobile: "Operations availables",
					cashbackMobile: "Cashback",
					buyBtcMobile: "Buy BTC",
					retail: {
						header: "Retail",
						escrow: "Deposit escrow",
						escrowLimit: "Escrow limit:",
						cash: "Cash:",
						noCash: "No cash:",
						id: "ID",
						coordinates: "Coordinates",
						name: "Name",
						description: "Description",
						email: "Email",
						statusCreated: "Creation status",
						ACTIVATED: "Activated",
						FAIL: "Fail",
						SENDED: "Sended",
						ANALYSING: "Analysing",
						currencies: "Currency",
						selectCurrency: "Select currency",
						operationsTable: {
							currency: "Currency",
							type: "Type",
							sellBalance: "Sell balance",
							buyBalance: "Buy balance",
						},

						movements: "Movements",
					},

					linkedDevices: "Linked Devices",
				},
				movementsSearch: {
					search: "Search",
					typeBalance: "Type balance",
					selectSearch: "Select a type",
					escrow: "Deposit escrow",
					cash: "Cash",
					noCash: "No cash",
				},
				movementsTable: {
					date: "Date",
					amount: "Amount",
					status: "Status",
					type: "Type",
					info: "Information",
					typeOperation: "Type Operation",
				},
				buttonAddEscrow: "Add escrow balance",
				buttonRemoveEscrow: "Remove escrow balance",
				messages: {
					errorLimit: "Balance limit exceeded",
					successAdd: "Successful operation",
					errorAdd: "The operation cannot be performed at this time",
					errorPriceChange: "The offer price has changed",
					addEscrow: "You are about to make a deposit at the retail ",
					addEscrow1: " whose ID is ",
					balanceAvailable: "Insufficient portfolio balance",
				},
				title: "Download also our apps",
				titleMobile: "Download Moneyclick",
			},
			optionSecurity: {
				activeTwoFactor1:
					"Select an option to proceed with its activation, remember that to login after enabling this option it will not be required for a period less than one hour since your last connection, otherwise you will be asked for a new code to enter Are you sure you want to activate two-step authentication?",
				activeTwoFactorGA:
					"The code provided by the Google Authenticator app will be used to log in after  \n" +
					"enabling this option, consider the expiration of each code, this has a validity period\n" +
					"of one minute, after that you will be asked for a new code to enter,  Are you sure \n" +
					"you want to activate two factor authentication?",
				activeTwoFactor:
					"The code sent to your phone used to log in after enabling this option will not be required for a period less than one hour from your last connection, otherwise you will be asked for a new code to log in. Are you sure you want to activate two factor authentication?",
				inactivateTwoFactor:
					"Are you sure you want to disable two factor authentication?",
				errors: {
					failUpdate: "Sorry we could not make your request try later",
				},
				successUpdate: "Your data has been updated successfully",
				buttonYes: "Yes",
				buttonNo: "No",
				buttonAccept: "Accept",
				buttonClose: "Close",
				buttonDisabled2FA: "Disable 2 factor auth",
				popUpActivated: "Activated",
				buttonCreate: "Create",
				buttonVerify: "Verify",
				popUpInactivated:
					"It is not activated,To activate this option you must configure your phone number and verify it, you must also configure a security question and answer, if you already did it you can activate it",
				buttonEnabled2FA: "Activate 2 factor",
				percents: {
					low: "Low",
					middle: "Middle",
					high: "High",
				},
				header: "Account security",
				progress: "The security level of your account is:",
				verify: "Verification",
				list: {
					header: "Configure the different options that you have:",
					options: {
						changePassword: "Change of password",
						recommendation:
							"It is advisable to change your password regularly to keep your account more secure",
						twoFA: "Two factor authentication",
						labelSmsorEmail: "Select",
						SendSmsorEmail: "Sending code for operations",
						prefered2F: "two-step authentication by",
					},
				},
				buttonChangePassword: "Change Password",
				twoFactorOptions: {
					preferedTwoFactorRequest: {
						sms: "SMS",
						google: "Google Authenticator",
					},
				},
				secureCodeProcessRequest: {
					prefered: {
						email: "Email",
						sms: "SMS",
					},
				},
			},
			updatePasswordUser: {
				errors: {
					wrongData: "You must enter the data correctly",
					server: "Sorry an error has occurred on the server, try later",
					genericError: "An error has occurred, try later",
					wrongToken: "The token you entered is incorrect, try again",
					wrongPassword: "Password is incorrect",
					minimalChar: "The password must have a minimum of 4 characters",
					notMatch: "Passwords do not match",
					emptyToken: "You must enter the token to confirm",
				},
				modalMessage:
					"We have sent a verification token to your email. Enter that value to complete the password change.",
				successPasswordUpdate: "Your password has been successfully changed",
				changePassword: "Change of password",
				currentPassword: "Current password",
				newPassword: "New password",
				placeholderNewPassword: "Must have at least 4 characters",
				repeatPassword: "Repeat password",
				buttonSend: "Send",
				buttonCancel: "Cancel",
				buttonClose: "Close",
				buttonVerify: "Verify",
				verify: "Verification",
			},
			updateProfile: {
				sexList: {
					male: "Male",
					female: "Female",
				},
				documentType: {
					id: "ID",
					dni: "DNI",
					identificationCard: "Identification Card",
					passport: "Passport",
					other: "Other",
				},
				errors: {
					repeatedPhone: "Sorry the phone number is already in use",
					errorServer: "Sorry, there has been an error in the service",
					emptyPhone:
						"Sorry, you must enter the phone number if you have selected an area code",
					longPhone: "Sorry, the phone number must include 7 digits or more",
					emptyFields:
						"Sorry, you must at least include your phone number to update your data",
					emptyFiscalRecord:
						"Sorry, you must include the tax registration number of the country where the company is located",
					emptyFiscalRecordType:
						"Sorry, you must include the type of fiscal record of the country where the company is located",
					emptyFiscalRecordYear:
						"Sorry, should include the year of registration",
					emptyFiscalRecordName:
						"Sorry, should include the name of the company",
					emptySecurityAnswer: "Sorry, should include the security answer",
					emptySecurityDirection: "Sorry, should include the direction",
					emptySecurityQuestion:
						"Sorry, you must include the security question",
					emptyBirthplace: "Sorry, should include the place of birth",
					emptyBirthday: "Sorry, must include your date of birth",
					emptyIDNumber: "Sorry, must include the identity document number",
					emptyIDNumberType:
						"Sorry, must include the type of identity document",
					emptyLastName: "Sorry, must include his last name",
					emptyName: "Sorry, you must include your name",
					emptySelfie: "Sorry, must include the selfie",
					emptyAddress: "Sorry, must include the address voucher",
					emptyBank: "Sorry, must include the bank account voucher",
					emptyID: "Sorry, must include the identification file",
					fileNotSupported: "Type of file not supported",
					fileSize: "File size exceeds the allowed",
				},
				successUpdate: "Your data has been updated successfully",
				successSentData:
					"Your data has been sent successfully. This verification process can take up to 72 hours.",
				header: "Update data",
				form: {
					name: "Name",
					placeholderName: "Enter your name",
					lastName: "Last name",
					placeholderLastName: "Enter your last name",
					sex: "Sex",
					placeholderSex: "Select...",
					documentType: "Document type",
					placeholderDocumentType: "Select...",
					other: "Specify",
					numberId: "ID Number",
					birthday: "Birthdate",
					birthplace: "Birthplace",
					country: "Country code",
					placeholderCountry: "Select a country...",
					phone: "Mobile phone",
					placeholderPhone: "Example 1234567",
					securityQuestion: "Security question",
					securityAnswer: "Security Answer",
					contactFamily: "Contact family",
					contactCompany: "Company contact person",
					placeholderContact: "Family name",
					contactEmailFamily: "Contact email",
					contactEmailCompany: "Company contact email",
					localbitcoinUser: "Localbitcoin's user",
					facebookUser: "Facebook's user",
					addressPersonal: "Address",
					addressCompany: "Company address",
					verifyCUninitiatedPersonal: {
						warning: "Attention!",
						messageWarning:
							"If you want to start the verification process, include the documents indicated below.",
						messageFile:
							"Click on the icon or drag to load the corresponding file.",
						supportedTypeFiles:
							"Allowed file types: jpg, jpeg, png, gif, pdf. Maximum file size 5Mb",
						documentID: "Identification document (DNI, Passport, ID)",
						bankAccountSupport: "Proof of associated bank account",
						addressSupport: "Proof of address",
						selfieSupport: "Selfie with address document",
						buttonChange: "Change",
						fileNotSupported: "File not supported",
					},
					verifyCUninitiatedCompany: {
						warning: "Attention!",
						messageWarning:
							"If you want to start the verification process of your company, include the documents indicated below.",
						name: "Company name",
						registerYear: "Year of registration",
						registerFiscalType: "Type of fiscal record",
						registerFiscalNumber: "Commercial registration number",
						messageFile:
							"Click on the icon or drag to load the corresponding file.",
						supportedTypeFiles:
							"Allowed file types: jpg, jpeg, png, gif, pdf. Maximum file size 5Mb",
						documentID:
							"Identity document of the person who verifies (must coincide with the signatory in the commercial register).",
						bankAccountSupport: "Proof of associated legal account",
						registerFiscal: "Commercial register (with wet seal)",
						selfieSupport: "Selfie with commercial registration document",
						buttonChange: "Change",
						fileNotSupported: "File not supported",
					},
					buttonSave: "Save",
					buttonVerify: "Verify",
					buttonBack: "Back",
				},
				modalInitVerification: {
					header: "Start Verification",
					warning:
						"Your Personal Data will be protected by encrypted Digital Security protocols. All your information is covered by the Legal Regulations stipulated in the Law of Financial Technology Institutions and its Privacy and Content Protection sections of Users of the United States of Mexico, only Compliance Officials of DLBTC Trade S.A. de CV authorized and certified to validate your data on the platform. If necessary, they will contact you to validate your information.",
					buttonYes: "Yes",
					buttonNo: "No",
					buttonClose: "Close",
				},
			},
			waitingVerification: {
				listLabelDataToVerify: {
					bank: "Bank",
					accountNumber: "Account number",
					accountHolderName: "Name",
					accountInterbankCode : "Account Interbank Code",
					accountHolderPhone : "Account Holder Phone",
					accountHolderId: "ID",
					type: "Payment type",
					currency: "Currency",
					accountType: "Account type",
					cardType: "Credit card type",
					cardNumber: "Credit card number",
					cardHolderName: "Card holder name",
					expDate: "Expiration date",
					csc: "Security code",
					zipCode: "Zip Code",
				},
				messages: {
					processing: {
						header: "Verification of payment method in PROCESS",
						content:
							"A micro deposit will be sent to your account to verify that it actually exists and you are the owner of it. Attach the screenshot of the microdeposit in the chat so that the moderator can finish the process. At the conclusion of the process you will be notified so you can continue with your PURCHASE. Verify your account information again and if there is an error, cancel the verification. Do not hesitate to contact our moderator staff for any questions related to the process.",
						creditCardContent:
							"Photo of the front side of the credit card must be attached. Only credit cards that allow international charges are accepted, check with your bank operator for more information",
					},
					fail: {
						header: "Verification of means of payment FAILED",
						content:
							"Normally the failure of this process is due to error in the data provided. Communicate by our chat with our moderators to know more details of the process or cancel the verification and try again.",
					},
					success: {
						header: "Verification of payment method SUCCESSFUL",
						content:
							"Now you can perform transactions with your means of payment, thanks for choosing us.",
					},
					canceled: {
						header: "Verification of payment method CANCELED",
						content:
							"You have canceled the verification of your means of payment, please note that this means of payment can not be used to perform operations on the portal, you can delete it and try again the verification process, Thanks.",
					},
					data: {
						header: "Account data",
					},
				},
				buttonBack: "Back",
				chatWaiting: {
					errors: {
						requiredField: "This field is required",
						fileNotSupported: "Type of file not supported",
						exceededSize: "The file size exceeds the allowed",
					},
					placeholderMessage: "Write your message here",
					buttonAttachment: "Attach document",
					buttonCancelVerification: "Cancel verification",
					buttonCloseVerification: "Close verification",
					buttonSend: "Send",
					labelMe: "Me",
					labelModerator: "Moderator",
					operationTimeLeft: "10 minutes left to close the operation",
					operationTimeExpired: "The operating time has expired",
					buttonSeeAttachment: "See attached file",
				},
			},
			walletAccount: {
				messages: {
					copiedAddress: "Your address has been copied to the clipboard",
					verifyEmailLink: {
						part1:
							"To use the Wallet you need to verify your email. We have sent an email to ",
						part2: ", please check your email and follow the instructions.",
					},
					errorInRed: "Check your internet connection and try again",
				},
				qrCode: "QR code",
				loading: "Loading...",
				header: "Use this address to receive bitcoins",
				buttonCopy: "Copy address",
			},
			optionAccount: {
				header: "Account",
				menu: {
					security: "Security",
					devices: "Devices",
				},
			},
			optionDevices: {
				errors: {
					userNotFound: "User not found",
					unexpectedError: "An expected error has ocurred",
				},
				tableHeader: {
					id: "ID",
					name: "Name",
					model: "Model",
					so: "Operative system",
					source: "Source",
					date: "Date",
					status: "Status",
					actions: "Actions",
				},
				table: {
					previous: "Previous",
					next: "Next",
					loading: "Loading...",
					noData: "There are no registered devices",
					page: "Page",
					of: "of",
					rows: "rows",
					pageJump: "go to the page",
					rowsSelector: "rows per page",
				},
				buttonRemove: "Remove permission",
				buttonAdd: "Allow permission",
				statusActive: "Active",
				statusInactive: "Inactive",
				modalRemovePermission: {
					header: "Remove device",
					content: "Are you sure you want to remove access to this device?",
					buttonYes: "Yes",
					buttonNo: "No",
					headerAdd: "Authorize device",
					contentAdd: "Are you sure you want to allow access to this device?",
				},
				successRemoving: "Your device have been removed successfully",
				successAdd: "Your device have been authorized successfully",
			},
			optionMovements: {
				tableHeader: {
					id: "ID",
					amount: "Amount",
					date: "Date",
				},
				table: {
					previous: "Previous",
					next: "Next",
					loading: "Loading...",
					noData: "There is no data",
					page: "Page",
					of: "of",
					rows: "rows",
					pageJump: "go to the page",
					rowsSelector: "rows per page",
				},
			},
		},
		sell: {
			loading: "Loading...",
			notAuth: {
				part1: "Please, ",
				part2: "log in",
				part3: " or ",
				part4: "sign up",
				part5: " to sell Bitcoins",
			},
			notVerifiedA: {
				part1:
					"To carry out sales operations it is necessary to verify your email. We have sent an email to ",
				part2: ", please check your email to continue with the operation.",
			},
			menu: {
				sell: "Sell Bitcoins",
				mySells: "Selling Record", //My Sells
			},
			form: {
				errors: {
					notPaymentMethods:
						"Currently we do not have payment methods for the selected currency",
					paymentMethodsNotAvailable:
						"Currently there are no payment methods available for the selected currency",
					notOffers:
						"Excuse me, at this time we cannot perform your operation. Try again later.",
					notOffersByCurrency:
						"Currently there are no offers for the selected currency",
					errorServer: "Sorry an error occurred on the server",
					notOffersAndPaymentMethod:
						"Currently there are no offers for the currency and the selected payment method",
					amountMaxLimit: "The amount has reached the commercial limit",
					requiredField: "This field is required",
					outBordersAmount:
						"The value must be between the minimum amount and the maximum amount",
					incompleteData: "You must include all the data",
					acceptTerms: "You must accept the terms and conditions",
					accountTypeReceiverEmpty:
						"You must select a type of destination account",
					emailReceiverEmpty: "This field es required",
					emailReceiverWrongFormat: "You must enter a valid email",
					conceptOperationEmpty: "The concept can not be empty",
					tokenInvalid: "The token/code can not be empty",
				},
				coin: "Currency",
				receiptOfFunds: "Receipt of Funds",
				placeholderCoin: "Select",
				paymentMethods: "Destination Account",
				placeholderPaymentMethods: "Select",
				type: "Payment type",
				typeElectro: "Type of Electronic Transfer",
				placeholderType: "Select",
				addToFrequent: "Add to frequent",
				businessLimits: "Commercial limits",
				amountIn: "Amount in ",
				amount: "Amount",
				amountFiat: "Fiat Amount",
				amountBTC: "Amount in BTC",
				forexRate: "Forex Rate",
				averagePriceReference: "Average referential price",
				comment: "Message for the Moderator",
				placeholderComment: "Write your comment for our moderators",
				accept: "Accept",
				terms: "Terms and Conditions",
				sell: "Sell",
				reject: "Dissmiss",
				buttonClose: "Close",
				buttonAcceptTerms: "Accept Terms and Conditions",
				create: "Create",
				messages: {
					redAlert:
						"Warning: Verify that your wallet code contains the correct data and corresponds to this\n" +
						"cryptocurrency.  In case of error in your code you may lose the amount of your transaction. The\n" +
						"system does not accept refunds or cancellations.",
					greenAlert: "Notice: Payment will be issued within 90 minutes.",
					blueAlert:
						"Note: In some cases certain transfers for the amount, the bank, the country, the time difference or\n" +
						"even holiday dates, may take up to 72 hours to be released.  Regular transfers of any kind will be\n" +
						"available within the first six hours or the next business day. If you need to have the payment\n" +
						"immediately, we recommend using a destination account from one of the banks available in:\n" +
						"Type of transfer / From the same bank (xxxx). Remember that transfers can generate bank or tax\n" +
						"charges in some countries.  The system does not accept returns or cancellations.",
					recomended: " ** Recommended banks for immediate transactions",
				},
				typeReceiverAccount: {
					own: "OWN ACCOUNTS",
					thirdParties: "MONEY TRANSFERS",
					moneyClick: "Transfer to MoneyClick",
					creditCard: "Reload Visa/Mastercard",
				},
				typeReceiverFund: {
					cash: "Cash",
					electronicTransfer: "Electronic transfer",
				},
				accountTypeReceiver: "Type of destination account",
				placeholderAccountTypeReceiver: "Select",
				emailReceiver: "Email receiver",
				placeholderEmailReceiver: "example@mail.com",
				operationConcept: "Operation concept",
				placeholderOperationConcept: "Example: Pay the rent",
				placeholderTypeReceiverFunds: "Select",
			},
			mySells: {
				errors: {
					requiredField: "This field is required",
					fileNotSupported: "Type of file not supported",
					exceededSize: "File size exceeds the allowed",
					failCancelSell:
						"The operation could not be canceled. Try again later",
				},
				bill: {
					pdfHeader: "Invoice",
					ticket: "Ticket",
					time: "Time",
					date: "Date",
					amountIn: "Amount in ",
					amountBTC: "Amount in BTC",
					appliedRate: "Applied rate",
					tax: "Tax",
					bankRate: "Bank rate",
					issuingBank: "Payment Issuing Bank",
					namePayer: "Payer Name",
					receivingBank: "Reception Bank",
				},
				terms: termsSellEng.ters,
				tableHeaders: {
					id: "ID",
					date: "Date",
					btc: "BTC",
					amount: "Amount",
					coin: "Currency",
					status: "Status",
					transactions: "Transactions",
					statusValues: {
						started: "Initiated",
						success: "Successful",
						waitingPayment: "Waiting for payment",
						canceled: "Canceled",
						paid: "Paid out",
						claim: "Claim",
						waitingConfirmation: "Waiting for receiver confirmation",
						waitingToStartOperation: "Waiting to start operation",
					},
				},
				table: {
					previous: "Previous",
					next: "Next",
					loading: "Loading...",
					noData: "There are no operations",
					page: "Page",
					of: "of",
					rows: "rows",
					pageJump: "go to the page",
					rowsSelector: "rows per page",
				},
				accordion: {
					details: "Operation details",
					operation: "Operation",
					terms: "Terms and Conditions",
					seeMore: "...See more",
					digitalBill: "Digital invoice",
					buttonDownload: "Download",
				},
				warningClaim: "The operation is in a claim process",
				placeholderMessage: "Write your message here",
				claimNotificationSent: "Claim notification sent",
				buttonClaim: "Make a Claim",
				buttonSend: "Send",
				buttonAttachment: "Attach document",
				labelMe: "Me",
				labelModerator: "Moderator",
				operationTimeLeft: "10 minutes left to close the operation",
				operationTimeout: "The operating time has expired",
				buttonSeeAttachment: "See attached file",
				modalTerms: {
					header: "Terms and Conditions",

					buttonClose: "Close",
				},
				modalSendSell: {
					messages: {
						notMatchOffer: "The offer was canceled",
						notBalanceMaster:
							"At this time your operation can not be processed.",
						notBalanceUser: "You do not have enough funds.",
						notAvailable: "This payment method is not available at this time.",
						newPrice: "The price change, new price ",
						notBetweenMinMax:
							"The amount is not between the minimum and the maximum ",
						confirmSell: " Your request for sale has been confirmed.",
						confirmChange: "do you want to continue the operation ?",
					},
					header: "Submit request for sale",
					requestSell: "Sales request ",
					btcBy: "BTC for",
					buttonCancel: "Cancel",
					buttonAccept: "Accept",
					buttonClose: "Close",
				},
				modalCancel: {
					header: "Cancel sell",
					content: "Are you sure you want to cancel this sell transaction?",
					buttonCancel: "No",
					buttonClose: "No",
					buttonAccept: "Yes",
					successCancelSell: "The sale operation has been canceled",
				},
				buttonCancel: "Cancel sell",
				buttonClose: "Close sell",
				cancellationWindow: "You can close this sale in the next: ",
			},
		},
		buy: {
			loading: "Loading...",
			notAuth: {
				part1: "Please, ",
				part2: "log in",
				part3: " or ",
				part4: "sign up",
				part5: " to sell Bitcoins",
			},
			menu: {
				buy: "Buy Bitcoins",
				myBuys: "Buying Record", //My Shopping
			},
			modalNotVerify: {
				notVerifiedA:
					"To send and receive bitcoin, it is necessary to verify your email, if you want to make purchases within the platform using banking means you must complete and verify your data for this, go to the user profile option. You must be the owner of the accounts, after passing the verification the system will allow you to continue the purchases successfully.",
				header: "Attention",
				buttonClose: "Close",
			},
			formVerificationEmail: {
				message: {
					part1: "We have sent an email to ",
					part2: ", please check your email to continue with the operation.",
				},
			},
			formVerificationPhone: {
				messages: {
					sentToken: {
						part1: "We have sent a verification code to your mobile phone ",
						part2: "******",
						part3:
							". Enter the code to complete the verification. You can send the code again after 60 seconds",
					},
					verifiedPhone: {
						part1: "The phone  ",
						part2: "******",
						part3: " has been successfully verified.",
					},
					failVerification:
						"Your phone could not be verified. Try again or check your mobile phone number.",
					notVerifyB:
						"To make purchase transactions you need to verify your mobile phone, please press Send code to start verification.",
				},
				errors: {
					tokenNotSent:
						"There was a problem sending the code, please try again.",
					phoneUsed: "The phone number is already in use.",
				},
				formRequestCode: {
					countryCode: "Country code",
					placeholderCountryCode: "Select a country...",
					phone: "Mobile phone",
					buttonSend: "Send code",
				},
				formCodeSent: {
					code: "Code",
					buttonVerify: "Verify",
					buttonResend: "Resend code",
					buttonBack: "Back",
				},
			},
			formVerificationIdentity: {
				sexList: {
					male: "Male",
					female: "Female",
				},
				documentType: {
					id: "ID",
					dni: "DNI",
					identificationCard: "Identification card",
					passport: "Passport",
					other: "Other",
				},
				errors: {
					fileNotSupported: "File not supported",
					fileSize: "File size exceeds the allowed",
					missingFiles:
						"All requested files must be attached in order to start the verification process", //"Excuse me, you must include all the files",
					errorNetwork: "Network Error",
					emptyIDNumber: "Excuse me, must include the identification number",
					emptyIDNumberType:
						"Excuse me, should include the type of identity document",
					emptySecurityAnswer: "Excuse me, should include the security answer",
					emptySecurityQuestion:
						"Excuse me, you must include the security question",
					selectTypeDocument:
						"Excuse me, you must select a type of identification document",
				},
				successFilesFiles:
					"Your files have been sent successfully. This verification process can take up to 72 hours.",
				form: {
					name: "Name",
					placeholderName: "Enter your name",
					lastName: "Last name",
					placeholderLastName: "Enter your last name",
					sex: "Sex",
					placeholderSex: "Select...",
					documentType: "Document type",
					placeholderDocumentType: "Select...",
					other: "Specify",
					numberId: "ID Number",
					birthday: "Birthdate",
					birthplace: "Birthplace",
					country: "Country code",
					placeholderCountry: "Select a country...",
					phone: "Mobile phone",
					placeholderPhone: "Example 1234567",
					securityQuestion: "Security question",
					securityAnswer: "Security Answer",
					contactFamily: "Contact family",
					contactCompany: "Company contact person",
					placeholderContact: "Family name",
					contactEmailFamily: "Contact email",
					contactEmailCompany: "Company contact email",
					localbitcoinUser: "Localbitcoin's user",
					facebookUser: "Facebook's user",
					addressPersonal: "Address",
					addressCompany: "Company address",
					verifyCUninitiatedPersonal: {
						warning: "Attention!",
						messageWarning:
							"If you want to start the verification process, include the documents indicated below.",
						messageFile:
							"Click on the icon or drag to load the corresponding file.",
						supportedTypeFiles:
							"Allowed file types: jpg, jpeg, png, gif, pdf. Maximum file size 5Mb",
						documentID: "Identification document (DNI, Passport, ID)",
						bankAccountSupport: "Proof of associated bank account",
						addressSupport: "Proof of address",
						selfieSupport: "Selfie with address document",
						buttonChange: "Change",
						fileNotSupported: "File not supported",
					},
					verifyCUninitiatedCompany: {
						warning: "Attention!",
						messageWarning:
							"If you want to start the verification process of your company, include the documents indicated below.",
						name: "Company name",
						registerYear: "Year of registration",
						registerFiscalType: "Type of fiscal record",
						registerFiscalNumber: "Commercial registration number",
						messageFile:
							"Click on the icon or drag to load the corresponding file.",
						supportedTypeFiles:
							"Allowed file types: jpg, jpeg, png, gif, pdf. Maximum file size 5Mb",
						documentID:
							"Identity document of the person who verifies (must coincide with the signatory in the commercial register).",
						bankAccountSupport: "Proof of associated legal account",
						registerFiscal: "Commercial register (with wet seal)",
						selfieSupport: "Selfie with commercial registration document",
						buttonChange: "Change",
						fileNotSupported: "File not supported",
					},
					buttonSave: "Save",
					buttonVerify: "Verify",
					buttonBack: "Back",
				},
			},
			formChatVerification: {
				dataToVerify: {
					email: "Email",
					phone: "Phone",
					firstName: "Name",
					lastName: "Last name",
					answerSecurity: "Security Response",
					questionSecurity: "Security Question",
					typeDocumentIdentity: "Document type",
					numberDocumentIdentity: "Document number",
					gender: "Gender",
					female: "Female",
					male: "Male",
					birthdate: "Birthdate",
					birthplace: "Place of birth",
					userLocalBitcoin: "LocalBitcoins user",
					userFacebook: "Facebook user",
					nickname: "Nickname",
					familyName: "Contact",
					familyEmail: "Contact email",
					userDirection: "Address",
					bank: "Bank",
					accountNumber: "Account number",
					accountHolderName: "Name",
					accountInterbankCode : "Account Interbank Code",
					accountHolderPhone : "Account Holder Phone",
					accountHolderId: "Document number",
					type: "Payment Method",
					currency: "Currency",
					accountType: "Account type",
					companyName: "Company name",
					documentTypeFiscalRecord: "Tax registration document",
					numberFiscalRecord: "Registry number",
					registrationYear: "Year of registration",
					cardType: "Credit card type",
					cardNumber: "Credit card number",
					cardHolderName: "Card holder name",
					expDate: "Expiration date",
					csc: "Security code",
					zipCode: "Zip Code",
					accountAddress: "Account Address",
					accountZip: "Account zip code",
					bankRoutingNumber: "Bank Routing number",
					bankSwiftCode: "Bank swift code",
					accountWireRoutingNumber: "Account Wire Routing Number",
				},
				errors: {
					fileNotSupported: "File not supported",
					fileSize: "File size exceeds the allowed",
					requiredField: "This field is required",
				},
				verifyC: {
					processing: {
						header: "User verification in PROCESS",
						content:
							// "At the conclusion of the process you will be notified so you can continue with your PURCHASE.
							//  Do not hesitate to contact our moderator staff for any questions related to the process.",
							" As soon as the verification is  done, we will let you know  and you will be able to make purchases.Do not hesitate to contact us for any question.",
					},
					fail: {
						header: "User verification FAILED",
						content:
							"Communicate by our chat with our moderators to know details of the process.",
					},
					success: {
						content: "Successfully verified user",
						buttonContinue: "Continue my purchase",
					},
				},
				verifyD: {
					processing: {
						header: "Verification of payment method in PROCESS",
						content:
							"A micro deposit will be sent to your account to verify that it actually exists and you are the owner of it. Attach the screenshot of the microdeposit in the chat so that the moderator can finish the process. At the conclusion of the process you will be notified so you can continue with your PURCHASE.",
						creditCardContent:
							"Photo of the front side of the credit card must be attached. Only credit cards that allow international charges are accepted, check with your bank operator for more information",
					},
					fail: {
						header: "Verification of means of payment FAILED",
						content:
							"Normally the failure of this process is due to error in the data provided. Communicate by our chat with our moderators to know more details of the process or cancel the verification and try again.",
					},
					success: {
						content: "Means of payment successfully verified.",
						buttonContinue: "Continue my buy",
					},
					cancel: {
						content: "Verification of the means of payment was canceled.",
						buttonContinue: "Continue my buy",
					},
				},
				placeholderChat: "Write your message here",
				buttonCancel: "Cancel verification",
				buttonClose: "Close verification",
				buttonAttachment: "Attach document",
				buttonSend: "Send",
				labelMe: "Me",
				labelModerator: "Moderator",
				operationTimeLeft: "10 minutes left to close the operation",
				operationTimeExpired: "The operating time has expired",
				buttonSeeAttachment: "See attached file",
			},
			form: {
				errors: {
					userdaylyLimit: "Daily user limit reached",
					usermonthlyLimit: "Monthly user limit reached",
					requiredField: "This field is required",
					minAndMax:
						"The value must be between the minimum amount and the maximum amount",
					acceptTerms: "You must accept the terms and conditions",
					notAmount: "There are no longer amounts to operate with this offer",
					notOffersForCurrencyAndBank:
						"Excuse me, at this time we cannot perform your operation. Try again later.",
					notOffersForCurrency:
						"Currently there are no offers for the selected currency",
					notProcessed: "Currently we can not process your offer, try later.",
					amountBetween: "The amount selected must be between ",
					comercialLimit: "Up to a maximum of $ 2,000 is allowed ",
					firstBuy:
						" Please note that for your first trade with us, we require that you initiate the wire in person at your bank",
					notBalance: "You do not have enough balance.",
					changePrice: "Change the price, the current price is ",
					amountMaxLimit: "The current amount has reached the commercial limit",
					notOffers: "Currently there are no offers, please try other options.",
					notBalanceExternal: "Your balance is not enough",
					server: "Sorry an error has occurred on the server, try later",
				},
				messages: {
					successRequest: "Your purchase request has been confirmed.",
					blueAlert:
						"Note: Your bitcoins will be deferred until your deposit is accredited and verified by our Operator.\n" +
						" The system does not accept refunds or cancellations. In some cases banks may delay releasing\n" +
						"payments, this depends on the bank, the account, the amount or if additional validations are\n" +
						"required.",
					redAlert:
						"Attention: The transfer can only be made from your verified bank account and associated with this\n" +
						"operation.  In case of doing it from another account your operation will be canceled and the\n" +
						"payment reversed. You must make the payment within the established time frame, mark as\n" +
						"Realized Payment and send a clear capture to the Operator.  Place in Payment Concept: Buy\n" +
						"Bitcoin with the ID code of the transaction.",
					ethAlert:
						"Warning: Verify that your wallet code contains the correct data and corresponds to this\n" +
						"cryptocurrency.  In case of error in your code you may lose the amount of your transaction. The\n" +
						"system does not accept refunds or cancellations.",

					//greenAlert:"Up to a maximum of $ 2,000 is allowed "
				},
				fields: {
					banks: "Banks/Offices",
					currency: "Currency",
					typeCheck: "Check type",
					placeholderCurrency: "Select",
					paymentMethods: "Payment method",
					paymentsType: "Payment type",
					messageToTheModerator: "Message to the moderator",
					placeholderPaymentMethods: "Select",
					placeholderSelect: "Select",
					ownPaymentMethods: "Own Payment Methods",
					placeholderOwnPaymentMethods: "Select",
					commercialLimits: "Commercial limits",
					placeholderType: "Select",
					amount: "Amount",
					amountFiat: "Fiat Amount",
					amountBTC: "Amount in BTC",
					forexRate: "Forex rate",
					averagePriceReference: "Average referential price",
					placeholderComments: "Write your comment for our moderators.",
					identifyBuy: "Operation description (optional)",
					accept: "Accept",
					terms: "Terms and Conditions",
					buttonBuy: "Buy",
					reject: "Dissmiss",
					createPaymentMethod: "Create",
					typeElectro: "Type of Electronic Transfer",
					bankAccountBalance: "Bank balance account",
				},
			},
			modalConfirm: {
				header: "Send buy request",
				request: {
					part1: "Purchase request ",
					part2: "BTC by ",
				},
				payWindow: {
					part1: "Once the purchase request is sent, you have ",
					part2:
						" minutes to finish the operation, otherwise it will be canceled automatically.",
				},
				charges: {
					header: "Operating charges",
					VAT: "VAT: ",
					COMMISSION: "Commission: ",
				},
				buttonCancel: "Cancel",
				buttonAccept: "Accept",
				buttonClose: "Close",
			},
			modalCreatePayment: {
				header: "Attention!",
				body: {
					h3:
						"Before selecting your payment method, carefully read the following instructions.",
					p1:
						"The rules for banking transactions change from country to country and even between banks. This can affect your operations.",
					p2:
						"Keep in mind the following indications before making your Payment: ",
					list: {
						item1: {
							recommended: "Recommended",
							header: " Transfers from a Specific Bank",
							body: {
								p1:
									"If you have a bank account within one of the banks that we specify in our list of accounts enabled to receive your payment, you can make your Electronic Transfer and your payment will be received and verified immediately. Therefore this means of payment guarantees speed in your transaction and except in very few countries generates bank fees.",
								p2:
									"Note that in some cases this process may take several hours, which may delay the release of your Bitcoin..",
								p3:
									"Important Note: Only use this option if you are the owner of the account from which you made the payment, and if it is within one of the specified banks. If you make the payment from a different bank your transaction will have a possible adjustment of the purchase rate and may generate additional charges.",
							},
						},
						item2: {
							header: "Transfer from a Third Bank",
							body: {
								p1:
									"Depending on the country and the bank, this payment is usually reflected in a period of 6, 24 or 48 working hours. If the payment falls on the same business day, the Purchase Price of your BTC will remain the same, but if the payment enters from the next day or following sub days, an adjustment can be made in your BTC Purchase Price rate..",
								p2:
									"Our commercial policy stipulates to benefit our Users and to the commerce, but due to the strong variations of prices your purchase will be translated to the current price for the moment in which your money is available in our account.",
								p3:
									"Also keep in mind that this type of Payment Method can generate additional bank charges.",
								p4:
									"The extra charges charged by the bank and the variation of the BTC Purchase Price will determine the amount that will be credited to your wallet once the Purchase is completed.. ",
								p5:
									"Important Note: Do not forget that we only accept payments made from an account in your name and that once the Transaction is made it will not be reversible under any circumstances. ",
							},
						},
						item3: {
							header: "Cash deposit",
							body: {
								p1:
									"Depending on the Country and the Banking Institution, cash deposits can be received (Cash). In most cases they must be limited amounts and you should check with each bank whether or not you receive cash deposits.",
								p2: "The bank may ask you to justify the funds.",
								p3:
									'You must always place on the Banking Receipt the Receipt or Transaction number issued by our platform, and write by hand and in legible handwriting "PURCHASE OF BITCOIN NON REFUNDABLE", once this is done take a photo and send the capture before you press the button of Payment Made.',
								p4:
									"Payment will be credited immediately if you comply with all the instructions.",
								p5:
									"For Cash Deposits of more than one thousand dollars or its equivalent in any currency, you must consult the moderator. ",
								p6:
									"Important Note: If you choose the Cash Deposit option and make any other payment method such as Check or Bank Draft for example, your transaction will be deferred and may be reversed by the DollarBTC Operator, in addition to generating a penalty and a Red Flag to Your User Account For cash payments you must comply with these requirements and any other that the DLBTC Operator requests or that is required by the Laws for Prevention of Money Laundering or Prevention of Terrorist Activities in force.. ",
							},
						},
						item4: {
							header: "Wire ",
							body: {
								p1:
									" This means of payment is only available in some countries, the payment will be credited in the following 24 or 48 business hours.",
								p2: "You must send fully readable operation support.",
								p3:
									"The payer must check that he owns the account where the funds come from.",
								p4:
									"This means of payment is available for operations of five thousand dollars and more. ",
							},
						},
						item5: {
							header: "International transfer (Swift o Aba)",
							body:
								"For this type of payment you should consult the Moderator. ",
						},
						item6: {
							header: "Deposit in Check",
							body:
								"For this type of payment you should consult the Moderator. ",
						},
					},
				},
				buttonAccept: "Accept",
			},
			modalTerms: {
				header: "Terms and Conditions",
				terms: termsBuyEng,
				buttonClose: "Close",
				buttonAcceptTerms: "Accept Terms and Conditions",
			},
			history: {
				terms: termsBuyEng,
				errors: {
					requiredField: "This field is required",
					fileNotSupported: "Type of file not supported",
					exceededSize: "File size exceeds the allowed",
					InternetError: "Internet error",
				},
				bill: {
					pdfHeader: "Invoice",
					header: "Digital invoice",
					ticket: "Ticket",
					time: "Time",
					date: "Date",
					amountIn: "Amount in ",
					amountBTC: "Amount in BTC",
					amountFiat: "Amount Fiat",
					currencyFiat: "Currency Fiat",
					appliedRate: "Applied rate",
					tax: "Tax",
					bankRate: "Bank rate",
					issuingBank: "Payment Issuing Bank",
					namePayer: "Payer Name",
					receivingBank: "Reception bank",
				},
				messages: {
					waitingPaymentExpired: "Expired the time of your payment.",
					payVerificationSent: "Payment notification sent successfully.",
					sentProofValidPayment:
						"To finish your purchase you must successfully attach a valid payment voucher, clearly visible and with the transaction number in the payment concept. If you don't do this, operators won't be able to verify the voucher, you must do this before the specified time is up. Once you attach the voucher press payment sent.",
					// "To conclude your purchase you must successfully attach a valid payment voucher,
					// clearly visible and with the transaction number in the payment concept. If you do not attach
					//  a proof of payment with these characteristics, your operation can not be verified by the
					//  Operator.Remember that you must complete your payment before the set time.Once you attach
					//   the voucher, press the button Check payment.",
					sentProof2:
						"To finish your purchase successfully you must attach a valid receipt, visible and clear, with the transaction number in the payment concept.If you don't do this, operators won't be able to verify the operation, you must do this before the specified time is up.Once you attach the receipt press the button.",

					// "To conclude your purchase successfully you must attach a valid receipt, visible and clear,
					// with the transaction number in the payment concept if you do not attach a clear and visible
					//  payment voucher your operation can not be verified by the Operator.You must conclude your
					// payment before the established period.Once attached the receipt press the button",
				},
				tableHeaders: {
					date: "Date",
					amount: "Amount",
					currency: "Currency",
					status: "Status",
					transactions: "Transactions",
					statusValues: {
						started: "Initiated",
						success: "Success",
						waitingPayment: "Waiting for payment",
						canceled: "Canceled",
						paid: "Paid",
						claim: "Claim",
						payVerification: "Payment Verification",
					},
				},
				table: {
					previous: "Previous",
					next: "Next",
					loading: "Loading...",
					noData: "There are not operations",
					page: "Page",
					of: "of",
					rows: "rows",
					pageJump: "go to the page",
					rowsSelector: "rows by page",
				},
				accordion: {
					details: "Operation details",
					operation: "Operation #:",
					terms: "Terms y Conditions",
					seeMore: "...See more",
					digitalBill: "Digital invoice",
					buttonDownload: "Download",
					qualify: "Qualify",
				},
				payWindow: "Payment timeframe", //"Payment window:",
				minutes: "Min.",
				buttonMarkPayment: "Payment done", //"Mark payment",
				warningClaim: "The operation is in a claim process",
				placeholderMessage: "Write your message here",
				claimNotificationSent: "Claim notification sent",
				buttonClaim: "Make a Claim",
				buttonSend: "Send",
				buttonAttachment: "Attach document",
				buttonCancel: "Cancel buy",
				buttonClose: "Cancel purchase", //"Close buy",
				labelMe: "Me",
				labelModerator: "Moderator",
				operationTimeLeft: "10 minutes left to close the operation",
				operationTimeout: "The operating time has expired",
				buttonSeeAttachment: "Ver archivo adjunto",
				theOperation: "The operation",
				wasCreated: " it was created successfully.",
				wasClaimed: " has entered a claim process.",
				modalCancel: {
					header: "Cancel buy",
					content: "Are you sure you want to cancel this purchase transaction?",
					buttonCancel: "Cancel",
					buttonClose: "Close",
					buttonAccept: "Accept",
				},
				modalQualify: {
					header: "Qualify operation",
					comment: "Comment",
					qualify: "Qualify",
					send: "Send",
					messageSuccess: "Qualification done successfully",
					messageError: "An error has occurred, please try again later",
				},
			},
		},
		footer: {
			contact: "Contact us",
			about: "About us",
			allRights: "All rights reserved",
		},
		inbox: {
			messages: {
				finished: {
					part1: "The operation ",
					part2: " has changed its status: FINISHED",
				},
				newMessage: {
					part1: "The operation ",
					part2: " has received a new message",
				},
				canceled: {
					part1: "The operation ",
					part2: " has changed its status: CANCELED",
				},
				waitingPayment: {
					part1: "The operation ",
					part2: " has changed its status: WAITING FOR PAYMENT",
				},
				fail: {
					part1: "The operation ",
					part2: " has changed its status: FAIL",
				},
				operationTimeLeft: "10 minutes left to close the operation",
				operationTimeExpired: "The operating time has expired",
				paid: {
					part1: "The operation ",
					part2: " has changed its status: PAID",
				},
				created: {
					part1: "The operation ",
					part2: " has been CREATED",
				},
				success: {
					part1: "The operation ",
					part2: " has changed its status: SUCCESSFUL",
				},
				claim: {
					part1: "The operation ",
					part2: " has changed its status: CLAIM",
				},
				payVerification: {
					part1: "The operation ",
					part2: " has changed its status: PAY VERIFICATION",
				},
				receiverConfirmation: {
					part1: "The operation ",
					part2: " has changed its status: WAITING FOR RECEIVER CONFIRMATION",
				},
				noMessages: "You don't have new messages to show",
			},
			read: "Read",
			unread: "Unread",
			notNotifications: "You don't have pending notifications",
			popupSafari: {
				headerAuthSession: "Authorize audio",
				messageAuthSession:
					"Click on the button to authorize audio playback in this session",
				buttonAuthorize: "Authorize",
				headerAuthPermanent: "Permanent authorization",
				messageAuthPermanent:
					"Navigate to browser settings to authorize dollarBTC.com for automatic audio playback (for informational purposes only without third-party advertising)",
			},
		},
		guide: {
			header: "COURSE OF CRYPTOECONOMY",
			commons: {
				specificObjectives: "Specific objectives",
				generalObjectives: "General objectives",
				content: "Content",
				theoreticalSection: "Theoretical section",
				practicalSection: "Practical section",
				conclusions: "Conclusions",
			},
			modules: {
				one: {
					header: "MODULE I",
					sub: "Introduction to Cryptoeconomics",
					generals: {
						one:
							"The participant of this module can be a person with null, basic or even intermediate knowledge. Not for advanced people.",
						two:
							"This module aims to serve as a general introduction for those people who occasionally participate or want to enter the " +
							"cryptoeconomy in some way so that they can handle the basic concepts and open their mind to the unlimited possibilities of this new type of economy.",
						three:
							"Once the participant of this Introduction Module completes it, he / she must be able to understand and" +
							" clearly handle the conceptual basis of the cryptoeconomy, the differences with the traditional economy, the advantages and disadvantages of entering," +
							" growing or maintaining besides their capacity as participant to evaluate the environment, its implications, " +
							"its risks and responsibilities in addition to being able to inform anyone of the basic conceptual framework that involves the management of cryptoeconomic assets.",
					},
					specifics: {
						one: "Management of Basic Concepts (BTC and Blockchain)",
						two:
							"Distinguish between traditional economy and decentralized economy (BC/Fiat)",
						three: "Implications of participating in this ecosystem",
						four:
							"Know how to distinguish risks, opportunities and fraud schemes",
						five: "Tools",
						six: "Types of Wallet",
						seven: "Exchange",
						eight: "Trade",
						nine: "Lending",
						ten: "Payment systems",
						eleven: "Production systems",
						twelve: "How to Buy / Sell (theoretical)",
						thirteen:
							"Know the investment or business models to start participating" +
							"\t\nMining" +
							"\t\nTrade" +
							"\t\nSaving" +
							"\t\nInvestment\n",
						fourteen: "Tools for local/international payment system",
						fifteen:
							"Ability to analyze and understand the ecosystem and be able to make decisions based on their knowledge to minimize own risks of ignorance of information",
						sixteen:
							"At the end of the module the participant must know how to create his wallet and make payments, deposits or transfers. Create your Exchange account and an exchange account to buy your first tokens and exchange them for others.",
					},
					content: {
						l1: "\u2022 What is Cryptoeconomics?",
						l2:
							"\u2022 What is Blockchain, how does it work, what is its foundation",
						l3:
							"\u2022 Traditional Economy Vs Decentralized Economy (blockchain)",
						l4: "\u2022 Advantage",
						l5: "\u2022 Disadvantages",
						l6: "\u2022 Underlying foundations",
						l7: "\u2022 What is Bitcoin?",
						l8: "\u2022 What is Altcoin?",
						l9:
							"\u2022 Different types ALTCOIN\n" +
							"\t\t\xBA Ether\n" +
							"\t\t\xBA ZCHASH\n" +
							"\t\t\xBA SIACOIN\n" +
							"\t\t\xBA RIPLEY\n",
						l10:
							"\u2022 Mining as a Business Concept\n" +
							"\t\xBA What are the Minelayer?\n" +
							"\t\t\u2022 Types of Minelayer\n" +
							"\t\t\u2022 Cloud\n" +
							"\t\t\u2022 Aschi\n" +
							"\t\t\u2022 GPU\t\n" +
							"\t\xBA What are The Protocols\n" +
							"\t\xBA Levels of Difficulty\n" +
							"\t\xBA Performance Rates\n" +
							"\t\xBA Recovery of Investment\n" +
							"\t\xBA Advantages and disadvantages of Mining\n" +
							"\t\t\u2022 Implications\n" +
							"\t\t\u2022 Investment\n" +
							"\t\t\u2022 Developing\n",
						l11: "\u2022 What is Fiat Currency?",
						l12: "\u2022 Convertibility",
						l13:
							"\u2022 Graphics and analysis of Behavior since its creation\n" +
							"\t\xBA BTC\n" +
							"\t\xBA Ether\n",
						l14:
							"\u2022 Legal Principles in Usa / Asia / Latin america y Europe\n" +
							"\t\xBA Regulatory frameworks in force\n",
						l15: "\u2022 Rate BTC / Dollar, principles and applications\n",
						l16:
							"\u2022 What is a Wallet\n" +
							"\t\xBA Wallet Dinamic\n" +
							"\t\xBA Wallet Static\n" +
							"\t\xBA Wallet Cool\n" +
							"\t\xBA Wallet Hot\n" +
							"\t\xBA Wallet Type USB Device\n",
						l17:
							"\u2022 How to buy Bitcoin?\n" +
							"\t\xBA What is an Exchange?\n" +
							"\t\xBA What is a Pair To Pair\n" +
							"\t\xBA Investment Security\n" +
							"\t\xBA Management as Payment Instrument\n" +
							"\t\xBA Management as investment\n" +
							"\t\xBA Management as Savings\n" +
							"\t\xBA Purchase Tools - Sale\n",
						l18: "\u2022 Questions and answers\n",
						l19: "\u2022 Contributions from participants\n",
						l20: "\u2022 Testimonials from real entrepreneurs\n",
						l21: "\u2022 Final conclusions\n",
						l22: "\u2022 Evaluation\n",
						l23: "\u2022 Delivery of Certificates and Recognition\n",
					},
				},
				two: {
					header: "MODULE II",
					sub: "Mining",
					intro:
						"Twenty hours / Intensive Modality (6 days) / Minimum Group three people / Cost 400 $ p.p.",
					generals: {
						one:
							"People with a basic technical knowledge level who are interested in creating or increasing a Mining business and wish to have the necessary technical-financial tools to be able to evaluate objectively and professionally in investing or creating an autonomous mining business, whether small or large scale.",
						two:
							"The participant of this module will obtain the necessary tools to start mining immediately, both in software and from a business point of view. It will have the technical, financial and legal expertise to operate and evaluate with real tools the different economic scenarios involved in the creation of this business modelService, in an objective and qualitative way you can make the decision to invest or not in the mining business and long-term responsibility.",
						three:
							"The participant of this module will obtain the elementary notions from the technical and business point of view for the operation and management of a mine, but under no aspect this course will graduate or certify him as a technician, since the technician proper is a specialized person in software and hardware management that must have solid knowledge of electronics and programming and be certified by specialized universities in the area.",
					},
					specifics: {
						one:
							"Know which type of mine suits your possibilities and expectations",
						two:
							"Recognize and analyze with real data technical and financial implications",
						three: "To be able to build a sustainable mine project",
						four:
							"Know the legal, technical and financial framework to limit the scope of the project",
						five:
							"Know the machines at the experiential level\n" +
							"\tFunctioning\n" +
							"\tComponents\n" +
							"\tProgramming\n" +
							"\tMonitoring and Control\n",
						six:
							"Be able to operate from a domestic equipment to high performance equipment",
						seven:
							"To analyze with real tools their strengths, weaknesses and weaknesses in the business of this business. SWOT analysis.",
					},
					content: {
						theoretical: {
							l1: "\u2022 Basic concepts",
							l2:
								"\u2022 Types of Mining\n" +
								"\t\t\xBA Ashic\n" +
								"\t\t\xBA GPU\n" +
								"\t\t\xBA Cloud\n",
							l3:
								"\u2022 Financial Technical Aspects\n" +
								"\t\t\xBA Investment\n" +
								"\t\t\xBA Rate of return (ROI)\n" +
								"\t\t\xBA Level of Difficulty (Difficulty Bomb)\n",
							l4:
								"\u2022 Administration of a Mine\n" +
								"\t\t\xBA Electrical installations, acclimatization and network.\n" +
								"\t\t\xBA Security Aspects\n" +
								"\t\t\xBA Legal aspects\n" +
								"\t\t\xBA National Mining Registry of the Mining Superintendence of the Government of Venezuela\n",
							l5: "\u2022 Equipment and necessary installations",
							l6: "\u2022 Mining Responsibilities",
							l7: "\u2022 Sudden gain",
							l8:
								"\u2022 Difficulty Rate and how it affects the yield of the Investment",
							l9: "\u2022 Mine Administration",
							l10: "\u2022 Advantages and disadvantages",
							l11: "\u2022 Mining as Hobbies or Mining as a business",
							l12:
								"\u2022 Analysis of variables\n" +
								"\t\t\xBA Fixed costs\n" +
								"\t\t\xBA Performance\n" +
								"\t\t\xBA Difficulty Rate\n" +
								"\t\t\xBA Technical Complexity\n",
							l13:
								"\u2022 Growth Projection\n" +
								"\t\t\xBA Initiation costs\n" +
								"\t\t\xBA Analysis of rentability\n",
						},
						practical: {
							l1: "\u2022 Components of a Rig",
							l2: "\u2022 Assembly of a Rig",
							l3: "\u2022 Live Rig configuration",
							l4:
								"\u2022 Mining Software\n" +
								"\t\t\xBA Linux environment\n" +
								"\t\t\t\u2022 Ethos\n" +
								"\t\t\t\u2022 Simple Mining\n" +
								"\t\t\xBA Mining under Windows environment (tools)\n" +
								"\t\t\u2022 Claymore\n" +
								"\t\t\u2022 Nicehash\n",
							l5:
								"\u2022 Knowledge of a Plug and Play Antminer machine\n" +
								"\t\t\xBA Programming\n" +
								"\t\t\xBA Pool connection\n" +
								"\t\t\xBA Tracing \n" +
								"\t\t\xBA Analysis and evaluation of results\n" +
								"\t\t\xBA Monitoring and Control Software\n",
							l6: "\u2022 Project Creation",
							l7: "\u2022 Feasibility, cost and Project Evaluation",
							l8: "\u2022 Evaluation and Certification",
							l9: "\u2022 Conclusions and Final Evaluation",
						},
					},
					conclusions:
						"The participant of this module will be able to start a mining business, in case the participant desists from the idea of ​​operation, " +
						"he / she may decline to perform the second part of the course that is purely technical and may have a clearer vision of the business in the " +
						"first part knowing the technical and financial implications of the mining company as a business modelService. It is important to emphasize that mining is" +
						" an unlimited business and the information is updated vertiginously therefore the real miner is a person who must keep up to date informed and updated " +
						"about the numerous advances and techniques of this dynamic world, this course prepares him for the basic tools and the structural " +
						"part of the business as such, for the development of the same the entrepreneur must be attentive, informed and updated at all times. " +
						"This module is not a prelatory of the following, since it can be skipped if the person does not consider mining as a " +
						"business (requires high levels of investment), however it is advisable to do at least half of this to have a broader worldview of the business. " +
						"In that case you can cancel half of the course and see only theoretical part of the Mining.\n",
				},
				three: {
					header: "MODULE III",
					sub: "Trade or Commerce with Cryptocurrencies",
					intro:
						"Eight hours / Intensive Modality (3 days) / Minimum Group three people / Cost 200 $ p.p.",
					generals: {
						o1:
							"This module is mainly practical, the participant must have general and conceptual knowledge to be able to carry out this module.",
						o2:
							"Learn to use the Blockchain platform as a means of savings, payments or investment",
						o3:
							"You will learn in an experiential way to create different types of Wallet, manage and evaluate different exchange platforms.",
						o4:
							"Analyze risks and potentials of the different types of investment",
						o5: "Cryptos portfolio",
						o6: "Creation and operation of an Exchange platform",
						o7: "Creation and operation of a Pair to Pair Platform",
						o8: "Trade intracryptos",
						o9: "Trade crypto/fiat",
						o10: "Exchange protocols",
						o11: "Security in data management",
						o12: "Regulatory framework in the USA",
						o13: "Bank risks and limitations",
					},
					specifics: {
						o1:
							"Knowing how to create and manage different Wallet according to their type and functionality",
						o2: "Operate in a secure environment",
						o3:
							"Make payments using the Blockchain platform through different cryptocurrencies\n" +
							"\tBTC\n" +
							"\tBTCash\n" +
							"\tEther",
						o4:
							"Learn to read the blockchain and how the system works as a means of global and instant payments\n" +
							"\tReal exercises",
						o5:
							"Operate specific platforms\n" +
							"\tPoloniex\n" +
							"\tLocalbitcoin\n" +
							"\tUphold\n" +
							"\tCryptocompare",
						o6: "Learn to read analyze the main indicators",
						o7:
							"This module will prevent you from the most common scams, scams or mistakes of a beginner",
						o8:
							"Real-time practices with operations to prevent errors or doubts that arise regularly due to lack of guidance",
						o9:
							"It will provide verifiable and reliable tools to make your operations away from the superfluous or manipulated analyzes that abound in the data network.",
						o10:
							"The participant will be trained to do their operations, evaluate the risks and make decisions with sufficient security that the practice will provide for the exercises performed",
					},
					content: {
						theoretical: {
							t1: "\u2022 Basic concepts",
							t2: "\u2022 What is a cryptoactive?",
							t3: "\u2022 Legal aspects",
							t4: "\u2022 Tax situation",
							t5: "\u2022 Convertibility into Fiat currencies",
							t6: "\u2022 Investment Tools",
							t7:
								"\u2022 Types of Trade\n" +
								"\t\xBA Trading\n" +
								"\t\xBA Lending\n" +
								"\t\xBA Leverage\n" +
								"\t\xBA Savings or investment\n",
							t8:
								"\u2022 Financial Technical Aspects\n" +
								"\t\xBA Investment\n" +
								"\t\xBA Rate of return (ROI)\n" +
								"\t\xBA Risk level",
						},
						practical: {
							p1:
								"\u2022 Create a Wallet\n" +
								"\t\xBA Select an Exchange\n" +
								"\t\xBA Real-time Poloniex operation\n" +
								"\t\xBA Trade Intracrypto\n" +
								"\t\xBA Payment exchange platform operation\n" +
								"\t\xBA Open an account and learn to trade in Localbitcoin\n" +
								"\t\xBA Trade Crypto / fiat real time\n",
							p2: "\u2022 Cycle of supervised individual exercises",
							p3:
								"\u2022 Exhibition of achievements of the participants\n" +
								"\t\xBA Share\n" +
								"\t\xBA Evaluation\n" +
								"\t\xBA Certification\n",
						},
					},
					conclusions:
						"Once this module is finished, the participant must consider himself as a crypto-value operator. " +
						"This is a new branch of the economy totally fledgling, so there is no globally accepted type of certification body or regulation. " +
						"The results of this experience is that depending on the skills and aptitudes of the participant can become a germinator or pioneer" +
						" of this incipient industry that in the future is possible to end up displacing the traditional investment world controlled " +
						"by banks and large financial entities that at the same time to be intermediaries and custodians are also monopolists of the flow " +
						"of money and economic transactions. There is no specific academic or credential requirement to be a trade. The person's performance, " +
						"qualities, aptitudes and honesty may allow him or her in the future to grow as an advisor or intermediary for friends and relatives " +
						"or simply give him the opportunity and freedom to execute his skills for the management and administration of his own funds. " +
						"In spite of not having a specific career to trade or be a professional of the cryptoeconomy, some basic knowledge such as economics, " +
						"administration and financial management can be very important to help the participant obtain better benefits. However, traditional knowledge " +
						"should not be confused with this new branch of economic science because the tight management of a traditional paradigm can " +
						"undermine the possible results if this knowledge becomes a barrier or a straitjacket to understand that this is a new modelService that has its own philosophy and dynamics. " +
						"Let us remember that those who have obtained more economic and financial success in this world, are boys of even less than twenty" +
						" years who have amassed great fortunes precisely because of their detachment from the norms of the traditional economy and its paradigms. " +
						"Its strength has been to believe and trust that a new libertarian economy is possible and that the financial emancipation of man is just beginning." +
						" We are at the beginning of a revolution, do not lose this opportunity to join the wave's beginning. We're still on time.\n",
				},
			},
		},
		chat: {
			headerTitle: "Hello!",
			subtitle: "Do you have any doubt? We are ready to help",
			placeholderSender: "Write your question ...",
			welcome: "Welcome ",
			messageWelcomeRegister: "How can we help you today?",
			messageWelcomeUnregister:
				"Please enter your name and email to start or continue a recent conversation in this browser",
			todayLabel: "TODAY",
			letsContinue: "Let's continue...",
			userTaken:
				"You already have a session started in another browser or window",
			form: {
				name: "Name",
				email: "Email",
				buttonSend: "Send",
				error: {
					emailWrong: "Wrong email",
					name: "Required field",
					email: "Required field",
				},
			},
		},
		broker: {
			addOffer: "Add offer",
			actualOffer: "Current offers",
			historyOffer: "Bid history",
			balanceOption: {
				balance: "Balance available",
				sendToPayments: "Send to payment methods",
				paymenthMethod: "Payment methods",
				own: "Own",
				thirdParties: "Third parties",
				amount: "Amount",
				description: "Description",
				cancel: "Cancel",
				send: "Send",
				balanceSendToPayment: "Balance available to send to payment method",
				messageConfirmation: "Are you sure you want to send ",
				messageConfirmation1: "to the means of payment ",
				confirm: "Confirm",
				message: {
					success: "Operation successfully completed",
					noOffer: "There are no offers for this currency",
					errorOperation:
						"The operation cannot be performed at this time. Try later",
					errorAmount: "The amount is not within the limit",
					noBalance: "You do not have enough balance to perform the operation",
				},
				tableHeaders: {
					date: "Date",
					amount: "Amount",
					price: "Price",
					currency: "Currency",
					status: "Status",
					transactions: "Transactions",
					type: "Type of operation",
					statusValues: {
						started: "Started",
						success: "Successful",
						waitingPayment: "Waiting for payment",
						canceled: "Canceled",
						paid: "Paid",
						claim: "Claim",
						payVerification: "Verifying payment",
					},
					typeValue: {
						buy: "BUY",
						sell: "SELL",
					},
				},
				table: {
					previous: "Previous",
					next: "Next",
					loading: "Loading ...",
					noData: "There are no operations",
					page: "Page",
					of: "of",
					rows: "rows",
					pageJump: "go to page",
					rowsSelector: "rows per page",
				},
				accordion: {
					details: "Details of the operation",
					operation: "Operation #:",
					terms: "Terms and Conditions",
					seeMore: "... See more",
					digitalBill: "Digital invoice",
					buttonDownload: "Download",
					qualify: "Rate",
				},
			},
			addOfferOption: {
				buy: "Buy",
				sell: "Sell",
				referencePrices: "Reference prices",
				askMin: "Minimum Purchase Price",
				bidMax: "Purchase price",
				MinPercentMargin: "Min Margin",
				MinPercentSpread: "Min Propagation",
				limitPerOperation: "Min - Max per operation",
				static: "Static",
				dynamic: "Dynamic",
				typeOperation: "Type of operation",
				selectType: "Select type",
				currency: "Currency",
				selectCurrency: "Select the currency",
				paymentMethod: "Payment Method",
				selectPaymentMethod: "Select the payment method",
				typeOfPayment: "Type of payment method",
				selectTypeOfPayment: "Select payment type",
				price: "Price",
				priceLimit: "Price limit",
				minPerOperation: "Minimum per operation",
				maxPerOperation: "Maximum per operation",
				totalAccumulated: "Maximum accumulated total",
				amountBtc: "Amount in BTC",
				source: "Source",
				marginPercentage: "Margin Percentage",
				propagationPercentage: "Propagation Percentage",
				add: "Add",
				actions: "Actions",
				messages: {
					addOffer: "Offer added",
					alertAddOffer: "The offer has been added successfully.",
					limitExceded: "The amount per operation is not within the limits",
					limitPercents: "The value exceeds the minimum percentage limit",
					limitPriceBid: "The price exceeds the minimum limit",
					limitPriceAsk: "The price exceeds the maximum limit",
					errorOperation:
						"The operation could not be performed at this time. Try again.",
					errorPaymentMethod:
						"There are no payment methods available for that currency",
					incompleteInfo:
						"You must fill in the information in all fields to add the offer",
				},
			},
			actualOfferTable: {
				currency: "Currency",
				date: "Date",
				paymentMethod: "Payment method / Payment type",
				payMethod: "Payment method",
				typeOfPayment: "Payment type",
				typeOperation: "Type of operation",
				priceLimit: "Limit price",
				price: "Price",
				accumulated: "Accumulated / Total",
				source: "Source",
				marginPropagation: "Margin - Propagation",
				actions: "Actions",
				buttonEdit: "Edit offer",
				buttonInactivate: "Inactivate offer",
				table: {
					previous: "Previous",
					next: "Next",
					loading: "Loading ...",
					noData: "No offers",
					page: "Page",
					of: "of",
					rows: "rows",
					pageJump: "go to page",
					rowsSelector: "rows per page",
				},
				message: {
					offerInactivate: "Offer inactivated",
					alertOfferInactivate: "The offer has been successfully inactivated.",
					url: "Link copied",
					errorAmount1:
						"The minimum amount per operation cannot be greater than or equal to the maximum amount per operation",
					errorAmount2:
						"The minimum amount per operation cannot be greater than or equal to the maximum amount per current operation",
					errorAmount3:
						"The maximum amount per operation cannot be less than or equal to the minimum amount per current operation",
					errorPrice: "The price exceeds the maximum limit for the offer",
					errorLimitMin:
						"The minimum amount per operation exceeds the minimum bid limit",
					errorLimitMax:
						"The maximum amount per operation exceeds the maximum limit of the offer",
					errorLimitOffer:
						"The total amount accumulated exceeds the maximum limit of the offer",
					errorLimitMinPercent: "Exceeds the minimum margin percentage limit",
					errorLimitMinSpread:
						"Exceeds the minimum propagation percentage limit",
					errorPriceMaxOffer:
						"The price exceeds the minimum limit for the offer",
					successEditOffer: "The edition of the offer was successful",
					errorEditOffer:
						"The edition of the offer could not be completed successfully. Try later",
					errorOperation:
						"The operation could not be performed at this time. Try again.",
				},
				modalEdit: {
					header: "Edit offer",
					limitOffer: "Supply limits",
					descriptionEdit1:
						"You are editing the offer information with the currency",
					descriptionEdit2: " whose type of operation is",
					descriptionEdit3: " the means of payment is the",
					descriptionEdit4: " and the type of payment is",
					buy: "BUY",
					sell: "SALE",
					actualPrice: "Actual price: ",
					previousValues: "Previous values",
					buttonCancel: "Cancel",
					buttonSave: "Save",
				},
				modalInactivate: {
					header: "Inactivate offer",
					content1: "Are you sure you want to inactivate the coin offer",
					content2: "whose type of operation is ",
					content3: " the means of payment is the",
					content4: " and the type of payment is ",
					buttonYes: "Yes",
					buttonNegative: "No",
				},
			},
		},
		takePhoto: {
			header: "Take a picture",
			buttonSave: "Save",
			buttonCancel: "Cancel",
			buttonTake: "Take Photo",
			buttonRetake: "Retake",
			errorSaving: "An error occurred trying to save the image, try again",
		},
		officeInfo: {
			name: "Office",
			website: "Website",
			workTime: "Work Time",
			address: "Address",
			phone: "Phone",
		},
		legal: {
			title: "Legal",
			term: "Terms and Conditions",
			cookies: "Cookies Policies",
			documents: "Documents",
			relationship: "1. Our relationship with you",
			accounts: "2. Accounts",
			minutes: "3. Minutes",
			payment: "4. Payment",
			cancellations: "5. Transaction Cancellations",
			accountBalances: "6. Account balances",
			closeAccount: "7. Close your account",
			rate: "8. Rate",
			risk: "9. Risk",
			rules: "10. Rules of behavior",
			responsibility:
				"11. Your responsibility: actions we can take and our limitation of liability",
			disputes: "12. Disputes with Diginet.llc",
			generalProvisions: " 13. General provisions",
			definitions: "14. Definitions",
		},
		receibeExternalConfirm: {
			title: "You have a transfer request with the data:",
			question: "Do you agree to receive this transaction?",
			buttonYes: "Yes",
			buttonNo: "No",
			successMessage: "Your reply has been sent satisfactorily",
			errorConexion: "A connection error has occurred, try again",
			errorServer:
				"An error has occurred on the server, please try again later",
			buttonEnd: "Close",
		},
	},
};
