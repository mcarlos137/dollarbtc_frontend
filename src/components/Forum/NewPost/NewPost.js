import React, { Component } from "react";
import {
  Form,
  Button,
  Dropdown,
  Header,
  Message,
  Grid
} from "semantic-ui-react";
import Files from "react-files";
import user from "../../../services/user";
import id from "../../../img/no-image-box.png";
import translate from "../../../i18n/translate";
import { isMobile } from "react-device-detect";
class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      file: {},
      title: "",
      body: "",
      category: {},
      loadingPosting: false,
      postImg: id,
      addFilePost: true,
      errorFile: false,
      onLoading: false,
      translator: props.translate
    };
    this.attachRef = React.createRef();
    this.handleClickShowForm = this.handleClickShowForm.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeImg = this.onChangeImg.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }

  handleClickShowForm = () => {
    this.setState(() => ({
      showForm: !this.state.showForm
    }));
  };

  onBlur = event => {
    if (event.target.value.length === 0) {
      this.setState(() => ({
        showForm: false
      }));
    }
  };

  onChangeImg = file => {
    if (file !== undefined && file.length !== 0) {
      var object = {
        img: file[0].preview.url,
        name: file[0].name,
        type: file[0].type,
        extension: file[0].extension,
        key: "postAttach",
        file: file[0]
      };
      this.setState({
        postImg: file[0].preview.url,
        file: object,
        addFilePost: false
      });
    }
  };

  onErrorFile() {
    this.setState({ errorFile: true });
    setTimeout(() => {
      this.setState({ errorFile: false });
    }, 3000);
  }

  handleTitle = e => {
    this.setState({
      title: e.target.value
    });
  };

  handleContent = e => {
    this.setState({
      body: e.target.value
    });
  };

  handleCategory = (e, data) => {
    this.setState({
      category: data.value
    });
  };

  clearFields = () => {
    this.attachRef.current.removeFiles();
    this.setState({
      title: "",
      body: "",
      category: {},
      files: [],
      showForm: false,
      postImg: "",
      addFilePost: true,
      file: {}
    });
  };
  onRemoveFile(e, data) {
    if (data.id === "file-post") {
      this.attachRef.current.removeFiles();
      this.setState({
        postImg: id,
        file: {},
        addFilePost: true
      });
    }
  }

  prepareFile() {
    if (this.state.file.file !== undefined) {
      let formData = new FormData();
      formData.append("attachment", this.state.file.file, this.state.file.name);
      return formData;
    }
    return null;
  }
  render() {
    let t = this.state.translator;
    const { categories, onClickSaveNewPost } = this.props;
    const handleNewPost = () => {
      var post = {
        title: this.state.title,
        body: this.state.body,
        category: this.state.category,
        extras: [],
        active: true,
        likes: { count: 0, users: [] },
        date: new Date(),
        user: user.getUserName()
      };
      ////console.log(post);
      this.clearFields();
      onClickSaveNewPost(post, this.prepareFile());
      this.handleClickShowForm();
    };
    return (
      <div>
        {!this.state.showForm && (
          <Button
            basic
            color="blue"
            fluid
            onClick={this.handleClickShowForm}
            style={{ marginTop: "10px", borderRadius: isMobile ? 40 : 0 }}
          >
            {t("forum.newPost.writeAPost")}
          </Button>
        )}
        {this.state.showForm && (
          <Form error unstackable onSubmit={handleNewPost}>
            <Form.Field>
              <input
                id="input-title"
                placeholder={t("forum.newPost.placeholderTitle")}
                name="inputTitle"
                autoFocus
                onBlur={this.onBlur.bind(this)}
                value={this.state.title}
                onChange={this.handleTitle}
                required
              />
            </Form.Field>
            <Form.Field>
              <textarea
                id="input-body"
                placeholder={t("forum.newPost.placeholderContent")}
                required
                value={this.state.body}
                onChange={this.handleContent}
              />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Field>
                <Dropdown
                  fluid
                  selection
                  options={categories}
                  placeholder={t("forum.newPost.placeholderCategory")}
                  onChange={this.handleCategory}
                  required
                  width={10}
                />
              </Form.Field>
              <Form.Field>
                <Files
                  className="files-dropzone"
                  ref={this.attachRef}
                  onChange={this.onChangeImg.bind(this)}
                  onError={this.onErrorFile.bind(this)}
                  accepts={["image/*"]}
                  multiple={false}
                  maxFiles={1}
                  id="attachment"
                  maxFileSize={500000}
                  minFileSize={0}
                  clickable={this.state.addFilePost}
                >
                  <Header textAlign="center">
                    <img
                      alt=""
                      src={this.state.postImg}
                      style={{
                        width: "100px",
                        border: "2px",
                        borderStyle: "dashed",
                        borderColor: "darkgrey"
                      }}
                    />
                    <p style={{ fontSize: "11px" }}>{this.state.file.name}</p>
                  </Header>
                </Files>
                <Header as="h6" textAlign="center" style={{ marginTop: "1px" }}>
                  {t("forum.newPost.attachment")}
                </Header>
                {!this.state.addFilePost && (
                  <Grid>
                    <Grid.Column textAlign="center">
                      <Button
                        color="blue"
                        size="tiny"
                        id="file-post"
                        onClick={this.onRemoveFile.bind(this)}
                        textAlign="center"
                      >
                        {t("forum.newPost.buttonChangeAttachment")}
                      </Button>
                    </Grid.Column>
                  </Grid>
                )}
                {this.state.errorFile && (
                  <Message
                    error
                    content={t("forum.errors.notSupportFileError")}
                  />
                )}
                <br />
              </Form.Field>
              <Form.Field
                id="button-control-post"
                control={Button}
                content={t("forum.newPost.buttonPost")}
                color="blue"
              />
            </Form.Group>
          </Form>
        )}
      </div>
    );
  }
}

export default translate(NewPost);
