import { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { APPWRITE } from "../services/appwrite/config";
import { Query,listRows,createRow,deleteRow } from "../services/appwrite/database";
import CalendarWidget from "../components/calendar/Calendar";
import ProjectHeader from "../components/projects/ProjectHeader";
import EventForm from "../components/calendar/EventForm";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

export default function CalendarPage(){
 const {user}=useSelector(s=>s.auth); const [events,setEvents]=useState([]),[open,setOpen]=useState(false),[error,setError]=useState("");
 const load=()=>{if(user)listRows(APPWRITE.tables.calendar,[Query.equal("userId",user.$id),Query.orderAsc("startDate"),Query.limit(200)]).then(r=>setEvents(r.rows||[])).catch(e=>setError(e.message));};
 useEffect(load,[user?.$id]);
 const add=async(data)=>{try{const row=await createRow(APPWRITE.tables.calendar,{userId:user.$id,projectId:"",taskId:"",title:data.title,description:data.description||"",startDate:new Date(data.startDate).toISOString(),endDate:new Date(data.endDate).toISOString(),eventType:"custom",color:data.color||"#4f46e5"});setEvents(x=>[...x,row]);setOpen(false);}catch(e){setError(e.message)}};
 const remove=async(id)=>{try{await deleteRow(APPWRITE.tables.calendar,id);setEvents(x=>x.filter(e=>e.$id!==id));}catch(e){setError(e.message)}};
 return <><ProjectHeader title="Calendar" subtitle="Plan deadlines, meetings and important events."><Button onClick={()=>setOpen(true)}>＋ New event</Button></ProjectHeader>{error&&<div className="alert error-alert">{error}</div>}<CalendarWidget events={events}/><section className="panel mt"><div className="panel-head"><div><h3>Upcoming events</h3><small>{events.length} saved events</small></div></div>{events.length?events.map(e=><div className="list-row" key={e.$id}><div><b>{e.title}</b><small className="muted">{new Date(e.startDate).toLocaleString()}</small></div><Button variant="ghost" onClick={()=>remove(e.$id)}>Delete</Button></div>):<div className="empty">No events yet. Add your first event.</div>}</section><Modal open={open} title="Create calendar event" onClose={()=>setOpen(false)}><EventForm onSubmit={add}/></Modal></>;
}
