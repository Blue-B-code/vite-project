import ReactDOM from "react-dom/client"
import AppProvider from "./context/AppContext.jsx"
import './App.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App/>
  </AppProvider>
);