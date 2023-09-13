import styles from './Home.module.scss'
import MarketCard from './components/Card'
import {cardItemsSecond} from './mocks/Card'
import ranking from '../../../_metronic/assets/marketplace/icons/ranking.svg'
import Layout from './Home'
import {useAuthService} from '../../services/authService'
import {useGlobal} from '../../context/AuthContext'
import {useEffect, useState} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {useLocation} from 'react-router-dom'
import {FiArrowDown} from 'react-icons/fi'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

const Home = () => {
  const {accessToken, triggerJoin} = useGlobal()
  const {
    getAllApps,
    getApps,
    getTrendingApps,
    getNewApps,
    getVerifiedApp,
    getUpcoming,
    getIntegrated,
  } = useAuthService()
  const [cardItems, setCardItems] = useState<any>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItem, setTotalItem] = useState()

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const filter = query.get('filter')

  useEffect(() => {
    // Call different functions based on the 'filter' query parameter
    switch (filter) {
      case 'verified':
        // setCardItems([])
        getVerifiedApp().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break
      case 'trending':
        // setCardItems([])

        getTrendingApps().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break
      case 'upcomings':
        // setCardItems([])

        getUpcoming(currentPage, 1000).then(({total_page, result, total}) => {
          const approvedApps = result?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
          setTotalPages(total_page)
          setTotalItem(total)
        })
        break
      case 'integrated':
        // setCardItems([])

        getIntegrated().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break

      case 'new':
        // setCardItems([])
        getNewApps().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break
      default:
        // setCardItems([])
        getAllApps(currentPage, 30).then(({total_page, result, total}) => {
          const approvedApps = result?.filter((app: any) => app.status === 'approved')
          setCardItems((prevItems: any) => [...prevItems, ...approvedApps])
          setTotalPages(total_page)
          setTotalItem(total)
        })
        break
    }
  }, [accessToken, filter, currentPage, triggerJoin])

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }

  let secondMarketCard = []

  // Assign card based on the 'filter' parameter
  switch (filter) {
    case 'verified':
      secondMarketCard.push({
        title: 'Verified Apps',
        isFilter: true,
      })
      break
    case 'trending':
      secondMarketCard.push({
        title: 'Trending Apps',
        isFilter: true,
      })
      break
    case 'upcomings':
      secondMarketCard.push({
        title: 'Upcoming Apps',
        isFilter: true,
      })
      break
    case 'ranking':
      secondMarketCard.push({
        title: 'Ranking Apps',
        isFilter: true,
      })
      break
    case 'integrated':
      secondMarketCard.push({
        title: 'Hyper Apps',
        isFilter: true,
      })
      break
    case 'new':
      secondMarketCard.push({
        title: 'New Apps',
        isFilter: true,
      })
      break
    default:
      secondMarketCard.push({
        title: 'All Apps',
        isFilter: true,
      })
      break
  }

  const Pagination: React.FC<PaginationProps> = ({currentPage, onPageChange, totalPages}) => {
    return (
      <div className={`${styles.pagination} `}>
        <button
          className={`${currentPage <= 1 && styles.disablePrev} ${styles.prevButton}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span className={styles.pageNumber}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.nextButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    )
  }

  const fetchData = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <Layout>
      <div className={styles.layout}>
        <div className={`${styles.container} `}>
          <div className={styles.marketCard}>
            {secondMarketCard.map((item: any, index: any) => {
              return (
                <InfiniteScroll
                  dataLength={cardItems.length}
                  next={fetchData}
                  hasMore={currentPage < totalPages}
                  loader={
                    cardItems.length > 20 ? (
                      <h4
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        Loading...
                      </h4>
                    ) : (
                      cardItems.length === 20 && (
                        <h4
                          style={{
                            opacity: '0.8',
                            marginTop: '15px',
                            textAlign: 'center',
                          }}
                        >
                          Scroll for more apps <FiArrowDown />
                        </h4>
                      )
                    )
                  }
                  endMessage={''}
                >
                  <MarketCard
                    style={{
                      minWidth: '1280px',
                    }}
                    totalItem={totalItem}
                    showAll={false}
                    placeholder='search apps in your space'
                    column={4}
                    gap='30px'
                    key={index}
                    headerTitle={item.title}
                    cardItems={cardItems}
                  />
                </InfiniteScroll>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
