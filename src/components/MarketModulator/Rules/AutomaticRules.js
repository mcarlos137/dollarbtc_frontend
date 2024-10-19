import React, { Component } from "react";
import { Container, Segment } from "semantic-ui-react";
import modulatorAPI from "../../../services/marketModulator";

class AutomaticRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      automaticRules: [],
      showTableAutomaticRules: false
    };
    this.loadAutomaticRules = this.loadAutomaticRules.bind(this);
  }
  componentDidMount() {
    this.loadAutomaticRules();
  }

  loadAutomaticRules() {
    modulatorAPI
      .getAutomaticRules()
      .then(res => {})
      .catch(error => {});
  }

  render() {
    return (
      <Container>
        <Segment color="orange" />
      </Container>
    );
  }
}
export default AutomaticRules;
