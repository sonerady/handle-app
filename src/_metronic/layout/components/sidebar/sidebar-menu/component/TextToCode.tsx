import React, {FC, useEffect, useState} from 'react'
import {useAuthService} from '../../../../../../app/services/authService'
import {useGlobal} from '../../../../../../app/context/AuthContext'
import {useLocation} from 'react-router-dom'

const TextToCode: FC = () => {
  const {createCode} = useAuthService()
  const {
    setLoading,
    promptTitle,
    setPromptTitle,
    setCode,
    setActiveBalance,
    activeBalance,
    balance,
    setShowGlobalAlert,
    setOpenHistory,
  } = useGlobal()
  const [data, setData] = useState<any>({prompt: ''})

  const handleCreateCode = async (data: any) => {
    if (data) {
      try {
        const datas = await createCode(data)
        setCode(datas)
        setLoading(false)
        if (datas) {
          setActiveBalance(!activeBalance)
        }
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }
  }

  const exampleUsage = async () => {
    await setOpenHistory(false)

    setLoading(true)
    if (balance <= 0) {
      setShowGlobalAlert(true)
      setTimeout(() => {
        setShowGlobalAlert(false)
      }, 3000) // 3 saniye sonra hata resmini gizle
    }
    const postData = {
      user: 'assistant',
      Prompt: `write me sample code about ${data.prompt}. outputformat:markdown.`,
    }

    setPromptTitle(postData.Prompt)

    await handleCreateCode(postData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setData((prevState: any) => ({...prevState, [name]: value}))
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

export default TextToCode
