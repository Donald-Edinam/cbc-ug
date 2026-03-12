import type {
  Stat,
  Event,
  TeamMember,
  Project,
  NavLink,
} from "./types";

export const stats: Stat[] = [
  { number: "120+", label: "Active Members" },
  { number: "24", label: "Projects Shipped" },
  { number: "40+", label: "Workshops Held" },
  { number: "8", label: "Departments Represented" },
];

export const events: Event[] = [
  {
    date: "Mar 22, 2026",
    title: "Prompt Engineering Masterclass",
    desc: "Deep-dive into advanced prompting techniques with Claude — chain-of-thought, system prompts, and structured outputs for real-world applications.",
    tag: "Workshop",
  },
  {
    date: "Apr 5–6, 2026",
    title: "AI for Africa Hackathon",
    desc: "48-hour build sprint focused on solving local challenges — healthcare, education, agriculture, and fintech — with Claude as your co-pilot.",
    tag: "Hackathon",
  },
  {
    date: "Apr 18, 2026",
    title: "Claude API Deep Dive",
    desc: "Hands-on session building full-stack applications with the Anthropic API. From setup to deployment — bring your laptop and an idea.",
    tag: "Technical",
  },
  {
    date: "May 3, 2026",
    title: "AI Ethics Roundtable",
    desc: "An open discussion on responsible AI development, Anthropic's safety research, and what ethical AI means in the African context.",
    tag: "Discussion",
  },
  {
    date: "May 17, 2026",
    title: "Demo Day: Spring Showcase",
    desc: "Club members present their semester-long projects to peers, faculty, and industry guests. Prizes for the most impactful builds.",
    tag: "Showcase",
  },
  {
    date: "Every Thursday",
    title: "Weekly Build Session",
    desc: "Our regular meetup — work on projects, get code reviews, pair-program with Claude, or just hang out with fellow builders.",
    tag: "Recurring",
  },
];

export const team: TeamMember[] = [
  {
    initials: "AO",
    name: "Akua Owusu",
    role: "President",
    bio: "CS Level 400. Passionate about AI policy and building inclusive tech communities.",
    // image: "/team/akua.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    initials: "KB",
    name: "Kwame Boateng",
    role: "Vice President",
    bio: "Engineering Level 300. Loves hackathons and connecting developers across campus.",
    linkedin: "#",
    github: "#",
  },
  {
    initials: "EA",
    name: "Esi Appiah",
    role: "Technical Lead",
    bio: "CS Level 400. Full-stack developer focused on AI-powered web applications.",
    linkedin: "#",
    github: "#",
  },
  {
    initials: "DA",
    name: "Donald Agyapong",
    role: "Technical Lead",
    bio: "Software developer & builder of the Buzzba ecosystem. Ships fast, thinks big.",
    linkedin: "#",
    github: "#",
  },
  {
    initials: "NA",
    name: "Nana Addo",
    role: "Events Coordinator",
    bio: "Business Admin Level 300. Keeps the club running smoothly and the events flowing.",
    linkedin: "#",
  },
  {
    initials: "FM",
    name: "Fatima Mohammed",
    role: "Community Lead",
    bio: "Sociology Level 200. Bridges the gap between tech and the humanities in our community.",
    linkedin: "#",
  },
  {
    initials: "YT",
    name: "Yaw Tetteh",
    role: "Design Lead",
    bio: "IT Level 300. Crafts the visual identity and design systems for club projects.",
    linkedin: "#",
  },
  {
    initials: "AA",
    name: "Abena Asante",
    role: "Content & Comms",
    bio: "English Level 300. Tells the club's story through social media and written content.",
    linkedin: "#",
  },
];

export const projects: Project[] = [
  {
    number: "01",
    title: "MedAssist GH",
    desc: "An AI-powered health information chatbot for rural communities. Uses Claude to translate medical guidance into local languages and provide preliminary symptom triage.",
    tags: [
      { label: "AI", variant: "ai" },
      { label: "Healthcare", variant: "web" },
      { label: "Hackathon Winner", variant: "hack" },
    ],
  },
  {
    number: "02",
    title: "StudyBuddy",
    desc: "A Claude-powered study companion that generates practice questions, explains concepts in multiple ways, and adapts to each student's learning pace and style.",
    tags: [
      { label: "AI", variant: "ai" },
      { label: "EdTech", variant: "data" },
      { label: "Web App", variant: "web" },
    ],
  },
  {
    number: "03",
    title: "AgriSense",
    desc: "Smart crop advisory tool for smallholder farmers. Combines weather data, soil analysis, and Claude's reasoning to deliver actionable planting and harvest recommendations.",
    tags: [
      { label: "AI", variant: "ai" },
      { label: "Data", variant: "data" },
      { label: "Agriculture", variant: "mobile" },
    ],
  },
  {
    number: "04",
    title: "PidginBot",
    desc: "A conversational AI experiment that speaks fluent Ghanaian Pidgin. Explores multilingual AI capabilities and culturally-aware language generation using Claude.",
    tags: [
      { label: "AI", variant: "ai" },
      { label: "NLP", variant: "hack" },
      { label: "Language", variant: "data" },
    ],
  },
];

export const perks: string[] = [
  "Access to Claude Pro during club activities",
  "Weekly workshops & build sessions",
  "Mentorship from industry professionals",
  "Hackathon teams & project collaborations",
];

export const navLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#team", label: "Team" },
  { href: "#projects", label: "Projects" },
];
