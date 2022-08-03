import { connectToDatabase, insertDocument } from '../../helpers/db-util';

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
      const { title, image, location, description, isFeatured } = req.body;

      // SSR validation:
      // if (!email || !email.includes('@')) {
      //    res.status(422).json({ message: 'Invalid email address.' });
      //    client.close();
      //    return;
      // }

      const newEvent = {
         title, image, location, description, isFeatured, createdAt: Date.now()
      };

      // adding data to DB:
      let result;

      try {
         result = await insertDocument(client, 'eventslist', newEvent)
         newEvent._id = result.insertedId;
         //newEvent.id = result.insertedId;
         res.status(201).json({ message: 'Success! New Event added.' });
      } catch (err) {
         res.status(500).json({ message: 'Inserting data failed!' });
      }
   }
   client.close();

}

export default handler;