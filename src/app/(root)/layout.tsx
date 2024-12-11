import Header from "@/components/Header";
import MobNavigation from "@/components/MobNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const currentUser= await getCurrentUser();
  // console.log(currentUser)
  if(!currentUser) return redirect("/sign-in");
  return (
   <main className="flex h-screen">
    
    <Sidebar {...currentUser}/>

    <section className="flex h-full flex-1 flex-col">
        <MobNavigation {...currentUser}/>

        <Header userId={currentUser.$id} accountId={currentUser.accountId}/>

        <div className="main-content">
        {children}
        </div>
    </section>

    <Toaster/>
   </main>
  );
}
