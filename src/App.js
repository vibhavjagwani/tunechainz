import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import Factory from '../build/contracts/Factory.json'
import Song from '../build/contracts/Song.json'
import getWeb3 from './utils/getWeb3'
import { Button } from 'semantic-ui-react'
import Home from './components/Home'
import Login from './components/Login'
import { Router, Route, browserHistory } from 'react-router'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: [],
      numSongs: 0, 
      web3: null,
      songs: []
    }

    this.instantiateContract = this.instantiateContract.bind(this);
    this.addSong = this.addSong.bind(this);
    this.buySong = this.buySong.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

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

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    const factory = contract(Factory)
    simpleStorage.setProvider(this.state.web3.currentProvider)
    factory.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var factoryInstance;
    var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      // simpleStorage.deployed().then((instance) => {
      //   console.log(instance);
      //   simpleStorageInstance = instance
      //   return simpleStorageInstance.set(10, {from: accounts[0]})
      // }).then((result) => {
      //   // Get the value from the contract to prove it worked.
      //   return simpleStorageInstance.get.call(accounts[0])
      // }).then((result) => {
      //   // Update state with the result.
      //   console.log(result.toFormat(0));
      //   return this.setState({ storageValue: result.c[0] })
      // })

      // var address;

      // factory.deployed().then((instance) => {
      //   factoryInstance = instance

      //   return factoryInstance.newContract.call({from: accounts[0], gas: 500000})
      // }).then((result) => {
      //   address = result;
      //   return factoryInstance.set(address, 2, {from: accounts[0]})
      // }).then((result) => {
      //   // Get the value from the contract to prove it worked.
      //   return factoryInstance.get(address).call(accounts[0])
      // }).then((result) => {
      //   // Update state with the result.
      //   return this.setState({ storageValue: result.c[0] })
      // })

      simpleStorage.new({from: accounts[0], gas: 500000}).then((instance) => {
        simpleStorageInstance = instance
        return simpleStorageInstance.set(10, {from: accounts[0]})
      }).then((result) => {
          // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
          // Update state with the result.
        var arr = this.state.storageValue
        arr.push(result.c[0])
        return this.setState({ storageValue: arr })
      })

      simpleStorage.new({from: accounts[0], gas: 500000}).then((instance) => {
        simpleStorageInstance = instance
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
          // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
          // Update state with the result.
        var arr = this.state.storageValue
        arr.push(result.c[0])
        return this.setState({ storageValue: arr })
      }).then((result) => {
        this.addSong();
      })

    })
  }

  addSong() {

    const contract = require('truffle-contract')
    const song = contract(Song)
    song.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts)=> {
      var songInstance;

      song.new({from: accounts[0], gas: 500000}).then((instance) => {
        console.log(instance);
        songInstance = instance;
        this.state.numSongs+=1;
        var arr = this.state.songs;
        arr.push(instance.address);
        return this.setState({songs: arr});
      }).then((result) => {
        this.buySong()
      })
    })

  }

  buySong() {

    const contract = require('truffle-contract')
    const song = contract(Song)
    song.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts)=> {
      var address = this.state.songs[0];
      var songInstance = song.at(address);

      songInstance.buySong({from: accounts[0], gas: 500000, value: 1000000000000000}).then((result) => {
        return songInstance.numBuys.call(accounts[0])
      }).then((num) => {
        console.log(num.c[0]);
        return songInstance.buySong({from: accounts[1], gas: 500000, value: 1000000000000000})
      }).then((result) => {
        return songInstance.numBuys.call(accounts[1])
      }).then((num) => {
        console.log(num.c[0]);
        return songInstance.listen({from: accounts[0]})
      })
    })

  }

  render() {
    return (
      <div className="App">
<<<<<<< HEAD
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">TuneChainz</a>
            <div style = {{float:'right', paddingRight: '50px'}}>
            <Button inverted color ='red'>Sign up</Button>
            <Button color = 'red'>Log in</Button>
            <Login></Login>
          </div>
        </nav>
        <Home style = {{marginTop: '20px'}}>
        </Home>
=======
      <Router history = {browserHistory}>
        <Route path = '/' component = {Home} />
      </Router>
>>>>>>> 2f55870f8e51f035498d5aaf2180704f940c46ef
      </div>
    );
  }
}

export default App
