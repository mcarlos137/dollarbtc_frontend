import React, { Component } from "react";
import {
  Grid,
  Menu,
  Segment,
  Message,
  Responsive,
  Divider,
  Header,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import forumAPI from "../../services/forum.js";
import ListPosts from "./Posts/ListPosts";
import MyFeed from "./MyFeed/MyFeed";
import "./Forum.css";
import NewPost from "./NewPost/NewPost";
import user from "../../services/user";
import translate from "../../i18n/translate";
import ForumMenuVertical from "./ForumMenuVertical/ForumMenuVertical";
import ForumMenuHorizontal from "./ForumMenuHorizontal/ForumMenuHorizontal";
import { isMobile } from "react-device-detect";
class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "all",
      categoryItem: "",
      categories: [],
      posts: [],
      comments: [],
      query: "",
      isAuth: user.getUserAuth(),
      username: user.getUserName() !== null ? user.getUserName() : "",
      errorPosting: false,
      successPosting: false,
      errorPostingMessage: "",
      successPostinMessage: "",
      showingPost: [],
      myPosts: [],
      colorIcon: "gray",
      positionMenuVertical: true,
      miniMenu: false,
      translator: props.translate,
    };
    this.onLoadCateogries = this.onLoadCateogries.bind(this);
    this.onLoadPosts = this.onLoadPosts.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
    this.updateCommentsByPost = this.updateCommentsByPost.bind(this);
    this.onClickSavePost = this.onClickSavePost.bind(this);
    this.onClickLikeButton = this.onClickLikeButton.bind(this);
    this.updateCommentsInPost = this.updateCommentsInPost.bind(this);
    this.updatePostsSearching = this.updatePostsSearching.bind(this);
    this.handleChangeScreen = this.handleChangeScreen.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentDidMount() {
    this.onLoadCateogries();
    this.onLoadPosts();
    if (window.innerWidth <= 768) {
      this.setState({
        positionMenuVertical: false,
        activeItem: this.state.activeItem,
      });
    } else {
      this.setState({
        positionMenuVertical: true,
        activeItem: this.state.activeItem,
      });
    }
    if (window.innerWidth < 768) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  onLoadCateogries = () => {
    forumAPI
      .getCategories()
      .then((res) => {
        if (res.length !== 0) {
          var aux = res.data.payload;
          aux.forEach((cat) => {
            cat.text = cat.name;
            cat.value = cat.key;
          });
          this.setState(() => ({
            categories: aux,
          }));
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  onLoadPosts = () => {
    forumAPI
      .getPosts()
      .then((res) => {
        if (res.length !== 0) {
          let aux = res.data.payload;
          this.setState(() => ({
            posts: aux.sort((a, b) => {
              return Date.parse(a.date) < Date.parse(b.date) ? 1 : -1;
            }),
          }));
        }
      })
      .then(this.updateCommentsByPost(this.state.posts))
      .catch((error) => {
        //console.log(error);
      });
  };

  handleItemClick = (e, { name }) => {
    this.setState({
      activeItem: name,
    });
  };
  handleCategoryClick = (e, { name }) => {
    this.setState({
      categoryItem: name,
    });
  };

  updateCommentsByPost = (posts) => {
    posts.forEach((post) => {
      post.comments = post.comments.sort((a, b) => {
        return Date.parse(a.date) > Date.parse(b.date) ? 1 : -1;
      });
      post.showDetails = false;
    });
    this.setState({
      posts,
    });
  };
  onClickSavePost = (post, attach) => {
    post.category = this.state.categories.filter(
      (c) => post.category === c.key
    )[0];
    if (post.category === undefined || post.category === null) {
      //post.category = this.state.categories.filter(c=>c.key === "general_discussion")[0];
      this.setState({
        errorPosting: true,
        errorPostingMessage: "forum.errors.emptyCategory",
      });
      setTimeout(() => {
        this.setState({ errorPosting: false });
      }, 3000);
    } else {
      if (attach === undefined || attach === null) {
        forumAPI
          .createPost(post)
          .then((res) => {
            ////console.log(res);
            this.setState({
              successPosting: true,
              successPostingMessage: "forum.successPosting",
            });
            setTimeout(() => {
              this.setState({ successPosting: false });
            }, 5000);
            this.onLoadPosts();
          })
          .catch((error) => {
            //console.log(error);
            this.setState({
              errorPosting: true,
              errorPostingMessage: "forum.errors.postingError",
            });
          });
      } else {
        forumAPI.uploadFile(attach).then((resp) => {
          post.extras.push(resp.data);
          forumAPI
            .createPost(post)
            .then((res) => {
              ////console.log(res);
              this.setState({
                successPosting: true,
                successPostingMessage: "forum.successPosting",
              });
              setTimeout(() => {
                this.setState({ successPosting: false });
              }, 5000);
              this.onLoadPosts();
            })
            .catch((error) => {
              //console.log(error);
              this.setState({
                errorPosting: true,
                errorPostingMessage: "forum.errors.postingError",
              });
            });
        });
      }
    }
  };

  onClickLikeButton = (e, data) => {
    var likeRequest = {
      id: data.id,
      username: user.getUserName(),
    };
    forumAPI
      .likePost(likeRequest)
      .then((res) => {
        this.onLoadPosts();
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  updateCommentsInPost = (id, comments) => {
    var allPosts = this.state.posts;
    let post = allPosts.find((p) => {
      return p.id === id;
    });
    if (post !== null || post !== undefined) {
      let index = allPosts.indexOf(post);
      if (index !== -1) {
        allPosts[index].comments = comments;
        this.setState({
          posts: allPosts,
        });
      }
    }
  };

  updatePostsSearching = (posts) => {
    this.setState({
      posts: posts,
    });
  };

  handleChangeScreen(e, data) {
    if (data.width <= 768) {
      this.setState({
        positionMenuVertical: false,
        activeItem: this.state.activeItem,
      });
    } else {
      this.setState({
        positionMenuVertical: true,
        activeItem: this.state.activeItem,
      });
    }
    if (data.width < 768) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  render() {
    let t = this.state.translator;
    const activeItem = this.state.activeItem;
    const showingPost =
      this.state.categoryItem === ""
        ? this.state.posts.filter((post) => post.active)
        : this.state.posts.filter(
            (post) =>
              post.category.key === this.state.categoryItem && post.active
          );
    const myPosts =
      this.state.categoryItem === ""
        ? this.state.posts.filter(
            (post) => post.user.split("__")[0] === this.state.username
          )
        : this.state.posts.filter(
            (post) =>
              post.category.key === this.state.categoryItem &&
              post.user.split("__")[0] === this.state.username
          );
    let errorPosting, successPosting;
    if (this.state.errorPosting) {
      errorPosting = (
        <Message error content={t(this.state.errorPostingMessage)} />
      );
    }
    if (this.state.successPosting) {
      successPosting = (
        <Message success content={t(this.state.successPostingMessage)} />
      );
    }
    return (
      <Grid>
        <Grid.Column largeScreen={12} mobile={16} tablet={12} computer={12}>
          <Responsive {...Responsive.onlyMobile}>
            <Menu
              pointing
              secondary={isMobile}
              size={isMobile === true ? "huge" : ""}
              widths={isMobile ? 2 : 3}
              style={
                isMobile
                  ? { borderColor: "white", marginLeft: 20, marginTop: 20 }
                  : { marginTop: 20 }
              }
            >
              <Menu.Item
                name="myfeed"
                content={t("forum.menu.feed")}
                active={this.state.activeItem === "myfeed"}
                onClick={this.handleItemClick}
                style={
                  activeItem === "myfeed" && isMobile
                    ? {
                        color: "#207ef2",
                        fontWeight: "bold",
                        borderColor: "#207ef2",
                      }
                    : {
                        color: isMobile ? "#207ef2" : "black",
                        fontWeight: "bold",
                        borderColor: "white",
                      }
                }
              />
              <Menu.Item
                name="all"
                id="all"
                content={t("forum.menu.all")}
                active={this.state.activeItem === "all"}
                onClick={this.handleItemClick}
                style={
                  activeItem === "all" && isMobile
                    ? {
                        color: "#207ef2",
                        fontWeight: "bold",
                        borderColor: "#207ef2",
                      }
                    : {
                        color: isMobile ? "#207ef2" : "black",
                        fontWeight: "bold",
                        borderColor: "white",
                      }
                }
              />
              {!isMobile && (
                <Menu.Item
                  name="categories"
                  active={this.state.activeItem === "categories"}
                  onClick={this.handleItemClick.bind(this)}
                  style={
                    this.state.activeItem === "categories" && isMobile
                      ? {
                          backgroundColor: "#207ef2",
                          color: "white",
                          fontWeight: "bold",
                        }
                      : {
                          color: isMobile ? "white" : "",
                          backgroundColor: isMobile ? "#1667BF" : "",
                        }
                  }
                >
                  <ForumMenuVertical
                    onclickcategory={this.handleCategoryClick.bind(this)}
                    categories={this.state.categories}
                    activecategoryitem={this.state.categoryItem}
                    posts={showingPost}
                    updatesearchingdata={this.updatePostsSearching.bind(this)}
                  />
                </Menu.Item>
              )}
            </Menu>
          </Responsive>
          <Responsive onUpdate={this.handleChangeScreen.bind(this)}>
            {this.state.positionMenuVertical && (
              <ForumMenuHorizontal
                onClickItem={this.handleItemClick}
                activeItem={this.state.activeItem}
              />
            )}
          </Responsive>
          <Divider hidden />
          <Grid.Row>
            {isMobile && (
              <ForumMenuVertical
                onclickcategory={this.handleCategoryClick.bind(this)}
                categories={this.state.categories}
                activecategoryitem={this.state.categoryItem}
                posts={showingPost}
                updatesearchingdata={this.updatePostsSearching.bind(this)}
              />
            )}
          </Grid.Row>
          {this.state.isAuth && (
            <Grid.Row>
              <NewPost
                categories={this.state.categories}
                onClickSaveNewPost={this.onClickSavePost}
              />
              {successPosting}
              {errorPosting}
            </Grid.Row>
          )}
          {!this.state.isAuth && (
            <Segment textAlign="center" style={{ marginBottom: "0px" }}>
              <strong>
                {t("forum.notAuth.please")}
                <Link to="/login">{t("forum.notAuth.login")}</Link>{" "}
                {t("forum.notAuth.or")}
                <Link to="/registration">{t("forum.notAuth.signup")}</Link>{" "}
                {t("forum.notAuth.end")}
              </strong>
            </Segment>
          )}
          <br />
          <Grid.Row>
            {!isMobile && (
              <Segment color={!isMobile ? "orange" : ""}>
                {activeItem === "all" && (
                  <ListPosts
                    posts={showingPost}
                    onClickLike={this.onClickLikeButton}
                    categories={this.state.categories}
                    handleNewComments={this.updateCommentsInPost}
                  />
                )}
                {activeItem === "myfeed" && (
                  <MyFeed
                    posts={myPosts}
                    username={this.state.username}
                    categories={this.state.categories}
                    onClickLike={this.onClickLikeButton}
                    categoryItem={this.state.categoryItem}
                    handleComments={this.updateCommentsInPost}
                  />
                )}
                {activeItem === "categories" && (
                  <ListPosts
                    posts={showingPost}
                    onClickLike={this.onClickLikeButton}
                    categories={this.state.categories}
                    handleNewComments={this.updateCommentsInPost}
                  />
                )}
              </Segment>
            )}
            {isMobile && (
              <div>
                {activeItem === "all" && (
                  <ListPosts
                    posts={showingPost}
                    onClickLike={this.onClickLikeButton}
                    categories={this.state.categories}
                    handleNewComments={this.updateCommentsInPost}
                  />
                )}
                {activeItem === "myfeed" && (
                  <MyFeed
                    posts={myPosts}
                    username={this.state.username}
                    categories={this.state.categories}
                    onClickLike={this.onClickLikeButton}
                    categoryItem={this.state.categoryItem}
                    handleComments={this.updateCommentsInPost}
                  />
                )}
                {activeItem === "categories" && (
                  <ListPosts
                    posts={showingPost}
                    onClickLike={this.onClickLikeButton}
                    categories={this.state.categories}
                    handleNewComments={this.updateCommentsInPost}
                  />
                )}
              </div>
            )}
          </Grid.Row>
        </Grid.Column>
        {!this.state.miniMenu && (
          <Grid.Column width={4}>
            <ForumMenuVertical
              onclickcategory={this.handleCategoryClick.bind(this)}
              categories={this.state.categories}
              activecategoryitem={this.state.categoryItem}
              posts={showingPost}
              updatesearchingdata={this.updatePostsSearching.bind(this)}
            />
          </Grid.Column>
        )}
      </Grid>
    );
  }
}
export default translate(Forum);
