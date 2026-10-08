import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import FileUploader from "../files/FileUploader";
import { PROJECT_STATUS } from "../../constants/projectStatus";

export default function ProjectForm({ initial = {}, onSubmit, onCancel }) {
  const [documentFile, setDocumentFile] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initial.name || "", description: initial.description || "", status: initial.status || PROJECT_STATUS.planning,
      priority: initial.priority || "medium", startDate: initial.startDate?.slice(0, 10) || "", dueDate: initial.dueDate?.slice(0, 10) || "",
      color: initial.color || "#dc2626", coverImage: initial.coverImage || "", progress: initial.progress ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, documentFile }))} className="form-grid">
      <Input label="Project name" {...register("name", { required: "Name is required" })} error={errors.name?.message} />
      <Select label="Status" {...register("status")}><option value={PROJECT_STATUS.planning}>Planning</option><option value={PROJECT_STATUS.active}>Active</option><option value={PROJECT_STATUS.on_hold}>On hold</option><option value={PROJECT_STATUS.completed}>Completed</option></Select>
      <Select label="Priority" {...register("priority")}><option>low</option><option>medium</option><option>high</option></Select>
      <Input label="Start date" type="date" {...register("startDate")} />
      <Input label="Due date" type="date" {...register("dueDate")} />
      <Input label="Color" type="color" {...register("color")} />
      <Input label="Cover image URL" {...register("coverImage")} />
      <label className="field full-span"><span>Description</span><textarea className="input textarea" {...register("description")} /></label>
      <div className="field full-span project-document-picker">
        <span>Project document</span>
        <p className="muted">Select a PDF, Word document, image, spreadsheet, text file or ZIP from your computer.</p>
        <FileUploader label="Choose project file" onFile={setDocumentFile} />
      </div>
      <div className="modal-actions full-span"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit">{initial.$id ? "Save changes" : "Create project"}</Button></div>
    </form>
  );
}
