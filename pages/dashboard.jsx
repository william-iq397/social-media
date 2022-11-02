import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Message from "../components/message";
import { db } from "../utils/firebase";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

function dashboard() {
  // useAuthState hook takes two arguments, the first one is the auth object and the second one is a boolean value
  // the second one is optional, if you don't pass it then it will be true by default
  // also it use to check if the user is logged in or not
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const [posts, setPost] = useState([]);
  
  // sign out and then go to home page
  function signOut() {
    auth.signOut();
  }

  // if the user is not logged in then go to home page
  // and getting the all the posts of the user
  function checkUserExistence() {
    if (loading) return;
    if (!user) route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unSubscribe = onSnapshot(q, (snapshot) =>
      setPost(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return unSubscribe;
  }

  useEffect(() => {
    checkUserExistence();
  }, [user, loading]);

  // delete the post
  async function deletePost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }

  const everyPost = posts.every((post) => post);

  // *** react Icons does not work ***
  return (
    <section className="w-full md:w-4/6 md:my-24 flex flex-col justify-center rounded-md md:p-3 border">
      <h1>Your posts</h1>
      {/* the posts of the only user that is signed in */}
      <div className="w-full">
        {posts[0] ? (
          posts.length > 0 ? ( // ? if the posts array is not empty then render the posts
            posts.map((post) => (
              <Message key={post.id} post={post}>
                {/* children for the Message component */}
                <div className="w-full flex justify-start items-center gap-8 text-sm ml-4 ">
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-700 flex gap-2"
                  >
                    <BsTrash2Fill /> Delete
                  </button>
                  <Link href={{ pathname: "/post", query: post }}>
                    <button className="text-teal-700 flex gap-2">
                      <AiFillEdit /> Edit
                    </button>
                  </Link>
                </div>
              </Message>
            ))
          ) : (
            // * (second else) else render (loading...)
            <h3 className="text-3xl font-medium p-14">Loading...</h3>
          )
        ) : (
          <h3 className="text-3xl font-medium p-14">No posts</h3>
        )}
      </div>
      <button
        className="mr-auto font-medium text-center hover:bg-gray-400 text-white transition-all duration-200 rounded-md bg-black p-2"
        onClick={signOut}
      >
        Sign out
      </button>
    </section>
  );
}

export default dashboard;
