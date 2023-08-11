import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {useGlobal} from '../../context/AuthContext'
import {useAuthService} from '../../services/authService'
import Layout from './Home'
import styles from './AddCampaign.module.scss'
import {toast} from 'react-toastify'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {Button, Form as BootstrapForm} from 'react-bootstrap'

const validationSchema = Yup.object({
  password: Yup.string().required('Required'),
  confirmPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})
const ForgotPassword = () => {
  let location = useLocation()
  const {sendForgotVerification} = useAuthService()
  let searchParams = new URLSearchParams(location.search)
  const parametre = searchParams.get('url_safe')
  let navigate = useNavigate()

  return (
    <Layout>
      <div className={styles.profileWrapper}>
        <span className={styles.gradiantText}>Reset Password</span>
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <Formik
            initialValues={{
              parametre: parametre,
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, {resetForm}) => {
              try {
                const response = await sendForgotVerification(values.parametre, values.password)
                if (response) {
                  toast.success('Change password successfully', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  })
                  resetForm() // clear form inputs
                  setTimeout(() => {
                    navigate('/marketplace')
                  }, 2000)
                }
              } catch (error) {
                toast.error('Change password failed', {
                  position: toast.POSITION.BOTTOM_RIGHT,
                })
              }
            }}
          >
            {({dirty, isValid}) => (
              <Form className={styles.form}>
                <BootstrapForm.Group controlId='formCampaignName'>
                  <BootstrapForm.Label className={styles.label}>New Password</BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='password'
                    type='text'
                    as={BootstrapForm.Control}
                    placeholder='New Password'
                  />
                  <ErrorMessage name='password' component='div' />
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId='formCampaignName'>
                  <BootstrapForm.Label className={styles.label}>
                    Confirm New Password
                  </BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='confirmPassword'
                    type='text'
                    as={BootstrapForm.Control}
                    placeholder='Confirm New Password'
                  />
                  <ErrorMessage name='confirmPassword' component='div' />
                </BootstrapForm.Group>
                <Button className={styles.submitButton} type='submit'>
                  Submit New Password
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default ForgotPassword
