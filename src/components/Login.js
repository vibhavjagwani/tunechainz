import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import { base } from '../base' 
import {app, googleProvider} from '../base'



import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import '../index.css'



class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
    this.authWithGoogle = this.authWithGoogle.bind(this);
  }

  componentWillMount() {

  }

  authWithGoogle() {
    console.log('auth with google');
    app.auth().signInWithPopup(googleProvider)
    .then((result) => {
      console.log(result.user);
      this.props.updateName;
        //browserHistory.push('/entries');
    })
    .catch((error) => {
      console.log('error' + error);
      this.setState({error: true});
    })
  }


  render() {
    return (
      <div className="Login">
        <button className="ui positive basic button" onClick={() => {this.authWithGoogle() }}>Login</button>
      </div>
    );
  }
}

export default Login;