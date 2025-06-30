'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

type Workflow = {
  id: string
  title: string
  description: string
  tags: string[]
  json_url: string
  uploader_email: string
  created_at: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function WorkflowListPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    const fetchWorkflows = async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase fetch error:', error.message)
      } else {
        setWorkflows(data)
      }
    }

    fetchWorkflows()
  }, [])

  return (
    <main className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📂 업로드된 워크플로우 목록</h1>

      {workflows.length === 0 ? (
        <p>아직 업로드된 워크플로우가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {workflows.map((wf) => (
            <li
              key={wf.id}
              className="bg-gray-800 rounded p-4 shadow hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold">{wf.title}</h2>
              <p className="text-sm text-gray-300">{wf.description}</p>
              {wf.tags?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  🏷️ {wf.tags.join(', ')}
                </p>
              )}
              <a
                href={wf.json_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mt-2 block"
              >
                📄 JSON 다운로드
              </a>
              <p className="text-xs text-gray-500 mt-1">
                업로드: {new Date(wf.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
