import { connectToDatabase, getEventDocuments } from '../../../helpers/db-util';

async function handler(req, res) {
   const eventId = req.query.eventId;
   // connecting to DB:
   let client;

   try {
      client = await connectToDatabase();
   } catch (err) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
   }

   try {
      const result = await getEventDocuments(client, 'eventslist', eventId, { createdAt: -1 })
      res.status(201).json({ events: result });
   } catch (err) {
      res.status(500).json({ message: 'Something went wrong! Try again later.'});
   }

   client.close();

}

export default handler;