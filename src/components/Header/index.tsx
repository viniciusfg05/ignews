import styles from './styles.module.scss';
import { SingInButton } from '../signInButton'
import { ActiveLink } from '../activeLink';


export function Header() {


  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/logo.svg" alt="vl.News" /> 
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>

          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>
      </div>
      <SingInButton />
      
      
    </div>
  )
} 