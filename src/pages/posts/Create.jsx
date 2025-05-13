import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../../context/AppContext"


export default function Create() {
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const {token} = useContext(AppContext)
    const [formData, setFormData] = useState({
        title: "",
        body: ""
    })
    async function handleSubmit(e) {
        e.preventDefault()
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        console.log(data)
        if(data.errors || !res.ok) {
            setErrors(data.errors)
        } else {
            navigate("/")
        }
    }
    return (
        <div>
            <h1 className="title">Create New Post</h1>
            <form onSubmit={handleSubmit} className="w-1/2 mx-auto space-y-6">
                <div>
                    <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                </div>
                <div>
                    <textarea name="" id="" cols="30" rows="7" value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })}></textarea>
                    {errors.body && <p className="text-red-500">{errors.body}</p>}
                </div>
                <button type="submit" className="primary-btn">Create Post</button>
            </form>
        </div>
    )
}