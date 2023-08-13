import styles from './Home.module.scss'
import MarketCard from './components/Card'
import {cardItemsSecond} from './mocks/Card'
import ranking from '../../../_metronic/assets/marketplace/icons/ranking.svg'
import Layout from './Home'
import {useAuthService} from '../../services/authService'
import {useGlobal} from '../../context/AuthContext'
import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

const Home = () => {
  const {accessToken} = useGlobal()
  const {
    getAllApps,
    getApps,
    getTrendingApps,
    getNewApps,
    getVerifiedApp,
    getUpcoming,
    getIntegrated,
  } = useAuthService()
  const [cardItems, setCardItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItem, setTotalItem] = useState()

  const location = useLocation()
  // Parse the query string
  const query = new URLSearchParams(location.search)
  // Get the 'filter' query parameter
  const filter = query.get('filter')
  useEffect(() => {
    // Call different functions based on the 'filter' query parameter
    switch (filter) {
      case 'verified':
        getVerifiedApp().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break
      case 'trending':
        getTrendingApps().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break
      case 'upcomings':
        getUpcoming(currentPage, 1000).then(({total_page, result, total}) => {
          const approvedApps = result?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
          setTotalPages(total_page)
          setTotalItem(total)
        })
        break
      case 'integrated':
        getIntegrated().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break

      case 'new':
        getNewApps().then((apps) => {
          const approvedApps = apps?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
        })
        break
      default:
        getAllApps(currentPage, 20).then(({total_page, result, total}) => {
          const approvedApps = result?.filter((app: any) => app.status === 'approved')
          setCardItems(approvedApps)
          setTotalPages(total_page)
          setTotalItem(total)
        })
        break
    }
  }, [accessToken, filter, currentPage])

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

  return (
    <Layout>
      <div className={styles.layout}>
        <div className={`${styles.container} `}>
          <div className={styles.marketCard}>
            {secondMarketCard.map((item: any, index: any) => {
              return (
                <MarketCard
                  totalItem={totalItem}
                  showAll={false}
                  placeholder='search apps in your space'
                  column={4}
                  gap='30px'
                  key={index}
                  headerTitle={item.title}
                  cardItems={cardItems}
                  pegination={
                    <Pagination
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                      totalPages={totalPages}
                    />
                  }
                />
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
