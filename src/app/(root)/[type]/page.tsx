import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";

declare type FileType = "document" | "image" | "video" | "audio" | "other";

interface ParamProps{
    params:Promise<{type:string}>;
    searchParams:Promise<{[key:string]:string | string[]}>
}

const Page = async ({searchParams,params}:ParamProps)=>{

    const type = (await params)?.type || "";
    const searchText = ((await searchParams)?.query) as string || '';
    const sort = ((await searchParams)?.sort) as string || '';

    const types = getFileTypesParams(type) as FileType[];
    // console.log("Types: ",types);

    //fetch files from db
    const files = await getFiles({types,searchText,sort});
    // console.log(typeof files.documents[0]);
    const totalSize = (files.documents).reduce((sum:any,obj:any)=> sum+obj.size,0)
    // console.log(totalSize)
    return (
        <div className="page-container">
            <section className="w-full">
                <h1 className="h1 capitalize">{type}</h1>

                <div className="total-size-section">
                    <p className="body-1">
                        Total:
                        <span className="h5"> {convertFileSize(totalSize)}</span>
                    </p>

                    <div className="sort-container">
                        <p className="body-1 hidden sm:block">
                        Sort By: 
                        </p>
                        <Sort/>
                    </div>
                </div>
            </section>

            {/* Rendering fetched files */}
            {files.total > 0 ? (
                <section className="file-list">
                    {(files.documents).map((file:Models.Document)=>(
                        <Card key={file.$id} file={file}/>
                    ))}
                </section>
            ):
            (<p>No files uploaded</p>)}
            
        </div>
    )
}

export default Page;