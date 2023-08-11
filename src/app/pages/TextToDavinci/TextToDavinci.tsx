import React, {FC, useEffect, useState} from 'react'
import {useGlobal} from '../../context/AuthContext'
import Modal from 'react-bootstrap/Modal'
import Kanban from '../kanban/Kanban'
import {useAuthService} from '../../services/authService'
import Dropdown from 'react-bootstrap/Dropdown'

const TextToImage: FC = () => {
  const {
    imageData,
    setLoading,
    setImageData,
    loading,
    promptTitle,
    setPromptTitle,
    showAlert,
    setShowAlert,
    balance,
    showKanban,
    allCollection,
  } = useGlobal()
  const {addCollectionList} = useAuthService()
  const [showModal, setShowModal] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')
  const [showLinks, setShowLinks] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [activeCard, setActiveCard] = useState(-1)

  const handleImageClick = (src: string) => {
    setShowModal(true)
    setModalImageSrc(src)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalImageSrc('')
  }

  useEffect(() => {
    setImageData('')
    setPromptTitle('')
    setLoading(false)
  }, [window.location])

  const sendCollection = (id: any, url: any) => {
    try {
      addCollectionList(id, url)
      setShowAlert('Image added to collection')
    } catch (error: string | any) {
      setShowAlert(error)
    }
  }

  if (loading) {
    return (
      <div className=''>
        {balance > 0 && (
          <div className='text-primary mb-3 d-flex flex-column justify-content-center align-items-center h-100'>
            <div
              style={{zIndex: 99999}}
              className='spinner-border text-primary '
              role='status'
            ></div>
            <span className='d-block'>Wait please...</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='position-relative'>
      {showAlert && (
        <div
          className='alert alert-warning alert-dismissible fade show position-absolute top-0 w-50 mt-4 start-50 translate-middle-x'
          role='alert'
          style={{zIndex: 1030}}
        >
          {showAlert}
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}
      <div className='row justify-content-center'>
        {/* <Kanban /> */}
        <div style={{marginLeft: '5rem'}}>
          <div className='row justify-content-center d-flex'>
            {imageData?.image ? (
              <div className='col-md-4 mb-5 mb-xl-10 d-flex justify-content-center'>
                <div
                  onMouseEnter={() => setShowLinks(true)}
                  onMouseLeave={() => setShowLinks(false)}
                  className='card  position-relative'
                  style={{width: '300px'}}
                >
                  <a
                    className='m-2'
                    href='#'
                    onClick={() => handleImageClick(imageData && imageData?.image)}
                  >
                    <img
                      className='rounded-3 img-fluid'
                      alt=''
                      src={imageData && imageData?.image}
                    />
                  </a>
                  {activeCard && (
                    <div className='position-absolute dropdown-wrapper'>
                      <Dropdown>
                        <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                          Add Collection
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {allCollection?.map((collection: any, i: any) => (
                            <Dropdown.Item
                              onClick={() => sendCollection(collection.id, imageData?.image)}
                              href='#'
                              key={i}
                            >
                              {collection?.collectionname}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='col-md-12 text-center'>
                <h5>No Image</h5>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <img src={modalImageSrc} alt='' />
      </Modal>
    </div>
  )
}

export default TextToImage
