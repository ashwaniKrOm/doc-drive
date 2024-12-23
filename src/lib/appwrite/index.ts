"use server"

import { Account, Avatars, Client, Databases,Storage } from "node-appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers";

export const createSessionClient = async ()=>{
    const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

      // Await the cookies() function as it returns a Promise
  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");
//   console.log("Session Cookie:", session);

    if(!session || !session.value){ 
        return null;
    }

    client.setSession(session.value);

    return {
        get account(){
            return new Account(client);
        },
        get databases(){
            return new Databases(client);
        }
    }
}

export const createAdminClient = async ()=>{
    const client=new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

    return {
        get account(){
            return new Account(client);
        },
        get databases(){
            return new Databases(client);
        },
        get storage(){
            return new Storage(client);
        },
        get avatar(){
            return new Avatars(client);
        }
    }
}