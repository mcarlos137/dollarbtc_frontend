import React from "react";
import { createConsumer } from "../../common/createConsumer";
import AdSettings from "../OTC/AdSettings/AdSettings";

const ContainerSettings = context => <AdSettings {...context} />;
const ContainerAdSettings = createConsumer(ContainerSettings);
export default ContainerAdSettings;
