import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import Audio from 'react-audioplayer';
import Navigation from './Navigation'



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
      uploadedFileCloudinaryUrl: '',
      songs:[]
    }
  }

  componentWillMount() {

  }

  onImageDrop(files) {
    console.log(files[0]);
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
          uploadedFileCloudinaryUrl: response.body.secure_url,
          songs:[ {name:"haha", img: 'http://www.billboard.com/files/styles/900_wide/public/media/Pink-Floyd-Dark-Side-of-the-Moon-2017-billboard-1240.jpg', src: response.body.secure_url }]
        });
      }
      console.log(this.state.songs);
    });
  }

  render() {
    return (
      <div className="Home">
      <Navigation> </Navigation>
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
          <div className = 'centerThings'> {this.state.uploadedFileCloudinaryUrl === '' ? <Dropzone multiple={false} accept="audio/*" 
          onDrop={this.onImageDrop.bind(this)}><p>Drop an image or click to select a file to upload.</p>
        </Dropzone> : 
    <div> <p>{this.state.uploadedFile.name}</p>
    <Audio
      width={600}
      height={400}
      autoPlay={false}
      fullPlayer={true}
      playlist={this.state.songs}
    />
    </div>}
    </div></div>
    );
  }
}

export default Home;