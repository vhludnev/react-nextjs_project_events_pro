//import { getSession } from 'next-auth/react';
//import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { RiLockPasswordLine, RiListUnordered } from 'react-icons/ri';
//import ProfileForm from './profile-form';
import classes from './dashboard-profile.module.css';

const UserDashboardProfile = ({ activateUserDataChange, userDataChange }) => {
  // const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { user: { name, email, picture, provider } } = session
  // useEffect(() => {
  //   getSession().then(session => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

//   const changePasswordHandler = async (passwordData) => {
//     const response = await fetch('/api/user/update-user-data', {
//       method: 'PATCH',
//       body: JSON.stringify(passwordData),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = await response.json();

//     console.log(data);
//   }

  return (
    <section className={classes.profile}>
      <h1>User Profile</h1>
      <Image src={picture || '/images/noimage.jpg'} alt='portrait' width={100} height={100} />
      {name && <p style={{fontWeight: 'bold'}}>{name}</p>}
      <p>{email}</p>
      {/* {provider === 'credentials' && <ProfileForm onChangePassword={changePasswordHandler} />} */}
      {provider === 'credentials' && (
        !userDataChange 
          ? <RiLockPasswordLine color='green' size={24} onClick={activateUserDataChange} /> 
          : <RiListUnordered color='brown' size={24} onClick={activateUserDataChange} />
      )}
    </section>
  );
}

export default UserDashboardProfile;
