import React, { Component } from "react";
import ListPosts from "../Posts/ListPosts";
import {
  Button,
  Header,
  Icon,
  Input,
  Message,
  Modal,
  TextArea,
  Form
} from "semantic-ui-react";
import forumAPI from "../../../services/forum.js";
import translate from "../../../i18n/translate";
class MyFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: this.props.posts,
      username: this.props.username,
      categoryItem: this.props.categoryItem,
      openEditModal: false,
      openInactiveModal: false,
      editingPost: {},
      deletingPost: {},
      inactivatingPost: {},
      isEdited: false,
      resultEdition: {
        icon: "empty",
        header: "forum.myFeed.empty",
        content: "forum.myFeed.empty"
      },
      openDeleteModal: false,
      body: "",
      title: "",
      handleComments: this.props.handleComments,
      translator: props.translate
    };
    this.onClickLikeButton = this.onClickLikeButton.bind(this);
    this.onClickSavePostEdited = this.onClickSavePostEdited.bind(this);
    this.handleAddComments = this.handleAddComments.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }

  onClickSavePostEdited = (e, data) => {
    var post = data.post;
    var auxComments = post.comments;
    post.comments = [];
    forumAPI
      .editPost(post.id, post)
      .then(res => {
        let aux = this.state.posts.find(p => {
          return p.id === post.id;
        });
        let index = this.state.posts.indexOf(aux);
        aux.comments = auxComments;
        let postsUpdated = this.state.posts;
        if (index !== -1) {
          postsUpdated[index].comments = aux.comments;
          postsUpdated[index].title = aux.title;
          postsUpdated[index].body = aux.body;

          var result = {
            icon: "check circle outline",
            header: "forum.myFeed.actions.edit.successHeader",
            content: "forum.myFeed.actions.edit.successBody"
          };
          this.setState({
            posts: postsUpdated,
            resultEdition: result,
            isEdited: true
          });
        }
      })
      .catch(error => {
        //console.log("fail to update" + error);
        var result = {
          icon: "times circle outline",
          header: "forum.myFeed.actions.edit.failHeader",
          content: "forum.myFeed.actions.edit.failBody"
        };
        this.setState({
          resultEdition: result,
          isEdited: true
        });
      });
    this.closeEditModal();
  };

  onClickInactivePost = () => {
    var post = this.state.inactivatingPost;
    forumAPI
      .inactivePost(post.id)
      .then(res => {
        let aux = this.state.posts.find(p => {
          return p.id === post.id;
        });
        let index = this.state.posts.indexOf(aux);
        let postsUpdated = this.state.posts;
        if (index !== -1) {
          postsUpdated[index].active = false;
          var result = {
            icon: "check circle outline",
            header: "forum.myFeed.actions.inactivation.successHeader",
            content: "forum.myFeed.actions.inactivation.successBody"
          };
          this.setState({
            posts: postsUpdated,
            resultEdition: result,
            isEdited: true
          });
        }
      })
      .catch(error => {
        //console.log("fail to update" + error);
        var result = {
          icon: "times circle outline",
          header: "forum.myFeed.actions.inactivation.failHeader",
          content: "forum.myFeed.actions.inactivation.failBody"
        };
        this.setState({
          resultEdition: result,
          isEdited: true
        });
      });
    this.closeInactiveModal();
  };

  onClickDeleteButton = () => {
    var post = this.state.deletingPost;
    //console.log(post);
    forumAPI
      .deletePost(post.id)
      .then(res => {
        ////console.log("deleting succesfull: "+res.data.payload);
        let aux = this.state.posts.find(p => {
          return p.id === post.id;
        });
        let index = this.state.posts.indexOf(aux);
        let postsUpdated = this.state.posts;
        if (index !== -1) {
          postsUpdated.splice(index, 1);
        }
        var result = {
          icon: "check circle outline",
          header: "forum.myFeed.actions.deleting.successHeader",
          content: "forum.myFeed.actions.deleting.successBody"
        };
        this.setState({
          posts: postsUpdated,
          resultEdition: result,
          isEdited: true
        });
      })
      .catch(error => {
        //console.log(error);
        var result = {
          icon: "times circle outline",
          header: "forum.myFeed.actions.deleting.failHeader",
          content: "forum.myFeed.actions.deleting.failBody"
        };
        this.setState({
          resultEdition: result,
          isEdited: true
        });
      });
    this.closeDeleteModal();
  };

  onClickLikeButton = (e, data) => {
    this.props.onClickLike(e, data);
  };
  closeEditModal = () => this.setState({ openEditModal: false });

  closeDeleteModal = () => this.setState({ openDeleteModal: false });

  closeInactiveModal = () => this.setState({ openInactiveModal: false });

  showEditModal = post =>
    this.setState({
      openEditModal: true,
      editingPost: post
    });

  showDeleteModal = post => {
    this.setState({
      openDeleteModal: true,
      deletingPost: post
    });
  };

  showInactiveModal = post => {
    this.setState({
      openInactiveModal: true,
      inactivatingPost: post
    });
  };

  closeResultModal = () => this.setState({ isEdited: false });

  handleTitle = e => {
    this.setState({
      title: e.target.value
    });
    var aux = this.state.editingPost;
    aux.title = this.state.title;
    this.setState({
      editingPost: aux
    });
  };

  handleContent = e => {
    this.setState({
      body: e.target.value
    });
    var aux = this.state.editingPost;
    aux.body = this.state.body;
    this.setState({
      editingPost: aux
    });
  };

  handleAddComments = (id, post) => {
    this.state.handleComments(id, post);
  };
  render() {
    let t = this.state.translator;
    const {
      openEditModal,
      posts,
      username,
      editingPost,
      isEdited,
      resultEdition,
      openDeleteModal,
      openInactiveModal
    } = this.state;
    const { categories } = this.props;
    return username !== "" && posts.length > 0 ? (
      <div>
        <ListPosts
          posts={posts}
          isFromUser={true}
          onClickEdit={this.showEditModal.bind(this)}
          onClickDelete={this.showDeleteModal.bind(this)}
          onClickInactive={this.showInactiveModal.bind(this)}
          onClickLike={this.onClickLikeButton.bind(this)}
          categories={categories}
          handleNewComments={this.handleAddComments}
        />
        <Modal
          size="tiny"
          open={openEditModal}
          onClose={this.closeEditModal}
          centered={false}
          dimmer="blurring"
        >
          <Modal.Header>{t("forum.myFeed.modalEdit.header")}</Modal.Header>
          <Modal.Content>
            <Form error>
              <label>
                <strong>{t("forum.myFeed.modalEdit.title")}</strong>
              </label>
              <Form.Field
                id="edit-title"
                control={Input}
                required
                defaultValue={editingPost.title}
                onChange={this.handleTitle}
              />
              <label>
                <strong>{t("forum.myFeed.modalEdit.content")}</strong>
              </label>
              <Form.Field
                id="edit-body"
                control={TextArea}
                required
                defaultValue={editingPost.body}
                onChange={this.handleContent}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.closeEditModal}>
              {t("forum.myFeed.modalEdit.buttonClose")}
            </Button>
            <Button
              positive
              icon="save"
              labelPosition="right"
              content={t("forum.myFeed.modalEdit.buttonSave")}
              post={editingPost}
              onClick={this.onClickSavePostEdited}
            />
          </Modal.Actions>
        </Modal>
        <Modal
          basic
          size="small"
          open={isEdited}
          onClose={this.closeResultModal}
          centered={true}
        >
          <Header icon={resultEdition.icon} content={t(resultEdition.header)} />
          <Modal.Content>
            <p>{t(resultEdition.content)}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="blue" inverted onClick={this.closeResultModal}>
              <Icon name="checkmark" /> Ok
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          basic
          size="small"
          open={openDeleteModal}
          onClose={this.closeDeleteModal}
          centered={true}
        >
          <Header icon="trash" content={t("forum.myFeed.modalDelete.header")} />
          <Modal.Content>
            <p>{t("forum.myFeed.modalDelete.question")}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={this.closeDeleteModal}>
              <Icon name="remove" /> {t("forum.myFeed.modalDelete.buttonNo")}
            </Button>
            <Button color="green" inverted onClick={this.onClickDeleteButton}>
              <Icon name="checkmark" />{" "}
              {t("forum.myFeed.modalDelete.buttonYes")}
            </Button>
          </Modal.Actions>
        </Modal>
        <Modal
          basic
          size="small"
          open={openInactiveModal}
          onClose={this.closeInactiveModal}
          centered={true}
        >
          <Header
            icon="power off"
            content={t("forum.myFeed.modalInactivate.header")}
          />
          <Modal.Content>
            <p>{t("forum.myFeed.modalInactivate.question")}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              basic
              color="red"
              inverted
              onClick={this.closeInactiveModal}
            >
              <Icon name="remove" />{" "}
              {t("forum.myFeed.modalInactivate.buttonNo")}
            </Button>
            <Button color="green" inverted onClick={this.onClickInactivePost}>
              <Icon name="checkmark" />{" "}
              {t("forum.myFeed.modalInactivate.buttonYes")}
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    ) : (
      <Message
        floating
        content={
          username === ""
            ? t("forum.myFeed.notAuth")
            : t("forum.myFeed.notPosts")
        }
      />
    );
  }
}

export default translate(MyFeed);
