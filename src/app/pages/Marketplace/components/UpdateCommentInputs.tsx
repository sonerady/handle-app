import React, {useEffect, useRef, useState} from 'react'
import styles from '../AddApp.module.scss'
import Title from './Title'
import {CropperRef} from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'

import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'
import {FaStar} from 'react-icons/fa'
interface AddAppInputsProps {
  comment?: any
  commentId?: any
  setShow?: any
  handleClose?: any
  isRated?: any
}

const AddAppInputs: React.FC<AddAppInputsProps> = ({comment, commentId, handleClose, isRated}) => {
  const [editComment, setEditComment] = useState<string>(comment)
  const {fixComment} = useAuthService()
  const maxDescriptionLength = 1000

  const handleChange = (e: any) => {
    setEditComment(e.target.value)
  }

  // const handleStarClick = (i: any) => {
  //   setReviewData({...reviewData, rating: i + 1})
  // }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    fixComment(commentId, editComment, 0).then((res: any) => {
      console.log(res)
      if (res.Status === 200) {
        toast.success(res.Description, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        handleClose()
      } else {
        toast.error(res.Description, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    })
  }

  const stars = Array(5).fill(0)
  const [rating, setRating] = useState(0)

  return (
    <div>
      <div style={{border: 'none'}} className={`${styles.card} ${styles.left} card`}>
        <Title>UPDATE YOUR COMMENT</Title>

        <form className={styles.formWrapper}>
          <label className={styles.label}>
            <div className={styles.leftSide}>
              <span>Description</span>
              <span className={styles.required}>*</span>
            </div>
          </label>
          <textarea
            className={styles.descText}
            rows={8}
            maxLength={maxDescriptionLength}
            placeholder='App description'
            id='description'
            name='description'
            onChange={handleChange}
            value={editComment}
          />
          {isRated && (
            <>
              <label className={styles.label}>
                <div className={styles.leftSide}>
                  <span>Description</span>
                  <span className={styles.required}>*</span>
                </div>
              </label>
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
              >
                {stars?.map((_, i) => (
                  <FaStar
                    key={i}
                    // color={i < reviewData.rating ? '#FD7DA4' : 'gray'}
                    // onClick={() => handleStarClick(i)}
                  />
                ))}
              </div>
            </>
          )}
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddAppInputs
