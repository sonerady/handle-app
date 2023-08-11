import React, {useState, useRef, useEffect} from 'react'
import styles from '../Home.module.scss'
import {useGlobal} from '../../../context/AuthContext'
import {Link, useNavigate} from 'react-router-dom'
import arrow from '../../../../_metronic/assets/icons/arrow.svg'
import {MdOutlineLogout} from 'react-icons/md'
import {useAuthService} from '../../../services/authService'
interface DropdownProps {
  isOpen: boolean
  onClose: () => void
  onClick?: () => void
}

const Dropdown: React.FC<DropdownProps> = ({isOpen, onClose}) => {
  const {account, roles, googleAccessToken} = useGlobal()
  const navigate = useNavigate()
  const [isSubmenuOpen, setSubmenuOpen] = useState(false)

  const accountLine = account?.slice(0, 6) + '...' + account?.slice(-4)
  const dropdownRef = useRef<HTMLDivElement>(null) // Bu satırı ekleyin
  const {accessToken, setAccessToken, userInfo} = useGlobal()
  const {logOut, googleLogout} = useAuthService()
  // Bu useEffect'i ekleyin
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const isAdmin = roles?.sonuc?.role

  const isDiscordUser = localStorage.getItem('discordAccessToken')

  if (!isOpen) return null
  const accessTokenLocal = localStorage.getItem('accessTokenMarketplace')
  return (
    <div className={styles.dropdownMenu}>
      <div>
        <div className={styles.item}>
          <Link to={'/profile'}>Profile</Link>
          <Link to={'/space'}>My Space</Link>
          <Link to={'/collection'}>Collections</Link>

          {userInfo?.data.discordToken && isDiscordUser && (
            <Link className={styles.leaderboard} to={'/leaderboard'}>
              Leaderboard
            </Link>
          )}
          {/* {userInfo?.data.discord_role === 'HyperAdmin' && isDiscordUser && (
            <Link className={styles.leaderboard} to={'/add-campaign'}>
              Add Campaign
            </Link>
          )} */}
          {/* <Link to={'/balance'}>Balance</Link> */}
          {userInfo?.data.discordToken && isDiscordUser && (
            <span
              className={styles.submenuTitle}
              onClick={(event) => {
                event.stopPropagation()
                setSubmenuOpen(!isSubmenuOpen)
              }}
            >
              {userInfo?.data.discord_role === 'HyperAdmin' && isDiscordUser ? (
                <p onClick={() => navigate('/admin-dao')}>Admin Dao</p>
              ) : (
                <p>Dao</p>
              )}

              {userInfo?.data.discord_role !== 'HyperAdmin' && isDiscordUser && (
                <img
                  className={`${styles.arrow} ${isSubmenuOpen ? styles.arrowDown : styles.arrowUp}`}
                  src={arrow}
                  alt=''
                />
              )}
            </span>
          )}

          {isSubmenuOpen &&
            userInfo?.data.discordToken &&
            userInfo?.data.discord_role !== 'HyperAdmin' &&
            isDiscordUser && (
              <div className={styles.submenu}>
                <Link to={'/dao?task=add-app'}>Add App</Link>
                {/* <Link to={'/dao?task=add-comment'}>Add Comment</Link> */}
                <Link to={'/dao?task=approve-comment'}>Approve Review</Link>
                <Link to={'/dao?task=approve-app'}>Approve App</Link>
              </div>
            )}
          {accessTokenLocal && (
            <button
              onClick={async () => {
                localStorage.removeItem('accessTokenMarketplace')
                const id = localStorage.getItem('discordAccessToken')
                const response = await logOut(id)
                if (response) {
                  await googleLogout(googleAccessToken)
                  window.location.reload()
                  localStorage.removeItem('discordAccessToken')
                  localStorage.removeItem('accessTokenMarketplace')
                  localStorage.removeItem('login')
                  localStorage.removeItem('discordID')
                  localStorage.removeItem('userId')
                  localStorage.removeItem('role')
                  localStorage.removeItem('avatarUrl')
                  localStorage.removeItem('userName')
                  localStorage.removeItem('googleAccessToken')
                  localStorage.removeItem('metamaskAccount')
                  localStorage.removeItem('disLogin')
                  localStorage.removeItem('isVerifiedUser')
                  navigate('/marketplace')
                }
              }}
              className={` ${styles.logoutButton}`}
            >
              <span style={{fontSize: '13px'}}>Logout</span>
              <span className={styles.logoutIcon}>
                <MdOutlineLogout />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dropdown
