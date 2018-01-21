import React, { Component } from 'react';
import { Button, Input, Icon, Divider, Grid } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import {app} from '../base';
import Audio from 'react-audioplayer';
import Navigation from './Navigation'
import axios from 'axios';
import Song from '../../build/contracts/Song.json';
import getWeb3 from '../utils/getWeb3';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import '../index.css'

const CLOUDINARY_UPLOAD_PRESET = 'twochains';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/tunechainz/video/upload';


class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      songinfo: {},
      uploadedFileCloudinaryUrl: '',
      results:[],
      ownedSongs:[]
    }

    this.buySong = this.buySong.bind(this);
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
    getWeb3
      .then(results => {
            axios({method: 'get', 
          url: 'http://localhost:3001/api/getSongs', 
          params: {email: this.state.email}
        }).then((response)=> {
          var uploaded = response.data.uploaded;
          var bought = response.data.bought;
          for(var buy in bought) {
            var arr = this.state.ownedSongs;
            arr.push(bought[buy].title);
            this.setState({ownedSongs: arr});
          }
          for(var up in uploaded) {
            var arr = this.state.ownedSongs;
            arr.push(uploaded[up].title);
            this.setState({ownedSongs: arr});
          }
          console.log(response);
          console.log(uploaded);
          console.log(bought);
        });
        
        this.setState({
          web3: results.web3
        })
        //this.addSong();
      })
      .catch(() => {
        console.log('Error finding web3.')
    })
    });
    axios({method: 'get', 
          url: 'http://localhost:3001/api/search', 
          params: {term: this.props.params.q}
        }).then((response)=> {
          this.setState({results: response.data});
        });

  }


  buySong(name) {

    console.log('hey');

    axios({method: 'get', 
          url: 'http://localhost:3001/api/getAddress', 
          params: {title: name}
        }).then((response)=> {
          var address = response.data.address;
          const contract = require('truffle-contract')
          const song = contract(Song)
          song.setProvider(this.state.web3.currentProvider)

          this.state.web3.eth.getAccounts((error, accounts)=> {
            var songInstance = song.at(address);

            songInstance.buySong({from: accounts[0], gas: 500000, value: 1000000000000000}).then((result) => {
              return songInstance.numBuys.call(accounts[0])
            }).then((num) => {
              axios({
                method: 'post',
                url: 'http://localhost:3001/api/buySong',
                params: {email: this.state.email, song: response.data.title}
              })
              console.log(num.c[0]);
            })
          })
        });   
  }

  render() {
  	const ids = Object.keys(this.state.results);
    console.log(this.state.ownedSongs);
    return (
    <div className="Search">
      	<Navigation> </Navigation>
        <div className="container" style = {{textAlign:'center'}}>
        <h1>Search results for {this.props.params.q}</h1>
			{
				ids.map((id)=> {
          var owned = this.state.ownedSongs.includes(this.state.results[id].title);
					return (
						<div style = {{borderBottom: '2px black solid', width:'60%', display: 'inline-block'}}>
				            <img src = {this.state.results[id].imageURL} style = {{height: '70px',width:'80px',float: 'left'}}/>
				            <h3 style = {{float:'left', paddingLeft:'5px', paddingRight:'10px'}}> {this.state.results[id].title}</h3>
				            <h3 style = {{float:'left', paddingRight:'10px'}}> by {this.state.results[id].artist} </h3>
                    {owned? <Button style = {{float:'right'}}>Owned Song</Button> : <Button style = {{float:'right'}} onClick={this.buySong.bind(this, this.state.results[id].title)}>Buy Song</Button>}
            			</div>
					)
				})
			}
    	</div>
    </div>
    );
  }
}

export default Search;