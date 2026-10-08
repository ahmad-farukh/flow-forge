import { Account, Client, Storage, TablesDB } from "appwrite";
import { APPWRITE } from "../../../services/appwrite/config";

const client = new Client();

client
  .setEndpoint(APPWRITE.endpoint)
  .setProject(APPWRITE.projectId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export default client;
