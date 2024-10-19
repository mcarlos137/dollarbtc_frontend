import React from "react";
import { createConsumer } from "../../common/createConsumer";
import Login from "../Login/Login";
import interceptor from "../../services/interceptor";
const ContainerLogin = (context) => <Login {...context} />;
const ContainerLogins = createConsumer(ContainerLogin);
export default ContainerLogins;
