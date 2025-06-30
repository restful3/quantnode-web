import WorkflowUpload from '@/components/WorkflowUpload'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">🧠 QuantNode.kr</h1>
      <p className="text-lg text-gray-600">
        n8n 워크플로우 공유 사이트에 오신 걸 환영합니다.2
      </p>
      <p className="mt-4 text-sm text-gray-500 mb-8">
        Supabase 연동 및 업로드 기능은 이제 작동 중입니다. 🎉
      </p>

      <div className="w-full max-w-xl text-left">
        <WorkflowUpload />
      </div>
    </main>
  );
}
