import Web3Pocket from './web3pocket.min.js'

const INFURA_PROJECT_ID = '1fa64c3d8ce64d61809b5a75f83cf934'
const DEFAULT_CHAIN_ID = 0x4

const elements = {
  button: {
    connectMetaMask: null,
    connectQubic: null,
    disconnectWallet: null,
    getBalanceOf: null,
    getOwnedNFTs: null,
  },
  div: {
    NFTs: null,
  },
  input: {
    customAccount: null,
    contractAddress: null,
  },
  span: {
    chainId: null,
    account: null,
    balanceOf: null,
  },
  textarea: {
    log: null,
  },
}

const DOM = {
  initialize: () => {
    const { button, div, input, span, textarea } = elements

    button.connectMetaMask = document.querySelector('button.connectMetaMask')
    button.connectQubic = document.querySelector('button.connectQubic')
    button.disconnectWallet = document.querySelector('button.disconnectWallet')
    button.getBalanceOf = document.querySelector('button.getBalanceOf')
    button.getOwnedNFTs = document.querySelector('button.getOwnedNFTs')
    div.NFTs = document.querySelector('div.NFTs')
    input.customAccount = document.querySelector('input.customAccount')
    input.contractAddress = document.querySelector('input.contractAddress')
    span.chainId = document.querySelector('span.chainId')
    span.account = document.querySelector('span.account')
    span.balanceOf = document.querySelector('span.balanceOf')
    textarea.log = document.querySelector('textarea.log')
    button.getBalanceOf.addEventListener('click', async event => {
      const customAccount = elements.input.customAccount.value
      const contractAddress = elements.input.contractAddress.value

      try {
        DOM.log('Get BalanceOf...')

        const length = await Web3Pocket.getBalanceOfByContract(contractAddress, customAccount)

        span.balanceOf.innerHTML = length
      } catch(error) {
        handleErrorMessage(error)
      }
    })
    button.getOwnedNFTs.addEventListener('click', async event => {
      const customAccount = elements.input.customAccount.value
      const contractAddress = elements.input.contractAddress.value

      function divNode(NFT) {
        const node = document.createElement('div')
        const imageURL = NFT.data.image.replace('ipfs://', 'https://minter.mypinata.cloud/ipfs/')
        const textnode = document.createTextNode(`${NFT.id} ${NFT.data.name} ${imageURL}`)

        node.append(textnode)

        return node
      }

      try {
        DOM.log('Get Owned NFTs...')
        elements.div.NFTs.innerHTML = ''

        const NFTs = await Web3Pocket.getOwnedNFTsByContract(contractAddress, NFT => {
          DOM.log(`${NFT.id} ${NFT.data.name}`)
          elements.div.NFTs.appendChild(divNode(NFT))
        }, customAccount)

        console.log(NFTs)
      } catch (error) {
        handleErrorMessage(error)
      }
    })
    button.disconnectWallet.addEventListener('click', event => {
      function handleDisconnectWallet(isMetaMaskInstalled, isQubicVaild) {
        const { button, span } = elements

        if (isMetaMaskInstalled) button.connectMetaMask.disabled = false
        if (isQubicVaild) button.connectQubic.disabled = false

        button.disconnectWallet.disabled = true
        button.getBalanceOf.disabled = true
        button.getOwnedNFTs.disabled = true
        span.chainId.innerHTML = ''
        span.account.innerHTML = ''
        span.balanceOf.innerHTML = ''
        DOM.log('Disconnect')
      }

      Web3Pocket.disconnectWallet(handleDisconnectWallet)
    })
  },
  log: msg => {
    const { textarea } = elements

    textarea.log.value += `${msg}\n`
    textarea.log.scrollTop = textarea.log.scrollHeight
  }
}

function handleMetaMaskInitialized(isInstall) {
  const { button } = elements

  if (isInstall) {
    DOM.log('MetaMask successfully detected!')
    button.connectMetaMask.disabled = false
    button.connectMetaMask.addEventListener('click', async event => {
      function handleConnectMetaMask(isConnect, isQubicVaild) {
        if (isConnect) {
          button.connectMetaMask.disabled = true
          if (isQubicVaild) button.connectQubic.disabled = false
          button.disconnectWallet.disabled = false
          button.getBalanceOf.disabled = false
          button.getOwnedNFTs.disabled = false
          DOM.log('MetaMask connect success')
        } else {
          DOM.log('MetaMask connect failure')
        }
      }

      await Web3Pocket.connectMetaMask(handleConnectMetaMask)
    })
  } else {
    DOM.log('Please install MetaMask!')
    button.connectMetaMask.disabled = true
  }
}

function handleQubicInitialized(isSuccess) {
  const { button } = elements

  if (isSuccess) {
    button.connectQubic.disabled = false
    button.connectQubic.addEventListener('click', async event => {
      function handleConnectQubic(isConnect, isMetaMaskInstalled) {
        if (isConnect) {
          if (isMetaMaskInstalled) button.connectMetaMask.disabled = false
          button.connectQubic.disabled = true
          button.disconnectWallet.disabled = false
          button.getBalanceOf.disabled = false
          button.getOwnedNFTs.disabled = false
          DOM.log('Qubic connect success')
        } else {
          DOM.log('Qubic connect failure')
        }
      }

      await Web3Pocket.connectQubic(handleConnectQubic)
    })
    DOM.log('Qubic initialize success')
  } else {
    button.connectQubic.disabled = true
    DOM.log('Qubic initialize failure')
  }
}

function handleProviderChanged(providerName) {
  DOM.log(`Set provider to ${providerName}`)
}

function handleChainChanged(chainId) {
  const { span } = elements

  DOM.log(`Chain ID: ${chainId}`)
  span.chainId.innerHTML = chainId
}

function handleAccountsChanged(accounts) {
  const { span } = elements
  const account = accounts[0] || null

  DOM.log(`Accounts: ${account}`)
  span.account.innerHTML = account
}

function handleProviderEventsUpdated(action) {
  DOM.log(`${action} provider events`)
}

function handleErrorMessage(error) {
  DOM.log(`Error: ${error.message}`)
}

window.addEventListener('DOMContentLoaded', () => {
  DOM.initialize()
  Web3Pocket.initialize({
    INFURA_PROJECT_ID,
    DEFAULT_CHAIN_ID,
    handleMetaMaskInitialized,
    handleQubicInitialized,
    handleProviderChanged,
    handleChainChanged,
    handleAccountsChanged,
    handleProviderEventsUpdated,
    handleErrorMessage,
  })
})
