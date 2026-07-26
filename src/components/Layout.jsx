import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {

    const { darkMode } = useTheme();

    return (
        <div
            className={
                darkMode
                    ? "min-h-screen bg-gray-900 text-white"
                    : "min-h-screen bg-gray-100 text-black"
            }
        >
            <Navbar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;