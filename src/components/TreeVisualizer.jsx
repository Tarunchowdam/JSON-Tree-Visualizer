import React, {
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

const nodeWidth = 150;
const nodeHeight = 50;

// 🧠 Layout nodes top-to-bottom using Dagre
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  const isHorizontal = direction === "LR";

  nodes.forEach((node) =>
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  );
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const TreeVisualizer = forwardRef(
  ({ nodes: initialNodes, edges: initialEdges, onNodeClick }, ref) => {
    const rfRef = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [layoutFixed, setLayoutFixed] = useState(false);
    const [tempNodeId, setTempNodeId] = useState(null);
    const [copyMsg, setCopyMsg] = useState("");

    const onInit = useCallback((instance) => {
      rfRef.current = instance;
      setTimeout(() => instance.fitView({ padding: 0.2 }), 300);
    }, []);

    // 🧭 Layout only once
    useEffect(() => {
      if (layoutFixed || !initialNodes.length) return;
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(initialNodes, initialEdges, "TB");

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setLayoutFixed(true);

      setTimeout(() => {
        if (rfRef.current) rfRef.current.fitView({ padding: 0.3 });
      }, 300);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialNodes, initialEdges]);

    // 👇 Expose methods to parent
    useImperativeHandle(ref, () => ({
      addTemporaryNode(targetNodeId, newNode) {
        setNodes((nds) => {
          const target = nds.find((n) => n.id === targetNodeId);
          if (!target) return nds;

          const temp = {
            ...newNode,
            id: newNode.id,
            style: {
              background: "#eeff07ff",
              color: "#000",
              border: "2px solid #16a34a",
              borderRadius: 8,
              padding: 8,
            },
            position: {
              x: target.position.x,
              y: target.position.y + 120,
            },
          };
          setTempNodeId(temp.id);
          return [...nds, temp];
        });

        setEdges((eds) => [
          ...eds,
          {
            id: `e-${targetNodeId}-${newNode.id}`,
            source: targetNodeId,
            target: newNode.id,
            animated: true,
            style: { stroke: "#16a34a" },
          },
        ]);
      },

      clearTemporaryNode() {
        if (!tempNodeId) return;
        setNodes((nds) => nds.filter((n) => n.id !== tempNodeId));
        setEdges((eds) => eds.filter((e) => e.target !== tempNodeId));
        setTempNodeId(null);
      },
    }));

    // ✅ When a node is clicked → copy its path
    const handleNodeClick = useCallback(
      async (event, node) => {
        const path = node?.data?.path;
        if (!path) return;

        try {
          await navigator.clipboard.writeText(path);
          setCopyMsg(`✅ Copied: ${path}`);
          setTimeout(() => setCopyMsg(""), 2000);
        } catch (err) {
          console.error("Copy failed:", err);
          setCopyMsg("❌ Failed to copy");
          setTimeout(() => setCopyMsg(""), 2000);
        }

        if (onNodeClick) onNodeClick(node);
      },
      [onNodeClick]
    );

    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onInit={onInit}
          nodesDraggable={false}
          panOnDrag={true}
          zoomOnScroll={true}
        >
          <Controls />
          <Background gap={16} />
        </ReactFlow>

        {copyMsg && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#111827",
              color: "#a7f3d0",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
          >
            {copyMsg}
          </div>
        )}
      </div>
    );
  }
);

export default TreeVisualizer;
