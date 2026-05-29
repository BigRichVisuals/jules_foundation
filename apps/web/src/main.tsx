import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Mail,
  Menu,
  Quote,
  School,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import logoUrl from "../../../assets/images/jules_foundation_logo.png";
import "./styles.css";

type SupportItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const captions = [
  "Empowering Children Through Education",
  "Supporting Families When It Matters Most",
  "Creating Opportunities for a Better Future",
  "Hope, Guidance, and Community",
  "Together We Can Make a Difference"
];

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2200&q=82",
    alt: "Children learning together in a classroom"
  },
  {
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=82",
    alt: "Community members gathered around a table"
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2200&q=82",
    alt: "Students collaborating with books and laptops"
  }
];

const supportItems: SupportItem[] = [
  {
    title: "Education Support",
    description: "School supplies, tutoring resources, scholarships, and college-readiness help for young learners.",
    icon: GraduationCap
  },
  {
    title: "Family Assistance",
    description: "Responsive support for families navigating urgent financial hardship and unstable moments.",
    icon: HandHeart
  },
  {
    title: "Community Outreach",
    description: "Local programs, mentorship, and partnerships that keep families connected to practical support.",
    icon: Users
  }
];

const priorities = [
  "School supplies and educational resources",
  "College and university assistance",
  "Emergency financial support for families",
  "Mentorship and guidance programs",
  "Community outreach initiatives"
];

const testimonials = [
  {
    quote:
      "The support gave our family breathing room and helped our child stay focused on school during a difficult season.",
    attribution: "Parent participant"
  },
  {
    quote:
      "Jules Foundation shows up with care, dignity, and a clear belief that opportunity should never depend on circumstance.",
    attribution: "Community partner"
  }
];

function App() {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [contactStatus, setContactStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % captions.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

    if (!apiBaseUrl) {
      setContactStatus("Message delivery is not connected yet. Please check back soon.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: "Website inquiry",
      message: String(form.get("message") ?? "")
    };

    try {
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/contact`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-correlation-id": crypto.randomUUID()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      event.currentTarget.reset();
      setContactStatus("Thanks. Your message was received by Jules Foundation.");
    } catch {
      setContactStatus("Something went wrong sending the message. Please try again later.");
    }
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand-mark" href="#home" onClick={closeMenu} aria-label="Jules Foundation home">
          <img src={logoUrl} alt="" />
          <span>Jules Foundation</span>
        </a>

        <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          <a href="#home" onClick={closeMenu}>
            Home
          </a>
          <a href="#about" onClick={closeMenu}>
            About Us
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <a className="nav-donate" href="#donate" onClick={closeMenu}>
            Donate
          </a>
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section" aria-label="Jules Foundation home">
          <div className="hero-slides" aria-hidden="true">
            {slides.map((slide, index) => (
              <div
                className={index === activeSlide % slides.length ? "hero-slide is-active" : "hero-slide"}
                key={slide.image}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}
          </div>
          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="hero-logo">
              <img src={logoUrl} alt="Jules Foundation logo" />
            </div>
            <p className="eyebrow">Guidance, Support, and Hope</p>
            <h1>Jules Foundation</h1>
            <p className="hero-subheading">Building Hope for Tomorrow</p>
            <p className="hero-intro">
              The Jules Foundation is dedicated to helping children and families overcome life&apos;s challenges by providing
              support for education, financial hardships, and opportunities for a brighter future.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#donate">
                Donate Now
                <HeartHandshake size={20} />
              </a>
              <a className="button button-secondary" href="#about">
                Learn More
                <ArrowRight size={20} />
              </a>
            </div>
          </div>

          <div className="caption-panel" aria-live="polite">
            <span>{captions[activeSlide]}</span>
            <div className="slide-dots" aria-hidden="true">
              {captions.map((caption, index) => (
                <button
                  className={index === activeSlide ? "dot is-active" : "dot"}
                  key={caption}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show message ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="about-section section-band">
          <div className="section-grid">
            <div className="section-copy">
              <p className="eyebrow">About Us</p>
              <h2>Changing lives through opportunity.</h2>
              <p>
                At the Jules Foundation, our mission is to provide meaningful support to children and families facing
                educational and financial challenges. Through scholarships, community programs, and compassionate assistance,
                we aim to create lasting change and open doors to brighter futures.
              </p>
              <p>
                We envision a future where every child has the opportunity to learn, grow, and achieve their dreams regardless
                of financial circumstances.
              </p>
            </div>
            <div className="image-feature">
              <img
                src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1400&q=82"
                alt="A community group sharing a supportive moment"
              />
              <div className="image-note">
                <School size={22} />
                <span>Investing in futures with dignity and care.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="programs-section" aria-labelledby="programs-heading">
          <div className="section-heading">
            <p className="eyebrow">What We Support</p>
            <h2 id="programs-heading">Practical help where it matters.</h2>
          </div>
          <div className="program-grid">
            {supportItems.map((item) => {
              const Icon = item.icon;
              return (
                <article className="program-card" key={item.title}>
                  <div className="program-icon">
                    <Icon size={28} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>

          <div className="priority-strip">
            {priorities.map((priority) => (
              <div className="priority-item" key={priority}>
                <ShieldCheck size={18} />
                <span>{priority}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="impact-section" aria-label="Impact statistics">
          <div className="impact-panel">
            <div>
              <span className="stat-number">250+</span>
              <span className="stat-label">Families Helped</span>
            </div>
            <div>
              <span className="stat-number">75+</span>
              <span className="stat-label">Scholarships Awarded</span>
            </div>
            <div>
              <span className="stat-number">40+</span>
              <span className="stat-label">Volunteers Involved</span>
            </div>
          </div>
        </section>

        <section className="testimonials-section" aria-labelledby="testimonials-heading">
          <div className="section-heading">
            <p className="eyebrow">Community Voices</p>
            <h2 id="testimonials-heading">Support that feels personal.</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <figure className="testimonial-card" key={testimonial.attribution}>
                <Quote size={28} />
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>{testimonial.attribution}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="donate" className="cta-section">
          <div className="cta-content">
            <p className="eyebrow">Make a Difference Today</p>
            <h2>Your support helps provide hope, education, and stability.</h2>
            <p>
              Donation processing is coming soon. For now, this button marks the future giving flow and keeps the site ready
              for a secure donation provider.
            </p>
          </div>
          <div className="cta-actions">
            <button className="button button-primary" type="button" disabled>
              Donate Now
              <HeartHandshake size={20} />
            </button>
            <a className="button button-secondary dark" href="#contact">
              Contact Us
              <Mail size={20} />
            </a>
          </div>
        </section>

        <section id="contact" className="contact-section section-band">
          <div className="contact-layout">
            <div className="contact-copy">
              <p className="eyebrow">Contact</p>
              <h2>Let&apos;s build something hopeful together.</h2>
              <p>
                Reach out about partnerships, volunteer opportunities, education support, or family assistance. Messages are
                routed through the Jules Foundation backend when the public API endpoint is connected.
              </p>
              <div className="contact-note">
                <Mail size={20} />
                <span>Use the secure form for all website inquiries.</span>
              </div>
            </div>

            <form className="contact-form" aria-label="Contact form" onSubmit={handleContactSubmit}>
              <label>
                Name
                <input type="text" name="name" placeholder="Your name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="Your email address" required />
              </label>
              <label>
                Message
                <textarea name="message" rows={5} placeholder="How can Jules Foundation help?" required minLength={10} />
              </label>
              <button className="button button-primary" type="submit">
                Send Message
                <ArrowRight size={20} />
              </button>
              {contactStatus ? <p className="form-status">{contactStatus}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src={logoUrl} alt="" />
          <div>
            <strong>Jules Foundation</strong>
            <span>Building Hope for Tomorrow</span>
          </div>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#donate">Donate</a>
        </div>
        <p>© {new Date().getFullYear()} Jules Foundation. All rights reserved.</p>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
