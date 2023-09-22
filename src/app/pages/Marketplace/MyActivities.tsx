import React, {useEffect, useState} from 'react'
import Layout from './Home'
import styles from './AddApp.module.scss'
import Title from './components/Title'
import {useGlobal} from '../../context/AuthContext'
import {useAuthService} from '../../services/authService'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {EditorState} from 'draft-js'
import moment from 'moment'
import AddAppInputsUpdate from './components/UpdateAppInputs'
import UpdateCommentInputs from './components/UpdateCommentInputs'
import 'react-tagsinput/react-tagsinput.css'
import AddAppInputs from './components/AddAppInputsAdmin'
import {FiEdit} from 'react-icons/fi'
import {AiOutlineEye} from 'react-icons/ai'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ApproveComments from './components/ApproveCommentsAdmin'
import ApproveApp from './components/ApproveAppAdmin'
import AddComment from './components/AddReview'
import UserLogo from '../../../_metronic/assets/marketplace/UserLogo.svg'
import {toast} from 'react-toastify'
import Griddle, {ColumnDefinition, RowDefinition, plugins} from 'griddle-react'
import {useNavigate, useLocation, useParams} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'

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

const MyAcitivities: React.FC<CollectionProps> = () => {
  const {
    waitingAppsAdmin,
    setWaitingAppsAdmin,

    setUserApprovedApps,
    setUserRejectedApps,
    accessToken,
    userInfo,
    setDatas,
    datas,
  } = useGlobal()
  const {
    fileUpload,
    addAppAdmin,
    fixApp,
    getCategories,
    getUserApprovedApp,
    getUserRejectedApp,
    getUserCampaignConditions,
    getWaitingForAdmin,
    getWaitingReviewsForAdmin,
    getUserAction,
  } = useAuthService()
  const [error, setError] = useState<string | null>(null)
  const handleClose = () => setShow(false)
  const [forAdminReviews, setForAdminReviews] = useState<any>([])
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [type, setType] = useState('' as any)
  const [comment, setComment] = useState('' as any)
  const [rate, setRate] = useState(0 as any)
  const [reasonData, setReasonData] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [show, setShow] = useState(false)
  const [activeTabApps, setActiveTabApps] = useState(0)
  const [task, setTask] = useState(2)
  const [data, setData] = useState('')
  const [addedApp, setAddedApp] = useState(false)
  const [userWaitingAppsAdmin, setUserWaitingAppsAdmin] = useState<any>([])
  const handleChange = (event: any, editor: any) => {
    const data = editor.getData()
    setData(data)
  }
  const [exampleData, setExampleData] = useState<any>([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedComment, setSelectedComment] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isverified, setIsverified] = useState(false)
  const [isfeautured, setIsfeautured] = useState(false)
  const [isnew, setIsnew] = useState(false)
  const [istrending, setIstrending] = useState(false)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const navigate = useNavigate()
  const discordID = userInfo?.data?.discord_id
  const [appId, setAppId] = useState<any>(null)
  const [commentId, setCommentId] = useState<any>(null)
  const [counter, setCounter] = useState(5)
  const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const [descState, setDescState] = useState(EditorState.createEmpty())
  const [contentState, setContentState] = useState(EditorState.createEmpty())
  const [loading, setLoading] = useState(false)
  const [fileNames, setFileNames] = useState({
    image1: '630x420',
    image2: '630x420',
    image3: '630x420',
    image4: '630x420',
    image5: '630x420',
    icon: '64x64',
  })

  const handleCloseReasonModal = () => {
    setShowReasonModal(false)
  }

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

  useEffect(() => {
    setLoading(true)
    getUserAction(1, 1000)
      .then((res) => {
        setDatas(res.result)
      })
      .catch((error) => {
        console.error('Bir hata oluştu', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleAddApp = async (type: any, appid: any) => {
    try {
      if (
        formik.values.image1 ||
        formik.values.image2 ||
        formik.values.image3 ||
        formik.values.image4 ||
        formik.values.image5
      ) {
        let response
        if (type === 'fix') {
          response = await fixApp(formik.values, appid)
        } else {
          response = await addAppAdmin(formik.values)
        }

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

  const [selectedCategories, setSelectedCategories] = useState<any[]>([])

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

  function truncateString(str: string | undefined, num: number = 20): string {
    if (!str) return '' // If str is undefined or empty, return an empty string
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  // CATEGORY SETTINS

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (show) {
      getCategories().then((res) => {
        setCategories(res)
      })
    }
  }, [show])

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

  const styleConfig = {
    // icons: {
    //   TableHeadingCell: {
    //     sortDescendingIcon: <small>(desc)</small>,
    //     sortAscendingIcon: <small>(asc)</small>,
    //   },
    // },
    classNames: {
      Row: 'row-class',
    },
    styles: {
      Filter: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        alignItems: 'center',
        height: '30px',
        borderRadius: '10px',
        background: '#1a1c21',
        border: '1px solid rgba(128, 128, 128, 0.179)',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#CD6094',
        width: '250px',
        marginRight: '10px',
        marginBottom: '10px',
      },
      Row: {
        height: '42px',
      },
      Cell: {
        border: '1px solid #80808024',
        width: '10%',
      },
      TableHeading: {
        backgroundColor: '#15171b',
        border: 'none',
        height: '42px',
      },
      SettingsToggle: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        alignItems: 'center',
        height: '40px',
        borderRadius: '10px',
        background: 'var(--neutral-neutral, #232325)',
        border: 'none',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#CD6094',
      },
    },
  }
  useEffect(() => {
    const inputElement = document.querySelector('.griddle-filter') as HTMLInputElement

    if (inputElement) {
      inputElement.placeholder = 'Search'
    }
  })

  const role = userInfo?.data?.dao_roles

  if (!role?.length) {
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
        {/* ADD YOUR APP */}
        <div
          style={{
            background: '#1E2226',
            padding: '12px',
            borderRadius: '1rem',
          }}
        >
          {loading ? (
            <span
              style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: '20px',
              }}
            >
              Loading...
            </span>
          ) : datas.length > 0 ? (
            <Griddle
              pageProperties={{
                pageSize: 50,
              }}
              enableSettings={false}
              styleConfig={styleConfig}
              data={datas}
              plugins={[plugins.LocalPlugin]}
            >
              <RowDefinition>
                <ColumnDefinition
                  id='icon'
                  title='App Icon'
                  customComponent={(props: any) => {
                    return (
                      <div>
                        <img
                          style={{width: '35px', height: '35px', borderRadius: '50%'}}
                          src={props.value ?? UserLogo}
                          alt=''
                          onError={(e: any) => {
                            e.target.onerror = null
                            e.target.src = UserLogo
                          }}
                        />
                      </div>
                    )
                  }}
                />

                <ColumnDefinition
                  id='created_at'
                  title='Date'
                  customComponent={(props: any) => (
                    <span>{moment(props.value).format('DD-MM-YYYY')}</span>
                  )}
                />
                <ColumnDefinition id='app_name' title='App Name' />
                <ColumnDefinition id='action' title='Action' />
                <ColumnDefinition
                  id='xp'
                  title='Xp'
                  customComponent={(props: any) => <span>{props.value}</span>}
                />
                <ColumnDefinition id='validated' title='Validated' />
                <ColumnDefinition
                  id='status'
                  title='Status'
                  customComponent={(props: any) => {
                    let text = ''
                    let className = ''

                    switch (props.value) {
                      case 'waiting_for_approval':
                        text = 'Waiting for Approval'
                        className = 'waiting-for-approval'
                        break
                      case 'approved':
                        text = 'Approved'
                        className = 'approved'
                        break
                      case 'rejected':
                        text = 'Rejected'
                        className = 'rejected'
                        break
                      case 'waiting_for_admin':
                        text = 'Waiting for Admin'
                        className = 'waiting-for-admin'
                        break
                      case 'refused':
                        text = 'Refused'
                        className = 'refused'
                        break
                      default:
                        text = 'Unknown'
                        className = 'unknown-status'
                        break
                    }

                    return (
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                        }}
                        className={className}
                      >
                        {text}
                      </span>
                    )
                  }}
                />

                <ColumnDefinition
                  id='detail'
                  title='Detail'
                  customComponent={(props: any) => {
                    const commentEntry =
                      props.value._root?.entries.find(
                        (entry: any) => entry[0] === 'comment'
                      )?.[1] ?? ''
                    const ratingEntry =
                      props.value._root?.entries.find((entry: any) => entry[0] === 'rating')?.[1] ??
                      ''
                    return (
                      <div>
                        <span
                          style={{
                            cursor: 'pointer',
                          }}
                          className={styles.editButton}
                          onClick={() => {
                            if (
                              props.value._root?.entries.find(
                                (entry: any) => entry[0] === 'comment'
                              )?.[1]
                            ) {
                              setSelectedComment(commentEntry)
                              setSelectedRating(ratingEntry)
                              setDetailModalVisible(true)
                            }
                          }}
                        >
                          {/* {props.value} */}
                          {props.value._root?.entries.find(
                            (entry: any) => entry[0] === 'comment'
                          )?.[1]
                            ? truncateString(
                                props.value._root?.entries.find(
                                  (entry: any) => entry[0] === 'comment'
                                )?.[1] ?? ''
                              )
                                .replace(/["\[\]]/g, '')
                                .replace('List', '')
                            : props.value}
                          {/* <AiOutlineEye size={15} color='#CD6094' /> */}
                        </span>
                      </div>
                    )
                  }}
                />
                <ColumnDefinition
                  id='reject_reason'
                  title='Reject Reason'
                  customComponent={(props: any) => {
                    const isEdit = props.value._root?.entries.find(
                      (entry: any) => entry[0] === 'edit'
                    )?.[1]
                    const type = props?.value?._root?.entries.find(
                      (entry: any) => entry[0] === 'type'
                    )?.[1]
                    const appId = props?.value?._root?.entries.find(
                      (entry: any) => entry[0] === 'app_id'
                    )?.[1]
                    const comment = props?.value?._root?.entries[4]?.[1]._root?.nodes[10]?.entry[1]
                    const comment_id =
                      props?.value?._root?.entries[4]?.[1]._root?.nodes[7]?.nodes?.[0]?.entry[1]
                    const ratingCount =
                      props?.value?._root?.entries[4]?.[1]._root?.nodes[7]?.nodes?.[1]?.entry[1]

                    return (
                      <div>
                        <span
                          style={{
                            cursor: 'pointer',
                          }}
                          className={styles.editButton}
                          onClick={() => {
                            if (
                              props?.value?._root?.entries.find(
                                (entry: any) => entry[0] === 'reject_reason'
                              )?.[1] === 'None'
                            )
                              return
                            setReasonData(
                              props?.value?._root?.entries.find(
                                (entry: any) => entry[0] === 'reject_reason'
                              )?.[1] ?? ''
                            )
                            setShowReasonModal(true)
                          }}
                        >
                          {truncateString(
                            props?.value?._root?.entries.find(
                              (entry: any) => entry[0] === 'reject_reason'
                            )?.[1] ?? ''
                          )}
                        </span>
                        {isEdit && ( // Use the edit property
                          <FiEdit
                            onClick={() => {
                              setShow(true)
                              setType(type)
                              setComment(comment)
                              console.log('comment_id', comment_id)
                              setAppId(appId)
                              setCommentId(comment_id)
                            }}
                            style={{
                              cursor: 'pointer',
                              marginLeft: '10px',
                              position: 'relative',
                              top: '-2px',
                            }}
                            size={15}
                            color='#CD6094'
                          />
                        )}
                      </div>
                    )
                  }}
                />
              </RowDefinition>
            </Griddle>
          ) : (
            <span
              style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: '20px',
              }}
            >
              No Data
            </span>
          )}
        </div>
        <Modal show={detailModalVisible} onHide={() => setDetailModalVisible(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Review Detail</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <strong>Review:</strong> {selectedComment}
            </div>
            <div>
              <strong>Rating:</strong> {selectedRating}
              {/* {[selectedRating].map((rating) => {
                return (
                  <span>
                    <FaStar size={15} />
                  </span>
                )
              })} */}
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={showReasonModal}
          onHide={handleCloseReasonModal}
          size='sm'
          style={{padding: '2rem'}}
        >
          <Modal.Header closeButton>
            <Modal.Title>Reject Reason</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              paddingTop: '0',
            }}
          >
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
                  {type === 'comment' || type === 'review' ? (
                    <UpdateCommentInputs
                      handleClose={handleClose}
                      commentId={commentId}
                      comment={comment}
                      isRated={type === 'review'}
                    />
                  ) : (
                    <AddAppInputsUpdate
                      // selectedApp={selectedApp}
                      appId={appId}
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
                  )}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </Layout>
  )
}

export default MyAcitivities
