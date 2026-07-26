import { useEffect,useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

import ExpensePieChart from "../components/ExpensePieChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";
import { useTheme } from "../context/ThemeContext";


const Dashboard = () => {

    //console.log("Dashboard Rendered");
    const { darkMode } = useTheme();
    
    const [stats, setStats] = useState({});
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [recentTransactions, setRecentTransactions] =
    useState([]);

    const fetchDashboardData = async () => {
      try {
        const statsRes =
            await API.get("/dashboard/stats");

        setStats(statsRes.data.data);

        const categoryRes =
            await API.get(
                "/dashboard/category-expenses"
            );

        setCategoryData(
            categoryRes.data.data
        );

        const monthlyRes =
            await API.get(
                "/dashboard/monthly-expenses"
            );

        setMonthlyData(
            monthlyRes.data.data
        );

        const recentRes =
          await API.get(
            "/dashboard/recent-transactions"
        );

        setRecentTransactions(
          recentRes.data.data
        );

      } catch (err) {
        console.error(err);
      }
    };
     
  
    useEffect(() => {

    fetchDashboardData();

    const refreshDashboard = () => {
      //console.log("Dashboard Refresh Event Received");
        fetchDashboardData();
    };

    window.addEventListener(
        "transactionUpdated",
        refreshDashboard
    );

    return () => {
        window.removeEventListener(
            "transactionUpdated",
            refreshDashboard
        );
    };

  }, []);

/*const Dashboard = ()=>{

    const [stats,setStats] =
        useState({});
    const [categoryData,setCategoryData] =
    useState([]);

    const [monthlyData,setMonthlyData] =
    useState([]);

    useEffect(()=>{

    const fetchData = async () => {
    try {
    const statsRes = await API.get(
      "/dashboard/stats"
    );

    console.log("Stats:", statsRes.data);

    const categoryRes = await API.get(
      "/dashboard/category-expenses"
    );

    console.log("Category:", categoryRes.data);

    const monthlyRes = await API.get(
      "/dashboard/monthly-expenses"
    );

    console.log("Monthly:", monthlyRes.data);

    setStats(statsRes.data.data);
    setCategoryData(categoryRes.data.data);
    setMonthlyData(monthlyRes.data.data);

    } catch (error) {
    console.error(
      "Dashboard Error:",
      error.response?.data || error
    );
    }
    };

},[]);*/

    return (
        
       <Layout>
       <div className="p-8">
       <h1 className="text-3xl font-bold mb-6">
            Dashboard
       </h1>

    <div className="grid grid-cols-4 gap-4">
      <div className={
        darkMode
            ? "bg-gray-800 p-6 shadow rounded text-white"
            : "bg-white p-6 shadow rounded"
        }>
        Income: ₹{stats.income || 0}
      </div>

      <div className={
        darkMode
            ? "bg-gray-800 p-6 shadow rounded text-white"
            : "bg-white p-6 shadow rounded"
        }>
        Expense: ₹{stats.expense || 0}
      </div>

      <div className={
        darkMode
            ? "bg-gray-800 p-6 shadow rounded text-white"
            : "bg-white p-6 shadow rounded"
        }>
        Balance: ₹{stats.balance || 0}
      </div>

      <div className={
        darkMode
            ? "bg-gray-800 text-white p-6 shadow rounded"
            : "bg-white p-6 shadow rounded"
        }
      >
        Transactions:
        {stats.transactionCount || 0}
      </div>

    </div>

    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <ExpensePieChart data={categoryData} />
      <MonthlyExpenseChart data={monthlyData} />
    </div>

    <div className="mt-8">
      <div className={
        darkMode
            ? "bg-gray-800 p-6 shadow rounded text-white"
            : "bg-white p-6 shadow rounded"
        }>
        
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Recent Transactions
            </h2>

            <Link
              to="/transactions"
              className="text-blue-600 hover:underline"
            >
              View All
            </Link>

          </div>

          {recentTransactions.map((txn) => (
           <div
            key={txn._id}
            className="flex justify-between items-center border-b py-3"
          > 
          <div>
            <p className="font-semibold">
                {txn.category}
            </p>

            <p className="text-sm text-gray-500">
                {txn.description || "No description"}
            </p>

            <p className="text-xs text-gray-400">
                {new Date(txn.date).toLocaleDateString()}
            </p>
          </div>

          <span
            className={`font-bold ${
                txn.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
            }`}
          >
            {txn.type === "income" ? "+" : "-"}₹
            {txn.amount}
          </span>
      </div>
    ))} 
               
    </div>
    
    </div>
    </div>
    </Layout>
  );
};

export default Dashboard;

