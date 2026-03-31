import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

const footerLinks = {
  'Quick Links': [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Become Member', href: '#become-member' },
    { label: 'Projects', href: '#projects' },
    { label: 'Events', href: '#events' },
    { label: 'News', href: '#news' },
    { label: 'Contact', href: '#contact' },
  ],
  'Get Involved': [
    { label: 'Become Member', href: '#become-member' },
    { label: 'Photos', href: '#gallery' },
    { label: 'Sponsor a Project', href: '#projects' },
    { label: 'Scholarship Donations', href: '#projects' },
    { label: 'Annual Gala Dinner', href: '#events' },
    { label: 'Sports Teams', href: '#events' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0a0f28] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-yellow-400 overflow-hidden">
                <Image
                  src="/src/images/logo-removebg.png"
                  alt="St.Anne’s College Past Pupils’ Association"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="nav-brand text-white font-bold text-sm leading-tight">St.Anne’s College Past Pupils’ Association</div>
                <div className="nav-brand text-yellow-400 text-xs tracking-widest uppercase">IN NSW & ACT</div>
              </div>
            </div>
            <p className="font-lato text-gray-400 text-sm leading-relaxed mb-6">
              A vibrant community of alumni reconnecting, reminiscing, and forging new bonds while
              serving the community and supporting our beloved alma mater.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Linkedin, label: 'LinkedIn' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 border border-gray-600 flex items-center justify-center hover:bg-yellow-600 hover:border-yellow-600 transition-colors duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-playfair text-base font-bold text-white mb-5 pb-3 border-b border-white/10">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-lato text-gray-400 text-sm hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-3 h-[1px] bg-yellow-500 transition-all duration-200" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 className="font-playfair text-base font-bold text-white mb-5 pb-3 border-b border-white/10">
              Contact Info
            </h4>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: 'Vankalai, Mannar, Sri Lanka' },
                { icon: Phone, text: '+94  XXXX XXXX' },
                { icon: Mail, text: 'stannesppa.official@gmail.com' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={15} className="text-yellow-500 mt-0.5 shrink-0" />
                  <span className="font-lato text-gray-400 text-sm">{text}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h5 className="font-lato text-xs uppercase tracking-widest text-gray-400 mb-3">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 px-3 py-2 text-white text-sm font-lato placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
                <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 text-xs font-lato font-bold uppercase tracking-widest transition-colors duration-200">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-lato text-gray-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} St.Anne’s College Past Pupils’ Association. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Use', 'Sitemap'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-lato text-gray-500 text-xs hover:text-yellow-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
