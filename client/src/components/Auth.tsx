import type{ ChangeEvent } from "react"
import {useState} from 'react';
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { signupInput } from "tsinfer-from-zod"

export const Auth = ({type}: {type: "signup" | "signin"}) => {

  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<signupInput>({
    name: "",
    email: "",
    password: ""
  })

  async function sendRequest () {
    try{
      const response = await axios.post(`${BACKEND_URL}/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
      const jwt = response.data;
      localStorage.setItem("token", jwt);
      localStorage.setItem("userName", postInputs.name || "");
      navigate("/blogs")
    } catch (e){
      alert("Error while signing up")
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
          <div>
            <div className="text-4xl font-extrabold pb-2">
            Welcome to InkThoughts! <br />
            </div>
            <div className="text-3xl font-extrabold ">
            Create an account
            </div>
            <div className="text-slate-500 mt-3 mb-3">
                {type === "signin" ? "Dont have an account:?" : "Already have an account?"}
                <Link className="pl-2 underline" to={type=== "signin" ? "/signup" : "/signin"}>
                  {type === "signin" ? "Sign Up" : "Sign In"}
                </Link>
            </div>

            {type === "signup" ? <LabelledInput label="Name" placeholder="Sujal rana" onChange={(e) =>{
              setPostInputs({
                ...postInputs,
                name: e.target.value
              })
            }}/> : null}

            <LabelledInput label="email" placeholder="sj@mail.com" onChange={(e) =>{
              setPostInputs({
                ...postInputs,
                email: e.target.value
              })
            }}/>

            <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) =>{
              setPostInputs({
                ...postInputs,
                password: e.target.value
              })
            }}/>

          <button onClick={sendRequest} type="button" className="mt-6 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign Up" : "Sign In"}</button>

          </div>
        </div>
    </div>
    
  )
}

interface LabelledInputType{
  label: string,
  placeholder: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string
}

function LabelledInput({label, placeholder, onChange, type}: LabelledInputType){
  return <div>

          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">{label}</label>
          <input onChange={onChange} type={type || "text"} id="first_name" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
            
        </div>
}

export default Auth