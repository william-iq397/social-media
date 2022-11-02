import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="mt-2 py-1 rounded-lg mx-auto w-11/12 md:max-w-3xl font-poppins flex justify-between items-center">
      <Link href="/">
        <button id="logo" className="text-sm md:text-md lg:text-lg xl:text-xl"> creative minds </button>
      </Link>
      {/* if the user exist then render the post component else render login component */}
      {user ? (
        <div className="w-fit-content flex justify-center items-center gap-1 min-h-10 ">
          <Link href={"/post"}>
            <button className="cursor-pointer bg-cyan-600 text-white rounded-lg p-3 text-xs">post</button>
          </Link>
          <Link href={"/dashboard"}>
            <img className="w-14 md:w-18 rounded-3xl cursor-pointer" src={user.photoURL} alt="user photo" />
          </Link>
        </div>
     ) : (
        <ul className="flex items-center gap-2">
          <Link href="/auth/login">
            <li className="cursor-pointer bg-cyan-600 text-white rounded-lg px-4 py-2">
              login
            </li>
          </Link>
        </ul>
      )}
    </nav>
  );
}
