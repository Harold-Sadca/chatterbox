import SignUp from '@/(components)/Signup';
import styles from './page.module.css';
import Login from '@/(components)/Login';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Chatter Box</h1>
      {/* <Login /> */}
      <SignUp />
    </main>
  );
}
