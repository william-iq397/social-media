import React, { useEffect } from "react";
import Message from "../components/message";
import { useRouter } from "next/router";
import { useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";


export default function Comment() {
  // Get the router
  const route = useRouter();
  const routeData = route.query;

  // * to detect the input text
  const [message, setMessage] = useState("");
  // * to get all the comments
  const [allComments, setAllComments] = useState([]);
  
    // send a comment to database
    const submitComment = async (e) => {
      e.preventDefault();
      if (!auth.currentUser) {
        return route.push('/auth/login')
      }

      // if there is no comment then show an error
      // else send the comment to the database 
      if (!message) {
        toast.error("you forgot to put a comment.", {
          position: 'top-center',
          autoClose: 1500,  
          draggable: true,
          closeButton: false,
        })
        return;
      } else {
        const docRef = doc(db, "posts", routeData.id);
        await updateDoc(docRef,  {
          comments: arrayUnion({
            message: message,
            avatar: auth.currentUser.photoURL,
            username: auth.currentUser.displayName,
            time: Timestamp.now()
          }),
        });
        setMessage("");
      }
    };
  
    // * get all the comments from the database and set them to (allComments) state
    async function getComments() {
      const docRef = doc(db, "posts", routeData.id); 
      const unsubscribe = onSnapshot(docRef, (snapshot) => 
        setAllComments(snapshot.data().comments)
        )
        return unsubscribe
    }

    // * to get the comments when the page is loaded
    useEffect(() => {
      if (!route.isReady) return;
      getComments()
    }, [route.isReady])

    
  return (
    <div>
      <Message post={routeData}></Message>
      <div className="my-4 w-full">
        <div className="flex gap-1">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="send a message"
            className="bg-gray-800 p-2 rounded w-full text-white"
          /> 
          <button onClick={submitComment} className="bg-cyan-500 text-white py-2 px-4 rounded">Submit</button>
        </div>
        <div className="py-6 w-full">
          <div className="font-bold rounded-lg p-1">Comments</div>
          {allComments 
          ? allComments.map( message => (
            <div key={message.time} className="flex flex-col items-center gap-2 w-full border border-gray-400 rounded-md m-2">
              <div className="w-full flex gap-4 justify-start items-center p-2">
                <img
                  src={message.avatar} 
                  alt="user photo"
                  className="rounded-full w-10 text-sm"
                />
                <h6 className="text-sm ">{message.username}</h6>
              </div>
              <p className="w-full p-4 flex justify-start items-start">{message.message}</p>
        </div>))
        : <div className="flex justify-center items-center comment-animation">NO Comments Yet!</div>}
      </div>
    </div>
  </div>
  );
}