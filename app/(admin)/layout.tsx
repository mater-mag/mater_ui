'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const menuItems = [
  {
    href: '/admin',
    label: 'Nadzorna ploča',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/admin/articles',
    label: 'Članci',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/interviews',
    label: 'Intervjui',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: '/admin/pages',
    label: 'Stranice',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
      </svg>
    ),
  },
  {
    href: '/admin/categories',
    label: 'Kategorije',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: '/admin/authors',
    label: 'Autori',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/media',
    label: 'Mediji',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
]

const generalItems = [
  {
    href: '/admin/settings',
    label: 'Postavke',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/account',
    label: 'Moj račun',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

function NavItem({ href, label, icon, isActive }: { href: string; label: string; icon: React.ReactNode; isActive: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-[var(--admin-green-light)] text-[var(--admin-green-dark)]'
            : 'text-gray-600 hover:bg-[var(--admin-green-light)] hover:text-[var(--admin-green-dark)]'
        }`}
      >
        {icon}
        {label}
      </Link>
    </li>
  )
}

function getUserDisplayName(user: User | null): string {
  if (!user) return 'Korisnik'
  return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Korisnik'
}

function getUserInitial(user: User | null): string {
  const name = getUserDisplayName(user)
  return name.charAt(0).toUpperCase()
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const displayName = getUserDisplayName(user)
  const initial = getUserInitial(user)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Matermag"
              width={140}
              height={40}
              className="h-8 w-auto invert"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          <ul className="space-y-1 mb-8">
            {menuItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.href)}
              />
            ))}
          </ul>

          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Općenito
          </p>
          <ul className="space-y-1">
            {generalItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.href)}
              />
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Pogledaj stranicu
          </a>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors w-full disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isLoggingOut ? 'Odjava...' : 'Odjava'}
          </button>
        </div>
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Pretraži..."
              className="w-72 pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)]/20 focus:border-[var(--admin-green)]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200">
              ⌘K
            </kbd>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200"></div>

            {/* User - clickable to account page */}
            <Link href="/admin/account" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-[var(--admin-green-dark)] flex items-center justify-center">
                <span className="text-white text-sm font-medium">{initial}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 bg-[var(--admin-bg)] overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
