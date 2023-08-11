import React, {FC, useEffect, useState} from 'react'
import {useAuthService} from '../../../../../../app/services/authService'
import {useGlobal} from '../../../../../../app/context/AuthContext'
import {useLocation} from 'react-router-dom'

const TextToImage: FC = () => {
  const {createTextToDavinci, getImageStyles} = useAuthService()
  const {
    imageData,
    setImageData,
    setLoading,
    promptTitle,
    setPromptTitle,
    setShowAlert,
    showAlert,
    setActiveBalance,
    activeBalance,
    balance,
    setShowGlobalAlert,
    setOpenHistory,
  } = useGlobal()
  const [styles, setStyles] = useState<any>()
  const [data, setData] = useState({
    prompt: '',
    negativePrompt: '',
    number: 1,
  })
  const [selectedStyles, setSelectedStyles] = useState<string>('')
  const location = useLocation()

  const handleCreatePost = async (postData: any) => {
    if (postData) {
      try {
        const data = await createTextToDavinci(postData) // await keyword added here
        setImageData(data)
        setLoading(false)
        setActiveBalance(!activeBalance)
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
    if (!data.prompt) {
      setShowAlert(`Please fill the prompt`)
      return
    } else if (!data.number || data.number <= 0) {
      setShowAlert(`Please set a valid image count`)
      return
    }

    setLoading(true)

    const postData = {
      Prompt:
        `${data.prompt};` +
        ' ' +
        selectedStyles +
        ' ' +
        `${Object.keys(selectedStyles).length === 0 ? '' : 'style;'}`,
      number: data.number,
    }

    setPromptTitle(postData.Prompt)
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
      <div className='row mb-8 flex-column'>
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

      {/* <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Image Count</label>
        <div className='col-lg-12'>
          <span className='text-primary'>{`${data.number} x 10 = ${
            data.number * 10
          } Credits`}</span>
          <input
            type='range'
            min='1'
            max='10'
            value={data.number}
            onChange={(e) => setData({...data, number: parseInt(e.target.value)})}
            style={{width: '100%'}}
          />
        </div>
      </div> */}
      <button
        type='button'
        className='btn btn-primary fw-bold btn-sm gradient-bg'
        onClick={exampleUsage}
      >
        Generate
      </button>
    </div>
  )
}

export default TextToImage
