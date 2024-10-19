import React, {Component} from 'react'
import translate from "../../i18n/translate";
import {Button, Divider, Form, Header, Modal, Segment} from "semantic-ui-react";

class ModalSessionExpired extends Component {
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
    let {viewModalEndSession, handleCloseModal} = this.props;
    return (
      <Modal open={viewModalEndSession} size="mini">
        <Header icon="exclamation circle" content={t("app.modalSessionExpired.header")} />
        <Modal.Content>
          <Segment basic>
            <h3>{t("app.modalSessionExpired.content")}</h3>
            <Form error>
              <Divider hidden />
              <Button
                color="blue"
                floated="right"
                onClick={handleCloseModal}
              >
                {t("app.modalSessionExpired.buttonClose")}
              </Button>

              <Divider hidden />
            </Form>
          </Segment>
        </Modal.Content>
      </Modal>
    )
  }
}

export default translate(ModalSessionExpired);