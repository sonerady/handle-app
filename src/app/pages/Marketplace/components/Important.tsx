import {BiInfoCircle} from 'react-icons/bi'
import {useGlobal} from '../../../../app/context/AuthContext'
import styles from '../Home.module.scss'

const Important = () => {
  const {userInfo, handleModalToggle} = useGlobal()
  const accessTokenLocal = localStorage.getItem('accessTokenMarketplace')

  const isVerified = userInfo?.data?.is_verified

  return (
    <div className={styles.importantContainer}>
      {!isVerified && accessTokenLocal ? (
        <div className={styles.announcement}>
          <div className={styles.announcementLeft}>
            <span className={styles.announcementIcon}>
              <BiInfoCircle />
            </span>
            <span className={styles.announcementText}>IMPORTANT: </span>
            <span className={styles.announcementTextSecond}>
              Complete your profile to unlock exclusive features. Don't miss out on the
              opportunities available only to fully registered members!
            </span>
            <span onClick={handleModalToggle} className={styles.announcementTextThird}>
              Click and complete your membership now!
            </span>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Important
