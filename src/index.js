
import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App"


//the render method can only take one html element,this is not used here as the react version is above 18
// ReactDOM.render(
//   <div>
//     <h1>Hello world</h1>
//     <p>this is a paragraph</p>
//   </div>,
//   document.getElementById("root")
// );


const root = createRoot(document.getElementById("root"));//this line finds the eleemnt with id as root in index.html
root.render(
  < App />
);
//the border radius makes the border of the input field look curved
//in jsx ir react the class name for attributes are given in camelcasing