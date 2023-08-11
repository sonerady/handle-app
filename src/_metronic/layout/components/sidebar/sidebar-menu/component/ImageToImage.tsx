import React, {FC, useEffect, useState} from 'react'
import {useAuthService} from '../../../../../../app/services/authService'
import {useGlobal} from '../../../../../../app/context/AuthContext'
import {useLocation} from 'react-router-dom'
import {MdCloudUpload} from 'react-icons/md'
import {initial} from 'lodash'

const TextToImage: FC = () => {
  const {createTextToImage, createImageToImage, getImageStyles} = useAuthService()
  const {
    imageData,
    setImageData,
    setLoading,
    promptTitle,
    setPromptTitle,
    setShowAlert,
    showAlert,
    setImagePreview,
    imagePreview,
    setActiveBalance,
    activeBalance,
    balance,
    setShowGlobalAlert,
    setOpenHistory,
  } = useGlobal()
  const [styles, setStyles] = useState<any>()
  const [isImageToImage, setIsImageToImage] = useState<boolean>(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [image, setImage] = useState('')
  const [fileName, setFileName] = useState('No selected file')
  const [isImageAdded, setIsImageAdded] = useState(false)

  const [canvasWidth, setCanvasWidth] = useState(512)
  const [canvasHeight, setCanvasHeight] = useState(512)
  const [sizeRangeValue, setSizeRangeValue] = useState(0)
  const [initialImagePreview, setInitialImagePreview] = useState<string | null>(null) // Yeni state'i oluşturun

  const resizeImage = async (file: File, canvasWidth: number, canvasHeight: number) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = async () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        console.error('Canvas context not available.')
        return
      }

      canvas.width = canvasWidth
      canvas.height = canvasHeight

      const aspectRatio = image.height / image.width
      const canvasAspectRatio = canvasHeight / canvasWidth

      let newWidth: number
      let newHeight: number

      if (canvasAspectRatio > aspectRatio) {
        newWidth = canvasWidth
        newHeight = newWidth * aspectRatio
      } else {
        newHeight = canvasHeight
        newWidth = newHeight / aspectRatio
      }

      const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height)
      const scaledWidth = image.width * scale
      const scaledHeight = image.height * scale

      const xOffset = (canvasWidth - scaledWidth) / 2
      const yOffset = (canvasHeight - scaledHeight) / 2

      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      ctx.drawImage(image, xOffset, yOffset, scaledWidth, scaledHeight)

      const resizedImage = canvas.toDataURL()
      setImagePreview(resizedImage)

      if (!initialImagePreview) {
        setInitialImagePreview(resizedImage)
      }

      const blob = await (await fetch(resizedImage)).blob()
      setUploadedFile(new File([blob], file.name, {type: blob.type}))
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsImageAdded(true)
      await resizeImage(file, canvasWidth, canvasHeight)

      const imageURL = URL.createObjectURL(file) // Bu satırı ekleyin
      setImage(imageURL)

      const blob = await (await fetch(imageURL)).blob() // Bu satırları ekleyin
      setInitialImagePreview(URL.createObjectURL(blob))
    } else {
      setUploadedFile(null)
      setIsImageAdded(false)
      setImagePreview(null)
      setImage('')
      setInitialImagePreview(null) // Bu satırı ekleyin
    }
  }

  useEffect(() => {
    if (initialImagePreview) {
      const loadImage = async () => {
        const response = await fetch(initialImagePreview)
        const blob = await response.blob()
        const file = new File([blob], 'initialImage', {type: blob.type})
        await resizeImage(file, canvasWidth, canvasHeight)
      }
      loadImage()
    }
  }, [canvasWidth, canvasHeight, initialImagePreview])

  useEffect(() => {
    const baseSize = 512
    const stepSize = 128
    if (sizeRangeValue > 0) {
      setCanvasWidth(baseSize)
      setCanvasHeight(baseSize + sizeRangeValue * stepSize)
    } else if (sizeRangeValue < 0) {
      setCanvasWidth(baseSize - sizeRangeValue * stepSize)
      setCanvasHeight(baseSize)
    } else {
      setCanvasWidth(baseSize)
      setCanvasHeight(baseSize)
    }
  }, [sizeRangeValue])

  // const [imageData, setImageData] = useState<string>(false)
  const [data, setData] = useState({
    prompt: '',
    negativePrompt: '',
    sample: 1,
    steps: 50,
    negative: '',
    file: '',
  })
  const [selectedStyles, setSelectedStyles] = useState<string>('')

  const location = useLocation()

  const handleCreatePost = async (postData: any) => {
    if (postData) {
      try {
        const formData = new FormData()
        for (const key in postData) {
          formData.append(key, postData[key])
        }

        const data = !isImageToImage
          ? await createTextToImage(formData)
          : await createImageToImage(formData)

        setImageData(data)
        if (data) {
          setActiveBalance(!activeBalance)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }
  }

  const exampleUsage = async () => {
    await setOpenHistory(false)
    if (!uploadedFile) {
      setShowAlert(`Please fill the images file`)
      return
    } else if (!data.sample || data.sample <= 0) {
      setShowAlert(`Please set a valid image count`)
      return
    }
    if (balance <= 0) {
      setShowGlobalAlert(true)
      setTimeout(() => {
        setShowGlobalAlert(false)
      }, 3000) // 3 saniye sonra hata resmini gizle
    }

    setLoading(true)

    const postData: any = {
      ...(!isImageToImage
        ? {
            Prompt:
              `${data.prompt};` +
              ' ' +
              ' ' +
              `${data.negative ? 'negative: ' : ''}` +
              `${data.negative ? data.negative + ';' : ''}` +
              ' ' +
              selectedStyles +
              `${Object.keys(selectedStyles).length > 1 ? ',' : ''}` +
              ' ' +
              `${Object.keys(selectedStyles).length === 0 ? '' : 'style;'}`,
          }
        : {samples: data.sample}),
      ...(!isImageToImage
        ? {sample: data.sample}
        : {
            prompt:
              `${data.prompt ? data.prompt + ';' : 'NONE'}` +
              ' ' +
              ' ' +
              `${data.negative ? 'negative: ' : ''}` +
              `${data.negative ? data.negative + ';' : ''}` +
              ' ' +
              selectedStyles +
              `${Object.keys(selectedStyles).length > 1 ? ',' : ''}` +
              ' ' +
              `${Object.keys(selectedStyles).length === 0 ? '' : 'style;'}`,
          }),
      ...(!isImageToImage ? {steps: data.steps} : {step: data.steps}),
      ...(!isImageToImage ? {negative: data.negative} : {}),
      ...(isImageToImage ? {file: uploadedFile} : {}),
    }

    setPromptTitle(postData.prompt.replace('NONE', ''))

    await handleCreatePost(postData)
  }

  const handleInputChange = (event: any) => {
    const target = event.target
    const name = target.name
    const value = target.value
    setData({...data, [name]: value})
  }

  if (showAlert) {
    setTimeout(() => {
      setShowAlert('')
    }, 3000)
  }

  return (
    <div>
      {isImageToImage && ( // isImageToImage true ise input elementini render ediyoruz
        <div>
          <div
            className='upload-image'
            onClick={() => {
              const inputField = document.querySelector('.input-field')
              if (inputField instanceof HTMLInputElement) {
                inputField.click()
              }
            }}
          >
            <input
              name='file'
              type='file' // input type'ını file olarak değiştiriyoruz
              onChange={handleFileChange} // input değiştiğinde çağrılacak fonksiyon
              accept='image/*'
              className='input-field'
              hidden
            />

            <>
              <MdCloudUpload color='#1475cf' size={60} />
              <p>Browse Files to upload</p>
              {isImageAdded && <p>Added Images</p>}
            </>
          </div>
        </div>
      )}

      <div className='row mb-4 flex-column'>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text	'>Prompt</label>
        <div className='col-lg-12'>
          <div className='spinner spinner-sm spinner-primary spinner-right'>
            <input
              className='form-control input-change-border'
              type='text'
              placeholder='Please enter prompt'
              name='prompt'
              value={data.prompt}
              style={{fontSize: '12px'}}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      {!isImageToImage && (
        <div className='row mb-4 flex-column '>
          <label className='col-lg-3 col-form-label text-nowrap light-span-text'>
            Negative Prompt
          </label>
          <div className='col-lg-12'>
            <div className='spinner spinner-sm spinner-primary spinner-right'>
              <input
                className='form-control input-change-border'
                type='text'
                placeholder='Please enter negative prompt'
                name='negative'
                value={data.negative}
                onChange={handleInputChange}
                style={{fontSize: '12px'}}
              />
            </div>
          </div>
        </div>
      )}

      <div className='row mb-4 flex-column'>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Styles</label>
        <div className='col'>
          <select
            className='form-select'
            value={selectedStyles}
            onChange={(e) => setSelectedStyles(e.target.value)}
          >
            <option value=''>Choose a style</option>
            <option value='Enhance'>Enhance</option>
            <option value='Anime'>Anime</option>
            <option value='Photographic'>Photographic</option>
            <option value='Digital Art'>Digital Art</option>
            <option value='Comic Book'>Comic Book</option>
            <option value='Fantasy Art'>Fantasy Art</option>
            <option value='Analog Film'>Analog Film</option>
            <option value='Neon Punk'>Neon Punk</option>
            <option value='Isometric'>Isometric</option>
            <option value='Lowpoly'>Lowpoly</option>
            <option value='Origami'>Origami</option>
            <option value='Line Art'>Line Art</option>
            <option value='Craft Clay'>Craft Clay</option>
            <option value='Cinematik'>Cinematik</option>
            <option value='3D Model'>3D Model</option>
            <option value='Pixel Art'>Pixel Art</option>
          </select>
        </div>
      </div>
      <div className='row mb-4 mt-5 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Image Size</label>
      </div>
      <div className='d-flex justify-content-center'>
        <label className='col-form-label'>{`${canvasWidth}x${canvasHeight}`}</label>
      </div>
      <input
        type='range'
        className='form-range'
        min='-4'
        max='4'
        value={sizeRangeValue}
        step='0.5'
        onChange={(e) => setSizeRangeValue(parseInt(e.target.value))}
        id='customRange3'
      ></input>
      {image && (
        <div
          className='preview-image'
          style={{
            width: '100%',
            height: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            className='rounded-3'
            style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
            alt={fileName}
            src={imagePreview}
          />
        </div>
      )}

      <div className='row mb-4 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Image Count</label>
        <div className='col-lg-12'>
          <span className=''>{`${data.sample} x 10 = ${data.sample * 10} Credits`}</span>

          <input
            type='range'
            className='form-range'
            min='1'
            max='10'
            value={data.sample}
            onChange={(e) => setData({...data, sample: parseInt(e.target.value)})}
            style={{width: '100%'}}
            id='customRange3'
          ></input>
        </div>
      </div>
      <button type='button' className='btn mt-2 btn-primary fw-bold btn-sm ' onClick={exampleUsage}>
        Generate
      </button>
    </div>
  )
}

export default TextToImage
