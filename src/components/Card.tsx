import Link from "next/link"
import { Models } from "node-appwrite"
import Thumbnail from "./Thumbnail"
import { convertFileSize } from "@/lib/utils"
import DateTime from "./DateTime"
import ActionDropdown from "./ActionDropdown"

interface CardProps{
  file:Models.Document;
}

const Card:React.FC<CardProps> = ({file}) => {
  return (
    <div className="file-card">
      
      <div className="flex justify-between">
      <Link href={file.url} target="_blank">
      <Thumbnail
       type={file.type}
       url={file.url}
        extension={file.extension}
          className="size-20"
           imageClassName="size-11"/>
        </Link>
           <div className="flex flex-col items-end justify-between gap-3">
            <ActionDropdown file={file}/>

            <p className="body-1">{convertFileSize(file.size)}
            </p>
           </div>

      </div>
      <div className="file-card-details">
                <p className="subtitle-2 truncate">{file.name}</p>
                <DateTime
                date={file.$createdAt}
                className="body-2 text-light-100"
                />
                <p className="caption line-clamp-1 text-light-200">By: {file.owner.fullName}</p>
            </div>
      
    </div>
  )
}

export default Card
