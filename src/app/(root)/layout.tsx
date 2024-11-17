import Header from "@/components/Header";
import MobNavigation from "@/components/MobNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const getUser= await getCurrentUser();
  console.log(getUser)

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
