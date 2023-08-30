import React, {useEffect, useState} from 'react'
import Layout from './Home'
import styles from './AddApp.module.scss'
import Title from './components/Title'
import {useGlobal} from '../../context/AuthContext'
import {useAuthService} from '../../services/authService'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {EditorState} from 'draft-js'
import 'react-tagsinput/react-tagsinput.css'
import AddAppInputs from './components/AddAppInputsAdmin'
import {FiEdit} from 'react-icons/fi'
import {AiOutlineEye} from 'react-icons/ai'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ApproveComments from './components/ApproveCommentsAdmin'
import ApproveApp from './components/ApproveAppAdmin'
import AddComment from './components/AddReview'
import {toast} from 'react-toastify'
import {useNavigate, useLocation, useParams} from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import {Modal} from 'react-bootstrap'
interface CollectionProps {}

type Category = {
  isactive: boolean
  parentid: number
  name: string
  createdAt: string
  id: number
}

const Collection: React.FC<CollectionProps> = () => {
  const {
    showNotification,
    setShowNotification,
    showNotificationForSize,
    setShowNotificationForSize,
    waitingAppsAdmin,
    setWaitingAppsAdmin,
    setTaskTypes,
    taskTypes,
    approvedApps,
    setApprovedApps,
    rejectedApps,
    setRejectedApps,
    approvalReviews,
    setApprovalReviews,
    userApprovedApps,
    setUserApprovedApps,
    userRejectedApps,
    setUserRejectedApps,
    accessToken,
    roles,
    userInfo,
    campaigns,
    setCampaigns,
  } = useGlobal()
  const {
    fileUpload,
    addAppAdmin,
    getCategories,
    getApprovedApps,
    getRejectedApps,
    getForApprovalReviews,
    getUserWaitingApp,
    getUserApprovedApp,
    getUserRejectedApp,
    getUserCampaignConditions,
    getWaitingForAdmin,
    getUserWaitingForAdmin,
    getWaitingReviewsForAdmin,
  } = useAuthService()
  const [error, setError] = useState<string | null>(null)
  const handleClose = () => setShow(false)
  const [forAdminReviews, setForAdminReviews] = useState<any>([])
  const [activeTab, setActiveTab] = useState(0)
  const [show, setShow] = useState(false)
  const [activeTabApps, setActiveTabApps] = useState(0)
  const [task, setTask] = useState(2)
  const [data, setData] = useState('')
  const [addedApp, setAddedApp] = useState(false)
  const [userWaitingAppsAdmin, setUserWaitingAppsAdmin] = useState<any>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const handleChange = (event: any, editor: any) => {
    const data = editor.getData()
    setData(data)
  }
  const [isverified, setIsverified] = useState(false)
  const [isfeautured, setIsfeautured] = useState(false)
  const [isnew, setIsnew] = useState(false)
  const [istrending, setIstrending] = useState(false)

  const navigate = useNavigate()
  const discordID = userInfo?.data?.discord_id

  const [counter, setCounter] = useState(5)

  const [descState, setDescState] = useState(EditorState.createEmpty())
  const [contentState, setContentState] = useState(EditorState.createEmpty())
  const [fileNames, setFileNames] = useState({
    image1: '630x420',
    image2: '630x420',
    image3: '630x420',
    image4: '630x420',
    image5: '630x420',
    icon: '64x64',
  })

  const [backgrounds, setBackgrounds] = useState({
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    icon: '',
  })

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 2000)
      return () => clearTimeout(timer) // Cleanup function
    }
  }, [error]) // Hata durumu değiştiğinde bu Hook çalışır

  useEffect(() => {
    formik.setFieldValue('discordid', discordID)
  }, [discordID])

  const formik = useFormik({
    initialValues: {
      discordid: discordID,
      category: [],
      name: '',
      title: '',
      description: '',
      icon: '',
      link: '',
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
      isverified: isverified,
      isfeautured: isfeautured,
      isnew: isnew,
      istrending: istrending,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      icon: Yup.string().required('Required'),
      link: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {},
  })

  const handleAddApp = async () => {
    try {
      if (
        formik.values.image1 ||
        formik.values.image2 ||
        formik.values.image3 ||
        formik.values.image4 ||
        formik.values.image5
      ) {
        const response = await addAppAdmin(formik.values)

        if (response.Status === 400) {
          toast.error(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else if (response.status) {
          toast.success('Operation completed successfully!', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          formik.resetForm()
          setSelectedCategories([])

          window.scrollTo(0, 0)
          setAddedApp(true)
        }
      } else {
        toast.error('Please fill in the required fields.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
      setBackgrounds({
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
        icon: '',
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    const isSelected = selectedCategories.includes(categoryName)

    if (isSelected) {
      setSelectedCategories((prevSelected) => prevSelected.filter((name) => name !== categoryName))
    } else {
      if (selectedCategories.length < 5) {
        setSelectedCategories((prevSelected) => [...prevSelected, categoryName])
      } else {
        toast.error('You can only select up to 5 categories.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    }
  }

  function truncate(str: any, num: any) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  // CATEGORY SETTINS

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (accessToken && task === 4) {
      getCategories().then((res) => {
        setCategories(res)
      })

      getUserCampaignConditions()
    }
  }, [accessToken, task])

  // useEffect(() => {
  //   if (accessToken) {
  //     if (activeTab === 0 || task === 1) {
  //       getWaitingForAdmin().then((res) => {
  //         setWaitingAppsAdmin(res)
  //       })
  //     } else if (activeTab === 2) {
  //       getRejectedApps().then((res) => {
  //         setRejectedApps(res)
  //       })
  //     }
  //     if (task === 2 || activeTab === 1) {
  //       getApprovedApps().then((res) => {
  //         setApprovedApps(res)
  //       })
  //     }
  //   }
  // }, [activeTab, task, addedApp, accessToken])

  useEffect(() => {
    if (accessToken) {
      if (activeTab === 0) {
        getWaitingForAdmin().then((res) => {
          setWaitingAppsAdmin(res)
        })
      } else if (activeTab === 1) {
        getUserApprovedApp().then((res) => {
          setUserApprovedApps(res)
        })
      } else if (activeTab === 2) {
        getUserRejectedApp().then((res) => {
          setUserRejectedApps(res)
        })
      }
    }
  }, [addedApp, accessToken])

  useEffect(() => {
    if (accessToken) {
      if (task === 3) {
        getWaitingReviewsForAdmin().then((res) => {
          setForAdminReviews(res)
        })
      }
    }
  }, [activeTab, task, addedApp, accessToken])

  useEffect(() => {
    formik.setFieldValue('category', selectedCategories)
  }, [selectedCategories])

  let location = useLocation()
  let searchParams = new URLSearchParams(location.search)
  const parametre = searchParams.get('task')

  useEffect(() => {
    if (parametre === 'add-app') {
      setTask(4)
    } else if (parametre === 'approve-app') {
      setTask(1)
    } else if (parametre === 'approve-comment') {
      setTask(3)
    } else if (parametre === 'add-comment') {
      setTask(2)
    }
  }, [parametre])

  const isAdmin = userInfo?.data?.admin_roles

  // useEffect(() => {
  //   if (!isAdmin?.length) {
  //     navigate('/marketplace')
  //   }
  // }, [])

  if (!isAdmin?.length) {
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
        <div style={{border: 'none'}} className={`${styles.card} ${styles.top} card`}>
          <div className={styles.taskItem}>
            <div
              style={{
                display: 'flex',
              }}
              className={styles.taskWrapper}
            >
              <div
                className={`${styles.tasks} ${styles.isAdmin}`}
                onClick={() => {
                  setTask(4)
                }}
              >
                <span>Add App</span>
              </div>
              {/* <div
                className={`${styles.tasks} ${styles.isAdmin}`}
                onClick={() => {
                  setTask(3)
                }}
              >
                <span>Waiting Reviews</span>
              </div> */}

              <div
                className={`${styles.tasks} ${styles.isAdmin}`}
                onClick={() => {
                  setTask(2)
                }}
              >
                <span>Waiting Apps</span>
              </div>
            </div>
          </div>
        </div>

        {/* ADD YOUR APP */}
        {task === 4 && activeTabApps === 0 && (
          <AddAppInputs
            isVerified={isverified}
            setIsVerified={setIsverified}
            isFeatured={isfeautured}
            setIsFeatured={setIsfeautured}
            isNew={isnew}
            setIsNew={setIsnew}
            isTrending={istrending}
            setIsTrending={setIstrending}
            contentState={contentState}
            setContentState={setContentState}
            categories={categories}
            setCategories={setCategories}
            handleCategoryClick={handleCategoryClick}
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
            setBackgrounds={setBackgrounds}
            backgrounds={backgrounds}
            fileUpload={fileUpload}
            setFileNames={setFileNames}
            fileNames={fileNames}
            handleAddApp={handleAddApp}
            formik={formik}
            descState={descState}
            setDescState={setDescState}
          />
        )}
        {task === 3 && (
          <div style={{border: 'none'}} className={`${styles.approvalContainer}  card`}>
            {forAdminReviews?.map((item: any, index: any) => {
              return (
                <ApproveComments
                  getWaitingReviewsForAdmin={getWaitingReviewsForAdmin}
                  forAdminReviews={forAdminReviews}
                  setForAdminReviews={setForAdminReviews}
                  item={item}
                />
              )
            })}
          </div>
        )}
        {task === 1 && (
          <div style={{border: 'none'}} className={`${styles.card} ${styles.left} card`}>
            <ApproveApp
              getWaitingForAdmin={getWaitingForAdmin}
              setWaitingAppsAdmin={setWaitingAppsAdmin}
              waitingApps={waitingAppsAdmin}
              task={task}
              activeTab={activeTab}
            />
          </div>
        )}
        {task === 2 && (
          <div style={{border: 'none'}} className={`${styles.card} ${styles.left} card`}>
            <ApproveApp
              getWaitingForAdmin={getWaitingForAdmin}
              setWaitingApps={setWaitingAppsAdmin}
              waitingApps={waitingAppsAdmin}
              task={task}
              activeTab={activeTab}
            />
          </div>
        )}

        <Modal
          size='lg'
          style={{
            padding: '2rem',
          }}
          show={show}
          onHide={handleClose}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className={`${styles.profileWrapper} ${styles.modalProfile}`}>
              <div style={{border: 'none'}} className={`${styles.card} ${styles.top} card`}>
                <AddAppInputs
                  setSelectedCategories={setSelectedCategories}
                  isVerified={isverified}
                  setIsVerified={setIsverified}
                  isFeatured={isfeautured}
                  setIsFeatured={setIsfeautured}
                  isNew={isnew}
                  setIsNew={setIsnew}
                  isTrending={istrending}
                  setIsTrending={setIstrending}
                  contentState={contentState}
                  setContentState={setContentState}
                  categories={categories}
                  setCategories={setCategories}
                  handleCategoryClick={handleCategoryClick}
                  selectedCategories={selectedCategories}
                  setBackgrounds={setBackgrounds}
                  backgrounds={backgrounds}
                  fileUpload={fileUpload}
                  setFileNames={setFileNames}
                  fileNames={fileNames}
                  handleAddApp={handleAddApp}
                  formik={formik}
                  descState={descState}
                  setDescState={setDescState}
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  )
}

export default Collection
