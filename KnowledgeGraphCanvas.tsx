import React, { useMemo, useRef, useState } from 'react';
import { LocateFixed, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import type { ConceptRelationshipType } from '../types/dynamap';

export interface GraphNodeItem {
  id: string;
  label: string;
  shortCode: string;
  group: string;
  badgeText?: string;
  summary: string;
  x: number;
  y: number;
}

export interface GraphEdgeItem {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: ConceptRelationshipType;
  label: string;
  explanation: string;
  cautionNote?: string;
}

interface KnowledgeGraphCanvasProps {
  nodes: GraphNodeItem[];
  edges: GraphEdgeItem[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  focusMode: boolean;
  onToggleFocusMode?: () => void;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
  onMoveNode?: (nodeId: string, x: number, y: number) => void;
  heightClass?: string;
}

const EDGE_COLORS: Record<ConceptRelationshipType, string> = {
  'Same Framework': '#2563EB', // blue-600
  'Structural Relationship': '#4338CA', // indigo-700
  'Conceptual Similarity': '#0D9488', // teal-600
  Analogy: '#D97706', // amber-600
  'Cross-Framework Association': '#7C3AED', // violet-600
  'Independent Concepts': '#64748B', // slate-500
};

const EDGE_DASH: Record<ConceptRelationshipType, string | undefined> = {
  'Same Framework': undefined,
  'Structural Relationship': undefined,
  'Conceptual Similarity': '6 4',
  Analogy: '4 4',
  'Cross-Framework Association': '8 4',
  'Independent Concepts': '2 4',
};

const GROUP_STYLES: Record<string, { fill: string; stroke: string; text: string }> = {
  Socionics: { fill: '#EEF2FF', stroke: '#4F46E5', text: '#1E1B4B' },
  Psikosofi: { fill: '#ECFEFF', stroke: '#0891B2', text: '#164E63' },
  Enneagram: { fill: '#FFFBEB', stroke: '#D97706', text: '#78350F' },
  'Tipologi Jung': { fill: '#F0FDF4', stroke: '#16A34A', text: '#14532D' },
  Identitas: { fill: '#1E1B4B', stroke: '#312E81', text: '#FFFFFF' },
  'Preferensi Belajar': { fill: '#EFF6FF', stroke: '#2563EB', text: '#1E3A8A' },
  'Minat Akademik': { fill: '#F0FDFA', stroke: '#0D9488', text: '#134E4A' },
  'Refleksi Pribadi': { fill: '#F8FAFC', stroke: '#475569', text: '#0F172A' },
  'Arah Eksplorasi': { fill: '#FDF4FF', stroke: '#9333EA', text: '#581C87' },
};

export const KnowledgeGraphCanvas: React.FC<KnowledgeGraphCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  focusMode,
  onToggleFocusMode,
  onSelectNode,
  onSelectEdge,
  onMoveNode,
  heightClass = 'h-[480px]',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggingCanvas, setDraggingCanvas] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const visibleNodeIds = useMemo(() => {
    if (!focusMode || !selectedNodeId) {
      return new Set(nodes.map((n) => n.id));
    }
    const connected = new Set<string>([selectedNodeId]);
    for (const edge of edges) {
      if (edge.sourceId === selectedNodeId) connected.add(edge.targetId);
      if (edge.targetId === selectedNodeId) connected.add(edge.sourceId);
    }
    return connected;
  }, [focusMode, selectedNodeId, nodes, edges]);

  const visibleNodes = useMemo(
    () => nodes.filter((n) => visibleNodeIds.has(n.id)),
    [nodes, visibleNodeIds]
  );

  const visibleEdges = useMemo(
    () => edges.filter((e) => visibleNodeIds.has(e.sourceId) && visibleNodeIds.has(e.targetId)),
    [edges, visibleNodeIds]
  );

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (draggingNodeId && onMoveNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const viewX = ((e.clientX - rect.left) / rect.width) * 1000;
      const viewY = ((e.clientY - rect.top) / rect.height) * 640;
      const worldX = Math.max(80, Math.min(920, Math.round((viewX - pan.x) / zoom)));
      const worldY = Math.max(50, Math.min(590, Math.round((viewY - pan.y) / zoom)));
      onMoveNode(draggingNodeId, worldX, worldY);
      return;
    }
    if (draggingCanvas) {
      const dx = e.clientX - draggingCanvas.startX;
      const dy = e.clientY - draggingCanvas.startY;
      setPan({ x: draggingCanvas.origX + dx, y: draggingCanvas.origY + dy });
    }
  }

  function handlePointerUp() {
    setDraggingCanvas(null);
    setDraggingNodeId(null);
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-slate-600">
          Klik simpul atau garis hubungan untuk menelaah detail · Seret area kosong untuk menggeser peta
          {onMoveNode ? ' · Seret simpul untuk menata posisi' : ''}
        </div>
        <div className="flex items-center gap-1.5">
          {onToggleFocusMode && (
            <button
              type="button"
              onClick={onToggleFocusMode}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border font-medium transition-colors whitespace-nowrap ${
                focusMode
                  ? 'bg-indigo-700 text-white border-indigo-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {focusMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              {focusMode ? 'Mode Fokus Aktif' : 'Peta Penuh'}
            </button>
          )}
          <button
            type="button"
            aria-label="Perbesar peta konsep"
            onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
            className="p-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-100 text-slate-700"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Perkecil peta konsep"
            onClick={() => setZoom((z) => Math.max(0.65, Number((z - 0.15).toFixed(2))))}
            className="p-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-100 text-slate-700"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Atur ulang posisi peta"
            onClick={resetView}
            className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-100 text-slate-700 whitespace-nowrap"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* SVG Interactive Graph */}
      <div className={`relative w-full ${heightClass} bg-slate-50/40 select-none overflow-hidden`}>
        <svg
          ref={svgRef}
          viewBox="0 0 1020 620"
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={(e) => {
            if (e.target === svgRef.current) {
              setDraggingCanvas({
                startX: e.clientX,
                startY: e.clientY,
                origX: pan.x,
                origY: pan.y,
              });
            }
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Subtle coordinate grid */}
            <defs>
              <pattern id="dynamap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect x="-400" y="-400" width="1800" height="1440" fill="url(#dynamap-grid)" />

            {/* Edges */}
            {visibleEdges.map((edge) => {
              const src = nodeMap.get(edge.sourceId);
              const tgt = nodeMap.get(edge.targetId);
              if (!src || !tgt) return null;

              const isSelected = selectedEdgeId === edge.id;
              const isRelatedToSelectedNode =
                selectedNodeId === edge.sourceId || selectedNodeId === edge.targetId;
              const color = EDGE_COLORS[edge.relationshipType] || '#64748B';
              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;

              return (
                <g
                  key={edge.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEdge(edge.id);
                  }}
                  className="cursor-pointer"
                >
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="transparent"
                    strokeWidth={14}
                  />
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={color}
                    strokeWidth={isSelected ? 3.5 : isRelatedToSelectedNode ? 2.4 : 1.6}
                    strokeOpacity={isSelected || isRelatedToSelectedNode ? 0.95 : 0.65}
                    strokeDasharray={EDGE_DASH[edge.relationshipType]}
                  />
                  <rect
                    x={midX - 48}
                    y={midY - 9}
                    width={96}
                    height={18}
                    rx={4}
                    fill={isSelected ? color : '#FFFFFF'}
                    stroke={color}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fontSize={8.5}
                    fontWeight={600}
                    fill={isSelected ? '#FFFFFF' : '#334155'}
                  >
                    {edge.relationshipType === 'Same Framework'
                      ? 'Satu Kerangka'
                      : edge.relationshipType === 'Structural Relationship'
                      ? 'Struktural'
                      : edge.relationshipType === 'Conceptual Similarity'
                      ? 'Kemiripan Konsep'
                      : edge.relationshipType === 'Analogy'
                      ? 'Analogi'
                      : edge.relationshipType === 'Cross-Framework Association'
                      ? 'Lintas Kerangka'
                      : 'Independen'}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {visibleNodes.map((node) => {
              const style = GROUP_STYLES[node.group] || {
                fill: '#FFFFFF',
                stroke: '#475569',
                text: '#0F172A',
              };
              const isSelected = selectedNodeId === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onSelectNode(node.id);
                    if (onMoveNode) setDraggingNodeId(node.id);
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={-78}
                    y={-28}
                    width={156}
                    height={56}
                    rx={10}
                    fill={style.fill}
                    stroke={isSelected ? '#1E1B4B' : style.stroke}
                    strokeWidth={isSelected ? 3 : 1.6}
                  />
                  <text
                    x={0}
                    y={-6}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={style.text}
                  >
                    {node.shortCode}
                  </text>
                  <text
                    x={0}
                    y={10}
                    textAnchor="middle"
                    fontSize={9.5}
                    fontWeight={500}
                    fill={style.text}
                    opacity={0.85}
                  >
                    {node.label.length > 24 ? `${node.label.slice(0, 22)}...` : node.label}
                  </text>
                  {node.badgeText && (
                    <text
                      x={0}
                      y={22}
                      textAnchor="middle"
                      fontSize={8}
                      fill={style.text}
                      opacity={0.75}
                    >
                      {node.badgeText}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Explicit Relationship Legend */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600">
        <span className="font-semibold text-slate-800">Jenis Hubungan:</span>
        {(Object.keys(EDGE_COLORS) as ConceptRelationshipType[]).map((rel) => (
          <span key={rel} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block w-4 h-0.5"
              style={{
                backgroundColor: EDGE_COLORS[rel],
                borderTop: EDGE_DASH[rel] ? `2px dashed ${EDGE_COLORS[rel]}` : undefined,
              }}
            />
            <span>
              {rel === 'Same Framework'
                ? 'Satu Kerangka'
                : rel === 'Structural Relationship'
                ? 'Relasi Struktural'
                : rel === 'Conceptual Similarity'
                ? 'Kemiripan Konsep'
                : rel === 'Analogy'
                ? 'Analogi'
                : rel === 'Cross-Framework Association'
                ? 'Asosiasi Lintas Kerangka'
                : 'Konsep Independen'}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};
