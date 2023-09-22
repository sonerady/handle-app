import {FC, useEffect, useState} from 'react'
import {useGlobal} from '../../context/AuthContext'
import Modal from 'react-bootstrap/Modal'

import Kanban from '../kanban/Kanban'
import Collection from '../../../_metronic/layout/components/collection/Collection'
import CollectionMenu from '../../pages/Marketplace/components/CollectionMenu'
import Dropdown from 'react-bootstrap/Dropdown'
import {useAuthService} from '../../services/authService'
import {useLocation} from 'react-router-dom'

const TextToImage: FC = () => {
  const {
    imageData,
    setLoading,
    setImageData,
    loading,
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
  const [activeCard, setActiveCard] = useState(-1)
  const [collectionName, setCollectionName] = useState('')
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const platform = searchParams.get('platform')

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

  if (loading) {
    return (
      <div className=''>
        {balance > 0 && (
          <div className='mb-3 d-flex flex-column justify-content-center align-items-center h-100'>
            <div style={{zIndex: 99999}} className='spinner-border ' role='status'></div>
            <span className='fw-bolder fs-6 me-2'>Wait please...</span>
          </div>
        )}
      </div>
    )
  }

  const sendCollection = (id: any, url: any) => {
    try {
      addCollectionList(id, url)
      setShowAlert('Image added to collection')
    } catch (error: string | any) {
      setShowAlert(error)
    }
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
        <div style={{marginLeft: platform ? 0 : '5rem'}}>
          <div className='row d-flex justify-content-center'>
            {/* <CollectionMenu setCollectionName={setCollectionName} /> */}
            {imageData?.datam?.length
              ? imageData?.datam.map((image: any, index: number) => (
                  <div className='col-md-4 mb-5 mb-xl-10 d-flex justify-content-center' key={index}>
                    <div
                      onMouseEnter={() => setActiveCard(index)}
                      onMouseLeave={() => setActiveCard(-1)}
                      className='card  position-relative'
                      style={{width: '300px'}}
                    >
                      <a className='m-2' href='#' onClick={() => handleImageClick(image)}>
                        <img className='rounded-3 img-fluid' src={image} alt='' />
                      </a>
                      {activeCard === index && (
                        <div className='position-absolute dropdown-wrapper'>
                          <Dropdown>
                            <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                              Add Collection
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {allCollection?.map((collection: any, i: any) => (
                                <Dropdown.Item
                                  onClick={() => sendCollection(collection.id, image)}
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
                ))
              : 'No Image'}
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
