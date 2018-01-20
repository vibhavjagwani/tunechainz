import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';


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
      songs:[]
    }
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className="Navigation">
      <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">TuneChainz</a>
            <div style = {{float:'right', paddingRight: '50px'}}>
            <Button inverted color ='red'>Sign up</Button>
            <Button color = 'red'>Log in</Button>
          </div>
        </nav>
        </div>
    );
  }
}

export default Navigation;