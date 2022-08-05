import { connectToDatabase, insertDocument, deleteDocument } from '../../helpers/db-util';

async function handler(req, res) {
   // connecting to DB:
   let client;

   try {
      client = await connectToDatabase();
   } catch (err) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
   }

   if (req.method === 'POST') {
      const { title, image, location, description, isFeatured, user } = req.body;
      // SSR validation:
      // if (!email || !email.includes('@')) {
      //    res.status(422).json({ message: 'Invalid email address.' });
      //    client.close();
      //    return;
      // }

      const newEvent = {
         title, image, location, description, isFeatured, createdAt: Date.now(), user
      };

      // adding data to DB:
      let result;

      try {
         result = await insertDocument(client, 'eventslist', newEvent)
         newEvent._id = result.insertedId;
         res.status(201).json({ message: 'Success! New Event added.' });
      } catch (err) {
         res.status(500).json({ message: 'Inserting data failed!' });
      }
   } else if (req.method === 'DELETE') {
      try {
         const eventId = req.body;
         await deleteDocument(client, 'eventslist', eventId)
         res.status(201).json({ message: 'Success! Event deleted.' });
      } catch (err) {
         res.status(500).json({ message: 'Event delete failed!' });
      }
   }
   client.close();

}

export default handler;