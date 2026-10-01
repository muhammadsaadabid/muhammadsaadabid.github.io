/* =========================================================================
   data.js — ALL editable portfolio content lives here.
   -------------------------------------------------------------------------
   Edit the objects below and refresh the page. You never need to touch
   index.html to change skills, experience, projects, education,
   testimonials, social links, stats or the contact-form settings.

   Image paths are relative to index.html. If an image file is missing,
   a dashed placeholder showing the expected file name + size is shown
   automatically, so you can drop real images in whenever you're ready.
   ========================================================================= */

window.PORTFOLIO = {

  /* -----------------------------------------------------------------------
     PERSONAL / GLOBAL
     ----------------------------------------------------------------------- */
  profile: {
    name: "Muhammad Saad",
    initials: "MS",
    email: "msaadabid123@gmail.com",
    phoneDisplay: "+92 317 2905906",
    phoneRaw: "+923172905906",          // used for tel: links
    whatsapp: "923172905906",           // used for wa.me links (no + or spaces)
    location: "Karachi, Pakistan",
    resume: "assets/resume.pdf",
    // Roles cycled by the typing effect in the hero
    roles: [
      "Full Stack Developer",
      "Project Manager",
      "Team Lead",
      "Python Developer",
      "WordPress Expert"
    ]
  },

  /* -----------------------------------------------------------------------
     SOCIAL LINKS — replace the placeholder URLs with your own.
     `icon` is a Font Awesome class (https://fontawesome.com/search?o=r&m=free)
     ----------------------------------------------------------------------- */
  social: [
    { label: "GitHub",   icon: "fa-brands fa-github",      url: "https://github.com/muhammadsaadabid" },
    { label: "LinkedIn", icon: "fa-brands fa-linkedin-in", url: "https://www.linkedin.com/in/msaad-abid/" },
    { label: "Email",    icon: "fa-solid fa-envelope",     url: "mailto:msaadabid123@gmail.com" },
    { label: "WhatsApp", icon: "fa-brands fa-whatsapp",    url: "https://wa.me/923172905906" }
  ],

  /* -----------------------------------------------------------------------
     ABOUT — animated stats. `value` is the number the counter animates to,
     `suffix` is appended after it (e.g. "+").
     ⚠ Replace the Projects / Clients numbers with your real figures.
     ----------------------------------------------------------------------- */
  stats: [
    { value: 3,  suffix: "+", label: "Years Experience" },
    { value: 25, suffix: "+", label: "Projects Delivered" },   // ← update
    { value: 15, suffix: "+", label: "Happy Clients" },        // ← update
    { value: 3,  suffix: "",  label: "Companies" }
  ],

  /* -----------------------------------------------------------------------
     SERVICES — "What I do" cards. `tags` are short keywords under each card.
     ----------------------------------------------------------------------- */
  services: [
    {
      title: "Full Stack Web Apps",
      icon: "fa-solid fa-layer-group",
      text: "Custom web applications with clean APIs, solid databases and fast, responsive front ends.",
      tags: ["PHP", "Node.js", "MySQL", "MongoDB"]
    },
    {
      title: "WordPress & WooCommerce",
      icon: "fa-brands fa-wordpress",
      text: "Fast, SEO-friendly WordPress sites and online stores that clients can manage themselves.",
      tags: ["Elementor", "Custom themes", "WooCommerce"]
    },
    {
      title: "Shopify Stores",
      icon: "fa-brands fa-shopify",
      text: "Conversion-focused Shopify stores, theme customisation and app integrations.",
      tags: ["Liquid", "Theme setup", "Store migration"]
    },
    {
      title: "Hosting & Server Management",
      icon: "fa-solid fa-server",
      text: "Domains, cPanel, email, SSL, backups and deployments, so your site stays online and secure.",
      tags: ["cPanel", "SSL", "Backups"]
    },
    {
      title: "Project Management & Team Lead",
      icon: "fa-solid fa-people-group",
      text: "Planning, estimates, sprints and clear client communication from kickoff to launch.",
      tags: ["Planning", "Agile", "Client comms"]
    },
    {
      title: "Python Automation",
      icon: "fa-brands fa-python",
      text: "Scripts and small tools that automate reports, data cleanup and repetitive tasks.",
      tags: ["Python", "Automation", "APIs"]
    }
  ],

  /* -----------------------------------------------------------------------
     SKILLS — one object per category card.
     ----------------------------------------------------------------------- */
  skills: [
    {
      category: "Frontend",
      icon: "fa-solid fa-code",
      items: [
        { name: "HTML",         icon: "fa-brands fa-html5" },
        { name: "CSS",          icon: "fa-brands fa-css3-alt" },
        { name: "JavaScript",   icon: "fa-brands fa-js" },
        { name: "Bootstrap",    icon: "fa-brands fa-bootstrap" },
        { name: "Tailwind CSS", icon: "fa-solid fa-wind" },
        { name: "React",        icon: "fa-brands fa-react" }
      ]
    },
    {
      category: "Backend",
      icon: "fa-solid fa-server",
      items: [
        { name: "PHP",     icon: "fa-brands fa-php" },
        { name: "Node.js", icon: "fa-brands fa-node-js" },
        { name: "Python",  icon: "fa-brands fa-python" }
      ]
    },
    {
      category: "CMS & E-commerce",
      icon: "fa-solid fa-cart-shopping",
      items: [
        { name: "WordPress",   icon: "fa-brands fa-wordpress" },
        { name: "Elementor",   icon: "fa-solid fa-layer-group" },
        { name: "WooCommerce", icon: "fa-solid fa-bag-shopping" },
        { name: "Shopify",     icon: "fa-brands fa-shopify" }
      ]
    },
    {
      category: "Database",
      icon: "fa-solid fa-database",
      items: [
        { name: "MySQL",   icon: "fa-solid fa-database" },
        { name: "MongoDB", icon: "fa-solid fa-leaf" }
      ]
    },
    {
      category: "Tools",
      icon: "fa-solid fa-screwdriver-wrench",
      items: [
        { name: "Git",                icon: "fa-brands fa-git-alt" },
        { name: "GitHub",             icon: "fa-brands fa-github" },
        { name: "cPanel",             icon: "fa-brands fa-cpanel" },
        { name: "Hosting Management", icon: "fa-solid fa-cloud" },
        { name: "Figma",              icon: "fa-brands fa-figma" }
      ]
    },
    {
      category: "Management",
      icon: "fa-solid fa-people-group",
      items: [
        { name: "Project Management",   icon: "fa-solid fa-diagram-project" },
        { name: "Team Leadership",      icon: "fa-solid fa-user-tie" },
        { name: "Client Communication", icon: "fa-solid fa-comments" }
      ]
    }
  ],

  /* Tech names shown in the infinite marquee under the skills grid */
  marquee: [
    { name: "HTML5",       icon: "fa-brands fa-html5" },
    { name: "CSS3",        icon: "fa-brands fa-css3-alt" },
    { name: "JavaScript",  icon: "fa-brands fa-js" },
    { name: "React",       icon: "fa-brands fa-react" },
    { name: "Node.js",     icon: "fa-brands fa-node-js" },
    { name: "PHP",         icon: "fa-brands fa-php" },
    { name: "Python",      icon: "fa-brands fa-python" },
    { name: "WordPress",   icon: "fa-brands fa-wordpress" },
    { name: "Shopify",     icon: "fa-brands fa-shopify" },
    { name: "WooCommerce", icon: "fa-solid fa-bag-shopping" },
    { name: "MySQL",       icon: "fa-solid fa-database" },
    { name: "MongoDB",     icon: "fa-solid fa-leaf" },
    { name: "Git",         icon: "fa-brands fa-git-alt" },
    { name: "Figma",       icon: "fa-brands fa-figma" },
    { name: "Bootstrap",   icon: "fa-brands fa-bootstrap" },
    { name: "Tailwind",    icon: "fa-solid fa-wind" }
  ],

  /* -----------------------------------------------------------------------
     EXPERIENCE — newest first. `logo` is a 200×200 transparent PNG.
     ----------------------------------------------------------------------- */
  experience: [
    {
      company: "Burraq Inc",
      logo: "images/logos/burraq.png",
      period: "Mar 2024 – Present",
      current: true,
      roles: ["Project Manager", "Full Stack Developer", "Team Lead"],
      points: [
        "Leading a development team and managing projects end-to-end",
        "Full stack web application development",
        "Hosting and server management",
        "WordPress development",
        "Started Python development (Aug 2026)"
      ]
    },
    {
      company: "Zeetach",
      logo: "images/logos/zeetach.png",
      period: "Oct 2023 – Mar 2024",
      roles: ["Full Stack Developer"],
      // ⚠ Placeholder responsibilities — replace with what you actually did.
      points: [
        "Built and maintained full stack web applications for clients",
        "Developed custom WordPress themes and plugin features",
        "Collaborated with designers to turn Figma mockups into responsive UIs"
      ]
    },
    {
      company: "JARRIES – Web & IT Solutions",
      logo: "images/logos/jarries.png",
      period: "Jan 2023 – Oct 2023",
      roles: ["Software Developer (Intern)"],
      points: [
        "Software development",
        "Built websites using WordPress",
        "Designed new features for existing websites",
        "Shopify store development"
      ]
    }
  ],

  /* -----------------------------------------------------------------------
     PROJECTS
     • `image`  — a FULL-PAGE screenshot, 800px wide (any height). It scrolls
                  from top to bottom when the card is hovered.
     • `category` must match a filter key below. Filters with no projects
                  are hidden automatically.
     • `live`   — website URL (the browser bar shows its domain).
     • `github` — repo URL, or "" to hide the GitHub button.
     • `featured: true` on ONE project shows it as a large card on desktop.
     • `projectsInitial` = how many cards show before "View all projects".
     ----------------------------------------------------------------------- */
  projectsInitial: 6,

  projectFilters: [
    { key: "all",       label: "All" },
    { key: "fullstack", label: "Full Stack" },
    { key: "wordpress", label: "WordPress" },
    { key: "shopify",   label: "Shopify" },
    { key: "python",    label: "Python" }
  ],

  projects: [
    {
      title: "Smart Ledger Solutions",
      category: "fullstack",
      featured: true,   // shown as a large card on desktop (use on ONE project)
      image: "images/projects/smart-ledger-solutions.jpg",
      description: "UK business services platform for company formation, accounting and compliance.",
      details: "Website for Smart Ledger Solutions offering UK company formation, accounting, tax filing, VAT, payroll and compliance services. Custom PHP build.",
      features: ["Service overview dashboard UI", "Company formation and accounting pages", "Get-started onboarding flow"],
      tech: ["PHP", "JavaScript", "CSS"],
      live: "https://smartledgersolutions.co.uk",
      github: ""
    },
    {
      title: "Plutox Payments",
      category: "fullstack",
      image: "images/projects/plutox-payments.jpg",
      description: "Website for a software & AI company presenting its services, case studies and team.",
      details: "Marketing website for Plutox Payments, an innovative software and AI company. Custom PHP build with animated sections and service pages.",
      features: ["Service and solution pages", "Animated sliders and counters", "Appointment / contact forms"],
      tech: ["PHP", "Bootstrap", "GSAP", "Swiper"],
      live: "https://plutoxpayments.co.uk",
      github: ""
    },
    {
      title: "Plutox Productions",
      category: "fullstack",
      image: "images/projects/plutox-productions.jpg",
      description: "News and creative media portal with categorised articles and a latest-updates ticker.",
      details: "A global news and creative media production portal with blog listings, categories and article pages, built in PHP.",
      features: ["News categories and article pages", "Latest updates ticker", "Search and social follow"],
      tech: ["PHP", "Bootstrap", "jQuery"],
      live: "https://plutoxproductions.com",
      github: ""
    },
    {
      title: "Pro UK Writings",
      category: "wordpress",
      image: "images/projects/pro-uk-writings.jpg",
      description: "Academic writing service site with an instant price-quote calculator and order flow.",
      details: "WordPress site for a UK essay writing service, built with Elementor and WooCommerce, including an instant quote form in the hero.",
      features: ["Instant quote calculator", "WooCommerce ordering", "Reviews and trust badges"],
      tech: ["WordPress", "Elementor", "WooCommerce"],
      live: "https://proukwritings.co.uk",
      github: ""
    },
    {
      title: "Alchemy Ventures",
      category: "fullstack",
      image: "images/projects/alchemy-ventures.jpg",
      description: "BPO solutions company website with service pages, careers and booking.",
      details: "Website for Alchemy Ventures, an expert BPO solutions provider. Custom PHP build with service pages, blog and careers sections.",
      features: ["Service detail pages", "Careers and blog", "Book-a-meeting call to action"],
      tech: ["PHP", "Bootstrap", "jQuery"],
      live: "https://alchemyventures.org",
      github: ""
    },
    {
      title: "MobileLogistix",
      category: "wordpress",
      image: "images/projects/mobilelogistix.jpg",
      description: "Freight forwarding and supply chain company website with a full-screen hero.",
      details: "WordPress website for MobileLogistix, a worldwide freight forwarding, customs brokerage and supply chain company, built with Elementor.",
      features: ["Services, industries and countries pages", "Full-screen hero", "Responsive Elementor layout"],
      tech: ["WordPress", "Elementor"],
      live: "https://mobilelogistix.com",
      github: ""
    },
    {
      title: "Rise Third Store",
      category: "shopify",
      image: "images/projects/rise-third-store.jpg",
      description: "Home décor Shopify store with shop-by-collection browsing.",
      details: "Shopify e-commerce store for Rise Third Ltd selling home décor, with collections, product pages and a customised theme.",
      features: ["Shop by collection", "Product and cart pages", "Customised Shopify theme"],
      tech: ["Shopify", "Liquid"],
      live: "https://risethirdltd.store",
      github: ""
    },
    {
      title: "Virtual Visionare",
      category: "fullstack",
      image: "images/projects/virtual-visionare.jpg",
      description: "Outsourcing company website with a client account area and service pages.",
      details: "Website for Virtual Visionare, a business outsourcing company, with service pages, careers, blog and a client account area.",
      features: ["Client account area", "Service and careers pages", "Animated sliders"],
      tech: ["PHP", "Bootstrap", "jQuery", "Swiper"],
      live: "https://virtualvisionare.site",
      github: ""
    },
    {
      title: "Assignment Guru",
      category: "fullstack",
      image: "images/projects/assignment-guru.jpg",
      description: "UK assignment help website with a live price calculator and order form.",
      details: "Website for Assignment Guru, a UK assignment help service, with an instant price calculator, reviews and university trust section.",
      features: ["Live price calculator", "Order and quote forms", "Reviews and university logos"],
      tech: ["PHP", "Bootstrap", "Swiper", "JavaScript"],
      live: "https://www.assignmentguru.co.uk",
      github: ""
    },
    {
      title: "Burraq Inc",
      category: "fullstack",
      image: "images/projects/burraq-inc.jpg",
      description: "Corporate website for a digital agency, with bold animated sections and a clear services funnel.",
      details: "Company website for Burraq Inc, a digital agency offering web, design and marketing services. Built as a custom PHP site with smooth GSAP animations and Swiper sliders.",
      features: ["Animated hero and scroll effects", "Services, portfolio and blog pages", "Quote request flow"],
      tech: ["PHP", "Bootstrap", "GSAP", "Swiper", "jQuery"],
      live: "https://burraqinc.com",
      github: ""
    }
  ],

  /* -----------------------------------------------------------------------
     EDUCATION & CERTIFICATION — `image` is optional (set to null to hide).
     ----------------------------------------------------------------------- */
  education: [
    {
      title: "ACCP Prime",
      subtitle: "Aptech Certified Computer Professional",
      institution: "Aptech",
      period: "2021 – 2024",
      icon: "fa-solid fa-award",
      featured: true,
      image: "images/accp-certificate.jpg",
      description: "Professional software engineering programme covering web development, databases, programming fundamentals and project work."
    },
    {
      title: "Intermediate",
      subtitle: "Pre-Engineering",
      institution: "",
      period: "2019 – 2021",
      icon: "fa-solid fa-graduation-cap",
      image: null
    },
    {
      title: "Matriculation",
      subtitle: "Secondary School Certificate",
      institution: "",
      period: "2019",
      icon: "fa-solid fa-school",
      image: null
    }
  ],

  /* -----------------------------------------------------------------------
     TESTIMONIALS — set `showTestimonials` to false to hide the section.
     ⚠ Placeholder entries — only publish real quotes from real clients.
     ----------------------------------------------------------------------- */
  showTestimonials: true,
  testimonials: [
    {
      name: "Client Name",
      role: "CEO, Company Name",
      image: "images/testimonials/client-1.jpg",
      quote: "Replace this with a real testimonial from a client. Keep it short and specific — what you delivered and the result it had."
    },
    {
      name: "Client Name",
      role: "Founder, Company Name",
      image: "images/testimonials/client-2.jpg",
      quote: "Replace this with a second real testimonial. Quotes that mention communication, deadlines or measurable results work best."
    },
    {
      name: "Client Name",
      role: "Marketing Lead, Company Name",
      image: "images/testimonials/client-3.jpg",
      quote: "Replace this with a third real testimonial. Ask happy clients for one or two sentences you can publish."
    }
  ],

  /* -----------------------------------------------------------------------
     CONTACT FORM
     provider: "formspree" | "emailjs"
     Leave the placeholder values until you've set up an account —
     the form will show a friendly message instead of failing silently.
     ----------------------------------------------------------------------- */
  contactForm: {
    provider: "formspree",
    formspree: {
      endpoint: "https://formspree.io/f/YOUR_FORM_ID"
    },
    emailjs: {
      publicKey:  "YOUR_PUBLIC_KEY",
      serviceId:  "YOUR_SERVICE_ID",
      templateId: "YOUR_TEMPLATE_ID"
    }
  }
};
