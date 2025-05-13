import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import { useParams } from "react-router-dom"
import { useEffect } from "react"


export default function Update() {
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const {token, user} = useContext(AppContext)
    const [post, setPost] = useState(null)
    const {id} = useParams()
    const [formData, setFormData] = useState({
        title: "",
        body: ""
    })

    async function getPost() {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()
        console.log(data)
        if (res.ok) {
            if(data.post.user.id !== user.id) {
                navigate("/")
            }
            setPost(data.post)
            setFormData({
                title: data.post.title,
                body: data.post.body
            })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const res = await fetch(`/api/posts/${id}`, {
            method: "PUT",
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

    useEffect(() => {
        getPost()
    }, [id])

    return (
        <div>
            <h1 className="title">Update Post</h1>
            <form onSubmit={handleSubmit} className="w-1/2 mx-auto space-y-6">
                <div>
                    <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                </div>
                <div>
                    <textarea name="" id="" cols="30" rows="7" value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })}></textarea>
                    {errors.body && <p className="text-red-500">{errors.body}</p>}
                </div>
                <button type="submit" className="primary-btn">Update Post</button>
            </form>
        </div>
    )
}