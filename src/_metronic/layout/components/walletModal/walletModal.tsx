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
  } = useGlobal()
  const {getRole, sendForgot} = useAuthService()
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isSignup, setIsSignup] = React.useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const clientId = '314565618653-voqdo7h77cd0hahfssqo6d1t3rhpu0pq.apps.googleusercontent.com'
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

    // Here you would typically send the data to your server...
    // On success:
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
      console.log('Google profile', googleProfile)
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

  // const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fmarketplace&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections%20guilds.members.read`

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&redirect_uri=https%3A%2F%2Fhypermarket.azurewebsites.net%2Fmarketplace&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections%20guilds.members.read`

  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  // const redirectUri = 'http://localhost:8080/marketplace'
  const redirectUri = 'https://hypermarket.azurewebsites.net/marketplace'

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
            setUserName(user.username)
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

  useEffect(() => {}, [discordAccessToken])

  return (
    <Modal
      className={styles.modalWrapper}
      show={openModal}
      onHide={() => setOpenModal && setOpenModal(false)}
    >
      <Modal.Body className={styles.modalBody}>
        <div>
          <img src={robotLogin} alt='' />
        </div>
        <div className={styles.modalContentWrapper}>
          <h3>Welcome to HyperStore!</h3>
          <p>
            Are you ready to explore the most popular and cutting-edge AI applications? Join our
            community and be a part of the future of AI.
          </p>
          <div className={styles.modalButtons}>
            <GoogleLogin
              clientId={clientId}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy='single_host_origin'
              isSignedIn={false}
              render={(renderProps: any) => (
                <button
                  className={styles.googleButton}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <div className={styles.buttonContent}>
                    <img src={google} alt='' />
                    Continue with Google
                  </div>
                </button>
              )}
            />

            <Button
              className='mt-3'
              variant='dark'
              onClick={() => (window.location.href = discordAuthUrl)}
            >
              <div className={styles.buttonContent}>
                <span className={styles.discordIcon}>
                  <BsDiscord />
                </span>
                <span>Continue with Discord</span>
              </div>
            </Button>
            <MetaMaskConnect setOpenModal={setOpenModal} title='Continue with Metamask' />
          </div>

          {/* <ReCAPTCHA sitekey='6LdFHggnAAAAAMZcMxW-sC5jq4mnKtA4Jh1pORUl' onChange={handleRecaptcha} /> */}
          <div className={styles.bottomModal}>
            <p>Continue with email</p>
            {isLogin && !forgot ? (
              // Login Form
              <div className={styles.emailWrapper}>
                <input
                  value={emailInput}
                  onChange={handleEmailChange}
                  type='text'
                  placeholder='Please enter your email address'
                />
                {/* <input
                  value={passwordInput}
                  onChange={handlePasswordChange}
                  type='password'
                  placeholder='Please enter your password'
                /> */}
                <button onClick={handleLogin} className={styles.loginButton}>
                  Continue
                </button>

                <a
                  target='_blank'
                  href='https://metamask.io/download/'
                  className={styles.downloadMetamask}
                  rel='noreferrer'
                  style={{marginLeft: '300px'}}
                >
                  Download Metamask
                </a>

                {/* <div className={styles.authText} >
                  New here?{' '}
                  <span className={styles.signUp} onClick={() => setIsLogin(false)}>
                    Sign Up
                  </span>
                </div> */}
                {/* <div className={styles.authText} >
                  <span className={styles.signUp} onClick={() => setForgot(true)} >
                    Forgot your password
                  </span>
                </div> */}
              </div>
            ) : (
              // Register Form
              !forgot && (
                <div>
                  <form className={styles.emailWrapper} onSubmit={handleSubmit}>
                    <input
                      onChange={handleEmailChange}
                      value={emailInput}
                      type='text'
                      placeholder='Please enter your email address'
                    />
                    <input
                      onChange={handlePasswordChange}
                      value={passwordInput}
                      type='password'
                      placeholder='Please enter your password'
                    />
                    <input
                      onChange={handleConfirmPasswordChange}
                      value={confirmPassword}
                      type='password'
                      placeholder='Please re-enter your password'
                    />
                    <button type='submit' className={styles.loginButton}>
                      Sign Up
                    </button>
                  </form>
                  <div className={styles.authText}>
                    Already have an account?{' '}
                    <span className={styles.login} onClick={() => setIsLogin(true)}>
                      Login
                    </span>
                  </div>
                </div>
              )
            )}
            {forgot && (
              <div>
                <form className={styles.emailWrapper} onSubmit={handleForgot}>
                  <input
                    onChange={(event: any) => setEmailForgot(event.target.value)}
                    value={emailForgot}
                    type='text'
                    placeholder='Please enter your email address'
                  />

                  <button type='submit' className={styles.loginButton}>
                    Reset Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CustomModal
