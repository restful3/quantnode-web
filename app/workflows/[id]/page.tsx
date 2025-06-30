'use client';

import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

function parseN8nToReactFlow(json: any): { nodes: Node[]; edges: Edge[] } {
  if (!json || !json.nodes) return { nodes: [], edges: [] };

  const nodes: Node[] = json.nodes.map((node: any, index: number) => ({
    id: String(node.id || `node-${index}`),
    data: { label: node.name },
    position: {
      x: node.position?.[0] ?? index * 150,
      y: node.position?.[1] ?? 0,
    },
    type: 'default',
  }));

  const edges: Edge[] = [];
  json.nodes.forEach((node: any) => {
    if (node.connections) {
      Object.entries(node.connections).forEach(([outputName, targets]: any) => {
        targets.forEach((targetArr: any) => {
          targetArr.forEach((target: any) => {
            edges.push({
              id: `e-${node.id}-${target.node}`,
              source: String(node.id),
              target: String(target.node),
              type: 'default',
            });
          });
        });
      });
    }
  });

  return { nodes, edges };
}

export default function WorkflowDetail({ params }: any) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('json_url')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        console.error('Supabase fetch error:', error);
        router.push('/404');
        return;
      }

      try {
        const res = await fetch(data.json_url);
        const json = await res.json();

        const { nodes, edges } = parseN8nToReactFlow(json);
        setNodes(nodes);
        setEdges(edges);
      } catch (err) {
        console.error('Failed to fetch or parse JSON:', err);
      }
    };

    fetchData();
  }, [params.id, router]);

  return (
    <main style={{ height: '100vh', background: '#111' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </main>
  );
}
