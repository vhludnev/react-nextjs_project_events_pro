import { useEffect, useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';

import classes from './event-like.module.css'

const EventLike = ({ toggleLikeHandler, like }) => {
   const [tempLike, setTempLike] = useState(false);
   const {data: session} = useSession();

   const router = useRouter();

   useEffect(() => {
      if (like) {
         setTempLike(like)
      }
   }, [])

   const handleLikeChange = () => {
      if (session) {
         setTempLike(!tempLike); 
         toggleLikeHandler(!tempLike);
      } else {
         router.push('/auth');
      }
   }

   return (
      <div className={classes.like} onClick={handleLikeChange} disabled>
         { !tempLike
           ? <AiOutlineHeart size={21} color='coral' />
           : <AiFillHeart size={21} color='coral' />
         }
      </div>
   );
}

export default EventLike;