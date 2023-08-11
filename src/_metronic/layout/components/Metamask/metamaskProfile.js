import React, {useState, useEffect} from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3' // Add this
import {useGlobal} from '../../../../app/context/AuthContext'
import {Button} from 'react-bootstrap'
import Cookies from 'js-cookie'
import metamask from '../../../../_metronic/assets/marketplace/icons/metamask.svg'
import {useAuthService} from '../../../../app/services/authService'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

function MetaMaskConnect({title, userInfo, imageLink}) {
  const [provider, setProvider] = useState(null)
  const {
    profileAccount,
    setProfileAccount,

    setBalance,
    setHgptBalance,
    setOpenModal,
    openModal,
    setLoginMetamask,
    hgptBalance,
  } = useGlobal()
  const {updateUser, connectMetamaskAccount, getTokenBalance} = useAuthService()
  const [errorMessage, setErrorMessage] = useState('')

  const [account, setAccount] = useState(null)

  const isLoginMetamask = localStorage.getItem('metamaskAccount')

  const navigate = useNavigate()

  const connectToMetaMask = async () => {
    try {
      const ethereum = window.ethereum
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      localStorage.setItem('metamaskAccount', accounts[0])
      setProfileAccount(accounts[0])
      // localStorage.setItem('blanace', accounts[0])
      const metamask = await connectMetamaskAccount(accounts[0])
      if (metamask.Status === 200) {
        setLoginMetamask(true)
      }
    } catch (error) {
      setErrorMessage(
        'Metamask connection failed. Please try logging in by opening the Metamask extension.'
      )
    }
  }

  const logoutFromMetaMask = () => {
    setProfileAccount(null)
    setHgptBalance(0)
    setBalance(0)
    setAccount('')
    localStorage.removeItem('metamaskAccount')
    localStorage.removeItem('accessTokenMarketplace')
    localStorage.removeItem('login')
    localStorage.removeItem('isVerifiedUser')
    localStorage.removeItem('discordUsername')
    localStorage.removeItem('discordAvatarUrl')
    localStorage.removeItem('discordUserName')
    localStorage.removeItem('balanceee')
    localStorage.removeItem('discordEmail')
    setOpenModal(true)
    navigate('/marketplace')
  }

  // const accountLine = profileAccount?.slice(0, 6) + '...' + profileAccount?.slice(-4)

  // let content

  // if (!profileAccount) {
  //   content = (
  //     <div
  //       style={{
  //         borderRadius: '10px',
  //         background: 'white',
  //         display: 'flex',
  //         alignItems: 'center',
  //         color: '#000',
  //         gap: '0.5rem',
  //         fontWeight: 'bold',
  //         fontSize: '1.2rem',
  //         cursor: 'pointer',
  //         justifyContent: 'center',
  //         height: '50px',
  //         padding: 'calc(0.775rem + 1px) calc(1.5rem + 1px)',
  //       }}
  //       onClick={connectToMetaMask}
  //     >
  //       <img src={metamask} />
  //       {title}
  //     </div>
  //   )
  // } else {
  //   content = (
  //     <div
  //       style={{
  //         background: '#42293e',
  //         borderRadius: '5px',
  //         display: 'flex',
  //         alignItems: 'center',
  //         fontWeight: 'bold',
  //         border: '2px solid #fb72b7',
  //         color: '#fb72b7',
  //         gap: '2rem',
  //         fontSize: '1.2rem',
  //         cursor: 'pointer',
  //         justifyContent: 'center',
  //         height: '50px',
  //         padding: 'calc(0.775rem + 1px) calc(1.5rem + 1px)',
  //       }}
  //       onClick={logoutFromMetaMask}
  //     >
  //       <span>Logout from MetaMask</span>
  //       <span>
  //         <u>Account:</u> <strong>{accountLine}</strong>
  //       </span>
  //     </div>
  //   )
  // }

  return (
    <div>
      {' '}
      <div
        style={{
          borderRadius: '10px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          color: '#000',
          gap: '0.5rem',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          cursor: 'pointer',
          justifyContent: 'center',
          height: '50px',
          padding: 'calc(0.775rem + 1px) calc(1.5rem + 1px)',
        }}
        onClick={() => {
          !profileAccount ? connectToMetaMask() : logoutFromMetaMask()
        }}
      >
        <img src={metamask} />
        {!profileAccount ? title : 'Sign out from Metamask'}
      </div>
    </div>
  )
}

export default MetaMaskConnect

MetaMaskConnect.defaultProps = {
  title: 'Connect Metamask',
  setOpenModal: () => {},
}
