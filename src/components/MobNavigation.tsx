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
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>


    </header>
  )
}

export default MobNavigation
