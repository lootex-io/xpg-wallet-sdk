import Web3Pocket from './web3pocket.min.js'

const elements = {
  button: {
    connectMetaMask: null,
    disconnectMetaMask: null,
    getOwnedNFTs: null,
  },
  div: {
    NFTs: null,
  },
  input: {
    contractAddress: null,
  },
  span: {
    chainId: null,
    account: null,
  },
  textarea: {
    log: null,
  },
}

const DOM = {
  initialize: () => {
    elements.button.connectMetaMask = document.querySelector(
      'button.connectMetaMask',
    )
    elements.button.disconnectMetaMask = document.querySelector(
      'button.disconnectMetaMask',
    )
    elements.button.getOwnedNFTs = document.querySelector('button.getOwnedNFTs')
    elements.div.NFTs = document.querySelector('div.NFTs')
    elements.input.contractAddress = document.querySelector(
      'input.contractAddress',
    )
    elements.span.chainId = document.querySelector('span.chainId')
    elements.span.account = document.querySelector('span.account')
    elements.textarea.log = document.querySelector('textarea.log')
  },
}

function log(msg) {
  elements.textarea.log.value += `${msg}\n`
  elements.textarea.log.scrollTop = elements.textarea.log.scrollHeight
}

function handleDisconnectMetaMask() {
  elements.button.connectMetaMask.disabled = false
  elements.button.disconnectMetaMask.disabled = true
  elements.button.getOwnedNFTs.disabled = true
  elements.div.NFTs.innerHTML = ''
}

function handleMetaMaskInstall() {
  log('MetaMask successfully detected!')
  elements.button.connectMetaMask.disabled = false
  elements.button.disconnectMetaMask.disabled = true
  elements.button.connectMetaMask.addEventListener('click', async (event) => {
    log('Connect MetaMask')
    await Web3Pocket.connectMetaMask(() => {
      elements.button.connectMetaMask.disabled = true
      elements.button.disconnectMetaMask.disabled = false
      elements.button.getOwnedNFTs.disabled = false
    })
  })
  elements.button.disconnectMetaMask.addEventListener(
    'click',
    async (event) => {
      log('Disconnect MetaMask')
      await Web3Pocket.disconnectMetaMask(handleDisconnectMetaMask)
    },
  )
  elements.button.getOwnedNFTs.addEventListener('click', async (event) => {
    const contractAddress = elements.input.contractAddress.value
    try {
      log('Get Owned NFTs')
      log('Loading...')
      const NFTs = await Web3Pocket.getOwnedNFTsByContract(
        contractAddress,
        (NFT) => {
          log(`${NFT.id} ${NFT.data.name}`)
          elements.div.NFTs.appendChild(divNode(NFT))
        },
      )
      console.log(NFTs)
      // renderNFTs(NFTs)
      log('Done!!!')
    } catch (error) {
      handleErrorMessage(error)
    }
  })
}

function divNode(NFT) {
  const node = document.createElement('div')
  const imageURL = NFT.data.image.replace(
    'ipfs://',
    'https://minter.mypinata.cloud/ipfs/',
  )
  const textnode = document.createTextNode(
    `${NFT.id} ${NFT.data.name} ${imageURL}`,
  )

  node.append(textnode)

  return node
}

// function renderNFTs(NFTs) {
//   for (let i = 0; i < NFTs.length; ++i) {
//     const div = divNode(NFTs[i])
//     elements.div.NFTs.appendChild(div)
//   }
// }

function handleMetaMaskNotInstall() {
  log('Please install MetaMask!')
  elements.button.connectMetaMask.disabled = true
  elements.button.disconnectMetaMask.disabled = true
}

function handleChainChanged(chainId) {
  log(`Chain ID: ${chainId}`)
  elements.span.chainId.innerHTML = chainId
}

function handleAccountsChanged(account) {
  if (!account) handleDisconnectMetaMask()
  log(`Accounts: ${account}`)
  elements.span.account.innerHTML = account
}

function handleErrorMessage(error) {
  log(`Error: ${error.message}`)
}

window.addEventListener('DOMContentLoaded', async () => {
  DOM.initialize()
  await Web3Pocket.initialize({
    handleMetaMaskInstall,
    handleMetaMaskNotInstall,
    handleChainChanged,
    handleAccountsChanged,
    handleErrorMessage,
  })
})
