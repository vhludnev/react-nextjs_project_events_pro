import { getSession } from 'next-auth/react';
import { connectToDatabase, insertDocument, getAllDocuments } from '../../../helpers/db-util';

async function handler(req, res) {
   const session = await getSession({ req: req });

   if (!session) {
      res.status(401).json({ message: 'Not authenticated!' });
      return;
   }

   const eventId = req.query.eventId;
   const userId = session.user.id;
   const name = session.user.name;

   // connecting to DB:
   let client;

   try {
      client = await connectToDatabase();
   } catch (err) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
   }


   if (req.method === 'POST') {
      const { like } = req.body;

      try {
         const doc = await getAllDocuments(client, 'likes', {}, { $and: [ { userId }, { eventId } ] })

         if (doc.length) { 
            const db = client.db();

            const newLike = await db.collection('likes').updateOne(
               { $and: [ { userId }, { eventId } ] },
               { $set: { like, date: Date.now() } },
               //{ upsert: true }
               );
            res.status(201).json({ message: 'Success! Like changed!', newLike });
         } else {
            const newLike = { eventId, name, userId, like: true, date: Date.now() };
            await insertDocument(client, 'likes', newLike)
            res.status(201).json({ message: 'Success! Liked!', newLike });
         }
      } catch (err) {
         res.status(500).json({ message: 'Changing like failed!' });
      }

   } else if (req.method === 'GET') {  
      try {
         const result = await getAllDocuments(client, 'likes', {}, { userId })
         res.status(201).json({ likes: result });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong! Try again later.' });
      }
   } 

   client.close();
}

export default handler;