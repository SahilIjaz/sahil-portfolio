'use client';

import React, { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, ExternalLink, Download,
  Code2, Database, Cloud, Zap, MessageSquare, Menu, X,
  Sun, Moon, ChevronDown, MapPin, Calendar, Building2,
  Sparkles, ArrowRight, Terminal, Server, Globe
} from 'lucide-react';
import { Card3D, MagneticButton } from '@/components/Card3D';
import { AnimatedSection, FadeInSection, StaggerChildren, itemVariants } from '@/components/AnimatedSection';
import { DynamicBackground } from '@/components/DynamicBackground';
import { LoadingScreen } from '@/components/LoadingScreen';

// Type definitions
interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  category: string;
  gradient: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Skill {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  level: number;
}

interface Service {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
}

interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface SubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

// Data
const projectsData: Project[] = [
  {
    id: 1,
    name: "Anaya",
    description: "Social media platform for story sharing, messaging, and content discovery with a custom feed algorithm.",
    tech: ["Node.js", "MongoDB", "Socket.io", "AWS S3"],
    category: "Social Media",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    icon: MessageSquare
  },
  {
    id: 2,
    name: "Connect Hub",
    description: "Full-stack social media application built with Next.js and real-time chat using Socket.io.",
    tech: ["Next.js", "React", "Socket.io", "MongoDB"],
    category: "Social Media",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    icon: Globe
  },
  {
    id: 3,
    name: "MulberryTree",
    description: "Community platform for chefs, users, and farmers to share recipes, courses, and event announcements.",
    tech: ["Node.js", "Express", "MongoDB", "AWS"],
    category: "Community",
    gradient: "from-emerald-600 via-green-600 to-lime-600",
    icon: Sparkles
  },
  {
    id: 4,
    name: "FishScout",
    description: "Real-time fishing community app with active fishing spots, weather integration, and social features.",
    tech: ["Node.js", "Socket.io", "Weather API", "PostgreSQL"],
    category: "Community",
    gradient: "from-blue-700 via-indigo-600 to-violet-600",
    icon: MapPin
  },
  {
    id: 5,
    name: "CoachMaster-Web",
    description: "Web app that empowers coaches to strategize, assign roles, and analyze team formations before matches.",
    tech: ["Next.js", "React", "Node.js", "MongoDB"],
    category: "Sports",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    icon: Zap
  },
  {
    id: 6,
    name: "MundoSalud",
    description: "Telehealth platform enabling real-time doctor consultations, appointment scheduling, and admin controls.",
    tech: ["Node.js", "Socket.io", "Agora", "MongoDB"],
    category: "Healthcare",
    gradient: "from-teal-600 via-cyan-600 to-sky-600",
    icon: Server
  }
];

const skills: Skill[] = [
  { name: "Node.js", icon: Terminal, color: "text-green-500", level: 95 },
  { name: "Next.js", icon: Globe, color: "text-white", level: 90 },
  { name: "React.js", icon: Code2, color: "text-cyan-400", level: 92 },
  { name: "Nest.js", icon: Server, color: "text-red-500", level: 85 },
  { name: "MongoDB", icon: Database, color: "text-green-600", level: 90 },
  { name: "PostgreSQL", icon: Database, color: "text-blue-500", level: 85 },
  { name: "AWS", icon: Cloud, color: "text-orange-400", level: 80 },
  { name: "Socket.io", icon: Zap, color: "text-purple-400", level: 88 }
];

const services: Service[] = [
  {
    title: "Backend Development",
    description: "Building scalable, real-time backend services with Node.js, Express, and Nest.js",
    icon: Server,
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    title: "Full Stack Web Apps",
    description: "Creating responsive web applications using Next.js, React, and modern frameworks",
    icon: Globe,
    gradient: "from-purple-600 to-pink-600"
  },
  {
    title: "API Integration",
    description: "Integrating third-party services like Stripe, Agora, and Socket.IO for enhanced functionality",
    icon: Zap,
    gradient: "from-green-600 to-emerald-600"
  },
  {
    title: "Cloud Deployment",
    description: "Deploying and managing applications on AWS EC2, S3, Railway, and other cloud platforms",
    icon: Cloud,
    gradient: "from-orange-600 to-red-600"
  }
];

const experience: Experience[] = [
  {
    company: "Bridge Zone",
    role: "Backend Developer",
    location: "Lahore, Pakistan",
    period: "July 2024 - October 2025",
    description: "Mobile app development company specializing in scalable digital solutions",
    highlights: [
      "Engineered and maintained over 5 real-time backend services",
      "Designed scalable architectures using Node.js and Express",
      "Integrated Socket.IO, Stripe, and Agora services",
      "Deployed applications on AWS EC2 and managed media via S3"
    ]
  },
  {
    company: "Gama Developers",
    role: "Full-Stack Developer",
    location: "Lahore, Pakistan",
    period: "October 2025 - Present",
    description: "Software development company specializing in scalable digital solutions",
    highlights: [
      "Developing full-stack web applications using Next.js and React"
    ]
  }
];

const navItems = ["About", "Projects", "Services", "Contact"];

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'projects', 'services', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(projectsData.map(p => p.category))],
    []
  );

  const filteredProjects = useMemo(
    () => activeFilter === 'All' ? projectsData : projectsData.filter(p => p.category === activeFilter),
    [activeFilter]
  );

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
  const handleFilterChange = useCallback((category: string) => setActiveFilter(category), []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });
    setIsSubmitting(true);

    startTransition(async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus({
            type: 'success',
            message: 'Thank you for your message! I will get back to you soon.',
          });
          setFormData({ name: '', email: '', message: '' });
        } else {
          setSubmitStatus({
            type: 'error',
            message: data.error || 'Something went wrong. Please try again.',
          });
        }
      } catch {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to send message. Please try again later.',
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  }, [formData]);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <DynamicBackground darkMode={darkMode} />

      <div className="relative bg-transparent text-gray-900 dark:text-white transition-colors duration-500">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left z-[60]"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed top-0 w-full z-50"
        >
          <div className="mx-4 mt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-700/50 shadow-lg shadow-black/5">
              <div className="flex justify-between items-center h-16">
                <MagneticButton>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-2xl font-black tracking-tight"
                  >
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      SAHIL
                    </span>
                  </motion.div>
                </MagneticButton>

                <div className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeSection === item.toLowerCase()
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400'
                          : 'hover:bg-white/10 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <MagneticButton>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleDarkMode}
                      className="p-2.5 rounded-xl bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
                      aria-label="Toggle dark mode"
                    >
                      <motion.div
                        initial={false}
                        animate={{ rotate: darkMode ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                      </motion.div>
                    </motion.button>
                  </MagneticButton>

                  <button
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2.5 rounded-xl bg-white/10 dark:bg-gray-800/50"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden mx-4 mt-2"
              >
                <div className="bg-white/10 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-gray-700/50 p-4 space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 rounded-xl hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <motion.div
            style={{ y: yBg }}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Greeting badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-6"
              >
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Available for freelance work</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg sm:text-xl text-blue-400 dark:text-blue-300 mb-4 font-medium"
              >
                Hi, I&apos;m
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 leading-none"
              >
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-2xl opacity-50">
                    Sahil Ijaz
                  </span>
                  <span className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Sahil Ijaz
                  </span>
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-3 mb-6"
              >
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-600/10 border border-blue-500/30 text-blue-300 font-semibold">
                  Full Stack Developer
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-400">Next.js &amp; Node.js Specialist</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Transforming complex ideas into elegant, scalable web solutions.
                Specializing in real-time applications and modern full-stack development.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <MagneticButton>
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Let&apos;s Work Together
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                </MagneticButton>

                <MagneticButton>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="/sahil-resume.pdf"
                    download
                    className="px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all backdrop-blur-sm"
                  >
                    <Download size={18} />
                    Download Resume
                  </motion.a>
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex gap-4 justify-center mt-12"
              >
                {[
                  { Icon: Github, href: "https://github.com/SahilIjaz", label: "GitHub" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/sahil-ijaz-a75b15281/", label: "LinkedIn" },
                  { Icon: Mail, href: "#contact", label: "Email" }
                ].map(({ Icon, href, label }) => (
                  <MagneticButton key={label}>
                    <motion.a
                      href={href}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-4 rounded-2xl bg-white/10 dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 backdrop-blur-sm border border-white/10 dark:border-gray-700/50"
                      aria-label={label}
                    >
                      <Icon size={22} />
                    </motion.a>
                  </MagneticButton>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <ChevronDown size={32} className="text-gray-500" />
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" delay={0}>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                  About{" "}
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Me
                  </span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  Passionate about building exceptional digital experiences
                </p>
              </div>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <AnimatedSection direction="left" delay={0.1}>
                <Card3D glowColor="blue">
                  <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                        <Code2 size={24} className="text-white" />
                      </span>
                      Who I Am
                    </h3>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                      <p>
                        Enthusiastic Full-Stack Developer with{" "}
                        <span className="font-semibold text-blue-500">1.5+ years</span>{" "}
                        of proven experience in building scalable, real-time systems using Node.js, Next.js, and React.js.
                      </p>
                      <p>
                        Currently working at <span className="font-semibold">Gamma Developers</span> in Lahore, Pakistan,
                        where I engineer and maintain real-time backend services with optimized performance.
                      </p>
                    </div>

                    <div className="mt-8 space-y-4">
                      {[
                        { icon: MapPin, text: "Lahore, Punjab, Pakistan" },
                        { icon: Building2, text: "Gamma Developers - Full-Stack Developer" },
                        { icon: Calendar, text: "Bachelor of IT - Bahria University (2023-2027)" }
                      ].map(({ icon: Icon, text }, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <span className="p-2 rounded-lg bg-blue-500/10">
                            <Icon className="text-blue-500" size={18} />
                          </span>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card3D>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.2}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                      <Zap size={24} className="text-white" />
                    </span>
                    Technical Skills
                  </h3>
                  <StaggerChildren staggerDelay={0.05}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {skills.map((skill, idx) => {
                        const Icon = skill.icon;
                        return (
                          <motion.div key={idx} variants={itemVariants}>
                            <Card3D glowColor={idx % 2 === 0 ? 'blue' : 'purple'} intensity={8}>
                              <div className="p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${skill.color}`}>
                                    <Icon size={20} />
                                  </span>
                                  <span className="font-semibold">{skill.name}</span>
                                </div>
                                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                  />
                                </div>
                              </div>
                            </Card3D>
                          </motion.div>
                        );
                      })}
                    </div>
                  </StaggerChildren>
                </div>
              </AnimatedSection>
            </div>

            {/* Experience Timeline */}
            <div className="mt-24">
              <AnimatedSection direction="up" delay={0.1}>
                <h3 className="text-3xl font-bold mb-12 text-center">
                  Work{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Experience
                  </span>
                </h3>
              </AnimatedSection>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform lg:-translate-x-1/2" />

                <StaggerChildren staggerDelay={0.1}>
                  {experience.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className={`relative pl-12 lg:pl-0 pb-12 ${idx % 2 === 0 ? 'lg:pr-[52%]' : 'lg:pl-[52%]'}`}
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-2.5 lg:left-1/2 transform lg:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white dark:border-gray-900`} />

                      <Card3D glowColor={idx % 2 === 0 ? 'blue' : 'purple'}>
                        <div className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-blue-500">{exp.role}</h4>
                              <p className="text-lg font-semibold">{exp.company}</p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
                              <p className="flex items-center gap-2">
                                <Calendar size={14} />
                                {exp.period}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin size={14} />
                                {exp.location}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{exp.description}</p>
                          <ul className="space-y-2">
                            {exp.highlights.map((highlight, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <span className="text-blue-500 mt-1">
                                  <ArrowRight size={14} />
                                </span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Card3D>
                    </motion.div>
                  ))}
                </StaggerChildren>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" delay={0}>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                  Featured{" "}
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Projects
                  </span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  A showcase of my recent work and side projects
                </p>
              </div>
            </AnimatedSection>

            <FadeInSection delay={0.1}>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange(category)}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      activeFilter === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 border border-white/10 dark:border-gray-700/50"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </FadeInSection>

            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => {
                  const Icon = project.icon;
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card3D glowColor="purple" intensity={8}>
                        <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden group">
                          {/* Gradient header */}
                          <div className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-3">
                              <span className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                <Icon size={24} className="text-white" />
                              </span>
                              <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                            </div>
                          </div>

                          <div className="p-6">
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.tech.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-lg"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            <div className="flex gap-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                              >
                                <ExternalLink size={16} />
                                Live Demo
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-400 transition-colors"
                              >
                                <Github size={16} />
                                Code
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </Card3D>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" delay={0}>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                  What I{" "}
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Offer
                  </span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  Comprehensive solutions for your digital needs
                </p>
              </div>
            </AnimatedSection>

            <StaggerChildren staggerDelay={0.08}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <motion.div key={idx} variants={itemVariants}>
                      <Card3D glowColor={['blue', 'purple', 'green', 'cyan'][idx % 4]} intensity={8}>
                        <div className="h-full p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 group">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-lg`}
                          >
                            <Icon size={28} className="text-white" />
                          </motion.div>
                          <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </Card3D>
                    </motion.div>
                  );
                })}
              </div>
            </StaggerChildren>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection direction="up" delay={0}>
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                  Get In{" "}
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Touch
                  </span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                  Have a project in mind? Let&apos;s create something amazing together
                </p>
              </div>
            </AnimatedSection>

            <FadeInSection delay={0.1}>
              <Card3D glowColor="purple" intensity={6}>
                <form
                  onSubmit={handleSubmit}
                  className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 space-y-6"
                >
                  <AnimatePresence>
                    {submitStatus.type && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl ${
                          submitStatus.type === 'success'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}
                      >
                        {submitStatus.message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isSubmitting || isPending}
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isSubmitting || isPending}
                        className="w-full px-4 py-3.5 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={isSubmitting || isPending}
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 transition-all"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting || isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </Card3D>
            </FadeInSection>

            <AnimatedSection direction="up" delay={0.2}>
              <div className="mt-12 text-center space-y-4">
                <p className="text-gray-500 dark:text-gray-400">Or reach me directly at:</p>
                <a
                  href="mailto:hssahil2913@gmail.com"
                  className="inline-block text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  hssahil2913@gmail.com
                </a>
                <p className="text-gray-500 dark:text-gray-400">+92-302-4891399</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-2xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Sahil Ijaz
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Full Stack Developer</p>
              </div>

              <div className="flex gap-4">
                {[
                  { Icon: Github, href: "https://github.com/SahilIjaz" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/sahil-ijaz-a75b15281/" },
                  { Icon: Mail, href: "mailto:hssahil2913@gmail.com" }
                ].map(({ Icon, href }, idx) => (
                  <MagneticButton key={idx}>
                    <motion.a
                      href={href}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all"
                    >
                      <Icon size={18} />
                    </motion.a>
                  </MagneticButton>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Sahil Ijaz. All rights reserved.</p>
              <p className="mt-2">Built with Next.js, Tailwind CSS &amp; Framer Motion</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
