import React from "react";
import { createConsumer } from "../../common/createConsumer";
import BalancesAndOperations from "../Admin/ExternalSend/ExternalSend";

const ContainerBalance = (context) => <BalancesAndOperations {...context} />;
const ContainerBalancesAndOperations = createConsumer(ContainerBalance);
export default ContainerBalancesAndOperations;
