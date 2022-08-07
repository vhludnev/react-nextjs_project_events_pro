import Link from 'next/link';
import { useSession, signOut/* , signIn */ } from 'next-auth/react';
import { useRouter } from 'next/router';
import SignOutIcon from '../icons/sign-out-circle';
import Image from 'next/image';
import SignInIcon from '../icons/sign-in-circle';
import classes from './main-header.module.css';
import { useState, useEffect, useRef } from 'react';

const MenuNav = ({ dropdown, closeDropdown }) => {
   let ref = useRef();
   const logoutHandler = () => {
      signOut({ callbackUrl: '/auth' });
   }

   useEffect(() => {
      const handler = (event) => {
         if (dropdown && ref.current && !ref.current.contains(event.target)) {
            closeDropdown();
         }
      };
      document.addEventListener("mousedown", handler);
      document.addEventListener("touchstart", handler);
      return () => {
         // Cleanup the event listener
         document.removeEventListener("mousedown", handler);
         document.removeEventListener("touchstart", handler);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dropdown]);

   return (
     <ul className={classes.dropdown} style={dropdown ? {diplay: 'flex'} : {display: 'none'}} ref={ref} >
         <li>
            <Link href='/dashboard'>Dashboard</Link>
         </li>
         <hr style={{color: 'grey', margin: 0}}/>
         <li>
            <button onClick={logoutHandler}><SignOutIcon/></button>
         </li>
     </ul>
   )
};

const MainHeader = () => {
   const [dropdown, setDropdown] = useState(false);
   const { data: session/* , status */} = useSession();
   const router = useRouter();

   const closeDropdown = () => {
      setDropdown(false)
   }

   // const onMouseEnter = () => {
   //    window.innerWidth > 960 && setDropdown(true);
   // };
     
   // const onMouseLeave = () => {
   //    window.innerWidth > 960 && setDropdown(false);
   // };

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
               {!session && ( 
                  <li className={classes.auth}>
                     <button onClick={() => router.push('/auth')}><SignInIcon /></button>
                  </li>
               )}
               {session && (<>
                  <span className={classes.auth} /* aria-expanded={dropdown ? "true" : "false"} */ onClick={() => setDropdown((prev) => !prev)} >
                     <Image 
                        className={classes.portrait}  
                        src={session.user?.picture || '/images/noimage.jpg'} 
                        alt='portrait' 
                        width={30} 
                        height={30} 
                     />
                     <MenuNav dropdown={dropdown} closeDropdown={closeDropdown} />
                  </span>                 
               </>)}
            </ul>
         </nav>
      </header>
   );
}

export default MainHeader;