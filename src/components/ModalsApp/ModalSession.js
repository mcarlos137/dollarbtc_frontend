import React, {Component} from 'react'
import translate from "../../i18n/translate";
import {Button, Divider, Form, Header, Icon, Modal, Segment} from "semantic-ui-react";

class ModalSession extends Component {
  constructor(props){
    super(props);
    this.state={
      translator:props.translate
    }
  }
  componentWillReceiveProps(nextProps, nextContext){
    if(this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      })
    }
  }
  render() {
    let t = this.state.translator;
    let {viewModal, loadForm, seconds, calculateConnectionExpired} = this.props;
    return (
      <Modal open={viewModal} size="tiny">
        <Header icon="exclamation circle" content={t("app.modalSession.header")} />
        <Modal.Content>
          <Segment basic loading={loadForm}>
            <h3>
              {t("app.modalSession.content.part1")}{seconds}
              {t("app.modalSession.content.part2")}
            </h3>
            <Form error>
              <Divider hidden />
              <Button
                color="blue"
                floated="right"
                onClick={calculateConnectionExpired}
              >
                <Icon name="checkmark" />{t("app.modalSession.buttonYes")}
              </Button>

              <Divider hidden />
            </Form>
          </Segment>
        </Modal.Content>
      </Modal>
    )
  }
}

export default translate(ModalSession);