import React, {useState, useEffect} from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import {useGlobal} from '../../../context/AuthContext'
import {Button} from 'react-bootstrap'
import Cookies from 'js-cookie'
import metamask from '../../../../_metronic/assets/marketplace/icons/metamask.svg'

// Declare ethereum for window object
declare global {
  interface Window {
    ethereum: any
  }
}

// Add props to component
interface MetaMaskConnectProps {
  setOpenModal?: (open: boolean) => void
  title: string
}

function MetaMaskConnect({setOpenModal, title}: MetaMaskConnectProps) {
  const [provider, setProvider] = useState<any | null>(null) // Define type for provider
  const {account, setAccount, balance, accesToken} = useGlobal()
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
      setOpenModal && setOpenModal(false)
      const ethereum = window.ethereum
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      localStorage.setItem('metamaskAccount', accounts[0])
    } catch (error) {
      setErrorMessage(
        'Metamask connection failed. Please try logging in by opening the Metamask extension.'
      )
    }
  }

  const logoutFromMetaMask = () => {
    setAccount(null)
    localStorage.removeItem('metamaskAccount')
    Cookies.remove('access_token')
  }

  const accountLine = account?.slice(0, 6) + '...' + account?.slice(-4)

  return (
    <Button
      className='btn btn-dark'
      style={{borderRadius: '5px', height: '50px', background: 'white'}}
      onClick={connectToMetaMask}
    >
      {
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img style={{width: '32px', height: '30px'}} src={metamask} />
          <span
            style={{
              color: '#161617',
              fontWeight: '700',
            }}
          >
            {title}
          </span>
        </div>
      }
    </Button>
  )
}

export default MetaMaskConnect
