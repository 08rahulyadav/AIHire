import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const CandidateLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CandidateLayout;