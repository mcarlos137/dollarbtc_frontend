import React from "react";
import { createConsumer } from "../../common/createConsumer";

export default {
  createContainer(Component) {
    let ContainerSettings = (context) => <Component {...context} />;
    const ContainerAdSettings = createConsumer(ContainerSettings);
    return ContainerAdSettings;
  },
};
