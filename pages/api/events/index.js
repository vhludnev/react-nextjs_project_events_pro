import { connectToDatabase, getAllDocuments } from '../../../helpers/db-util'

async function handler(req, res) {
   // connecting to DB:
   let client;

   try {
      client = await connectToDatabase();
   } catch (err) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
   }

   if (req.method === 'GET') {
      try {
         const result = await getAllDocuments(client, 'eventslist', { createdAt: -1 })    
         res.status(201).json({ events: result });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong! Try again later.' });
      }
   }

   client.close();

}

export default handler;