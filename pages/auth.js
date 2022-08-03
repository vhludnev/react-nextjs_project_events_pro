// import { getSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';

import AuthForm from '../components/auth/auth-form';

const AuthPage = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   getSession().then(session => {
  //     if (session) {
  //       router.replace('/');
  //     }
  //   });
  // }, [router]);


  return <AuthForm />;
}

export default AuthPage;
