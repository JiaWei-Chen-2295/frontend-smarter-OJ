import './App.css'
import {RouterProvider} from "react-router";
import {router} from "./config/router.config.tsx";

function App() {
  return (
    <>
       <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
