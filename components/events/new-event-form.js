import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react';

import Card from '../ui/card'
import classes from './new-event-form.module.css'

const NewEventForm = ({ onAddEvent }) => {
   const titleInputRef = useRef()
   const imageInputRef = useRef()
   const addressInputRef = useRef()
   const descriptionInputRef = useRef()
   const [isFeatured, setIsFeatured] = useState(false)
   const { data: session} = useSession();

   const submitHandler = (event) => {
      event.preventDefault()

      const title = titleInputRef.current.value
      const image = imageInputRef.current.value
      const location = addressInputRef.current.value
      const description = descriptionInputRef.current.value

      const eventData = {
         title,
         image/* : `https://res.cloudinary.com/demo/image/fetch/${image}` */,
         location,
         description,
         isFeatured,
         user: session.user
      }

      onAddEvent(eventData)
   }

   return (
      <>
         <h1 className={classes.title}>Add a New Event</h1>
         <Card>
            <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
               <label htmlFor='title'>Event Title</label>
               <input type='text' required id='title' ref={titleInputRef} />
            </div>
            <div className={classes.control}>
               <label htmlFor='image'>Event Image</label>
               <input type='url' required id='image' ref={imageInputRef} />
            </div>
            <div className={classes.control}>
               <label htmlFor='address'>Address</label>
               <input type='text' required id='address' ref={addressInputRef} />
            </div>
            <div className={classes.control}>
               <label htmlFor='description'>Description</label>
               <textarea
                  id='description'
                  required
                  rows='5'
                  ref={descriptionInputRef}
               ></textarea>
            </div>
            <div className={classes.controlRadio}>
               <input type="checkbox" name="featured" id="featured" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)}/>
               <label htmlFor="featured">Featured</label>
            </div>
            <div className={classes.actions}>
               <button>Add Event</button>
            </div>
            </form>
         </Card>
      </>
   )
}

export default NewEventForm
