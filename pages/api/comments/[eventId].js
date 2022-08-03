import { connectToDatabase, insertDocument, getEventComments } from '../../../helpers/db-util';

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


   if (req.method === 'POST') {
      const email = req.body.email;
      const name = req.body.name;
      const text = req.body.text;

      // SSR validation:
      if (!email || !email.includes('@') || !name || name.trim() === '' || !text || text.trim() === '') {
         res.status(422).json({ message: 'Invalid data entered.' });
         client.close();
         return;
      }

      const newComment = {
         eventId, email, name, text, createdAt: Date.now()
      };

      // adding data to DB:
      let result;

      try {
         result = await insertDocument(client, 'comments', newComment)
         newComment._id = result.insertedId;
         res.status(201).json({ message: 'Success! Comment posted.', newComment });
      } catch (err) {
         res.status(500).json({ message: 'Adding comment failed!' });
      }

   } else if (req.method === 'GET') {  
      try {
         const result = await getEventComments(client, 'comments', eventId, { createdAt: -1 })
         res.status(201).json({ comments: result });
      } catch (err) {
         res.status(500).json({ message: 'Something went wrong! Try again later.' });
      }
   } 

   client.close();
}

export default handler;