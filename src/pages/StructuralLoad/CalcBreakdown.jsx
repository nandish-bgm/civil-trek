export default function CalcBreakdown({ steps = [], components = [], title, color = '#D85A30' }) {
  return (
    <div className="space-y-3">
      {components.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 font-medium text-gray-600">Component</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Formula</th>
                <th className="text-right px-3 py-2 font-medium text-gray-600">Value</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Reference</th>
              </tr>
            </thead>
            <tbody>
              {components.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 font-medium text-gray-800">{c.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-600">{c.formula}</td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-800">
                    {typeof c.value === 'number' ? c.value.toFixed(3) : c.value} {c.unit}
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      {c.ref}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
              {i + 1}
            </span>
            <div
              className="flex-1 text-sm text-gray-700 font-mono rounded-r-lg px-3 py-2"
              style={{ background: '#f8fafc', borderLeft: `3px solid ${color}` }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
