import type { ReactNode } from 'react'

type Project = {
  number: string
  title: string
  type: string
  description: string
  tags: string[]
  color: string
  mark: ReactNode
}

const projects: Project[] = [
  {
    number: '01',
    title: 'Field Notes',
    type: 'Editorial platform',
    description: 'A calm, tactile reading experience for independent writers and the ideas that stay with you.',
    tags: ['Product design', 'React', 'Strategy'],
    color: 'project--blue',
    mark: <span className="field-mark">FN</span>,
  },
  {
    number: '02',
    title: 'Open Table',
    type: 'Community tool',
    description: 'Making neighborhood food initiatives easier to find, join, and sustain together.',
    tags: ['UX research', 'Web app', 'Identity'],
    color: 'project--orange',
    mark: <span className="table-mark"><i /><i /><i /><i /></span>,
  },
  {
    number: '03',
    title: 'Common Ground',
    type: 'Climate data',
    description: 'Turning complex local climate data into clear choices for the people shaping tomorrow.',
    tags: ['Data viz', 'Art direction', 'Prototype'],
    color: 'project--green',
    mark: <span className="ground-mark">CG</span>,
  },
]

const experience = [
  { year: '2023 - now', role: 'Independent designer & developer', place: 'Self-employed / Copenhagen' },
  { year: '2020 - 23', role: 'Senior product designer', place: 'Northstar Studio / Remote' },
  { year: '2017 - 20', role: 'Designer, digital experiences', place: 'Studio Parallel / Aarhus' },
]

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>
}

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Alex Morgan home">AM<span>.</span></a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
        </nav>
        <a className="header-contact" href="mailto:hello@alexmorgan.design">Let's talk <ArrowIcon /></a>
      </header>

      <main id="top">
        <section className="hero section-wrap" aria-labelledby="intro-title">
          <div className="hero-kicker"><span className="status-dot" /> Available for select projects <span className="hero-location">Based in Copenhagen, working everywhere</span></div>
          <h1 id="intro-title">I make digital<br /><em>things</em> feel human.</h1>
          <div className="hero-bottom">
            <p className="hero-summary">Product designer and front-end developer focused on thoughtful interfaces, clear systems, and work with a point of view.</p>
            <a className="circle-link" href="#work" aria-label="Scroll to selected work"><span>Scroll<br />to see</span><ArrowIcon /></a>
          </div>
        </section>

        <section className="work-section section-wrap" id="work" aria-labelledby="work-title">
          <div className="section-heading"><p className="eyebrow">Selected work / 2021 - 2024</p><h2 id="work-title">A few things<br /><em>I've shaped.</em></h2></div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.title}>
                <div className={`project-art ${project.color}`} aria-hidden="true"><span className="project-number">{project.number}</span>{project.mark}<span className="art-caption">A study in <i>{project.title.toLowerCase()}</i></span></div>
                <div className="project-copy">
                  <p className="project-type">{project.type}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <a className="project-link" href={`mailto:hello@alexmorgan.design?subject=${encodeURIComponent(project.title)}`}>View case study <ArrowIcon /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
          <div className="about-intro"><p className="eyebrow">A little about me</p><h2 id="about-title">Curious by nature,<br /><em>careful by practice.</em></h2></div>
          <div className="about-copy"><p className="lead">I am Alex, a designer and developer who likes working where visual thinking meets useful technology.</p><p>My best work starts with listening. I work with people and teams to turn fuzzy problems into clear, considered experiences. I care about the details, but I care even more about what those details make possible.</p><div className="skill-group"><span>My toolkit</span><p>Figma / React / TypeScript / Prototyping / Design systems / Writing</p></div></div>
        </section>

        <section className="experience-section section-wrap" id="experience" aria-labelledby="experience-title">
          <div className="section-heading"><p className="eyebrow">The path so far</p><h2 id="experience-title">Experience<br /><em>with intention.</em></h2></div>
          <div className="timeline">{experience.map((item) => <div className="timeline-item" key={item.year}><span className="timeline-year">{item.year}</span><div><h3>{item.role}</h3><p>{item.place}</p></div><ArrowIcon /></div>)}</div>
        </section>

        <section className="contact-section section-wrap" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow">Have a good one?</p><h2 id="contact-title">Let's make<br /><em>something useful.</em></h2>
          <a className="email-link" href="mailto:hello@alexmorgan.design">hello@alexmorgan.design <ArrowIcon /></a>
          <div className="contact-meta"><span>Currently available for freelance and collaborative projects.</span><span className="social-links"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a><a href="#top">Back to top ↑</a></span></div>
        </section>
      </main>
      <footer><span>© 2024 Alex Morgan</span><span>Designed & built with care</span></footer>
    </div>
  )
}

export default App
