import { useEffect, useState, useContext } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/notification-context';

const Comments = ({ eventId }) => {
  const [showComments, setShowComments] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [errorFetchingComments, setErrorFetchingComments] = useState(false);
  const [comments, setComments] = useState([]);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (showComments) {
      setIsFetchingComments(true)
      setErrorFetchingComments(false)
      fetch('/api/comments/' + eventId)
        //.then(response => response.json())
        .then(async response => {
          if (response.ok) {
            return await response.json();
          }
  
          return response.json()
            .then(data => {
              throw new Error(data.message || 'Something went wrong!');
          })
        })
        .then(data => {
          setComments(data.comments);
          setIsFetchingComments(false);
        })
        .catch(err => {
          setIsFetchingComments(false);
          setErrorFetchingComments(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);

  const toggleCommentsHandler = () => {
    setShowComments(prevStatus => !prevStatus);
  }

  const addCommentHandler = (commentData) => {
    showNotification({
      title: 'Sendin comment...',
      message: 'Saving your comment.',
      status: 'pending',
    });

    fetch('/api/comments/' + eventId, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      //.then(response => response.json())
      .then(async response => {
        if (response.ok) {
          return await response.json();
        }

        return response.json()      // otherwise it activates catch method
          .then(data => {
            throw new Error(data.message || 'Something went wrong!');
        })
      })
      .then(data => {
        setComments(state => [...state, data.newComment]);
        showNotification({
          title: 'Success!',
          message: 'A new comment added successfully!',
          status: 'success',
        })
      })
      .catch(error => 
        showNotification({
          title: 'Error!',
          message: error.message || 'Something went wrong!',
          status: 'error',
        })
      );
  }

  return (
    <section className={classes.comments}>
      <button className={showComments ? classes.show : classes.hide} onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComments && comments && <CommentList items={comments.sort((a,b) => b.createdAt - a.createdAt)} />}
      {showComments && isFetchingComments && !errorFetchingComments && <p style={{textAlign: 'center', color: '#03be9f'}}>Loading...</p>}
      {showComments && !isFetchingComments && errorFetchingComments && <p style={{textAlign: 'center', color: 'red'}}>Something went wrong! Please, try again later.</p>}
    </section>
  );
}

export default Comments;
