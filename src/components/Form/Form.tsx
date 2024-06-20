'use client';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import styles from './Form.module.css';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Form = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter()

  const handleSignUp = async () => {
    setIsLoading(true);
    if (username.length < 3) {
      toast('Username must be atleast 3 characters');
      setIsLoading(false);
      return;
    } else if (password.length < 6) {
      toast('Password must be atleast 6 characters');
      setIsLoading(false);
      return;
    } else if (!email.includes('@')) {
      toast('Invalid email');
      setIsLoading(false);
      return;
    } else if (firstName.length < 0) {
      toast('First Name is required');
      setIsLoading(false);
      return;
    } else if (lastName.length < 0) {
      toast('Last Name is required');
      setIsLoading(false);
      return;
    }
    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        email,
        firstName,
        lastName,
      }),
    });

    if (response.ok)
      signIn('credentials', { username, password, callbackUrl: '/home' });
    const { msg } = await response.json();

    toast(JSON.stringify(msg));

    setIsLoading(false);
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    if (username.length < 3) {
      toast('Username must be atleast 3 characters');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      toast('Password must be atleast 6 characters');
      setIsLoading(false);
      return;
    }
    const res = await signIn('credentials', { username, password, redirect: false });
    if (res?.error) {
      console.log(res);
      
      toast('Invalid login Credential');
      setIsLoading(false);
      return;
    }
    
    router.push('/home')
    setIsLoading((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignup) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };
  return (
    <div className={styles.container}>
      {isSignup ? (
        <h1 className={`${styles.headings} ${styles.headings_signup}`}>
          Get Started
        </h1>
      ) : (
        <h1 className={styles.headings}>Welcome Back</h1>
      )}
      <div className={styles.fields}>
        <div className={styles.oauths}>
          <button disabled={isLoading} onClick={async () => {
            setIsLoading(true)
            const res = await signIn('google')
            if (res?.error) {
              console.log(res);
              
              toast('Error occured');
              setIsLoading(false);
              return;
            }
            
            router.push('/home')
          }}>
            <Image
              src='/icons/google.png'
              alt='Google'
              height={24}
              width={24}
            />
            <span>Continue with Google</span>
          </button>
          <button disabled={isLoading} onClick={async () => {
            setIsLoading(true)
            const res = await signIn('facebook')
            if (res?.error) {
              console.log(res);
              
              toast('Error occured');
              setIsLoading(false);
              return;
            }
            
            router.push('/home')
          }}>
            <Image
              src='/icons/facebook.png'
              alt='Google'
              height={24}
              width={16}
            />
            <span>Continue with facebook</span>
          </button>
        </div>
        <hr className={styles.hr} />
        <form onSubmit={handleSubmit} className={styles.formSection}>
        <div className={styles.field}>
          <Image src='/icons/email.png' alt='email' width={22} height={16} />
          <span></span>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
          />
        </div>
        {isSignup && (
          <div className={styles.field}>
            <Image src='/icons/email.png' alt='email' width={22} height={16} />
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        {isSignup && (
          <div className={styles.names}>
            <div className={styles.field}>
              <Image
                src='/icons/email.png'
                alt='First Name'
                width={22}
                height={16}
              />
              <input
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <Image
                src='/icons/email.png'
                alt='Last Name'
                width={22}
                height={16}
              />
              <input
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className={styles.field}>
          <Image src='/icons/pass.png' alt='email' width={16} height={16} />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isSignup && (
          <button
            className={styles.submit}
            type='submit'
            disabled={isLoading}
            onClick={() => {}}
          >
            {!isLoading ? (
              'Login'
            ) : (
              <svg
                width='30'
                height='30'
                viewBox='0 0 30 30'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M350 200C350 117.157 282.843 50 200 50'
                  stroke='#191919'
                  strokeWidth='12'
                  strokeMiterlimit='10'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </button>
        )}
        {isSignup && (
          <button
            className={styles.submit}
            type='submit'
            disabled={isLoading}
            onClick={() => {}}
          >
            {!isLoading ? (
              'Signup'
            ) : (
              <svg
                width='30'
                height='30'
                className={styles.spinner}
                viewBox='0 0 30 30'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M350 200C350 117.157 282.843 50 200 50'
                  stroke='#191919'
                  strokeWidth='12'
                  strokeMiterlimit='10'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            )}
          </button>
        )}
        {!isSignup && (
          <div className={styles.switch}>
            <p>
              Don’t have an account?{' '}
              <button disabled={isLoading} onClick={() => setIsSignup(true)}>
                Register
              </button>
            </p>
          </div>
        )}
        {isSignup && (
          <div className={styles.switch}>
            <p>
              Already have an account?{' '}
              <button disabled={isLoading} onClick={() => setIsSignup(false)}>
                Login
              </button>
            </p>
          </div>
        )}
        </form>
      </div>
    </div>
  );
};
export default Form;
