import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();


    const { darkMode, toggleTheme } =
        useTheme();

    const logoutHandler = () => {
        localStorage.removeItem("token");
        toast.success(
            "Logged out successfully"
        );
        navigate("/login");
    };

    return (
        <nav  className={
        darkMode
            ? "bg-gray-950 text-white shadow"
            : "bg-white text-black shadow"
        }>
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

                <h1 className="text-2xl font-bold text-blue-600 text-center">
                    Expense Tracker
                </h1>

                <div className="flex flex-wrap justify-center gap-3 md:gap-6 items-center">

                    <Link
                        to="/dashboard"
                        className="hover:text-blue-600"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/transactions"
                        className="hover:text-blue-600"
                    >
                        Transactions
                    </Link>

                    <Link
                        to="/budgets"
                        className="hover:text-blue-600"
                    >
                        Budgets
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="bg-gray-700 text-white px-4 py-2 rounded"
                    >    
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    <button
                        onClick={logoutHandler}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;