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
import AddAppInputs from './components/AddAppInputs'
import AddAppInputsUpdate from './components/UpdateAppInputs'
import {FiEdit} from 'react-icons/fi'
import {AiOutlineEye} from 'react-icons/ai'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ApproveComments from './components/ApproveComments'
import ApproveApp from './components/ApproveApp'
import AddComment from './components/AddReview'
import {toast} from 'react-toastify'
import {useNavigate, useLocation, useParams} from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import {Modal} from 'react-bootstrap'
import moment from 'moment'
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
    setShowNotification,
    showNotificationForSize,
    setShowNotificationForSize,
    waitingApps,
    setWaitingApps,
    setTaskTypes,
    taskTypes,
    approvedApps,
    setApprovedApps,
    rejectedApps,
    setRejectedApps,
    approvalReviews,
    setApprovalReviews,
    userWaitingApps,
    setUserWaitingApps,
    userApprovedApps,
    setUserApprovedApps,
    userRejectedApps,
    setUserRejectedApps,
    accessToken,
    campaignsUser,
    setCampaignsUser,
  } = useGlobal()
  const {
    fixApp,
    addApp,
    fileUpload,
    getTaskTypes,
    getCategories,
    getWaitingApps,
    getApprovedApps,
    getRejectedApps,
    getUserWaitingApp,
    getUserApprovedApp,
    getUserRejectedApp,
    getForApprovalReviews,
    getUserCampaignConditions,
  } = useAuthService()
  let location = useLocation()
  const navigate = useNavigate()
  const [task, setTask] = useState(3)
  const [data, setData] = useState('')
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const [activeTab, setActiveTab] = useState(0)

  const [addedApp, setAddedApp] = useState(false)
  const [reasonData, setReasonData] = useState('')
  const isDiscordUser = localStorage.getItem('isVerifiedUser')
  const discordID = localStorage.getItem('discordID')
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [activeTabApps, setActiveTabApps] = useState(0)
  let searchParams = new URLSearchParams(location.search)
  const [error, setError] = useState<string | null>(null)
  const parametre = searchParams.get('task')
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [descState, setDescState] = useState(EditorState.createEmpty())
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [contentState, setContentState] = useState(EditorState.createEmpty())
  const [categories, setCategories] = useState<Category[]>([])

  const taskOrder = ['Add App', 'Approve App', 'Add Comment', 'Approve Comment']

  const sortedCampaigns = (campaignsUser as {task_name: string}[]).sort((a, b) => {
    const aIndex = taskOrder.indexOf(a.task_name)
    const bIndex = taskOrder.indexOf(b.task_name)
    return aIndex - bIndex
  })

  const handleCloseReasonModal = () => {
    setShowReasonModal(false)
  }
  const handleChange = (event: any, editor: any) => {
    const data = editor.getData()
    setData(data)
  }

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
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      title: Yup.string().required('Required'),
      // description: Yup.string().required('Required'),
      icon: Yup.string().required('Required'),
      link: Yup.string().url('Must be a valid URL').required('Required'),
    }),
    onSubmit: async (values) => {},
  })

  const handleAddApp = async (type: any, appid: any) => {
    try {
      if (
        formik.values.image1 ||
        formik.values.image2 ||
        formik.values.image3 ||
        formik.values.image4 ||
        formik.values.image5
      ) {
        if (type === 'fix') {
          const response = await fixApp(formik.values, appid)
          if (response.Status === 400) {
            toast.error(response.Description, {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
          } else if (response.status) {
            // Handle the success case
            toast.success('Operation completed successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
            getUserCampaignConditions()

            formik.resetForm()
          }
        } else {
          const response = await addApp(formik.values)

          if (response.Status === 400) {
            toast.error(response.Description, {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
          } else if (response.status) {
            toast.success('Operation completed successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
            getUserCampaignConditions()

            formik.resetForm()
          }
        }
        setAddedApp(true)
        setSelectedCategories([])
        window.scrollTo(0, 0)

        getRejectedApps().then((res) => {
          setRejectedApps(res)
        })

        handleClose()
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
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter((name) => name !== categoryName))
    } else {
      setSelectedCategories([...selectedCategories, categoryName])
    }
  }

  function truncate(str: any, num: any) {
    if (str?.length <= num) {
      return str
    }
    return str?.slice(0, num) + '...'
  }

  // CATEGORY SETTINS

  useEffect(() => {
    if (accessToken) {
      getCategories().then((res) => {
        setCategories(res)
      })
      getUserCampaignConditions()
    }
  }, [accessToken])

  useEffect(() => {
    if (accessToken) {
      if (activeTab === 0 || task === 1) {
        getWaitingApps().then((res) => {
          setWaitingApps(res)
        })
      } else if (activeTab === 2) {
        getRejectedApps().then((res) => {
          setRejectedApps(res)
        })
      }
      if (task === 2 || activeTab === 1) {
        getApprovedApps().then((res) => {
          setApprovedApps(res)
        })
      }
    }
  }, [activeTab, task, addedApp, accessToken])

  useEffect(() => {
    if (accessToken) {
      if (activeTab === 0) {
        getUserWaitingApp().then((res) => {
          setUserWaitingApps(res)
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
  }, [activeTab, task, addedApp, accessToken])

  useEffect(() => {
    if (accessToken) {
      if (task === 3) {
        getForApprovalReviews().then((res) => {
          setApprovalReviews(res)
        })
      }
    }
  }, [task, accessToken])

  useEffect(() => {
    formik.setFieldValue('category', selectedCategories)
  }, [selectedCategories])

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

  const role = localStorage.getItem('role')

  if (!isDiscordUser || role === 'HyperAdmin') {
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
            <div className={styles.taskWrapper}>
              {sortedCampaigns?.map((item: any, index: any) => {
                if (item.is_active === false) {
                  return <div className={styles.tasks}>No Task for now</div>
                }
                return (
                  <div
                    className={styles.tasks}
                    style={index === 2 ? {pointerEvents: 'none'} : {}}
                    onClick={() => {
                      if (index !== 2) {
                        setTask(index + 1)
                        setActiveTab(0)
                        navigate(
                          `?task=${
                            item.task_name === 'Add App'
                              ? 'add-app'
                              : item.task_name === 'Approve Comment'
                              ? 'approve-comment'
                              : item.task_name === 'Add Comment'
                              ? 'add-comment'
                              : item.task_name === 'Approve App'
                              ? 'approve-app'
                              : ''
                          }`
                        )
                      }
                    }}
                  >
                    <span className={styles.taskName}>{item.task_name}</span>
                    <span className={styles.taskNumber}>{item.number}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {task === 4 && parametre === 'add-app' && (
          <div>
            <div className={`${styles.tabs} ${styles.appsTab}`}>
              <button
                type='button'
                className={activeTabApps === 0 ? styles.active : ''}
                onClick={() => setActiveTabApps(0)}
              >
                Add App
              </button>
              <button
                type='button'
                className={activeTabApps === 1 ? styles.active : ''}
                onClick={() => setActiveTabApps(1)}
              >
                My App Status
              </button>
            </div>
          </div>
        )}
        {/* ADD YOUR APP */}
        {task === 4 && activeTabApps === 0 && (
          <AddAppInputs
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
        {task === 3 && parametre === 'approve-comment' && (
          <div style={{border: 'none'}} className={`${styles.approvalContainer}  card`}>
            <div className={styles.tabContent}>
              <ul
                className={`${styles.header}
         ${styles.success}
           `}
              >
                <li>Created Date</li>
                <li>Rating</li>
                <li>Comment</li>
                <li>Type</li>
                <li>Validates</li>
                <li></li>
                <li></li>
              </ul>
            </div>
            {approvalReviews?.map((item: any, index: any) => {
              return (
                <ApproveComments
                  approvalReviews={approvalReviews}
                  setApprovalReviews={setApprovalReviews}
                  item={item}
                />
              )
            })}
          </div>
        )}
        {task === 1 && parametre === 'approve-app' && (
          <div style={{border: 'none'}} className={`${styles.card} ${styles.left} card`}>
            <ApproveApp
              setWaitingApps={setWaitingApps}
              waitingApps={waitingApps}
              task={task}
              activeTab={activeTab}
            />
          </div>
        )}
        {task === 2 && parametre === 'add-comment' && ''}
        {task === 4 && activeTabApps === 1 && (
          <div style={{border: 'none'}} className={`${styles.card} ${styles.right} card`}>
            <Title>YOUR APP</Title>
            <div className={styles.tabs}>
              <button
                type='button'
                className={activeTab === 0 ? styles.activeWaiting : ''}
                onClick={() => setActiveTab(0)}
              >
                Waiting
              </button>
              <button
                type='button'
                className={activeTab === 1 ? styles.activeSuccess : ''}
                onClick={() => setActiveTab(1)}
              >
                Approved
              </button>
              <button
                type='button'
                className={activeTab === 2 ? styles.activeRejected : ''}
                onClick={() => setActiveTab(2)}
              >
                Rejected
              </button>
            </div>

            {/* // CONTENT */}
            {task > 0 && (
              <div className={styles.tabContent}>
                <ul
                  className={`${styles.header}
              ${
                activeTab === 0
                  ? styles.waiting
                  : activeTab === 1
                  ? styles.success
                  : activeTab === 2
                  ? styles.rejected
                  : ''
              }
                `}
                >
                  <li>
                    <li>App Icon</li>
                  </li>
                  {activeTab === 2 && <li>Reason</li>}
                  <li>Created Date</li>
                  <li>Name</li>
                  <li>Title</li>
                  <li>Description</li>
                </ul>

                {activeTab === 0 && (
                  <div>
                    {userWaitingApps?.length > 0 ? (
                      userWaitingApps?.map((app: any, index: any) => (
                        <div key={index} className={`${styles.row}`}>
                          <ul>
                            <li className={styles.icons}>
                              <span className={styles.icon}>
                                <img src={app.icon} alt='' />
                              </span>
                            </li>
                            <li title={moment(app.created_at).format('DD.MM.YYYY')}>
                              {moment(app.created_at).format('DD.MM.YYYY')}
                            </li>
                            <li title={app.name}>{truncate(app.name, 20)}</li>
                            <li title={app.title}>{truncate(app.title, 20)}</li>
                            <div
                              title={app.description}
                              dangerouslySetInnerHTML={{__html: truncate(app.description, 20)}}
                            />
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noData}>No Data</div>
                    )}
                  </div>
                )}
                {activeTab === 1 && (
                  <div>
                    {userApprovedApps?.length > 0 ? (
                      userApprovedApps?.map((app: any, index: any) => (
                        <div key={index} className={`${styles.row}`}>
                          <ul>
                            <li className={styles.icons}>
                              <span className={styles.icon}>
                                <img src={app.icon} alt='' />
                              </span>
                            </li>
                            <li title={moment(app.created_at).format('DD.MM.YYYY')}>
                              {moment(app.created_at).format('DD.MM.YYYY')}
                            </li>
                            <li title={app.name}>{truncate(app.name, 20)}</li>
                            <li
                              title={app.description}
                              dangerouslySetInnerHTML={{__html: truncate(app.title, 20)}}
                            ></li>

                            <li title={app.content}>
                              <div
                                dangerouslySetInnerHTML={{__html: truncate(app.description, 20)}}
                              />
                            </li>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noData}>No Data</div>
                    )}
                  </div>
                )}
                {activeTab === 2 && (
                  <div>
                    {}
                    {userRejectedApps?.length > 0 ? (
                      userRejectedApps?.map((app: any, index: any) => (
                        <div key={index} className={`${styles.row}`}>
                          <ul>
                            <li className={styles.icons}>
                              <span className={styles.icon}>
                                <img src={app.icon} alt='' />
                              </span>
                            </li>
                            <li
                              onClick={() => {
                                setReasonData(app.reject_reason)
                                setShowReasonModal(true)
                              }}
                              className={styles.reason}
                              title={app.name}
                            >
                              View Reason
                            </li>
                            <li title={moment(app.created_at).format('DD.MM.YYYY')}>
                              {moment(app.created_at).format('DD.MM.YYYY')}
                            </li>
                            <li title={app.name}>{truncate(app.name, 20)}</li>
                            <li title={app.title}>
                              <div dangerouslySetInnerHTML={{__html: truncate(app.title, 20)}} />
                            </li>
                            <li title={app.description}>
                              <div
                                dangerouslySetInnerHTML={{__html: truncate(app.description, 20)}}
                              />
                            </li>
                            <span
                              onClick={() => {
                                setShow(true)
                                setSelectedApp(app)
                              }}
                              className={styles.edit}
                            >
                              <FiEdit />
                            </span>
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noData}>No Data</div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* <div
              onClick={() => {
                setShow(true)
              }}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam, labore.
            </div> */}
          </div>
        )}
        <Modal
          show={showReasonModal}
          onHide={handleCloseReasonModal}
          size='lg'
          style={{padding: '2rem'}}
        >
          <Modal.Body>
            <div className={`${styles.profileWrapper} ${styles.modalProfile}`}>
              <div style={{border: 'none'}} className={`${styles.card} ${styles.top} card`}>
                <span>{reasonData}</span>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {show && (
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
                  <AddAppInputsUpdate
                    selectedApp={selectedApp}
                    setSelectedCategories={setSelectedCategories}
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
        )}
      </div>
    </Layout>
  )
}

export default Collection
