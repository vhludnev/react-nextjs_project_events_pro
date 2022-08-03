import Head from 'next/head';
import { connectToDatabase, getAllDocuments, getEventDocuments } from '../../helpers/db-util';
import EventSummary from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import Comments from '../../components/input/comments';

const EventsDetailPage = ({ selectedEvent: event }) => {

   /* here a spinner can be implemented instead */
   // if (!event) {
   //    return (
   //       <div className='center'>
   //          <p>Loading...</p>
   //       </div>
   //    );
   // }

   return (
      <>
         <Head>
            <title>{event?.title}</title>
            <meta
               name='description'
               content={event?.description}
            />
         </Head>
         <EventSummary title={event?.title} />
         <EventLogistics
            //date={event.date}
            date={event?.createdAt}
            address={event?.location}
            image={event?.image}
            imageAlt={event?.title}
         />
         <EventContent>
            <p>{event?.description}</p>
         </EventContent>
         <Comments eventId={event?.id} />
      </>
   );
}

export async function getStaticProps(context) {
   const eventId = context.params.eventId;

   let client = await connectToDatabase()
   const event = await getEventDocuments(client, 'eventslist', eventId, { createdAt: -1 })
   client.close();

   if (!event || event.length === 0) {
      return { notFound: true };
   }

   return {
      props: {
         selectedEvent: {
            title: event[0].title,
            location: event[0].location,
            image: event[0].image,
            _id: event[0]._id.toString(),
            description: event[0].description,
            isFeatured: event[0].isFeatured,
            createdAt: event[0].createdAt
         },
      },
      revalidate: 60
   };
}

export async function getStaticPaths() {

   let client = await connectToDatabase()
   const events = await getAllDocuments(client, 'eventslist', { createdAt: -1 })
   client.close();

   const paths = events.map(event => ({ params: { eventId: event._id.toString() } }));
 
   return {
      paths,
      fallback: /* 'blocking' */ true,
   };
}

export default EventsDetailPage;