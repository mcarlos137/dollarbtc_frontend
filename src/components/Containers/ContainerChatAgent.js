import React from "react";
import {createConsumer} from "../../common/createConsumer";
import ChatAgent from "../Admin/ChatAgent/ChatAgent";

const ContainerChat = context =>(
  <ChatAgent {...context} />
);

const ContainerChatAgent = createConsumer(ContainerChat);

export default ContainerChatAgent;
