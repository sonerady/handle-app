/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {Link, useLocation} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'
import {Header} from './Header'
import {Navbar} from './Navbar'
import Logo from '../../../assets/Logo.svg'
import {useGlobal} from '../../../../app/context/AuthContext'
import MetaMaskConnect from '../Metamask/metamaskHeader'
import {ThemeModeSwitcher} from '../../../partials'

export function HeaderWrapper() {
  const {config, classes} = useLayout()
  if (!config.app?.header?.display) {
    return null
  }

  const isHyperChat = !window.location.pathname.includes('hyperchat')
  const isHyperCodes = !window.location.pathname.includes('hypercodes')

  const style: any = {}

  if (isHyperChat || isHyperCodes) {
    style.left = 0
    style.display = 'none'
  }
  if (!isHyperChat || !isHyperCodes) {
    style.left = 0
    style.display = 'flex'
  }

  const itemClass = 'ms-1 ms-lg-3'

  return (
    <>
      {!isHyperChat || !isHyperCodes ? (
        <div style={style} id='kt_app_header' className='app-header'>
          <div
            id='kt_app_header_container'
            className={clsx(
              'app-container flex-lg-grow-1 gap-3',
              classes.headerContainer.join(' '),
              config.app?.header?.default?.containerClass
            )}
          >
            <a
              className='d-flex align-items-center justify-content-center'
              href='https://hypergpt.ai/'
              target='_blank' rel="noreferrer"
            >
              {config.layoutType === 'dark-sidebar' ? (
                <img alt='Logo' src={Logo} className='h-25px app-sidebar-logo-default' />
              ) : (
                <>
                  <img
                    alt='Logo'
                    src={Logo}
                    className='h-25px app-sidebar-logo-default theme-light-show'
                  />
                  <img
                    alt='Logo'
                    src={Logo}
                    className='h-25px app-sidebar-logo-default theme-dark-show'
                  />
                </>
              )}

              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/default-small.svg')}
                className='h-20px app-sidebar-logo-minimize'
              />
            </a>
            <MetaMaskConnect />
            {/* <button>Login Metamask</button> */}
            {/* {login && <span>{'account'}</span>} */}

            {!(config.layoutType === 'dark-sidebar' || config.layoutType === 'light-sidebar') && (
              <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
                <Link to='/hyperchat'>
                  {config.layoutType !== 'dark-header' ? (
                    <img
                      alt='Logo'
                      src={toAbsoluteUrl('/media/logos/default.svg')}
                      className='h-20px h-lg-30px app-sidebar-logo-default'
                    />
                  ) : (
                    <>
                      <img
                        alt='Logo'
                        src={toAbsoluteUrl('/media/logos/default-dark.svg')}
                        className='h-20px h-lg-30px app-sidebar-logo-default theme-light-show'
                      />
                      <img
                        alt='Logo'
                        src={toAbsoluteUrl('/media/logos/default-small-dark.svg')}
                        className='h-20px h-lg-30px app-sidebar-logo-default theme-dark-show'
                      />
                    </>
                  )}
                </Link>
              </div>
            )}
            <div
              id='kt_app_header_wrapper'
              className='d-flex align-items-center justify-content-center flex-lg-grow-1'
            >
              {config.app.header.default?.content === 'menu' &&
                config.app.header.default.menu?.display && (
                  <div
                    className='app-header-menu app-header-mobile-drawer align-items-stretch'
                    data-kt-drawer='true'
                    data-kt-drawer-name='app-header-menu'
                    data-kt-drawer-activate='{default: true, lg: false}'
                    data-kt-drawer-overlay='true'
                    data-kt-drawer-width='225px'
                    data-kt-drawer-direction='end'
                    data-kt-drawer-toggle='#kt_app_header_menu_toggle'
                    data-kt-swapper='true'
                    data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                    data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
                  >
                    <Header />
                  </div>
                )}
              <Navbar />
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '0.4rem',
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'end',
            position: 'absolute',
            right: '0',
          }}
        >
          {/* <div className={clsx('app-navbar-item', itemClass)}>
            <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
          </div> */}
          {config.app.sidebar?.display && (
            <>
              <div
                className='d-flex align-items-center d-lg-none ms-n2 me-2'
                title='Show sidebar menu'
              >
                <div
                  className='btn btn-icon btn-active-color-primary w-35px h-35px'
                  id='kt_app_sidebar_mobile_toggle'
                >
                  <KTIcon iconName='abstract-14' className=' fs-1' />
                </div>
              </div>
            </>
          )}
          <MetaMaskConnect />
        </div>
      )}
    </>
  )
}
