import { Models } from "node-appwrite"
import Thumbnail from "./Thumbnail"
import DateTime from "./DateTime"
import { convertFileSize, formatDateTime } from "@/lib/utils"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Image from "next/image"

export const FileDetails = ({file}:{file:Models.Document}) => {
  return (
    <div className="">
      <ImageThumbnail file={file}/>
      <div className="space-y-4 px-2 pt-2">
      <DetailInfo label="Format:" value={file.extension}/>
      <DetailInfo label="Size:" value={convertFileSize(file.size)}/>
      <DetailInfo label="Owner:" value={file.owner.fullName}/>
      <DetailInfo label="Last edit:" value={formatDateTime(file.$updatedAt)}/>
      </div>
    </div>
  )
}

//image thumbnail component
const ImageThumbnail =({file}:{file:Models.Document})=>(
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url}/>
        <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name}</p>
        <DateTime date={file.$createdAt} className="caption"/>
      </div>
    </div>
)


const DetailInfo =({label,value}:{label:string;value:string})=>(
    <div className="flex ">
        <p className="file-details-label text-left">{label}</p>
        <p className="file-details-value text-left">{value}</p>
    </div>
)


//share dropdown modal
interface Props{
  file:Models.Document;
  onInputChange:React.Dispatch<React.SetStateAction<string[]>>;
  onRemove:(email:string)=>void;
}
export const ShareDetails = ({file,onInputChange,onRemove}:Props) => {
return (
  <div>
    <ImageThumbnail file={file}/>
    <div className="share-wrapper">
      <p className="subtitle-2 pl-1 text-light-100">Share file with others</p>
      <Input
      type="email"
      placeholder="Enter email address"
      onChange={(e)=>onInputChange(e.target.value.trim().split(","))} //whenever someone write mutiple email separated by comma
      className="share-input-field"
      />
      <div className="pt-4">
        <div className="flex justify-between">
          <p className="subtitle-2 text-light-100">
            Share with
          </p>
          <p className="subtitle-2 text-light-200">
            {file.users.length} users
          </p>
        </div>

        <ul className="pt-2">
          {file.users.map((email:string)=>(
            <li key={email} className="flex justify-between gap-2 items-center">
              <p className="subtitle-2">{email}</p>
              <Button onClick={()=>onRemove(email)} className="share-remove-user">
                <Image
                src="/assets/icons/remove.svg"
                alt="Remove"
                width={24}
                height={24}
                className="remove-icon"
                />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)
}