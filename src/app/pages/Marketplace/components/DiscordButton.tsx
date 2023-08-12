import {FC, ReactNode, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import styles from './components.module.scss'
import {useGlobal} from '../../../../app/context/AuthContext'
import {BsDiscord} from 'react-icons/bs'
import {gapi} from 'gapi-script'
import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

interface CustomModalProps {
  children?: ReactNode
  userInfo?: any
}

const CustomModal: FC<CustomModalProps> = ({userInfo}) => {
  const [isError, setIsError] = useState(false)

  const {
    setDiscordAccessToken,
    setAvatarUrl,
    setUserName,
    setAccessToken,
    setDiscordUsername,
    setDiscordEmail,
    setDiscordID,
    setOpenModal,
    setDiscordIcon,
    discordAccessToken,
  } = useGlobal()
  const {getRole, getUserInfo, connectDiscordAccount, logOut} = useAuthService()

  const navigate = useNavigate()

  const logoutDiscord = async () => {
    try {
      await logOut(localStorage.getItem('discordAccessToken'))
      localStorage.removeItem('discordAccessToken')
      localStorage.removeItem('discordID')
      localStorage.removeItem('discordUserName')
      localStorage.removeItem('accessTokenMarketplace')
      localStorage.removeItem('login')
      localStorage.removeItem('role')
      localStorage.removeItem('avatarUrl')
      localStorage.removeItem('userName')
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      setDiscordAccessToken(null)
      setAccessToken(null)
      setOpenModal(true)
      navigate('/marketplace')
    } catch (err) {
      console.error(err)
    }
  }

  const clientId = '441310728888-q1c41qas42v9a43j0288v96pj5bb71eu.apps.googleusercontent.com'

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

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fprofile&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections%20guilds.members.read`

  // const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=1121395648437174313&redirect_uri=https%3A%2F%2Fhypermarket.azurewebsites.net%2Fprofile&response_type=code&scope=identify%20guilds%20email%20guilds.join%20connections%20guilds.members.read`

  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  const redirectUri = 'http://localhost:8080/profile'
  // const redirectUri = 'https://hypermarket.azurewebsites.net/profile'

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
            setDiscordAccessToken(accessToken)
            localStorage.setItem('discordAccessToken', accessToken)
            if (discordAccessToken) {
              getRole()
            }

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

            setUserName(user.username)
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

            const discordId = user.id
            const discordToken = accessToken
            const discordIcon = avatarURL
            const discordUsername = user.username
            const discordEmail = user.email

            if (user) {
              const connectDiscord = await connectDiscordAccount(
                discordId,
                discordToken,
                discordIcon,
                discordUsername,
                discordEmail
              )
              if (connectDiscord.Status === 400) {
                setIsError(true)
                toast.error(connectDiscord.Description, {
                  position: toast.POSITION.BOTTOM_RIGHT,
                })
              } else {
                localStorage.setItem('disLogin', 'true')
              }
            }
            getUserInfo()
          }
        } catch (err) {
          console.error(err)
        }
      }
    }

    fetchTokenAndUserData()
  }, [code])

  const isLoginDiscord = localStorage.getItem('discordAccessToken')
  const disLogin = localStorage.getItem('disLogin')

  return (
    <Button
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
      }}
      className={styles.discordButton}
      variant='dark'
      onClick={() => {
        isLoginDiscord ? logoutDiscord() : (window.location.href = discordAuthUrl)
      }}
    >
      <div className={styles.buttonContent}>
        <span className={styles.discordIcon}>
          <BsDiscord />
        </span>
        <span className={styles.btnText}>
          {isLoginDiscord ? ' Disconnect Discord' : 'Connect Discord'}
        </span>
      </div>
    </Button>
  )
}

export default CustomModal
