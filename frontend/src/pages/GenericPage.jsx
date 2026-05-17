export default function GenericPage({ title, description }) {
  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-4">{title}</h1>
      <p className="text-slate-600 mb-8">{description}</p>
      
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <p className="text-slate-500 italic">This module is part of the AI-Powered Civic Governance platform.</p>
        <p className="text-sm mt-2 text-slate-400">Data will be populated dynamically from the backend.</p>
      </div>
    </div>
  );
}
