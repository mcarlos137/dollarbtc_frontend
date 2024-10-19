import React from "react";
import {createConsumer} from "../../common/createConsumer";
import UserVerification from "../Admin/Users/UserVerification/UserVerification";

const ContainerUser = context =>(
  <UserVerification {...context} />
);

const ContainerUserVerification = createConsumer(ContainerUser);

export default ContainerUserVerification;