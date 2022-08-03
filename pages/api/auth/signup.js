import { connectToDatabase } from '../../../helpers/db-util';
import { hashPassword } from '../../../helpers/auth-util';

async function handler(req, res) {
   if (req.method !== 'POST') {
      return;
   }

   const data = req.body;

   const { email, password } = data;

   if (!email || !email.includes('@') ||
      !password || password.trim().length < 7
   ) {
      res.status(422).json({ message: 'Invalid input - password should also be at least 7 characters long.' });
      return;
   }

    
   const client = await connectToDatabase();

   const db = client.db();

   /* checking if a user with this email has already been registered */
   const existingUser = await db.collection('users').findOne({ email });
   if (existingUser) {
      res.status(422).json({ message: 'User exists already!' });
      client.close();
      return;
   }

   const hashedPassword = await hashPassword(password);

   const result = await db.collection('users').insertOne({
      email, password: hashedPassword,
   });

   res.status(201).json({ message: 'New user created!' });
   client.close();
}

export default handler;