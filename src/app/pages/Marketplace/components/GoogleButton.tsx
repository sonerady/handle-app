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
}

const CustomModal: FC<ModalProps> = ({children, openModal}) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const {logOut, googleLogout, connectGoogleAccount} = useAuthService()

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
    userInfo,
  } = useGlobal()
  const clientId = '279751245565-og702v9ag0i0th14uaan19js2hq3nt12.apps.googleusercontent.com'

  const onFailure = (res: any) => {}

  const onSuccess = (res: any) => {
    const googleAccessToken = res?.accessToken

    localStorage.setItem('googleAccessToken', googleAccessToken)
    const googleProfile = res?.profileObj
    if (googleProfile) {
      const decodedName = decodeURIComponent(googleProfile.name)
      const decodedImageUrl = decodeURIComponent(googleProfile.imageUrl)
      setUserName && setUserName(decodedName)
      setAvatarUrl && setAvatarUrl(decodedImageUrl)
      setGmailEmail && setGmailEmail(googleProfile.email)
      setGmailIcon && setGmailIcon(googleProfile.imageUrl)
      setGmailUsername && setGmailUsername(googleProfile.name)
      setIsSignedIn(true)
      connectGoogleAccount(googleAccessToken, googleProfile.name, googleProfile.email)
    }
  }

  const handleLogout = async () => {
    try {
      gapi.auth2
        .getAuthInstance()
        .signOut()
        .then(() => {
          setIsSignedIn(false)
        })
      const googleAccessToken = localStorage.getItem('googleAccessToken')

      const logout = await googleLogout(googleAccessToken)

      if (logout.status === 200) {
        setIsSignedIn(false)
        localStorage.removeItem('googleAccessToken')
        localStorage.removeItem('accessTokenMarketplace')
        setGoogleAccessToken && setGoogleAccessToken('')
        setUserName && setUserName('')
        setGmailUsername && setGmailUsername('')
        setGmailEmail && setGmailEmail('')
        setAvatarUrl && setAvatarUrl('')
        setGmailEmail && setGmailEmail('')
        // window.location.reload()
        setOpenModal(true)
      } else {
        toast.error(logout.Desc)
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

  const isGoogleLogin = localStorage.getItem('googleAccessToken')

  return (
    <div className={styles.discordButton}>
      {isGoogleLogin ? (
        <button
          style={{
            width: '100%',
          }}
          className={styles.googleButton}
          onClick={handleLogout}
        >
          <div className={styles.buttonContent}>
            <img src={google} alt='' />
            <span className={styles.btnText}>Sign out from Google</span>
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
