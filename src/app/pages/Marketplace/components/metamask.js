import React, {useState, useEffect} from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import {useGlobal} from '../../../../app/context/AuthContext'
import {Button} from 'react-bootstrap'
import Cookies from 'js-cookie'

function MetaMaskConnect() {
  const [provider, setProvider] = useState(null)
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

  // useEffect(() => {
  //   const storedAccount = localStorage.getItem("metamaskAccount");
  //   if (storedAccount) {
  //     setAccount(storedAccount);
  //   }
  // }, [setAccount]);

  const connectToMetaMask = async () => {
    try {
      const ethereum = window.ethereum
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      // setAccount(accounts[0])
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
    <div className='d-flex justify-content-center align-items-center gap-3 flex-column '>
      {account ? (
        <div
          className='d-flex justify-content-center align-items-center
               gap-3
               '
        >
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <p className='mb-0'>
              <span>Credits: </span>
              <strong>
                {balance > 0 ? balance : 'Your credit will be renewed 24 hours later'}
              </strong>
            </p>{' '}
            <span>|</span>
            <p className='mb-0'>
              <span>Address: </span>
              <strong>{accountLine}</strong>
            </p>
          </div>
          <Button
            className='
                 btn btn-primary  fw-bold btn-sm rounded font-size-base '
            onClick={logoutFromMetaMask}
          >
            Sign out
          </Button>
        </div>
      ) : (
        <Button onClick={connectToMetaMask}>Connect Wallet</Button>
      )}
      {errorMessage && <p className='text-center'>{errorMessage}</p>}
    </div>
  )
}

export default MetaMaskConnect
