import {MdOutlineCollectionsBookmark} from 'react-icons/md'
import {useGlobal} from '../../../../app/context/AuthContext'
import styles from './Collection.module.scss'
const Collection = () => {
  const {showKanban, setShowKanban, allCollection} = useGlobal()
  return (
    <div className={styles.container}>
      {!showKanban ? (
        <button onClick={() => setShowKanban(true)} className={styles.addButton}>
          <span
            style={{
              position: 'relative',
              top: '-1px',
              fontSize: '1.5rem',
            }}
          >
            <MdOutlineCollectionsBookmark />
          </span>
          <span>Add to collection</span>
        </button>
      ) : (
        <div>
          <span className={styles.title}>Your Collection</span>
          <div className={styles.collectionContainer}>
            {allCollection.length > 0
              ? allCollection?.map((item: any) => {
                  return (
                    <button
                      key={item.id} // or any other unique property
                      onClick={() => setShowKanban(true)}
                      className={styles.addButton}
                    >
                      <span>{item?.collectionname}</span>
                    </button>
                  )
                })
              : ''}
          </div>
        </div>
      )}
    </div>
  )
}

export default Collection
