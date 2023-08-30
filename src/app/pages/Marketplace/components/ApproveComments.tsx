import React, {FC, useEffect, useState} from 'react'
import styles from '../AddApp.module.scss'
import moment from 'moment'
import Select from 'react-select'

import {FaRegStar, FaStar} from 'react-icons/fa'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {Form, Modal} from 'react-bootstrap'
import Review from '../Review'
import {IoMdAddCircleOutline} from 'react-icons/io'
import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'
import review from '../../../../_metronic/assets/marketplace/icons/review.svg'
import {useNavigate} from 'react-router-dom'
interface ApproveCommentsProps {
  item: any
  approvalReviews: any
  setApprovalReviews: any
}

const ApproveComments: FC<ApproveCommentsProps> = ({item, approvalReviews, setApprovalReviews}) => {
  const [show, setShow] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const {
    approveReview,
    getForApprovalReviews,
    rejectReview,
    getUserCampaignConditions,
    getVariables,
  } = useAuthService()
  const [reviews, setReviews] = useState([])
  const navigate = useNavigate()
  const handleClose = () => setShow(false)
  const handleShow = (app: any) => {
    setSelectedApp(app)
    setShow(true)
  }

  const [showRejectModal, setShowRejectModal] = useState(false)

  const [reason, setReason] = useState('')
  const [inputValue, setInputValue] = useState('')

  const [selectedCategories, setSelectedCategories] = useState<any>(null)
  const [reasonData, setReasonData] = useState([])

  const selectOptions = reasonData?.map((category: any) => ({
    value: category.order_value,
    label: category.name ? category.name : 'No Category',
  }))

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption && selectedOption.length > 1) {
      toast.error('You can select only one category.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }
    setSelectedCategories(selectedOption || [])
    setInputValue(selectedOption.label)
  }

  useEffect(() => {
    if (inputValue === 'Other') {
      setInputValue('')
    }
  }, [inputValue])

  const getVariable = () => {
    getVariables('comment_reject_reasons').then((res: any) => {
      setReasonData(res)
    })
  }

  useEffect(() => {
    if (showRejectModal) {
      getVariable()
    }
  }, [showRejectModal])

  const handleShowRejectReason = (app: any) => {
    setSelectedApp(app)
    setShow(true)
  }

  const handleCloseRejectReason = () => {
    setInputValue('')
    setShow(false)
  }

  const handleChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const handleSave = () => {
    setReason(inputValue)
    rejectReview(item.id, inputValue)
    handleCloseRejectReason()
  }

  const handleShowRejectModal = (app: any) => {
    setSelectedApp(app)
    setShowRejectModal(true)
  }

  const handleCloseRejectModal = () => {
    setInputValue('')
    setShowRejectModal(false)
  }

  const handleReject = () => {
    if (inputValue.trim() === '') {
      toast.error('Please provide a reason for rejection.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    } else {
      rejectReview(item.id, inputValue)
        .then((res) => {
          if (res.Status === 200) {
            toast.success('Successfully rejected', {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
            getUserCampaignConditions()
            handleCloseRejectModal()
          } else {
            toast.error(res.Description, {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
          }
        })
        .catch((err) => {
          toast.error('An error occurred while rejecting the review.', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        })
    }
  }

  const handleApprove = (id: any) => {
    approveReview(id)
      .then((res) => {
        if (res.Status === 400) {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else {
          toast.success('Approved', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          getUserCampaignConditions()
          getForApprovalReviews().then((res) => {
            setApprovalReviews(res)
          })
        }
      })
      .catch((err) => {
        toast.error('An error occurred while approving the review.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      })
  }

  console.log('item', item)

  return (
    <div>
      <div className={styles.tabContent}>
        <div>
          <div className={`${styles.row}`}>
            <ul>
              <li title={moment(item.created_at).format('DD.MM.YYYY')}>
                {moment(item.created_at).format('DD.MM.YYYY')}
              </li>
              <li title={item.name}>
                {!item.is_comment
                  ? Array(5)
                      .fill(0)
                      .map((_, i) =>
                        i < item.rating ? (
                          <span className={styles.activeRating}>
                            <FaStar />
                          </span>
                        ) : (
                          <FaRegStar />
                        )
                      )
                  : ''}
              </li>
              <li className={styles.approveAppBtn}>
                <OverlayTrigger
                  delay={{hide: 450, show: 300}}
                  overlay={(props) => <Tooltip {...props}>{item.comment}</Tooltip>}
                  placement='bottom'
                >
                  <div>
                    {item?.comment.length > 24
                      ? item?.comment.substring(0, 24) + '...'
                      : item?.comment}
                  </div>
                </OverlayTrigger>
              </li>
              <li>
                <span>{item.is_comment ? 'Comment' : 'Review'}</span>
              </li>
              <li title={item.content}>
                <span>{item.approves}</span>
              </li>
              <li className={styles.viewAppBtn}>
                <button
                  style={{
                    borderColor: 'red',
                    color: 'red',
                  }}
                  onClick={() => navigate(`/marketplace/detail/${item?.name}/${item?.appid}`)}
                >
                  View
                </button>
              </li>
              <li className={styles.approveAppBtn}>
                <button
                  style={{
                    borderColor: 'red',
                    color: 'red',
                  }}
                  onClick={() => {
                    handleShowRejectModal(item)
                  }}
                >
                  Reject
                </button>
              </li>
              <li className={styles.approveAppBtn}>
                <button
                  style={{
                    borderColor: '#1aaa55',
                    color: '#1aaa55',
                  }}
                  onClick={() => {
                    handleApprove(item.id)
                  }}
                >
                  Approve
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal size='sm' show={showRejectModal} onHide={handleCloseRejectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reason for rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            value={selectedCategories}
            styles={{
              control: (baseStyles, state) => ({
                marginBottom: '1rem',
                ...baseStyles,
                borderColor: state.isFocused ? '#fb6fbb' : 'rgba(128, 128, 128, 0.3411764706)',
                backgroundColor: 'transparent',
                width: '100%',
                color: '#FFF',
              }),
              option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                return {
                  ...styles,
                  width: '100%',
                  color: '#FFF',
                  backgroundColor: '#1f1f21',
                  cursor: isDisabled ? 'not-allowed' : 'default',
                }
              },
            }}
            options={selectOptions}
            isSearchable // Enable search functionality
            onChange={handleSelectChange}
          />
          {selectedCategories?.value === 99 && (
            <Form.Control as='textarea' rows={4} value={inputValue} onChange={handleChange} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              cursor: 'pointer',
            }}
            className={styles.saveButton}
            onClick={handleReject}
          >
            Save
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ApproveComments
