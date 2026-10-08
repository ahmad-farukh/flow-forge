import { useSelector } from "react-redux";
import Button from "../common/Button";
export default function AccountSettings(){
 const user=useSelector(s=>s.auth.user);
 const copy=async()=>{try{await navigator.clipboard.writeText(user?.$id||"")}catch{}};
 return <div className="panel"><h2>Account</h2><p className="muted">Your FlowForge identity is connected to Appwrite Authentication.</p><div className="info-list"><div><span>User ID</span><b className="break-id">{user?.$id||"—"}</b></div><div><span>Email</span><b>{user?.email||"—"}</b></div><div><span>Email verified</span><b>{user?.emailVerification?"Yes":"Not verified"}</b></div></div><Button variant="ghost" onClick={copy}>Copy User ID</Button></div>
}
