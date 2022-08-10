import Head from 'next/head'; 
import { getSession } from "next-auth/react"

import { connectToDatabase, getAllDocuments, getEventsQuantity } from '../helpers/db-util';
import EventList from '../components/events/event-list';
import NewsletterRegistration from '../components/input/newsletter-registration';
import Pagination from '../components/ui/pagination';

const HomePage = ({ events, totalEvents, page, eventsPerPage, likes }) => {

  return (
    <div>
      <Head>
        <title>NextJS Events</title>
        <meta
          name='description'
          content='Find a lot of great events that allow you to evolve...'
        />
      </Head>
      <NewsletterRegistration />
      <EventList items={events} likes={likes} />
      {+page <= Math.ceil(+totalEvents/+eventsPerPage) && <Pagination page={page} eventsPerPage={eventsPerPage} totalEvents={totalEvents} />}
    </div>
  );
}

export async function getServerSideProps(req) {
  const page = req.query.p || 1;
  const eventsPerPage = 1;
  const session = await getSession(req)

  let client = await connectToDatabase()
  const featuredEvents = await getAllDocuments(client, 'eventslist', { createdAt: -1 }, { isFeatured: true },  page, eventsPerPage)
  const totalEvents = await getEventsQuantity(client, 'eventslist', { isFeatured: true })
  const allLikes = session ? await getAllDocuments(client, 'likes', {}, { userId: session.user.id }, 1, 5555) || {} : null
  client.close();


  return {
    props: {
      likes: JSON.parse(JSON.stringify(allLikes)),
      page,
      eventsPerPage,
      totalEvents,
      events: featuredEvents.map(ev => ({
        title: ev.title,
        location: ev.location,
        image: ev.image,
        _id: ev._id.toString(),
        description: ev.description,
        isFeatured: ev.isFeatured,
        createdAt: ev.createdAt
      })),
    },
    //revalidate: 5 // 1800 = every 30 min
  }
}

export default HomePage;