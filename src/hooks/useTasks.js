import { useEffect, useState } from "react";
import { APPWRITE } from "../services/appwrite/config";
import { Query, listRows } from "../services/appwrite/database";
export default function useTasks(projectId) {
  const [state, setState] = useState({ data: [], loading: Boolean(projectId), error: "" });
  useEffect(() => {
    if (!projectId) return;
    let alive = true;
    listRows(APPWRITE.tables.tasks, [Query.equal("projectId", projectId), Query.orderAsc("position"), Query.limit(100)])
      .then((r) => alive && setState({ data: r.rows || [], loading: false, error: "" }))
      .catch((e) => alive && setState({ data: [], loading: false, error: e.message }));
    return () => { alive = false; };
  }, [projectId]);
  return { ...state, setData: (updater) => setState((current) => ({ ...current, data: typeof updater === "function" ? updater(current.data) : updater })) };
}
