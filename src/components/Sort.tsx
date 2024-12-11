"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation"

const Sort = () => {

  const path = usePathname();
  const router =useRouter();

  const handleSort=(value:string)=>{
    router.push(`${path}?sort=${value}`)
  }

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
  <SelectTrigger className="sort-select">
    <SelectValue placeholder={sortTypes[0].value} />
  </SelectTrigger>
  <SelectContent className="sort-select-content">
    {sortTypes.map(({label,value})=>(
      <SelectItem key={label} value={value} className="shad-select-item">{label}</SelectItem>
    ))}
  </SelectContent>
</Select>

  )
}

export default Sort
