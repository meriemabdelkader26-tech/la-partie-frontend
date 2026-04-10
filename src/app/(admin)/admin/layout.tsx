import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

interface Props {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-full bg-slate-950">
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-emerald-500/10">
        <Navbar />
      </div>
      <div className="hidden md:flex min-h-screen w-56 flex-col fixed inset-y-0 z-50 bg-slate-900 border-r border-emerald-500/10">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-20 h-full min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;