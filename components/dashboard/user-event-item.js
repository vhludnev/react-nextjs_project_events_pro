import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import classes from './user-event-item.module.css';
import DateIcon from '../icons/date-icon';
import AddressIcon from '../icons/address-icon';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FiMoreHorizontal } from 'react-icons/fi';
import NotificationContext from '../../store/notification-context';
import { useContext } from 'react';

const UserEventItem = ({ title, image, date, location, _id }) => {

   const humanReadableDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
   });
   const formattedAddress = location.replace(', ', '\n');
   const exploreLink = `/events/${_id}`;

   const router = useRouter();
   const { showNotification } = useContext(NotificationContext);

   const deleteEventHandler = async () => {
      let message = 'Are you sure you want to delete this event?'
      if (confirm(message) == false) {
         return;
      }

      showNotification({
         title: 'Deleting...',
         message: 'Deleting Event.',
         status: 'pending',
      })
      try {
         /* const response =  */await fetch(`/api/events/${_id}`, {
            method: 'DELETE',
            body: JSON.stringify(_id),
            headers: {
            'Content-Type': 'application/json',
            },
         });

         //const data = await response.json();

         //console.log(data);
         showNotification({
            title: 'Success!',
            message: 'Event deleted!',
            status: 'success',
         })
         return router.push(router.asPath);
      } catch (err) {
         showNotification({
            title: 'Error!',
            message: err.message || 'Something went wrong!',
            status: 'error',
         })
      }
   }

   return (
      <li className={classes.item}>
         <Image src={image ? image : '/images/no-image.png'} alt={title} width={150} height={100} />
         <div className={classes.content}>
         <div className={classes.summary}>
            <h2>{title}</h2>
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
            <button onClick={deleteEventHandler}><RiDeleteBin5Fill color='red' size={24} /></button>
            <Link href={exploreLink}>
               <div><FiMoreHorizontal color='green' size={24} /></div>
            </Link>
         </div>
         </div>
      </li>
   )
}

export default UserEventItem;