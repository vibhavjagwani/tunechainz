import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import Audio from 'react-audioplayer';
import Navigation from './Navigation'
import { base } from '../base' 
import {app, googleProvider} from '../base'
import axios from 'axios'
import Song from '../../build/contracts/Song.json'
import getWeb3 from '../utils/getWeb3'
import Upload from './Upload'
import {browserHistory} from 'react-router';
import AlertContainer from 'react-alert';

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
      email: "",
      uploadedFileCloudinaryUrl: '',
      songs:[]
    }

    this.handleTerm = this.handleTerm.bind(this);
    this.showSignInAlert = this.showSignInAlert.bind(this);

  }

  handleTerm(event) {
    if(event.key === 'Enter') {
      if(this.state.name !== "") {
      var term = event.target.value;
       browserHistory.push('/search/' + term);   
     } else {
      this.showSignInAlert();
     }
    } 
  }

  componentWillMount() {

    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setState({
          name: user.displayName,
          email: user.email
        });
        axios({method: 'get', 
          url: 'http://localhost:3001/api/getSongs', 
          params: {email: user.email}
        })
        .then((response)=> {
        });
      } else {
        this.setState({
          name: ""
        });
      }
    });
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.addSong();
    })
    .catch(() => {
      console.log('Error finding web3.')
    }) 
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
        const contract = require('truffle-contract')
        const song = contract(Song)
        song.setProvider(this.state.web3.currentProvider)

        this.state.web3.eth.getAccounts((error, accounts)=> {
          var songInstance;

          song.new({from: accounts[0], gas: 500000}).then((instance) => {
            songInstance = instance;
            this.state.numSongs+=1;
            var arr = this.state.songs;
            arr.push(instance.address);
            return this.setState({songs: arr});
          }).then((result) => {
            var address = songInstance.address;
            axios.post('http://localhost:3001/api/addSong', {
              artist: this.state.email, 
              title: 'lol',
              address: address,
              url: response.body.secure_url,
              imageURL: 'http://www.billboard.com/files/styles/900_wide/public/media/Pink-Floyd-Dark-Side-of-the-Moon-2017-billboard-1240.jpg',
              timesPlayed: 0
            })
          })
        })
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url,
          songs:[ {name:"haha", img: 'http://www.billboard.com/files/styles/900_wide/public/media/Pink-Floyd-Dark-Side-of-the-Moon-2017-billboard-1240.jpg', src: response.body.secure_url }]
        });
      }
    });
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
      <div className="Home">
      <Navigation> </Navigation>
        <div className="container" style = {{backgroundImage:'url(/images/background2.jpeg)'}}>
        <div className="homeContent">
          <h1 style = {{fontSize:'100px', color:'white', marginBottom: '150px'}}>TuneChainz</h1>
        </div>
        </div>
        <div style = {{width: '80%', paddingLeft:'25%', marginTop:'30px', textAlign:'center'}}>
          <Input fluid icon={<Icon name='search' inverted circular link />} size = 'huge' placeholder='Search...' onKeyPress={this.handleTerm.bind(this)}/>
          <Divider horizontal>Or</Divider>
          <h1>Upload here</h1>
        </div>
          <div className = 'centerThings'> 
          <Upload/>
    </div>
    <AlertContainer ref={a => this.msg = a} />
    </div>
    );
  }
}

export default Home;