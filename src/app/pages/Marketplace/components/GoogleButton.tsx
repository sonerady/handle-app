import React, {FC, ReactNode, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import styles from './components.module.scss'
import {useGlobal} from '../../../../app/context/AuthContext'
// import {GoogleLogin} from 'react-google-login'
import {gapi} from 'gapi-script'
import GoogleLogin from '@leecheuk/react-google-login'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'
import google from '../../../../_metronic/assets/marketplace/icons/google.svg'
import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'

interface ModalProps {
  children?: ReactNode
  openModal?: boolean
  setOpenModal?: (open: boolean) => void
  userInfo?: any
}

const CustomModal: FC<ModalProps> = ({children, openModal, userInfo}) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const {logOut, googleLogout, connectGoogleAccount, getUserInfo} = useAuthService()

  const info = userInfo?.data?.discord_logout
  const email = userInfo?.data?.gmail_email

  const {
    setGoogleAccessToken,
    setUserName,
    setAvatarUrl,
    setGmailEmail,
    setGmailIcon,
    setGmailUsername,
    googleAccessToken,
    setOpenModal,
    gmailEmail,
    gmailUsername,
    // userInfo,
  } = useGlobal()
  const clientId = '271809243258-r9i0c8undu3tsm1r2ndagmvn3ba6okuv.apps.googleusercontent.com'

  const onFailure = (res: any) => {}

  const onSuccess = async (res: any) => {
    const googleAccessToken = res?.accessToken

    localStorage.setItem('googleAccessToken', googleAccessToken)
    const googleProfile = res?.profileObj
    if (googleProfile) {
      getUserInfo()
      const decodedName = decodeURIComponent(googleProfile.name)
      const decodedImageUrl = decodeURIComponent(googleProfile.imageUrl)
      setUserName && setUserName(decodedName)
      setAvatarUrl && setAvatarUrl(decodedImageUrl)
      setGmailEmail && setGmailEmail(googleProfile.email)
      setGmailIcon && setGmailIcon(googleProfile.imageUrl)
      setGmailUsername && setGmailUsername(googleProfile.name)
      setIsSignedIn(true)
      const response = await connectGoogleAccount(
        googleAccessToken,
        googleProfile.name,
        googleProfile.email
      )
      if (response.success) {
        toast.success('Google account connected successfully')
        getUserInfo()
      }
    }
  }

  const handleLogout = async () => {
    try {
      // gapi.auth2
      //   .getAuthInstance()
      //   .signOut()
      //   .then(() => {
      //     setIsSignedIn(false)
      //   })

      const logout = await googleLogout()
      if (logout.status) {
        setIsSignedIn(false)
        localStorage.removeItem('googleAccessToken')
        getUserInfo()
        setGoogleAccessToken && setGoogleAccessToken('')
        setUserName && setUserName('')
        setGmailUsername && setGmailUsername('')
        setGmailEmail && setGmailEmail('')
        setAvatarUrl && setAvatarUrl('')
        setGmailEmail && setGmailEmail('')
        // window.location.reload()
        // setOpenModal(true)
        toast?.success(logout.Desc, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      } else {
        toast.error(logout.Desc, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } catch (error) {}
  }

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: '',
      })
    }
    gapi.load('client:auth2', start)
  })

  useEffect(() => {
    if (googleAccessToken) {
      setIsSignedIn(true)
    } else {
      setIsSignedIn(false)
    }
  })

  return (
    <div className={styles.discordButton}>
      {!info && email ? (
        <button
          style={{
            width: '100%',
          }}
          className={styles.googleButton}
          onClick={handleLogout}
        >
          <div className={styles.buttonContent}>
            <img src={google} alt='' />
            <span className={styles.btnText}>Disconnect Google</span>
          </div>
        </button>
      ) : (
        <GoogleLogin
          clientId={clientId}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy='single_host_origin'
          isSignedIn={false}
          render={(renderProps: any) => (
            <button className={styles.googleButton} onClick={renderProps.onClick}>
              <div className={styles.buttonContent}>
                <img src={google} alt='' />
                <span className={styles.btnText}>Connect Google</span>
              </div>
            </button>
          )}
        />
      )}
    </div>
  )
}

export default CustomModal
