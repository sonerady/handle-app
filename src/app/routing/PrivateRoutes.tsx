import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/TextToImage/BuilderPageWrapper'
import TextToImage from '../pages/TextToImage/TextToImage'
import TextToContracts from '../pages/TextToContracts/TextToContracts'
import TextToPost from '../pages/TextToPost/TextToPost'
import TextToCode from '../pages/TextToCode/TextToCode'
import TextToChat from '../pages/TextToChat/TextToChat'
import TextToOcr from '../pages/TextToOcr/TextToOcr'
import TextToDavinci from '../pages/TextToDavinci/TextToDavinci'
import TextToFeature from '../pages/TextToFeature/TextToFeature'
import ImageToImage from '../pages/ImageToImage/ImageToImage'
// import MarketPlace from '../pages/marketplace/MarketPlace'
import Home from '../pages/Marketplace/MarketPlace'
import Profile from '../pages/Marketplace/Profile'

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        {/* <Route path='auth/*' element={<Navigate to='/hyberchat' />} /> */}
        {/* Pages */}
        <Route path='marketplace' element={<Home />} />
        <Route path='profile' element={<Profile />} />
        <Route path='hyperchat' element={<TextToChat />} />
        <Route path='hypercodes' element={<TextToCode />} />
        <Route path='hypercontracts' element={<TextToContracts />} />
        {/* <Route path='hyper-diff' element={<BuilderPageWrapper />} /> */}
        <Route path='hyperimages' element={<TextToImage />} />
        <Route path='hyperart' element={<ImageToImage />} />
        <Route path='hyperocr' element={<TextToOcr />} />
        <Route path='hyperextract' element={<TextToFeature />} />
        <Route path='hyperportraits' element={<TextToDavinci />} />
        <Route path='hyperposts' element={<TextToPost />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
