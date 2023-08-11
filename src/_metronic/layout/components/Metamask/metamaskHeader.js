import React, {useState, useEffect} from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3' // Add this
import {useGlobal} from '../../../../app/context/AuthContext'
import {Button} from 'react-bootstrap'
import Cookies from 'js-cookie'
import metamask from '../../../../_metronic/assets/marketplace/icons/metamask.svg'

function MetaMaskConnect({title, setOpenModal}) {
  const [provider, setProvider] = useState(null)
  const {account, setAccount, accesToken, setMetamaskAccessToken, balance} = useGlobal()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function detectProvider() {
      const provider = await detectEthereumProvider()
      if (provider) {
        setProvider(provider)
      } else {
        setErrorMessage('MetaMask yÃ¼klenmedi. LÃ¼tfen MetaMask eklentisini yÃ¼kleyin.')
      }
    }
    detectProvider()
  }, [])

  const connectToMetaMask = async () => {
    try {
      const ethereum = window.ethereum
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      localStorage.setItem('metamaskAccount', accounts[0])
      setAccount(accounts[0])

      // Fetch balance
      const web3 = new Web3(ethereum)
      const balance = await web3.eth.getBalance(accounts[0])
      //   setBalance(web3.utils.fromWei(balance, 'ether'))
    } catch (error) {
      setErrorMessage(
        'Metamask connection failed. Please try logging in by opening the Metamask extension.'
      )
    }
  }

  const logoutFromMetaMask = () => {
    setAccount(null)
    // setBalance(null) // Reset balance
    localStorage.removeItem('metamaskAccount')
    Cookies.remove('access_token')
  }

  const accountLine = account?.slice(0, 6) + '...' + account?.slice(-4)

  useEffect(() => {
    connectToMetaMask()
  }, [account])

  return (
    <>
      {!account ? (
        <div style={{borderRadius: '10px'}} onClick={connectToMetaMask}>
          {title}
        </div>
      ) : (
        <div
          style={{
            background: '#42293e',
            height: 'fit-content',
            padding: '1rem',
            borderRadius: '1rem',
            marginTop: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
          }}
        >
          {account && (
            <span>
              Account: <strong>{accountLine}</strong>
            </span>
          )}
          {account && balance && (
            <span>
              Balance: <strong>{balance}</strong>
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default MetaMaskConnect

MetaMaskConnect.defaultProps = {
  title: 'Connect Wallet',
  setOpenModal: () => {},
}
