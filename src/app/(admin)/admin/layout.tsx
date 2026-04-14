import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

interface Props {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-full min-h-screen bg-background">
      {/* Topbar */}
      <div className="h-16 md:pl-64 fixed top-0 left-0 right-0 z-40 bg-white shadow-sm flex items-center border-b border-muted">
        <Navbar />
      </div>
      {/* Sidebar */}
      <div className="hidden md:flex min-h-screen w-64 flex-col fixed inset-y-0 left-0 z-50 bg-primary text-white border-r border-muted">
        <Sidebar />
      </div>
      {/* Main content */}
      <main className="md:pl-64 pt-16 h-full min-h-screen bg-background">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;