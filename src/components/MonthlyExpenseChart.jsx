import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const MonthlyExpenseChart = ({ data }) => {
    const { darkMode } = useTheme();

    const chartData = {
        labels: data.map(
            item =>
                `${item._id.month}/${item._id.year}`
        ),

        datasets: [
            {
                label: "Expenses",
                data: data.map(item => item.totalExpense),
                backgroundColor: "#3b82f6"
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
                Monthly Expenses
            </h2>

            <div className="h-80">
                <Bar
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

export default MonthlyExpenseChart;