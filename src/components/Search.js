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


class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      songinfo: {},
      uploadedFileCloudinaryUrl: '',
      results:[]
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
          url: 'http://localhost:3001/api/search', 
          params: {term: this.props.params.q}
        }).then((response)=> {
          this.setState({results: response.data});
        });
  }

  render() {
  	const ids = Object.keys(this.state.results);
    return (
    <div className="Search">
      	<Navigation> </Navigation>
        <div className="container" style = {{textAlign:'center'}}>
        <h1>Search results for {this.props.params.q}</h1>
			{
				ids.map((id)=> {
					return (
						<div style = {{borderBottom: '2px black solid', width:'60%', display: 'inline-block'}}>
				            <img src = {this.state.results[id].imageURL} style = {{height: '70px',width:'80px',float: 'left'}}/>
				            <h3 style = {{float:'left', paddingLeft:'5px', paddingRight:'10px'}}> {this.state.results[id].title}</h3>
				            <h3 style = {{float:'left', paddingRight:'10px'}}> by {this.state.results[id].artist} </h3>
				            <Button style = {{float:'right'}}>Buy Song</Button>
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