// This component would likely be in a separate file like `BottomTabs.jsx`
import { FaHome, FaTags, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BottomTabs = ({ selectedTab, onTabClick }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabName, path) => {
    onTabClick(tabName);
    navigate(path);
  };

  const tabs = [
    { name: "home", icon: <FaHome />, path: "/" },
    { name: "categories", icon: <FaTags />, path: "/" }, // You might want a dedicated categories page
    { name: "cart", icon: <FaShoppingCart />, path: "/cart" },
    { name: "profile", icon: <FaUser />, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 md:hidden z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.name, tab.path)}
            className={`flex flex-col items-center justify-center p-2 text-sm transition-colors ${
              selectedTab === tab.name
                ? "text-orange-500 font-semibold"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            <div className="text-xl mb-1">{tab.icon}</div>
            <span className="text-xs">{tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomTabs;