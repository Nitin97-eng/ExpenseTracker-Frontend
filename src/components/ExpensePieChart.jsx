import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const ExpensePieChart = ({ data }) => {
    const { darkMode } = useTheme();

    const chartData = {
        labels: data.map(
            item => item._id
        ),
    
        datasets: [
            {
                data: data.map(item => item.totalSpent),
                backgroundColor: [
                    "#ef4444",
                    "#3b82f6",
                    "#22c55e",
                    "#f59e0b",
                    "#8b5cf6",
                    "#06b6d4"
                ]
            }
        ]
    };

    return (

            <div className={
                darkMode
                    ? "bg-gray-800 p-6 rounded shadow text-white"
                    : "bg-white p-6 rounded shadow"
                }>
                <h2 className="text-xl font-semibold mb-4">
                    Expense By Category
                </h2>

            <div className="h-80">
                <Pie
                    data={chartData}
                    options={{
                    responsive: true,
                    maintainAspectRatio: false
                    }}
                />
            </div>
            </div>
    );
};

export default ExpensePieChart;