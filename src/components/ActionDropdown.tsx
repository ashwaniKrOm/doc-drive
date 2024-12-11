"use client"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { fileDelete, fileRename, fileUpdate } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareDetails } from "./ActionsModalContent";
 

interface ActionType {
    label: string;
    icon: string;
    value: string;
  }

const ActionDropdown = ({file}:{file:Models.Document}) => {

    const [isModalOpen,setIsModalOpen]=useState(false);
    const [isDropdownOpen,setIsDropdownOpen]=useState(false);
    const [action,setAction]=useState<ActionType | null>(null);
    const [name,setName]=useState(file.name); //for "rename" dropdown item
    const [isLoading,setIsLoading]=useState(false); //for dropdown item modal
    const [emails,setEmails]=useState<string[]>([]);
    
    const path = usePathname();

    const closeAllModals =()=>{
      setIsModalOpen(false);
      setIsDropdownOpen(false);
      setAction(null);
      // setName(file.name);
      //setEmail
    }

     const handleAction = async () =>{
      if(!action) return;
      setIsLoading(true);
      
      let success=false;

      const actions = {
        rename: ()=>fileRename({fileId:file.$id,name,extension:file.extension,path}),
        share: ()=>fileUpdate({fileId:file.$id,emails,path}),
        delete:()=>fileDelete({fileId:file.$id,path,bucketFileId:file.bucketFileId
      }),
      }

      /* action.value contains a string (e.g., "rename", "share", or "delete").
actions[action.value] retrieves the corresponding function from the actions object.
as keyof typeof actions: Ensures TypeScript recognizes action.value as one of the keys in actions */
      success=await actions[action.value as keyof typeof actions](); 

      if (success) closeAllModals();

     setIsLoading(false);
     }

     //handle removing user
     const handleRemoveUser=async(email:string)=>{

      // console.log("Email:",email)
      // console.log("File:",file.owner.email)

      if(email!==file.owner.email){
       alert("Only Owner can remove it.");
       return;
      }

      const updatedEmails=emails.filter((e)=>e!==email);
      const success = await fileUpdate({
        fileId:file.$id,
        emails:updatedEmails,
        path
      });

      if(success){
        setEmails(updatedEmails);
      }
     }

    //modal for dropdown items
    const renderDialogContent = () => {

      if(!action) return null;

      const {label,value}=action;

      return (
        <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
            </DialogTitle>
            {value === "rename" && 
            <Input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />}
            {value === "details" && (
              <FileDetails file={file}/>
            )}

            {value === "share" && <ShareDetails file={file} onInputChange={setEmails} onRemove={handleRemoveUser}/>}

            {value === "delete" && (
              <p className="delete-confirmation">Are you sure you want to delete?
              <span className="delete-file-name">{" "}{file.name}</span>
              </p>
            )}
        </DialogHeader>
        {["rename","delete","share"].includes(value) && 
        (<DialogFooter className="flex flex-col gap-3 md:flex-row">
          <Button onClick={closeAllModals} className="modal-cancel-button">Cancel</Button>
          <Button onClick={handleAction} className="modal-submit-button">
            <p>{value}</p>
            {isLoading && 
            (<Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
            />)}
          </Button>
        </DialogFooter>)
        }
      </DialogContent>
      )
    }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
  <DropdownMenuTrigger className="shad-no-focus">
    <Image
    src="/assets/icons/dots.svg"
    alt="dots"
    width={25}
    height={25}
    />
    </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className="max-w-[200px] truncate">{file.name}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {actionsDropdownItems.map((actionItem)=>(
        <DropdownMenuItem 
        key={actionItem.value}
        className="shad-dropdown-item"
        onClick={()=>{
            setAction(actionItem);
        if(["rename","share","delete","details"].includes(actionItem.value)){
            setIsModalOpen(true);
        }}}
        >
            {actionItem.label === "Download"?
            (<Link
            href={constructDownloadUrl(file.bucketFileId)}
            download={file.name}
            className="flex item gap-3 "
            >
               <div>
                <Image
                src={actionItem.icon}
                alt={actionItem.label}
                width={30}
                height={30}
                />
                </div>
                <div className=" flex items-center">
                {actionItem.label}
                </div>
                
            </Link>)
            :
            (<div className="flex item gap-3 ">
              <div>
                <Image
                src={actionItem.icon}
                alt={actionItem.label}
                width={30}
                height={30}
                />
                </div>
                <div className=" flex items-center">
                {actionItem.label}
                </div>
            </div>)}
            
        </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>

    {renderDialogContent()}

</Dialog>

  )
}

export default ActionDropdown
