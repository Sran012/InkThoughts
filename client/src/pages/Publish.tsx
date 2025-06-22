import axios from "axios"
import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config"
import type{ ChangeEvent} from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

  return (
    <div><Appbar />
        <div className="flex justify-center w-full pt-8">
            <div className="max-w-screen-lg w-full">
                <input onChange={(e) => {
                    setTitle(e.target.value)
                }} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Title">
                </input>
                <TextEditor onChange={(e) => {
                    setDescription(e.target.value)
                }} />
                <button 
                    onClick={async () => {
                        if (!title.trim() || !description.trim()) {
                            alert("Please fill in both title and content");
                            return;
                        }
                        
                        setLoading(true);
                        try {
                            const response = await axios.post(`${BACKEND_URL}/blog`, {
                                title: title.trim(),
                                content: description.trim()
                            }, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`
                                }
                            });
                            
                            const blogId = response.data;
                            navigate(`/blog/${blogId}`);
                        } catch (error: any) {
                            console.error("Error publishing blog:", error);
                            if (error.response?.data?.message) {
                                alert(`Error: ${error.response.data.message}`);
                            } else if (error.response?.status === 401) {
                                alert("You are not logged in. Please sign in again.");
                                navigate("/signin");
                            } else {
                                alert("Failed to publish blog. Please try again.");
                            }
                        } finally {
                            setLoading(false);
                        }
                    }} 
                    disabled={loading}
                    type="submit" 
                    className="mt-4 inline-flex items-center px-3 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {loading ? "Publishing..." : "Publish post"}
                </button> 
            </div>   

     </div>
    </div>
  )
}

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}){
    return(
<div className="mt-8">
   <div className="w-full mb-4">
       <div className="flex items-center justify-between px-3 py-2 border">
       
        <div className="my-2 bg-white rounded-b-lg w-full">
            <label  className="sr-only">Publish post</label>
            <textarea onChange={onChange} id="editor" rows={8} className="block w-full px-0 text-sm focus-outline-none text-gray-800 bg-white border-0  " placeholder="Write a blog..." required ></textarea>
        </div>
   </div>
   
   </div>
</div>
    )
}