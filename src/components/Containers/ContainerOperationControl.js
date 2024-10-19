import React from "react";
import { createConsumer } from "../../common/createConsumer";
import ActualOperations from "../OTC/ActualOperations/ActualOperations";
const ContainerOperation = context => <ActualOperations {...context} />;

const ContainerActualOperations = createConsumer(ContainerOperation);

export default ContainerActualOperations;
