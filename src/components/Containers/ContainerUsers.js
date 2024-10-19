import React from "react";
import { createConsumer } from "../../common/createConsumer";
import Users from "../Admin/Users/Users";

const ContainerUser = context => <Users {...context} />;
const ContainerUsers = createConsumer(ContainerUser);
export default ContainerUsers;
