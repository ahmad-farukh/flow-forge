import { ID } from "appwrite";
import { account } from "../../components/service/appwrite/conf";
import { APPWRITE } from "./config";
import { createRow,listRows,Query,updateRow,userRowPermissions } from "./database";
import { localDB } from "./localStore";
const profileKey=(id)=>`flowforge-profile:${id}`;
export const authService={
 async register({name,email,password}){const user=await account.create({userId:ID.unique(),email:email.trim().toLowerCase(),password,name:name.trim()});await account.createEmailPasswordSession({email:email.trim().toLowerCase(),password});await this.ensureProfile(user);return user;},
 login:({email,password})=>account.createEmailPasswordSession({email:email.trim().toLowerCase(),password}),
 logout:()=>account.deleteSession({sessionId:"current"}), currentUser:()=>account.get(),
 async ensureProfile(user){if(!user?.$id)return null;try{const r=await listRows(APPWRITE.tables.profiles,[Query.equal("userId",user.$id),Query.limit(1)]);if(r.rows?.length){localStorage.setItem(profileKey(user.$id),JSON.stringify(r.rows[0]));return r.rows[0];}const row=await createRow(APPWRITE.tables.profiles,{userId:user.$id,name:user.name||"",email:user.email||"",bio:"",jobTitle:"Member",phone:"",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC",theme:"dark"},userRowPermissions(user.$id));localStorage.setItem(profileKey(user.$id),JSON.stringify(row));return row;}catch(e){const row=localDB.create(APPWRITE.tables.profiles,{userId:user.$id,name:user.name||"",email:user.email||"",bio:"",jobTitle:"Member",phone:"",timezone:"UTC",theme:"dark"});localStorage.setItem(profileKey(user.$id),JSON.stringify(row));return row;}},
 async profile(userId){if(!userId)return null;try{const r=await listRows(APPWRITE.tables.profiles,[Query.equal("userId",userId),Query.limit(1)]);if(r.rows?.[0]){localStorage.setItem(profileKey(userId),JSON.stringify(r.rows[0]));return r.rows[0];}}catch{} try{return JSON.parse(localStorage.getItem(profileKey(userId))||"null");}catch{return null;}},
 async updateProfile(rowId,data){const row=await updateRow(APPWRITE.tables.profiles,rowId,data);if(row?.userId)localStorage.setItem(profileKey(row.userId),JSON.stringify(row));return row;}
};
