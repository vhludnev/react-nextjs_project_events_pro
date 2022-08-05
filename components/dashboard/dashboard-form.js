import { useRef, useState } from 'react'
import classes from './dashboard-form.module.css'
import ShowPassIcon from '../icons/show-password';
import HidePassIcon from '../icons/hide-password';

const DashboardForm = ({ onUserDataChange, name, picture }) => {
   const [showOldPassword, setShowOldPassword] = useState(false)
   const [showNewPassword, setShowNewPassword] = useState(false)
   const nameRef = useRef()
   const pictureUrlRef = useRef(picture)
   const oldPasswordRef = useRef()
   const newPasswordRef = useRef()

   const submitHandler = (event) => {
      event.preventDefault()

      const name = nameRef.current.value
      const picture = pictureUrlRef.current.value
      const oldPassword = oldPasswordRef.current.value
      const newPassword = newPasswordRef.current.value

      // optional: Add validation

      onUserDataChange({ name, picture: `https://res.cloudinary.com/demo/image/fetch/${picture}`, oldPassword, newPassword }) // { oldPassword: oldPassword, newPassword: newPassword }
   }

   //console.log(image, name)
   return (
      <form className={classes.form} onSubmit={submitHandler}>
         <div className={classes.control}>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' ref={nameRef} defaultValue={name} />
         </div>
         <div className={classes.control}>
            <label htmlFor='avatar'>Photo (url)</label>
            <input type='url' id='avatar' ref={pictureUrlRef} />
         </div>
         <div className={classes.control}>
            <label htmlFor='old-password'>Old Password</label>
            <input type={showOldPassword ? 'text' : 'password'} id='old-password' ref={oldPasswordRef} />
            <span className={classes.pass} onClick={() => setShowOldPassword((prevState) => !prevState)}>{showOldPassword ? <ShowPassIcon /> : <HidePassIcon />}</span>
         </div>
         <div className={classes.control}>
            <label htmlFor='new-password'>New Password</label>
            <input type={showNewPassword ? 'text' : 'password'} id='new-password' ref={newPasswordRef} />
            <span className={classes.pass} onClick={() => setShowNewPassword((prevState) => !prevState)}>{showNewPassword ? <ShowPassIcon /> : <HidePassIcon />}</span>
         </div>
         <div className={classes.action}>
            <button>Update Profile</button>
         </div>
      </form>      
   )
}

export default DashboardForm
