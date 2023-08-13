import React, {useEffect, useState} from 'react'
import styles from '../Home.module.scss'
import Rating from './Rating'
import circle from '../../../../_metronic/assets/marketplace/icons/circle.svg'
import {Link, useNavigate} from 'react-router-dom'
import Input from './Input'
import {useAuthService} from '../../../services/authService'
import {useGlobal} from '../../../context/AuthContext'
import UserLogo from '../../../../_metronic/assets/marketplace/UserLogo.svg'
import {toast} from 'react-toastify'
import ContentLoader from 'react-content-loader'

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
}) => {
  const [activeFilter, setActiveFilter] = useState('Month' as string)
  const [searchQuery, setSearchQuery] = useState('') //
  const navigate = useNavigate()
  const {appJoin, getAllApps} = useAuthService()
  const {apps, accessToken, isSuccess} = useGlobal()
  const isSign = localStorage.getItem('login')
  const [hoveredBtns, setHoveredBtns] = useState<any>({}) // Her bir düğmenin "hover" durumunu takip etmek için nesne

  const handleMouseEnter = (itemName: any) => {
    setHoveredBtns((prevHoveredBtns: any) => ({
      ...prevHoveredBtns,
      [itemName]: true,
    }))
  }

  const handleMouseLeave = (itemName: any) => {
    setHoveredBtns((prevHoveredBtns: any) => ({
      ...prevHoveredBtns,
      [itemName]: false,
    }))
  }

  const isInApps = (name: string) => {
    return apps.some((app: any) => app.name === name)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const [inAppsStatus, setInAppsStatus] = useState({})

  useEffect(() => {
    // Define the type for the object
    const newInAppsStatus: {[key: string]: boolean} = {}

    cardItems?.forEach((item) => {
      newInAppsStatus[item.name] = apps.some((app: any) => app.name === item.name)
    })

    setInAppsStatus(newInAppsStatus)
  }, [apps, cardItems])

  const MAX_CARD_ITEMS = 6

  const isLogin = localStorage.getItem('login')

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

  const handleAddButtonClick = (event: any, onAdd: any, appid: any) => {
    event.stopPropagation()
    if (isSign) {
      appJoin(appid).then(() => {
        getAllApps(1, 50)
      })
    } else {
      toast.error('Please login to add app')
    }
  }

  // useEffect(() => {
  //   if (!accessToken) return
  //   getAllApps(1, 50)
  // }, [isSuccess])

  return (
    <div className={`${styles.card} ${styles.filterAppCard} card `}>
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
        {filteredCardItems || cardItems
          ? (search ? filteredCardItems : cardItems)?.map((item, index) => (
              <div
                onClick={() => navigate(`/marketplace/detail/${item.name}/${item.appid}`)}
                key={index}
                className={styles.cardItem}
              >
                <div className={styles.rightContent}>
                  <div className={styles.imageContainer}>
                    <div className={styles.imageWrapper}>
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=''
                          onError={(e: React.ChangeEvent<HTMLImageElement>) =>
                            (e.target.src = UserLogo)
                          }
                        />
                      ) : (
                        <UserLogo />
                      )}
                      {isListNumber && <div className={styles.listNumber}>{index + 1}</div>}
                    </div>
                    <Rating rate={item.average_rate ? item.average_rate : 0} />
                    {item.isfeatured && <div className={styles.featured}>Featured</div>}
                    {item.rate && <div>{item.rate}</div>}

                    {/* {item.isnew && <img className={styles.newBadge} src={newBadge} alt='' />}
                {item.isverified && (
                  <img className={styles.verifiedBadge} src={verifiedBadge} alt='' />
                )} */}
                  </div>
                  <div className={styles.contentWrapper}>
                    <label className={`${styles.name} `}>
                      {item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name}
                    </label>
                    <div className={styles.content}>
                      {item?.category && item.category.length > 0 && (
                        <span title={item.category[0]}>{item.category[0]}</span>
                      )}
                      <img src={circle} alt='' />

                      {item?.category && item.category.length > 0 && (
                        <span title={item.category[0]}>
                          {item.category[0].length > 7 && item.category[0].slice(0, 7) + '...'}
                        </span>
                      )}
                    </div>
                    <div className={styles.desc}>
                      <div dangerouslySetInnerHTML={{__html: item.title || 'No desc.'}} />
                      {item.isfree ? (
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
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={() => handleMouseLeave(item.name)}
                  disabled={item.app_join}
                  style={{
                    cursor: item.app_join ? 'not-allowed' : 'pointer',
                    background:
                      item.app_join || hoveredBtns[item.name]
                        ? 'var(--pink-gradient, linear-gradient(270deg, #ff9085 0%, #fb6fbb 100%))'
                        : 'none',
                    color: item.app_join
                      ? '#fff'
                      : 'var(--pink-gradient, linear-gradient(270deg, #ff9085 0%, #fb6fbb 100%))',
                  }}
                  className={styles.addButton}
                  onClick={(event) => handleAddButtonClick(event, item.onAdd, item.appid)}
                >
                  {item.app_join ? 'OPEN' : 'Add'}
                </button>
              </div>
            ))
          : ''}
      </div>
      {!cardItems && (
        <div className={styles.waitingApps}>
          <span>Waiting apps...</span>
        </div>
      )}
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
