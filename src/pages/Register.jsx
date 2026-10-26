/*import { useState } from "react";
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

export default Register;*/

import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await API.post("/auth/register", form);

            toast.success("Registration successful!");

            navigate("/login");
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
            <form
                onSubmit={submitHandler}
                className="bg-white p-8 shadow-md rounded-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h2>

                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    className="border p-2 w-full mb-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    className="border p-2 w-full mb-3 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    className="border p-2 w-full mb-5 rounded"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value
                        })
                    }
                    required
                    minLength={6}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white w-full py-2 rounded"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
