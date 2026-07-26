import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTheme } from "../context/ThemeContext";
import Layout from "../components/Layout";

const Transactions = () => {
    const { darkMode } = useTheme();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    const [formData, setFormData] = useState({
        amount: "",
        type: "expense",
        category: "",
        description: ""
    });

    const fetchTransactions = async () => {
        try {
            setLoading(true);

            const res = await API.get("/transactions");

            setTransactions(res.data.data);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to fetch transactions"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addTransaction = async (e) => {
        e.preventDefault();

        try {
            await API.post("/transactions", {
                amount: Number(formData.amount),
                type: formData.type,
                category: formData.category,
                description: formData.description
            });

            toast.success("Transaction added");

            window.dispatchEvent(
                new Event("transactionUpdated")
            );

            //console.log("Transaction Event Sent");

            setFormData({
                amount: "",
                type: "expense",
                category: "",
                description: ""
            });

            fetchTransactions();

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to add transaction"
            );
        }
    };

    const startEdit = (transaction) => {
        setEditingId(transaction._id);

        setFormData({
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            description:
                transaction.description || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const updateTransaction = async (e) => {
        e.preventDefault();

        try {
            await API.patch(
                `/transactions/${editingId}`,
                {
                    amount: Number(formData.amount),
                    type: formData.type,
                    category: formData.category,
                    description:
                        formData.description
                }
            );

            window.dispatchEvent(
                new Event("transactionUpdated")
            );

            toast.success(
                "Transaction updated"
            );

            setEditingId(null);

            setFormData({
                amount: "",
                type: "expense",
                category: "",
                description: ""
            });

            fetchTransactions();

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update transaction"
            );
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await API.delete(
                `/transactions/${id}`
            );

            window.dispatchEvent(
                new Event("transactionUpdated")
            );

            setTransactions((prev) =>
                prev.filter(
                    (item) => item._id !== id
                )
            );

            toast.success(
                "Transaction deleted"
            );

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to delete transaction"
            );
        }
    };

    const filteredTransactions =
        transactions.filter(
            (transaction) => {

                const matchesType =
                    filterType === "all"
                        ? true
                        : transaction.type ===
                          filterType;

                const matchesSearch =
                    transaction.category
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                return (
                    matchesType &&
                    matchesSearch
                );
            }
        );

        const exportCSV = () => {
            const headers = [
            "Amount",
            "Type",
            "Category",
            "Description",
            "Date"
            ];

            const rows = transactions.map(
                (txn) => [
                    txn.amount,
                    txn.type,
                    txn.category,
                    txn.description,
                    new Date(
                        txn.date
                    ).toLocaleDateString()
                ]
            );

            const csvContent =
                [headers, ...rows]
                    .map(
                    row => row.join(",")
                    )
                    .join("\n");

            const blob = new Blob(
                    [csvContent],
                    {
                    type:"text/csv;charset=utf-8;"
                    }
            );

            saveAs(
                blob,
                "transactions.csv"
            );
        };

    const exportPDF = () => {

       const doc = new jsPDF();

            doc.setFontSize(18);

                doc.text(
                    "Expense Tracker Report",14,20
                );

                autoTable(doc, {
                    startY: 30,

                head: [[
                    "Amount",
                    "Type",
                    "Category",
                    "Description",
                    "Date"
                ]],

                body: transactions.map(
                    (txn) => [
                        txn.amount,
                        txn.type,
                        txn.category,
                        txn.description || "-",
                        new Date(
                            txn.date
                        ).toLocaleDateString()
                    ]
                )
            });

            doc.save(
                "transactions-report.pdf"
            );
    };

    return (
        <>
            <Layout>

            <div className="max-w-7xl mx-auto p-8">

                <div className="flex justify-between items-center mb-8">

                    <div className="flex justify-between items-center mb-8">

                        <h1 className="text-4xl font-bold">
                            Transactions
                        </h1>

                        <div className="flex gap-3">

                        <button
                            onClick={exportCSV}
                                className="
                                    bg-green-600
                                    text-white
                                    px-3
                                    py-2
                                    text-sm
                                    rounded
                                "
                        >
                            Export CSV
                        </button>

                        <button
                            onClick={exportPDF}
                            className="
                                bg-red-600
                                text-white
                                px-3
                                py-2
                                text-sm
                                rounded
                            "
                        >
                            Export PDF
                        </button>
                        </div>

                    </div>

                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded">
                        Total: {transactions.length}
                    </div>

                </div>

                {/* FORM */}

                <div className={
                    darkMode
                        ? "bg-gray-800 text-white shadow rounded-lg p-6 mb-8"
                        : "bg-white shadow rounded-lg p-6 mb-8"
                    }>

                    <h2 className="text-xl font-semibold mb-4">

                        {editingId
                            ? "Edit Transaction"
                            : "Add Transaction"}

                    </h2>

                    <form
                        onSubmit={
                            editingId
                                ? updateTransaction
                                : addTransaction
                        }
                        className="grid md:grid-cols-4 gap-4"
                    >

                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={
                                handleChange
                            }
                            className="border rounded p-2"
                            required
                        />

                        <select
                            name="type"
                            value={formData.type}
                            onChange={
                                handleChange
                            }
                            className="border rounded p-2"
                        >
                            <option value="expense">
                                Expense
                            </option>

                            <option value="income">
                                Income
                            </option>
                        </select>

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={
                                formData.category
                            }
                            onChange={
                                handleChange
                            }
                            className="border rounded p-2"
                            required
                        />

                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            className="border rounded p-2"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 rounded md:col-span-4"
                        >
                            {editingId
                                ? "Update Transaction"
                                : "Add Transaction"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {

                                    setEditingId(
                                        null
                                    );

                                    setFormData({
                                        amount: "",
                                        type: "expense",
                                        category: "",
                                        description: ""
                                    });
                                }}
                                className="bg-gray-500 text-white py-2 rounded md:col-span-4"
                            >
                                Cancel Edit
                            </button>
                        )}

                    </form>

                </div>

                {/* FILTERS */}

                <div className={
                    darkMode
                    ? "bg-gray-800 text-white shadow rounded-lg p-4 mb-6 flex gap-4 flex-wrap"
                    : "bg-white shadow rounded-lg p-4 mb-6 flex gap-4 flex-wrap"
                }>

                    <input
                        type="text"
                        placeholder="Search Category"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        className={
                                darkMode
                                ? "bg-gray-700 text-white border border-gray-600 rounded p-2"
                                : "border rounded p-2"
                        }
                    />

                    <select
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(
                                e.target.value
                            )
                        }
                        className={
                            darkMode
                            ? "bg-gray-700 text-white border border-gray-600 rounded p-2"
                            : "border rounded p-2"
                        }     
                        style={{
                            colorScheme: darkMode ? "dark" : "light"
                        }}
                    >
                        <option value="all"  className="bg-gray-700 text-white">
                            All
                        </option>

                        <option value="income"  className="bg-gray-700 text-white">
                            Income
                        </option>

                        <option value="expense"  className="bg-gray-700 text-white">
                            Expense
                        </option>
                    </select>

                </div>

                {/* TABLE */}

                <div  className={
        darkMode
            ? "bg-gray-800 text-white shadow rounded-lg overflow-hidden"
            : "bg-white shadow rounded-lg overflow-hidden"
    }>

                    {loading ? (
                        <div className="p-8 text-center">
                            Loading...
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center">
                            No Transactions Found
                        </div>
                    ) : (
                        <table className="w-full">

                            <thead className={
        darkMode
            ? "bg-gray-700 text-white"
            : "bg-gray-100"
    }>

                                <tr>
                                    <th className="p-4 text-left">
                                        Amount
                                    </th>

                                    <th className="p-4 text-left">
                                        Type
                                    </th>

                                    <th className="p-4 text-left">
                                        Category
                                    </th>

                                    <th className="p-4 text-left">
                                        Description
                                    </th>

                                    <th className="p-4 text-left">
                                        Date
                                    </th>

                                    <th className="p-4 text-left">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredTransactions.map(
                                    (
                                        transaction
                                    ) => (
                                        <tr
                                            key={
                                                transaction._id
                                            }
                                            className={
                                                 darkMode
                                                ? "border-t border-gray-700"
                                                : "border-t"
                                            }
                                        >

                                            <td className="p-4">
                                                ₹
                                                {
                                                    transaction.amount
                                                }
                                            </td>

                                            <td className="p-4">

                                                <span
                                                    className={`px-2 py-1 rounded text-white ${
                                                        transaction.type ===
                                                        "income"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                                >
                                                    {
                                                        transaction.type
                                                    }
                                                </span>

                                            </td>

                                            <td className="p-4">
                                                {
                                                    transaction.category
                                                }
                                            </td>

                                            <td className="p-4">
                                                {
                                                    transaction.description
                                                }
                                            </td>

                                            <td className="p-4">
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="p-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            startEdit(
                                                                transaction
                                                            )
                                                        }
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteTransaction(
                                                                transaction._id
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

export default Transactions;

