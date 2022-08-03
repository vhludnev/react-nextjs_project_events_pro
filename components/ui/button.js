import Link from 'next/link';

import classes from './button.module.css';

const Button = ({ link, onClick, children }) => {
   if (link) {
      return (
         <Link href={link}>
            <a className={classes.btn}>{children}</a>
         </Link>
      );
   }

   // if no "link" prop passed it is just a "button": 
   return (
      <button className={classes.btn} onClick={onClick}>
         {children}
      </button>
   );
}

export default Button;