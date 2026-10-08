import { ID, Permission, Query, Role } from "appwrite";
import { tablesDB } from "../../components/service/appwrite/conf";
import { APPWRITE } from "./config";
import { localDB } from "./localStore";

const fallback = (error) => Number(error?.code) === 401 || Number(error?.code) === 403 || Number(error?.code) === 404;
const localMode = () => APPWRITE.dataMode !== "appwrite";
function assertTableId(tableId){ if(!tableId) throw new Error("Appwrite table ID is missing from .env."); }
function base(tableId){ assertTableId(tableId); return {databaseId:APPWRITE.databaseId,tableId}; }
export async function listRows(tableId,queries=[],options={}){ const safe=Array.isArray(queries)?queries.filter(Boolean):[]; if(localMode()) return localDB.list(tableId,safe); try{return await tablesDB.listRows({...base(tableId),queries:safe,total:options.total??false});}catch(e){if(fallback(e)) return localDB.list(tableId,safe); throw e;} }
export async function getRow(tableId,rowId){if(!rowId)throw new Error("A row ID is required.");if(localMode())return localDB.get(tableId,rowId);try{return await tablesDB.getRow({...base(tableId),rowId});}catch(e){if(fallback(e))return localDB.get(tableId,rowId);throw e;}}
export async function createRow(tableId,data,permissions){if(localMode())return localDB.create(tableId,data,permissions);try{return await tablesDB.createRow({...base(tableId),rowId:ID.unique(),data,...(permissions?.length?{permissions}: {})});}catch(e){if(fallback(e))return localDB.create(tableId,data,permissions);throw e;}}
export async function updateRow(tableId,rowId,data){if(!rowId)throw new Error("A row ID is required.");if(localMode())return localDB.update(tableId,rowId,data);try{return await tablesDB.updateRow({...base(tableId),rowId,data});}catch(e){if(fallback(e))return localDB.update(tableId,rowId,data);throw e;}}
export async function deleteRow(tableId,rowId){if(!rowId)throw new Error("A row ID is required.");if(localMode())return localDB.remove(tableId,rowId);try{return await tablesDB.deleteRow({...base(tableId),rowId});}catch(e){if(fallback(e))return localDB.remove(tableId,rowId);throw e;}}
export function userRowPermissions(userId){return userId?[Permission.read(Role.user(userId)),Permission.update(Role.user(userId)),Permission.delete(Role.user(userId))]:[];}
export { Query, Permission, Role };
