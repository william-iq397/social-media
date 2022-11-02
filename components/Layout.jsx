import React from "react";
import Nav from "./Nav";

function Layout({ children }) {
  return (
    <div className="mx-auto w-12/12 md:max-w-3xl">
      <Nav />
      <main className="flex justify-center items-center"> {children} </main>
    </div>
  );
}

export default Layout;