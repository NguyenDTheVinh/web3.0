// https://eth-goerli.g.alchemy.com/v2/4M70Tr--nUPCuRDCYwBj0RIlL2WslwEa

require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/4M70Tr--nUPCuRDCYwBj0RIlL2WslwEa',
      accounts:[ '6f552fa673cf0f27629bd82f8041de5efbf868641eeed3fe46c8bbf8c1aa8109' ] 
    }
  }
};
