/* handling multiple routes auto created by Next Auth  (example: api/auth/signout, api/auth/session, etc) */
import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { connectToDatabase, findUserByEmail, addNewUser } from '../../../helpers/db-util';
import { verifyPassword } from '../../../helpers/auth-util';

export default NextAuth({
   session: {
      strategy: 'jwt',                          // defines if user auth is managed by JWT (optional, default: true)
      maxAge: 30 * 24 * 60 * 60,                // t.i. 30 days (optional) - how long until an idle session expires and is no longer valid
   },
   secret: process.env.SECRET,
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
      CredentialsProvider({
         async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            const client = await connectToDatabase();

            const usersCollection = client.db().collection('users');

            const user = await usersCollection.findOne({ email: credentials.email });
      
            if (!user) {
                  // If you return null then an error will be displayed advising the user to check their details.
                  // return null;
               client.close();
               throw new Error('No user found!');
            } else {
               const isValid = await verifyPassword(credentials.password, user.password);
        
               if (!isValid) {
                  client.close();
                  throw new Error('Could not log you in!');
               }
        
               client.close();

               return { email: user.email };
              // return user; /* will include also password and _id of the user */
            }
         }
      })
   ],
   callbacks: {
      async signIn({ account, profile }) {
         if (account.provider === "google") {
            const { name, picture, email } = profile

            const client = await connectToDatabase();

            const user = await findUserByEmail(client, 'users', email)

            if (!user) {
               const newUser = await addNewUser(client, 'users', { email, provider: account.provider, name, picture });
               client.close();
               return newUser;
            } else {    
               client.close();
               return user;
            }   
            //return profile.email_verified
         }
         return true // Do different verification for other providers that don't have `email_verified`
      },
      async session({ session }) {
         if (!session) return;

         const client = await connectToDatabase();
         
         const userData = await findUserByEmail(client, 'users', session.user.email);

         return {
            user: {
               id: userData._id,
               name: userData.name || '',
               picture: userData.picture || '',
               provider: userData.provider || 'credentials',
               email: userData.email
            }
         };
      },
   }
});