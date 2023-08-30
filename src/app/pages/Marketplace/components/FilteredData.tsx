import MarketCard from '../components/Card'
import {useAuthService} from '../../../services/authService'
import {useGlobal} from '../../../context/AuthContext'
import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
// import ContentLoader from 'react-content-loader'

interface Props {
  column?: number
  gap?: string
  headerTitle?: string
  headerIcon?: any
  mapItems?: any
  showAll?: boolean
  linkItems?: any
}

const Home: React.FC<Props> = ({linkItems, headerTitle, headerIcon, showAll}) => {
  const {accessToken, allApps, trendingApps, newApps} = useGlobal()
  const {getAllApps, getTrendingApps, getNewApps} = useAuthService()

  const location = useLocation()
  const query = new URLSearchParams(location.search)

  useEffect(() => {
    if (headerTitle === 'New Arrivals') {
      getNewApps()
    }
    if (headerTitle === 'Trending') {
      getTrendingApps()
    }
  }, [])

  interface App {
    isverified: boolean
    isnew: boolean
    istrending: boolean
  }

  let filteredApps: any = []
  let title = 'Apps'

  if (query.get('verified') === 'true' || headerTitle === 'Verified') {
    filteredApps = allApps?.result?.filter((app: App) => app.isverified === true)
    title = 'Verified Apps'
  } else if (query.get('new') === 'true' || headerTitle?.includes('New')) {
    filteredApps = newApps.filter((app: App) => app.isnew === true).slice(0, 6)
    title = 'New Apps'
  } else if (query.get('trending') === 'true' || headerTitle === 'Trending') {
    filteredApps = trendingApps.filter((app: App) => app.istrending === true).slice(0, 6)
    title = 'Trending Apps'
  } else {
    filteredApps = allApps?.result
  }

  const secondMarketCard = [
    {
      title: title,
      isFilter: true,
    },
  ]

  const MIN_CARD_ITEMS = 6

  if (filteredApps && filteredApps?.length < MIN_CARD_ITEMS) {
    const itemsNeeded = MIN_CARD_ITEMS - filteredApps?.length

    const additionalItems =
      allApps?.result?.filter((app: App) => !filteredApps.includes(app)).slice(0, itemsNeeded) || []

    filteredApps = [...filteredApps, ...additionalItems]
  }

  return (
    <>
      {secondMarketCard.map((item: any, index: any) => {
        return (
          <MarketCard
            linkData={linkItems}
            showAll={showAll}
            placeholder='search apps in your space'
            column={2}
            gap='30px'
            key={index}
            headerIcon={headerIcon}
            headerTitle={headerTitle}
            cardItems={filteredApps}
          />
        )
      })}
    </>
  )
}

export default Home
