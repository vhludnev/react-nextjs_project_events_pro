import Image from 'next/image';
import classes from './event-item.module.css';
import Button from '../ui/button';
import DateIcon from '../icons/date-icon';
import AddressIcon from '../icons/address-icon';
import ArrowRightIcon from '../icons/arrow-right-icon';
import EventLike from './event-like';
import { useContext } from 'react';
import NotificationContext from '../../store/notification-context';

const EventItem = ({ title, image, date, location, _id, likes }) => {
   const { showNotification } = useContext(NotificationContext);
   
   const toggleLikeHandler = (likeData) => {
      
      fetch('/api/like/' + _id, {
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
   const formattedAddress = location.replace(', ', '\n');
   const exploreLink = `/events/${_id}`;

   return (
      <li className={classes.item}>
         <Image src={image ? image : '/images/no-image.png'} alt={title} width={250} height={160} />
         <div className={classes.content}>
            <div className={classes.summary}>
               <h2>{title}</h2>
               <EventLike like={likes?.length && likes[0].like} toggleLikeHandler={toggleLikeHandler} />
               <div className={classes.date}>
                  <DateIcon />
                  <time>{humanReadableDate}</time>
               </div>
               <div className={classes.address}>
                  <AddressIcon />
                  <address>{formattedAddress}</address>
               </div>
            </div>
            <div className={classes.actions}>
               <Button link={exploreLink}>
                  <span>Explore Event</span>
                  <span className={classes.icon}>
                     <ArrowRightIcon />
                  </span>
               </Button>
            </div>
         </div>
      </li>
   )
}

export default EventItem;