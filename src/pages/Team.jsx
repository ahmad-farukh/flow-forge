import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { APPWRITE } from "../services/appwrite/config";
import { Query, listRows, createRow, Permission, Role } from "../services/appwrite/database";
import TeamWidget from "../components/team/Team";
import InviteMember from "../components/team/InviteMember";
import ProjectHeader from "../components/projects/ProjectHeader";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

export default function TeamPage() {
  const { user, profile } = useSelector((s) => s.auth);
  const [members, setMembers] = useState([]), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const load = async () => {
    if (!user) return;
    try {
      const r = await listRows(APPWRITE.tables.members, [Query.equal("projectId", "workspace"), Query.limit(100)]);
      const own = { $id: `self-${user.$id}`, userId: user.$id, name: profile?.name || user.name, email: user.email, role: "owner" };
      const unique = new Map([...[own], ...(r.rows || [])].map((x) => [x.userId, x]));
      setMembers([...unique.values()]);
    } catch (e) { setError(e.message || "Unable to load team."); }
  };
  useEffect(() => { load(); }, [user?.$id, profile?.name]);
  const invite = async ({ userId }) => {
    if (!user || !userId) return false;
    setError(""); setBusy(true);
    try {
      const cleanId = userId.trim();
      if (cleanId === user.$id) throw new Error("You are already the workspace owner.");
      const found = await listRows(APPWRITE.tables.profiles, [Query.equal("userId", cleanId), Query.limit(1)]);
      const target = found.rows?.[0];
      if (!target) throw new Error("No FlowForge user was found with this User ID. Ask them to copy the ID shown in their profile/team card.");
      if (members.some((m) => m.userId === cleanId)) throw new Error("This user is already in your team.");
      const row = await createRow(APPWRITE.tables.members, { projectId: "workspace", userId: cleanId, role: "member", joinedAt: new Date().toISOString() }, [Permission.read(Role.user(user.$id)), Permission.update(Role.user(user.$id)), Permission.delete(Role.user(user.$id))]);
      setMembers((x) => [...x, { ...row, name: target.name, email: target.email }]);
      return true;
    } catch (e) { setError(e.message || "Unable to add member."); return false; }
    finally { setBusy(false); }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(user.$id); setError("User ID copied."); setTimeout(() => setError(""), 1800); } catch {} };
  return <>
    <ProjectHeader title="Team" subtitle="Invite collaborators using a unique FlowForge User ID." />
    <div className="panel team-id-card"><div><span className="muted">Your FlowForge User ID</span><strong>{user?.$id}</strong><small>Share this ID with a teammate. They can enter it below to add you.</small></div><Button variant="ghost" onClick={copy}>Copy ID</Button></div>
    <div className="panel team-invite"><div><h3>Add collaborator</h3><p className="muted">Enter the exact FlowForge User ID shown on the other user's account.</p></div><InviteMember onInvite={invite} busy={busy}/></div>
    {error && <div className={`alert ${error.includes("copied") ? "success-alert" : "error-alert"}`}>{error}</div>}
    {members.length ? <TeamWidget members={members}/> : <EmptyState title="No team members yet" text="Invite your first collaborator above."/>}
  </>;
}
