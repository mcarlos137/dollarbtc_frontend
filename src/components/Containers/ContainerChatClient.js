import React from "react";
import { createConsumer } from "../../common/createConsumer";
import ChatClient from "../ChatClient/ChatClient2";

const ContainerChat = context => <ChatClient {...context}/>;
const ContainerChatClient = createConsumer(ContainerChat);
export default ContainerChatClient;
