import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Layout from './Home'
import styles from './MailVerification.module.scss'
import {useAuthService} from '../../services/authService'
import {FiMail} from 'react-icons/fi'

const MailVerification = () => {
  const [message, setMessage] = useState('')
  let location = useLocation()
  const {verification} = useAuthService()
  let searchParams = new URLSearchParams(location.search)
  const url_safe = searchParams.get('url_safe')
  const token = searchParams.get('token')

  let navigate = useNavigate()

  useEffect(() => {
    async function verify() {
      const result = await verification(url_safe, token)
      if (result?.status === 200) {
        localStorage.setItem('isVerifiedUser', 'true')
        setMessage(
          'Your account has been successfully activated. You are being redirected to the homepage.'
        )

        setTimeout(() => navigate('/marketplace'), 600000)
      } else {
        setMessage('Verification failed')
      }
    }
    verify()
  }, [url_safe, token, navigate])

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
