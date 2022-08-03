import Image from 'next/image';
import AddressIcon from '../icons/address-icon';
import DateIcon from '../icons/date-icon';
import LogisticsItem from './logistics-item';
import classes from './event-logistics.module.css';

const EventLogistics = ({ date, address, image, imageAlt }) => {

   const humanReadableDate = new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
   });

   return (
      <section className={classes.logistics}>
         <div className={classes.image}>
            <Image src={`/${image}`} alt={imageAlt} width={300} height={300} />
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