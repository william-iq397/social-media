import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

function Post() {
  // Get the user
  const [user, loading] = useAuthState(auth);
  // state description of the post
  const [post, setPost] = useState({ description: "" });

  // Get the router
  const router = useRouter();

  //  update the post state
  const routeData = router.query;
  

  // Check if the user is logged in or not
  async function checkUserExistence() {
    // the loading is for the first time when the page is loading
    if (loading) return;
    // if the user is not logged in then go to home page
    if (!user) router.push("/auth/login");
    // if the description is not empty then update the post state
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  }

  useEffect(() => {
    checkUserExistence();
  }, [user, loading]);

  // target the description field
  function handleChange(e) {
    setPost({ ...post, description: e.target.value });
  }

  // send the post to the database
  async function submitPost(e) {
    e.preventDefault();
    // if text is empty, show an error
    if (!post.description) { 
      toast.error('Description Field is Required', {
        position: 'top-center',
        autoClose: 1500,
      })
      return;
    }

    // if the post has an id then update the post
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return router.push("/dashboard");
    } else {
    // create a new post
    const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        user: user.uid,
        timestamp: serverTimestamp(),
        username: user.displayName,
        userImage: user.photoURL,
      });
      setPost({ description: "" });
      toast.success('Post Created Successfully', {
        position: 'top-center',
        draggable: true,
        closeButton: false,
        autoClose: 1500,
      })
      return router.push('/')
    }
  }

  return (
    <div className=" shadow-xl p-12 my-10">
      <form className="w-full" onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">{ post.hasOwnProperty("id") ? "Edit Your post" : "Create new post" }</h1>
        <div>
          <h3 className="font-medium">Description</h3>
          <textarea
            value={post.description}
            maxLength={300}
            onChange={handleChange}
            className="bg-gray-900 text-white p-4 rounded-lg resize-none w-full h-40"
          ></textarea>
          <p className="text-sky-600">{post.description.length}/300</p>
        </div>
        <button type="submit" className="bg-cyan-600 text-white font-black rounded-lg p-2 w-full "> Post it! </button>
      </form>
    </div>
  );
}

export default Post;
