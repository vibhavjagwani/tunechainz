pragma solidity ^0.4.18;

import "./SimpleStorage.sol";

contract Factory {

	mapping(bytes32=>address) contracts;
	address[] public contractArray;

	function Factory() {
	  // constructor
    }

    function newContract() public returns(address newAddress) {
		SimpleStorage s = new SimpleStorage();
		bytes32 id = keccak256(s);
		contracts[id] = s;
		contractArray.push(s);
		return address(s);
	}

	function get(address a) public returns(uint val) {
		SimpleStorage s = SimpleStorage(a);
		return s.get();
	}

	function set(address a, uint x) public {
		SimpleStorage s = SimpleStorage(a);
		s.set(x);
	}
}