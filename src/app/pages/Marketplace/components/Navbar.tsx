import React, {useState, useEffect, MouseEvent} from 'react'
import Logo from '../../../../_metronic/assets/marketplace/Logo.svg'
import UserLogo from '../../../../_metronic/assets/marketplace/UserLogo.svg'
import styles from '../Home.module.scss'
import {Modal, Form} from 'react-bootstrap'

import Filter from './Filter'
import Dropdown from './Dropdown'
import {Link, useLocation} from 'react-router-dom'
import {useGlobal} from '../../../../app/context/AuthContext'
import detectEthereumProvider from '@metamask/detect-provider'
import Cookies from 'js-cookie'
import {useAPI} from '../../../api/index'
import clsx from 'clsx'
import Input from './Input'
import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'
import {MdOutlineLogout} from 'react-icons/md'
import {BiInfoCircle} from 'react-icons/bi'
import {access} from 'fs'

interface NavbarProps {
  isSticky?: boolean
}

interface Provider {
  // provider'a ait özellikleri buraya ekleyin
}

const Navbar: React.FC<NavbarProps> = ({isSticky}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const {
    balance,
    account,
    setAccount,
    setOpenModal,
    accessToken,
    roles,
    userInfo,
    userIsVerified,
    setBalance,
    setHgptBalance,
    hgptBalance,
    profileAccount,
    loginMetamask,
    setLoginMetamask,
    metamaskAccessToken,
    isLoginMetamask,
    discordUsername,
    isValidate,
    setIsValidate,
  } = useGlobal()

  const api = useAPI()

  const {logOut, verifyProfile, getTokenBalance} = useAuthService()
  const [showModal, setShowModal] = useState(false)
  const [provider, setProvider] = useState<Provider | null>(null)
  const handleModalToggle = () => setShowModal(!showModal)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [tokenBalance, setTokenBalance] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')

  const userIcon = userInfo?.data?.icon

  const formattedBalance = isNaN(balance) ? 0 : balance
  const formattedRolesBalance = isNaN(hgptBalance) ? 0 : hgptBalance

  const location = useLocation()

  let searchParams = new URLSearchParams(location.search)

  const url_safe = searchParams.get('url_safe')

  const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const getBalance = async () => {
    try {
      const response = await api.get(`/user/getBalance?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setBalance(response.data)
      localStorage.setItem('balanceee', response.data)
      return response.data
    } catch (error) {}
  }

  // useEffect(() => {
  //   if (!accessToken) return
  //   getTokenBalance()
  // }, [loginMetamask])

  useEffect(() => {
    if (!accessToken) return
    getBalance()
  }, [accessToken, isValidate])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const isLogin = localStorage.getItem('accessTokenMarketplace')

  // async function handleBalance() {
  //   const balance = await getTokenBalance()
  //   // if (balance || isLogin) {
  //   //   setHgptBalance(balance)
  //   // }
  //   if (balance) {
  //     setHgptBalance(balance)
  //   }
  // }

  useEffect(() => {
    const getTokenBalance = async () => {
      if (!accessToken) return
      try {
        const response = await api.get(`/metamask/get_balance?token=${accessToken}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        setHgptBalance(response.data)
        return response.data
      } catch (error) {}
    }
    getTokenBalance()
  }, [profileAccount, isLoginMetamask, account])

  console.log('metaa', account)

  useEffect(() => {
    async function detectProvider() {
      const provider = await detectEthereumProvider()
      // const tokenBalance = await getTokenBalance()
      if (tokenBalance) {
        setTokenBalance(tokenBalance)
      }
      if (provider) {
        setProvider(provider)
      } else {
        setErrorMessage('MetaMask yüklenmedi. Lütfen MetaMask eklentisini yükleyin.')
      }
    }
    detectProvider()
  }, [])

  const handleFormSubmit = async () => {
    // Şifrelerin eşleşip eşleşmediğini kontrol edin
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please try again.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }

    try {
      // verifyProfile işlevini çağırın
      const result = await verifyProfile(email)
      // İşlem başarılı ise toast ile bilgi ver
      toast.success('Verified link to  mail.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    } catch (error) {
      // İşlem başarısızsa toast ile hata mesajı göster
      toast.error('Verification failed. Please try again.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }

    handleModalToggle()
  }

  // const connectToMetaMask = async () => {
  //   try {
  //     const ethereum = (window as any).ethereum
  //     const accounts = await ethereum.request({
  //       method: 'eth_requestAccounts',
  //     })
  //     // setAccount(accounts[0])
  //     localStorage.setItem('metamaskAccount', accounts[0])
  //   } catch (error) {
  //     setErrorMessage(
  //       'Metamask connection failed. Please try logging in by opening the Metamask extension.'
  //     )
  //   }
  // }

  // Metamask'tan çıkış yapan fonksiyon
  const logoutFromMetaMask = () => {
    setIsOpen(false)
    setAccount(null)
    localStorage.removeItem('metamaskAccount')
    Cookies.remove('access_token')
  }

  const itemClass = 'ms-1 ms-lg-3'

  const accountLine = account?.slice(0, 6) + '...' + account?.slice(-4)

  const accessTokenLocal = localStorage.getItem('accessTokenMarketplace')

  const isVerified = userInfo?.data?.is_verified

  return (
    <div className={`${styles.navbarWrapper} ${isSticky ? styles.navbarWrapperSticky : ''}`}>
      {!isVerified && accessTokenLocal ? (
        <div className={styles.announcement}>
          <div className={styles.announcementLeft}>
            <span className={styles.announcementIcon}>
              <BiInfoCircle />
            </span>
            <span className={styles.announcementText}>IMPORTANT: </span>
            <span className={styles.announcementTextSecond}>
              Complete your profile to unlock exclusive features. Don't miss out on the
              opportunities available only to fully registered members!
            </span>
            <span onClick={handleModalToggle} className={styles.announcementTextThird}>
              Click and complete your membership now!
            </span>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className={styles.navbar}>
        <div className={styles.right}>
          <Link to='/marketplace'>
            <img src={Logo} alt='Logo' />
          </Link>
          <Filter />
        </div>

        <div className={styles.userInfo}>
          <Input />

          {/* <div className={clsx('app-navbar-item', itemClass)}>
            <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
          </div> */}
          {accessToken && accessTokenLocal && (
            <span className={styles.balance}>
              <span className={styles.balanceText}>
                {numberFormatter.format(formattedBalance)} <strong>Credit</strong>
              </span>
            </span>
          )}

          {accessToken && accessTokenLocal && (
            <span className={styles.balance}>
              <span
                style={{
                  whiteSpace: 'nowrap',
                }}
                className={styles.balanceText}
              >
                {numberFormatter.format(formattedRolesBalance)} <strong>HGPT</strong>
              </span>
            </span>
          )}

          <span className={styles.dropdown}>
            {accessTokenLocal ? (
              <img
                className={styles.userIcon}
                style={{
                  borderRadius: '50%',
                }}
                onClick={toggleDropdown}
                src={
                  userIcon
                    ? userIcon
                    : 'https://deviumstore.blob.core.windows.net/iamge/ibkzsoywiswhtxaj'
                }
                alt=''
              />
            ) : (
              // <button
              //   onClick={() => {
              //     setOpenModal(true)
              //   }}
              //   className={styles.connectButton}
              // >
              //   Login
              // </button>
              ''
            )}
            {!accessTokenLocal && (
              <button
                style={{
                  marginLeft: '10px',
                }}
                onClick={() => {
                  setOpenModal(true)
                }}
                className={styles.connectButton}
              >
                Login
              </button>
            )}

            <Dropdown isOpen={isOpen} onClose={logoutFromMetaMask} />
          </span>
        </div>
      </div>
      <Modal centered show={showModal} onHide={handleModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Membership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                style={{
                  height: '40px',
                }}
                type='email'
                placeholder='Enter email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className={styles.closeButton} onClick={handleModalToggle}>
            Close
          </button>
          <button className={styles.saveButton} onClick={handleFormSubmit}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Navbar
