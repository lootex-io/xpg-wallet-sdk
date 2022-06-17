# XPG Wallet SDK

```javascript
import { Web3Pocket } from './web3pocket'
```

## Web3Pocket.initialize(config)

config 為 5 個 function，分別用來處理 MetaMask 安裝，換鏈，換帳號，錯誤處理

```javascript
window.addEventListener('DOMContentLoaded', async () => {
  await Web3Pocket.initialize({
    handleMetaMaskInstall,
    handleMetaMaskNotInstall,
    handleChainChanged,
    handleAccountsChanged,
    handleErrorMessage,
  })
})
```

## Web3Pocket.connectMetaMask(handleConnectMetaMask)

錢包連線

```javascript
button.connectMetaMask.addEventListener('click', async (event) => {
  await Web3Pocket.connectMetaMask(handleConnectMetaMask)
})
```

## Web3Pocket.disconnectMetaMask(handleDisconnectMetaMask)

錢包斷線

```javascript
button.disconnectMetaMask.addEventListener('click', async (event) => {
  await Web3Pocket.disconnectMetaMask(handleDisconnectMetaMask)
})
```

## Web3Pocket.getOwnedNFTsByContract(contractAddress, renderNFT)

回傳值為全部的 NFT，可以選擇等全部 NFT 抓取完再 Render，或者，帶入第二個 function，個別 Render

```javascript
const NFTs = await Web3Pocket.getOwnedNFTsByContract(contractAddress, (NFT) => {
  log(`${NFT.id} ${NFT.data.name}`)
  elements.div.NFTs.appendChild(divNode(NFT))
})
```
