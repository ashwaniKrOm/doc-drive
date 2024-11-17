"use client"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { Separator } from "@radix-ui/react-separator"
import { navItems } from "@/constants"
import Link from "next/link"
import { cn } from "@/lib/utils"
import FileUploader from "./FileUploader"
import { Button } from "./ui/button"


const MobNavigation = () => {

  const [open,setOpen]=useState(false);

  return (
    <header className="mobile-header">
<Image
src="/assets/icons/logo-full-brand.svg"
alt="logo"
width={120}
height={52}
/>

<Sheet open={open} onOpenChange={setOpen}>
{/* onOpenChange={()=>setOpen(!open)} you can use it also, both works same */}
  <SheetTrigger>
    <Image
    src="/assets/icons/menu.svg"
    alt="menu"
    width={30}
    height={30}
    />
  </SheetTrigger>
  <SheetContent className="shad-sheet h-screen px-3">
   
      <SheetTitle>
        <div className="header-user">
        <Image
                src="https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-avatar-placeholder-png-image_3416697.jpg"
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
                />

<div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">fullName</p>
                <p className="caption">email</p>
              </div>
        </div>
        <Separator className="mb-4 bg-light-200/20"/>
      </SheetTitle>

      <nav className="mobile-nav">
        <ul className="mobile-nav-list">
          {navItems.map(({url,name,icon})=>(
            <Link href={url} key={name} className="lg:w-full">
                <li className={cn("mobile-nav-item")}>
                  <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn("nav-icon")}
                  />
                  <p>name</p>
                </li>
            </Link>
          ))}
        </ul>
      </nav>

          <Separator className="my-5 bg-light-200/20"/>

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader/>
            <Button
            type="submit"
            className="mobile-sign-out-button"
            onClick={()=>{}}
            >
              <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
  </SheetContent>
</Sheet>
 </header>
  )
}

export default MobNavigation

