import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { APPWRITE } from "../services/appwrite/config";
import { getRow, Query, listRows, updateRow, createRow, Permission, Role } from "../services/appwrite/database";
import { uploadProjectFile, listProjectFiles } from "../services/appwrite/files";
import ProjectHeader from "../components/projects/ProjectHeader";
import ProjectTabs from "../components/projects/ProjectTabs";
import ProjectProgress from "../components/projects/ProjectProgress";
import ProjectInfo from "../components/projects/ProjectInfo";
import ProjectMembers from "../components/projects/ProjectMembers";
import TaskBoard from "../components/tasks/TaskBoard";
import Button from "../components/common/Button";
import FileUploader from "../components/files/FileUploader";
import FileList from "../components/files/FileList";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import useTasks from "../hooks/useTasks";

export default function ProjectDetails() {
  const { id } = useParams(), nav = useNavigate(), { user, profile } = useSelector((s) => s.auth);
  const [project,setProject]=useState(null),[members,setMembers]=useState([]),[comments,setComments]=useState([]),[files,setFiles]=useState([]),[tab,setTab]=useState("overview"),[error,setError]=useState("");
  const tasks=useTasks(id);
  useEffect(() => {
    getRow(APPWRITE.tables.projects,id).then(setProject).catch(()=>nav("/projects"));
    listRows(APPWRITE.tables.members,[Query.equal("projectId",id),Query.limit(50)]).then(r=>setMembers(r.rows||[])).catch(()=>{});
    listRows(APPWRITE.tables.comments,[Query.equal("projectId",id),Query.orderAsc("$createdAt"),Query.limit(100)]).then(r=>setComments(r.rows||[])).catch(()=>{});
    listProjectFiles(id).then(setFiles).catch((e) => setError(e.message || "Could not load project files."));
  },[id,nav]);
  if(!project)return <div className="loading-page">Loading project…</div>;
  const drop=async(e,status)=>{const taskId=e.dataTransfer.getData("taskId");if(!taskId)return;try{const row=await updateRow(APPWRITE.tables.tasks,taskId,{status});tasks.setData?.((x)=>x.map(t=>t.$id===taskId?row:t));}catch(e){setError(e.message)}};
  const upload=async(file)=>{try{setError("");const f=await uploadProjectFile(file,id,user.$id);setFiles((x)=>[f,...x]);}catch(e){setError(e.message||"Upload failed.")}};
  const addComment=async(data)=>{try{const c=await createRow(APPWRITE.tables.comments,{taskId:"",projectId:id,userId:user.$id,content:data.content,parentId:""},[Permission.read(Role.user(user.$id)),Permission.update(Role.user(user.$id)),Permission.delete(Role.user(user.$id))]);setComments(x=>[...x,c]);}catch(e){setError(e.message||"Comment could not be added.")}};
  return <>
    {error&&<div className="alert error-alert">{error}</div>}
    <ProjectHeader title={project.name} subtitle={project.description||"Project workspace"}><Button variant="ghost" onClick={()=>nav("/projects")}>← Back</Button></ProjectHeader>
    <ProjectTabs active={tab} onChange={setTab}/>
    {tab==="overview"&&<div className="detail-grid"><div className="panel"><h3>Progress</h3><ProjectProgress value={project.progress}/><h3 className="mt">Project info</h3><ProjectInfo project={project}/></div><div className="panel"><h3>Team</h3><ProjectMembers members={members}/><h3 className="mt">Recent tasks</h3>{tasks.data.slice(0,5).map(t=><div className="list-row" key={t.$id}><b>{t.title}</b><span>{t.status}</span></div>)}</div></div>}
    {tab==="tasks"&&<TaskBoard tasks={tasks.data} onDrop={drop}/>} 
    {tab==="members"&&<div className="panel"><ProjectMembers members={members}/><p className="muted">Workspace members can be added from Team using their FlowForge User ID.</p></div>}
    {tab==="files"&&<div className="panel"><div className="panel-head"><div><h3>Project files</h3><small>Upload briefs, designs, documents and other project assets.</small></div><FileUploader onFile={upload}/></div><FileList files={files}/></div>}
    {tab==="comments"&&<div className="panel"><div className="panel-head"><div><h3>Project comments</h3><small>Keep project-level decisions and notes in one place.</small></div></div><CommentForm onSubmit={addComment}/><CommentList comments={comments}/></div>}
  </>;
}
