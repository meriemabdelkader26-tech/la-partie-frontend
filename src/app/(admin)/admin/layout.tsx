import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

interface Props {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-full bg-gradient-to-br from-[#BED3C3] via-[#EBACA2] to-[#4A919E]">
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50 bg-[#EBACA2]/80 backdrop-blur-sm border-b border-[#CE6A6B]/20">
        <Navbar />
      </div>
      <div className="hidden md:flex min-h-screen w-56 flex-col fixed inset-y-0 z-50 bg-[#BED3C3] border-r border-[#4A919E]/20">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-20 h-full min-h-screen">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;