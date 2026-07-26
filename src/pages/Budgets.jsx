import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import { useTheme } from "../context/ThemeContext";
import Layout from "../components/Layout.jsx";

const Budgets = () => {
    const { darkMode } = useTheme();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        month: "",
        category: "",
        limit: ""

    });

    const fetchBudgets = async () => {
        try {
            setLoading(true);

            const res = await API.get("/budgets");

            setBudgets(res.data.data);

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch budgets"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addBudget = async (e) => {
        e.preventDefault();

        try {
            await API.post("/budgets", {
                month: formData.month,
                category: formData.category,
                limit: Number(formData.limit)
            });

            toast.success("Budget created");

            setFormData({
                month: "",
                limit: ""
            });

            fetchBudgets();

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to create budget"
            );
        }
    };

    const startEdit = (budget) => {
        setEditingId(budget._id);

        setFormData({
            month: budget.month,
            category: budget.category,
            limit: budget.limit
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const updateBudget = async (e) => {
        e.preventDefault();

        try {
            await API.patch(
                `/budgets/${editingId}`,
                {
                    month: formData.month,
                    category: formData.category,
                    limit: Number(
                        formData.limit
                    )
                }
            );

            toast.success(
                "Budget updated"
            );

            setEditingId(null);

            setFormData({
                month: "",
                limit: ""
            });

            fetchBudgets();

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update budget"
            );
        }
    };

    const deleteBudget = async (id) => {
        try {
            await API.delete(
                `/budgets/${id}`
            );

            setBudgets((prev) =>
                prev.filter(
                    (budget) =>
                        budget._id !== id
                )
            );

            toast.success(
                "Budget deleted"
            );

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to delete budget"
            );
        }
    };

    const totalBudgetLimit = budgets.reduce(
        (sum, budget) => sum + budget.limit,
        0
    );

    return (
        <>
            <Layout>

            <div className="max-w-7xl mx-auto p-8">

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-3xl font-bold">
                        Budgets
                    </h1>

                    <div className={ 
                        darkMode ? 
                        "bg-green-900 text-green-200 px-4 py-2 rounded" 
                        : "bg-green-100 text-green-700 px-4 py-2 rounded" 
                        }
                    >
                        Total: {budgets.length}
                    </div>
    
                    <div
                    className={
                        darkMode
                            ? "bg-green-900 text-green-200 px-4 py-2 rounded"
                            : "bg-green-100 text-green-700 px-4 py-2 rounded"
                    }
                    >
                    Total Budget: ₹{totalBudgetLimit}
                    </div>

                </div>

                {/* FORM */}

                <div  className={
                    darkMode
                    ? "bg-gray-800 text-white shadow rounded-lg p-6 mb-8"
                    : "bg-white shadow rounded-lg p-6 mb-8"
                    }
                >

                    <h2 className="text-xl font-semibold mb-4">

                        {editingId
                            ? "Edit Budget"
                            : "Create Budget"}

                    </h2>

                    <form
                        onSubmit={
                            editingId
                                ? updateBudget
                                : addBudget
                        }
                        className="grid md:grid-cols-3 gap-4"
                    >

                        <input
                            type="month"
                            name="month"
                            value={formData.month}
                            onChange={
                                handleChange
                            }
                            className={
                                darkMode
                                ? "bg-gray-700 text-white border border-gray-600 rounded p-2"
                                : "border rounded p-2"
                            }
                            required
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className={
                                darkMode
                                ? "bg-gray-700 text-white border border-gray-600 rounded p-2"
                                : "border rounded p-2"
                            }
                            required
   
                        />

                        <input
                            type="number"
                            name="limit"
                            placeholder="Budget Limit"
                            value={formData.limit}
                            onChange={
                                handleChange
                            }
                            className={
                                darkMode
                                ? "bg-gray-700 text-white border border-gray-600 rounded p-2"
                                : "border rounded p-2"
                            }
                            required
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded px-4 py-2"
                        >
                            {editingId
                                ? "Update Budget"
                                : "Create Budget"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {

                                    setEditingId(
                                        null
                                    );

                                    setFormData({
                                        month: "",
                                        limit: ""
                                    });

                                }}
                                className="bg-gray-500 text-white rounded px-4 py-2"
                            >
                                Cancel Edit
                            </button>
                        )}

                    </form>

                </div>

                {/* TABLE */}

                <div className={
                    darkMode
                        ? "bg-gray-800 text-white shadow rounded-lg overflow-x-auto"
                        : "bg-white shadow rounded-lg overflow-x-auto"
                    }
                >

                    {loading ? (
                        <div className="p-8 text-center">
                            Loading...
                        </div>
                    ) : budgets.length === 0 ? (
                        <div className="p-8 text-center">
                            No Budgets Found
                        </div>
                    ) : (/*
                        <table className="w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="p-4 text-left">
                                        Month
                                    </th>

                                    <th className="p-4 text-left">
                                        Limit
                                    </th>

                                    <th className="p-4 text-left">
                                        Created
                                    </th>

                                    <th className="p-4 text-left">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {budgets.map(
                                    (budget) => (
                                        <tr
                                            key={
                                                budget._id
                                            }
                                            className="border-t"
                                        >

                                            <td className="p-4">
                                                {
                                                    budget.month
                                                }
                                            </td>

                                            <td className="p-4">
                                                ₹
                                                {
                                                    budget.limit
                                                }
                                            </td>

                                            <td className="p-4">
                                                {new Date(
                                                    budget.createdAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="p-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            startEdit(
                                                                budget
                                                            )
                                                        }
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteBudget(
                                                                budget._id
                                                            )
                                                        }
                                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>*/

                        <table className="w-full min-w-[900px]">

    <thead  className={
        darkMode
            ? "bg-gray-700 text-white"
            : "bg-gray-100"
        }
    >

        <tr>

            <th className="p-4 text-left">
                Month
            </th>

            <th className="p-4 text-left">
                Category
            </th>

            <th className="p-4 text-left">
                Limit
            </th>

            <th className="p-4 text-left">
                Progress
            </th>

            <th className="p-4 text-left">
                Created
            </th>

            <th className="p-4 text-left">
                Actions
            </th>

        </tr>

    </thead>

    <tbody>

        {budgets.map(
            (budget) => (
                <tr
                    key={budget._id}
                    className={
                        darkMode
                            ? "border-t border-gray-700"
                            : "border-t"
                        }
                >

                    <td className="p-4">
                        {budget.month}
                    </td>

                    <td className="p-4">
                        {budget.category}
                    </td>

                    <td className="p-4">
                        ₹{budget.limit}
                    </td>

                    <td className="p-4 min-w-[250px]">

                        <div className={
                            darkMode
                            ? "w-full bg-gray-700 rounded-full h-5"
                            : "w-full bg-gray-200 rounded-full h-5"
                            }
                        >

                            <div
                                /*className={`h-4 rounded-full ${
                                    budget.percentage < 70
                                        ? "bg-green-500"
                                        : budget.percentage < 90
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{
                                    width: `${Math.min(
                                        budget.percentage,
                                        100
                                    )}%`
                                }}*/
                                className={`h-5 rounded-full ${
                                    budget.percentage >= 100
                                        ? "bg-red-500"
                                        : budget.percentage >= 80
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                }`}
                                style={{
                                    width: `${Math.min(
                                        budget.percentage,
                                    100
                                    )}%`
                                }}
                            />

                        </div>
                        {budget.percentage >= 80 && 
                            budget.percentage < 100 && 
                            ( <p className="text-yellow-500 text-sm mt-2"> 
                            ⚠ Budget nearing limit 
                            </p> 
                        )}

                        {budget.percentage >= 100 && ( 
                            <p className="text-red-500 text-sm mt-2">
                                🚨 Budget exceeded 
                            </p> 
                        )}

                        <div className="text-sm mt-2">

                            ₹{budget.spent}
                            {" / "}
                            ₹{budget.limit}

                            {" "}
                            (
                            {budget.percentage?.toFixed(1)}
                            %
                            )

                        </div>

                    </td>

                    <td className="p-4">
                        {new Date(
                            budget.createdAt
                        ).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                        <div className="flex gap-2">

                            <button
                                onClick={() =>
                                    startEdit(
                                        budget
                                    )
                                }
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    deleteBudget(
                                        budget._id
                                    )
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            )
        )}

    </tbody>

</table>
                    )}

                </div>

            </div>
            </Layout>
        </>
    );
};

export default Budgets;

