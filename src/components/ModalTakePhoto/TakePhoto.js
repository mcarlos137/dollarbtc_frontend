import React, {Component, useRef} from 'react'
import translate from "../../i18n/translate";
import {Modal, Button, Message } from "semantic-ui-react"
import Webcam from "react-webcam";
import uuid from "uuid";
import {isMobile} from "react-device-detect";

const videoConstraints = {
  width: 720,
  height: 420,
  facingMode: "user",
};
//const webCamRef = useRef(null);

class TakePhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: null,
      showModal: false,
      saveImg: false,
      error:false,
      translator: props.translate,
      size: props.buttonSize !== undefined ? props.buttonSize:"tiny"
    };
    this.takePhoto = this.takePhoto.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onClickRetake = this.onClickRetake.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext){
    if(this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      })
    }
  }
  setRef = (webCamRef)=>{
    this.webCamRef = webCamRef
  };
  takePhoto (){
    const imageSrc = this.webCamRef.getScreenshot();
    this.setState({ img: imageSrc})
  }
  openModal(){
    this.setState({ showModal: true });
  }
  closeModal(){
    this.setState({
      showModal: false,
      img: null,
      saveImg: false,
      error:false
    });
  }
  onClickRetake(e){
    e.persist();
    this.setState({
      img:null
    })
  }

  onClickSave(e){
    e.persist();
    this.setState((previousState)=>{
      return {
        saveImg: !previousState.saveImg
      }
    },()=>{
      fetch(this.state.img)
        .then(res => res.blob())
        .then(blob => {
          let id= uuid.v4();
          id = id.toString().slice(-17);
          const imgName = "attach"+id+".jpg";
          const file = new File([blob], imgName, {type: "image/jpeg"});
          console.log(file);
          let arrFiles = [];
          arrFiles.push(file);
          this.props.onHandlerFile(arrFiles);
          this.setState({ showModal: false, img: null, saveImg: false})
        })
        .catch(error=>{
          this.setState({ error: true })
        })
    })
  }

  render() {
    let t = this.state.translator;
    return (
      <Modal
        size="small"
        trigger={
          <Button
            onClick={this.openModal}
            icon="camera"
            size={this.state.size}
            compact
          />}
        open={this.state.showModal}
      >
        <Modal.Header>{t("takePhoto.header")}</Modal.Header>
        <Modal.Content style={{ paddingLeft: "0px", paddingRight:"0px" }}>
          {!this.state.img &&(
            <Webcam
              audio={false}
              height={isMobile ? 360:420}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={ isMobile ? 320:720}
              videoConstraints={videoConstraints}
            />
          )}
          {this.state.img &&
          <div>
            <img src={this.state.img} alt="img"/>
          </div>}
          {this.state.error &&(
            <Message>{t("takePhoto.errorSaving")}</Message>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            icon="cancel"
            content={t("takePhoto.buttonCancel")}
            onClick={this.closeModal}
          />
          {!this.state.img &&(
            <Button
              primary
              icon="camera"
              content={t("takePhoto.buttonTake")}
              onClick={this.takePhoto}>
            </Button>
          )}
          {this.state.img && (
            <Button onClick={this.onClickRetake} positive content={t("takePhoto.buttonRetake")} icon="camera"/>
          )}
          {this.state.img && (
            <Button onClick={this.onClickSave} primary content={t("takePhoto.buttonSave")} icon="save"/>
          )}
        </Modal.Actions>
      </Modal>
    )
  }
}

export default translate(TakePhoto)
