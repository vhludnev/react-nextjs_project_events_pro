import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import NewEventForm from '../../components/events/new-event-form';

const NewEventPage = () => {
  const router = useRouter();

  const addEventHandler = async (enteredEventData) => {
    const response = await fetch('/api/new-event', {
      method: 'POST',
      body: JSON.stringify(enteredEventData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log(data);

    router.push('/');
  }

  return (
    <>
      <Head>
        <title>Add a New Event</title>
        <meta
          name='description'
          content='Add your own events and create amazing networking opportunities.'
        />
      </Head>
      <NewEventForm onAddEvent={addEventHandler} />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      },
    };
  }

  return {
    props: { session },
  };
}

export default NewEventPage;