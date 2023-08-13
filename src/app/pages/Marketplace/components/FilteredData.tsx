import MarketCard from '../components/Card'
import {useAuthService} from '../../../services/authService'
import {useGlobal} from '../../../context/AuthContext'
import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import ContentLoader from 'react-content-loader'

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
  const {accessToken, allApps} = useGlobal()
  const {getAllApps} = useAuthService()

  const location = useLocation()
  const query = new URLSearchParams(location.search)

  useEffect(() => {
    if (!accessToken) return
    getAllApps(1, 50)
  }, [accessToken])

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
    filteredApps = allApps.result?.filter((app: App) => app.isnew === true)
    title = 'New Apps'
  } else if (query.get('trending') === 'true' || headerTitle === 'Trending') {
    filteredApps = allApps.result?.filter((app: App) => app.istrending === true)
    title = 'Trending Apps'
  } else {
    filteredApps = allApps.result
  }

  const secondMarketCard = [
    {
      title: title,
      isFilter: true,
    },
  ]

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
