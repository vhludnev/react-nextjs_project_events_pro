// this page will only kick in when multipe slugs presented (t.i / / / )
import Head from 'next/head';
import { useRouter } from "next/router";

import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import { connectToDatabase, getFilteredDocuments } from '../../helpers/db-util';

const FilteredEventsPage = ({ filteredEvs }) => {
   const router = useRouter();

   const filterData = router.query.slug;

   const filteredYear = +filterData[0];
   const filteredMonth = +filterData[1];

   /* updating Head if content loaded correctlly */
   let pageHeadData = (
      <Head>
         <title>Filtered Events</title>
         <meta
            name='description'
            content={`All events for ${filteredMonth}/${filteredYear}.`}
         />
      </Head>
   );

   /* check if query data passed is in correct format */
   if (
      isNaN(filteredYear) ||
      isNaN(filteredMonth) ||
      filteredYear > 2030 ||
      filteredYear < 2021 ||
      filteredMonth < 1 ||
      filteredMonth > 12 /* || 
      error */
   ) {
      return (
         <>
            {pageHeadData}
            <ErrorAlert>
               <p>Invalid filter. Please adjust your values!</p>
            </ErrorAlert>
            <div className='center showAllBtn'>
               <Button link='/events'>Show All Events</Button>
            </div>
         </>
      );
   }

   /* check if no events exist according to data passed */
   if (!filteredEvs || filteredEvs.length === 0) {
      return (
         <>
            {pageHeadData}
            <ErrorAlert>
               <p>No events found for the chosen filter!</p>
            </ErrorAlert>
            <div className='center filterBtn'>
               <Button link='/events'>Show All Events</Button>
            </div>
         </>
      );
   }

   const date = new Date(filteredYear, filteredMonth - 1);

   return (
      <>
         {pageHeadData}
         <ResultsTitle date={date} />
         <EventList items={filteredEvs} />
      </>
   );
}

export async function getServerSideProps(context) {
   const dates = {
     year: context.params.slug[0],
     month: context.params.slug[1]
   }

   let client = await connectToDatabase()
   const events = await getFilteredDocuments(client, 'eventslist', { createdAt: -1 }, dates)
   client.close();
   console.log(events.length)

   return {
      props: {
         filteredEvs: events.map(ev => ({
            title: ev.title,
            location: ev.location,
            image: ev.image,
            _id: ev._id.toString(),
            description: ev.description,
            isFeatured: ev.isFeatured,
            createdAt: ev.createdAt
         })),
      }
   };
}

export default FilteredEventsPage;