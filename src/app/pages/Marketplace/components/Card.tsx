import React, {useEffect, useState} from 'react'
import styles from '../Home.module.scss'
import Rating from './Rating'
import circle from '../../../../_metronic/assets/marketplace/icons/circle.svg'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Input from './Input'
import {useAuthService} from '../../../services/authService'
import {useGlobal} from '../../../context/AuthContext'
import UserLogo from '../../../../_metronic/assets/marketplace/UserLogo.svg'
import Logo from '../../../../_metronic/assets/marketplace/Logo.svg'
import {toast} from 'react-toastify'
import SpinnerLogo from '../../../../_metronic/assets/icons/robot.svg'

interface FilterButton {
  text: string
  onClick: () => void
}

interface CardProps {
  headerIcon?: any
  headerTitle?: string
  column?: number
  gap?: string
  isFilter?: boolean
  showAll?: boolean
  linkData?: any
  isPurchase?: boolean
  cardItems?: {
    name: string
    content: string
    description: string
    badge: string
    category: string[]
    icon: any
    rating: number
    rate: number
    isverified?: boolean
    average_rate?: number
    isfree?: boolean
    isnew?: boolean
    isfeatured?: boolean
    isactive?: boolean
    title?: string
    istrending?: boolean
    appid?: any
    app_join?: any
    onAdd: () => void
  }[]
  search?: boolean
  placeholder?: string
  pegination?: any
  totalItem?: any
  isListNumber?: boolean
  style?: any
}

const Card: React.FC<CardProps> = ({
  headerIcon,
  headerTitle,
  cardItems,
  column,
  gap,
  isFilter,
  search,
  placeholder,
  showAll,
  linkData,
  pegination,
  totalItem,
  isListNumber,
  style,
}) => {
  const [activeFilter, setActiveFilter] = useState('Month' as string)
  const [searchQuery, setSearchQuery] = useState('') //
  const navigate = useNavigate()
  const {
    appJoin,
    getAllApps,
    getNewApps,
    getIntegrated,
    getVerifiedApp,
    getUpcoming,
    getTrendingApps,
  } = useAuthService()
  const {apps, accessToken, isSuccess, setAllApps, setTriggerJoin, triggerJoin} = useGlobal()

  const [loadingAppIds, setLoadingAppIds] = useState<Record<string, boolean>>({})

  const [appName, setAppName] = useState('')

  const isSign = localStorage.getItem('login')

  const [joinedApps, setJoinedApps] = useState<Record<string, boolean>>({})

  const [hoveredBtns, setHoveredBtns] = useState<any>({})

  const [isHref, setIsHref] = useState(false)

  const handleMouseEnter = (itemName: any) => {
    setIsHref(true)
    setHoveredBtns((prevHoveredBtns: any) => ({
      ...prevHoveredBtns,
      [itemName]: true,
    }))
  }

  const handleMouseLeave = (itemName: any) => {
    setIsHref(false)
    setHoveredBtns((prevHoveredBtns: any) => ({
      ...prevHoveredBtns,
      [itemName]: false,
    }))
  }

  function truncate(text: any, length = 17) {
    if (text?.length > length) {
      return text.substring(0, length) + '...'
    }
    return text
  }

  const isInApps = (name: string) => {
    return apps.some((app: any) => app.name === name)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const [inAppsStatus, setInAppsStatus] = useState({})

  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)

  const params = searchParams.get('filter')

  useEffect(() => {
    if (params) {
      setAppName(params)
    }
  }, [params])

  useEffect(() => {
    // Define the type for the object
    const newInAppsStatus: {[key: string]: boolean} = {}

    cardItems?.forEach((item) => {
      newInAppsStatus[item?.name] = apps.some((app: any) => app.name === item?.name)
    })

    setInAppsStatus(newInAppsStatus)
  }, [apps, cardItems])

  console.log('cardData Updated:', cardItems)

  const MAX_CARD_ITEMS = 6

  const filteredCardItems = cardItems
    ?.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, MAX_CARD_ITEMS)

  const filterButtons: FilterButton[] = [
    {
      text: 'Month',
      onClick: () => setActiveFilter('Month'),
    },
    {
      text: 'Week',
      onClick: () => setActiveFilter('Week'),
    },
    {
      text: 'Day',
      onClick: () => setActiveFilter('Day'),
    },
  ]

  const handleAddButtonClick = async (event: any, onAdd: any, appid: any, appName: string) => {
    event.stopPropagation()
    setLoadingAppIds((prev) => ({...prev, [appid]: true}))

    try {
      if (accessToken) {
        const response = await appJoin(appid)
        if (response.status === true) {
          toast.success(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          setJoinedApps((prev) => ({...prev, [appid]: true}))
          setTriggerJoin(!triggerJoin)
          // setAllApps([])
          // getAllApps(1, 20)
          // getTrendingApps()
          // getNewApps()
        } else {
          toast.error(response.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      } else {
        toast.error('Please login first', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } catch (error: string | any) {
      console.error(error)
    } finally {
      setLoadingAppIds((prev) => ({...prev, [appid]: false}))
    }
  }

  const myspace = window.location.href.includes('space')

  return (
    <div style={style} className={`${styles.card} ${styles.filterAppCard} card `}>
      <div className={styles.cardHeader}>
        <div className={styles.titleWrapper}>
          <div className={styles.top}>
            <span className={styles.cardHeaderTitle}>
              {headerTitle}{' '}
              <img src={headerIcon} alt='' style={{height: '20px', marginLeft: '2px'}} />
            </span>
            {search && (
              <input
                className={styles.searchInput}
                onChange={handleSearchChange}
                width='250px'
                placeholder={placeholder}
              />
            )}
            {totalItem > 16 && pegination}
          </div>
          <div className={styles.total}>
            {isFilter &&
              `
              More than ${cardItems?.length}+ AI Solutions
              `}
          </div>
        </div>
        {!isFilter ? (
          <Link to={`/apps?filter=${linkData}`} className={styles.showAll}>
            {showAll ? 'SHOW ALL' : ''}
          </Link>
        ) : (
          <div className={styles.filterButtons}>
            {filterButtons?.map((button, index) => (
              <button
                key={index}
                className={`${styles.filterButton} ${
                  button.text === activeFilter && styles.active
                }`}
                onClick={() => {
                  button.onClick()
                }}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          gridTemplateColumns: `repeat(${column}, 1fr)`,
          gridGap: gap,
        }}
        className={styles.cardItemWrapper}
      >
        {/* {[1, 2, 3, 4, 5, 6].map((item: any, index: any) => {
          return (
            <ContentLoader
              speed={2}
              width={400}
              height={200}
              viewBox='0 0 400 200'
              backgroundColor='#666666'
              foregroundColor='#cccccc'
            >
              <rect x='243' y='71' rx='3' ry='3' width='88' height='6' />
              <rect x='243' y='86' rx='3' ry='3' width='52' height='6' />
              <circle cx='215' cy='83' r='20' />
              <rect x='346' y='69' rx='7' ry='7' width='36' height='14' />
              <rect x='197' y='111' rx='3' ry='3' width='36' height='6' />
              <rect x='243' y='99' rx='3' ry='3' width='67' height='6' />
            </ContentLoader>
          )
        })} */}
        {!filteredCardItems || cardItems
          ? (search ? filteredCardItems : cardItems)?.map((item, index) => (
              <a
                style={{
                  textDecoration: 'none',
                }}
                href={
                  isHref ? 'javascript:void(0)' : `/marketplace/detail/${item?.name}/${item?.appid}`
                }
                // onClick={() => navigate(`/marketplace/detail/${item?.name}/${item?.appid}`)}
                key={index}
                className={styles.cardItem}
              >
                <div className={styles.rightContent}>
                  <div className={styles.imageContainer}>
                    <div className={styles.imageWrapper}>
                      {item?.icon && <img src={item?.icon} alt='' />}
                      {isListNumber && <div className={styles.listNumber}>{index + 1}</div>}
                    </div>
                    {/* <Rating rate={item?.average_rate ? item?.average_rate : 0} /> */}
                    {item?.isfeatured && <div className={styles.featured}>Featured</div>}
                    {item?.rate && <div>{item?.rate}</div>}

                    {/* {item?.isnew && <img className={styles.newBadge} src={newBadge} alt='' />}
                {item?.isverified && (
                  <img className={styles.verifiedBadge} src={verifiedBadge} alt='' />
                )} */}
                  </div>
                  <div className={styles.contentWrapper}>
                    <label className={`${styles.name} `}>
                      {item?.name?.length > 10 ? item?.name.slice(0, 10) + '...' : item?.name}
                    </label>
                    <div className={styles.content}>
                      {item?.category && item?.category?.length > 0 && (
                        <span title={item?.category[0]}>{item?.category[0]}</span>
                      )}
                      <img src={circle} alt='' />

                      {item?.category && item?.category?.length > 0 && (
                        <span title={item?.category[1]}>
                          {item?.category[1]?.length > 7 && item?.category[1]?.slice(0, 7) + '...'}
                        </span>
                      )}
                    </div>
                    <div className={styles.desc}>
                      <span>{truncate(item?.title)}</span>
                      {item?.isfree ? (
                        <span
                          style={{
                            color: '#FB70BA',
                          }}
                        >
                          FREE
                        </span>
                      ) : (
                        <span
                          style={{
                            color: '#FB70BA',
                            visibility: 'hidden',
                          }}
                        >
                          FREE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onMouseEnter={() => handleMouseEnter(item?.name)}
                  onMouseLeave={() => handleMouseLeave(item?.name)}
                  disabled={item?.app_join}
                  style={{
                    cursor:
                      joinedApps[item?.appid] || item?.app_join || myspace
                        ? 'not-allowed'
                        : 'pointer',
                    background:
                      joinedApps[item?.appid] ||
                      item?.app_join ||
                      hoveredBtns[item?.name] ||
                      myspace
                        ? 'var(--pink-gradient, linear-gradient(270deg, #ff9085 0%, #fb6fbb 100%))'
                        : 'none',
                    color:
                      joinedApps[item?.appid] || item?.app_join || myspace
                        ? '#fff'
                        : 'var(--pink-gradient, linear-gradient(270deg, #ff9085 0%, #fb6fbb 100%))',
                  }}
                  className={styles.addButton}
                  onClick={(event) =>
                    handleAddButtonClick(event, item?.onAdd, item?.appid, appName)
                  }
                >
                  {loadingAppIds[item?.appid] ? (
                    <img className={styles.spinner} src={SpinnerLogo} alt='' />
                  ) : joinedApps[item?.appid] || item?.app_join || myspace ? (
                    'OPEN'
                  ) : (
                    'Add'
                  )}
                </button>
              </a>
            ))
          : 'Loading...'}
      </div>
      {/* {!cardItems && (
        <div className={styles.waitingApps}>
          <img src={Logo} alt='Logo' className={styles.spinner} />
        </div>
      )} */}
    </div>
  )
}

Card.defaultProps = {
  headerIcon: '',
  headerTitle: '',
  column: 4,
  gap: '20px',
  isFilter: false,
  showAll: true,
  isPurchase: false,
}

export default Card
