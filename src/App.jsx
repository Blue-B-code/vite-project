import "./App.css"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"
import Create from "./pages/posts/Create"
import Show from "./pages/posts/Show"
import Update from "./pages/posts/Update"
function App() {
    const {user} = useContext(AppContext)
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Home />} />
                    <Route path="posts/:id" element={<Show />} />
                    <Route path="posts/:id/update" element={user? <Update /> : <Login />} />
                    <Route path="auth/login" element={user ? <Home /> : <Login />} />
                    <Route path="auth/register" element={user ? <Home /> : <Register />} />
                    <Route path="posts/create" element={user ? <Create /> : <Login />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
