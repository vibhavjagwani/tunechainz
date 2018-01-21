import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import {app} from '../base';
import Audio from 'react-audioplayer';
import Navigation from './Navigation'
import axios from 'axios';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import '../index.css'

const CLOUDINARY_UPLOAD_PRESET = 'twochains';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/tunechainz/video/upload';


class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      songinfo: {},
      uploadedFileCloudinaryUrl: '',
      songs:[]
    }
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
    axios({method: 'get', 
          url: 'http://localhost:3001/api/getSongs', 
          params: {email: this.props.params.prof}
        })
    .then((response)=> {
          console.log(response);
          console.log('SOMETHING');
        });
  }

  render() {
    return (
    <div className="Profile">
      	<Navigation> </Navigation>
        <div className="container">
       		<p>{this.props.params.prof}</p>
    	</div>
    </div>
    );
  }
}

export default Profile;