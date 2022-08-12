import Image from 'next/image';
import AddressIcon from '../icons/address-icon';
import DateIcon from '../icons/date-icon';
import LogisticsItem from './logistics-item';
import EventLike from '../events/event-like';
import NotificationContext from '../../store/notification-context';
import classes from './event-logistics.module.css';
import { useContext, useEffect, useState } from 'react';

const EventLogistics = ({ eventId, date, address, image, imageAlt }) => {
   const [tempLike, setTempLike] = useState(false);
   const [loading, setLoading] = useState(true);
   const { showNotification } = useContext(NotificationContext);

   const toggleLikeHandler = (likeData) => {
      
      fetch('/api/like/' + eventId, {
        method: 'POST',
        body: JSON.stringify({like: likeData}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        //.then(response => response.json())
        .then(async response => {
          if (response.ok) {
            return await response.json();
          }
  
          return response.json()      // otherwise it activates catch method
            .then(data => {
              throw new Error(data.message || 'Something went wrong!');
          })
        })
        .catch(error => 
          showNotification({
            title: 'Error!',
            message: error.message || 'Something went wrong!',
            status: 'error',
          })
        );
      }


   const humanReadableDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
   });

   useEffect(() => {
      //if (session) {
         setLoading(true)
         fetch('/api/like/' + eventId)
            //.then(response => response.json())
            .then(async response => {
               if (response.ok) {
                  return await response.json();
               }
            })
            .then(({likes}) => {
               setTempLike(likes);
            })
            .catch(err => {
               console.log(err)
            })
            .finally(() => setLoading(false))
      //}
   }, []);


   return (
      <section className={classes.logistics}>
         <div className={classes.icon}>
            {!loading && <EventLike like={tempLike} toggleLikeHandler={toggleLikeHandler}/>}
         </div>
         <div className={classes.image}>
            <Image src={image ? image : '/images/no-image.png'} alt={imageAlt} width={300} height={300} />
         </div>
         <ul className={classes.list}>
            <LogisticsItem icon={DateIcon}>
               <time>{humanReadableDate}</time>
            </LogisticsItem>
            <LogisticsItem icon={AddressIcon}>
               <address>{address}</address>
            </LogisticsItem>
         </ul>
      </section>
   );
}

export default EventLogistics;