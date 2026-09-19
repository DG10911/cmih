"use client";
import "reactflow/dist/style.css";
import * as React from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
} from "reactflow";
import { GraphSidebar } from "./graph-sidebar";
import { NodeDetailPanel } from "./node-detail-panel";
import { KDNodeComponent } from "./kd-node";
import {
  buildGraph,
  isExplorePathEdge,
  EXPLORE_PATH_IDS,
  ALL_NODE_TYPES,
  NODE_TYPE_META,
  type GraphNodeType,
  type KDNode,
} from "./build-graph";

const nodeTypes = { kd: KDNodeComponent };

function GraphCanvasInner() {
  const { nodes: baseNodes, edges: baseEdges, counts } = React.useMemo(() => buildGraph(), []);
  const [activeTypes, setActiveTypes] = React.useState<Set<GraphNodeType>>(() => new Set(ALL_NODE_TYPES));
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [exploreActive, setExploreActive] = React.useState(false);
  const { fitView } = useReactFlow();

  const toggleType = React.useCallback((kind: GraphNodeType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }, []);

  const explorePathSet = React.useMemo(() => new Set(EXPLORE_PATH_IDS), []);

  const visibleNodes = React.useMemo(
    () => baseNodes.filter((n) => activeTypes.has(n.data.kind) || (exploreActive && explorePathSet.has(n.id))),
    [baseNodes, activeTypes, exploreActive, explorePathSet]
  );
  const visibleIds = React.useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);
  const visibleEdges = React.useMemo(
    () => baseEdges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target)),
    [baseEdges, visibleIds]
  );

  const q = query.trim().toLowerCase();
  const matchCount = React.useMemo(
    () => (q ? visibleNodes.filter((n) => n.data.label.toLowerCase().includes(q)).length : 0),
    [visibleNodes, q]
  );

  const displayNodes: KDNode[] = React.useMemo(
    () =>
      visibleNodes.map((n) => {
        const matched = q.length > 0 && n.data.label.toLowerCase().includes(q);
        const onPath = exploreActive && explorePathSet.has(n.id);
        return {
          ...n,
          data: {
            ...n.data,
            matched,
            selected: n.id === selectedId,
            pathHighlight: onPath,
            dimmed: (q.length > 0 && !matched) || (exploreActive && !onPath),
          },
        };
      }),
    [visibleNodes, q, exploreActive, explorePathSet, selectedId]
  );

  const displayEdges: Edge[] = React.useMemo(
    () =>
      visibleEdges.map((e) => {
        if (!exploreActive) return e;
        const onPath = isExplorePathEdge(e);
        return {
          ...e,
          animated: onPath,
          style: { ...e.style, opacity: onPath ? 0.95 : 0.04, strokeWidth: onPath ? 2.5 : 1 },
        };
      }),
    [visibleEdges, exploreActive]
  );

  const selectedNode = React.useMemo(() => baseNodes.find((n) => n.id === selectedId) ?? null, [baseNodes, selectedId]);

  const handleExplorePath = React.useCallback(() => {
    setExploreActive(true);
    setQuery("");
    setActiveTypes(new Set(ALL_NODE_TYPES));
    setSelectedId(EXPLORE_PATH_IDS[2]);
  }, []);

  const handleResetExplore = React.useCallback(() => setExploreActive(false), []);

  React.useEffect(() => {
    if (!exploreActive) return;
    const t = setTimeout(() => {
      fitView({ nodes: EXPLORE_PATH_IDS.map((id) => ({ id })), padding: 0.35, duration: 600 });
    }, 60);
    return () => clearTimeout(t);
  }, [exploreActive, fitView]);

  return (
    <div className="grid h-[calc(100vh-190px)] min-h-[560px] grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_320px]">
      <div className="min-h-0">
        <GraphSidebar
          activeTypes={activeTypes}
          onToggleType={toggleType}
          query={query}
          onQueryChange={setQuery}
          matchCount={matchCount}
          onExplorePath={handleExplorePath}
          onResetExplore={handleResetExplore}
          exploreActive={exploreActive}
          counts={counts}
        />
      </div>

      <div className="relative min-h-[420px] overflow-hidden rounded-card border border-border bg-surface">
        <span className="sr-only" role="status">
          Knowledge graph showing {displayNodes.length} nodes and {displayEdges.length} connections, out of{" "}
          {baseNodes.length} total nodes and {baseEdges.length} total connections across minerals, technologies,
          patents, R&amp;D projects, organisations and publications.
        </span>
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          onPaneClick={() => setSelectedId(null)}
          fitView
          minZoom={0.15}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="rgb(var(--border-strong))" className="bg-surface" />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            maskColor="rgba(11,13,15,0.75)"
            nodeColor={(n) => {
              const kind = (n.data as { kind?: GraphNodeType } | undefined)?.kind;
              return kind ? NODE_TYPE_META[kind].colorVar : "rgb(var(--ink-faint))";
            }}
          />
        </ReactFlow>
      </div>

      <div className="min-h-0">
        <NodeDetailPanel node={selectedNode} />
      </div>

      <style jsx global>{`
        .react-flow__controls {
          background: transparent;
          box-shadow: none;
          border-radius: 0.625rem;
          overflow: hidden;
          border: 1px solid rgb(var(--border));
        }
        .react-flow__controls-button {
          background: rgb(var(--surface-2));
          border-bottom: 1px solid rgb(var(--border));
        }
        .react-flow__controls-button:hover {
          background: rgb(var(--surface-3));
        }
        .react-flow__controls-button svg {
          fill: rgb(var(--ink-soft));
        }
        .react-flow__minimap {
          background-color: rgb(var(--surface));
          border: 1px solid rgb(var(--border));
          border-radius: 0.625rem;
        }
        .react-flow__attribution {
          display: none;
        }
      `}</style>
    </div>
  );
}

/** Full-height knowledge-graph explorer (spec §19,39). Wrapped in a provider so
 * the canvas can use `useReactFlow` for the "Explore path" fitView affordance. */
export function KnowledgeGraph() {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner />
    </ReactFlowProvider>
  );
}
