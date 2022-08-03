import classes from './event-content.module.css';

const EventContent = ({ children }) => {
   return (
      <section className={classes.content}>
         {children}
      </section>
   );
}

export default EventContent;