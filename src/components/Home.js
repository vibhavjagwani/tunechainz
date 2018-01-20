import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import request from 'superagent';


import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import '../index.css'

const CLOUDINARY_UPLOAD_PRESET = 'twochains';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/tunechainz/video/upload';



class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      songinfo: {},
      uploadedFileCloudinaryUrl: ''
    }
  }

  componentWillMount() {

  }

  onImageDrop(files) {
    this.setState({uploadedFile: files[0]});
    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);
    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

    if (response.body.secure_url !== '') {
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }

  render() {
    return (
      <div className="Home">
        <div className="container" style = {{backgroundImage:'url(/images/background1.jpeg)'}}>
        <div className="homeContent">
          <h1 style = {{fontSize:'100px', color:'white', marginBottom: '150px'}}>TuneChainz</h1>
        </div>
        </div>
        <div style = {{width: '80%', paddingLeft:'25%', marginTop:'30px', textAlign:'center'}}>
          <Input fluid icon={<Icon name='search' inverted circular link />} size = 'huge' placeholder='Search...' />
          <Divider horizontal>Or</Divider>
          <h1>Upload here</h1>
        </div>
          <p> {this.state.uploadedFileCloudinaryUrl === '' ? <Dropzone multiple={false} accept="video/*" 
          onDrop={this.onImageDrop.bind(this)}><p>Drop an image or click to select a file to upload.</p>
        </Dropzone> : 
    <div> <p>{this.state.uploadedFile.name}</p>
    </div>}
    </p></div>
    );
  }
}

export default Home;