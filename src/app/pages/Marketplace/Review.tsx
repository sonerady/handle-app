import React, {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import Layout from './Home'
import Select from 'react-select'

import styles from './Review.module.scss'
import RobotIcon from '../../../_metronic/assets/icons/robot.svg'
import {useAuthService} from '../../services/authService'
import {useGlobal} from '../../context/AuthContext'
import {AiOutlineHeart, AiTwotoneHeart} from 'react-icons/ai'
import {FaStar} from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.css'
import Carousel from 'react-bootstrap/Carousel'
import {toast} from 'react-toastify'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'
import {Button, Form, Modal} from 'react-bootstrap'
import {MdOutlineFileCopy} from 'react-icons/md'
import {TbWorldWww} from 'react-icons/tb'

interface ReviewProps {
  app?: any
  setWaitingApps?: any
  waitingApps?: any
  handleClose?: any
  setWaitingAppsAdmin?: any
  getWaitingForAdmin?: any
}

const Review: React.FC<ReviewProps> = ({
  app,
  setWaitingApps,
  waitingApps,
  handleClose,
  setWaitingAppsAdmin,
  getWaitingForAdmin,
}) => {
  const location = useLocation()
  const [params, setParams] = useState<{
    name?: string
    content?: string
    description?: string
    badge?: string
    icon?: string
    rate?: string
    purchase?: string
    appid?: string
  }>({})

  const {
    approveApp,
    approveAppAdmin,
    rejectApp,
    getWaitingApps,
    getUserCampaignConditions,
    getVariables,
  } = useAuthService()

  const [hoverValue, setHoverValue] = useState(null)
  const {likeCount, visitCount, alertComment, comments, userInfo} = useGlobal()

  const [commentData, setcommentData] = useState({
    appId: params?.appid,
    username: '',
    rating: 0,
    comment: '',
  })

  const [activeTab, setActiveTab] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [isVisited, setIsVisited] = useState(false)

  const [approveLoading, setApproveLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  const [visibleComment, setVisibleComment] = useState(false)
  const [page, setPage] = useState(1)
  // const displayedComments = comments ? comments?.slice(0, page * 5) : []
  const [isHave, setIsHave] = useState('')
  const appid = new URLSearchParams(location.search).get('appid')
  // VISIT CONFIG
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const [reasonData, setReasonData] = useState([])

  const handleClosePopup = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleSave = () => {
    if (inputValue.trim() === '') {
      toast.error('Please provide a reason for rejection.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    } else {
      handleReject()
    }
  }

  const [selectedCategories, setSelectedCategories] = useState<any>(null)

  const [selectedReason, setSelectedReason] = useState<number | null>(null)

  const [publishDate, setPublishDate] = useState<Date | null>(new Date())

  const [showDatePicker, setShowDatePicker] = useState(false)

  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const isDao = window.location.pathname === '/dao'

  const handleChange = (e: any) => setInputValue(e.target.value)

  const getVariable = () => {
    getVariables('app_reject_reasons').then((res: any) => {
      setReasonData(res)
    })
  }

  useEffect(() => {
    if (show) {
      getVariable()
    }
  }, [show])

  const selectOptions = reasonData?.map((category: any) => ({
    value: category.order_value,
    label: category.name ? category.name : 'No Category',
  }))

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption && selectedOption.length > 1) {
      toast.error('You can select only one category.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }
    setSelectedCategories(selectedOption || [])
    setInputValue(selectedOption.label)
  }

  useEffect(() => {
    if (inputValue === 'Other') {
      setInputValue('')
    }
  }, [inputValue])

  const performApproval = (id: any) => {
    if (isDao) {
      setApproveLoading(true)
    }
    setApproveLoading(true)
    let approvalFunction
    if (window.location.pathname !== '/dao') {
      approvalFunction = approveAppAdmin
    } else {
      approvalFunction = approveApp
    }

    approvalFunction(
      id,
      window.location.pathname !== '/dao' ? moment(publishDate).format('YYYY-MM-DD') : 'None'
    )
      .then((res: any) => {
        setLoadingSubmit(false)
        if (isDao) {
          setApproveLoading(false)
        }
        if (res.Status === 200) {
          handleClose()
          toast.success(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          if (isDao) {
            getWaitingApps().then((res) => {
              setWaitingApps(res)
            })
            getUserCampaignConditions()
          }
          if (isRole?.length && !isDao) {
            getWaitingForAdmin()
          }
        } else {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      })
      .catch((err: any) => {
        console.log(err)
        if (isDao) {
          setApproveLoading(false)
        }
        setLoadingSubmit(false)
      })
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setPublishDate(date)
    }
  }

  const handleDatePickerSave = () => {
    setShowDatePicker(false)
    setLoadingSubmit(true)
    performApproval(app.appid)
  }

  const handleDatePickerClose = () => {
    setShowDatePicker(false)
  }

  const handleApprove = (id: any) => {
    if (window.location.pathname !== '/dao') {
      setShowDatePicker(true)
    } else {
      const formattedDate = publishDate
      setPublishDate(formattedDate as Date | null)
      performApproval(id)
    }
  }

  const handleReject = () => {
    setRejectLoading(true)
    rejectApp(app.appid, inputValue)
      .then((res: any) => {
        setRejectLoading(false)
        if (res.Status === 200) {
          console.log('res', res)
          setShow(false)
          toast.success(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          if (!isDao) {
            getWaitingForAdmin()
          } else {
            getWaitingApps().then((res) => {
              setWaitingApps(res)
            })
            getUserCampaignConditions()
          }

          handleClose()
        } else {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })

          // handleClose()
        }
      })
      .catch((err: any) => {
        console.log(err)
        setRejectLoading(false)
      })
  }

  const isRole = userInfo?.data?.admin_roles

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        className={`${styles.approveButtonWrapper} ${styles.approveButtonWrapperReview}`}
      >
        <div
          className={styles.headerContainerReview}
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          {app?.icon && (
            <img
              style={{
                height: '35px',
                width: '35px',
                borderRadius: '50%',
              }}
              onError={(e: any) => (e.target.src = RobotIcon)}
              src={app?.icon ? app?.icon : ''}
              alt='Icon'
            />
          )}
          <div className={styles.headerContainer}>
            <div className={styles.titleWrapper}>
              <div className={styles.titleContent}>
                <div
                  className={styles.title}
                  title={app?.name} // full text will be shown as a tooltip on hover
                >
                  {app?.name}
                </div>
                <div
                  className={styles.subTitle}
                  dangerouslySetInnerHTML={{__html: app?.title || 'No Content'}}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <span
            style={{
              cursor: 'pointer',
              color: '#6c757d',
              gap: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              top: '-4px',
            }}
            onClick={() => {
              navigator?.clipboard?.writeText(app?.appid)
              toast.success('App ID copied to clipboard', {
                position: toast.POSITION.BOTTOM_RIGHT,
              })
            }}
          >
            <MdOutlineFileCopy size={30} color='#6c757d' />
          </span>
          <span
            style={{
              cursor: 'pointer',
              color: '#6c757d',
              gap: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              top: '-4px',
            }}
            onClick={() => {
              window.open(`${app?.link}`, '_blank')
            }}
          >
            <TbWorldWww size={30} color='#6c757d' />
          </span>
          <button
            onClick={() => {
              handleShow && handleShow()
              // handleReject(app.appid)
            }}
            className={`${styles.approveButton} ${styles.rejectButton}`}
          >
            Reject
          </button>
          <button
            onClick={() => {
              handleApprove(app.appid)
            }}
            className={styles.approveButton}
          >
            {approveLoading || loadingSubmit ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: '0',
          marginBottom: '0',
        }}
        className={`${styles.container}`}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '1rem',
          }}
          className={styles.header}
        >
          <div
            style={{
              minHeight: 'none',
            }}
            className={`${styles.leftHeader} ${styles.leftHeaderReview} card`}
          >
            <div className={`${styles.rightContent} fs-2hx fw-bold text-gray-800`}>
              <div
                style={{
                  borderColor: 'none',
                  border: 'none',
                }}
                className={styles.descWrapper}
              >
                <div className={styles.description}>
                  <span className={styles.descTitle}>Description</span>
                  <p className={styles.desc}>
                    <div dangerouslySetInnerHTML={{__html: app?.description || 'No Content'}} />
                  </p>
                </div>
                <div className={styles.tagsContainer}>
                  <div className={styles.tags}>{app?.category}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{display: 'block', width: 619, height: 350}}>
            <Carousel
              style={{
                height: '350px',
                borderRadius: '2rem',
              }}
            >
              {app?.image1 && (
                <Carousel.Item interval={3000}>
                  <img
                    className={`d-block w-100 ${styles.slideItem}`}
                    src={`
                
                ${
                  app?.image1
                    ? app?.image1
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png'
                }
                `}
                    alt='Image One'
                  />
                </Carousel.Item>
              )}

              {app?.image2 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                  interval={500}
                >
                  <img
                    className={`d-block w-100 ${styles.slideItem}`}
                    src={`
                    ${
                      app?.image2
                        ? app?.image2
                        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png'
                    }
                  `}
                  />
                </Carousel.Item>
              )}

              {app?.image3 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                  interval={500}
                >
                  <img
                    className={`d-block w-100 ${styles.slideItem}`}
                    src={`
                          ${
                            app?.image3
                              ? app?.image3
                              : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png'
                          }
                        `}
                  />
                </Carousel.Item>
              )}
              {app?.image4 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                  interval={500}
                >
                  <img
                    className={`d-block w-100 ${styles.slideItem}`}
                    src={`
                ${
                  app?.image4
                    ? app?.image4
                    : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png'
                }
              `}
                  />
                </Carousel.Item>
              )}

              {app?.image5 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                  interval={500}
                >
                  <img
                    className={`d-block w-100 ${styles.slideItem}`}
                    src={`
                  ${
                    app?.image5
                      ? app?.image5
                      : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Example_image.svg/600px-Example_image.svg.png'
                  }
                `}
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </div>
        </div>
      </div>
      <Modal
        style={{
          height: 'fit-content',
        }}
        size='sm'
        show={showDatePicker}
        onHide={handleDatePickerClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Publish Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Use the DatePicker component from react-bootstrap */}
          <DatePicker selected={publishDate} onChange={handleDateChange} dateFormat='yyyy-MM-dd' />
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.saveButton} onClick={handleDatePickerSave}>
            Submit
          </div>
        </Modal.Footer>
      </Modal>
      <Modal size='sm' show={show} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Reason for rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            value={selectedCategories}
            styles={{
              control: (baseStyles, state) => ({
                marginBottom: '1rem',
                ...baseStyles,
                borderColor: state.isFocused ? '#fb6fbb' : 'rgba(128, 128, 128, 0.3411764706)',
                backgroundColor: 'transparent',
                width: '100%',
                color: '#FFF',
              }),
              option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                return {
                  ...styles,
                  width: '100%',
                  color: '#FFF',
                  backgroundColor: '#1f1f21',
                  cursor: isDisabled ? 'not-allowed' : 'default',
                }
              },
            }}
            options={selectOptions}
            isSearchable // Enable search functionality
            onChange={handleSelectChange}
          />
          {selectedCategories?.value === 99 && (
            <Form.Control as='textarea' rows={4} value={inputValue} onChange={handleChange} />
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className={styles.saveButton} onClick={handleSave}>
            {rejectLoading ? 'Rejecting...' : 'Submit'}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Review
