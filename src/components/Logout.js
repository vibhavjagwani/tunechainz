import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import { base } from '../base' 
import {app, googleProvider} from '../base'
import {browserHistory} from 'react-router'



import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import '../index.css'



class Logout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      email: ""
    }
    this.authWithGoogle = this.authWithGoogle.bind(this);
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log(user)
        this.setState({
          name: user.displayName,
          email: user.email
        });
      } else {
        this.setState({
          name: "",
          email: ""
        });
        //browserHistory.push('/');
      }
    });


  }

  authWithGoogle() {
    app.auth().signOut().then((user) => {
      this.setState({
        name: ""
      })
    })
    .catch((error) => {
      console.log('error' + error);
    })
  }



  render() {
    var white_text = {
      color: 'white'
    }
    return (
      <div className="Login">
        <a style={white_text} href={"profile/"+this.state.email}>Welcome {this.state.name} </a>
        <button className="ui negative inverted basic button" onClick={() => {this.authWithGoogle() }}>Logout</button>
      </div>
    );
  }
}

export default Logout;