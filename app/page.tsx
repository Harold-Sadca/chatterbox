import SignUp from '@/(components)/Signup';
import styles from './page.module.css';
import Login from '@/(components)/Login';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h1>Welcome to ChatterBox</h1>
        <p>A live messaging app</p>
        <Link href='/homepage'>
          <button>Get Started</button>
        </Link>
      </div>
    </main>
  );
}
