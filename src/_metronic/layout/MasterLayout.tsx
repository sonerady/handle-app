import {useEffect, useState} from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import {HeaderWrapper} from './components/header'
import {RightToolbar} from '../partials/layout/RightToolbar'
import {ScrollTop} from './components/scroll-top'
import {Content} from './components/content'
import {FooterWrapper} from './components/footer'
import {Sidebar} from './components/sidebar'
import {
  DrawerMessenger,
  ActivityDrawer,
  InviteUsers,
  UpgradePlan,
  ThemeModeProvider,
} from '../partials'
import {PageDataProvider} from './core'
import {reInitMenu} from '../helpers'
import {ToolbarWrapper} from './components/toolbar'
import {useGlobal} from '../../app/context/AuthContext'
import Important from '../../app/pages/Marketplace/components/Important'
import Navbar from '../../app/pages/Marketplace/components/Navbar'

const MasterLayout = () => {
  const {openModal, setOpenModal} = useGlobal()
  const location = useLocation()
  useEffect(() => {
    reInitMenu()
  }, [location.key])

  const isHyperChat = window.location.pathname.includes('hyperchat')
  const isHyperCodes = window.location.pathname.includes('hypercodes')
  const isMarketplace = window.location.pathname.includes('marketplace')

  const style: any = {}
  const styleOther: any = {}

  if (isHyperChat || isHyperCodes || isMarketplace) {
    style.marginLeft = 0
  }
  if (isMarketplace) {
    styleOther.marginTop = 0
  }

  const [scrollPosition, setScrollPosition] = useState(0)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (scrollPosition > 0) {
      setIsSticky(true)
    } else {
      setIsSticky(false)
    }
  }, [scrollPosition])

  const itemClass = 'ms-1 ms-lg-3'

  return (
    <PageDataProvider>
      <ThemeModeProvider>
        <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
          <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
            {/* <Navbar/> */}
            {/* {!isMarketplace && <HeaderWrapper />} */}
            <Navbar />
            <div
              style={style}
              className='app-wrapper flex-column flex-row-fluid'
              id='kt_app_wrapper'
            >
              <Sidebar />
              <div
                style={styleOther}
                className='app-main flex-column flex-row-fluid'
                id='kt_app_main'
              >
                <div className='d-flex flex-column flex-column-fluid'>
                  <ToolbarWrapper />
                  <Content>
                    <Outlet />
                  </Content>
                </div>
                {/* <Important /> */}
                <FooterWrapper />
              </div>
            </div>
          </div>
        </div>

        {/* begin:: Drawers */}
        <ActivityDrawer />
        <RightToolbar />
        <DrawerMessenger />
        {/* end:: Drawers */}

        {/* begin:: Modals */}
        <InviteUsers />
        <UpgradePlan />
        {/* end:: Modals */}
        <ScrollTop />
        {/* {!openModal && <Modal />} */}
      </ThemeModeProvider>
    </PageDataProvider>
  )
}

export {MasterLayout}
