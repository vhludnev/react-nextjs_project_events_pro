import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from "next-auth/react"

import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';
import Pagination from '../../components/ui/pagination';
import { connectToDatabase, getAllDocumentsByPage, getAllDocuments, getEventsQuantity } from '../../helpers/db-util';

const AllEventsPage = ({ events, totalEvents, page, eventsPerPage, likes }) => {
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
         <EventList items={events} likes={likes} />
         {+page <= Math.ceil(+totalEvents/+eventsPerPage) && <Pagination page={page} eventsPerPage={eventsPerPage} totalEvents={totalEvents} query={'/events'} />}
      </>
   );
}

export async function getServerSideProps(req) {
   const page = req.query.p || 1;
   const eventsPerPage = 3;
   const session = await getSession(req);

   let client = await connectToDatabase()
   const allEvents = await getAllDocumentsByPage(client, 'eventslist', { createdAt: -1 }, {}, page, eventsPerPage)
   const totalEvents = await getEventsQuantity(client, 'eventslist')
   const allLikes = session ? await getAllDocuments(client, 'likes', null, { userId: session.user.id }) || {} : null
   client.close();

   return {
      props: {
         likes: JSON.parse(JSON.stringify(allLikes)),
         page,
         eventsPerPage,
         totalEvents,
         events: allEvents.map(ev => ({
            title: ev.title,
            location: ev.location,
            image: ev.image,
            _id: ev._id.toString(),
            description: ev.description,
            isFeatured: ev.isFeatured,
            createdAt: ev.createdAt,
            user: ev.user || ''
         })),
      },
      //revalidate: 1
   };
}

export default AllEventsPage;