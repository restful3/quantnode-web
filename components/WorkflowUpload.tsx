'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function WorkflowUpload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [insertedId, setInsertedId] = useState<number | null>(null)

  const handleUpload = async () => {
    if (!file || !title) return alert('파일과 제목은 필수입니다.')

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // 1. JSON 파일 Supabase Storage에 업로드
    const { data: storageData, error: storageError } = await supabase.storage
      .from('workflows-json')
      .upload(filePath, file)

    if (storageError) {
      console.error(storageError)
      return setMessage('업로드 실패: Storage')
    }

    const jsonUrl = `${supabase.storage.from('workflows-json').getPublicUrl(filePath).data.publicUrl}`

    // 2. 메타데이터 DB에 저장
    const { data: insertData, error: insertError } = await supabase.from('workflows')
      .insert({
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        json_url: jsonUrl,
        uploader_email: null, // 추후 로그인 기능 붙이면 대체
      })
      .select('id')
      .single()

    if (insertError) {
      console.error(insertError)
      return setMessage('DB 저장 실패')
    }

    setInsertedId(insertData.id)
    setMessage('🎉 업로드 성공!')
    setTitle('')
    setDescription('')
    setTags('')
    setFile(null)
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📤 워크플로우 업로드</h2>
      <input type="text" placeholder="제목" className="w-full mb-2 p-2 border" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="설명" className="w-full mb-2 p-2 border" value={description} onChange={e => setDescription(e.target.value)} />
      <input type="text" placeholder="태그 (쉼표로 구분)" className="w-full mb-2 p-2 border" value={tags} onChange={e => setTags(e.target.value)} />
      <input type="file" accept=".json" className="w-full mb-2" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpload}>업로드</button>
      {message && <p className="mt-4">{message}</p>}
      {insertedId && (
        <Link href={`/workflows/${insertedId}`} className="text-blue-500 underline">
          시각화 보기
        </Link>
      )}
    </div>
  )
}
