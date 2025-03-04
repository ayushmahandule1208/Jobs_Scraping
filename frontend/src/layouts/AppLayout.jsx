
import { Outlet } from "react-router-dom";
// import Chatbot from "@/components/chatbot"; // Import the chatbot component

const AppLayout = () => {
  return (
    <div className="min-h-screen container mx-auto">
      <main>
        <Outlet />
      </main>
     
    </div>
  );
};

export default AppLayout;
