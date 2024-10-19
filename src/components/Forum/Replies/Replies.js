import React, { Component } from "react";
import user from "../../../services/user";
import forumAPI from "../../../services/forum";
import { Button, Header, Message, Comment, Form } from "semantic-ui-react";
import avatarNull from "../../../img/avatarNull.png";
import translate from "../../../i18n/translate";

class Replies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSubmitComment: false,
      bodyComment: "",
      post: this.props.postOwner,
      errorSubmittingComment: false,
      successSubmittingComment: false,
      comments: this.props.comments,
      errorSubmittingReply: false,
      successSubmittingReply: false,
      loadingSubmitReply: false,
      handleNewCommentsInPost: this.props.handleNewCommentsInPost,
      translator: props.translate
    };
    this.onSubmitComment = this.onSubmitComment.bind(this);
    this.showReplyForm = this.showReplyForm.bind(this);
    this.onEnterPressed = this.onEnterPressed.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }

  componentDidMount() {
    var comments = this.state.comments;
    comments.forEach(c => {
      c.showReplyForm = false;
    });
    this.setState({
      comments: comments
    });
  }
  onSubmitComment = e => {
    e.preventDefault();
    e.stopPropagation();
    ////console.log("Helloooo, submiting the answer xD");
    this.setState({
      loadingSubmitComment: true
    });
    var commentary = {
      body: this.state.bodyComment,
      date: new Date(),
      status: false,
      author: user.getUserName(),
      postId: this.state.post.id
    };
    forumAPI
      .createCommentary(commentary)
      .then(resp => {
        ////console.log(resp.data);
        if (resp.data.errors == null) {
          setTimeout(
            function() {
              this.setState({
                loadingSubmitComment: false,
                successSubmittingComment: true,
                bodyComment: "",
                comments: resp.data.payload
              });
            }.bind(this),
            3000
          );
          setTimeout(
            function() {
              this.setState({
                successSubmittingComment: false
              });
            }.bind(this),
            6000
          );

          setTimeout(
            this.handleNewComments(this.state.post.id, resp.data.payload),
            3000
          );
        } else {
          setTimeout(
            function() {
              this.setState({
                loadingSubmitComment: false,
                errorSubmittingComment: true,
                bodyComment: ""
              });
            }.bind(this),
            3000
          );

          setTimeout(
            function() {
              this.setState({
                errorSubmittingComment: false
              });
            }.bind(this),
            6000
          );
        }
      })
      .catch(error => {
        //console.log(error);
        setTimeout(
          function() {
            this.setState({
              loadingSubmitComment: false,
              errorSubmittingComment: true,
              bodyComment: ""
            });
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.setState({
              errorSubmittingComment: false
            });
          }.bind(this),
          6000
        );
      });
  };

  handleChangeComment = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleNewComments = (id, post) => {
    this.state.handleNewCommentsInPost(id, post);
  };

  showReplyForm = comment => {
    var all = this.state.comments;
    let index = all.indexOf(comment);
    if (index !== -1) {
      all[index].showReplyForm = !all[index].showReplyForm;
      this.setState({
        comments: all
      });
    }
  };

  onSubmitReply = (reply, commentId) => {
    var auxcComments = this.state.comments;
    let auxComment = auxcComments.find(c => {
      return c.id === commentId;
    });
    let index = auxcComments.indexOf(auxComment);
    auxcComments[index].replies = [];
    forumAPI
      .createReply(reply)
      .then(resp => {
        if (resp.data.errors == null) {
          setTimeout(
            function() {
              auxcComments[index].replies = resp.data.payload;
              this.setState({
                loadingSubmitReply: false,
                successSubmittingReply: true,
                comments: auxcComments
              });
            }.bind(this),
            3000
          );
          setTimeout(
            function() {
              this.setState({
                successSubmittingReply: false
              });
            }.bind(this),
            6000
          );
          setTimeout(
            this.handleNewComments(this.state.post.id, this.state.comments),
            5000
          );
          setTimeout(this.showReplyForm(auxComment), 6000);
        } else {
          setTimeout(
            function() {
              this.setState({
                loadingSubmitReply: false,
                errorSubmittingReply: true
              });
            }.bind(this),
            3000
          );

          setTimeout(
            function() {
              this.setState({
                errorSubmittingReply: false
              });
            }.bind(this),
            6000
          );
        }
      })
      .catch(error => {
        //console.log(error);
        setTimeout(
          function() {
            this.setState({
              loadingSubmitReply: false,
              errorSubmittingReply: true
            });
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.setState({
              errorSubmittingReply: false
            });
          }.bind(this),
          6000
        );
      });
  };

  onEnterPressed = commentId => e => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        loadingSubmitReply: true
      });
      var reply = {
        body: e.target.value,
        date: new Date(),
        status: true,
        idCommentary: commentId,
        author: user.getUserName()
      };
      this.onSubmitReply(reply, commentId);
    }
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
      hour12: "true"
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
    let t = this.state.translator;
    const { postOwner } = this.props;
    const {
      loadingSubmitComment,
      bodyComment,
      errorSubmittingComment,
      successSubmittingComment,
      comments,
      errorSubmittingReply,
      successSubmittingReply,
      loadingSubmitReply
    } = this.state;
    return (
      <Comment.Group threaded>
        <Header as="h5" dividing>
          {t("forum.replies.header")}
        </Header>
        {comments !== undefined &&
          comments.map(comment => (
            <Comment key={comment.id}>
              <Comment.Avatar
                as="a"
                src={comment.userImage ? postOwner.userImage : avatarNull}
              />
              <Comment.Content>
                <Comment.Author as="a">
                  {String(comment.author).includes("__")
                    ? comment.author.split("__")[1]
                    : comment.author.split("@")[0]}
                </Comment.Author>
                <Comment.Metadata>
                  <span>{this.formatDate(new Date(comment.date))}</span>
                </Comment.Metadata>
                <Comment.Text>
                  <p>{comment.body}</p>
                </Comment.Text>
                {user.getUserAuth() && (
                  <Comment.Actions>
                    <a onClick={() => this.showReplyForm(comment)}>
                      {t("forum.replies.reply")}
                    </a>
                    {comment.showReplyForm && (
                      <Form
                        reply
                        unstackable
                        success={successSubmittingReply}
                        error={errorSubmittingReply}
                        loading={loadingSubmitReply}
                      >
                        <Form.TextArea
                          placeholder={t("forum.replies.form.replyBody")}
                          required
                          onKeyPress={this.onEnterPressed(comment.id)}
                        />
                        <Message
                          success
                          header={t("forum.replies.form.successHeader")}
                          content={t("forum.replies.form.successPublish")}
                        />
                        <Message
                          error
                          header={t("forum.replies.form.failHeader")}
                          content={t("forum.replies.form.failPublish")}
                        />
                      </Form>
                    )}
                  </Comment.Actions>
                )}
              </Comment.Content>
              {comment.replies.length > 0 && (
                <Comment.Group>
                  {comment.replies.map(reply => (
                    <Comment key={reply.id}>
                      <Comment.Avatar
                        as="a"
                        src={reply.userImage ? reply.userImage : avatarNull}
                      />
                      <Comment.Content>
                        <Comment.Author as="a">
                          {String(reply.author).includes("__")
                            ? reply.author.split("__")[1]
                            : reply.author.split("@")[0]}
                        </Comment.Author>
                        <Comment.Metadata>
                          <span>{this.formatDate(new Date(reply.date))}</span>
                        </Comment.Metadata>
                        <Comment.Text>{reply.body}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  ))}
                </Comment.Group>
              )}
            </Comment>
          ))}
        {user.getUserAuth() && (
          <Form
            reply
            unstackable
            onSubmit={this.onSubmitComment}
            success={successSubmittingComment}
            error={errorSubmittingComment}
            loading={loadingSubmitComment}
          >
            <Form.TextArea
              placeholder={t("forum.replies.comments.form.commentBody")}
              name="bodyComment"
              value={bodyComment}
              onChange={this.handleChangeComment}
              required
            />
            <Message
              success
              header={t("forum.replies.comments.form.successHeader")}
              content={t("forum.replies.comments.form.successPublish")}
            />
            <Message
              error
              header={t("forum.replies.comments.form.failHeader")}
              content={t("forum.replies.comments.form.failPublish")}
            />
            <Button
              content={t("forum.replies.comments.form.buttonComment")}
              labelPosition="right"
              icon="edit"
              primary
              type="submit"
            />
          </Form>
        )}
      </Comment.Group>
    );
  }
}

export default translate(Replies);
