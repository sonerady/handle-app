import React, {FC, useEffect, useState} from 'react'
import {useAuthService} from '../../../../../../app/services/authService'
import {useGlobal} from '../../../../../../app/context/AuthContext'
import {useLocation} from 'react-router-dom'
import {MdCloudUpload} from 'react-icons/md'

const TextToImage: FC = () => {
  const {createFeature} = useAuthService()
  const {
    imageData,
    setImageData,
    setLoading,
    promptTitle,
    setPromptTitle,
    setImagePreview,
    localImagePreview,
    setLocalImagePreview,
    imagePreview,
    setActiveBalance,
    activeBalance,
    balance,
    setShowGlobalAlert,
    setOpenHistory,
  } = useGlobal()
  const [styles, setStyles] = useState<any>()
  const [isImageToImage, setIsImageToImage] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [image, setImage] = useState('')
  const [fileName, setFileName] = useState('No selected file')
  const [isImageAdded, setIsImageAdded] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsImageAdded(true)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setUploadedFile(null)
      setImagePreview(null)
      setIsImageAdded(false)
    }
  }

  // const [imageData, setImageData] = useState<string>(false)
  const [data, setData] = useState({
    file: '',
  })

  const handleCreatePost = async (postData: any) => {
    if (postData) {
      try {
        const formData = new FormData()
        for (const key in postData) {
          formData.append(key, postData[key])
        }

        const data = await createFeature(formData)

        if (data) {
          setActiveBalance(!activeBalance)
        }

        setImageData(data)
        setLocalImagePreview(imagePreview)
        setLoading(false)
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }
  }

  const exampleUsage = async () => {
    await setOpenHistory(false)

    if (balance <= 0) {
      setShowGlobalAlert(true)
      setTimeout(() => {
        setShowGlobalAlert(false)
      }, 3000) // 3 saniye sonra hata resmini gizle
    }
    setLoading(true)
    const postData: any = {
      file: uploadedFile,
    }

    // if (isImageToImage && uploadedFile) {
    //   postData.file = uploadedFile
    // }

    // if (!isImageToImage && !uploadedFile) {
    //   postData.file = uploadedFile
    // }

    setPromptTitle(postData.Prompt)

    await handleCreatePost(postData)
  }

  return (
    <div>
      <section>
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

          {image ? (
            <img src={image} width={150} height={150} alt={fileName} />
          ) : (
            <>
              <MdCloudUpload color='#fb72b7' size={60} />
              {isImageAdded ? <p>Added Images</p> : <p>Browse Files to upload</p>}
            </>
          )}
        </div>
      </section>
      <div className='d-flex flex-column'>
        <button
          style={{
            background: 'linear-gradient(270deg, #FF9085 0%, #FB6FBB 100%',
          }}
          type='button'
          className='btn btn-primary mt-5 fw-bold btn-md d-flex justify-content-center align-items-center'
          onClick={exampleUsage}
        >
          <span className=''>Generate</span>
        </button>
        {imagePreview && (
          <img
            className='rounded-3 mt-5'
            style={{width: '100%', height: '256px', objectFit: 'cover'}}
            src={imagePreview}
            alt=''
          />
        )}
      </div>
    </div>
  )
}

export default TextToImage
