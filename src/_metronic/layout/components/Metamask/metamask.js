import React, {useState, useEffect} from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import {useGlobal} from '../../../../app/context/AuthContext'
import {Button} from 'react-bootstrap'
import Cookies from 'js-cookie'
import metamask from '../../../../_metronic/assets/marketplace/icons/metamask.svg'
import Web3 from 'web3'

function MetaMaskConnect({title, setOpenModal}) {
  const [provider, setProvider] = useState(null)
  const {
    account,
    setAccount,
    balance,
    accesToken,
    setMetamaskAccessToken,
    metamaskAccessToken,
    setProfileAccount,
  } = useGlobal()
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

  // useEffect(() => {
  //   const storedAccount = localStorage.getItem('metamaskAccount')
  //   if (storedAccount) {
  //     setAccount(storedAccount)
  //   }
  // }, [setAccount])

  const connectToMetaMask = async () => {
    try {
      // setOpenModal(false)
      const ethereum = window.ethereum
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      localStorage.setItem('metamaskAccount', accounts[0])
      localStorage.setItem('connect_metamask', accounts[0])
      setAccount(accounts[0])
      setMetamaskAccessToken(accounts[0])
    } catch (error) {
      setErrorMessage(
        'Metamask connection failed. Please try logging in by opening the Metamask extension.'
      )
    }
  }

  const accountLine = account?.slice(0, 6) + '...' + account?.slice(-4)

  return (
    <Button
      className='mt-3 btn btn-dark'
      style={{borderRadius: '10px'}}
      onClick={connectToMetaMask}
    >
      <div
        style={{
          width: '200px',
          display: 'flex',
          gap: '1rem',
          alignItems: ' center',
        }}
      >
        <img style={{width: '32px', height: '30px'}} src={metamask} />
        {title}
      </div>
    </Button>
  )
}

export default MetaMaskConnect

MetaMaskConnect.defaultProps = {
  title: 'Connect Wallet',
  setOpenModal: () => {},
}
