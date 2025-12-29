import { useContext, useState, useEffect } from "react"
import { AppContext } from "../context/AppContext"
import { Link } from "react-router-dom"

export default function Home() {
    const { user, token } = useContext(AppContext)
    const [posts, setPosts] = useState([])
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [newPost, setNewPost] = useState("")
    const [errors, setErrors] = useState({})

    // Récupérer tous les posts
    async function getPosts() {
        const res = await fetch("/api/posts")
        const data = await res.json()
        setPosts(data)
        console.log(data)
    }

    // Récupérer les likes pour un post donné
    async function fetchLikes(postId) {
        const res = await fetch(`/api/posts/${postId}/likes`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        const data = await res.json()
        console.log(data)
        setPosts(prev =>
            prev.map(post =>
                post.id === postId
                    ? { ...post, likes_count: data.likes_count }
                    : post
            )
        );
    }

    // Liker un post
    async function handleLike(postId) {
        const res = await fetch(`/api/posts/${postId}/like`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        if (res.ok) {
            fetchLikes(postId) // met à jour le nombre de likes
        }
    }

    // Récupérer les commentaires du post sélectionné
    async function fetchComments(postId) {
        setSelectedPostId(postId)
        const res = await fetch(`/api/posts/${postId}/comments`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        const data = await res.json()
        setComments(data)
    }

    // Ajouter un commentaire
    async function handleCommentSubmit(e) {
        e.preventDefault()
        if (!newComment.trim()) return

        const res = await fetch(`/api/posts/${selectedPostId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ content: newComment })
        })
        if (res.ok) {
            setNewComment("")
            fetchComments(selectedPostId) // recharge les commentaires
        }
    }

    function truncateAtWord(text, maxLength = 100) {
        if (!text || typeof text !== "string") return "";
    
        const normalized = text
            .trim()
            .replace(/\s+/g, " ");
    
        if (normalized.length <= maxLength) {
            return normalized;
        }
    
        let truncated = normalized.slice(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(" ");
    
        if (lastSpaceIndex > 0) {
            truncated = truncated.slice(0, lastSpaceIndex);
        }
    
        return `${truncated}...`;
    }
    
    async function handleSubmitPost(e) {
        e.preventDefault();
    
        const PostData = {
            title: truncateAtWord(newPost, 25),
            body: newPost
        };
        console.log(PostData)
    
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PostData)
            });
    
            const data = await res.json();
            setNewPost("")
            getPosts()
    
            if (!res.ok || data.errors) 
                setErrors(data.errors || { general: "Erreur lors de la création du post" });
        } catch {
            setErrors({ general: "Erreur réseau" });
        }
    }    

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <div className="flex">
            {/* Contenu principal */}
            <div className="w-3/4 pr-4">

                <form onSubmit={handleSubmitPost} className="flex items-end gap-2 mb-4 bg-transparent px-3 py-2 ">
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder={user ? `Alors, ${user.name}, quoi de neuf ?...` : "Connectez-vous pour publier un post..."}
                    rows={2}
                    className="flex-1 mx-3 resize-none bg-transparent text-gray-600 rounded-3xl placeholder-gray-400 overflow-hidden min-h-[32px] max-h-[120px] text-sm"
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                />

                {/* Bouton d'envoi (flèche) */}
                <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className="text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed pb-1"
                    title="Envoyer"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                    </svg>
                </button>
                </form>

                <h1 className="title">derniers posts... {name}</h1>
                {posts.length === 0 ? (
                    <p>Loading...</p>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            onClick={() => fetchComments(post.id)}
                            className={`mb-4 p-4 border rounded-md border-dashed border-slate-400 cursor-pointer ${selectedPostId === post.id ? 'bg-gray-100' : ''}`}
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <h2 className="font-bold text-2xl">{post.title}</h2>
                                    <small className="text-xs text-slate-600">
                                        created by {post.user.name} on {new Date(post.created_at).toLocaleTimeString()}
                                    </small>
                                </div>
                                <div>
                                    <Link to={`/posts/${post.id}`} className="text-link">Read More</Link>
                                </div>
                            </div>
                            <p className="break-words overflow-hidden">{post.body}</p>
                            <div className="group mt-2 text-sm text-gray-600 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleLike(post.id)
                                }}>
                                <span className="group-hover:scale-200 transition">❤️</span>
                                <span>{post.likes_count ?? 0}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Widget latéral des commentaires */}
            <div className="w-1/4 border-l pl-4">

                {/* Formulaire d'ajout de commentaire */}
                <form onSubmit={handleCommentSubmit} className="flex items-end gap-2 mb-4 bg-transparent px-3 py-2 rounded-3xl">
                {/* Icônes à gauche
                <div className="flex gap-3 text-gray-400 pt-1">
                    <span className="cursor-pointer">😊</span>
                    <span className="cursor-pointer">📷</span>
                    <span className="cursor-pointer">🖼️</span>
                    <span className="cursor-pointer">🎭</span>
                </div> */}

                {/* Champ commentaire (textarea) */}
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? `${user.name}, Commentez...` : "Connectez-vous pour commenter..."}
                    rows={2}
                    className="flex-1 mx-3 resize-none bg-transparent text-gray-600 rounded-3xl placeholder-gray-400 outline-none border-none overflow-hidden min-h-[32px] max-h-[120px] text-sm"
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                />


                {/* Bouton d'envoi (flèche) */}
                <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed pb-1"
                    title="Envoyer"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                    </svg>
                </button>
                </form>


                <h2 className="text-lg font-bold mb-2">Commentaires</h2>
                {selectedPostId === null ? (
                    <p className="text-sm text-gray-500">Clique sur un post pour voir les commentaires.</p>
                ) : (
                    <>
                        {comments.length === 0 ? (
                            <p className="text-sm text-gray-500">Aucun commentaire pour ce post.</p>
                        ) : (
                            <ul className="space-y-3 mb-4">
                                {comments.map(comment => (
                                    <li key={comment.id} className="p-2 bg-gray-100 rounded">
                                        <p className="text-sm">{comment.content}</p>
                                        <small className="text-xs text-gray-500 block mt-1">
                                            — {comment.user.name}, {new Date(comment.created_at).toLocaleTimeString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </>
                )}
            </div>
        </div>
    )
}