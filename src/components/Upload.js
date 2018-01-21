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
import Song from '../../build/contracts/Song.json'
import getWeb3 from '../utils/getWeb3'

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
      web3: null,
      modal: false,
      address: ""
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showSignInAlert = this.showSignInAlert.bind(this);
    this.submit = this.submit.bind(this);
    this.secondsubmit = this.secondsubmit.bind(this);
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({
          name: user.displayName,
          email:user.email
        });
      } else {
        this.setState({
          name: "",
          email:""
        });
        //browserHistory.push('/');
      }
    });
    getWeb3
    .then(results => {
      results.web3.eth.getBlock(1, function(err, res) {

      });

      var filter = results.web3.eth.filter('latest', function(err, blockHash) {
        if(!err) {
          var block = results.web3.eth.getBlock(blockHash, true);
          console.log(JSON.stringify(block.transactions));
        }
        console.log('ALKSJDASKDJKLSA;D');
      });
      this.setState({
        web3: results.web3
    })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  onImage(files) {
    this.setState({uploadedImage: files[0]});
    this.handleImage(files[0]);
    var filter2 = this.state.web3.eth.filter('latest', function(err, log) {
      console.log('FUCKIN YO');
    });
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
    this.state.web3.eth.filter('latest').watch(function(err, logs) {
      console.log('WOIASJ;SADJ');
      this.setState({modal: false});
    });
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
    const contract = require('truffle-contract')
    const song = contract(Song)
    song.setProvider(this.state.web3.currentProvider)
    this.state.web3.eth.getAccounts((error, accounts)=> {
      if(error) {
        console.log(error);
      }
      var songInstance;
      song.new({from: accounts[0], gas: 500000}).then((instance) => {
      });
    });
  }

  // submit() {

  //   const contract = require('truffle-contract')
  //   const song = contract(Song)
  //   song.setProvider(this.state.web3.currentProvider)
  //   this.state.web3.eth.getAccounts((error, accounts)=> {
  //     if(error) {
  //       console.log(error);
  //     }
  //     var songInstance;

  //     song.new({from: accounts[0], gas: 500000}).then((instance) => {
  //       songInstance = instance;
  //       var address = songInstance.address;
  //       axios.post('http://localhost:3001/api/addSong', {
  //         artist: this.state.name,
  //         email: this.state.email, 
  //         title: this.state.title,
  //         address: address,
  //         url: this.state.uploadedFileCloudinaryUrl,
  //         imageURL: this.state.uploadedImageUrl,
  //         timesPlayed: 0,
  //       }).then((response)=>{

  //       });
  //     }).then(() => {
  //       this.closeModal();
  //     })
  //     }) 
  // }

  showSignInAlert() {
    this.msg.show('Please log in or sign up first', {
      time: 10000,
      type: 'info',
      transition: 'scale'
    })

  }

  secondsubmit(){
    axios.post('http://localhost:3001/api/addSong', {
      artist: this.state.name,
      email: this.state.email, 
      title: this.state.title,
      address: this.state.address,
      url: this.state.uploadedFileCloudinaryUrl,
      imageURL: this.state.uploadedImageUrl,
      timesPlayed: 0,
    }).then((response)=>{
      this.closeModal();
      }).then(() => {
        this.closeModal();
      });
      this.closeModal();
  }

  handleContractChange(event) {
    event.preventDefault();
    this.setState({address: event.target.value});
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
        {this.state.uploadedImageUrl === '' ?<div> <Dropzone accept="image/*" onDrop={this.onImage.bind(this)}>
          <p>Drop an image or click to select a file to upload.</p>
        </Dropzone> </div> :<div>
        <Button onClick = {this.submit}>Generate Contract and enter below</Button><input placeholder = "Contract address" onChange = {this.handleContractChange.bind(this)}/></div>}
        {this.state.address === '' ? <div></div> : <Button onClick = {this.secondsubmit}>Submit</Button> }
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