import "../app.css"
import { Link, Outlet } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"

export default function Layout() {
    const {user, setToken, setUser, token} = useContext(AppContext)
    const navigate = useNavigate()
    async function handleLogout(e) {
        e.preventDefault()
        const res = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if(res.ok) {
            localStorage.removeItem("token")
            setToken(null)
            setUser(null)
            navigate("/")
        }
    }
    return (
        <>
        <header>
            <nav>
                <Link to="/" className="nav-link">Home</Link>
                {user ? (
                    <div className="flex items-center space-x-4">
                        <p className="text-slate-400 text-xs">Welcome back ! <span className="text-yellow-500 font-semibold text-base capitalize">{user.name}</span></p>
                        <Link to="/posts/create" className="nav-link">New Post</Link>
                        <form onSubmit={handleLogout}>
                            <button type="submit" className="nav-link">Logout</button>
                        </form>
                    </div>
                ) : (
                    <div className="space-x-4">
                        <Link to="/auth/login" className="nav-link">Login</Link>
                        <Link to="/auth/register" className="nav-link">Register</Link>
                    </div>
                )}
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
        </>
    )

}