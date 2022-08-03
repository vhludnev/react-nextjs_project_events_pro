import Head from 'next/head';
import { useRouter } from 'next/router';

import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';
import { connectToDatabase, getAllDocuments } from '../../helpers/db-util';

const AllEventsPage = ({ events }) => {
   const router = useRouter();

   const findEventsHandler = (year, month) => {
      const fullPath = `/events/${year}/${month}`;
      
      router.push(fullPath);
   }

   return (
      <>
         <Head>
            <title>All Events</title>
            <meta
               name='description'
               content='Find a lot of great events that allow you to evolve...'
            />
         </Head>
         <EventsSearch onSearch={findEventsHandler} />
         <EventList items={events} />
      </>
   );
}

export async function getStaticProps() {

   let client = await connectToDatabase()
   const allEvents = await getAllDocuments(client, 'eventslist', { createdAt: -1 })
   client.close();
 
   return {
      props: {
         events: allEvents.map(ev => ({
            title: ev.title,
            location: ev.location,
            image: ev.image,
            _id: ev._id.toString(),
            description: ev.description,
            isFeatured: ev.isFeatured,
            createdAt: ev.createdAt
         })),
      },
      revalidate: 1
   };
}

export default AllEventsPage;