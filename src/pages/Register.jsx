import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {

    const navigate =
        useNavigate();

    const [form,setForm] =
        useState({
            name:"",
            email:"",
            password:""
        });

    const submitHandler =
        async(e)=>{

        e.preventDefault();

        await API.post(
            "/auth/register",
            form
        );

        toast.success(
            "Registration successful"
        );

        navigate("/login");
    };

    return (
        <div className="h-screen flex justify-center items-center">

            <form
                onSubmit={submitHandler}
                className="bg-white p-8 shadow-md rounded-lg w-96"
            >

                <h2 className="text-2xl font-bold mb-4">
                    Register
                </h2>

                <input
                    placeholder="Name"
                    className="border p-2 w-full mb-3"
                    onChange={(e)=>
                        setForm({
                            ...form,
                            name:e.target.value
                        })
                    }
                />

                <input
                    placeholder="Email"
                    className="border p-2 w-full mb-3"
                    onChange={(e)=>
                        setForm({
                            ...form,
                            email:e.target.value
                        })
                    }
                />

                <input
                    placeholder="Password"
                    type="password"
                    className="border p-2 w-full mb-3"
                    onChange={(e)=>
                        setForm({
                            ...form,
                            password:e.target.value
                        })
                    }
                />

                <button
                    className="bg-green-600 text-white w-full py-2 rounded"
                >
                    Register
                </button>

            </form>
        </div>
    );
};

export default Register;