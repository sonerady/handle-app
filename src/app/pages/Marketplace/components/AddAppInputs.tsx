import React, {useEffect, useRef, useState} from 'react'
import styles from '../AddApp.module.scss'
import Title from '../components/Title'
import {convertToRaw, EditorState, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import {Editor} from 'react-draft-wysiwyg'
import {FiPlus} from 'react-icons/fi'
import {toast} from 'react-toastify'
import {CropperRef, Cropper, FixedCropper, ImageRestriction} from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import Select from 'react-select'
import {Modal} from 'react-bootstrap'
import {useGlobal} from '../../../context/AuthContext'

interface AddAppInputsProps {
  formik: any
  descState: any
  setDescState: any
  fileNames: any
  handleAddApp: (
    type: 'fix' | 'publish' | 'approve' | 'reject' | 'addComment' | 'addReview' | 'update',
    appid?: any
  ) => void
  setFileNames: any
  fileUpload: any
  backgrounds: any
  setBackgrounds: any
  setSelectedCategories: any
  selectedCategories: any
  handleCategoryClick: (category: string) => void
  categories: any
  setCategories: any
  setContentState: any
  contentState: any
}

const AddAppInputs: React.FC<AddAppInputsProps> = ({
  handleCategoryClick,
  setContentState,
  fileUpload,
  contentState,
  selectedCategories,
  formik,
  backgrounds,
  setBackgrounds,
  setSelectedCategories,
  handleAddApp,

  descState,
  setDescState,
  fileNames,
  setFileNames,
  categories,
}) => {
  const [showModal, setShowModal] = useState<any>()

  const {successTrigger, setSuccessTrigger} = useGlobal()

  const [croppedImage, setCroppedImage] = useState<HTMLCanvasElement | null>(null)

  const maxNameLength = 50
  const maxTitleLength = 100

  const [iconImage, setIconImage] = useState<string | null>(null)

  const maxDescriptionLength = 1000
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [link, setLink] = useState('')

  const handleEditorChange = (editorState: any) => {
    const contentState = editorState.getCurrentContent()
    const plainText = contentState.getPlainText()

    if (plainText.length <= maxDescriptionLength) {
      setEditorState(editorState)
    } else {
      // Discard additional characters
      const truncatedPlainText = plainText.slice(0, maxDescriptionLength)
      const truncatedContentState = contentState.createFromText(truncatedPlainText)
      setEditorState(EditorState.createWithContent(truncatedContentState))
    }
    setDescState(editorState)
  }

  useEffect(() => {
    // Update formik values whenever the editor content changes
    formik.setFieldValue('description', draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }, [editorState])

  const characterCount = editorState.getCurrentContent().getPlainText().length
  const remainingCharacters = maxDescriptionLength - characterCount

  const cropperRef = useRef<CropperRef | any>(null)

  const [image, setImage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null
    if (file) {
      setImage(URL.createObjectURL(file))
      setIconImage(URL.createObjectURL(file))
    }
  }

  const handleSelectChange = (selectedOptions: any) => {
    if (selectedOptions && selectedOptions.length > 5) {
      toast.error('You can select up to 5 categories.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
      return
    }
    setSelectedCategories(selectedOptions?.map((option: any) => option.value) || [])
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
          // const data = await response?.json()

          setLink(response?.link)
        }
      }
    }
  }

  const handleSubmit = () => {
    handleAddApp('publish')
    setDescState(EditorState.createWithContent(ContentState.createFromText('')))
  }

  return (
    <div>
      <div style={{border: 'none'}} className={`${styles.card} ${styles.left} card`}>
        <Title>ADD YOUR APP</Title>

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
            <div className={styles.lengthText}>
              {characterCount}/{maxDescriptionLength}{' '}
              {remainingCharacters < 0 ? <span style={{color: 'red'}}>Over Limit</span> : null}
            </div>
          </label>
          <Editor
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'list',
                'textAlign',
                'history',
                'colorPicker',
                'fontFamily',
              ],
              inline: {inDropdown: true},
              list: {inDropdown: true},
              textAlign: {inDropdown: true},
              history: {inDropdown: true},
              colorPicker: {inDropdown: true},
              fontFamily: {inDropdown: true},
              fontSize: {inDropdown: true},
            }}
            editorState={descState}
            toolbarClassName='toolbarClassName'
            wrapperClassName='wrapperClassName'
            editorClassName='editorClassName'
            onEditorStateChange={handleEditorChange}
          />

          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Category</span>
              <span className={styles.required}>*</span>
            </div>
          </label>
          <div className={styles.categoryContainer}>
            <Select
              value={selectedCategories.map((category: any) => ({
                value: category,
                label: category,
              }))}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#fb6fbb' : 'rgba(128, 128, 128, 0.3411764706)',
                  backgroundColor: 'transparent',
                  width: '50%',
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
              isMulti // Allow selecting multiple categories
              onChange={handleSelectChange}
            />

            {selectedCategories.length > 0 && (
              <div className={styles.selectedCategories}>{selectedCategories.join(' + ')}</div>
            )}
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
            }}
          >
            <input
              id='icon'
              name='icon'
              type='file'
              hidden
              className='input-field'
              onChange={async (event) => {
                const file = event.currentTarget.files ? event.currentTarget.files[0] : null
                if (file) {
                  setFileNames((prev: any) => ({...prev, [event.currentTarget.name]: file.name}))
                  const img = new Image()
                  img.src = URL.createObjectURL(file)
                  img.onload = async function () {
                    if (img.width === 64 && img.height === 64) {
                      const formData = new FormData()
                      formData.append('file', file)

                      try {
                        const imageLink = await fileUpload(formData)
                        if (imageLink) {
                          formik.setFieldValue('icon', imageLink.link)
                          setBackgrounds((prev: any) => ({...prev, ['icon']: imageLink?.link}))
                          toast.success('Operation completed successfully!', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                          })
                        }
                      } catch (error) {
                        setFileNames((prev: any) => ({
                          ...prev,
                          [event.currentTarget.name]: '64x64',
                        }))
                      }
                    } else {
                      toast.error(
                        'Please upload an image with a size of 64x64. The current image has an incorrect size and cannot be uploaded.',
                        {
                          position: toast.POSITION.BOTTOM_RIGHT,
                        }
                      )
                    }
                  }
                }
              }}
            />
            <span className={styles.plusIconForImage}>
              <FiPlus />
            </span>
          </div>

          <label className={styles.label} htmlFor=''>
            <div className={styles.leftSide}>
              <span>Screenshots</span>
              <span className={styles.required}>*</span>
            </div>
          </label>
          <div className={styles.imageWrapper}>
            <div className={styles.uploadImageWrapper}>
              <Modal show={showModal === 1} onHide={() => setShowModal(false)}>
                <Modal.Body>
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
                <Modal.Body>
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
                <Modal.Body>
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
                <Modal.Body>
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
                <Modal.Body>
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
          <button onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default AddAppInputs
