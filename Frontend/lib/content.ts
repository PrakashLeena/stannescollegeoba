export type CommunityProject = {
  slug: string
  img?: string
  category: string
  title: string
  desc: string
  tag: 'Ongoing' | 'Completed'
  body?: string
}

export type CommunityEvent = {
  slug: string
  img?: string
  kind: 'Sport' | 'Upcoming'
  sport?: string
  date?: string
  month?: string
  title: string
  desc?: string
  location?: string
  time?: string
  body?: string
}

export type NewsItem = {
  slug: string
  img?: string
  category: string
  title: string
  date: string
  excerpt: string
  body?: string
}

export const communityProjects: CommunityProject[] = [
  {
    slug: 'annual-scholarship-programme',
    img: '',
    category: 'Education',
    title: 'Annual Scholarship Programme',
    desc: 'For over 30 years, we have provided scholarships to students, offering monthly allowances to cover educational expenses. We recently expanded to include additional recipients.',
    tag: 'Ongoing',
  },
  {
    slug: 'lrh-medical-support-project',
    img: '',
    category: 'Healthcare',
    title: 'LRH Medical Support Project',
    desc: 'In response to the 2022 healthcare crisis, our members raised over AUD 8,000 to provide critical medical consumables to Lady Ridgeway Hospital, the largest free paediatric hospital in Sri Lanka.',
    tag: 'Completed',
  },
  {
    slug: 'english-drama-society-support',
    img: '',
    category: 'Arts & Culture',
    title: 'English Drama Society Support',
    desc: 'We supported the English Drama Society to launch a comprehensive Drama Calendar, including weekly workshops for students from Grade 6 to College Prefects.',
    tag: 'Ongoing',
  },
]

export const communityEvents: CommunityEvent[] = [
  {
    slug: 'touch-footy-tournament-sport',
    img: '',
    kind: 'Sport',
    sport: 'Rugby',
    title: 'Touch Footy Tournament',
    desc: 'RCOBA fields two rugby teams — Open and Over 40s — in the annual Sri Lanka Schools touch footy tournament.',
  },
  {
    slug: 'tennis-social-evenings',
    img: '',
    kind: 'Sport',
    sport: 'Tennis',
    title: 'Tennis Social Evenings',
    desc: 'Our tennis community is growing fast. Join us for weekly social evenings every Friday from 6PM.',
  },
  {
    slug: 'annual-gala-dinner-gala',
    img: '',
    kind: 'Sport',
    sport: 'Gala',
    title: 'Annual Gala Dinner',
    desc: 'A highlight of the year — an elegant evening celebrating our alumni community with cultural performances and fine dining.',
  },
  {
    slug: 'annual-gala-dinner-2025',
    kind: 'Upcoming',
    date: '15',
    month: 'NOV',
    title: 'Annual Gala Dinner 2025',
    location: 'Doltone House, Sydney',
    time: '7:00 PM — 11:00 PM',
  },
  {
    slug: 'touch-footy-tournament-2025',
    kind: 'Upcoming',
    date: '08',
    month: 'DEC',
    title: 'Touch Footy Tournament',
    location: 'Parramatta Park, NSW',
    time: '9:00 AM — 5:00 PM',
  },
  {
    slug: 'christmas-social-evening-2025',
    kind: 'Upcoming',
    date: '20',
    month: 'DEC',
    title: 'Christmas Social Evening',
    location: 'Colombo Social Club, Sydney',
    time: '6:30 PM — 10:00 PM',
  },
]

export const latestNews: NewsItem[] = [
  {
    slug: 'rcoba-annual-general-meeting-2025-key-highlights',
    img: '',
    category: 'Community',
    title: 'RCOBA Annual General Meeting 2025 — Key Highlights',
    date: 'October 12, 2025',
    excerpt:
      "Members gathered for the Annual General Meeting to review the year's achievements, elect new committee members, and set the agenda for 2026.",
  },
  {
    slug: 'scholarship-programme-expands-four-new-recipients',
    img: '',
    category: 'Projects',
    title: 'Scholarship Programme Expands — Four New Recipients',
    date: 'September 5, 2025',
    excerpt:
      'We are proud to announce the expansion of our annual scholarship programme, adding four new recipients committed for the next four years.',
  },
  {
    slug: 'gala-dinner-2025-a-night-to-remember',
    img: '',
    category: 'Events',
    title: 'Gala Dinner 2025 — A Night to Remember',
    date: 'August 20, 2025',
    excerpt:
      'Over 200 alumni and guests attended the annual Gala Dinner, celebrating our community with cultural performances, fine dining, and live music.',
  },
]

export function getProjectBySlug(slug: string) {
  return communityProjects.find((p) => p.slug === slug)
}

export function getEventBySlug(slug: string) {
  return communityEvents.find((e) => e.slug === slug)
}

export function getNewsBySlug(slug: string) {
  return latestNews.find((n) => n.slug === slug)
}
