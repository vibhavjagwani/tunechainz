import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import Audio from 'react-audioplayer';
import Navigation from './Navigation'
import { base } from '../base' 
import {app, googleProvider} from '../base'
import axios from 'axios'
import Modal from 'react-modal';
import { Form } from 'semantic-ui-react';
import AlertContainer from 'react-alert';


import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import '../index.css'

const CLOUDINARY_UPLOAD_PRESET = 'twochains';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/tunechainz/video/upload';
const CLOUDINARY_UPLOADIMAGE_URL = 'https://api.cloudinary.com/v1_1/tunechainz/image/upload';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


class Upload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      uploadedFileCloudinaryUrl: '',
      uploadedImageUrl: '',
      songs:[],
      modal: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showSignInAlert = this.showSignInAlert.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log(user)
        this.setState({
          name: user.displayName
        });
      } else {
        this.setState({
          name: ""
        });
        //browserHistory.push('/');
      }
    }); 
  }

  onImage(files) {
    console.log(files[0]);
    this.setState({uploadedImage: files[0]});
    this.handleImage(files[0]);
  }

  handleImage(file) {
    let upload = request.post(CLOUDINARY_UPLOADIMAGE_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

    if (response.body.secure_url !== '') {
        this.setState({
          uploadedImageUrl: response.body.secure_url
        });
      }
    });

  }

  onImageDrop(files) {
    if(this.state.name === '') {
      this.showSignInAlert();
    } else {
    console.log(files[0]);
    this.setState({uploadedFile: files[0]});
    this.handleImageUpload(files[0]);
    this.openModal();
    }
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
          //songs:[ {name:"haha", img: this.state.uploadedImageUrl, src: response.body.secure_url }]
        });
      }
    });
  }

  openModal() {
    this.setState({modal: true});
  }

  closeModal() {
    this.setState({modal: false});
  }

  handleTitle(event) {
    event.preventDefault();
    this.setState({title: event.target.value});
  }

  submit() {
     axios.post('http://localhost:3001/api/addSong', {
          artist: this.state.name, 
          title: this.state.title,
          address: '0x001',
          url: this.state.uploadedFileCloudinaryUrl,
          imageURL: this.state.uploadedImageUrl,
          timesPlayed: 0
        })
     this.closeModal();
  }

  showSignInAlert() {
    this.msg.show('Please log in or sign up first', {
      time: 10000,
      type: 'info',
      transition: 'scale'
    })

  }

  render() {
    return (
      <div className="Upload" style = {{paddingLeft: '300px'}}>
      <Modal
        isOpen={this.state.modal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h1>Upload your song</h1>
      <Form>
        <Form.Field>
          <label>Song name</label>
          <input placeholder='Song name' onChange={this.handleTitle.bind(this)} />
        </Form.Field>
        {this.state.uploadedImageUrl === '' ? <Dropzone accept="image/*" onDrop={this.onImage.bind(this)}>
          <p>Drop an image or click to select a file to upload.</p>
        </Dropzone> : <p>Uploaded</p>}
        <Button onClick = {this.submit}>Submit</Button>
      </Form>
      </Modal>
      {this.state.uploadedFileCloudinaryUrl === '' ? <Dropzone multiple={false} accept="audio/*" 
          onDrop={this.onImageDrop.bind(this)}><p>Drag and drop an mp3 file, or click to browse</p>
        </Dropzone> : <div>
      <Audio width={600}
              height={400}
              autoPlay={false}
              fullPlayer={true}
              playlist={this.state.songs}
            />
            </div>}
    <AlertContainer ref={a => this.msg = a} />
    </div>
    );
  }
  
}

export default Upload;