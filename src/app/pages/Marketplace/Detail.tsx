import React, {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import Layout from './Home'
import styles from './Detail.module.scss'
import visit from '../../../_metronic/assets/marketplace/icons/visit.svg'
import open from '../../../_metronic/assets/marketplace/icons/open.svg'
import add from '../../../_metronic/assets/marketplace/icons/add.svg'
import defaults from '../../../_metronic/assets/marketplace/icons/defaults.svg'
import pinkCircle from '../../../_metronic/assets/marketplace/icons/pinkCircle.svg'
import {Modal, Button} from 'react-bootstrap'
import frame from '../../../_metronic/assets/marketplace/icons/frame.svg'
import Rating from './components/Rating'
import {useAuthService} from '../../services/authService'
import {useGlobal} from '../../context/AuthContext'
import {AiOutlineHeart, AiTwotoneHeart} from 'react-icons/ai'
import {FaStar} from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.css'
import moment from 'moment'
import Carousel from 'react-bootstrap/Carousel'
import {toast} from 'react-toastify'
import {access} from 'fs'
import UserLogo from '../../../_metronic/assets/marketplace/UserLogo.svg'

interface DetailsProps {}

const Details: React.FC<DetailsProps> = () => {
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

  const exampleTags = ['text', 'image', 'art']
  const [loading, setLoading] = useState(false)
  const {
    appJoin,
    addLike,
    getLike,
    addVisit,
    getVisit,
    addComment,
    getComment,
    getReview,
    getApps,
    getAppsById,
    getAppSlider,
    getValidators,
    getContributors,
    getAppInSpace,
    addReview,
    getRanking,
    getRating,
    getSpaceCount,
  } = useAuthService()
  const [hoverValue, setHoverValue] = useState(null)
  const [validators, setValidators] = useState<any>([])
  const [contributors, setContributors] = useState<any>([])
  const [showModal, setShowModal] = useState(false)
  const [fullDescription, setFullDescription] = useState('')
  const {
    likeCount,
    accessToken,
    setLikeCount,
    account,
    visitCount,
    setVisitCount,
    alertComment,
    comments,
    allApps,
    apps,
    isSuccess,
    commentsOther,
    userInfo,
    setAppsById,
    appsById,
    appInSpace,
    setAppInSpace,
    setIsVisited,
    isVisited,
    ratingCount,
    setRatingCount,
    raitingDatas,
    setRaitingDatas,
    setComments,
    setCommentsOther,
    spaceCount,
  } = useGlobal()

  const [isLiked, setIsLiked] = useState(false)
  const [visibleComment, setVisibleComment] = useState(false)
  const [page, setPage] = useState(1)
  const [contLength, setContLength] = useState(0)
  const accessTokenMarketplace = localStorage.getItem('accessTokenMarketplace')
  const role = localStorage.getItem('role')
  const [activeTab, setActiveTab] = useState(1)
  const [isHave, setIsHave] = useState('')
  const appid = new URLSearchParams(location.search).get('appid')
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [showAll, setShowAll] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const isLogin = localStorage.getItem('accessTokenMarketplace')
  const isDiscord = localStorage.getItem('discordAccessToken')
  const {id} = useParams<{id: string}>()
  const [appLink, setAppLink] = useState('')
  const appsNames = apps.map((app: any) => app.name)
  const appsNamesWithId = apps.map((app: any) => app.appid)

  const [isOpen, setIsOpen] = useState(false)

  const [show, setShow] = useState(false)

  const [openReviewInput, setOpenReviewInput] = useState(true)
  const [openCommentInput, setOpenCommentInput] = useState(true)

  useEffect(() => {
    // Sayfa yüklendiğinde en üstte olacak şekilde kaydırma yapılır
    window.scrollTo(0, 0)
  }, [])

  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
    setShowModal(true)
  }

  const htmlDescription = appsById?.description || 'No description'
  const textDescription = htmlDescription.replace(/<[^>]+>/g, '')

  const [currentReviewPage, setCurrentReviewPage] = useState(1)
  const [currentCommentPage, setCurrentCommentPage] = useState(1)

  const [bgJoin, setSetBgJoin] = useState(false)

  const rate = appsById?.average_rate

  const isRole = userInfo?.data.discord_role

  const icon = userInfo?.data.icon
  const [commentData, setcommentData] = useState({
    appId: id,
    comment: '',
  })
  const [reviewData, setReviewData] = useState({
    appId: id,
    username: '',
    rating: 0,
    comment: '',
  })

  const stars = Array(5).fill(0)

  const handleStarClick = (i: any) => {
    setReviewData({...reviewData, rating: i + 1})
  }

  // LIKE CONFIG
  const handleGetLike = async () => {
    try {
      await getLike(id)
    } catch (error: string | any) {
      console.error(error)
    }
  }

  // useEffect(() => {
  //   if (isVisited) {
  //     setVisibleComment(true)
  //   }
  // }, [])

  useEffect(() => {
    getRating(id)
  }, [id])

  const handleShowReview = (page: any) => {
    const nextPage = page + 1

    getReview(nextPage, id).then((response) => {
      const newComments = response?.result || []

      setComments((prevComments: any) => {
        // Önceki yorumların ID'lerini bir küme içerisinde saklayalım
        const existingIds = new Set(prevComments.result.map((comment: any) => comment.id))

        // Sadece yeni yorumları ekleyelim
        const uniqueNewComments = newComments.filter((comment: any) => !existingIds.has(comment.id))

        return {
          ...prevComments,
          result: [...prevComments.result, ...uniqueNewComments],
        }
      })
    })
  }

  const handleShowComment = (page: any) => {
    const nextPage = page + 1

    // Mevcut sayfa numarasının toplam sayfa sayısını aşması durumunu kontrol edin
    if (nextPage > comments?.total_page) {
      return
    }

    getComment(nextPage, id).then((response) => {
      const newComments = response?.result || []

      setCommentsOther((prevComments: any) => {
        // Önceki yorumların ID'lerini bir küme içerisinde saklayalım
        const existingIds = new Set(prevComments?.result.map((comment: any) => comment.id))

        // Sadece yeni yorumları ekleyelim
        const uniqueNewComments = newComments.filter((comment: any) => !existingIds.has(comment.id))

        return {
          ...prevComments,
          result: [...prevComments.result, ...uniqueNewComments],
        }
      })
    })
  }

  useEffect(() => {
    // Sayfa ilk yüklendiğinde yorumları getir
    handleShowComment(0) // 1: İlk sayfa numarası
    handleShowReview(0) // 1: İlk sayfa numarası
  }, [])

  useEffect(() => {
    if (id) {
      getAppsById(id)
    }
  }, [id])

  useEffect(() => {
    if (id && accessToken) {
      getAppInSpace(id)
    }
  }, [id])

  useEffect(() => {
    const accountLikes = JSON.parse(localStorage.getItem(`likes-${account}`) || '{}')
    localStorage.setItem('likes', JSON.stringify(accountLikes))
  }, [])

  useEffect(() => {
    if (id) {
      getSpaceCount(id)
    }
  }, [id])

  const handleAddApp = async (id: any) => {
    try {
      if (isLogin) {
        const repsonse = await appJoin(id)
        if (repsonse.status === true) {
          setSetBgJoin(true)
          getAppInSpace(id)
        }
        toast.success('App added successfully', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        setIsOpen(true)
      } else {
        toast.error('Please login first', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } catch (error: string | any) {
      console.error(error)
    }
  }

  const handleLike = async () => {
    if (isLogin) {
      try {
        if (id) {
          const currentLikes = JSON.parse(localStorage.getItem('likes') || '{}')
          if (!currentLikes[id]) {
            await addLike(id)
            handleGetLike()

            currentLikes[id] = true
            localStorage.setItem('likes', JSON.stringify(currentLikes))

            localStorage.setItem(`likes-${account}`, JSON.stringify(currentLikes))
          }
          setIsLiked(true)
        }
      } catch (error: string | any) {
        console.error(error)
      }
    } else {
      toast.error('Please login first', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  useEffect(() => {
    if (id !== undefined) {
      const likesString = localStorage.getItem('likes') || ''
      const currentLikes = likesString.includes(id)
      // Rest of your code
      if (currentLikes) {
        setIsLiked(true)
      }
    }
  }, [id])

  const checkIfLiked = () => {
    if (id) {
      const currentLikes = JSON.parse(localStorage.getItem('likes') || '{}')
      return currentLikes[id] ? true : false
    }
    return false
  }

  // useEffect(() => {
  //   if (selectedApp) {
  //     setIsLiked(checkIfLiked())
  //   }
  // }, [selectedApp, localStorage.getItem('likes')])

  useEffect(() => {
    const fetchLikeCount = async () => {
      if (id) {
        try {
          const likeCount = await getLike(id)
          setLikeCount(likeCount)
        } catch (error: string | any) {
          console.error(error)
        }
      }
    }

    fetchLikeCount()
  }, [id])

  useEffect(() => {
    if (allApps?.length > 0 && apps?.length > 0) {
      // sadece belirli bir appid'ye sahip objeler üzerinde işlem yap
      const selectedApp = apps.find((app: any) => app.appid === id)

      if (!selectedApp) {
        return
      }

      if (appsNames.includes(selectedApp.name)) {
        setIsHave('OPEN')
      } else {
        setIsHave('Add')
      }
    }
  }, [appid, id, allApps, apps, isSuccess])

  // VISIT CONFIG
  useEffect(() => {
    if (id) {
      const app = allApps?.result?.find((app: any) => app.appid === id)
      if (app) {
        setSelectedApp(app)
        setcommentData((prevState) => ({...prevState, appId: app.appid}))
      }
    }
  }, [id, allApps])

  useEffect(() => {
    if (allApps?.length > 0) {
      const selectedApp = allApps?.result?.find((app: any) => app.appid === id)
      if (selectedApp) {
        const linkData = selectedApp.link
        setAppLink(linkData)
      }
    }
  }, [id, allApps])

  const handleComment = async (e: any) => {
    if (isLogin || id === undefined) {
      try {
        const response = await addComment(commentData)
        setLoading(!loading)
        setOpenCommentInput(false)
        if (response.status === 200) {
          toast.success(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else {
          toast.error(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      } catch (error: string | any) {
        console.error(error)
        toast.error('Comment could not be added', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } else {
      toast.error('Please login first', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const handleReview = async (e: any) => {
    if (isLogin || id === undefined) {
      try {
        const response = await addReview({
          appId: reviewData.appId,
          userName: userInfo?.data.username,
          rating: reviewData.rating,
          comment: reviewData.comment,
        })
        setOpenReviewInput(false)
        setLoading(!loading)
        if (response.description === 'This user already added a review for this app') {
          toast.error('You already added a review for this app', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
        if (response.status === true) {
          toast.success('Review added success.', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else {
          toast.error(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      } catch (error: string | any) {
        console.error(error)
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } else {
      toast.error('Please login first', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }

  const handleGetVisit = async () => {
    try {
      await getVisit(id)
      getAppInSpace(id)
    } catch (error: string | any) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!accessToken) return
    handleGetVisit()
  }, [id, accessToken, isVisited])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const validatorsItems = await getValidators(id)
      if (validatorsItems && id) {
        setValidators(validatorsItems)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const contributorsItems = await getContributors(id)
      if (contributorsItems && id) {
        setContributors(contributorsItems)
        setContLength(contributorsItems.number)
      }
    }

    fetchData()
  }, [id])

  const ratingsCount: {[index: number]: number} = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
  let averageRating = selectedApp?.average_rate
  // Eğer averageRating hala NaN ise, 0 olarak set et
  if (isNaN(averageRating)) {
    averageRating = 0
  }

  useEffect(() => {
    if (!accessToken) return
    getAppSlider(appid)
  }, [accessToken, appid])

  useEffect(() => {
    setAppsById('')
  }, [window.location.pathname])

  return (
    <Layout>
      <div className={`${styles.container}`}>
        <div className={styles.header}>
          <div className={`${styles.leftHeader} card`}>
            <div className={`${styles.rightContent} fs-2hx fw-bold text-gray-800`}>
              <div className={styles.headerContainer}>
                <div className={styles.titleWrapper}>
                  {appsById ? (
                    <img
                      src={appsById?.icon}
                      alt='ıcon'
                      onError={(e: React.ChangeEvent<HTMLImageElement>) =>
                        (e.target.src = UserLogo)
                      }
                    />
                  ) : (
                    <img
                      src={UserLogo}
                      alt='ıcon'
                      onError={(e: React.ChangeEvent<HTMLImageElement>) =>
                        (e.target.src = UserLogo)
                      }
                    />
                  )}

                  <div className={styles.titleContent}>
                    <div
                      className={styles.title}
                      title={appsById?.name} // full text will be shown as a tooltip on hover
                    >
                      {appsById?.name
                        ? appsById?.name?.length > 8
                          ? appsById?.name.substring(0, 8) + '...'
                          : appsById?.name
                        : 'Loading...'}
                    </div>
                    {appsById?.isfree && <span className={styles.priceBadge}>Free</span>}
                    <div
                      style={{
                        color: '#898990',
                        fontSize: '12px',
                      }}
                      dangerouslySetInnerHTML={{__html: appsById?.title || 'No Content'}}
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
                      onClick={handleLike}
                    >
                      {isLiked ? <AiTwotoneHeart /> : <AiOutlineHeart />}
                    </div>
                  </div>
                  <a target='_blank' href={appsById?.link}>
                    <img
                      // onClick={() => {
                      //   window.open(appsById?.link, '_blank')
                      //   handleVisit()
                      // }}
                      src={visit}
                      alt=''
                    />
                  </a>

                  {/* <img
                    style={{cursor: isHave === 'OPEN' ? 'not-allowed' : 'pointer'}}
                    onClick={() => handleAddApp(id)}
                    src={isVisited ? open : add}
                    alt=''
                  /> */}
                  <button
                    className={styles.btn}
                    disabled={isHave === 'OPEN'}
                    style={{
                      cursor: isVisited || bgJoin ? 'default' : 'pointer',
                      background:
                        isVisited || bgJoin
                          ? 'linear-gradient(270deg, #ff9085 0%, #fb6fbb 100%)'
                          : 'none',
                      color:
                        isVisited || bgJoin
                          ? '#fff'
                          : 'linear-gradient(270deg, #ff9085 0%, #fb6fbb 100%)',
                    }}
                    onClick={() => {
                      if (!isVisited) {
                        handleAddApp(id)
                      }
                    }}
                  >
                    {isVisited || bgJoin ? 'OPEN' : 'ADD'}
                  </button>
                </div>
              </div>
              <div className={styles.ratingInfo}>
                <div className={styles.rating}>
                  <Rating
                    rate={rate ?? 0}
                    style={{
                      marginTop: '0rem',
                      fontSize: '1.1rem',
                      width: '100px',
                      alignItems: 'end',
                      top: '0.2px',
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
                    {appsById ? rate?.toFixed(1) : 0}
                  </p>
                </div>
                <div className={styles.rightText}>
                  <div className={styles.rigthTextItem}>
                    <img src={pinkCircle} alt='' />
                    {appsById ? (
                      <span>{spaceCount ?? '0'} added to space</span>
                    ) : (
                      <span>Loading...</span>
                    )}
                  </div>
                  <div className={styles.rigthTextItem}>
                    <img src={pinkCircle} alt='' />
                    <strong>{appsById ? likeCount?.count ?? '0' : 'Loading...'}</strong>{' '}
                    <span>like</span>
                  </div>

                  <div className={styles.rigthTextItem}>
                    <img src={pinkCircle} alt='' />
                    <span>{validators?.length ? validators?.length : '0'} Validated</span>
                  </div>
                </div>
              </div>
              <div className={styles.descWrapper}>
                <div className={styles.description}>
                  <span className={styles.descTitle}>Description</span>
                  <p className={styles.desc}>
                    {textDescription
                      ? textDescription?.length > 200
                        ? textDescription.slice(0, 200) + '... '
                        : textDescription
                      : 'Loading...'}
                    {textDescription?.length > 200 && (
                      <span className={styles.showMore} onClick={handleShow}>
                        Show more
                      </span>
                    )}
                  </p>
                </div>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Full Description</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div dangerouslySetInnerHTML={{__html: htmlDescription}} />
                  </Modal.Body>
                </Modal>

                <div className={styles.tagsContainer}>
                  {appsById?.category?.map((item: any, index: any) => (
                    <div className={styles.tags}>{item}</div>
                  ))}
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
              {appsById?.image1 && (
                <Carousel.Item>
                  <img className={`d-block w-100 ${styles.slideItem}`} src={appsById?.image1} />
                </Carousel.Item>
              )}

              {appsById?.image2 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                >
                  <img
                    className={`d-block w-100 ${styles.slideItem}`}
                    src={appsById?.image2}
                    alt='Image Two'
                  />
                </Carousel.Item>
              )}

              {appsById?.image3 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                >
                  <img className={`d-block w-100 ${styles.slideItem}`} src={appsById?.image3} />
                </Carousel.Item>
              )}

              {appsById?.image4 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                >
                  <img className={`d-block w-100 ${styles.slideItem}`} src={appsById?.image4} />
                </Carousel.Item>
              )}
              {appsById?.image5 && (
                <Carousel.Item
                  style={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem',
                  }}
                >
                  <img className={`d-block w-100 ${styles.slideItem}`} src={appsById?.image5} />
                </Carousel.Item>
              )}
            </Carousel>
          </div>
        </div>
        <div className={styles.header}>
          <div className={`${styles.leftHeader} card`}>
            <div
              className={`${styles.rightContent} ${styles.usersCard} fs-2hx fw-bold text-gray-800`}
            >
              <div className={styles.top}>
                <div className={`${styles.side} ${styles.leftSide}`}>
                  <div className={styles.cardTitleWrapper}>
                    <span className={styles.cardTitle}>Publisher</span>
                    <span>
                      <img src={defaults} alt='' />
                    </span>
                  </div>
                </div>
                <div className={`${styles.side} ${styles.rightSide}`}>
                  <div className={styles.cardTitleWrapper}>
                    <span className={styles.cardTitle}>Validators</span>
                    <div
                      style={{
                        justifyContent: 'start',
                      }}
                      className={styles.imagewrapper}
                    >
                      {validators?.map((item: any, index: any) => {
                        return (
                          <img
                            style={{
                              height: '40px',
                              width: '40px',
                              borderRadius: '50%',
                            }}
                            src={item?.icon ? item?.icon : defaults}
                            alt=''
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={`${styles.side} ${styles.leftSide}`}>
                  <div className={styles.cardTitleWrapper}>
                    <div className={`${styles.cardTitle} ${styles.contWrapper}`}>
                      <div className={styles.cardTitleWrapperItem}>
                        <span>Contributors</span>
                        <div className={styles.total}>
                          <span>Total:</span>
                          <strong>{contLength}</strong>
                        </div>
                      </div>
                      <div>
                        {/* {contributors?.length > 20 && (
                          <span className={styles.showAll} onClick={() => setModalShow(true)}>
                            {'{Show All}'}
                          </span>
                        )} */}
                      </div>
                    </div>
                    <div className={styles.imagewrapper}>
                      {contributors.contributors?.map((item: any, index: any) => {
                        return (
                          <img
                            style={{
                              height: '40px',
                              width: '40px',
                              borderRadius: '50%',
                            }}
                            src={item?.icon ? item?.icon : defaults}
                            alt=''
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.leftHeader} card`}>
            <div
              className={`${styles.rightContent} ${styles.usersCard} fs-2hx fw-bold text-gray-800`}
            >
              <div className={styles.footerRight}>
                <div className={styles.footerRightTop}>
                  <span className={styles.cardTitle}>Overall rating</span>
                  <div className={styles.rating}></div>
                </div>
                <div className={styles.ratingProgress}>
                  {raitingDatas
                    ? [5, 4, 3, 2, 1]?.map((item, index) => {
                        const totalComments = comments?.total

                        const count = raitingDatas?.count[item] || 0

                        const percentage = (count / totalComments) * 100

                        return (
                          <div className={styles.ratingProgressItem}>
                            <span className={styles.starts}>
                              {Array(item)
                                .fill(0)
                                .map((_, i) => (
                                  <FaStar
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '1.5rem',
                                    }}
                                    color={'#FD7DA4'}
                                  />
                                ))}
                            </span>
                            <div className={styles.progress}>
                              <div
                                style={{
                                  width: `${percentage}%`,
                                }}
                                className={styles.progressFull}
                              ></div>
                            </div>
                          </div>
                        )
                      })
                    : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.header}>
          <div
            className={`${styles.leftHeader}
            ${styles.bottomCardOther}
            ${styles.bottomCard} card`}
          >
            <div
              className={`${styles.rightContent} ${styles.usersCard} ${styles.usersCardReview} fs-2hx fw-bold text-gray-800`}
            >
              <div className={styles.top}>
                <div className={`${styles.side} ${styles.leftSide}`}>
                  <div className={styles.cardTitleWrapper}></div>
                  <div className={styles.footer}>
                    <div className={styles.tabWrapper}>
                      <span
                        style={{
                          borderBottom: activeTab === 1 ? '2px solid #FD7DA4' : 'none',
                        }}
                        onClick={() => setActiveTab(1)}
                      >
                        COMMENTS
                      </span>
                      <span
                        style={{
                          borderBottom: activeTab === 2 ? '2px solid #FD7DA4' : 'none',
                        }}
                        onClick={() => setActiveTab(2)}
                      >
                        REVIEWS
                      </span>
                    </div>

                    {activeTab === 1 && (
                      <div className={styles.think}>
                        <span>What do you think ?</span>
                        {role !== 'HyperAdmin' && accessTokenMarketplace && (
                          <button
                            onClick={() => setVisibleComment(true)}
                            className={styles.addComment}
                          >
                            {isLogin ? 'Add Comment' : 'Login to comment'}
                          </button>
                        )}
                      </div>
                    )}
                    {activeTab === 2 && (
                      <div className={styles.think}>
                        <span>What do you think ?</span>
                        {role !== 'HyperAdmin' && accessTokenMarketplace && (
                          <button
                            onClick={() => setVisibleComment(true)}
                            className={styles.addComment}
                          >
                            {isLogin ? 'Add Review' : 'Login to Review'}
                          </button>
                        )}
                      </div>
                    )}
                    <div
                      style={{
                        display: activeTab === 2 ? 'block' : 'none',
                      }}
                      className={styles.footerLeft}
                    >
                      {visibleComment && activeTab === 2 && isVisited && openReviewInput && (
                        <div className={styles.commentContainer}>
                          <label
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '5px',
                            }}
                          >
                            Rating
                            <div
                              style={{
                                fontSize: '1.5rem',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                              }}
                            >
                              {stars.map((_, i) => (
                                <FaStar
                                  key={i}
                                  color={i < reviewData.rating ? '#FD7DA4' : 'gray'}
                                  onClick={() => handleStarClick(i)}
                                />
                              ))}
                            </div>
                            <label htmlFor=''>Plain Text</label>
                            <textarea
                              value={reviewData.comment}
                              rows={5}
                              placeholder='Comment'
                              onChange={(e) =>
                                setReviewData({...reviewData, comment: e.target.value})
                              }
                            />
                          </label>
                          {alertComment === false && (
                            <span className={styles.alert}>{'Already voted !'}</span>
                          )}
                          <button className={styles.sendComment} onClick={handleReview}>
                            Send Review
                          </button>
                        </div>
                      )}
                      {/* <div className={styles.footerLeftTop}>
                        <span className={styles.cardTitle}>REVIEWS</span>

                        <button
                          className={styles.addComment}
                     
                        >
                          Add
                        </button>
                      </div> */}
                      {/* // REVIEWS */}
                      {activeTab === 2 && (
                        <div
                          style={{
                            display: activeTab === 2 ? 'block' : 'none',
                          }}
                        >
                          <div className={styles.footerLeftBottom}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                paddingBottom: '15px',
                                marginBottom: '15px',
                              }}
                            >
                              <div className={styles.footerLeftBottomTop}>
                                {/* Kontrol yapılarını ekliyoruz */}
                                {comments && comments?.result && comments.result.length > 0
                                  ? comments?.result?.map((item: any, index: number) => {
                                      // comments dizisindeki elemanların null/undefined kontrolü
                                      if (!item) return null

                                      return (
                                        <div className={styles.commentItem} key={index}>
                                          <div className={styles.name}>
                                            <span className={styles.icon}>
                                              <img
                                                src={item.icon}
                                                alt=''
                                                onError={(e: React.ChangeEvent<HTMLImageElement>) =>
                                                  (e.target.src = UserLogo)
                                                }
                                              />
                                            </span>
                                            <span className={styles.userName}>
                                              {item.username ?? 'User'}
                                            </span>
                                          </div>
                                          <div className={styles.center}>
                                            <div className={styles.date}>
                                              {moment(item.createdAt).format('MMMM D, YYYY')}
                                            </div>
                                          </div>
                                          <div className={styles.comment}>{item.comment}</div>
                                          <div className={styles.rating}>
                                            {[...Array(5)].map((star, i) => {
                                              const ratingValue = i + 1
                                              return (
                                                <FaStar
                                                  key={i}
                                                  style={{
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    transition: 'color 200ms',
                                                  }}
                                                  color={
                                                    item.rating >= ratingValue
                                                      ? '#FD7DA4'
                                                      : '#e4e5e9'
                                                  }
                                                />
                                              )
                                            })}
                                          </div>
                                        </div>
                                      )
                                    })
                                  : ''}
                              </div>
                              <div className={styles.footerLeftBottomBottom}></div>
                            </div>
                            {comments && comments?.result?.length > 4 && (
                              <button
                                className={styles.loadMore}
                                onClick={() => handleShowReview(page)}
                                disabled={page * 5 >= (comments as any[])?.length}
                              >
                                Show More
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {activeTab === 1 && (
                      <div
                        style={{
                          display: activeTab === 1 ? 'block' : 'none',
                        }}
                        className={styles.footerLeft}
                      >
                        {/* <div className={styles.footerLeftTop}>
                          <span className={styles.cardTitle}>COMMENTS</span>
                          <button
                            className={styles.addComment}
                            onClick={() => setVisibleComment(true)}
                          >
                            Add
                          </button>
                        </div> */}
                        <div
                          style={{
                            display: activeTab === 1 ? 'block' : 'none',
                          }}
                        >
                          {visibleComment && activeTab === 1 && openReviewInput && (
                            <div className={styles.commentContainer}>
                              <label>
                                Comment
                                <textarea
                                  value={commentData.comment}
                                  rows={5}
                                  placeholder='Comment'
                                  onChange={(e) =>
                                    setcommentData({...commentData, comment: e.target.value})
                                  }
                                />
                              </label>
                              {alertComment === false && (
                                <span className={styles.alert}>{'Already voted !'}</span>
                              )}
                              <button className={styles.sendComment} onClick={handleComment}>
                                Send Comment
                              </button>
                            </div>
                          )}
                          <div className={styles.footerLeftBottom}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                paddingBottom: '15px',
                                marginBottom: '15px',
                              }}
                            >
                              <div className={styles.footerLeftBottomTop}>
                                {/* Kontrol yapılarını ekliyoruz */}
                                {commentsOther
                                  ? commentsOther?.result?.map((item: any, index: number) => {
                                      // comments dizisindeki elemanların null/undefined kontrolü
                                      if (!item) return null

                                      return (
                                        <div className={styles.commentItem} key={index}>
                                          <div className={styles.name}>
                                            <span className={styles.icon}>
                                              <img
                                                src={item.icon}
                                                alt=''
                                                onError={(e: React.ChangeEvent<HTMLImageElement>) =>
                                                  (e.target.src = UserLogo)
                                                }
                                              />
                                            </span>
                                            <span className={styles.userName}>
                                              {item.username ?? 'User'}
                                            </span>
                                          </div>
                                          <div className={styles.center}>
                                            <div className={styles.date}>
                                              {moment(item.createdAt).format('MMMM D, YYYY')}
                                            </div>
                                          </div>
                                          <div className={styles.comment}>{item.comment}</div>
                                        </div>
                                      )
                                    })
                                  : ''}
                              </div>
                              <div className={styles.footerLeftBottomBottom}></div>
                            </div>
                            {commentsOther && commentsOther?.result?.length > 5 && (
                              <button
                                className={styles.loadMore}
                                onClick={() => handleShowComment(1)}
                                disabled={page * 5 >= (comments as any[])?.length}
                              >
                                Show More
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Details
