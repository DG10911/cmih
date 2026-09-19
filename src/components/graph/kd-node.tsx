"use client";
import * as React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { NODE_TYPE_META, type GraphNodeData } from "./build-graph";

/**
 * Custom knowledge-graph node renderer (spec §19,39). Styled with the
 * platform's dark-surface tokens — never the default React Flow white box.
 * Fades in on mount via the shared `animate-fade-in` keyframe.
 */
function KDNodeImpl({ data, selected }: NodeProps<GraphNodeData>) {
  const meta = NODE_TYPE_META[data.kind];
  const Icon = meta.icon;
  const isDimmed = !!data.dimmed && !data.pathHighlight && !data.matched;

  return (
    <div
      className={cn(
        "animate-fade-in flex max-w-[190px] items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-left shadow-panel transition-opacity duration-200",
        meta.bgClass,
        meta.borderClass,
        isDimmed ? "opacity-20" : "opacity-100",
        (selected || data.selected) && "ring-2 ring-data ring-offset-1 ring-offset-background",
        data.pathHighlight && "ring-2 ring-mineral ring-offset-1 ring-offset-background",
        data.matched && "ring-2 ring-data ring-offset-1 ring-offset-background"
      )}
      title={data.label}
    >
      <Handle type="target" position={Position.Left} className="!h-1.5 !w-1.5 !border-none !bg-border-strong" />
      <Icon className={cn("h-3 w-3 shrink-0", meta.textClass)} />
      <span className={cn("truncate text-2xs font-medium leading-tight", meta.textClass)}>{data.label}</span>
      <Handle type="source" position={Position.Right} className="!h-1.5 !w-1.5 !border-none !bg-border-strong" />
    </div>
  );
}

export const KDNodeComponent = React.memo(KDNodeImpl);
