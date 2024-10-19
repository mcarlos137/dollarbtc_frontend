import React from "react";
import { createConsumer } from "../../common/createConsumer";
import MenuNavAdmin from "../NavAdmin/MenuNavAdmin";

const ContainerNav = context => <MenuNavAdmin {...context} />;
const ContainerMenuNavAdmin = createConsumer(ContainerNav);
export default ContainerMenuNavAdmin;
