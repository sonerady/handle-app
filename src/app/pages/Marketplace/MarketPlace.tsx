import React, {useEffect, useState} from 'react'
import styles from './Home.module.scss'
import FilteredData from './components/FilteredData'
import Card from './components/ImageCard'
import example from '../../../_metronic/assets/marketplace/icons/example.svg'
import Bg1 from '../../../_metronic/assets/marketplace/images/bg1.png'
import Bg2 from '../../../_metronic/assets/marketplace/images/bg2.png'
import Bg3 from '../../../_metronic/assets/marketplace/images/bg3.png'
import MarketCard from './components/Card'
import trending from '../../../_metronic/assets/marketplace/icons/trending.svg'
import ranking from '../../../_metronic/assets/marketplace/icons/ranking.svg'
import news from '../../../_metronic/assets/marketplace/icons/new.svg'
import Layout from './Home'
import {useGlobal} from '../../context/AuthContext'
import {useAuthService} from '../../services/authService'
import Logo from '../../../_metronic/assets/marketplace/Logo.svg'
import {useLocation} from 'react-router-dom'

const Home = () => {
  const [sliderDatas, setSliderDatas] = useState<any>([])
  const [sliderCenterDatas, setSliderCenterDatas] = useState<any>([])
  const [loading, setLoading] = useState(true)

  const sortedData = [...sliderDatas].sort((a, b) => a.order - b.order)

  const firstCard = sortedData.map((data, index) => {
    const nextIndex = index % 3

    return {
      backgroundImage: data?.image,
      position: 'center',
      bgSize: 'cover',
      link: sortedData[nextIndex]?.link,
    }
  })

  const processedSecondCard = sliderCenterDatas.map((data: any) => ({
    button: 'Add',
    icon: <img src={data.icon || example} alt='robot' />,
    title: data.title || 'Default Title',
    color: data.color || '#FF9085',
    backgroundImage: data.image || Bg3,
    position: 'center',
    bgSize: 'cover',
    isCenter: true,
    link: data.link,
  }))

  const firstMarketCard = [
    {
      title: 'Trending',
      icons: trending,
    },
    {
      title: 'New Arrivals',
      icons: news,
    },
  ]

  const secondMarketCard = [
    {
      title: 'Ranking',
      icons: ranking,
      isFilter: true,
    },
  ]

  const {
    accessToken,
    allApps,
    account,
    apps,
    newApps,
    upComingApp,
    trendingApps,
    verifiedApps,
    integratedApp,
    rankingApp,
  } = useGlobal()
  const {getAllApps, getSliderTop, getSliderCenter, getRankingApp} = useAuthService()

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        // getAllApps(1, 20),
        getSliderTop().then((res: any) => setSliderDatas(res?.data)),
      ])
      // if (accessToken) {
      //   getApps()
      // }
      setLoading(false)
    }
    loadData()
  }, [accessToken, account])

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        // getAllApps(1, 20),
        getSliderCenter().then((res: any) => setSliderCenterDatas(res?.data)),
      ])
      // if (accessToken) {
      //   getApps()
      // }
      setLoading(false)
    }
    loadData()
  }, [accessToken])

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const filter = searchParams.get('filter')

  let cardData: any
  switch (filter) {
    case 'new':
      cardData = newApps
      break
    case 'upcomings':
      cardData = upComingApp
      break
    case 'trending':
      cardData = trendingApps
      break
    case 'verified':
      cardData = verifiedApps
      break
    case 'integrated':
      cardData = integratedApp
      break
    default:
      cardData = allApps?.result?.filter((app: any) => app.status === 'approved')
  }

  useEffect(() => {
    getRankingApp(1, 20)
  }, [])

  const rankingFilter = rankingApp?.result?.filter((app: any) => app.status === 'approved')

  return (
    <div>
      <Layout>
        <div className={styles.layout}>
          <div className={`${styles.container} `}>
            <div className={styles.cardContainer}>
              {firstCard.map((item: any, index: any) => {
                return (
                  <Card
                    order={item.order}
                    link={item.link}
                    color={item.color}
                    key={index}
                    title={item.title}
                    backgroundImage={item.backgroundImage}
                    height='225px'
                    position={item.position}
                    bgSize={item.bgSize}
                  />
                )
              })}
            </div>
            <div className={`${styles.marketCard} ${styles.marketCardTop}`}>
              {firstMarketCard.map((item: any, index: any) => {
                return (
                  <FilteredData
                    column={2}
                    gap='20px'
                    mapItems={firstMarketCard}
                    headerTitle={item.title}
                    headerIcon={item.icons}
                    showAll={true}
                    linkItems={item.title === 'Trending' ? 'trending' : 'new'}
                  />
                )
              })}
            </div>
            <div className={`${styles.cardContainer} ${styles.bottomImages}`}>
              {processedSecondCard.map((item: any, index: any) => {
                return (
                  <Card
                    linkCentered={item.link}
                    isBottom={true}
                    isCenter={item.isCenter}
                    icon={item.icon}
                    button={item.button}
                    color={item.color}
                    key={index}
                    title={item.title}
                    backgroundImage={item.backgroundImage}
                    height='200px'
                    position={item.position}
                    bgSize={item.bgSize}
                  />
                )
              })}
            </div>

            <div className={styles.marketCard}>
              {secondMarketCard.map((item: any, index: any) => {
                return (
                  <MarketCard
                    linkData={item.title === 'Ranking' ? 'ranking' : 'all'}
                    isListNumber={true}
                    showAll={true}
                    column={4}
                    gap='30px'
                    key={index}
                    headerTitle={item.title}
                    headerIcon={item.icons}
                    cardItems={item.title === 'Ranking' ? rankingFilter : cardData}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Home
