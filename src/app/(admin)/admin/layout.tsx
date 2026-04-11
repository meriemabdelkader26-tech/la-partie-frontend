import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

interface Props {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="h-full bg-background">
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50 bg-primary/90 backdrop-blur-sm border-b border-primary/20">
        <Navbar />
      </div>
      <div className="hidden md:flex min-h-screen w-56 flex-col fixed inset-y-0 z-50 bg-secondary border-r border-primary/20">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-20 h-full min-h-screen pageBackgroundColor">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;