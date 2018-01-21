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
      uploadedFileCloudinaryUrl: '',
      uploadedSongs:[],
      song:[],
      bought:[]
    }
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if(user) {
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
      console.log(response.data.uploaded.length);
      if(response.data.uploaded.length !== 0) {
          this.setState({uploadedSongs: response.data.uploaded,
                        song: [{name: response.data.uploaded[0].title,
                          img: response.data.uploaded[0].imageURL,
                          src: response.data.uploaded[0].url}],
                        bought: response.data.bought});
        } else {
          this.setState({uploadedSongs: response.data.uploaded, 
                          bought: response.data.bought});
        }
        });  
  }

  render() {
    const ids = Object.keys(this.state.uploadedSongs);
    const eds = Object.keys(this.state.bought);
    return (
    <div className="Profile">
      	<Navigation> </Navigation>
        { this.state.email === this.props.params.prof ?
        <div className="container">
          <div>
              {
                ids === []? <div> Upload songs </div> :
                ids.map((id) => {
                  if(id === '0') {
            return (
              <Audio width={1200}
              height={300}
              autoPlay={false}
              fullPlayer={true}
              playlist={this.state.song}
              />
            );}
             })}
            </div>
            <Grid columns={2} relaxed style = {{paddingTop:'30px', paddingLeft:'20px'}}>
            <Grid.Column>
            <h1> Your Songs </h1>
          {ids === [] ? <h1>None</h1> : ids.map((id) => {
            return (
            <div style = {{borderBottom: '2px black solid', width:'80%', display: 'inline-block'}}>
            <img src = {'/images/play.png'} style = {{height: '70px', float: 'left', marginLeft:'-10%'}} onClick={(event)=> {this.setState({song: 
              [{src: this.state.uploadedSongs[id].url, name: this.state.uploadedSongs[id].title,
                          img: this.state.uploadedSongs[id].imageURL}]
                        })}
                        }/>
            <img src = {this.state.uploadedSongs[id].imageURL} style = {{height: '70px', float: 'left'}}/>
            <h4 style = {{float:'left', paddingLeft:'5px'}}> {this.state.uploadedSongs[id].title}</h4>
            <h3 style = {{float:'right', paddingRight:'10px'}}> by {this.state.uploadedSongs[id].artist} </h3>
            </div>
            );
          })}
          </Grid.Column>
          <Grid.Column>
          <h1> Bought Songs </h1>
          {eds === [] ? <h3>None</h3> : eds.map((id) => {
            return (
            <div style = {{borderBottom: '2px black solid', width:'80%', display: 'inline-block'}}>
            <img src = {'/images/play.png'} style = {{height: '70px', float: 'left', marginLeft:'-10%'}} onClick={(event)=> {this.setState({song: 
              [{name: this.state.bought[id].title,
                          img: this.state.bought[id].imageURL,
                          src: this.state.bought[id].url}]
                        })}
                        }/>
            <img src = {this.state.bought[id].imageURL} style = {{height: '70px', float: 'left'}}/>
            <h4 style = {{float:'left', paddingLeft:'5px'}}> {this.state.bought[id].title}</h4>
            <h3 style = {{float:'right', paddingRight:'10px'}}> by <a href = {"/profile/" + this.state.bought[id].email}>{this.state.bought[id].artist}</a></h3>
            </div>
            );
          })}
          </Grid.Column> <div></div>
          </Grid>  
        </div> :
        <div style = {{paddingTop:'60px', paddingLeft:"80px"}}>
        {ids.length === 0 ? <h1> No songs </h1> : 
        ids.map((id) => {
            return (
            <div style = {{borderBottom: '2px black solid', width:'80%', display: 'inline-block', marginLeft:"60px"}}>
            <img src = {this.state.uploadedSongs[id].imageURL} style = {{height: '70px', float: 'left'}}/>
            <h4 style = {{float:'left', paddingLeft:'5px'}}> {this.state.uploadedSongs[id].title}</h4>
            <h3 style = {{float:'right', paddingRight:'10px'}}> by {this.state.uploadedSongs[id].artist}</h3>
            </div>
            );
          })}
        </div>
        }
        </div>
    );
  }
}

export default Profile;