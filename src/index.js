import React from "react";
import ReactDOM from "react-dom";
import { render } from 'react-snapshot'

import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.scss";

// const rootElement = document.getElementById("root");
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   rootElement
// );

render(
  <App />,
  document.getElementById('root')
)