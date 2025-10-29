let idCounter = 1;
function nextId() {
  return `n_${idCounter++}`;
}
function makePath(parent, key) {
  if (parent === "$") return typeof key === "number" ? `$[${key}]` : `$.${key}`;
  return typeof key === "number" ? `${parent}[${key}]` : `${parent}.${key}`;
}

export function jsonToFlow(json) {
  idCounter = 1;
  const nodes = [];
  const edges = [];

  function walk(value, key, parentId, depth, index, parentPath) {
    const id = nextId();
    const path = parentPath === null ? "$" : makePath(parentPath, key);
    let type = "primitive";
    if (Array.isArray(value)) type = "array";
    else if (value !== null && typeof value === "object") type = "object";

    const label = key === null ? "root" : String(key);

    nodes.push({
      id,
      data: { label, path, raw: value },
      position: { x: depth * 220, y: index * 90 + depth * 10 },
      draggable: false,
      className: type,
    });

    if (parentId)
      edges.push({ id: `e_${parentId}_${id}`, source: parentId, target: id });

    if (type === "object") {
      Object.keys(value).forEach((k, i) => walk(value[k], k, id, depth + 1, i, path));
    } else if (type === "array") {
      value.forEach((it, i) => walk(it, i, id, depth + 1, i, path));
    }
  }

  walk(json, null, null, 0, 0, null);
  return { nodes, edges };
}

export function buildHierarchy(json) {
  function nodeFor(value, key, parentPath) {
    const path = parentPath === null ? "$" : makePath(parentPath, key);
    const item = { key: key === null ? "root" : String(key), path, children: [], raw: value };
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v, i) => item.children.push(nodeFor(v, i, path)));
      } else {
        Object.entries(value).forEach(([k, v]) => item.children.push(nodeFor(v, k, path)));
      }
    }
    return item;
  }
  return nodeFor(json, null, null);
}

export function findNodeByPath(nodes, query) {
  if (!query) return null;
  let q = query.trim();
  if (q.startsWith("$")) q = q;
  else if (q.startsWith(".")) q = `$${q}`;
  else q = `$.${q}`;
  return nodes.find((n) => n.data && n.data.path === q) || null;
}
