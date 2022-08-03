import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import SignOutIcon from '../icons/sign-out-circle';
import Image from 'next/image';
//import SignInIcon from '../icons/sign-in-circle';
import classes from './main-header.module.css';

const MainHeader = () => {
   const { data: session/* , status */} = useSession();

   const logoutHandler = () => {
      signOut();
   }

   return (
      <header className={classes.header}>
         <div className={classes.logo}>
            <Link href='/'>Featured Events</Link>
         </div>
         <nav className={classes.navigation}>
            <ul>
               <li>
                  <Link href='/events'>Browse All Events</Link>
               </li>
               <li>
                  <Link href='/new-event'>Add New Event</Link>
               </li>
               {/* {!session && status !== 'loading' && (
                  <li className={classes.auth}>
                     <Link href='/auth'><div><SignInIcon /></div></Link>
                  </li>
               )} */}
               {session && ( 
                  <li className={classes.auth}>
                     <button onClick={logoutHandler}><SignOutIcon /></button>
                  </li>
               )}
               {session && session.user.image && <Image className={classes.portrait} style={{borderRadius: '3rem'}} src={session.user.image} alt='portrait' width={30} height={30} />}
            </ul>
         </nav>
      </header>
   );
}

export default MainHeader;