class Form extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.title}
        <p>Current Action: /{this.props.action}</p>
        <form
          method="POST"
          action={"http://localhost:3000/" + this.props.action}
        >
          <label>Username: </label>
          <input type="text" name="name"></input>
          <label>Password: </label>
          <input type="password" name="password"></input>
          <input type="submit"></input>
          {this.props.change_button}
        </form>
      </React.Fragment>
    );
  }
}

class BucketForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Welcome {this.props.username}</h1>
        <form>
          <label>Bucket name: </label>
          <input type="text" name="bucketname"></input>
          <label> Bucket content: </label>
          <input type="text" name="bucketdata"></input>
          <button
            type="submit"
            formaction={"http://localhost:3000/submit-bucket"}
            value="Submit"
            formMethod="post"
          >Submit</button>
          <button
            type="submit"
            value="Logout"
            formaction={"http://localhost:3000/logout"}
            formMethod="post"
          >Logout</button>
        </form>
      </React.Fragment>
    );
  }
}

class App extends React.Component {
  state = { view: true };
  handleClick = () => {
    this.setState(() => ({
      view: !this.state.view,
    }));
  };
  render() {
    return document.cookie.length === 0 ? (
      <div>
        <Form
          action={this.state.view ? "register-user" : "login-user"}
          title={<h1>{this.state.view ? "RegisterPage" : "LoginPage"}</h1>}
          change_button={
            <a href="#" onClick={this.handleClick}>
              Go to {this.state.view ? "Login" : "Signup"} Page
            </a>
          }
        ></Form>
      </div>
    ) : (
      <BucketForm username={document.cookie.split("=")[1]}></BucketForm>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
