require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/t_BtizzKJIwrNMe1CvhXgGRVYEvH4QY1',
      accounts:[ '6f552fa673cf0f27629bd82f8041de5efbf868641eeed3fe46c8bbf8c1aa8109' ] 
    }
  }
}
