import React, {useEffect, useRef, useState} from 'react'
import styles from '../AddApp.module.scss'
import Title from '../components/Title'
import {useGlobal} from '../../../context/AuthContext'
import {useAuthService} from '../../../services/authService'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import robotIcon from '../../../_metronic/assets/icons/robot.svg'
import {convertToRaw, EditorState} from 'draft-js'
import 'react-tagsinput/react-tagsinput.css'
import {FiEdit, FiPlus} from 'react-icons/fi'
import {AiOutlineEye} from 'react-icons/ai'
import draftToHtml from 'draftjs-to-html'
import {Editor} from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {MdCloudUpload} from 'react-icons/md'
import {Form} from 'react-bootstrap'
import {CropperRef, Cropper, FixedCropper, ImageRestriction} from 'react-advanced-cropper'
import {TiDelete} from 'react-icons/ti'
import Select from 'react-select'
import ApproveComments from '../components/ApproveComments'
import ApproveApp from '../components/ApproveApp'
import AddComment from '../components/AddReview'
import {toast} from 'react-toastify'
import {useNavigate, useLocation} from 'react-router-dom'
import {Modal} from 'react-bootstrap'

interface AddAppInputsProps {
  formik: any
  descState: any
  setDescState: any
  fileNames: any
  handleAddApp: () => void
  setFileNames: any
  fileUpload: any
  backgrounds: any
  setBackgrounds: any
  selectedCategories: any
  setSelectedCategories: any
  handleCategoryClick: (category: string) => void
  categories: any
  setCategories: any
  setContentState: any
  contentState: any
  isVerified: boolean
  setIsVerified: (value: boolean) => void
  isFeatured: boolean
  setIsFeatured: (value: boolean) => void
  isNew: boolean
  setIsNew: (value: boolean) => void
  isTrending: boolean
  setIsTrending: (value: boolean) => void
}

const AddAppInputs: React.FC<AddAppInputsProps> = ({
  handleCategoryClick,
  setContentState,
  fileUpload,
  contentState,
  setSelectedCategories,
  selectedCategories,
  formik,
  backgrounds,
  setBackgrounds,
  handleAddApp,
  descState,
  setDescState,
  fileNames,
  setFileNames,
  categories,
  setCategories,
  isVerified,
  setIsVerified,
  isFeatured,
  setIsFeatured,
  isNew,
  setIsNew,
  isTrending,
  setIsTrending,
}) => {
  const handleVerifiedClick = (value: boolean) => {
    formik.setFieldValue('isverified', value)
    setIsVerified(value)
  }

  const handleFeaturedClick = (value: boolean) => {
    formik.setFieldValue('isfeautured', value)
    setIsFeatured(value)
  }

  const handleNewClick = (value: boolean) => {
    formik.setFieldValue('isnew', value)
    setIsNew(value)
  }

  const handleTrendingClick = (value: boolean) => {
    formik.setFieldValue('istrending', value)
    setIsTrending(value)
  }

  const [iconImage, setIconImage] = useState<string | null>(null)

  const maxDescriptionLength = 1000
  const maxNameLength = 50
  const maxTitleLength = 100

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [showModal, setShowModal] = useState<any>()

  const [link, setLink] = useState('')

  const cropperRef = useRef<CropperRef | any>(null)

  const [showDeleteButtonIndex, setShowDeleteButtonIndex] = useState<number | null>(null)

  const [image, setImage] = useState<string | null>(null)

  const [originalFileType, setOriginalFileType] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null
    if (file) {
      setImage(URL.createObjectURL(file))
      setIconImage(URL.createObjectURL(file))
      setOriginalFileType(file.type)
    }
  }

  const selectOptions = categories?.map((category: any) => ({
    value: category.name,
    label: category.isactive ? category.name : 'No Category',
  }))

  const handleCrop = async (imageName: any) => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas()
      if (canvas !== null) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve))
        if (blob !== null) {
          const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/bmp', 'image/png', 'image/webp']
          if (!validMimeTypes.includes(originalFileType || '')) {
            toast.error(
              'Invalid image format. Only jpeg, bmp, png, jpg, and webp formats are accepted.',
              {
                position: toast.POSITION.BOTTOM_RIGHT,
              }
            )
            return
          }
          const formData = new FormData()
          formData.append('file', blob, 'image.png')
          const response = await fileUpload(formData)
          if (response?.link) {
            formik.setFieldValue(imageName, response?.link)
            toast.success('Image Upload completed successfully!', {
              position: toast.POSITION.BOTTOM_RIGHT,
            })
            setBackgrounds((prev: any) => ({...prev, [imageName]: response?.link}))
            setShowModal(false)
            setImage(null)
          }
          setLink(response?.link)
        }
      }
    }
  }

  const characterCount = descState.getCurrentContent().getPlainText().length
  const remainingCharacters = maxDescriptionLength - characterCount

  const handleSelectChange = (selectedOptions: any) => {
    if (selectedOptions && selectedOptions.length > 5) {
      toast.error('You can select up to 5 categories.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }
    setSelectedCategories(selectedOptions?.map((option: any) => option.value) || [])
  }

  return (
    <div>
      {' '}
      <div style={{border: 'none'}} className={`${styles.card} ${styles.left} card`}>
        <form className={styles.formWrapper} onSubmit={formik.handleSubmit}>
          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Name</span>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.lengthText}>{formik.values.name.length}/50</div>
          </label>
          <input
            maxLength={maxNameLength}
            placeholder='App Name'
            id='name'
            name='name'
            type='text'
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && formik.touched.name && (
            <div className={styles.error}>{formik.errors.name}</div>
          )}
          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Title</span>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.lengthText}>{formik.values.title.length}/100</div>
          </label>
          <input
            maxLength={maxTitleLength}
            placeholder='App Title'
            id='title'
            name='title'
            type='text'
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Link</span>
              <span className={styles.required}>*</span>
            </div>
          </label>
          <input
            placeholder='App Link'
            id='link'
            name='link'
            type='text'
            onChange={formik.handleChange}
            value={formik.values.link}
          />
          {formik.errors.link && formik.touched.link && (
            <div className={styles.error}>{formik.errors.link}</div>
          )}
          <label className={styles.label}>
            <div className={styles.leftSide}>
              <span>Description</span>
              <span className={styles.required}>*</span>
            </div>
            <label className={styles.label} htmlFor=''>
              <div className={styles.lengthText}>{formik.values.description.length}/1000</div>
            </label>
          </label>
          <textarea
            className={styles.descText}
            rows={8}
            maxLength={maxDescriptionLength}
            placeholder='App description'
            id='description'
            name='description'
            onChange={formik.handleChange}
            value={formik.values.description}
          />
          {formik.errors.description && formik.touched.description && (
            <div className={styles.error}>{formik.errors.description}</div>
          )}

          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Category</span>
              <span className={styles.required}>*</span>
            </div>
          </label>
          <div className={styles.categoryContainer}>
            <Select
              value={selectedCategories?.map((categoryName: any) => ({
                value: categoryName,
                label: categoryName,
              }))}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#fb6fbb' : 'rgba(128, 128, 128, 0.3411764706)',
                  backgroundColor: 'transparent',
                  color: '#FFF',
                }),
                option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                  return {
                    ...styles,
                    color: '#FFF',
                    backgroundColor: '#1f1f21',
                    cursor: isDisabled ? 'not-allowed' : 'default',
                  }
                },
              }}
              options={selectOptions}
              isSearchable // Enable search functionality
              isMulti // Allow selecting multiple categories
              onChange={handleSelectChange}
            />

            <div className={styles.condutions}>
              <div>
                <label htmlFor=''>Verified</label>
                <div className={styles.categoryWrapper}>
                  <div
                    onClick={() => handleVerifiedClick(true)}
                    className={`${styles.condutionsItem} ${isVerified ? styles.active : ''}`}
                  >
                    Yes
                  </div>
                  <div
                    onClick={() => handleVerifiedClick(false)}
                    className={`${styles.condutionsItem} ${!isVerified ? styles.active : ''}`}
                  >
                    No
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor=''>Featured</label>
                <div className={styles.categoryWrapper}>
                  <div
                    onClick={() => handleFeaturedClick(true)}
                    className={`${styles.condutionsItem} ${isFeatured ? styles.active : ''}`}
                  >
                    Yes
                  </div>
                  <div
                    onClick={() => handleFeaturedClick(false)}
                    className={`${styles.condutionsItem} ${!isFeatured ? styles.active : ''}`}
                  >
                    No
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor=''>New</label>
                <div className={styles.categoryWrapper}>
                  <div
                    onClick={() => handleNewClick(true)}
                    className={`${styles.condutionsItem} ${isNew ? styles.active : ''}`}
                  >
                    Yes
                  </div>
                  <div
                    onClick={() => handleNewClick(false)}
                    className={`${styles.condutionsItem} ${!isNew ? styles.active : ''}`}
                  >
                    No
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor=''>Trending</label>
                <div className={styles.categoryWrapper}>
                  <div
                    onClick={() => handleTrendingClick(true)}
                    className={`${styles.condutionsItem} ${isTrending ? styles.active : ''}`}
                  >
                    Yes
                  </div>
                  <div
                    onClick={() => handleTrendingClick(false)}
                    className={`${styles.condutionsItem} ${!isTrending ? styles.active : ''}`}
                  >
                    No
                  </div>
                </div>
              </div>
              {/* Diğer kısımlar... */}
            </div>
          </div>
          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Icon (must be 64x64) </span>

              <span className={styles.required}>*</span>
            </div>
          </label>
          <div
            style={{
              backgroundImage: `url(${backgrounds.icon ? backgrounds.icon : formik.values.icon})`,
            }}
            className='upload-image'
            onClick={() => {
              const inputField = document.querySelector('#icon')
              if (inputField instanceof HTMLInputElement) {
                inputField.click()
              }
              setShowModal('icon')
            }}
          >
            <input
              ref={fileInputRef}
              id='icon'
              name='icon'
              type='file'
              hidden
              className='input-field'
              onChange={handleFileChange}
            />
            <span className={styles.plusIconForImage}>
              <FiPlus />
            </span>
          </div>
          <Modal show={showModal === 'icon'} onHide={() => setShowModal(false)}>
            <Modal.Body
              style={{
                width: '750px',
                height: '624px',
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Crop Image</Modal.Title>
              </Modal.Header>

              {iconImage && (
                <>
                  <FixedCropper
                    ref={cropperRef}
                    src={iconImage}
                    className={'example__cropper-background'}
                    stencilProps={{
                      handlers: false,
                      lines: false,
                      movable: false,
                      resizable: false,
                    }}
                    stencilSize={{
                      width: 64,
                      height: 64,
                    }}
                    imageRestriction={ImageRestriction.stencil}
                  />
                  <button className={styles.cropButton} onClick={() => handleCrop('icon')}>
                    Complete Cropping
                  </button>
                </>
              )}
            </Modal.Body>
          </Modal>
          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Screenshots</span>
              <span className={styles.required}>*</span>
            </div>
          </label>
          <div className={styles.imageWrapper}>
            <div className={styles.uploadImageWrapper}>
              <Modal show={showModal === 1} onHide={() => setShowModal(false)}>
                <Modal.Body
                  style={{
                    width: '750px',
                    height: '624px',
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Crop Image</Modal.Title>
                  </Modal.Header>

                  {image && (
                    <>
                      <FixedCropper
                        ref={cropperRef}
                        src={image}
                        className={'example__cropper-background'}
                        stencilProps={{
                          handlers: false,
                          lines: false,
                          movable: false,
                          resizable: false,
                        }}
                        stencilSize={{
                          width: 620,
                          height: 430,
                        }}
                        imageRestriction={ImageRestriction.stencil}
                      />
                      <button className={styles.cropButton} onClick={() => handleCrop('image1')}>
                        Complete Cropping
                      </button>
                    </>
                  )}
                </Modal.Body>
              </Modal>
              <div
                style={{
                  backgroundImage: `url(${
                    backgrounds.image1 ? backgrounds.image1 : formik.values.image1
                  })`,
                }}
                className='upload-image'
              >
                <input
                  id='image1'
                  name='image1'
                  type='file'
                  hidden
                  className='input-field'
                  onChange={handleFileChange}
                />
              </div>
              <div
                onClick={() => {
                  const inputField = document.querySelector('#image1')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(1)
                }}
                className={styles.uploadInfo}
              >
                <span className={styles.plusIconForImage}>
                  <FiPlus />
                </span>
              </div>
            </div>

            <div className={styles.uploadImageWrapper}>
              <Modal show={showModal === 2} onHide={() => setShowModal(false)}>
                <Modal.Body
                  style={{
                    width: '750px',
                    height: '624px',
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Crop Image</Modal.Title>
                  </Modal.Header>

                  {image && (
                    <>
                      <FixedCropper
                        ref={cropperRef}
                        src={image}
                        className={'example__cropper-background'}
                        stencilProps={{
                          handlers: false,
                          lines: false,
                          movable: false,
                          resizable: false,
                        }}
                        stencilSize={{
                          width: 620,
                          height: 430,
                        }}
                        imageRestriction={ImageRestriction.stencil}
                      />
                      <button className={styles.cropButton} onClick={() => handleCrop('image2')}>
                        Complete Cropping
                      </button>
                    </>
                  )}
                </Modal.Body>
              </Modal>
              <div
                style={{
                  backgroundImage: `url(${
                    backgrounds.image2 ? backgrounds.image2 : formik.values.image2
                  })`,
                }}
                className='upload-image'
                onClick={() => {
                  const inputField = document.querySelector('#image2')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(2)
                }}
              >
                <input
                  id='image2'
                  name='image2'
                  type='file'
                  hidden
                  className='input-field'
                  onChange={handleFileChange}
                />
              </div>
              <div
                onClick={() => {
                  const inputField = document.querySelector('#image2')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(2)
                }}
                className={styles.uploadInfo}
              >
                <span className={styles.plusIconForImage}>
                  <FiPlus />
                </span>
              </div>
            </div>

            <div className={styles.uploadImageWrapper}>
              <Modal show={showModal === 3} onHide={() => setShowModal(false)}>
                <Modal.Body
                  style={{
                    width: '750px',
                    height: '624px',
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Crop Image</Modal.Title>
                  </Modal.Header>

                  {image && (
                    <>
                      <FixedCropper
                        ref={cropperRef}
                        src={image}
                        className={'example__cropper-background'}
                        stencilProps={{
                          handlers: false,
                          lines: false,
                          movable: false,
                          resizable: false,
                        }}
                        stencilSize={{
                          width: 620,
                          height: 430,
                        }}
                        imageRestriction={ImageRestriction.stencil}
                      />
                      <button className={styles.cropButton} onClick={() => handleCrop('image3')}>
                        Complete Cropping
                      </button>
                    </>
                  )}
                </Modal.Body>
              </Modal>
              <div
                style={{
                  backgroundImage: `url(${
                    backgrounds.image3 ? backgrounds.image3 : formik.values.image3
                  })`,
                }}
                className='upload-image'
                onClick={() => {
                  const inputField = document.querySelector('#image3')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(3)
                }}
              >
                <input
                  id='image3'
                  name='image3'
                  type='file'
                  hidden
                  className='input-field'
                  onChange={handleFileChange}
                />
              </div>
              <div
                onClick={() => {
                  const inputField = document.querySelector('#image3')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(3)
                }}
                className={styles.uploadInfo}
              >
                <span className={styles.plusIconForImage}>
                  <FiPlus />
                </span>
              </div>
            </div>

            <div className={styles.uploadImageWrapper}>
              <Modal show={showModal === 4} onHide={() => setShowModal(false)}>
                <Modal.Body
                  style={{
                    width: '750px',
                    height: '624px',
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Crop Image</Modal.Title>
                  </Modal.Header>

                  {image && (
                    <>
                      <FixedCropper
                        ref={cropperRef}
                        src={image}
                        className={'example__cropper-background'}
                        stencilProps={{
                          handlers: false,
                          lines: false,
                          movable: false,
                          resizable: false,
                        }}
                        stencilSize={{
                          width: 620,
                          height: 430,
                        }}
                        imageRestriction={ImageRestriction.stencil}
                      />
                      <button className={styles.cropButton} onClick={() => handleCrop('image4')}>
                        Complete Cropping
                      </button>
                    </>
                  )}
                </Modal.Body>
              </Modal>
              <div
                style={{
                  backgroundImage: `url(${
                    backgrounds.image4 ? backgrounds.image4 : formik.values.image4
                  })`,
                }}
                className='upload-image'
                onClick={() => {
                  const inputField = document.querySelector('#image4')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(4)
                }}
              >
                <input
                  id='image4'
                  name='image4'
                  type='file'
                  hidden
                  className='input-field'
                  onChange={handleFileChange}
                />
              </div>
              <div
                onClick={() => {
                  const inputField = document.querySelector('#image4')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(4)
                }}
                className={styles.uploadInfo}
              >
                <span className={styles.plusIconForImage}>
                  <FiPlus />
                </span>
              </div>
            </div>

            <div className={styles.uploadImageWrapper}>
              <Modal show={showModal === 5} onHide={() => setShowModal(false)}>
                <Modal.Body
                  style={{
                    width: '750px',
                    height: '624px',
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Crop Image</Modal.Title>
                  </Modal.Header>

                  {image && (
                    <>
                      <FixedCropper
                        ref={cropperRef}
                        src={image}
                        className={'example__cropper-background'}
                        stencilProps={{
                          handlers: false,
                          lines: false,
                          movable: false,
                          resizable: false,
                        }}
                        stencilSize={{
                          width: 620,
                          height: 430,
                        }}
                        imageRestriction={ImageRestriction.stencil}
                      />
                      <button className={styles.cropButton} onClick={() => handleCrop('image5')}>
                        Complete Cropping
                      </button>
                    </>
                  )}
                </Modal.Body>
              </Modal>
              <div
                style={{
                  backgroundImage: `url(${
                    backgrounds.image5 ? backgrounds.image5 : formik.values.image5
                  })`,
                }}
                className='upload-image'
                onClick={() => {
                  const inputField = document.querySelector('#image5')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(5)
                }}
              >
                <input
                  id='image5'
                  name='image5'
                  type='file'
                  hidden
                  className='input-field'
                  onChange={handleFileChange}
                />
              </div>
              <div
                onClick={() => {
                  const inputField = document.querySelector('#image5')
                  if (inputField instanceof HTMLInputElement) {
                    inputField.click()
                  }
                  setShowModal(5)
                }}
                className={styles.uploadInfo}
              >
                <span className={styles.plusIconForImage}>
                  <FiPlus />
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => handleAddApp()}>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default AddAppInputs
