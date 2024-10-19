import axios from "axios";
import config from "./config.js";
import user from "./user";
const URL_BASE_BUSHIDO = config.apiBushidoBaseUrl;
const URL_BASE_DOLARBTC_CORE = config.apiDollarBtcUrl;
//"https://my-json-server.typicode.com/njarvis93/fake-dollarbtc-data"; //"http://localhost:4000"; //test: run json-server -p PORT db.json
//const urlBase = config.apiBushidoBaseUrl; //dev | prod

export default {
  getCategories() {
    return axios.get(URL_BASE_BUSHIDO + config.urlBushido.allCategories);
  },

  getPosts() {
    return axios.get(URL_BASE_BUSHIDO + config.urlBushido.allPosts);
  },

  getComments() {
    return axios.get(
      "https://my-json-server.typicode.com/njarvis93/fake-dollarbtc-data" +
        config.urlBushido.allComments
    );
  },

  createPost(body) {
    return axios.post(URL_BASE_BUSHIDO + config.urlBushido.createPost, body, {
      auth: {
        username: atob(user.getHeader()).split(":")[1],
        password: atob(user.getHeader()).split(":")[0],
      },
    });
  },

  editPost(id, body) {
    return axios.put(
      URL_BASE_BUSHIDO + config.urlBushido.updatePost + id,
      body,
      {
        auth: {
          username: atob(user.getHeader()).split(":")[1],
          password: atob(user.getHeader()).split(":")[0],
        },
      }
    );
  },

  likePost(body) {
    return axios.put(URL_BASE_BUSHIDO + config.urlBushido.likePost, body, {
      auth: {
        username: atob(user.getHeader()).split(":")[1],
        password: atob(user.getHeader()).split(":")[0],
      },
    });
  },

  inactivePost(id) {
    return axios.put(
      URL_BASE_BUSHIDO + config.urlBushido.inactivePost + id,
      id,
      {
        auth: {
          username: atob(user.getHeader()).split(":")[1],
          password: atob(user.getHeader()).split(":")[0],
        },
      }
    );
  },

  deletePost(id) {
    return axios.put(URL_BASE_BUSHIDO + config.urlBushido.deletePost + id, id, {
      auth: {
        username: atob(user.getHeader()).split(":")[1],
        password: atob(user.getHeader()).split(":")[0],
      },
    });
  },

  createCommentary(commentary) {
    return axios.post(
      URL_BASE_BUSHIDO + config.urlBushido.createComment,
      commentary,
      {
        auth: {
          username: atob(user.getHeader()).split(":")[1],
          password: atob(user.getHeader()).split(":")[0],
        },
      }
    );
  },

  updateCommentary(id, body) {
    return axios.put(
      URL_BASE_BUSHIDO + config.urlBushido.updateComment + id,
      body,
      {
        auth: {
          username: atob(user.getHeader()).split(":")[1],
          password: atob(user.getHeader()).split(":")[0],
        },
      }
    );
  },

  deleteCommentary(id) {
    return axios.put(URL_BASE_BUSHIDO + config.urlBushido.deletePost + id, id, {
      auth: {
        username: atob(user.getHeader()).split(":")[1],
        password: atob(user.getHeader()).split(":")[0],
      },
    });
  },

  createReply(reply) {
    return axios.post(URL_BASE_BUSHIDO + config.urlBushido.createReply, reply, {
      auth: {
        username: atob(user.getHeader()).split(":")[1],
        password: atob(user.getHeader()).split(":")[0],
      },
    });
  },

  // uploadFile(file) {
  //   const instance = axios.create();
  //   let interceptor = new HMACInterceptor(
  //     "Admin",
  //     "f0d16792-cdc9-4585-a5fd-bae3d898d8c5",
  //     "eox4TsBBPhpi737yMxpdBbr3sgg/DEC4m47VXO0B8qJLsbdMsmN47j/ZF/EFpyUKtAhm0OWXMGaAjRaho7/93Q==",
  //     "SHA256"
  //   );
  //   let conf = headers.createHeadersPost(
  //     URL_BASE_DOLARBTC_CORE,
  //     config.urlDollar.uploadFile,
  //     file,
  //     {
  //       headers: {
  //         "Content-Type": "multipart/form-data"
  //       }
  //     }
  //   );

  //   instance.interceptors.request.use(
  //     conf => {
  //       interceptor.process(conf);
  //       return conf;
  //     },
  //     error => {
  //       //console.log(error);
  //       return Promise.reject(error);
  //     }
  //   );
  //   // //console.log("add payment body", body);
  //   return instance(conf);
  // }
  uploadFile(file) {
    return axios.post(
      URL_BASE_DOLARBTC_CORE + config.urlDollar.uploadFile,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
