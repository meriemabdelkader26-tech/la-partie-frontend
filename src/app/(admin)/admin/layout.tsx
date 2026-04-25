import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

interface Props {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-full min-h-screen bg-white">
      {/* Topbar */}
      <div className="h-16 md:pl-64 fixed top-0 left-0 right-0 z-40 bg-white shadow-sm flex items-center border-b-2 border-black/5">
        <Navbar />
      </div>
      {/* Sidebar */}
      <div className="hidden md:flex min-h-screen w-64 flex-col fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-black to-gray-900 text-white border-r-2 border-black/10">
        <Sidebar />
      </div>
      {/* Main content */}
      <main className="md:pl-64 pt-16 h-full min-h-screen bg-white">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;