import { getSession } from 'next-auth/react';
import { connectToDatabase, getAllDocuments } from '../helpers/db-util';
import UserEventList from '../components/dashboard/user-event-list';
import UserDashboardProfile from '../components/dashboard/dashboard-profile';
import { useState } from 'react';

const DashboardPage = ({ events }) => {
  const [userDataChange, setUserDataChange] = useState(false);

  const activateUserDataChange = () => {
    setUserDataChange(prev => !prev)
  }

  return (
    <div className='dashboardWrapper'>
      <UserDashboardProfile activateUserDataChange={activateUserDataChange} userDataChange={userDataChange} />
      <UserEventList items={events} userDataChange={userDataChange} />
    </div>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  
  if (!session) {
    return {
      notFound: true
      // redirect: {
      //   destination: '/auth',
      //   permanent: false
      // },
    };
  }

  let client = await connectToDatabase()
  const userEvents = await getAllDocuments(client, 'eventslist', { createdAt: -1 }, { "user.id": session.user.id });
  client.close();

  return {
    props: { 
      session,
      events: userEvents.map(ev => ({
        title: ev.title,
        location: ev.location,
        image: ev.image,
        _id: ev._id.toString(),
        description: ev.description,
        isFeatured: ev.isFeatured,
        createdAt: ev.createdAt,
        user: ev.user
      })), 
    },
  };
}

export default DashboardPage;
