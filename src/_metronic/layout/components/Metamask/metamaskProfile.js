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
import {set} from 'lodash'

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
  const {updateUser, connectMetamaskAccount, getTokenBalance, metamaskLogout, getUserInfo} =
    useAuthService()
  const [errorMessage, setErrorMessage] = useState('')

  const [account, setAccount] = useState(null)

  const [loginText, setLoginText] = useState('Connect Metamask')

  const navigate = useNavigate()

  const [isMetamask, setIsMetamask] = useState(localStorage.getItem('connect_metamask'))

  const info = userInfo?.data?.discord_logout

  const [metamaskId, setMetamaskId] = useState('')
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
        setLoginText('Disconnect Metamask')
        localStorage.setItem('connect_metamask', accounts[0])
        setMetamaskId(accounts[0])
        setLoginMetamask(true)
        toast.success('Metamask connected successfully', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      } else {
        toast.error(metamask.Description, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } catch (error) {
      setErrorMessage({
        message: error.message,
      })
    }
  }

  const logoutFromMetaMask = async () => {
    const response = await metamaskLogout()
    if (response.success === true) {
      setLoginText('Connect Metamask')
      setProfileAccount(null)
      setHgptBalance(0)
      // setBalance(0)
      getUserInfo()
      setAccount('')
      localStorage.removeItem('connect_metamask')
      localStorage.removeItem('metamaskAccount')
    } else {
      toast.error(response.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
    setIsMetamask(null)
  }

  useEffect(() => {
    const isLoginDiscord = localStorage.getItem('connect_metamask')
    if (isLoginDiscord) {
      setLoginText('Disconnect Metamask')
    } else {
      setLoginText('Connect Metamask')
    }
  })

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
          info ? logoutFromMetaMask() : connectToMetaMask()
        }}
      >
        <img src={metamask} />
        <span>{info ? 'Disconnect Metamask' : 'Connect Metamask'}</span>
      </div>
    </div>
  )
}

export default MetaMaskConnect

MetaMaskConnect.defaultProps = {
  title: '',
  setOpenModal: () => {},
}
