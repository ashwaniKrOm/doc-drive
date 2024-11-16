
import Image from "next/image";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
    <section className=" hidden bg-brand p-10 lg:flex xl:w-2/5 w-1/2 items-center justify-center">
        <div className="flex flex-col justify-center max-h-[800px] max-w-[430px] bg-blue-800">
        <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />

            <div className="space-y-5 text-white">
                <h1 className="h1">Manage your files in the best way</h1>
                <p className="body-1">A place where you can store all your Docs.</p>
            </div>
            <Image
            src="/assets/images/files.png"
            alt="Files"
            width={342}
            height={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
        
    </section>

    <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>

        {children}
      </section>
    </div>
  );
}
