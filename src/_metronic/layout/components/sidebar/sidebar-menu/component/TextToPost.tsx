import React, {FC, useEffect, useState} from 'react'
import {useAuthService} from '../../../../../../app/services/authService'
import {useGlobal} from '../../../../../../app/context/AuthContext'
import {useLocation} from 'react-router-dom'

const TextToImage: FC = () => {
  const {createCodeChat} = useAuthService()
  const {
    setLoading,
    showAlert,
    setShowAlert,
    messages,
    setMessages,
    setCode,
    setIsLoadingBotResponse,
    setActiveBalance,
    activeBalance,
    balance,
    setShowGlobalAlert,
    setOpenHistory,
  } = useGlobal()
  const [data, setData] = useState<{
    prompt: string
    characters: string
    postType: string
    settings: string[]
  }>({
    prompt: '',
    characters: '',
    postType: '',
    settings: [],
  })

  const postTypeList = [
    'Twitter Post',
    'Twitter Flood',
    'Twitter Poll',
    'Twitter Ads',
    'Facebook Post',
    'Facebook Flood',
    'Facebook Poll',
    'Facebook Ads',
    'Instagram Post',
    'Instagram Flood',
    'Instagram Poll',
    'Instagram Ads',
    'Telegram Post',
    'Telegram Poll',
    'Blog Post',
    'Email',
  ]
  const settingList = ['Hashtags', 'Emojies', 'Clickbate', 'Seo']

  const handleCreateCode = async (data: any): Promise<{content: string}> => {
    if (data) {
      try {
        const datas = await createCodeChat(data)
        if (datas) {
          setActiveBalance(!activeBalance)
        }
        setCode(datas)
        setLoading(false)
        return datas
      } catch (error) {
        console.error('Error creating post:', error)
        return {content: ''}
      }
    } else {
      return {content: ''}
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
    }

    setLoading(true)
    setIsLoadingBotResponse(true)
    const lastMessage = messages[messages.length - 1]

    const postData = {
      user: 'assistant',
      previousMessage: lastMessage, // sadece önceki mesajı gönderin

      Prompt: `Write me a ${data.postType} about ${data.prompt} in max ${
        data.characters ? data.characters : '140'
      } character.  ${data.settings.includes('Hashtags') ? 'with hashtags' : 'without hashtags'} ${
        data.settings.includes('Emojies') ? 'with emojies,' : 'without emojies'
      } ${data.settings.includes('Clickbate') ? 'with clickbate,' : 'without clickbate'} ${
        data.settings.includes('Seo') ? 'with seo' : 'without seo'
      } sensitive. Please write markdown.`,
    }

    setMessages((prevMessages: any) => [
      ...prevMessages,
      {isUser: true, text: postData.Prompt.replace('Please write markdown.', '')},
    ])

    try {
      const response = await handleCreateCode(postData)
      setIsLoadingBotResponse(false)

      setMessages((prevMessages: any) => [
        ...prevMessages,
        {isUser: false, text: response?.content},
      ])
    } catch (error) {
      console.error('Error fetching response:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const {name, value, type, checked} = e.target
    if (type === 'checkbox') {
      setData((prevState: any) => {
        const settings = prevState.settings.includes(name)
          ? prevState.settings.filter((item: string) => item !== name)
          : [...prevState.settings, name]
        return {...prevState, settings}
      })
    } else {
      setData((prevState: any) => ({...prevState, [name]: value}))
    }
  }

  if (showAlert) {
    setTimeout(() => {
      setShowAlert('')
    }, 3000)
  }

  return (
    <div>
      <div className='row mb-8 flex-column'>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Prompt</label>
        <div className='col-lg-12'>
          <div className='spinner spinner-sm spinner-primary spinner-right'>
            <input
              className='form-control input-change-border'
              type='text'
              placeholder='Please enter prompt'
              name='prompt'
              style={{fontSize: '12px'}}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Post Type</label>
        <div className='col'>
          <select className='form-select' name='postType' onChange={handleChange}>
            <option value='' selected disabled>
              Please select
            </option>
            {postTypeList.map((postType: string) => (
              <option key={postType} value={postType}>
                {postType}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Settings</label>
        <div className='col'>
          <div className='row align-items-center'>
            {settingList?.map((key: any) => (
              <div key={key} className='col-md-4 mt-2'>
                <label className='d-flex align-items-center'>
                  <div className='form-check d-flex gap-1 form-check-solid form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      name={key}
                      onChange={handleChange}
                    />
                  </div>
                  <span className='form-check-label text-muted fs-9 text-uppercase ml-2'>
                    {key.toUpperCase()}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='row mb-8 flex-column'>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Max Character</label>
        <div className='col-lg-12'>
          <div className='spinner spinner-sm spinner-primary spinner-right'>
            <input
              className='form-control input-change-border'
              type='text'
              placeholder='Please enter prompt'
              name='characters'
              style={{fontSize: '12px'}}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
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
