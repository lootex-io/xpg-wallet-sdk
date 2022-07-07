# XPG Wallet SDK

```javascript
import Web3Pocket from './web3pocket.min.js'
```

## Web3Pocket.initialize(config)

初始化

```javascript
function handleMetaMaskInitialized(isInstall) {}
function handleQubicInitialized(isSuccess) {}
function handleProviderChanged(providerName) {}
function handleChainChanged(chainId) {}
function handleAccountsChanged(accounts) {}
function handleProviderEventsUpdated(action) {}
function handleErrorMessage(error) {}

window.addEventListener('DOMContentLoaded', () => {
  Web3Pocket.initialize({
    INFURA_PROJECT_ID, // Qubic 需要用到，請到infura.io註冊申請，省略會無法使用Qubic
    DEFAULT_CHAIN_ID, // 測試預設 0x4
    handleMetaMaskInitialized, // 處理瀏覽器有無安裝 MetaMask
    handleQubicInitialized, // 處理 Qubic 有無初始化成功
    handleProviderChanged, // 處理 MetaMask 和 Qubic 之間的切換
    handleChainChanged, // 處理 Chain 的切換
    handleAccountsChanged, // 處理 Account 的切換
    handleProviderEventsUpdated, // 處以上述兩個事件，測試開發用，可以省略
    handleErrorMessage, // 處理各種 Error
  })
})
```

## Web3Pocket.connectMetaMask(handleConnectMetaMask)

切換到 MetaMask

```javascript
button.connectMetaMask.addEventListener('click', async event => {
  // isConnect 判斷是否正在使用任意一個錢包
  // isQubicVaild 判斷 Qubic 是否能夠使用
  function handleConnectMetaMask(isConnect, isQubicVaild) {}

  await Web3Pocket.connectMetaMask(handleConnectMetaMask)
})
```

## Web3Pocket.connectQubic(handleConnectQubic)

切換到 Qubic

```javascript
button.connectQubic.addEventListener('click', async event => {
  // isConnect 判斷是否正在使用任意一個錢包
  // isMetaMaskInstalled 判斷 MetaMask 有無安裝
  function handleConnectQubic(isConnect, isMetaMaskInstalled) {}

  await Web3Pocket.connectQubic(handleConnectQubic)
})
```


## Web3Pocket.disconnectWallet(handleDisconnectWallet)

切斷 MetaMask 和 Qubic

```javascript
button.disconnectWallet.addEventListener('click', event => {
  // isMetaMaskInstalled 判斷 MetaMask 有無安裝
  // isQubicVaild 判斷 Qubic 是否能夠使用
  function handleDisconnectWallet(isMetaMaskInstalled, isQubicVaild) {}

  Web3Pocket.disconnectWallet(handleDisconnectWallet)
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
