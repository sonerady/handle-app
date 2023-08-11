import {useEffect, useRef, useState} from 'react'
import styles from '../Home.module.scss'
import searchIcon from '../../../../_metronic/assets/marketplace/icons/search.svg'
import {useGlobal} from '../../../context/AuthContext'
import {Link, useNavigate} from 'react-router-dom'
import {useAuthService} from '../../../services/authService'

interface InputProps {
  placeholder?: string
  width?: string
}

const Input: React.FC<InputProps> = ({placeholder, width}) => {
  const {search} = useAuthService()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [isSearching, setIsSearching] = useState(false)

  const prevSearchTerm = useRef('')

  useEffect(() => {
    if (searchTerm && searchTerm !== prevSearchTerm.current) {
      setLoading(true)
      search(searchTerm, 1).then((res) => {
        setSearchResults(res.result)
        setLoading(false)
      })
      prevSearchTerm.current = searchTerm
    }
  }, [searchTerm, search])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  const resultsWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (resultsWrapperRef.current && !resultsWrapperRef.current.contains(event.target)) {
        setSearchTerm('')
        setSearchResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <span className={styles.inputWrapper}>
      <input
        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
        style={{
          width: width,
          backgroundColor: '#80808054',
          color: 'white',
          border: searchResults.length > 0 ? '2px dashed #7675fa' : '1px solid #80808054',
        }}
        type='text'
        placeholder={placeholder ? placeholder : 'Search'}
        value={searchTerm}
        onChange={handleChange}
      />
      {searchResults.length > 0 && (
        <div className={styles.resultWrapper}>
          {searchResults.slice(0, 3).map((item: any, index: number) => (
            <div
              className={styles.resultItemWrapper}
              onClick={() => navigate(`/marketplace/detail/${item.name}/${item.appid}`)}
              key={item.name}
            >
              <div className={styles.resultItem}>
                <div>
                  <img className={styles.resultItemIcon} src={item.icon} alt='' />
                  {item.name ? item.name : 'No name'}
                </div>
              </div>
            </div>
          ))}
          {searchResults.length > 3 && (
            <Link to={`/marketplace/search?searchTerm=${searchTerm}`} className={styles.showAll}>
              Show all result ({searchResults.length})
            </Link>
          )}
        </div>
      )}
      <img className={styles.searchIcon} src={searchIcon} alt='' />
    </span>
  )
}

export default Input
