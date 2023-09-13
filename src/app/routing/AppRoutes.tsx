/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage, useAuth} from '../modules/auth'
import {App} from '../App'
import ItemDetail from '../pages/Marketplace/Detail'
import Collection from '../pages/Marketplace/Collection'
import Profile from '../pages/Marketplace/Profile'
import AddCampaing from '../pages/Marketplace/AddCampaing'
import Review from '../pages/Marketplace/Review'
import ReviewHyperAppList from '../pages/Marketplace/HyperAppList'
import AddApp from '../pages/Marketplace/Dao'
import Balance from '../pages/Marketplace/Balance'
import Dao from '../pages/Marketplace/LeaderBoard'
import MailVerification from '../pages/Marketplace/MailVerification'
import ProfileVerification from '../pages/Marketplace/ProfileVerification'
import ForgotPassword from '../pages/Marketplace/ForgotPassword'
import Space from '../pages/Marketplace/Space'
import AdminDao from '../pages/Marketplace/AdminDao'
import Apps from '../pages/Marketplace/Apps'
import HyperAppList from '../pages/Marketplace/HyperAppList'
import SearchResults from '../pages/Marketplace/SearchResults'
import MyAcitivities from '../pages/Marketplace/MyActivities'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {PUBLIC_URL} = process.env

const isLogin = localStorage.getItem('login')

const AppRoutes: FC = () => {
  const {currentUser} = useAuth()
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          {/* <Route path='logout' element={<Logout />} /> */}
          {/* {currentUser ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/hyperchat' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )} */}

          <>
            <Route path='/*' element={<PrivateRoutes />} />
            <Route path='marketplace/detail/:name/:id' element={<ItemDetail />} />
            <Route path='collection' element={<Collection />} />
            <Route path='verification_link' element={<MailVerification />} />
            <Route path='profile_verification_link' element={<ProfileVerification />} />
            <Route path='forgot_pass_verification_link' element={<ForgotPassword />} />
            <Route path='add-campaign' element={<AddCampaing />} />
            <Route path='profile' element={<Profile />} />
            <Route path='marketplace/search' element={<SearchResults />} />
            <Route path='hyper-app' element={<HyperAppList />} />
            <Route path='review/:id' element={<Review />} />
            <Route path='dao' element={<AddApp />} />
            <Route path='admin-dao' element={<AdminDao />} />
            <Route path='my-activities' element={<MyAcitivities />} />
            {/* <Route path='balance' element={<Balance />} /> */}
            <Route path='leaderboard' element={<Dao />} />
            <Route path='space' element={<Space />} />
            <Route path='apps' element={<Apps />} />
            <Route index element={<Navigate to='/marketplace' />} />
            <Route index element={<Navigate to='/hyperchat' />} />
            <Route index element={<Navigate to='/hypercodes' />} />
            <Route index element={<Navigate to='/hypercontracts' />} />
            <Route index element={<Navigate to='/hyperart' />} />
            <Route index element={<Navigate to='/hyperocr' />} />
            <Route index element={<Navigate to='/hyperportraits' />} />
            <Route index element={<Navigate to='/hyperposts' />} />
            <Route index element={<Navigate to='/hyperextract' />} />
          </>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
