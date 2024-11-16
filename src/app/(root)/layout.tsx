import Header from "@/components/Header";
import MobNavigation from "@/components/MobNavigation";
import Sidebar from "@/components/Sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main className="flex h-screen">
    <Sidebar/>

    <section className="flex h-full flex-1 flex-col">
        <MobNavigation/>

        <Header/>

        <div className="main-content">
        {children}
        </div>
    </section>
    
   </main>
  );
}
