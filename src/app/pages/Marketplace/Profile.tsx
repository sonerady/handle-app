import React, {useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Layout from './Home'
import styles from './Profile.module.scss'
import Title from './components/Title'
import DiscordButton from '../Marketplace/components/DiscordButton'
import GoogleButton from '../Marketplace/components/GoogleButton'
import {useGlobal} from '../../context/AuthContext'
import UserLogo from '../../../_metronic/assets/marketplace/UserLogo.svg'
import {useAuthService} from '../../services/authService'
import MetaMaskConnect from '../../../_metronic/layout/components/Metamask/metamaskProfile'
import {toast} from 'react-toastify'
import {Modal, Button, InputGroup, FormControl} from 'react-bootstrap'
import {BsCheckCircleFill} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import {CropperRef, Cropper, FixedCropper, ImageRestriction} from 'react-advanced-cropper'

interface CollectionProps {}

const Collection: React.FC<CollectionProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isLogin = localStorage.getItem('accessTokenMarketplace') || ''
  const [inputValue, setInputValue] = useState('')
  const [openInput, setOpenInput] = useState(false)
  const [newUserName, setNewUserName] = useState<any>('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const cropperRef = useRef<CropperRef | any>(null)

  const {
    setAllCollection,
    accessToken,
    userInfo,
    setOpenModal,
    showPopup,
    setShowPopup,
    validEmail,
    isValidate,
    setIsValidate,
    validUsername,
  } = useGlobal()
  const gmailToken = localStorage.getItem('googleAccessToken') || ''
  const metamaskToken = localStorage.getItem('metamaskAccount') || ''
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const discordToken = localStorage.getItem('discordAccessToken') || ''
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [verifyEmail, setVerifyEmail] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const isVerified = userInfo?.data?.is_verified

  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleCloseUsernameModal = () => setShowUsernameModal(false)
  const handleOpenUsernameModal = () => setShowUsernameModal(true)

  const handleCloseEmailModal = () => setShowEmailModal(false)
  const handleOpenEmailModal = () => setShowEmailModal(true)

  const {
    addCollection,
    getAllCollection,
    updateUser,
    fileUpload,
    getUserInfo,
    resetPassword,
    verifyProfile,
    profileVerification,
  } = useAuthService()

  const [params, setParams] = useState<{
    name?: string
    content?: string
    description?: string
    badge?: string
    icon?: string
    rate?: string
  }>({})

  let searchParams = new URLSearchParams(location.search)

  const url_safe = searchParams.get('url_safe')

  useEffect(() => {
    async function verify() {
      const result = await profileVerification(url_safe)
      if (result?.status === 200) {
        toast.success(result?.Desc)
        setShowUsernameModal(false)
        getUserInfo()
        setIsValidate(true)
        if (result?.show_popup) {
          setShowPopup(true)
          setShowUsernameModal(false)
        }
      } else {
        toast.error(result?.Desc)
      }
    }
    if (url_safe) {
      verify()
    }
  }, [url_safe])

  const handleVerify = async () => {
    try {
      if (validEmail.test(verifyEmail)) {
        const response = await verifyProfile(verifyEmail)
        if (response?.status === 200) {
          toast.success(response.desc, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          handleCloseEmailModal()
          getUserInfo()
        } else {
          toast.error(response.desc, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          handleCloseEmailModal()
        }
      } else {
        toast.error(
          "Invalid email format. Email must start with letters, numbers, or allowed symbols, followed by '@', then a domain name ending in a single letter. Please check and try again.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        )
      }
    } catch (error: string | any) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    getUserInfo()
  }, [])

  const handleReset = async () => {
    if (oldPassword.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error('No value can be empty!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }

    try {
      const response = await resetPassword(oldPassword, newPassword)
      if (response.Status !== 400) {
        toast.success('Password updated successfully', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error('Password update failed', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } catch (error: string | any) {
      toast.error('Password update failed', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = async function () {
        const formData = new FormData()
        formData.append('file', file)

        try {
          const imageLink = await fileUpload(formData) // I assume that this function sends the request
          if (imageLink) {
            toast.success('Operation completed successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
            const response = await updateUser(
              userInfo?.data.uid,
              userInfo?.data.gmailToken ?? 'None',
              userInfo?.data.discordToken ?? 'None',
              userInfo?.data.metamaskID ?? 'None',
              imageLink.link,
              userInfo?.data.username ?? 'None',
              userInfo?.data.discord_username ?? 'None',
              userInfo?.data.discord_icon ?? 'None',
              userInfo?.data.gmail_username ?? 'None',
              userInfo?.data.gmail_icon ?? 'None'
            )
            if (response) {
              getUserInfo()
            }
          }
        } catch (error) {
          console.error('Error uploading file:', error)
        }
      }
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    setParams({
      name: searchParams.get('name') || undefined,
      content: searchParams.get('content') || undefined,
      description: searchParams.get('description') || undefined,
      badge: searchParams.get('badge') || undefined,
      icon: searchParams.get('icon') || undefined,
      rate: searchParams.get('rate') || undefined,
    })
  }, [location.search])

  const handleCollection = async () => {
    if (inputValue.trim() === '') {
      setError('An empty value cannot be entered !')
      return
    }
    try {
      await addCollection(inputValue)
      setInputValue('')
      const newCollection = await getAllCollection(accessToken) // all collections from API
      setAllCollection(newCollection) // update the state with the new collection
      setError(null) // Hata mesajını temizle
    } catch (error: string | any) {
      console.error(error)
    }
  }

  const handleUpdateUserName = async () => {
    const trimmedNewUserName = newUserName.trim()
    try {
      if (validUsername.test(newUserName)) {
        const response = await updateUser(
          userInfo?.data.uid,
          userInfo?.data.gmailToken ?? 'None',
          userInfo?.data.discordToken ?? 'None',
          userInfo?.data.metamaskID ?? 'None',
          userInfo?.data.icon ?? 'None',
          trimmedNewUserName
        )

        if (response.Status !== 400) {
          handleCloseUsernameModal()
          setNewUserName('')
          setError('')
          toast.success(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
            style: {background: 'green'},
          })
          getUserInfo()
        } else {
          toast.error(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
            style: {background: 'red'},
          })
        }
      } else {
        toast.error(
          'Username must start with a letter, be 5 to 30 characters long, and can only contain letters, numbers, and underscores.',
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            style: {background: 'red'},
          }
        )
      }
    } catch (error: string | any) {
      setError('Error updating username. Please try again later.')
      toast.error('Error updating username. Please try again later.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        style: {background: 'red'},
      })
    }
  }

  // useEffect(() => {
  //   if (!isLogin) {
  //     if (counter > 0) {
  //       const timer = setTimeout(() => setCounter(counter - 1), 1000)
  //       return () => clearTimeout(timer)
  //     } else {
  //       navigate('/marketplace')
  //     }
  //   }
  // }, [counter, isLogin, navigate])

  const discordAccessToken = localStorage.getItem('discordAccessToken') || ''
  const userInfoData = userInfo?.data || {}

  const {discord_username, gmail_username, username} = userInfoData

  const valueToShow =
    username !== '' && username !== null
      ? username
      : discord_username !== '' && discord_username !== null
      ? discord_username
      : gmail_username !== '' && gmail_username !== null
      ? gmail_username
      : 'Username'

  const handleProfileImageChange = (event: any) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null
    if (file) {
      setProfileImage(URL.createObjectURL(file))
      setShowModal(true)
    }
  }

  const handleProfileImageCrop = async () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas()
      if (canvas !== null) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve))
        if (blob !== null) {
          const formData = new FormData()
          formData.append('file', blob, 'profile-image.png')

          // You would need to have a method `fileUpload` to handle the upload.
          const imageLink = await fileUpload(formData)

          if (imageLink) {
            // Update the profile image URL with the response link.
            toast.success('Profile Image Upload completed successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
            getUserInfo()
            setShowModal(false)
            setProfileImage(null)
            getUserInfo()

            const response = await updateUser(
              userInfo?.data.uid,
              userInfo?.data.gmailToken ?? 'None',
              userInfo?.data.discordToken ?? 'None',
              userInfo?.data.metamaskID ?? 'None',
              imageLink.link,
              userInfo?.data.username ?? 'None',
              userInfo?.data.discord_username ?? 'None',
              userInfo?.data.discord_icon ?? 'None',
              userInfo?.data.gmail_username ?? 'None',
              userInfo?.data.gmail_icon ?? 'None'
            )
            if (response) {
              getUserInfo()
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    if (!isLogin && !userInfo?.data?.uid) {
      navigate('/marketplace')
    }
  }, [])

  if (!isLogin && !userInfo?.data?.uid) {
    return (
      <div>
        <h1>Redirecting to Marketplace...</h1>
      </div>
    )
  }

  return (
    <Layout>
      <Modal show={showUsernameModal} onHide={handleCloseUsernameModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              placeholder='New Username'
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onClick={() => setNewUserName(newUserName.trim())}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <button
            className={styles.saveButton}
            onClick={() => {
              handleUpdateUserName()
            }}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEmailModal} onHide={handleCloseEmailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              value={verifyEmail}
              placeholder='Verify Email'
              onChange={(e) => {
                setVerifyEmail(e.target.value)
              }}
              type='email'
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <button
            className={styles.saveButton}
            onClick={() => {
              handleVerify()
            }}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
      <div
        // style={{
        //   gridTemplateColumns: userInfo?.data?.email !== null ? '1fr 1fr ' : '1fr 1fr 1fr',
        // }}
        className={styles.profileWrapper}
      >
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <Title>PROFILE OVERVIEW</Title>
          <div className={styles.profileContent}>
            <div className={styles.profileImage}>
              <input
                type='file'
                onChange={handleProfileImageChange}
                style={{display: 'none'}}
                id='profile-image-upload'
              />
              <label htmlFor='profile-image-upload'>
                {userInfo?.data?.icon ? (
                  <img
                    src={userInfo?.data?.icon}
                    alt=''
                    style={{cursor: 'pointer'}}
                    className={styles.profileImg}
                    // onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                    //   e.target.onerror = null
                    //   e.target.src = UserLogo
                    // }}
                  />
                ) : (
                  ''
                )}
              </label>
              <div>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Crop Profile Image</Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    style={{
                      width: '750px',
                      height: '500px',
                    }}
                  >
                    {' '}
                    {profileImage && (
                      <>
                        <FixedCropper
                          ref={cropperRef}
                          src={profileImage}
                          className={'example__cropper-background'}
                          stencilProps={{
                            handlers: false,
                            lines: false,
                            movable: false,
                            resizable: false,
                          }}
                          stencilSize={{
                            width: 128,
                            height: 128,
                          }}
                          imageRestriction={ImageRestriction.stencil}
                        />
                        <button className={styles.cropButton} onClick={handleProfileImageCrop}>
                          Complete Cropping
                        </button>
                      </>
                    )}
                  </Modal.Body>
                </Modal>
              </div>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.profileContent}>
                <div className={styles.profileInfo} style={{marginTop: '-10px'}}>
                  <label
                    style={{
                      marginBottom: '-2px',
                    }}
                    htmlFor=''
                  >
                    Username
                  </label>
                  <input
                    style={{
                      background: 'none',
                      border: '1px solid #80808061',
                    }}
                    disabled
                    placeholder={'Username'}
                    value={valueToShow}
                  />

                  <Button
                    className={styles.gradiantText}
                    variant='link'
                    onClick={handleOpenUsernameModal}
                  >
                    {userInfo?.data?.username ? 'Change Username' : 'Add Username'}
                  </Button>
                </div>
              </div>
              {userInfo?.data?.email && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <label
                    style={{
                      marginBottom: '5px',
                    }}
                    htmlFor=''
                  >
                    Email
                  </label>
                  <div className={styles.emailWrapper}>
                    <input
                      style={{
                        width: '100%',
                        background: 'none',
                        border: '1px solid #80808061',
                      }}
                      disabled
                      value={userInfo?.data?.email ? userInfo?.data?.email : 'No email'}
                      placeholder='Verify Email'
                      onChange={(e) => {
                        setVerifyEmail(e.target.value)
                      }}
                      type='email'
                    />
                    <div className={styles.badge}>
                      {isVerified ? (
                        <BsCheckCircleFill color='#3AC318' />
                      ) : (
                        <AiFillCloseCircle color='red' />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* <input
                // value={userInfo?.data?.email ?? verifyEmail}
                value={verifyEmail}
                placeholder='New Email'
                onChange={(e) => {
                  setVerifyEmail(e.target.value)
                }}
                type='email'
              /> */}

              {/* <input
                onChange={(e) => setVerifyPassword(e.target.value)}
                type='password'
                placeholder='Password Password'
              />
              
              <input
                onChange={(e) => setVerifyPassword(e.target.value)}
                type='password'
                placeholder='Confirm New Password'
              /> */}

              {!isVerified && (
                <Button
                  className={styles.gradiantText}
                  variant='link'
                  onClick={handleOpenEmailModal}
                >
                  Verify Email
                </Button>
              )}
            </div>
          </div>
        </div>

        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <Title>ACCOUNTS</Title>
          <div className={styles.loginButtons}>
            <DiscordButton userInfo={userInfo} />
            <GoogleButton userInfo={userInfo} />
            <MetaMaskConnect imageLink={userInfo?.data?.icon} userInfo={userInfo} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Collection
