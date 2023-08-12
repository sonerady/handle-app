import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Layout from './Home'
import styles from './MailVerification.module.scss'
import {useAuthService} from '../../services/authService'
import {FiMail} from 'react-icons/fi'

const MailVerification = () => {
  const [message, setMessage] = useState('')
  let location = useLocation()
  const {verification, getUserInfo, verifyProfile} = useAuthService()
  let searchParams = new URLSearchParams(location.search)
  const parametre = searchParams.get('url_safe')

  let navigate = useNavigate()

  useEffect(() => {
    async function verify() {
      const result = await verifyProfile(parametre)
      if (result?.status === 200) {
        getUserInfo()
        setMessage(
          'Your account has been successfully activated. You are being redirected to the homepage.'
        )
      } else {
        setMessage('Verification failed')
      }
    }
    verify()
  }, [parametre])

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <span className={styles.icon}>
            <FiMail />
          </span>
          <span className={styles.mailText}>{message}</span>
        </div>
      </div>
    </Layout>
  )
}

export default MailVerification
