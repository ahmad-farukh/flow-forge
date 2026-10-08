import { useForm } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";
export default function InviteMember({ onInvite, busy=false }) {
  const { register, handleSubmit, reset } = useForm();
  return <form className="inline-form" onSubmit={handleSubmit(async (data) => { const ok = await onInvite(data); if (ok !== false) reset(); })}>
    <Input label="FlowForge User ID" placeholder="Paste user ID" {...register("userId", { required: "User ID is required" })}/>
    <Button type="submit" disabled={busy}>{busy ? "Adding…" : "Add member"}</Button>
  </form>;
}
