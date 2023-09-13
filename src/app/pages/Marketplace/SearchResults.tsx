import styles from './Home.module.scss'
import MarketCard from './components/Card'

import Layout from './Home'
import {useAuthService} from '../../services/authService'
import {useGlobal} from '../../context/AuthContext'
import {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import {FiArrowDown} from 'react-icons/fi'

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
  const query = new URLSearchParams(location.search)
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
      title: 'Search Results',
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

export default Search
