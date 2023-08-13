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

const Home = () => {
  const [detailData, setDetailData] = useState<any>({})
  const [sliderDatas, setSliderDatas] = useState<any>([])
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

  const secondCard = [
    {
      button: 'Add',
      icon: <img src={example} alt='robot' />,
      title: 'Create content easily!',
      color: '#FFC444',
      backgroundImage: Bg1,
      position: 'center',
      bgSize: 'cover',
      isCenter: true,
    },
    {
      icon: <img src={example} alt='robot' />,
      button: 'Add',

      title: 'Need recipe? Do it with Chefff!',
      color: '#373B71',
      backgroundImage: Bg2,
      position: 'center',
      bgSize: 'cover',
      isCenter: true,
    },
    {
      button: 'Add',

      icon: <img src={example} alt='robot' />,
      title: 'Best game assets in one soluiton',
      color: '#FF9085',
      backgroundImage: Bg3,
      position: 'center',
      bgSize: 'cover',
      isCenter: true,
    },
  ]

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

  const {accessToken, allApps, account, apps} = useGlobal()
  const {getAllApps, getApps, getSliderTop} = useAuthService()

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        getAllApps(1, 50),
        getSliderTop().then((res: any) => setSliderDatas(res?.data)),
      ])
      if (accessToken) {
        getApps()
      }
      setLoading(false)
    }
    loadData()
  }, [accessToken, account])

  return (
    <div>
      {/* {loading ? (
        <img src={Logo} alt='Logo' className={styles.spinner} />
      ) : ( */}
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
            <div className={`${styles.cardContainer} ${styles.bottomImages} `}>
              {secondCard.map((item: any, index: any) => {
                return (
                  <Card
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
                    // isFilter={item.isFilter}
                    isListNumber={true}
                    showAll={true}
                    column={4}
                    gap='30px'
                    key={index}
                    headerTitle={item.title}
                    headerIcon={item.icons}
                    cardItems={allApps?.result?.filter((app: any) => app.status === 'approved')}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
      {/* )} */}
    </div>
  )
}

export default Home
