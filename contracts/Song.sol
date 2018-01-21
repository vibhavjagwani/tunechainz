pragma solidity ^0.4.4;

contract Song {

	address owner;
	mapping(address=>bool) listeners;
	uint listens;
	uint buys;

	event newSong();

	modifier onlyBy(address _account) {
		require(msg.sender == _account);
		_;
	}	

	function Song() public {
	// constructor
		owner = msg.sender;
		listens = 0;
		buys = 0;
		newSong();
	}

	function buySong() public payable returns (bool success) {
		require(msg.value >= 1000000000000000);
		require(listeners[msg.sender] == false);
		listeners[msg.sender] = true;
		buys += 1;
		return true;
	}

	function listen() public returns (bool paidForSong) {
		require(listeners[msg.sender] == true);
		listens += 1;
		return true;
	}

	function cashLeft() public payable onlyBy(owner) returns (uint remaining) {
		uint x = this.balance;
		return x;
	}

	function numListens() public returns (uint num) {
		return listens;
	}

	function numBuys() public returns (uint num) {
		return buys;
	}

	function cashOut(uint x) public payable onlyBy(owner) returns (uint remaining) {
		require(this.balance >= x);
		msg.sender.transfer(x);
		return this.balance;
	}
}
