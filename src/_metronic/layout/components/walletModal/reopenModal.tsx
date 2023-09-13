import React, {FC, ReactNode, useEffect, MouseEvent, useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import styles from './modal.module.scss'
import {useGlobal} from '../../../../app/context/AuthContext'
import MetaMaskConnect from '../Metamask/metamask'
import {BsDiscord} from 'react-icons/bs'
import {gapi} from 'gapi-script'
import GoogleLogin from '@leecheuk/react-google-login'
import google from '../../../../_metronic/assets/marketplace/icons/google.svg'
import robotLogin from '../../../../_metronic/assets/marketplace/images/robot_login.svg'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {setUser} from '@sentry/react'
import {useAuthService} from '../../../../app/services/authService'
interface ModalProps {
  children?: ReactNode
  openModal?: boolean
  setOpenModal?: (open: boolean) => void
}

const CustomModal: FC<ModalProps> = ({children, openModal, setOpenModal}) => {
  const {
    setGoogleAccessToken,
    setDiscordAccessToken,
    mailAccessToken,
    setMailAccessToken,
    password,
    setPassword,
    triggerLogin,
    setTriggerLogin,
    discordAccessToken,
    userName,
    setUserName,
    avatarUrl,
    setAvatarUrl,
    discordUsername,
    setDiscordUsername,
    discordEmail,
    setDiscordEmail,
    discordID,
    setDiscordID,
    discordIcon,
    setDiscordIcon,
    setGmailEmail,
    setGmailIcon,
    setGmailUsername,
    validUsername,
    setDiscordRole,
  } = useGlobal()
  const {getRole, sendForgot, discordLogout} = useAuthService()
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isSignup, setIsSignup] = React.useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const clientId = '271809243258-5n5ub8j1vfhkd71n9j77om3vvnub8djq.apps.googleusercontent.com'
  const [forgot, setForgot] = useState(false)
  const [emailForgot, setEmailForgot] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value)
  }

  // Define handlers for form submission
  const handleEmailChange = (event: any) => {
    setEmailInput(event.target.value)
  }

  const handlePasswordChange = (event: any) => {
    setPasswordInput(event.target.value)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()

    // Password and confirm password must match
    if (passwordInput !== confirmPassword) {
      toast?.error('Passwords do not match!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }

    // Password must be between 8 and 16 characters
    if (passwordInput.length < 8 || passwordInput.length > 16) {
      toast?.error('Password should be 8-16 characters long!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }

    setMailAccessToken(emailInput)
    setPassword(passwordInput)

    setTriggerLogin && setTriggerLogin(!triggerLogin)
  }

  const handleForgot = async (event: any) => {
    event.preventDefault()

    if (emailForgot === '') {
      toast?.error('Email field must not be empty!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }
    const send = await sendForgot(emailForgot)
    if (send.Status === 200) {
      toast?.success('Reset password link sent to your email!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      setForgot(false)
    } else {
      toast?.error('Email not found!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const handleLogin = (event: any) => {
    event.preventDefault()

    setMailAccessToken(emailInput)
    setPassword(passwordInput)
    setTriggerLogin && setTriggerLogin(!triggerLogin)
  }

  const onFailure = (res: any) => {}

  const onSuccess = (res: any) => {
    const googleAccessToken = res?.accessToken
    setGoogleAccessToken && setGoogleAccessToken(googleAccessToken)
    localStorage.setItem('googleAccessToken', googleAccessToken)
    const googleProfile = res?.profileObj
    if (googleProfile) {
      // Decode the user name and avatar URL
      const decodedName = decodeURIComponent(googleProfile.name)
      const decodedImageUrl = decodeURIComponent(googleProfile.imageUrl)
      setUserName && setUserName(decodedName)
      setAvatarUrl && setAvatarUrl(decodedImageUrl)
      setGmailEmail && setGmailEmail(googleProfile.email)
      setGmailIcon && setGmailIcon(googleProfile.imageUrl)
      setGmailUsername && setGmailUsername(googleProfile.name)
    }
  }

  const handleRecaptcha = (value: any) => {
    if (value === null) {
      console.error('ReCAPTCHA failed')
      return
    }
    onSuccess(value)
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

  const discordClientId = '1121395648437174313'

  // LOCAL

  // const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fmarketplace&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections%20guilds.members.read`

  // TEST

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&redirect_uri=https%3A%2F%2Fhypermarket.azurewebsites.net%2Fmarketplace&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections%20guilds.members.read`

  // PROD

  // const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&redirect_uri=https%3A%2F%2Fstore.hypergpt.ai%2Fmarketplace&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections%20guilds.members.read`

  // const redirectUri = 'http://localhost:8080/marketplace'
  const redirectUri = 'https://hypermarket.azurewebsites.net/marketplace'
  // const redirectUri = 'https://store.hypergpt.ai/marketplace'

  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  useEffect(() => {
    const fetchTokenAndUserData = async () => {
      if (code) {
        let data = {
          client_id: discordClientId,
          client_secret: 'FQ2E3cz18aP-OeAg358SQawNgOulw54T',
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
          scope: 'identify',
        }
        let params = new URLSearchParams(data)

        try {
          const response = await fetch(`https://discord.com/api/v10/oauth2/token`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params,
          })
          const res = await response.json()
          const accessToken = res.access_token

          if (accessToken) {
            setOpenModal && setOpenModal(false)
            setDiscordAccessToken(accessToken)
            localStorage.setItem('discordAccessToken', accessToken)
            getRole()

            const userInfoResponse = await fetch('https://discord.com/api/users/@me', {
              headers: {authorization: `Bearer ${accessToken}`},
            })
            const user = await userInfoResponse.json()

            let avatarURL
            if (user.avatar) {
              avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            } else {
              let defaultAvatarNumber = parseInt(user.discriminator) % 5
              avatarURL = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
            }
            setAvatarUrl(avatarURL)
            setDiscordUsername(user.username)
            setDiscordEmail(user.email)
            setDiscordID(user.id)
            setDiscordIcon(user.avatar)
            setDiscordRole(user.role)
            localStorage.setItem('discordIcon', user.avatar)
            localStorage.setItem('discordAvatarUrl', avatarURL)
            localStorage.setItem('discordUsername', user.username)
            localStorage.setItem('discordID', user.id)
            localStorage.setItem('discordUserName', user.username)
            localStorage.setItem('discordEmail', user.email)
          }
        } catch (err) {
          console.error(err)
        }
      }
    }

    fetchTokenAndUserData()
  }, [code])

  return (
    <Modal
      className={styles.modalWrapper}
      show={openModal}
      onHide={() => {
        setOpenModal && setOpenModal(false)
      }}
    >
      <Modal.Body
        style={{
          overflow: 'hidden',
          height: '350px',
        }}
        className={styles.modalBody}
      >
        <div>
          <img
            style={{
              position: 'relative',
              top: '75px',
            }}
            src={robotLogin}
            alt=''
          />
        </div>
        <div className={styles.modalContentWrapper}>
          <h3>Welcome back to HyperStore</h3>
          <p>
            Your Discord Token has expired. You need to reconnect Discord for DAO related
            authorizations.
          </p>
          <div className={styles.modalButtons}>
            <Button
              className='mt-3'
              variant='dark'
              onClick={async () => {
                const connect = await discordLogout()
                if (connect.success) {
                  localStorage.removeItem('connect_discord')
                  localStorage.removeItem('discordAccessToken')
                  localStorage.removeItem('discordID')
                }
                if (!connect.success) {
                  return
                } else {
                  window.location.href = discordAuthUrl
                }
              }}
            >
              <div className={styles.buttonContent}>
                <span className={styles.discordIcon}>
                  <BsDiscord />
                </span>
                <span>Reconnect to Discord</span>
              </div>
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CustomModal
