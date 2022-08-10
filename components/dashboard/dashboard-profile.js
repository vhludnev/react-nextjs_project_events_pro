import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { RiLockPasswordLine, RiListUnordered } from 'react-icons/ri';
import classes from './dashboard-profile.module.css';

const UserDashboardProfile = ({ activateUserDataChange, userDataChange }) => {
  const { data: session } = useSession();
  const { user: { name, email, picture, provider } } = session

  return (
    <section className={classes.profile}>
      <h1>User Profile</h1>
      <Image src={picture || '/images/noimage.jpg'} alt='portrait' width={100} height={100} />
      {name && <p style={{fontWeight: 'bold'}}>{name}</p>}
      <p>{email}</p>
      {provider === 'credentials' && (
        !userDataChange 
          ? <RiLockPasswordLine color='green' size={24} onClick={activateUserDataChange} /> 
          : <RiListUnordered color='brown' size={24} onClick={activateUserDataChange} />
      )}
    </section>
  );
}

export default UserDashboardProfile;
