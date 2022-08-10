import { useRef } from 'react';
import { BsSearch } from 'react-icons/bs';

import Button from '../ui/button';
import classes from './events-search.module.css';

const EventsSearch = ({ onSearch }) => {
   const yearInputRef = useRef();
   const monthInputRef = useRef();

   const submitHandler = (e) => {
      e.preventDefault();

      const selectedYear = yearInputRef.current.value;
      const selectedMonth = monthInputRef.current.value;

      onSearch(selectedYear, selectedMonth);    
   }

   return (
      <form className={classes.form} onSubmit={submitHandler}>
         <div className={classes.controls}>
            <div className={classes.control}>
               <label htmlFor='year'>Year</label>
               <select id='year' ref={yearInputRef}>
                  <option value='2021'>2021</option>
                  <option value='2022'>2022</option>
               </select>
            </div>
            <div className={classes.control}>
               <label htmlFor='month'>Month</label>
               <select id='month' ref={monthInputRef}>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((el, idx) => (
                     <option key={idx} value={idx+1}>{el}</option>
                  ))}
               </select>
            </div>
            <button><BsSearch color='#03be9f' size={21} /></button>
         </div>
      </form>
   );
}

export default EventsSearch;