import React, {useEffect, useState} from 'react'
import Navbar from '../Marketplace/components/Navbar'
import styles from './Home.module.scss'
import {useGlobal} from '../../context/AuthContext'
import {useAPI} from '../../api'
import {Alert, Button, Modal} from 'react-bootstrap'
import {ToastContainer, toast} from 'react-toastify'
import rewardModal from '../../../_metronic/assets/marketplace/rewardModal.svg'
import Loading from './components/Loading'
import {useLocation, useNavigate} from 'react-router-dom'
import {useAuthService} from '../../services/authService'
import Important from './components/Important'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const isLogin = localStorage.getItem('login')
  const [showModal, setShowModal] = useState(false)
  const {
    accessToken,
    account,
    setShowNotification,
    showNotification,
    showNotificationForSize,
    setShowNotificationForSize,
    userInfo,
    setMailAccessToken,
    setAccessToken,
    showPopup,
    setShowPopup,
  } = useGlobal()
  const {verification, resendVerification, getUserInfo} = useAuthService()
  const api = useAPI()

  let location = useLocation()
  let searchParams = new URLSearchParams(location.search)
  const url_safe = searchParams.get('url_safe')
  const token: any = searchParams.get('token')
  const [isNotActive, setIsNotActive] = useState(false)
  const [notActiveMessage, setNotActiveMessage] = useState('')
  const [resendEmail, setResendEmail] = useState(false)

  let navigate = useNavigate()

  useEffect(() => {
    async function verify() {
      const result = await verification(url_safe, token)
      if (result?.status === 200) {
        toast.success(result?.Desc)
        // setMailAccessToken(result?.user_mail)
        if (result?.show_popup) {
          setShowPopup(true)
        }
        localStorage.setItem('accessTokenMarketplace', token)
        setAccessToken(token)
        if (result && token !== '') {
          navigate('/marketplace', {replace: true})
        }
        // if (token !== '') {
        //   getUserInfo()
        // }
      } else {
        setIsNotActive(true)
        setNotActiveMessage(result?.Desc)
        setResendEmail(result?.user_mail)
      }
    }
    if (url_safe && token) {
      verify()
    }
  }, [url_safe, token])

  useEffect(() => {
    // alert(token)
    if (accessToken) {
      getUserInfo()
    }
  }, [token])

  useEffect(() => {
    if (showPopup) {
      setShowModal(true)
    }
  }, [userInfo, accessToken, showPopup])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (scrollPosition > 0) {
      setIsSticky(true)
    } else {
      setIsSticky(false)
    }
  }, [scrollPosition])

  useEffect(() => {
    setTimeout(() => {
      setShowNotification(false)
      setShowNotificationForSize(false)
    }, 3000)
  }, [showNotification, showNotificationForSize])

  const isHome = window.location.pathname === '/marketplace'

  const resendEmailHandle = async () => {
    const result = await resendVerification(resendEmail)
    if (result?.status === 200) {
      toast.success('Email sent to ' + result.user_email)
    } else {
      toast.error('Email not sent')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161617',
        opacity: '0.8',
      }}
      className={styles.container}
    >
      {showNotification && (
        <Alert
          style={{
            position: 'fixed',
            top: '10%',
            right: '50%',
            transform: 'translate(50%, -50%)',
            zIndex: 9999,
          }}
          variant='success'
          onClose={() => setShowNotification(false)}
          dismissible
        >
          The file is successfully uploaded.
        </Alert>
      )}
      {showNotificationForSize && (
        <Alert
          style={{
            position: 'fixed',
            top: '10%',
            right: '50%',
            transform: 'translate(50%, -50%)',
            zIndex: 9999,
          }}
          variant='success'
          onClose={() => setShowNotification(false)}
          dismissible
        >
          The image has incorrect size, do not upload.
        </Alert>
      )}
      <ToastContainer />
      <Navbar isSticky={isSticky} />
      <main>
        {children}
        <Important />
      </main>
      <Modal
        centered
        style={{
          border: 'none',
        }}
        show={showModal}
        onHide={() => {
          setShowPopup(false)
          setShowModal(false)
        }} // You can remove this if you want the modal to be non-dismissible
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body
          style={{
            padding: '0px',
          }}
        >
          <img src={rewardModal} alt='' />
        </Modal.Body>
      </Modal>
      <Modal
        className={styles.modalBody}
        centered
        size='lg'
        style={{
          padding: '2rem',
        }}
        show={isNotActive}
        onHide={() => setIsNotActive(false)}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body
          style={{
            paddingBottom: '4rem',

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <strong className={styles.notActiveMessage}>{notActiveMessage}</strong>
          <div className={styles.resendEmailContainer}>
            <span className={styles.resendEmailText}>Token has expired</span>
            <strong onClick={() => resendEmailHandle()} className={styles.resendEmail}>
              Resend
            </strong>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Layout
