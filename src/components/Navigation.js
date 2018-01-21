import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import Login  from './Login'
import Logout from './Logout'
import { base } from '../base' 
import {app, googleProvider} from '../base'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import '../index.css'

const CLOUDINARY_UPLOAD_PRESET = 'twochains';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/tunechainz/video/upload';



class Navigation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      songinfo: {},
      uploadedFileCloudinaryUrl: '',
      songs:[],
      loggedIn: false,
    }
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({
          loggedIn: true
        });
      } else {
        this.setState({
          loggedIn: false,
        });
        //browserHistory.push('/');
      }
    }); 
  }

  render() {
    return (
      <div className="Navigation">
      <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="/" className="pure-menu-heading pure-menu-link">TuneChainz</a>
            <div style = {{float:'right', paddingRight: '50px'}}>
          {this.state.loggedIn? <Logout></Logout>:<Login></Login>}
          </div>
        </nav>
        </div>
    );
  }
}

export default Navigation;