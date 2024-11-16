import { navItems } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={160}
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
      {navItems.map(({url,name,icon})=>(
          <Link href={url} key={name} >
            <li className={cn("sidebar-nav-item ")}>
              <Image
              src={icon} 
              alt={name}
              width={24}
              height={24}
              className={cn("nav-icon")}
              />
               <p className="hidden lg:block">{name}</p>
            </li>
          </Link>
      ))}
        </ul>
      </nav>

      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />
      <div className="sidebar-user-info">
        <Image
          src="https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-avatar-placeholder-png-image_3416697.jpg"
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">fullName</p>
          <p className="caption">email</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
