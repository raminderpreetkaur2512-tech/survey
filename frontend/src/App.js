import React, { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [isAuth, setAuth] = useState(false);

  return (
    <>
      {isAuth ? (
        <Dashboard setAuth={setAuth} />
      ) : (
        <Login setAuth={setAuth} />
      )}
    </>
  );
}

export default App;