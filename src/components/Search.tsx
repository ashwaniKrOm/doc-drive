"use client"
import Image from "next/image"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getFiles } from "@/lib/actions/file.actions"
import { Models } from "node-appwrite"
import Thumbnail from "./Thumbnail"
import DateTime from "./DateTime"
import {useDebounce} from "use-debounce"

const Search = () => {

  const [query,setQuery]=useState("");
  const [results,setResults]=useState<Models.Document[]>([])
  const [open,setOpen]=useState(false);

  const router = useRouter();
  const path=usePathname();
  const searchParams=useSearchParams();
  
  const [debouncedQuery]=useDebounce(query,300);
  
  const searchString=searchParams.get("query") || "";
 

  useEffect(()=>{
    const fetchFiles = async () => {

      if(debouncedQuery==="" || debouncedQuery.length===0 ){
        setOpen(false);
        setResults([]);
        // router.push(path.replace(searchParams.toString(),""))
        router.push(path.split("?")[0])
        return;
      }
    //  console.log(searchString)

      const files = await getFiles({types:[],searchText:debouncedQuery});
      setResults(files.documents);
      setOpen(true);
 
    }

    fetchFiles();
  },[debouncedQuery]);

  useEffect(() => {
    if (!searchString) {
      setQuery("");
      setOpen(false); // Close suggestions if the URL query is cleared
    } else {
      setQuery(searchString); // Sync query state with the URL query
    }
  }, [searchString]);

  const handleClick=(file:Models.Document)=>{
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  }

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
        src="/assets/icons/search.svg"
        alt="Search"
        width={24}
        height={24}
        />
        <Input
        value={query}
        placeholder="Search here"
        className="search-input"
        onChange={(e)=>setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">{results.length>0 ?(results.map((file)=>(
            <li key={file.$id} className="flex items-center justify-between" onClick={()=>handleClick(file)}>
              <div className="cursor-pointer flex items-center gap-4">
                <Thumbnail type={file.type} extension={file.extension} url={file.url} className="size-9 min-w-9"/>
              <p className="subtitle-2 line-clamp-1 text-light-100">{file.name}</p>
              </div>
              <DateTime
              date={file.$createdAt}
              className="caption line-clamp-1 text-light-200"
              />
            </li>
          ))):(<p className="empty-result">No results</p>)}</ul>
        )}
      </div>

    </div>
  )
}

export default Search
