import { useContext, useState, useEffect } from "react"
import { AppContext } from "../context/AppContext"
import { Link } from "react-router-dom"

export default function Home() {
    const {name} = useContext(AppContext)
    const [posts, setPosts] = useState([])
    async function getPosts() {
        const res = await fetch("/api/posts")
        const data = await res.json()
        setPosts(data)
    }
    useEffect(() => {
        getPosts()
    }, [])
    return (
        <div>
            <h1 className="title">latest posts {name}</h1>
            {posts.length === 0 ? (
                <p>Loading...</p>
            ) : (   
                posts.map(post => (
                    <div key={post.id} className="mb-4 p-4 border rounded-md border-dashed border-slate-400">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h2 className="font-bold text-2xl">{post.title}</h2>
                                <small className="text-xs text-slate-600">created by {post.user.name} on {new Date(post.created_at).toLocaleTimeString()}</small>
                            </div>
                            <div>
                                <Link to={`/posts/${post.id}`} className="text-link">Read More</Link>
                            </div>
                        </div>
                        <p className="break-words overflow-hidde">{post.body}</p>
                    </div>
                ))
            )}
        </div>
    )
}
