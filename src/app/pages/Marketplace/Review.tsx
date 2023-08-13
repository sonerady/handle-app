import React, {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import Layout from './Home'
import styles from './Detail.module.scss'
import visit from '../../../_metronic/assets/marketplace/icons/visit.svg'
import open from '../../../_metronic/assets/marketplace/icons/open.svg'
import showMore from '../../../_metronic/assets/marketplace/button/showMore.svg'
import addComment from '../../../_metronic/assets/marketplace/button/addComment.svg'
import defaults from '../../../_metronic/assets/marketplace/icons/defaults.svg'
import pinkCircle from '../../../_metronic/assets/marketplace/icons/pinkCircle.svg'
import Rating from './components/Rating'
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

  const {approveApp, rejectApp, getWaitingApps, getUserCampaignConditions} = useAuthService()

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
  const [visibleComment, setVisibleComment] = useState(false)
  const [page, setPage] = useState(1)
  // const displayedComments = comments ? comments?.slice(0, page * 5) : []
  const [isHave, setIsHave] = useState('')
  const appid = new URLSearchParams(location.search).get('appid')
  // VISIT CONFIG
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleClosePopup = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleSave = () => {
    handleReject()
  }
  const [publishDate, setPublishDate] = useState<Date | null>(new Date())

  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleChange = (e: any) => setInputValue(e.target.value)
  const ratingsCount: {[index: number]: number} = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
  // const totalRatings = comments?.reduce((total: any, comment: any) => total + comment.rating, 0)
  // let averageRating = comments?.length ? totalRatings / comments.length : 0

  // if (isNaN(averageRating)) {
  //   averageRating = 0
  // }

  // comments?.forEach((comment: any) => {
  //   if (comment.rating >= 1 && comment.rating <= 5) {
  //     ratingsCount[comment.rating]++
  //   }
  // })

  const performApproval = (id: any) => {
    approveApp(id, isRole === 'HyperAdmin' ? moment(publishDate).format('YYYY-MM-DD') : 'None')
      .then((res: any) => {
        if (res.Status === true) {
          handleClose()
          toast.success(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          getUserCampaignConditions()
          getWaitingApps().then((res) => {
            setWaitingApps(res)
          })
          if (isRole === 'HyperAdmin') {
            getWaitingForAdmin().then((res: any) => {
              setWaitingAppsAdmin(res)
            })
          }
        } else {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setPublishDate(date)
    }
  }

  const handleDatePickerSave = () => {
    setShowDatePicker(false)
    performApproval(app.appid)
  }

  const handleDatePickerClose = () => {
    setShowDatePicker(false)
  }

  const handleApprove = (id: any) => {
    if (isRole === 'HyperAdmin') {
      setShowDatePicker(true)
    } else {
      const formattedDate = publishDate
      setPublishDate(formattedDate as Date | null)
      performApproval(id)
    }
  }

  const handleReject = () => {
    rejectApp(app.appid, inputValue)
      .then((res: any) => {
        if (res.Status === 200) {
          setShow(false)
          handleClose()
          toast.success(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          getWaitingForAdmin().then((res: any) => {
            setWaitingAppsAdmin(res)
          })
          getUserCampaignConditions()
        } else {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const isRole = userInfo?.data?.discord_role

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div className={styles.approveButtonWrapper}>
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
          Approve
        </button>
      </div>
      <div className={`${styles.container}`}>
        <div className={styles.header}>
          <div className={`${styles.leftHeader} card`}>
            <div className={`${styles.rightContent} fs-2hx fw-bold text-gray-800`}>
              <div className={styles.headerContainer}>
                <div className={styles.titleWrapper}>
                  {app?.icon && <img src={app?.icon ? app?.icon : ''} alt='Icon' />}
                  <div className={styles.titleContent}>
                    <div
                      className={styles.title}
                      title={app?.name} // full text will be shown as a tooltip on hover
                    >
                      {app?.name
                        ? app.name.length > 8
                          ? app.name.substring(0, 8) + '...'
                          : app.name
                        : ''}
                    </div>
                    <span className={styles.priceBadge}>Free</span>
                    <div
                      style={{
                        color: '#898990',
                        fontSize: '12px',
                      }}
                      dangerouslySetInnerHTML={{__html: app?.title || 'No Content'}}
                    />
                  </div>
                </div>
                <div className={styles.rightBottom}>
                  <div className={styles.rigthTextItem}>
                    <div
                      style={{
                        position: 'relative',
                        top: '5px',
                        right: '-9px',
                        cursor: isLiked ? 'not-allowed' : 'pointer',
                        fontSize: '1.7rem',
                        display: 'flex',
                      }}
                    >
                      {isLiked ? <AiTwotoneHeart /> : <AiOutlineHeart />}
                    </div>
                  </div>
                  <img
                    onClick={() => {
                      window.open(app?.url, '_blank')
                    }}
                    src={visit}
                    alt=''
                  />

                  <img
                    style={{cursor: isHave === 'OPEN' ? 'not-allowed' : 'pointer'}}
                    src={open}
                    alt=''
                  />
                </div>
              </div>
              <div className={styles.ratingInfo}>
                <div className={styles.rating}>
                  <Rating
                    rate={5}
                    style={{
                      marginTop: '0rem',
                      fontSize: '1.1rem',
                      width: '100px',
                      alignItems: 'end',
                    }}
                  />
                  <p
                    style={{
                      whiteSpace: 'nowrap',
                      margin: '0',
                      position: 'relative',
                      top: '6px',
                    }}
                  >
                    / 10.10
                  </p>
                </div>
                <div className={styles.rightText}>
                  <div className={styles.rigthTextItem}>
                    <img src={pinkCircle} alt='' />
                    <span>{visitCount?.count ? visitCount?.count : '0'} added to space</span>
                  </div>
                  <div className={styles.rigthTextItem}>
                    <img src={pinkCircle} alt='' />
                    <strong>{likeCount?.count ? likeCount?.count : '0'}</strong> <span>like</span>
                  </div>

                  <div className={styles.rigthTextItem}>
                    <img src={pinkCircle} alt='' />
                    <span>{'0'} Validated</span>
                  </div>
                </div>
              </div>
              <div className={styles.descWrapper}>
                <div className={styles.description}>
                  <span className={styles.descTitle}>Description</span>
                  <p className={styles.desc}>
                    <div dangerouslySetInnerHTML={{__html: app?.content || 'No Content'}} />
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
      <Modal show={showDatePicker} onHide={handleDatePickerClose}>
        <Modal.Header closeButton>
          <Modal.Title>Publish Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Use the DatePicker component from react-bootstrap */}
          <DatePicker selected={publishDate} onChange={handleDateChange} dateFormat='yyyy-MM-dd' />
        </Modal.Body>
        <Modal.Footer>
          <div
            className={`${styles.saveButton} ${styles.closeButton}`}
            onClick={handleDatePickerClose}
          >
            Close
          </div>
          <div className={styles.saveButton} onClick={handleDatePickerSave}>
            Save
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Reason for rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type='text' value={inputValue} onChange={handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.saveButton} onClick={handleSave}>
            Save
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Review
