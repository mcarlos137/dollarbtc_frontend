import React, { Component } from "react";
import {
  Feed,
  Icon,
  Label,
  Button,
  Dropdown,
  Segment,
  Message,
  Image,
  Menu
} from "semantic-ui-react";
import avatarNull from "../../../img/icnperfil.png";
import "./ListPosts.css";
import user from "../../../services/user";
import translate from "../../../i18n/translate";
import Replies from "../Replies/Replies";
import { isMobile } from "react-device-detect";
class ListPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      value: "",
      editPost: {},
      title: "",
      body: "",
      onClickEdit: this.props.onClickEdit,
      onClickDelete: this.props.onClickDelete,
      onClickInactive: this.props.onClickInactive,
      handleNewComments: this.props.handleNewComments,
      translator: props.translate
    };
    this.handleOnClickPost = this.handleOnClickPost.bind(this);
    this.handleAddComments = this.handleAddComments.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }

  handleOnClickPost = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  showEditModal = post => {
    this.setState({
      editPost: post
    });
    this.state.onClickEdit(post);
  };

  showDeleteModal = post => {
    this.setState({
      openDeleteModal: true
    });
    this.state.onClickDelete(post);
  };

  showInactiveModal = post => {
    this.setState({
      openInactiveModal: true
    });
    this.state.onClickInactive(post);
  };

  handleOptionsPost = (e, { value, post }) => {
    switch (value) {
      case "edit":
        this.showEditModal(post);
        break;
      case "delete":
        this.showDeleteModal(post);
        break;
      case "hide":
        this.showInactiveModal(post);
        break;
    }
  };

  handleAddComments = (id, post) => {
    this.state.handleNewComments(id, post);
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
    const { posts, isFromUser, onClickLike } = this.props;
    const getOptions = active => {
      return [
        {
          key: "edit",
          icon: "edit",
          text: t("forum.feed.editPost"),
          value: "edit",
          disabled: !active
        },
        {
          key: "delete",
          icon: "delete",
          text: t("forum.feed.deletePost"),
          value: "delete",
          disabled: false
        },
        {
          key: "hide",
          icon: "hide",
          text: t("forum.feed.closePost"),
          value: "hide",
          disabled: !active
        }
      ];
    };

    return posts.length === 0 ? (
      <Message floating content={t("forum.feed.emptyFeed")} />
    ) : (
      <Feed>
        {posts.map(post => (
          <Feed.Event
            key={post.id}
            id={post.date}
            style={
              isMobile
                ? {
                    backgroundColor: "#EFEFEF",
                    marginBottom: 15,
                    padding: 10
                  }
                : {}
            }
          >
            <Feed.Label
              image={post.user.image ? post.user.image : avatarNull}
            />
            <Feed.Content>
              <Feed.Summary>
                <span>
                  <strong style={{ color: "#207ef2" }}>
                    {post.user.split("__").length === 3
                      ? post.user.split("__")[1] +
                        " " +
                        post.user.split("__")[2]
                      : post.user.split("__").length === 2
                      ? post.user.split("__")[1]
                      : post.user.split("@")[0]}
                  </strong>
                </span>
                <Feed.Date>{this.formatDate(new Date(post.date))}</Feed.Date>
                <Label size="mini" key={post.category.id}>
                  {post.category.name}
                </Label>
                <Label size="tiny">
                  <Icon name="comments" />
                  {post.comments.length}
                </Label>
                {isFromUser && (
                  <Menu compact size="mini" floated="right">
                    <Dropdown
                      simple
                      item
                      text={t("forum.feed.options")}
                      post={post}
                      onChange={this.handleOptionsPost}
                      options={getOptions(post.active)}
                    />
                  </Menu>
                )}
              </Feed.Summary>
              <Feed.Extra text onClick={this.handleOnClickPost}>
                <a
                  className="title-url"
                  onClick={() => (post.showDetails = !post.showDetails)}
                >
                  <strong>{post.title}</strong>
                </a>
              </Feed.Extra>
              {post.showDetails && (
                <Segment>
                  <Feed.Extra>
                    <p>{post.body}</p>
                  </Feed.Extra>
                  <br />
                  <Replies
                    comments={post.comments}
                    postOwner={post}
                    handleNewCommentsInPost={this.handleAddComments}
                  />
                </Segment>
              )}
              {post.extras && (
                <Feed.Extra images>
                  {post.extras.map(extra => (
                    <a key={extra}>
                      <Image size="mini" src={extra} />
                    </a>
                  ))}
                </Feed.Extra>
              )}
              <Feed.Meta>
                <Feed.Like
                  as={function() {
                    return !user.getUserAuth() ? (
                      <Label
                        content={post.likes.count}
                        icon="thumbs up"
                        basic={isMobile}
                        color="blue"
                      />
                    ) : (
                      <Button
                        as="div"
                        labelPosition="right"
                        size="mini"
                        id={post.id}
                        onClick={onClickLike.bind(this)}
                      >
                        <Button basic color="blue" size="mini">
                          <Icon
                            name="thumbs up"
                            basic={isMobile}
                            color="blue"
                          />
                        </Button>
                        <Label basic color="blue" pointing="left">
                          {post.likes.count}
                        </Label>
                      </Button>
                    );
                  }}
                />
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        ))}
      </Feed>
    );
  }
}

export default translate(ListPosts);
