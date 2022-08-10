import EventItem from './event-item';
import classes from './event-list.module.css';

const EventList = ({ items, likes }) => {

   return (
      <ul className={classes.list}>
         {items.map(({ _id: id, title, location, createdAt, image }) => (
            <EventItem
               key={id}
               _id={id}
               title={title}
               location={location}
               date={createdAt}
               image={image}
               likes={likes?.filter(el => el.eventId === id )}
            />
         ))}
      </ul>
   )
}

export default EventList;