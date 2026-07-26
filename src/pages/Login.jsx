import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {

    const navigate = useNavigate();

    const [email,setEmail] =
        useState("");

    const [password,setPassword] =
        useState("");

    const submitHandler =
        async(e)=>{

        e.preventDefault();

        try {

            const res =
                await API.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );

            localStorage.setItem(
                "token",
                res.data.data.token
            );

            toast.success("Login successful");


            navigate("/dashboard");

        } catch (error) {
            toast.error(
            error?.response?.data?.message ||
                "Login failed"
            )
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">

            <form
                onSubmit={submitHandler}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >

                <h2 className="text-2xl font-bold mb-4">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3"
                    onChange={(e)=>
                        setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-3"
                    onChange={(e)=>
                        setPassword(e.target.value)}
                />

                <button
                    className="bg-blue-600 text-white w-full py-2 rounded"
                >
                    Login
                </button>

            </form>
        </div>
    );
};

export default Login;