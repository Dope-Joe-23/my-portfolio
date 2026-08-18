import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Github,
  HeartPulse,
  LayoutDashboard,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Pencil,
  Plus,
  Send,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  longDescription: string;
  language: string;
  accent: string;
  featured?: boolean;
  health?: boolean;
  repo?: string;
  demo?: string;
  demoLabel?: string;
  role: string;
  year: string;
  outcome: string;
  tags: string[];
  challenge: string;
  approach: string;
  learnings: string[];
  screenshots?: string[];
};

const projects: Project[] = [
  {
    slug: 'dutyschedula',
    name: 'Dutyschedula',
    kicker: 'Health-tech · workflow tooling',
    description: 'A calmer way for charge nurses to build coverage they can stand behind.',
    longDescription: 'A scheduling workspace that turns a fragile handoff into a shared, auditable plan for the whole unit.',
    language: 'Private repo',
    accent: 'coral',
    featured: true,
    health: true,
    demo: 'https://nurse-roster-peach.vercel.app/',
    role: 'Product engineer · end to end',
    year: '2024 — now',
    outcome: 'Less coordination overhead at the start of a shift.',
    tags: ['React', 'TypeScript', 'Scheduling', 'Clinical ops'],
    challenge: 'Roster changes happen under pressure. Existing tools often make the person coordinating coverage carry the entire mental model in their head.',
    approach: 'I designed around the moment of decision: show staffing gaps early, make constraints legible, and preserve a history of why a shift changed. The interface is intentionally quiet so the important signal can surface.',
    learnings: ['Make the exception visible before the plan.', 'A good clinical workflow tool explains itself in one glance.', 'Private pilots need trust signals as much as feature depth.'],
    screenshots: ['/dutyschedula-screenshot.png'],
  },
  {
    slug: 'carestudy-automator',
    name: 'CareStudy Automator',
    kicker: 'Health-tech · featured case study',
    description: 'A focused TypeScript tool for turning clinical learning into a repeatable practice.',
    longDescription: 'A structured workspace for assembling care studies without losing the nuance that makes them useful.',
    language: 'TypeScript',
    accent: 'teal',
    featured: true,
    health: true,
    repo: 'https://github.com/Dope-Joe-23/carestudy-automator',
    role: 'Product engineer · research to build',
    year: '2024',
    outcome: 'Reduced the blank-page friction around case study creation.',
    tags: ['TypeScript', 'Education', 'Content systems'],
    challenge: 'Clinical learning is rich, but documenting it can become another administrative task. The product needed to provide structure without flattening the story.',
    approach: 'I treated the case study like a guided conversation: context first, then the decision points, then reflection. Small progressive disclosures keep the author moving while keeping the final artifact clear.',
    learnings: ['Structure should support expertise, not perform it.', 'Good forms have a rhythm: orient, ask, reassure.', 'The fastest path is often the one with the best defaults.'],
    screenshots: ['/carestudy-screenshot.png'],
  },
  {
    slug: 'church-attendance',
    name: 'Churchin',
    kicker: 'Operations · attendance tracking',
    description: 'A digital solution for tracking attendance and engaging the Wesleyan community across Sunyani.',
    longDescription: 'Serving the Wesleyan community across Sunyani and its surrounding areas — a digital solution for tracking attendance, engaging members, and strengthening the congregation.',
    language: 'JavaScript',
    accent: 'violet',
    repo: 'https://github.com/Dope-Joe-23/church-attendance',
    demo: 'https://church-attendance-wheat.vercel.app',
    role: 'Frontend engineer',
    year: '2023',
    outcome: 'A faster weekly check-in with fewer moving parts.',
    tags: ['JavaScript', 'Operations', 'Community'],
    screenshots: ['/wis-sunyani-screenshot.png'],
    challenge: 'The task is repetitive, but not unimportant. The tool had to be quick for regulars and understandable for anyone stepping in to help.',
    approach: 'I simplified the surface area to the handful of actions that happen every week and gave the records a clear visual home. The product works because it does not ask for attention it does not need.',
    learnings: ['Reliability is a feature people feel.', 'The common path should be obvious without training.', 'Respect recurring work with good defaults.'],
  },
  {
    slug: 'wig-store',
    name: 'Wiggle',
    kicker: 'Commerce · product browsing',
    description: 'A premium wig storefront with enough character to make browsing feel personal.',
    longDescription: 'A commerce interface exploring confidence, comparison, and a warmer path to purchase — premium quality wigs that bring out natural beauty.',
    language: 'TypeScript',
    accent: 'pink',
    repo: 'https://github.com/Dope-Joe-23/wig-store',
    demo: 'https://wig-store-seven.vercel.app',
    role: 'Frontend engineer',
    year: '2023',
    screenshots: ['/wig-store-screenshot.png'],
    outcome: 'More useful product comparison without adding noise.',
    tags: ['TypeScript', 'Commerce', 'Responsive UI'],
    challenge: 'Product confidence is difficult to build through a grid of thumbnails. Shoppers need useful details without losing the feeling of possibility.',
    approach: 'I gave product details room to breathe, paired comparison with strong imagery, and used a softer visual system to make the path to purchase feel considered.',
    learnings: ['Product pages are part reassurance, part imagination.', 'Responsive design is an editorial decision.', 'Details earn their place when they answer a real hesitation.'],
  },
  {
    slug: 'spotilite',
    name: 'Spotilite',
    kicker: 'Consumer · music discovery',
    description: 'A bright, low-friction music browser built around the next good find.',
    longDescription: 'A compact JavaScript exploration of discovery, pacing, and expressive visual hierarchy.',
    language: 'JavaScript',
    accent: 'yellow',
    repo: 'https://github.com/Dope-Joe-23/spotilite',
    demo: 'https://spotilite-seven.vercel.app',
    role: 'Frontend engineer',
    year: '2023',
    outcome: 'A playful interface that keeps discovery in motion.',
    tags: ['JavaScript', 'Discovery', 'Interaction'],
    challenge: 'Music apps can make exploration feel like catalog management. Spotilite needed a more immediate sense of movement and reward.',
    approach: 'I used large cover moments, quick filtering, and a deliberate content cadence to keep the eye moving. The visual language is more editorial than dashboard-like.',
    learnings: ['A little constraint gives discovery its spark.', 'Motion should clarify where to look next.', 'A small product can still have a point of view.'],
  },
  {
    slug: 'dopecb',
    name: 'DopeCB',
    kicker: 'Portfolio · CSS study',
    description: 'An earlier CSS portfolio study: the visual notebook that started the thread.',
    longDescription: 'A CSS-led portfolio experiment that made room for the visual side of building on the web.',
    language: 'CSS',
    accent: 'blue',
    repo: 'https://github.com/Dope-Joe-23/dopecb',
    role: 'Designer / developer',
    year: '2022',
    outcome: 'A visual foundation for a more intentional practice.',
    tags: ['CSS', 'Visual design', 'Portfolio'],
    challenge: 'A portfolio can easily become a list of claims. I wanted a place where the work, taste, and experiments could speak first.',
    approach: 'The study uses contrast, composition, and small details to make a simple collection feel authored. It is a reminder that code is also a material.',
    learnings: ['Taste is a technical advantage.', 'Presentation changes what people notice.', 'The portfolio should keep evolving with the work.'],
  },
];

const healthProjects = projects.filter((project) => project.health);

function PrimaryButton({ href, children, onClick, type = 'button' }: { href?: string; children: ReactNode; onClick?: () => void; type?: 'button' | 'submit' }) {
  const className = 'inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]';
  if (href) return <Link href={href} className={className} data-testid={`link-primary-${href.replaceAll('/', '-')}`}>{children}<ArrowUpRight size={16} /></Link>;
  return <button type={type} onClick={onClick} className={className} data-testid="button-primary-action">{children}<ArrowUpRight size={16} /></button>;
}

function TextLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  if (external) return <a href={href} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-1 font-semibold text-[hsl(var(--foreground))]" data-testid={`link-external-${href.split('/').pop()}`}>{children}<ExternalLink size={14} /></a>;
  return <Link href={href} className="link-underline inline-flex items-center gap-1 font-semibold text-[hsl(var(--foreground))]" data-testid={`link-text-${href.replaceAll('/', '-')}`}>{children}<ArrowUpRight size={14} /></Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <header className="relative z-20 border-b border-[hsl(var(--border)/.8)] bg-[hsl(var(--background)/.88)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" data-testid="link-logo">
          <span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] transition-transform group-hover:rotate-6"><HeartPulse size={19} strokeWidth={2.4} /></span>
          <span className="font-mono-custom text-[11px] font-medium uppercase tracking-[.18em] text-[hsl(var(--foreground))]">Joe Nyatefe<span className="text-[hsl(var(--primary))]">.</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {nav.map((item) => <Link key={item.href} href={item.href} className={`text-sm transition-colors hover:text-[hsl(var(--primary))] ${location === item.href ? 'font-semibold text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} data-testid={`link-nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}

        </nav>
        <button className="grid size-10 place-items-center rounded-full border border-[hsl(var(--border))] md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} data-testid="button-mobile-menu">{open ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      {open && <nav className="border-t border-[hsl(var(--border))] px-5 py-4 md:hidden" aria-label="Mobile navigation">
        <div className="flex flex-col gap-1">
          {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[hsl(var(--secondary))]" data-testid={`link-mobile-${item.label.toLowerCase()}`}>{item.label}</Link>)}

        </div>
      </nav>}
    </header>
  );
}

function Footer() {
  return <footer className="mt-24 border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)]">
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
      <div><div className="mb-4 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><HeartPulse size={16} /></span><span className="font-mono-custom text-xs uppercase tracking-[.16em]">Joe Nyatefe</span></div><p className="max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">Product-minded engineering for the places where software meets real life.</p></div>
      <div><p className="mb-4 font-mono-custom text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Explore</p><div className="flex flex-col gap-3 text-sm"><TextLink href="/projects">Projects</TextLink><TextLink href="/about">About the practice</TextLink><TextLink href="/contact">Start a conversation</TextLink></div></div>
      <div><p className="mb-4 font-mono-custom text-[10px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Availability</p><p className="text-sm leading-6">Open to health-tech roles, thoughtful product teams, and select consulting.</p><a href="mailto:hello@dopejoe23.dev" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))]" data-testid="link-footer-email"><Mail size={15} />hello@dopejoe23.dev</a></div>
    </div>
    <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-[hsl(var(--border))] px-5 py-5 text-xs text-[hsl(var(--muted-foreground))] md:flex-row md:items-center md:justify-between lg:px-8"><span>Health-tech portfolio — available for hire / consulting</span><span className="font-mono-custom">© {new Date().getFullYear()} Joe Nyatefe</span></div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="site-shell noise"><Header />{children}<Footer /></div>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-5 flex items-center gap-3 font-mono-custom text-[10px] font-medium uppercase tracking-[.2em] text-[hsl(var(--primary))]"><span className="h-px w-7 bg-[hsl(var(--accent))]" />{children}</div>;
}

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const accent = project.accent === 'coral' ? '#E98468' : project.accent === 'yellow' ? '#F3C46B' : project.accent === 'violet' ? '#9D9ADF' : project.accent === 'pink' ? '#D993A8' : project.accent === 'blue' ? '#82A9C7' : '#54B7AA';
  if (project.screenshots && project.screenshots.length > 0) {
    return <div className={`relative overflow-hidden rounded-[1.25rem] bg-[hsl(var(--secondary))] ${compact ? 'h-48' : ''}`}>
      <img src={project.screenshots[0]} alt={`${project.name} screenshot`} className="w-full h-auto" loading="lazy" />
    </div>;
  }
  return <div className={`relative overflow-hidden rounded-[1.25rem] bg-[#e5ece7] ${compact ? 'h-48' : 'min-h-[350px] md:min-h-[450px]'}`} style={{ '--project-accent': accent } as CSSProperties}>
    <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 76% 18%, ${accent} 0%, transparent 32%), radial-gradient(circle at 15% 80%, #b7d4cc 0%, transparent 34%)` }} />
    <div className="absolute -right-20 -top-24 size-72 rounded-full border-[34px] border-[var(--project-accent)] opacity-30" />
    <div className="absolute left-[8%] top-[12%] h-[76%] w-[84%] rounded-2xl border border-[#174e4b]/20 bg-[#f8f6ee]/85 p-3 shadow-[0_20px_45px_rgba(28,68,66,.12)] backdrop-blur-sm md:p-5">
      {project.health ? <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between border-b border-[#174e4b]/10 pb-3"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#e98468]" /><span className="font-mono-custom text-[8px] uppercase tracking-widest text-[#174e4b]">Unit 4 · today</span></div><span className="rounded-full bg-[#d9ebe4] px-2 py-1 font-mono-custom text-[8px] text-[#174e4b]">live plan</span></div>
        <div className="grid flex-1 grid-cols-[1fr_1.5fr] gap-3"><div className="rounded-lg bg-[#e0ede8] p-3"><div className="mb-4 font-mono-custom text-[8px] uppercase tracking-widest text-[#52716b]">coverage</div><div className="font-display text-4xl text-[#174e4b]">94<span className="text-2xl">%</span></div><div className="mt-2 h-1.5 rounded-full bg-[#bdd6cc]"><div className="h-full w-[94%] rounded-full bg-[#368f86]" /></div><div className="mt-5 space-y-2"><div className="h-2 w-4/5 rounded-full bg-[#b3cdc4]" /><div className="h-2 w-3/5 rounded-full bg-[#b3cdc4]" /></div></div><div className="space-y-2"><div className="rounded-lg border border-[#174e4b]/10 bg-white/70 p-2"><div className="mb-2 flex items-center justify-between"><span className="font-mono-custom text-[8px] text-[#174e4b]">07:00 — 15:00</span><span className="size-2 rounded-full bg-[#54b7aa]" /></div><div className="h-2 w-3/5 rounded-full bg-[#c1d8ce]" /><div className="mt-2 h-2 w-4/5 rounded-full bg-[#e1ebe6]" /></div><div className="rounded-lg border border-[#174e4b]/10 bg-white/70 p-2"><div className="mb-2 flex items-center justify-between"><span className="font-mono-custom text-[8px] text-[#174e4b]">15:00 — 23:00</span><span className="size-2 rounded-full bg-[#e98468]" /></div><div className="h-2 w-4/5 rounded-full bg-[#c1d8ce]" /><div className="mt-2 h-2 w-2/5 rounded-full bg-[#e1ebe6]" /></div><div className="rounded-lg border border-dashed border-[#368f86]/40 p-3"><div className="flex items-center gap-2 text-[9px] text-[#368f86]"><Plus size={12} />1 open shift</div></div></div></div>
      </div> : <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between"><span className="font-mono-custom text-[8px] uppercase tracking-widest text-[#174e4b]">{project.name} / explore</span><ArrowUpRight size={15} className="text-[#174e4b]" /></div>
        <div className="relative grid grid-cols-3 gap-2 md:gap-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="aspect-[.78] rounded-lg p-2" style={{ background: item % 2 ? `${accent}cc` : '#d9e7df' }}><div className="mt-auto h-1.5 w-3/4 rounded-full bg-[#174e4b]/25" /></div>)}</div>
        <div className="flex items-end justify-between"><div><div className="font-display text-4xl text-[#174e4b]">{project.name}</div><div className="mt-1 font-mono-custom text-[8px] uppercase tracking-widest text-[#52716b]">{project.language} / interface study</div></div><div className="grid size-9 place-items-center rounded-full bg-[#174e4b] text-[#f8f6ee]"><ChevronRight size={16} /></div></div>
      </div>}
    </div>
  </div>;
}

function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return <article className="card-lift group overflow-hidden rounded-[1.25rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))]" data-testid={`card-project-${project.slug}`}>
    <ProjectVisual project={project} compact />
    <div className="p-5 md:p-6"><div className="mb-3 flex items-start justify-between gap-3"><div><p className="font-mono-custom text-[10px] uppercase tracking-[.15em] text-[hsl(var(--primary))]">{project.kicker}</p><h3 className="mt-2 font-display text-3xl leading-none">{project.name}</h3></div><span className="rounded-full bg-[hsl(var(--secondary))] px-2.5 py-1 font-mono-custom text-[10px] text-[hsl(var(--muted-foreground))]">{String(index + 1).padStart(2, '0')}</span></div><p className="mb-5 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">{project.description}</p><div className="flex flex-wrap gap-2">{project.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-[hsl(var(--border))] px-2.5 py-1 text-[11px] text-[hsl(var(--muted-foreground))]">{tag}</span>)}</div><Link href={`/projects/${project.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))]" data-testid={`link-project-${project.slug}`}>Read case study <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div>
  </article>;
}

function HeroVisual() {
  return <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)] md:min-h-[550px]">
    <img src="/hero-portrait.jpg" alt="Joe Nyatefe — portrait" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#174e4b]/90 via-[#174e4b]/40 to-transparent" />
    <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-end p-5 md:min-h-[550px] md:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono-custom text-[10px] uppercase tracking-[.18em] text-[#b9d3ca]">Joe Nyatefe</p>
          <p className="mt-2 max-w-[280px] text-sm leading-5 text-[#f4f0e5]">Interfaces for the handoffs, decisions, and human moments that make care work.</p>
        </div>
        <span className="font-display text-6xl leading-none text-[#f3c46b] md:text-8xl">23</span>
      </div>
    </div>
  </div>;
}

function Home() {
  return <Shell>
    <main>
      <section className="paper-grid relative">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="reveal"><SectionLabel>Product engineer · health-tech curious</SectionLabel><h1 className="max-w-xl font-display text-6xl leading-[.92] tracking-[-.03em] md:text-8xl">Make care<br /><em className="text-[hsl(var(--primary))]">easier to move</em><br />through.</h1><p className="mt-7 max-w-md text-base leading-7 text-[hsl(var(--muted-foreground))]">I’m Joe Nyatefe — a developer building thoughtful software for the people carrying care, coordination, and too many tabs.</p><div className="mt-8 flex flex-wrap gap-3"><PrimaryButton href="/projects">View Health Projects</PrimaryButton></div><div className="mt-12 flex items-center gap-4 border-t border-[hsl(var(--border))] pt-5"><span className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Currently exploring</span><span className="text-sm font-semibold">clinical workflow tooling</span></div></div>
          <div className="reveal reveal-delay-2"><HeroVisual /></div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-2 border-t border-[hsl(var(--border))] px-5 py-8 md:grid-cols-4 lg:px-8"><div><div className="font-display text-4xl text-[hsl(var(--primary))]">06</div><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">selected builds</p></div><div><div className="font-display text-4xl text-[hsl(var(--primary))]">02</div><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">health-tech studies</p></div><div className="mt-5 md:mt-0"><div className="font-display text-4xl text-[hsl(var(--primary))]">∞</div><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">questions worth asking</p></div><div className="mt-5 md:mt-0"><div className="font-display text-4xl text-[hsl(var(--primary))]">23</div><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">a name, not a brand wall</p></div></div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><SectionLabel>Selected work</SectionLabel><h2 className="max-w-xl font-display text-5xl leading-none md:text-6xl">Useful by design.<br /><em className="text-[hsl(var(--primary))]">Specific by default.</em></h2></div><TextLink href="/projects">See all projects</TextLink></div><div className="mt-10 grid gap-6 lg:grid-cols-2">{healthProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div></section>
      <section className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[.75fr_1.25fr] lg:px-8 lg:py-28"><div><SectionLabel>How I work</SectionLabel><p className="max-w-xs text-sm leading-6 text-[hsl(var(--primary-foreground)/.72)]">A practical loop for complex products, with enough room for the human context.</p></div><div className="divide-y divide-[hsl(var(--primary-foreground)/.2)]">{[['01', 'Listen for the friction', 'Before I reach for a component, I want to know where the work gets stuck and who absorbs the cost.'], ['02', 'Make the system legible', 'Good interfaces expose the important relationship: what changed, what matters, and what can happen next.'], ['03', 'Ship the smallest honest version', 'I prefer a useful first loop to a polished guess. The product teaches us where to go from there.']].map(([number, title, copy]) => <div key={number} className="grid gap-3 py-6 md:grid-cols-[60px_1fr_1.2fr] md:gap-8"><span className="font-mono-custom text-xs text-[hsl(var(--accent))]">{number}</span><h3 className="font-display text-3xl">{title}</h3><p className="text-sm leading-6 text-[hsl(var(--primary-foreground)/.7)]">{copy}</p></div>)}</div></div></section>
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28"><div className="rounded-[1.75rem] bg-[hsl(var(--accent))] p-7 md:p-12"><div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><SectionLabel>A note from the desk</SectionLabel><blockquote className="max-w-2xl font-display text-4xl leading-[.98] md:text-6xl">“The best clinical software does not ask people to become software people.”</blockquote></div><Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold" data-testid="link-home-about">Read the approach <ArrowUpRight size={16} /></Link></div></div></section>
      <section className="mx-auto max-w-6xl px-5 pb-4 lg:px-8"><div className="flex flex-col items-start justify-between gap-7 rounded-[1.5rem] border border-[hsl(var(--border))] p-7 md:flex-row md:items-center md:p-10"><div><SectionLabel>Have a real workflow in mind?</SectionLabel><h2 className="font-display text-4xl md:text-5xl">Let’s make the next<br /><em className="text-[hsl(var(--primary))]">step feel obvious.</em></h2></div><PrimaryButton href="/contact">Start a conversation</PrimaryButton></div></section>
    </main>
  </Shell>;
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: ReactNode; copy: string }) {
  return <section className="paper-grid border-b border-[hsl(var(--border))]"><div className="mx-auto max-w-6xl px-5 pb-16 pt-16 lg:px-8 lg:pb-20 lg:pt-24"><SectionLabel>{eyebrow}</SectionLabel><h1 className="max-w-4xl font-display text-6xl leading-[.92] md:text-8xl">{title}</h1><p className="mt-7 max-w-xl text-base leading-7 text-[hsl(var(--muted-foreground))]">{copy}</p></div></section>;
}

function ProjectsPage() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Health-tech', 'TypeScript', 'JavaScript', 'CSS'];
  const visible = projects.filter((project) => filter === 'All' || (filter === 'Health-tech' ? project.health : project.language === filter));
  return <Shell><main><PageIntro eyebrow="The work / 06 projects" title={<>Built for the <em className="text-[hsl(var(--primary))]">actual</em> moment.</>} copy="A mix of health-tech explorations, workflow tools, and visual studies. Each one started with a behavior worth making easier." /><section className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16"><div className="mb-10 flex flex-col gap-5 border-b border-[hsl(var(--border))] pb-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-2"><Filter size={16} className="text-[hsl(var(--primary))]" /><span className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Filter by</span></div><div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${filter === item ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]'}`} aria-pressed={filter === item} data-testid={`button-filter-${item.toLowerCase().replace('-', '-')}`}>{item}</button>)}</div></div><div className="grid gap-6 md:grid-cols-2">{visible.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>{visible.length === 0 && <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] p-16 text-center"><SlidersHorizontal className="mx-auto mb-4 text-[hsl(var(--primary))]" /><p className="font-display text-3xl">No projects in this filter yet.</p></div>}</section></main></Shell>;
}

function AboutPage() {
  const skills = ['Product thinking', 'React & TypeScript', 'Workflow design', 'Accessible UI', 'Systems thinking', 'Clinical context'];
  return <Shell><main><PageIntro eyebrow="About / the practice" title={<>Software should carry<br /><em className="text-[hsl(var(--primary))]">less of the burden.</em></>} copy="I’m a developer who likes working close to the problem: finding the invisible friction, making it legible, and building a calm path through it." /><section className="mx-auto grid max-w-6xl gap-14 px-5 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24"><div><SectionLabel>The short version</SectionLabel><div className="space-y-6 text-lg leading-8 text-[hsl(var(--muted-foreground))]"><p>My work sits at the intersection of product engineering and care delivery. I’m interested in the systems people use when time is limited, stakes are high, and a “small” bit of friction compounds all day.</p><p>That means I care about the interaction details, but also the decision behind them: what must be visible, what can be deferred, and how the product earns trust from the people using it.</p><p>I bring a builder’s bias toward momentum and a researcher’s respect for context. The result should feel technically sound, emotionally intelligent, and easy to pick up.</p></div><div className="mt-9 flex flex-wrap gap-3"><a href="mailto:hello@dopejoe23.dev?subject=Resume%20request" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="link-download-resume">Request resume <Download size={15} /></a><TextLink href="/contact">Work together</TextLink></div></div><div className="rounded-[1.5rem] bg-[hsl(var(--secondary))] p-7 md:p-9"><SectionLabel>What I bring</SectionLabel><div className="grid gap-4">{skills.map((skill, index) => <div key={skill} className="flex items-center gap-4 border-b border-[hsl(var(--foreground)/.12)] pb-4 text-sm font-semibold"><span className="font-mono-custom text-xs text-[hsl(var(--primary))]">0{index + 1}</span>{skill}<Check size={15} className="ml-auto text-[hsl(var(--primary))]" /></div>)}</div><div className="mt-12 rounded-xl bg-[hsl(var(--card)/.55)] p-5"><div className="mb-3 flex items-center gap-2 font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--primary))]"><MapPin size={14} />Available remotely</div><p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">For teams working on the future of care, coordination, and useful software.</p></div></div></section><section className="bg-[hsl(var(--secondary)/.5)]"><div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24"><div className="grid gap-10 md:grid-cols-3"><div><SectionLabel>Focus areas</SectionLabel><h2 className="font-display text-5xl">Where I’m<br /><em className="text-[hsl(var(--primary))]">most useful.</em></h2></div>{[['01', 'Clinical workflow', 'Roster, handoff, and documentation tools that respect the pace of care.'], ['02', 'Product foundations', 'Clear systems, accessible components, and the connective tissue that keeps a product coherent.'], ['03', 'Early product bets', 'The first thoughtful version of an idea — enough signal to learn, enough care to keep.']].map(([number, title, copy]) => <div key={number} className="border-t border-[hsl(var(--border))] pt-5"><span className="font-mono-custom text-xs text-[hsl(var(--primary))]">{number}</span><h3 className="mt-12 font-display text-3xl">{title}</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{copy}</p></div>)}</div></div></section></main></Shell>;
}

function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFound />;
  return <Shell><main><div className="mx-auto max-w-6xl px-5 pt-10 lg:px-8 lg:pt-14"><Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" data-testid="link-back-projects"><ArrowLeft size={15} />All projects</Link></div><section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-12 lg:grid-cols-[.82fr_1.18fr] lg:items-end lg:px-8 lg:pb-24 lg:pt-16"><div><SectionLabel>{project.kicker}</SectionLabel><h1 className="font-display text-7xl leading-[.87] md:text-9xl">{project.name}</h1><p className="mt-7 max-w-md text-base leading-7 text-[hsl(var(--muted-foreground))]">{project.longDescription}</p><div className="mt-8 flex flex-wrap gap-3">{project.repo && <a href={project.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid={`link-case-repo-${project.slug}`}><Github size={16} />View repository <ExternalLink size={14} /></a>}{project.demo ? <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-sm font-semibold" data-testid={`link-case-demo-${project.slug}`}>Open live demo <ExternalLink size={14} /></a> : project.demoLabel && <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 text-sm font-semibold text-[hsl(var(--muted-foreground))]"><Clock3 size={15} />{project.demoLabel}</span>}</div></div><ProjectVisual project={project} /></section><section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)]"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-8 md:grid-cols-4 lg:px-8"><div><span className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Role</span><p className="mt-2 text-sm font-semibold">{project.role}</p></div><div><span className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Built</span><p className="mt-2 text-sm font-semibold">{project.language}</p></div><div><span className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Timeline</span><p className="mt-2 text-sm font-semibold">{project.year}</p></div><div><span className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Outcome</span><p className="mt-2 text-sm font-semibold">{project.outcome}</p></div></div></section><section className="mx-auto grid max-w-6xl gap-14 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-24"><div><SectionLabel>Inside the build</SectionLabel><p className="max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">A closer look at the question, the shape of the solution, and what stayed with me.</p><div className="mt-12 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full bg-[hsl(var(--secondary))] px-3 py-1.5 text-xs font-semibold">{tag}</span>)}</div></div><div className="space-y-14"><div><h2 className="font-display text-4xl md:text-5xl">The friction</h2><p className="mt-4 max-w-2xl text-base leading-8 text-[hsl(var(--muted-foreground))]">{project.challenge}</p></div><div><h2 className="font-display text-4xl md:text-5xl">The approach</h2><p className="mt-4 max-w-2xl text-base leading-8 text-[hsl(var(--muted-foreground))]">{project.approach}</p></div><div className="rounded-2xl border-l-4 border-[hsl(var(--accent))] bg-[hsl(var(--secondary)/.5)] p-6"><p className="mb-4 font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--primary))]">What stayed with me</p><ul className="space-y-3">{project.learnings.map((learning) => <li key={learning} className="flex gap-3 text-sm leading-6"><Check size={16} className="mt-1 shrink-0 text-[hsl(var(--primary))]" />{learning}</li>)}</ul></div></div></section>{project.screenshots && project.screenshots.length > 0 && <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20"><SectionLabel>Screenshots</SectionLabel><div className="grid gap-6 md:grid-cols-2">{project.screenshots.map((src, i) => <div key={i} className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.3)]"><img src={src} alt={`${project.name} screenshot ${i + 1}`} className="w-full object-cover" loading="lazy" /></div>)}</div></section>}<section className="mx-auto max-w-6xl px-5 lg:px-8"><div className="flex flex-col items-start justify-between gap-5 rounded-[1.5rem] bg-[hsl(var(--primary))] p-7 text-[hsl(var(--primary-foreground))] md:flex-row md:items-center md:p-10"><div><p className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--accent))]">Keep exploring</p><h2 className="mt-3 font-display text-4xl">There’s more in the notebook.</h2></div><Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-5 py-3 text-sm font-semibold text-[hsl(var(--foreground))]" data-testid="link-case-all-projects">Browse all work <ArrowRight size={16} /></Link></div></section></main></Shell>;
}

function CustomizePage() {
  const [previewMode, setPreviewMode] = useState<'live' | 'draft'>('live');
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const editableSections = ['Homepage hero', 'Featured work', 'About snippet', 'Availability'];
  return <Shell><main><PageIntro eyebrow="Customize / content preview" title={<>A small window<br />into the <em className="text-[hsl(var(--primary))]">next version.</em></>} copy="This admin-style preview shows how future CMS controls could keep the portfolio current without losing its voice." /><section className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16"><div className="overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow-soft)]"><div className="flex flex-col gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] p-4 md:flex-row md:items-center md:justify-between md:px-6"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><LayoutDashboard size={17} /></div><div><p className="text-sm font-semibold">Portfolio content studio</p><p className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Joe Nyatefe / homepage</p></div></div><div className="flex items-center gap-2"><div className="flex rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1">{[['live', 'Published'], ['draft', 'Draft preview']].map(([value, label]) => <button key={value} onClick={() => setPreviewMode(value as 'live' | 'draft')} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${previewMode === value ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`} aria-pressed={previewMode === value} data-testid={`button-preview-${value}`}>{label}</button>)}</div><button onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 py-2 text-xs font-bold" data-testid="button-save-content">{saved ? <Check size={14} /> : <Sparkles size={14} />}{saved ? 'Saved locally' : 'Save changes'}</button></div></div><div className="grid lg:grid-cols-[220px_1fr]"><aside className="border-b border-[hsl(var(--border))] p-4 lg:border-b-0 lg:border-r lg:p-5"><p className="mb-3 px-2 font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Sections</p>{editableSections.map((item, index) => <button key={item} onClick={() => setActiveSection(index)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm ${activeSection === index ? 'bg-[hsl(var(--secondary))] font-semibold' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary)/.6)]'}`} data-testid={`button-section-${index}`}>{activeSection === index ? <Pencil size={14} className="text-[hsl(var(--primary))]" /> : <Circle size={8} className="ml-1 mr-1" />}{item}<ChevronRight size={14} className="ml-auto" /></button>)}</aside><div className="grid gap-8 p-5 md:p-8 xl:grid-cols-[1fr_330px]"><div><div className="mb-6 flex items-center justify-between"><div><p className="font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--primary))]">Editing {editableSections[activeSection].toLowerCase()}</p><h2 className="mt-2 font-display text-4xl">Make care easier to move through.</h2></div><span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-1 font-mono-custom text-[10px]">{previewMode === 'live' ? 'LIVE' : 'DRAFT'}</span></div><div className="space-y-5"><label className="block"><span className="mb-2 block text-xs font-semibold">Eyebrow</span><input defaultValue="Product engineer · health-tech curious" className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm" data-testid="input-customize-eyebrow" /></label><label className="block"><span className="mb-2 block text-xs font-semibold">Headline</span><textarea defaultValue="Make care easier to move through." rows={3} className="w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm leading-6" data-testid="input-customize-headline" /></label><label className="block"><span className="mb-2 block text-xs font-semibold">Supporting copy</span><textarea defaultValue="Interfaces for the handoffs, decisions, and human moments that make care work." rows={4} className="w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm leading-6" data-testid="input-customize-copy" /></label></div></div><div className="rounded-2xl bg-[#174e4b] p-5 text-[#f4f0e5]"><div className="mb-5 flex items-center justify-between"><span className="font-mono-custom text-[9px] uppercase tracking-widest text-[#b9d3ca]">Preview</span><Eye size={15} className="text-[#f3c46b]" /></div><div className="rounded-xl bg-[#f4f0e5] p-4 text-[#174e4b]"><span className="font-mono-custom text-[8px] uppercase tracking-widest">Product engineer · health-tech curious</span><p className="mt-8 font-display text-4xl leading-[.92]">Make care<br /><em className="text-[#368f86]">easier to move</em><br />through.</p><div className="mt-7 h-2 w-24 rounded-full bg-[#e98468]" /></div><p className="mt-5 text-xs leading-5 text-[#b9d3ca]">Changes are preview-only for now. Your future CMS can connect this panel to a publishing workflow.</p></div></div></div></div></section></main></Shell>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <Shell><main><PageIntro eyebrow="Contact / say hello" title={<>Let’s talk about<br /><em className="text-[hsl(var(--primary))]">useful work.</em></>} copy="Tell me what is getting in the way, what you are building, or what you want to make more legible. A thoughtful note is enough to start." /><section className="mx-auto grid max-w-6xl gap-14 px-5 py-16 lg:grid-cols-[1fr_.72fr] lg:px-8 lg:py-24"><div className="rounded-[1.5rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-9"><div className="mb-8 flex items-center justify-between"><div><SectionLabel>Send a note</SectionLabel><h2 className="font-display text-4xl">No pitch deck required.</h2></div><Send size={25} className="text-[hsl(var(--accent))]" /></div>{sent ? <div className="rounded-xl bg-[hsl(var(--secondary))] p-7" role="status" data-testid="status-contact-success"><div className="mb-4 grid size-11 place-items-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Check size={21} /></div><h3 className="font-display text-3xl">Message received.</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Thanks for reaching out. This demo form is wired for feedback; in production it can route straight to the inbox.</p><button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-[hsl(var(--primary))] link-underline" data-testid="button-send-another">Send another note</button></div> : <form onSubmit={submit} className="space-y-5"><div className="grid gap-5 md:grid-cols-2"><label><span className="mb-2 block text-xs font-semibold">Your name</span><input required placeholder="Ari or Dr. Morgan" className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm placeholder:text-[hsl(var(--muted-foreground)/.65)]" data-testid="input-contact-name" /></label><label><span className="mb-2 block text-xs font-semibold">Email address</span><input required type="email" placeholder="you@team.com" className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm placeholder:text-[hsl(var(--muted-foreground)/.65)]" data-testid="input-contact-email" /></label></div><label><span className="mb-2 block text-xs font-semibold">What are you working on?</span><select className="w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm" data-testid="select-contact-topic"><option>Health-tech product</option><option>Product engineering role</option><option>Workflow consulting</option><option>Something else</option></select></label><label><span className="mb-2 block text-xs font-semibold">Your note</span><textarea required rows={6} placeholder="A little context goes a long way..." className="w-full resize-none rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm leading-6 placeholder:text-[hsl(var(--muted-foreground)/.65)]" data-testid="textarea-contact-message" /></label><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="button-submit-contact">Send message <ArrowUpRight size={16} /></button></form>}</div><aside><SectionLabel>Elsewhere</SectionLabel><h2 className="font-display text-4xl">A few open<br /><em className="text-[hsl(var(--primary))]">channels.</em></h2><div className="mt-9 divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">{[['Email', 'hello@dopejoe23.dev', 'mailto:hello@dopejoe23.dev', Mail], ['GitHub', 'github.com/Dope-Joe-23', 'https://github.com/Dope-Joe-23', Github], ['LinkedIn', 'Connect professionally', 'https://www.linkedin.com', Linkedin]].map(([label, value, href, Icon]) => <a key={label as string} href={href as string} target={(href as string).startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-4 py-5 transition-colors hover:text-[hsl(var(--primary))]" data-testid={`link-contact-${(label as string).toLowerCase()}`}><span className="grid size-9 place-items-center rounded-lg bg-[hsl(var(--secondary))]"><Icon size={16} /></span><span><span className="block font-mono-custom text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{label as string}</span><span className="mt-1 block text-sm font-semibold">{value as string}</span></span><ArrowUpRight size={15} className="ml-auto" /></a>)}</div><div className="mt-10 rounded-xl bg-[hsl(var(--accent))] p-5"><div className="flex items-center gap-3"><Activity size={17} /><span className="font-mono-custom text-[10px] uppercase tracking-widest">Current status</span></div><p className="mt-4 font-display text-2xl">Open to the right conversation.</p></div></aside></section></main></Shell>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route path="/about" component={AboutPage} /><Route path="/projects" component={ProjectsPage} /><Route path="/projects/:slug" component={CaseStudyPage} /><Route path="/contact" component={ContactPage} /><Route path="/customize" component={CustomizePage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;