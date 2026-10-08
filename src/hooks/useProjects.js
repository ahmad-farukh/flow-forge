import { useEffect, useState } from "react";
import { APPWRITE } from "../services/appwrite/config";
import { Query, listRows } from "../services/appwrite/database";
export default function useProjects(userId) {
  const [state, setState] = useState({ data: [], loading: Boolean(userId), error: "" });
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    setState({ data: [], loading: true, error: "" });
    listRows(APPWRITE.tables.projects, [Query.equal("ownerId", userId), Query.orderDesc("$createdAt"), Query.limit(50)])
      .then((r) => alive && setState({ data: r.rows || [], loading: false, error: "" }))
      .catch((e) => alive && setState({ data: [], loading: false, error: e.message }));
    return () => { alive = false; };
  }, [userId]);
  return state;
}
