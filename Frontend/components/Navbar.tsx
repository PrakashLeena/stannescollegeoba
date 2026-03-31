'use client'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', href: '#home' },
  {
    label: 'About Us', href: '#about',
    children: [
      { label: 'Who We Are', href: '#about' },
      { label: 'Committee', href: '#committee' },
      { label: 'History', href: '#history' },
      { label: 'Internal Structure', href: '/internal-committee-structure' },
    ],
  },
  {
    label: 'Get Involved', href: '#become-member',
    children: [
      { label: 'Photos', href: '#gallery' },
      { label: 'Become Member', href: '#become-member' },
    ],
  },
  {
    label: 'Activity', href: '#projects',
    children: [
      { label: 'Projects', href: '#projects' },
      { label: 'Events', href: '#events' },
    ],
  },
  { label: 'News', href: '#news' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const resolveHref = (href: string) => {
    if (!href.startsWith('#')) return href
    if (pathname === '/') return href
    return `/${href}`
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-yellow-600 text-white text-xs py-2 px-4 hidden md:flex justify-between items-center">
        <span className="font-lato tracking-wide">
          📧 stannesppa.official@gmail.com &nbsp;|&nbsp; 📞 +94  XXXX XXXX
        </span>
        <span className="font-lato tracking-wide">
          Follow us: &nbsp;
          <a href="#" className="hover:underline">Facebook</a> &nbsp;|&nbsp;
          <a href="#" className="hover:underline">Instagram</a> &nbsp;|&nbsp;
          <a href="#" className="hover:underline">LinkedIn</a>
        </span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#1a2456] shadow-2xl py-2'
            : 'bg-[#1a2456]/90 backdrop-blur-sm py-3'
        }`}
        style={{ top: scrolled ? 0 : '0' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-nowrap items-center justify-between gap-3">
          {/* Logo */}
          <a href={resolveHref('#home')} className="flex items-center gap-3 group min-w-0 flex-1">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-yellow-400 overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/src/images/logo-removebg.png"
                alt="St.Anne’s College Past Pupils’ Association"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <div className="block max-w-[220px] sm:max-w-none min-w-0">
              <div className="nav-brand text-white font-bold text-sm sm:text-sm md:text-base leading-tight tracking-wide">
                St.Anne’s College Past Pupils’ Association
              </div>
              <div className="nav-brand text-yellow-400 text-xs sm:text-sm md:text-base tracking-widest uppercase">
                IN NSW & ACT
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="dropdown-parent relative px-3 py-5 cursor-pointer group">
                  <span className="nav-link flex items-center gap-1">
                    {item.label}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </span>
                  <div className="dropdown-menu">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={resolveHref(child.href)}
                        className="block px-5 py-3 text-[#1a2456] font-lato text-sm font-medium hover:bg-yellow-50 hover:text-yellow-700 border-b border-gray-100 last:border-0 transition-colors duration-200"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a key={item.label} href={resolveHref(item.href)} className="nav-link px-3 py-5 block">
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2 shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-[#0f1835] transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="w-full text-left text-white font-lato font-medium text-sm uppercase tracking-wide py-3 flex items-center justify-between border-b border-white/10"
                    onClick={() =>
                      setMobileDropdown(mobileDropdown === item.label ? null : item.label)
                    }
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        mobileDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileDropdown === item.label && (
                    <div className="pl-4 py-2 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={resolveHref(child.href)}
                          className="block text-yellow-300 font-lato text-sm py-2"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={resolveHref(item.href)}
                  className="block text-white font-lato font-medium text-sm uppercase tracking-wide py-3 border-b border-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
