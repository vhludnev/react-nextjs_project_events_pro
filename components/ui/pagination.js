import Button from './button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import classes from './pagination.module.css';

const Pagination = ({ page, eventsPerPage, totalEvents, query = '' }) => {
   const totalPages = Math.ceil(+totalEvents/+eventsPerPage);

   return (
      <div className={classes.paginationWrapper}>
         <Button 
            style={+page === 1 ? {pointerEvents: 'none', color: 'grey'} : {pointerEvents: 'all'}} 
            link={`${query}?p=${+page-1 > 0 ? +page-1 : page}`} 
            pagination><IoIosArrowBack />
         </Button>
         <span>{`${page} / ${totalPages}`}</span>
         <Button 
            style={page >= totalPages ? {pointerEvents: 'none', color: 'grey'} : {pointerEvents: 'all'}} 
            link={`${query}?p=${+page+1 <= totalPages ? +page+1 : totalPages}`} 
            pagination><IoIosArrowForward />
         </Button>
      </div>
   );
}

export default Pagination;