import React from "react";
import {createConsumer} from "../../common/createConsumer";
import InboxMessageAdmin from "../InboxMessageAdmin/InboxMessageAdmin";

const ContainerInbox = context =>(
 <InboxMessageAdmin {...context} />
);

const ContainerInboxAdmin = createConsumer(ContainerInbox);

export default ContainerInboxAdmin;