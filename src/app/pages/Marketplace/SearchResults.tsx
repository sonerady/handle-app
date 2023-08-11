import styles from './Home.module.scss'
import MarketCard from './components/Card'

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

const Search = () => {
  const {accessToken} = useGlobal()
  const {getApps, search} = useAuthService()
  const [cardItems, setCardItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItem, setTotalItem] = useState()
  const [loading, setLoading] = useState(false)

  const location = useLocation()
  // Parse the query string
  const query = new URLSearchParams(location.search)
  // Get the 'filter' query parameter
  const searchTerm = query.get('searchTerm')

  // handle page change
  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    if (searchTerm) {
      setLoading(true)
      search(searchTerm, currentPage).then((res) => {
        setCardItems(res.result)
        setTotalPages(res.totalPages)
        setTotalItem(res.total)
        setLoading(false)
      })
    }
  }, [currentPage])

  const secondMarketCard = [
    {
      title: 'All Apps',
      isFilter: true,
    },
  ]

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

export default Search
