"use server"
import { createAdminClient, createSessionClient } from "../appwrite";
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

interface UploadFileProps{
    file:File;
    ownerId:string;
    accountId:string;
    path:string;
}
export const uploadFile = async ({file,ownerId,accountId,path}:UploadFileProps)=>{
    // console.log("file",file)


try {

    //get db access
const {storage,databases} = await createAdminClient();


    //read the file that has to be uploaded
    //convert the browser `File` object into a buffer
    const arrayBuffer=await file.arrayBuffer();
    const buffer=Buffer.from(arrayBuffer);

    // Create an InputFile instance
    const inputFile =InputFile.fromBuffer(buffer,file.name);

    //specify a bucket where we will store the inputFile
    // console.log("Creating file in Appwrite bucket...");
    
            const bucketFile = await storage.createFile(
                appwriteConfig.bucketId,
                ID.unique(),
                inputFile,
              )
            //   console.log("File created in bucket:", bucketFile);
       
   
   
    

    //file document information(metadata)
    const fileDocument ={
        type:getFileType(bucketFile.name).type,
        name:bucketFile.name,
        url:constructFileUrl(bucketFile.$id),
        extension:getFileType(bucketFile.name).extension,
        size:bucketFile.sizeOriginal,
        owner:ownerId,
        accountId,
        users:[],
        bucketFileId:bucketFile.$id,
    }
    // console.log("fileDocument:",fileDocument)

    //to store file itself we use storage.createFile but for storing metadata of file we use appwrite db functionality
    const newFile = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
    ).catch(async(error:unknown)=>{
        await storage.deleteFile(appwriteConfig.bucketId,bucketFile.$id);
        handleError(error,"Failed to create file Document")
    });
    // console.log("newFile",newFile);

    revalidatePath(path)
    return JSON.parse(JSON.stringify(newFile));
    
} catch (error) {
    handleError(error,"error in uploading file")
}
}



const createQueries = (currentUser:Models.Document,types:FileType[],searchText:string,sort:string,limit?:number)=>{
    // console.log("TYPES CQ",types)
    const queries = [
        Query.or([
            Query.equal('owner',[currentUser.$id]),
            Query.contains("users",[currentUser.email])
        ])
    ]

    if(types.length!==0){
        queries.push(Query.equal("type",types));
    }
    if(searchText){
        queries.push(Query.contains("name",searchText));
    }
    if(limit){
        queries.push(Query.limit(limit));
    }
    
    //sort: $createdAt-desc
    const [sortBy,orderBy]=sort.split("-");
    queries.push(orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy))

    return queries;
}


declare type FileType = "document" | "image" | "video" | "audio" | "other";
// interface GetFileProps{
//     types: FileType[];
//     searchText?: string;
//     sort?: string;  
//     limit?: number;
// }
export const getFiles = async ({types=[],searchText="",sort="$createdAt-desc",limit}:{types?:FileType[];searchText?:string;sort?:string;limit?:number}) => {
    // console.log("TYPES getFiles",types)
    try {
        const {databases}=await createAdminClient();
        // console.log("db getFiles(): ",databases)

         const currentUser = await getCurrentUser();
         if(!currentUser) throw new Error("User not found");

        const queries = createQueries(currentUser,types, searchText, sort, limit);

        const files = await  databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries,
        );

        return JSON.parse(JSON.stringify(files));
        
    } catch (error) {
        handleError(error,"Error in getting file");
    }
}


interface RenameFileProps {
    fileId: string;
  name: string;
  extension: string;
  path: string;
}
export const fileRename=async ({fileId,name,extension,path}:RenameFileProps)=>{
    const {databases}=await createAdminClient();

    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name:newName,

            }
        )
        revalidatePath(path);
        return JSON.parse(JSON.stringify(updatedFile));
    } catch (error) {
        handleError(error,"Error in renaming  file");
    }
}



interface UpdateFileProps {
    fileId: string;
  emails: string[];
  path: string;
}
export const fileUpdate=async ({fileId,emails,path}:UpdateFileProps)=>{
    const {databases}=await createAdminClient();

    try {
        
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
               users:emails,

            },
        )
        revalidatePath(path);
        return JSON.parse(JSON.stringify(updatedFile));
    } catch (error) {
        handleError(error,"Error in renaming  file");
    }
}





interface DeleteFileProps {
    fileId: string;
    bucketFileId: string;
  path: string;
}
export const fileDelete=async ({fileId,bucketFileId,path}:DeleteFileProps)=>{
    const {databases,storage}=await createAdminClient();

    try {
        
        const deletedFile = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
        )

        if(deletedFile){
            await storage.deleteFile(
                appwriteConfig.bucketId,
                bucketFileId,
            )
        }

        revalidatePath(path);
        return JSON.parse(JSON.stringify({status:"deleted successfully"}));
    } catch (error) {
        handleError(error,"Error in renaming  file");
    }
}


export const getFileSpaceUsed= async ()=>{
    try {
        const {databases}=await createSessionClient();
        const currentUser = await getCurrentUser();
        if(!currentUser) throw new Error("User is not authenticated");

        const files=await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            [Query.equal("owner",[currentUser.$id])],
        )

        const totalSpace = {
            image:{size:0,lastDate:''},
            document:{size:0,lastDate:''},
            audio:{size:0,lastDate:''},
            video:{size:0,lastDate:''},
            other:{size:0,lastDate:''},
            used:0,
            all:2*1024*1024*1024  //2GB avaialble
        }

         // Iterate over each file and calculate sizes
         files.documents.forEach((file) => {
            //declare type FileType = "document" | "image" | "video" | "audio" | "other";
            const fileType = file.type as FileType;
            totalSpace[fileType].size += file.size;
            totalSpace.used += file.size;

            // Update the latest modification date if newer
            if (
                !totalSpace[fileType].lastDate ||
                new Date(file.$updatedAt) > new Date(totalSpace[fileType].lastDate)
            ) {
                totalSpace[fileType].lastDate = file.$updatedAt;
            }
        });

        return JSON.parse(JSON.stringify(totalSpace));

    } catch (error) {
        
    }
}


const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
  };