import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../../context/AppContext"

export default function Login() {
    const navigate = useNavigate()
    const {token, setToken} = useContext(AppContext)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json()

        if(data.errors || !res.ok) {
            setErrors(data.errors)
        } else {
            localStorage.setItem("token", data.token)
            setToken(data.token)
            navigate("/")
        }
    }
    return (
        <div>
            <h1 className="title">Login to your account</h1>
            {token}
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleSubmit}>
                <div>
                    <input type="text" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    {errors.email && <p className="error">{errors.email[0]}</p>}
                </div>
                <div>
                    <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    {errors.password && <p className="error">{errors.password[0]}</p>}
                </div>
                <button type="submit" className="primary-btn">Login</button>
            </form>
        </div>
    )
}