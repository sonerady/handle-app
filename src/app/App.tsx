import {Suspense, useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {useAuthService} from './services/authService'
import 'prismjs/themes/prism-twilight.css'
import Prism from 'prismjs'
import {useGlobal} from './context/AuthContext'
import {useAPI} from './api'
import AlertImage from '../_metronic/assets/alert.jpg'
import ModalOther from '../_metronic/layout/components/walletModal/walletModal'
import {ToastContainer, toast} from 'react-toastify'
import CustomModal from '../_metronic/layout/components/walletModal/walletModal'

const App = () => {
  const {
    setBalance,
    accessToken,
    setAccessToken,
    activeBalance,
    showErrorImage,
    setShowErrorImage,
    setIsLoginMetamask,
    showGlobalAlert,
    code,
    imageData,
    openModal,
    setOpenModal,
    googleAccessToken,
    discordAccessToken,
    mailAccessToken,
    metamaskAccessToken,
    setRoles,
    password,
    triggerLogin,
    setTriggerLogin,
    avatarUrl,
    userName,
    profileAccount,
    account,
    userInfo,
    discordID,
    setDiscordID,
    discordUsername,
    setDiscordUsername,
    gmailUsername,
    setGmailUsername,
    discordEmail,
    setDiscordEmail,
    gmailEmail,
    setGmailEmail,
    discordIcon,
    setDiscordIcon,
    gmailIcon,
    setGmailIcon,
    setMailAccessToken,
    userIsVerified,
    setUserIsVerified,
    validUsername,
    validEmail,
    showAnnouncement,
    setShowAnnouncement,
    discordRole,
  } = useGlobal()
  const {getRole, getUserId, updateUser, getUserInfo, getTokenBalance, getAllApps} =
    useAuthService()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const api = useAPI()

  const navigate = useNavigate()

  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)

  const mail = searchParams.get('email')

  useEffect(() => {
    setMailAccessToken(mail)
  }, [mail])

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  useEffect(() => {
    if (showErrorImage) {
      setTimeout(() => {
        setShowErrorImage(false)
      }, 3000) // 3 saniye sonra hata resmini gizle
    }
  }, [showErrorImage])

  const accessTokenMarketplace = localStorage.getItem('accessTokenMarketplace')

  useEffect(() => {
    if (accessTokenMarketplace || accessToken) {
      getUserInfo()
    }
  }, [accessTokenMarketplace, navigate, window.location.pathname, accessToken])

  const addUser = async (
    email: any, // 1
    metamask: any, // 3
    discord_token: any, // 4
    gmail_token: any, // 5
    icon: any, // 6
    username: any, // 7
    discord_id: any, // 8
    discord_username: any, // 9
    gmail_username: any, // 10
    discord_email: any, // 11
    gmail_email: any // 12
  ) => {
    try {
      let queryString = `email=${email ? email : ''}&`
      queryString += `metamask=${metamask ? metamask : ''}&`
      queryString += `discord_token=${discord_token ? discord_token : ''}&`
      queryString += `gmail_token=${gmail_token ? gmail_token : ''}&`
      queryString += `icon=${icon ? icon : ''}&`
      queryString += `username=None&`
      queryString += `discord_id=${discord_id ? discord_id : ''}&`
      queryString += `discord_username=${discord_username ? discord_username : ''}&`
      queryString += `gmail_username=${gmail_username ? gmail_username : ''}&`
      queryString += `discord_email=${discord_email ? discord_email : ''}&`
      queryString += `gmail_email=${gmail_email ? gmail_email : ''}&`
      queryString = queryString.slice(0, -1)

      const response = await api.post(`/user/addUser?${queryString}`, {})
      return response.data
    } catch (error) {}
  }

  const getBalance = async (accesTokenOther: any) => {
    try {
      const response = await api.get(`/user/getBalance?token=${accesTokenOther}`, {
        headers: {
          Authorization: `Bearer ${accesTokenOther}`,
          'Content-Type': 'application/json',
        },
      })
      setBalance(response.data)
      localStorage.setItem('balanceee', response.data)
      return response.data
    } catch (error) {}
  }

  // useEffect(() => {
  //   if (!accessToken || !activeBalance || !code || !imageData) return
  //   getBalance(accessToken)
  // }, [accessToken])

  const signup = async (
    mailAccessToken: any,
    metamask: any,
    discordAccessToken: any,
    googleAccessToken: any
  ) => {
    setLoading(true)
    try {
      let requestBody = {
        email: mailAccessToken || 'None',
        password: 'None',
        metamask: metamask || 'None',
        discordToken: discordAccessToken || 'None',
        gmailToken: googleAccessToken || 'None',
        icon: 'None',
        valid: true,
      }

      // Check if both mailAccessToken and password are not 'None'
      if (mailAccessToken !== 'None' && password !== 'None') {
        requestBody.email = mailAccessToken ? mailAccessToken : 'None'
        requestBody.password = password ? password : 'None'
      }

      const response = await api.post(`/user/signup`, requestBody)
      return response.data
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (mailAccessToken && !validEmail.test(mailAccessToken)) {
        toast.error(
          "Invalid email format. Email must start with letters, numbers, or allowed symbols, followed by '@', then a domain name ending in a single letter. Please check and try again.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        )
      }
      try {
        if (
          (discordAccessToken && avatarUrl && discordID) ||
          metamaskAccessToken ||
          googleAccessToken ||
          mailAccessToken
        ) {
          const addUserResponse = await addUser(
            mailAccessToken, // 1
            metamaskAccessToken, // 3
            discordAccessToken, // 4
            googleAccessToken, // 5
            avatarUrl, // 6
            'None', // 7
            discordID, // 8
            discordUsername, // 9
            gmailUsername, // 10
            discordEmail, // 11
            gmailEmail // 12
          )
          // if (addUserResponse.status) {
          //   toast.success('Success', {
          //     position: toast.POSITION.TOP_RIGHT,
          //   })
          // } else {
          //   toast.error(addUserResponse.user, {
          //     position: toast.POSITION.TOP_RIGHT,
          //   })
          // }
          if (!addUserResponse.status && !localStorage.getItem('disLogin')) {
            // User already exists, so update the user
            await updateUser(
              userInfo?.data?.uid ? userInfo?.data?.uid : addUserResponse.user_id, // user_uid
              userInfo?.data?.gmailToken ? userInfo?.data?.gmailToken : googleAccessToken, // gmailToken
              userInfo?.data?.discordToken ? userInfo?.data?.discordToken : discordAccessToken, // discordToken
              userInfo?.data?.metamaskID ? userInfo?.data?.metamaskID : account, // metamask_id
              userInfo?.data?.icon ? userInfo?.data?.icon : userInfo?.data?.icon, // icon
              userInfo?.data?.username ? userInfo?.data?.username : userName, // username
              userInfo?.data?.discord_username ? userInfo?.data?.discord_username : discordUsername, // discord_username
              'None', // discord_icon
              userInfo?.data?.gmail_username ? userInfo?.data?.gmail_username : gmailUsername, // gmail_username
              'None', // gmail_icon
              userInfo?.data?.discord_emaik ? userInfo?.data?.discord_email : discordEmail,
              userInfo?.data?.gmail_email ? userInfo?.data?.gmail_email : gmailEmail,
              userInfo?.data?.discord_id ? userInfo?.data?.discord_id : discordID,
              userInfo?.data?.discord_role ? userInfo?.data?.discord_id : discordRole
            )
          }
          if (
            addUserResponse ||
            discordAccessToken ||
            googleAccessToken ||
            mailAccessToken ||
            metamaskAccessToken
          ) {
            const signupResponse = await signup(
              mailAccessToken,
              metamaskAccessToken,
              discordAccessToken,
              googleAccessToken
            )
            if (mailAccessToken && signupResponse.user === 'User is not active') {
              toast.success('Please check your e-mail address', {
                position: toast.POSITION.BOTTOM_RIGHT,
              })
            }
            if (signupResponse === null) {
              toast.error('Incorrect username or password.', {
                position: toast.POSITION.BOTTOM_RIGHT,
              })
            } else if (signupResponse && signupResponse.access_token) {
              getUserId(signupResponse.access_token)
              setAccessToken(signupResponse.access_token)
              if (signupResponse.is_verified === true) {
                setShowAnnouncement(true)
                localStorage.setItem('isVerifiedUser', signupResponse.is_verified)
              }

              localStorage.setItem('accessTokenMarketplace', signupResponse.access_token)
              localStorage.setItem('login', 'success')
              localStorage.setItem('avatarUrl', avatarUrl)
              localStorage.setItem('userName', userName)
              setIsLoginMetamask(true)
              setUserIsVerified(signupResponse.is_verified)
              if (discordAccessToken) {
                getRole(signupResponse.access_token)
              }
              // if (metamaskAccessToken && signupResponse.access_token) {
              //   getTokenBalance()
              // }

              setOpenModal(false)
              // toast.success('Signup was successful!', {
              //   position: toast.POSITION.TOP_RIGHT,
              // })
            } else if (
              signupResponse.status === false &&
              signupResponse.user === 'User is not active'
            ) {
              // toast.error('User is not active.', {
              //   position: toast.POSITION.BOTTOM_RIGHT,
              // })
            }
          }
        }
      } catch (error) {
        console.error('Error during fetching data:', error)
      }
    }

    fetchData()
  }, [
    mailAccessToken,
    googleAccessToken,
    metamaskAccessToken,
    discordAccessToken,
    setTriggerLogin,
    triggerLogin,
    avatarUrl,
    userName,
  ])

  useEffect(() => {
    const intervalId = async () => {
      if (accessToken) {
        try {
          const balanceResponse = await getBalance(accessToken)
          if (balanceResponse) {
            setBalance(balanceResponse)
          }
        } catch (error) {
          console.error('Error during fetching balance:', error)
        }
      }
    }

    intervalId()
  }, [activeBalance, code, imageData])

  useEffect(() => {
    if (discordAccessToken) {
      getRole(accessTokenMarketplace)
    }
  }, [profileAccount])

  useEffect(() => {
    if (!accessToken) return
    getAllApps(1, 20)
  }, [accessToken])

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      {/* <Loading /> */}
      <div
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
      >
        <CustomModal />
      </div>
      {showGlobalAlert && (
        <div
          className='alert alert-warning alert-dismissible fade show position-absolute top-0 w-50 mt-4 start-50 translate-middle-x'
          role='alert'
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span>
            Oops, it looks like your account balance is insufficient to complete this transaction.
            Don't worry though, you have 100 daily credits that are renewed every day. Keep going
            and make the most of them!
          </span>
        </div>
      )}

      {showErrorImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            style={{
              borderRadius: '1rem',
              margin: '1rem',
            }}
            src={AlertImage}
            alt='Error'
          />
        </div>
      )}
      <I18nProvider>
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <LayoutProvider>
          <AuthInit>
            {/* {loading ? <Loading /> : <Outlet />} */}
            <Outlet />

            <MasterInit />
          </AuthInit>
        </LayoutProvider>
      </I18nProvider>

      {openModal && <ModalOther openModal={openModal} setOpenModal={setOpenModal} />}
    </Suspense>
  )
}

export {App}
