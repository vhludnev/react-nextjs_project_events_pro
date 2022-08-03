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
      const email = req.body.email;

      // SSR validation:
      if (!email || !email.includes('@')) {
         res.status(422).json({ message: 'Invalid email address.' });
         client.close();
         return;
      }

      // adding data to DB:
      try {
         await insertDocument(client, 'newsletter', { email })
         res.status(201).json({ message: 'Success! Email added.' });
      } catch (err) {
         res.status(500).json({ message: 'Inserting data failed!' });
      }
   }
   client.close();
}

export default handler;