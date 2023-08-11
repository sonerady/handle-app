import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useGlobal} from '../../context/AuthContext'
import {useAuthService} from '../../services/authService'
import Layout from './Home'
import styles from './AddCampaign.module.scss'
import {toast} from 'react-toastify'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {Button, Form as BootstrapForm} from 'react-bootstrap'

const validationSchema = Yup.object({
  campaignName: Yup.string().required('Required'),
  imageLink: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  prize: Yup.string().required('Required'),
  start_date: Yup.date().required('Required'),
  end_date: Yup.date()
    .required('Required')
    .min(Yup.ref('start_date'), 'End date should be later than start date'),
})

interface CollectionProps {}

const Collection: React.FC<CollectionProps> = () => {
  const {accessToken} = useGlobal()
  const {addCampaign} = useAuthService()
  const navigate = useNavigate()

  const isLogin = localStorage.getItem('login') || ''
  const isAdmin = localStorage.getItem('role') || ''
  const [counter, setCounter] = useState(5)

  if (isAdmin !== 'HyperAdmin') {
    return (
      <Layout>
        <div className={styles.noLogin}>
          <div className={styles.noLoginContent}>
            <span>You are not authorized</span>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={styles.profileWrapper}>
        <span className={styles.gradiantText}>Create Campaign</span>
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <Formik
            initialValues={{
              campaignName: '',
              imageLink: '',
              description: '',
              prize: '',
              start_date: '',
              end_date: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, {resetForm}) => {
              try {
                const response = await addCampaign(
                  values.campaignName,
                  values.imageLink,
                  values.description,
                  values.prize,
                  values.start_date,
                  values.end_date
                )
                if (response) {
                  toast.success('Campaign created successfully', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  })
                  resetForm() // clear form inputs
                }
              } catch (error) {
                toast.error('An error occurred while creating the campaign', {
                  position: toast.POSITION.BOTTOM_RIGHT,
                })
              }
            }}
          >
            {({dirty, isValid}) => (
              <Form className={styles.form}>
                <BootstrapForm.Group controlId='formCampaignName'>
                  <BootstrapForm.Label className={styles.label}>Campaign Name</BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='campaignName'
                    type='text'
                    as={BootstrapForm.Control}
                    placeholder='Campaign Name'
                  />
                  <ErrorMessage name='campaignName' component='div' />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId='formImageLink'>
                  <BootstrapForm.Label className={styles.label}>Image Link</BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='imageLink'
                    type='text'
                    as={BootstrapForm.Control}
                    placeholder='Image Link'
                  />
                  <ErrorMessage name='imageLink' component='div' />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId='formDescription'>
                  <BootstrapForm.Label className={styles.label}>Description</BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='description'
                    type='text'
                    as={BootstrapForm.Control}
                    placeholder='Description'
                  />
                  <ErrorMessage name='description' component='div' />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId='formPrize'>
                  <BootstrapForm.Label className={styles.label}>Prize</BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='prize'
                    type='text'
                    as={BootstrapForm.Control}
                    placeholder='Prize'
                  />
                  <ErrorMessage name='prize' component='div' />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId='formStartDate'>
                  <BootstrapForm.Label className={styles.label}>Start Date</BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='start_date'
                    type='date'
                    as={BootstrapForm.Control}
                    placeholder='Start Date'
                  />

                  <ErrorMessage name='start_date' component='div' />
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId='formEndDate'>
                  <BootstrapForm.Label className={styles.label}>End Date</BootstrapForm.Label>
                  <Field
                    className={styles.input}
                    name='end_date'
                    type='date'
                    as={BootstrapForm.Control}
                    placeholder='End Date'
                  />
                  <ErrorMessage name='end_date' component='div' />
                </BootstrapForm.Group>

                <Button className={styles.submitButton} type='submit' disabled={!dirty || !isValid}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  )
}

export default Collection
