"use server"

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { cookies } from "next/headers";

// Create Account flow:---

// 1. user enter full name and email 
// 2. check if user already exists using email 
// 3. send OTP to users email 
// 4. This will send a secret key for creating a session 
// 5. craete a new user document if the user is a new user 
// 6. return the user's accountId that will be used to complete login 
// 7. verify otp and authenticate to login



export const getUserByEmail = async (email:string)=>{
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", [email])]
    );
  
    return result.total > 0 ? result.documents[0] : null;
}
/*
Purpose: This is used in multiple places to check if a user with the provided email already exists in the database.
Returns: The user document if found, or null if the user doesn’t exist.
*/


const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
  };
/*
Purpose: Centralized error logging and throwing so you don't have to repeat error handling logic.
*/  


export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    /*
    createAdminClient likely initializes the connection to Appwrite and retrieves various services, including account, which is used to manage user accounts.
    */
  
    try {
      const session = await account.createEmailToken(ID.unique(), email);
      return session.userId;
      /*
      account.createEmailToken(ID.unique(), email) is called to send an email verification token to the specified email address.
        ID.unique() generates a unique identifier for the token.
        email is the recipient’s email address.
        What this does: Appwrite sends a one-time email to the user with a verification link or code.
        Result: The response (session) contains information about the OTP session, including userId, which is the ID associated with the OTP session.
        Return Statement: The function returns session.userId to let other parts of the app know which user ID the OTP was sent to.
      */
    } catch (error) {
      handleError(error, "Failed to send email OTP");
    }
  };


export const createAccount = async ({fullName,email}:{fullName:string; email:string})=>{
    
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");

    if(!existingUser)
      {
        const {databases} = await createAdminClient();
        // console.log(databases)

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar:"",
                accountId,
            }
        )
        return { status: "new_user_created", fullName, email, accountId };
      } else {
        return { status: "user_already_exists", fullName: existingUser.fullName, email: existingUser.email, accountId: existingUser.accountId };
      }

}

export const verifySecret = async ({accountId,password}:{
  accountId:string,
  password:string
}) =>{

  try {
    const { account } = await createAdminClient();  // access to the account service of the backend  
    const session = await account.createSession(accountId,password);  //account.createSession(accountId, password) creates a session for the user based on the provided accountId and password, returning a session object if the credentials are valid.
    

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return JSON.parse(JSON.stringify({ sessionId: session.$id }));
    
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
}