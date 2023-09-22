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
import {useGlobal} from '../../../context/AuthContext'
import Griddle, {ColumnDefinition, RowDefinition, plugins} from 'griddle-react'

interface ApproveCommentsProps {
  item?: any
  approvalReviews: any
  setApprovalReviews: any
  approvalReviewsLoading?: any
}

const ApproveComments: FC<ApproveCommentsProps> = ({
  item,
  approvalReviews,
  setApprovalReviews,
  approvalReviewsLoading,
}) => {
  const [show, setShow] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)

  const [approvingLoading, setApprovingLoading] = useState(false)
  const [rejectingLoading, setRejectingLoading] = useState(false)
  const {setReopenModal} = useGlobal()
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

  useEffect(() => {
    const inputElement = document.querySelector('.griddle-filter') as HTMLInputElement

    if (inputElement) {
      inputElement.placeholder = 'Search'
    }
  })

  const handleReject = () => {
    if (inputValue.trim() === '') {
      toast.error('Please provide a reason for rejection.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    } else {
      setRejectingLoading(true)
      rejectReview(selectedApp, inputValue)
        .then((res) => {
          if (res.discord_unauthorized) {
            setReopenModal(true)
          }
          if (res.Status === 200) {
            setRejectingLoading(false)
            toast.success('Successfully rejected', {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
            getUserCampaignConditions()
            getForApprovalReviews().then((res) => {
              setApprovalReviews(res)
            })
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
          setRejectingLoading(false)
        })
    }
  }

  const handleApprove = (id: any) => {
    setApprovingLoading(true)
    approveReview(id)
      .then((res) => {
        setApprovingLoading(false)
        if (res.discord_unauthorized) {
          setReopenModal(true)
        }
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
        setApprovingLoading(false)
      })
  }

  const styleConfig = {
    // icons: {
    //   TableHeadingCell: {
    //     sortDescendingIcon: <small>(desc)</small>,
    //     sortAscendingIcon: <small>(asc)</small>,
    //   },
    // },
    classNames: {
      Row: 'row-class',
    },
    styles: {
      Filter: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        alignItems: 'center',
        height: '30px',
        borderRadius: '10px',
        background: '#1a1c21',
        border: '1px solid rgba(128, 128, 128, 0.179)',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#CD6094',
        width: '250px',
        marginRight: '10px',
        marginBottom: '10px',
      },
      Row: {
        height: '42px',
      },
      Cell: {
        border: '1px solid #80808024',
        width: '10%',
      },
      TableHeading: {
        backgroundColor: '#15171b',
        border: 'none',
        height: '42px',
      },
      SettingsToggle: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        alignItems: 'center',
        height: '40px',
        borderRadius: '10px',
        background: 'var(--neutral-neutral, #232325)',
        border: 'none',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#CD6094',
      },
    },
  }

  useEffect(() => {
    const inputElement = document.querySelector('.griddle-filter') as HTMLInputElement

    if (inputElement) {
      inputElement.placeholder = 'Search'
    }
  })

  return (
    <div>
      <div className={styles.tabContent}>
        {approvalReviewsLoading ? (
          <span
            style={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '20px',
            }}
          >
            Loading...
          </span>
        ) : approvalReviews.length > 0 ? (
          <Griddle
            pageProperties={{
              pageSize: 50,
            }}
            enableSettings={false}
            styleConfig={styleConfig}
            data={approvalReviews}
            plugins={[plugins.LocalPlugin]}
          >
            <RowDefinition>
              <ColumnDefinition
                id='createdAt'
                title='Date'
                customComponent={(props: any) => (
                  <span>{moment(props.value).format('DD-MM-YYYY')}</span>
                )}
              />
              <ColumnDefinition
                id='rating'
                title='Rating'
                customComponent={(props: any) =>
                  !props.value
                    ? () => <span></span>
                    : Array(5)
                        .fill(0)
                        .map((_, i) =>
                          i < props.value ? (
                            <span className={styles.activeRating}>
                              <FaStar />
                            </span>
                          ) : (
                            <FaRegStar />
                          )
                        )
                }
              />
              <ColumnDefinition
                id='comment'
                title='Comment'
                customComponent={(props: any) => (
                  <OverlayTrigger
                    delay={{hide: 450, show: 300}}
                    overlay={<Tooltip>{props.value}</Tooltip>}
                    placement='bottom'
                  >
                    <div>
                      {props?.value.length > 24
                        ? props?.value.substring(0, 20) + '...'
                        : props?.value}
                    </div>
                  </OverlayTrigger>
                )}
              />
              <ColumnDefinition
                id='is_comment'
                title='Type'
                customComponent={(props: any) => <span>{props.value ? 'Comment' : 'Review'}</span>}
              />
              <ColumnDefinition
                id='approves'
                title='Approves'
                customComponent={(props: any) => <span>{props.value}</span>}
              />
              <ColumnDefinition
                id='appid'
                title='View App'
                customComponent={(props: any) => (
                  <li className={styles.viewAppBtn}>
                    <button
                      style={{
                        borderColor: 'red',
                        color: 'red',
                      }}
                      onClick={() => navigate(`/marketplace/detail/${props?.name}/${props?.value}`)}
                    >
                      App Detail
                    </button>
                  </li>
                )}
              />
              <ColumnDefinition
                id='id'
                title='Action'
                customComponent={(props: any) => (
                  <li className={styles.approveAppBtn}>
                    <button
                      style={{
                        borderColor: 'red',
                        color: 'red',
                      }}
                      onClick={() => {
                        handleShowRejectModal(props.value)
                      }}
                    >
                      Reject
                    </button>
                    <button
                      style={{
                        borderColor: '#1aaa55',
                        color: '#1aaa55',
                      }}
                      onClick={() => {
                        setApprovingLoading(true)
                        handleApprove(props.value)
                      }}
                    >
                      {approvingLoading ? 'Approving...' : 'Approve'}
                    </button>
                  </li>
                )}
              />
            </RowDefinition>
          </Griddle>
        ) : (
          <span
            style={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              fontSize: '20px',
            }}
          >
            No Data
          </span>
        )}
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
            {rejectingLoading ? 'Rejecting...' : 'Submit'}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ApproveComments
