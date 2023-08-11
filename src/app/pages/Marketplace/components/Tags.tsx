import React, {useState} from 'react'
import styles from '../Collection.module.scss'
import {useAuthService} from '../../../services/authService'
import {useGlobal} from '../../../context/AuthContext'
import {IoMdCloseCircle} from 'react-icons/io'
import {Modal, Button} from 'react-bootstrap'

interface TagsProps {
  item: {
    collectionname: string
    id: any
  }
  selected?: boolean
  onClick?: (item: any) => void
}

const Tags: React.FC<TagsProps> = ({item, onClick, selected}) => {
  const {removeCollection, getAllCollection} = useAuthService()
  const {accessToken} = useGlobal()
  const [isHovering, setHovering] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async (id: number) => {
    setShowConfirm(false)
    await removeCollection(id)
    getAllCollection(accessToken)
  }

  return (
    <div
      className={`${styles.tagWrapper} ${selected ? styles.selected : 'tag'} `}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button onClick={() => onClick && onClick(item.id)} className={styles.tags}>
        <label>{item.collectionname}</label>
        {isHovering && (
          <span onClick={() => setShowConfirm(true)}>
            <IoMdCloseCircle />
          </span>
        )}
      </button>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Body>Are you sure you want to delete this collection?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant='danger' onClick={() => handleDelete(item.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Tags
