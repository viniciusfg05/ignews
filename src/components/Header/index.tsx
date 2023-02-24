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
            <p>Home</p>
          </ActiveLink>

          <ActiveLink activeClassName={styles.active} href="/posts">
            <p>Posts</p>
          </ActiveLink>
        </nav>
      </div>
      <SingInButton />
      
      
    </div>
  )
} 