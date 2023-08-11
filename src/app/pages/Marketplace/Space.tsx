import styles from './Home.module.scss'
import MarketCard from './components/Card'
import {cardItemsSecond} from './mocks/Card'
import ranking from '../../../_metronic/assets/marketplace/icons/ranking.svg'
import Layout from './Home'
import {useAuthService} from '../../services/authService'
import {useGlobal} from '../../context/AuthContext'
import {useLocation} from 'react-router-dom'
import {useEffect} from 'react'

const Home = () => {
  const secondMarketCard = [
    {
      title: '🧭 Space',
      isFilter: true,
    },
  ]

  const {accessToken, apps} = useGlobal()
  const {getApps} = useAuthService()

  useEffect(() => {
    if (!accessToken) return
    getApps()
  }, [accessToken])

  return (
    <Layout>
      <div className={styles.layout}>
        <div className={`${styles.container} `}>
          <div className={styles.marketCard}>
            {secondMarketCard.map((item: any, index: any) => {
              return (
                <MarketCard
                  search
                  placeholder='search apps in your space'
                  //   isFilter={item.isFilter}
                  showAll={false}
                  isPurchase={true}
                  column={4}
                  gap='30px'
                  key={index}
                  headerTitle={item.title}
                  cardItems={apps}
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
