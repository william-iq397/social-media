import {FcGoogle} from "react-icons/fc";
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from "react";
 
function Login() {

    // useAuthState hook to check if the user is logged in or not
    const [user, loading] = useAuthState(auth) 

    // initialize the route navigation 
    const route = useRouter();

    // sign in with google
    const GoogleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, GoogleProvider);
            route.push('/')
        } catch (err) {
            console.log(err)
        }
    }
 console.log(user)
    useEffect(() => {
        if (user) route.push('/')
    }, [user])

  return (
    <div className="mx-auto w-11/12 md:max-w-3xl shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <h1 className="font-medium text-3xl">join today</h1>
      <div className="py-4">
        <h2 className="py-4 text-xl">sign in with our providers</h2>
        <button onClick={signInWithGoogle} className="mx-auto p-4 text-xs text-white bg-gray-800 rounded flex gap-2 items-center w-full md:w-1/2 justify-center"> <FcGoogle/>  log in with google</button>
      </div>
    </div>
  );
}

export default Login;
