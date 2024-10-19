import React, { Component } from "react";
import "./ChatBox.css";
import { Grid, Segment } from "semantic-ui-react";
import uuid from "uuid";

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastMessage:
        this.props.msg !== null &&
        this.props.msg !== undefined &&
        this.props.msg.length > 0
          ? this.props.msg[this.props.msg.length - 1]
          : null,
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  componentDidMount() {
    if (this.state.lastMessage !== null) this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /*if(prevProps.chat !== this.props.chat){
      this.setState({
        lastMessage: this.props.chat !== undefined && this.props.chat.length > 0 ? this.props.chat[this.props.chat.length - 1] : null,
      }, ()=>{
        this.scrollToBottom()
      })
    }*/
    // this.scrollToBottom();
  }
  scrollToBottom = () => {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  formatDate(date) {
    let regi = "es-ES";
    let cad = "";
    var options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: "true",
    };
    let data = date.toLocaleString(regi, options);
    if (regi === "es-ES") {
      data = data.split(" ");
      let day = data[0];
      let month = data[1];
      data[0] = month;
      data[1] = day;

      for (date of data) {
        cad = cad + " " + date;
      }
    } else {
      cad = data;
    }

    return cad;

    // lunes, 26 de diciembre de 2050 9 a. m.
  }

  render() {
    const { chatByUser } = this.props;
    return (
      <Segment>
        {/* {(isLoading || chat.length === 0) && (
        <Segment placeholder loading={isLoading}>
          <Header icon>
            <Icon name='conversation'/>
            Seleccione un chat para comenzar
          </Header>
        </Segment>
      )} */}

        <Grid columns={1}>
          <Grid.Column
            mobile={16}
            tablet={16}
            computer={16}
            largeScreen={16}
            style={{ paddingLeft: "0px", paddingRight: "0px" }}
          >
            {this.props.msg !== null && (
              <div
                ref={(el) => {
                  this.messageList = el;
                }}
                className="container-msg"
              >
                {this.props.msg.map((c, index) => (
                  <div key={index} className="message">
                    <div
                      className={
                        c.adminUserName ===
                        window.sessionStorage.getItem("email")
                          ? "balloon-user"
                          : "balloon"
                      }
                    >
                      {c.message}
                      <br></br>
                      <p style={{ color: "#585656", fontSize: 9 }}>
                        {this.formatDate(new Date(c.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default ChatBox;
