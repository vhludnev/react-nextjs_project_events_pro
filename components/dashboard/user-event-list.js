import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import UserEventItem from './user-event-item';
import DashboardForm from './dashboard-form';
import NotificationContext from '../../store/notification-context';
import classes from './user-event-list.module.css';
import { useContext } from 'react';

const UserEventList = ({ items, userDataChange }) => {
   const { data: session } = useSession();
   const { user: { name, picture } } = session
   const router = useRouter();
   const { showNotification } = useContext(NotificationContext);

   const changeUserDataHandler = async (userDataToUpdate) => {
      showNotification({
         title: 'Updating...',
         message: 'Updating User Data.',
         status: 'pending',
      })
      try {
         const response = await fetch('/api/auth/update-user-data', {
         method: 'PATCH',
         body: JSON.stringify(userDataToUpdate),
         headers: {
            'Content-Type': 'application/json'
         }
         });
         const data = await response.json();

         if (response.ok) {
            showNotification({
               title: 'Success!',
               message: 'User Data updated!',
               status: 'success',
            })
            router.push(router.asPath);
            return await data;
         } else {
            throw new Error(data.message || 'Something went wrong!');
         }     
      } catch (err) {
         showNotification({
            title: 'Error!',
            message: err.message || 'Something went wrong!',
            status: 'error',
         })
      }

      //console.log(data);

      // reload the page
      //return router.push(router.asPath);
   }

   return (
      <ul className={classes.list}>
         {!userDataChange ? items.map(({ _id: id, title, location, createdAt, image }) => (
            <UserEventItem
               key={id}
               _id={id}
               title={title}
               location={location}
               date={createdAt}
               image={image}
            />
         )) : <DashboardForm onUserDataChange={changeUserDataHandler} name={name} picture={picture} />}
      </ul>
   )
}

export default UserEventList;