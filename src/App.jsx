import React, { useState, useEffect, useRef } from "react";
import TreeVisualizer from "./components/TreeVisualizer";
import { jsonToFlow, buildHierarchy, findNodeByPath } from "./utils/parser";

const SAMPLE = `{
  "user": {
    "id": 1,
    "name": "Tarun chowdam",
    "address": {
      "near-city": "Tadipatri",
      "District": "kadapa"
    },
    "details": [
      {"mobile":"********"},
      {"village":"Datthapuram"},n
      {"college":"RGUKT"}
    ]
  }
}`;

export default function App() {
  const [jsonText, setJsonText] = useState(SAMPLE);
  const [flow, setFlow] = useState({ nodes: [], edges: [] });
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(false);
  const treeRef = useRef(null);

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  const generate = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const f = jsonToFlow(parsed);
      buildHierarchy(parsed);
      setFlow({ nodes: f.nodes, edges: f.edges });
      setMessage(`✅ Tree generated — ${f.nodes.length} nodes`);
    } catch (e) {
      setFlow({ nodes: [], edges: [] });
      setMessage("❌ Invalid JSON");
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setMessage("Enter a path like $.user.address.city");
      return;
    }

    let q = query.trim();
    if (!q.startsWith("$")) q = q.startsWith(".") ? `$${q}` : `$.${q}`;

    // clear previous temporary node
    treeRef.current?.clearTemporaryNode();

    const found = findNodeByPath(flow.nodes, q);
    if (!found) {
      setMessage("❌ No match found");
      return;
    }

    const value = found.data.raw;
    const displayValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    const tempNode = {
      id: "temp_node",
      data: { label: `${displayValue}` },
    };

    treeRef.current?.addTemporaryNode(found.id, tempNode);
    treeRef.current?.focusNode(found);

    setMessage(`✅ Found ${found.data.path}`);
  };

  const clearAll = () => {
    setJsonText("");
    setFlow({ nodes: [], edges: [] });
    setMessage("Cleared all");
  };

  return (
    <div className="container">
      <div className="left card">
        <div className="title">🧩 JSON Tree Visualizer</div>
        <textarea
          className="json-input"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />

        <div className="controls">
          <button className="btn" onClick={generate}>Generate Tree</button>
          <button className="btn secondary" onClick={clearAll}>Clear</button>
          <div style={{ marginLeft: "auto" }} className="toggle">
            <label className="muted">Dark/Light</label>
            <input
              type="checkbox"
              checked={dark}
              onChange={(e) => setDark(e.target.checked)}
            />
          </div>
        </div>

        <div className="search-row">
          <input
            className="search-input"
            placeholder="$.user.address.city"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(e.target.value);
            }}
          />
          <button
            className="btn"
            onClick={() => {
              const val = document.querySelector(".search-input").value;
              handleSearch(val);
            }}
          >
            Search
          </button>
        </div>

        <div className="hint">{message}</div>
      </div>

      <div className="right card">
        <div className="topbar">
          <div className="muted">Visualized Tree</div>
        </div>

        <div className="canvas card">
          {flow.nodes.length === 0 ? (
            <div style={{ color: "#9ca3af" }}>
              No tree yet — paste JSON and click “Generate Tree”
            </div>
          ) : (
            <TreeVisualizer
              ref={treeRef}
              nodes={flow.nodes}
              edges={flow.edges}
            />
          )}
        </div>
      </div>
    </div>
  );
}
