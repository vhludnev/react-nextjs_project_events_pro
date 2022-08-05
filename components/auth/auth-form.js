import { useState, useRef, useContext } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import classes from './auth-form.module.css';
import NotificationContext from '../../store/notification-context';
import ShowPassIcon from '../icons/show-password';
import HidePassIcon from '../icons/hide-password';
import GoogleIcon from '../icons/google';

const createUser = async (email, password) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}


const AuthForm = () => {
  const formRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false)
  const { showNotification } = useContext(NotificationContext);

  const router = useRouter()

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    // optional: Add validation

    if (isLogin) {
      showNotification({
        title: 'Logging in...',
        message: 'Wait for log in.',
        status: 'pending',
      });

      const result = await signIn('credentials', {
        redirect: false,                              // overiding default redirect to error page
        email,
        password,
      });

      if (!result.error) {
        showNotification(() => {})
        router.replace('/');                   // redirecting to home page if success
      } else {
        showNotification({
          title: 'Error!',
          message: result.error || 'Something went wrong!',
          status: 'error',
        })
      }
    } else {
      showNotification({
        title: 'Creating a new account...',
        message: 'Wait for the result.',
        status: 'pending',
      });
      try {
        const result = await createUser(email, password);
        if (!result.error) {
          showNotification({
            title: 'Success!',
            message: 'New User created! Please sign in!',
            status: 'success',
          })
          setTimeout(() => router.push(router.asPath), 3000);   // redirecting to the same page (t.i. defath auth page)
        }
      } catch (error) {
        showNotification({
          title: 'Error!',
          message: error.message || 'Something went wrong!',
          status: 'error',
        })
        formRef.current.reset();
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler} ref={formRef}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type={showPassword ? 'text' : 'password'} id='password' required ref={passwordInputRef} />
          <span className={classes.pass} onClick={() => setShowPassword((prevState) => !prevState)}>{showPassword ? <ShowPassIcon /> : <HidePassIcon />}</span>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
      <p style={{color: '#fff'}}>or</p>
      <button
        type='button'
        className={classes.googleBtn}
        onClick={() => signIn('google', { callbackUrl: '/' })}
      >
        Sign in with <div><GoogleIcon /></div>
      </button>
    </section>
  );
}

export default AuthForm;
