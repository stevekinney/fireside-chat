import React, { Component } from 'react';
import { render } from 'react-dom';
import firebase, { signIn } from './firebase';

class Application extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  render() {
    return (
      <div>
        <header>
          <h1>Fireside Chat</h1>
        </header>
        { this.state.user ?
            <div className="logged-in">
              <UserInformation user={this.state.user}/>
              <Messages user={this.state.user}/>
            </div>
          :
            <Login onLogin={(user) => { this.setState({ user }); }} />
        }
      </div>
    );
  }
}

const Login = ({ onLogin }) => {
  return (
    <section className="Login">
      <button
        className="UserInformation--signin-button"
        onClick={() => signIn().then(({ user: newUser }) => onLogin(newUser))}
      >
        Sign In
      </button>
    </section>
  );
};

const UserInformation = ({ user }) => {
  return (
    <section className="UserInformation">
      <img src={user.photoURL}/>
      <p>{user.displayName}</p>
      <p>{user.email}</p>
    </section>
  );
};

const Messages = ({ user }) => {
  return (
    <div>
      <h2>Messages</h2>
      <NewMessage user={user}/>
      <MessageList/>
    </div>
  );
};

class MessageList extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    firebase.database().ref('messages').on('value', (snapshot) => {
      this.setState({ messages: snapshot.val() });
    });
  }

  render() {
    const messages = Object.keys(this.state.messages).map(function (key) {
      const { email, message } = this.state.messages[key];
      return <article key={key}>{email} - {message}</article>
    }, this);

    return (
      <div>{messages}</div>
    );
  }
}

class NewMessage extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
  }

  saveMessage() {
    const uid = this.props.user.uid;

    const message = {
      user: uid,
      email: this.props.user.email,
      message: this.state.message,
    };

    const newMessageKey = firebase.database().ref().child('message').push().key;

    var updates = {};
    updates['/messages/' + newMessageKey] = message;
    updates['/user-messages/' + uid + '/' + newMessageKey] = message;

    return firebase.database().ref().update(updates);

    this.setState({
      message: '',
    });
  }

  render() {
    return (
      <section className="NewMessage">
        <h3>New Message</h3>
        <input type="text" value={this.state.message} onChange={(e) => this.setState({ message: e.target.value })}/>
        <input type="submit" onClick={() => this.saveMessage() }/>
      </section>
    );
  }
}

render(<Application/>, document.querySelector('.application'));
