import styles from './components.module.scss'

interface TitleProps {
  children: React.ReactNode
}

const Title: React.FC<TitleProps> = ({children}) => {
  return <h1 className={styles.title}>{children}</h1>
}

export default Title
