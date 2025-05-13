import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import { Link, useNavigate } from "react-router-dom"


export default function Show() {
    const {id} = useParams()
    const [post, setPost] = useState(null)
    const {user, token} = useContext(AppContext)
    const navigate = useNavigate()
    async function getPost() {
        const res = await fetch(`/api/posts/${id}`)
        const data = await res.json()
        console.log(data)
        if (res.ok) {
            setPost(data.post)
        }
    }

    async function handleDelete(e) { 
        e.preventDefault()
        if(!token) {
            navigate("/auth/login")
        }
        const res = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        if(res.ok) {
            navigate("/")
        }
    }

    console.log(id)
    useEffect(() => {
        getPost()
    }, [id])
    return (
        <> 
        {post ? (
            <div key={post.id} className="mb-4 p-4 border rounded-md border-dashed border-slate-400">
                <div className="mb-2 flex items-start justify-between">
                    <div>
                        <h2 className="font-bold text-2xl">{post.title}</h2>
                        <small className="text-xs text-slate-600">created by {post.user.name} on {new Date(post.created_at).toLocaleTimeString()}</small>
                    </div>
                </div>
                <div>
                    <p className="break-words overflow-hidden">{post.body}</p>
                </div>
                {user?.id === post.user.id && (
                    <div className="flex items-center justify-end gap-4">
                        <Link to={`/posts/${post.id}/update`} className="bg-green-500 text-white px-6 py-1 text-sm rounded-lg">Edit</Link>
                        <form onSubmit={handleDelete}>
                            <button type="submit" className="bg-red-500 text-white px-6 py-1 text-sm rounded-lg">Delete</button>
                        </form>
                    </div>
                )}
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </>
    )
}
