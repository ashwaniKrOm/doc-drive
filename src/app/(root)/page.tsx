
import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import DateTime from "@/components/DateTime";
import Thumbnail from "@/components/Thumbnail";
import { getFiles, getFileSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageInfo } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

export default async function Home() {

  const [files,totalSpace]=await Promise.all([
    getFiles({types:[],limit:10}),
    getFileSpaceUsed()
  ])


  const usageInfo=getUsageInfo(totalSpace);
  // console.log("totalSpace:",totalSpace)

  return (
    <div className="dashboard-container">
      <section>
        <Chart usedSpace={totalSpace.used}/>

        {/* spaceUsed={totalSpace.used} totalSpace={totalSpace.all} */}
        <ul className="dashboard-summary-list">
         {usageInfo.map((info)=>(
        <Link href={info.url} key={info.url}
        className="dashboard-summary-card"
        >
          <div className="space-y-4">
            <div className="flex justify-between gap-3">
              <Image
              src={info.icon}
              alt={info.title}
              height={100}
              width={100}
              className="summary-type-icon"
              />
              <h4 className="summary-type-size">{convertFileSize(info.size) || 0}</h4>
            </div>
            <h5 className="summary-type-title">{info.title}</h5>
            <Separator className="bg-light-400" />
            <DateTime
            date={info.latestDate}
            className="text-center"
            />
          </div>
        </Link>
         ))}
        </ul>
      </section>

         {/* Recent file uploads */}
      <section className="dashboard-recent-files">
      <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
      {files.documents.length>0?(
         <ul className="mt-5 flex flex-col gap-5">
          {files.documents.map((file:Models.Document)=>(
            <Link
            href={file.url}
            target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
            >
              <Thumbnail
               type={file.type}
               extension={file.extension}
               url={file.url}
              />

        <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <DateTime
                    date={file.$createdAt}
                      className="caption"
                    />
                    </div>
                    <ActionDropdown file={file}/>
                    </div>
            </Link>
          ))}
         </ul>
      ):(<p className="empty-list">No files uploaded</p>)}
         </section>
    </div>
  );
}
