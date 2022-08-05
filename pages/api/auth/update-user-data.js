import { getSession } from 'next-auth/react';

import { hashPassword, verifyPassword } from '../../../helpers/auth-util';
import { connectToDatabase } from '../../../helpers/db-util';

async function handler(req, res) {
   if (req.method !== 'PATCH') {
      return;
   }

   const session = await getSession({ req: req });

   if (!session) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
   }

   const email = session.user.email;
   const { name, picture, oldPassword, newPassword } = req.body
   //const oldPassword = req.body.oldPassword;
   //const newPassword = req.body.newPassword;

   //if (!newPassword || newPassword.trim().length < 7) {
   if (newPassword && newPassword.trim().length < 7) {
      res.status(422).json({ message: 'Password should be at least 7 characters long.' });
      return;
   }

   const client = await connectToDatabase();

   const usersCollection = client.db().collection('users');

   const user = await usersCollection.findOne({ email });

   /* just in case */
   if (!user) {
      res.status(404).json({ message: 'User not found.' });
      client.close();
      return;
   }

   const currentPassword = user.password;

   const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

   //if (!passwordsAreEqual) {
   if (newPassword && oldPassword) {
      if (!passwordsAreEqual) {
         res.status(422).json({ message: 'Invalid old password.' });
         client.close();
         return;
      } else {
         const hashedPassword = await hashPassword(newPassword);

         await usersCollection.updateOne(
            { email },
            { $set: { password: hashedPassword, name, picture } } // add { $unset: [ "field1", "field2" ] } to remove fields do not need
         );
      }
   } else if ((!newPassword && !oldPassword ) && (name || picture)) {
      await usersCollection.updateOne(
         { email },
         { $set: { name, picture } }
      );
   } else {
      res.status(422).json({ message: 'Check password inputs' });
   }

   client.close();
   res.status(200).json({ message: 'User data updated!' });
}

export default handler;