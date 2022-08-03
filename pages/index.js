import Head from 'next/head'; 

import { connectToDatabase, getAllDocuments } from '../helpers/db-util';
import EventList from '../components/events/event-list';
import NewsletterRegistration from '../components/input/newsletter-registration';

const HomePage = ({ events }) => {

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
      <EventList items={events} />
    </div>
  );
}

export async function getStaticProps() {

  let client = await connectToDatabase()
  const featuredEvents = await getAllDocuments(client, 'eventslist', { createdAt: -1 }, { isFeatured: true })
  client.close();

  return {
    props: {
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
    revalidate: 5 // 1800 = every 30 min
  }
}

export default HomePage;