import { MongoClient, ObjectId } from 'mongodb';

export async function connectToDatabase() {
   const url = process.env.MONGO_URI;
   const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   };
   const client = new MongoClient(url, opts);
   
   await client.connect();
   //console.log('Connected successfully to server');
   return client;
}

export async function getAllDocuments(client, collection, sort, filter) {
   const db = client.db();

   const documents = await db
      .collection(collection)
      .find(filter)
      .sort(sort)
      .toArray();

   return documents;
}

export async function getAllDocumentsByPage(client, collection, sort, filter, page, eventspage = 3) {
   const db = client.db();

   const documents = await db
      .collection(collection)
      .find(filter)
      .sort(sort)
      .skip((page-1) * eventspage)
      .limit(eventspage)
      .toArray();

   return documents;
}

export async function getDateFilteredDocuments(client, collection, sort, filter) {
   const db = client.db();

   const year = +filter.year;
   const month = +filter.month;

   const documents = await db
      .collection(collection)
      .find({ createdAt: { $gt: new Date(`${year}-${month}-01`).getTime(), $lt: new Date(`${year}-${month+1}-01`).getTime() } })
      .sort(sort)
      .toArray();

   return documents;
}

export async function getDocumentById(client, collection, eventId) {
   const db = client.db();

   try{
      const documents = await db
         .collection(collection)
         .find({ _id: ObjectId(eventId) })
         .toArray();

      return documents[0];
   } catch (err) {
      return null
   }
}

export async function getEventsQuantity(client, collection, filter = {}) {
   const db = client.db();

   try{
      const quantity = await db
         .collection(collection)
         .countDocuments(filter)

      return quantity;
   } catch (err) {
      return null
   }
}

export async function insertDocument(client, collection, document) {
   const db = client.db();

   const result = await db.collection(collection).insertOne(document);
   return result;
}

export async function deleteDocument(client, collection, eventId) {
   const db = client.db();

   const result = await db.collection(collection).deleteOne({ _id: new ObjectId(eventId) });
   return result;
}


export async function getEventComments(client, collection, eventId, sort) {
   const db = client.db();

   try{
      const documents = await db
         .collection(collection)
         .find({ eventId })
         .sort(sort)
         .toArray();

      return documents;
   } catch (err) {
      return null
   }
}

/* user utils */
export async function findUserByEmail(client, collection, email) {
   const db = client.db();
 
   const user = await db.collection(collection).findOne({ email });
 
   return user;
}
 
export async function addNewUser(client, collection, data) {
   const db = client.db();
 
   const user = await db.collection(collection).insertOne({ ...data });
 
   return user;
}