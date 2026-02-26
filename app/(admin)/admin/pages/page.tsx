import Link from 'next/link'

// Mock data
const pages = [
  { id: '1', title: 'O nama', slug: 'o-nama', status: 'published' as const },
  { id: '2', title: 'Kontakt', slug: 'kontakt', status: 'published' as const },
  { id: '3', title: 'Politika privatnosti', slug: 'privatnost', status: 'published' as const },
  { id: '4', title: 'Uvjeti korištenja', slug: 'uvjeti-koristenja', status: 'published' as const },
]

export default function PagesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stranice</h1>
          <p className="mt-1 text-sm text-gray-500">Upravljajte statičnim stranicama</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova stranica
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Naslov
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Slug
              </th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-[var(--admin-green-light)]/50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="font-medium text-gray-900 hover:text-[var(--admin-green-dark)]"
                  >
                    {page.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  /page/{page.slug}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                      page.status === 'published'
                        ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {page.status === 'published' ? 'Objavljeno' : 'Skica'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <a
                      href={`/page/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-400 hover:text-gray-600"
                    >
                      Pogledaj
                    </a>
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="text-sm font-medium text-[var(--admin-green)] hover:text-[var(--admin-green-dark)]"
                    >
                      Uredi
                    </Link>
                    <button className="text-sm font-medium text-red-500 hover:text-red-700">
                      Obriši
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
