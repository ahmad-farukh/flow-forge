import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { APPWRITE } from "../services/appwrite/config";
import { Query, listRows } from "../services/appwrite/database";
import ProjectHeader from "../components/projects/ProjectHeader";

const colors = ["#4f46e5", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"];
export default function Analytics() {
  const user = useSelector((s) => s.auth.user);
  const [projects, setProjects] = useState([]), [tasks, setTasks] = useState([]), [events, setEvents] = useState([]);
  useEffect(() => {
    if (!user) return;
    Promise.all([
      listRows(APPWRITE.tables.projects, [Query.equal("ownerId", user.$id), Query.limit(200)]),
      listRows(APPWRITE.tables.tasks, [Query.limit(500)]),
      listRows(APPWRITE.tables.calendar, [Query.equal("userId", user.$id), Query.limit(200)]),
    ]).then(([p,t,e]) => { setProjects(p.rows || []); setTasks(t.rows || []); setEvents(e.rows || []); }).catch(() => {});
  }, [user?.$id]);
  const status = useMemo(() => {
    const labels = ["todo", "in_progress", "review", "done"];
    return labels.map((label) => ({ label, value: tasks.filter((t) => t.status === label).length }));
  }, [tasks]);
  const total = Math.max(tasks.length, 1);
  let acc = 0;
  const stops = status.map((item, i) => { const start = acc; acc += (item.value / total) * 100; return `${colors[i]} ${start}% ${acc}%`; }).join(", ");
  const completed = tasks.filter((t) => t.status === "done" || t.status === "completed").length;
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && !["done","completed"].includes(t.status)).length;
  return <>
    <ProjectHeader title="Analytics" subtitle="A clear view of delivery, workload and project health." />
    <div className="analytics-grid">
      <section className="panel analytics-chart"><div className="panel-head"><div><h2>Task distribution</h2><small>Current workspace workload</small></div></div><div className="pie-wrap"><div className="pie" style={{ background: `conic-gradient(${stops || "#334155 0 100%"})` }}><div className="pie-hole">{tasks.length}<span>tasks</span></div></div><div className="legend">{status.map((x,i)=><div key={x.label}><i style={{background:colors[i]}} /> <span>{x.label.replace("_"," ")}</span><b>{x.value}</b></div>)}</div></div></section>
      <section className="analytics-kpis"><div className="stat-card"><div><small>Projects</small><strong>{projects.length}</strong><span>active workspace projects</span></div></div><div className="stat-card"><div><small>Completed</small><strong>{completed}</strong><span>finished tasks</span></div></div><div className="stat-card"><div><small>Overdue</small><strong>{overdue}</strong><span>needs attention</span></div></div><div className="stat-card"><div><small>Events</small><strong>{events.length}</strong><span>calendar entries</span></div></div></section>
    </div>
    <section className="panel mt"><div className="panel-head"><div><h2>Project health</h2><small>Progress across your projects</small></div></div><div className="analytics-projects">{projects.length ? projects.map((p)=><div className="analytics-project" key={p.$id}><div><b>{p.name}</b><span>{p.status}</span></div><div className="progress"><i style={{width:`${Math.max(0,Math.min(100,Number(p.progress)||0))}%`}} /></div><strong>{Number(p.progress)||0}%</strong></div>) : <div className="empty">Create a project to see analytics.</div>}</div></section>
  </>;
}
