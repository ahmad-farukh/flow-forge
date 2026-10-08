const PREFIX = "flowforge-local-v2";
const key = (tableId) => `${PREFIX}:${tableId}`;
const read = (tableId) => { try { return JSON.parse(localStorage.getItem(key(tableId)) || "[]"); } catch { return []; } };
const write = (tableId, rows) => localStorage.setItem(key(tableId), JSON.stringify(rows));
const parseQuery = (q) => {
  const equal = q?.match?.(/^equal\("([^"]+)",\[(.*?)\]\)$/);
  if (equal) return { type:"equal", field:equal[1], value:equal[2].replace(/^"|"$/g,"") };
  const order = q?.match?.(/^order(Asc|Desc)\("([^"]+)"\)$/);
  if (order) return { type:order[1] === "Asc" ? "asc":"desc", field:order[2] };
  const limit = q?.match?.(/^limit\((\d+)\)$/);
  if (limit) return { type:"limit", value:Number(limit[1]) };
  return null;
};
export const localDB = {
  list(tableId, queries=[]) {
    let rows = read(tableId);
    const parsed = queries.map(parseQuery).filter(Boolean);
    parsed.filter(x=>x.type==="equal").forEach(x => { rows = rows.filter(r => String(r[x.field] ?? "") === x.value); });
    const order = parsed.find(x=>x.type==="asc"||x.type==="desc");
    if (order) rows.sort((a,b) => { const av=a[order.field]??"", bv=b[order.field]??""; return order.type==="asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av)); });
    const limit = parsed.find(x=>x.type==="limit");
    if (limit) rows = rows.slice(0, limit.value);
    return { total: rows.length, rows };
  },
  get(tableId,rowId) { const row=read(tableId).find(r=>r.$id===rowId); if(!row) throw Object.assign(new Error("Row not found."),{code:404}); return row; },
  create(tableId,data,permissions=[]) { const now=new Date().toISOString(); const row={...data,$id:`local_${crypto.randomUUID?.()||Date.now()}`,$createdAt:now,$updatedAt:now,$permissions:permissions}; const rows=read(tableId); rows.unshift(row); write(tableId,rows); return row; },
  update(tableId,rowId,data) { const rows=read(tableId); const i=rows.findIndex(r=>r.$id===rowId); if(i<0) throw Object.assign(new Error("Row not found."),{code:404}); rows[i]={...rows[i],...data,$updatedAt:new Date().toISOString()}; write(tableId,rows); return rows[i]; },
  remove(tableId,rowId) { write(tableId,read(tableId).filter(r=>r.$id!==rowId)); return true; }
};
