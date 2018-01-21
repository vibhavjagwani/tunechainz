import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import { base } from '../base' 
import {app, googleProvider} from '../base'
import axios from 'axios'

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
    app.auth().signInWithPopup(googleProvider)
    .then((result) => {
      console.log(result.user);
      axios.post('http://localhost:3001/api/user', {
        person: result.user.displayName,
        email: result.user.email
      }).then((response)=> {
        console.log(response);
      })
    })
    .catch((error) => {
      console.log('error' + error);
      this.setState({error: true});
    })
  }


  render() {
    return (
      <div className="Login">
        <button className="ui inverted positive basic button" onClick={() => {this.authWithGoogle() }}>Login</button>
      </div>
    );
  }
}

export default Login;