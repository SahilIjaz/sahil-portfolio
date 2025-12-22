'use client';

import React, { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Mail, ExternalLink, Download,
  Code2, Database, Cloud, Zap, MessageSquare, Menu, X,
  Sun, Moon, ChevronDown, MapPin, Calendar, Building2
} from 'lucide-react';
import { Card3D } from '@/components/Card3D';
import { AnimatedSection, FadeInSection, StaggerChildren, itemVariants } from '@/components/AnimatedSection';
import { DynamicBackground } from '@/components/DynamicBackground';

// Type definitions for better type safety (Next.js 16 + React 19)
interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  category: string;
  gradient: string;
}

interface Skill {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
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

// Data from CV
const projectsData: Project[] = [
  {
    id: 1,
    name: "Anaya",
    description: "Social media platform for story sharing, messaging, and content discovery with a custom feed algorithm.",
    tech: ["Node.js", "MongoDB", "Socket.io", "AWS S3"],
    category: "Social Media",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    name: "Connect Hub",
    description: "Full-stack social media application built with Next.js and real-time chat using Socket.io.",
    tech: ["Next.js", "React", "Socket.io", "MongoDB"],
    category: "Social Media",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "MulberryTree",
    description: "Community platform for chefs, users, and farmers to share recipes, courses, and event announcements.",
    tech: ["Node.js", "Express", "MongoDB", "AWS"],
    category: "Community",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    name: "FishScout",
    description: "Real-time fishing community app with active fishing spots, weather integration, and social features.",
    tech: ["Node.js", "Socket.io", "Weather API", "PostgreSQL"],
    category: "Community",
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    id: 5,
    name: "CoachMaster-Web",
    description: "Web app that empowers coaches to strategize, assign roles, and analyze team formations before matches.",
    tech: ["Next.js", "React", "Node.js", "MongoDB"],
    category: "Sports",
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 6,
    name: "MundoSalud",
    description: "Telehealth platform enabling real-time doctor consultations, appointment scheduling, and admin controls.",
    tech: ["Node.js", "Socket.io", "Agora", "MongoDB"],
    category: "Healthcare",
    gradient: "from-teal-500 to-blue-500"
  }
];

const skills: Skill[] = [
  { name: "Node.js", icon: Code2, color: "text-green-500" },
  { name: "Next.js", icon: Code2, color: "text-gray-900 dark:text-white" },
  { name: "React.js", icon: Code2, color: "text-blue-500" },
  { name: "Nest.js", icon: Code2, color: "text-red-500" },
  { name: "MongoDB", icon: Database, color: "text-green-600" },
  { name: "PostgreSQL", icon: Database, color: "text-blue-600" },
  { name: "AWS", icon: Cloud, color: "text-orange-500" },
  { name: "Socket.io", icon: Zap, color: "text-purple-500" }
];

const services: Service[] = [
  {
    title: "Backend Development",
    description: "Building scalable, real-time backend services with Node.js, Express, and Nest.js",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Full Stack Web Apps",
    description: "Creating responsive web applications using Next.js, React, and modern frameworks",
    icon: Zap,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "API Integration",
    description: "Integrating third-party services like Stripe, Agora, and Socket.IO for enhanced functionality",
    icon: MessageSquare,
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Cloud Deployment",
    description: "Deploying and managing applications on AWS EC2, S3, Railway, and other cloud platforms",
    icon: Cloud,
    gradient: "from-orange-500 to-red-500"
  }
];

const experience: Experience[] = [
  {
    company: "Bridge Zone",
    role: "Backend Developer",
    location: "Lahore, Pakistan",
    period: "July 2024 – October 2025",
    description:
      "Mobile app development company specializing in scalable digital solutions",
    highlights: [
      "Engineered and maintained over 5 real-time backend services",
      "Designed scalable architectures using Node.js and Express",
      "Integrated Socket.IO, Stripe, and Agora services",
      "Deployed applications on AWS EC2 and managed media via S3",
    ],
  },

  
  {
    company: "Gama Developers",
    role: "Full-Stack Developer",
    location: "Lahore, Pakistan",
    period: "October 2025 – November 2025",
    description:
      "Software development company specializing in scalable digital solutions",
    highlights: [
      "Working on developing full-stack web applications using Next.js and React",
    ],
  },
];

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null, message: '' });

  // Simple state for form submission (React 19 compatible)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Memoize expensive computations (React 19 optimization)
  const categories = useMemo(
    () => ['All', ...new Set(projectsData.map(p => p.category))],
    []
  );

  const filteredProjects = useMemo(
    () => activeFilter === 'All'
      ? projectsData
      : projectsData.filter(p => p.category === activeFilter),
    [activeFilter]
  );

  // Memoize callbacks to prevent unnecessary re-renders
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleFilterChange = useCallback((category: string) => {
    setActiveFilter(category);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    // Set loading state with instant UI feedback
    setIsSubmitting(true);
    setSubmitMessage('Sending your message...');

    // Use startTransition for non-urgent updates
    startTransition(async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmitStatus({
          type: 'error',
          message: 'Failed to send message. Please try again later.',
        });
      } finally {
        setIsSubmitting(false);
        setSubmitMessage('');
      }
    });
  }, [formData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Dynamic Animated Background */}
      <DynamicBackground darkMode={darkMode} />

      <div className="relative bg-transparent text-gray-900 dark:text-white transition-colors duration-300">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                SI
              </motion.div>

              <div className="hidden md:flex space-x-8">
                {["About", "Projects", "Services", "Contact"].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>

                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="px-4 py-4 space-y-4">
                  {["About", "Projects", "Services", "Contact"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={toggleMobileMenu}
                      className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <motion.div
            style={{ y: yBg }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20"
          />

          {/* Animated background blobs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 dark:bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 dark:bg-purple-500/20 rounded-full blur-3xl"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.2 }}
                className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 mb-4"
              >
                Hi, I&apos;m
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Sahil Ijaz
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-xl sm:text-3xl text-gray-700 dark:text-gray-300 mb-4"
              >
                Full Stack Developer
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
              >
                Next.js &amp; Node.js Specialist | Turning ideas into interactive
                web experiences
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {/* Hire Me Button */}
                <motion.a
                  href="#contact"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg"
                >
                  Hire Me
                </motion.a>

                {/* Download Resume Button */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/sahil-resume.pdf" // points to your resume in public folder
                  download // triggers download instead of opening
                  className="px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-semibold flex items-center gap-2"
                >
                  <Download size={20} />
                  Download Resume
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.25 }}
                className="flex gap-6 justify-center mt-12"
              >
                {[
                  { Icon: Github, href: "https://github.com/SahilIjaz" },
                  {
                    Icon: Linkedin,
                    href: "https://www.linkedin.com/in/sahil-ijaz-a75b15281/",
                  },
                  { Icon: Mail, href: "#contact" },
                ].map(({ Icon, href }, idx) => (
                  <motion.a
                    key={idx}
                    href={href}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all"
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <ChevronDown size={32} className="text-gray-400" />
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" delay={0}>
              <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
                About{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Me
                </span>
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <AnimatedSection direction="left" delay={0.05}>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Enthusiastic Full-Stack Developer with{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      1.5+ years
                    </span>{" "}
                    of proven experience in building scalable, real-time systems
                    using Node.js, Next.js, and React.js.
                  </p>

                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Currently working at{" "}
                    <span className="font-semibold">Gamma Developers</span> in
                    Lahore, Pakistan, where I engineer and maintain real-time
                    backend services with optimized performance.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Lahore, Punjab, Pakistan
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Gamma Developers - Full-Stack Developer
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Bachelor of IT - Bahria University (2023-2027)
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.05}>
                <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
                <StaggerChildren staggerDelay={0.03}>
                  <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill, idx) => {
                      const Icon = skill.icon;
                      return (
                        <motion.div key={idx} variants={itemVariants}>
                          <Card3D className="h-full">
                            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all h-full">
                              <Icon className={`${skill.color} mb-2`} size={24} />
                              <p className="font-semibold">{skill.name}</p>
                            </div>
                          </Card3D>
                        </motion.div>
                      );
                    })}
                  </div>
                </StaggerChildren>
              </AnimatedSection>
            </div>

            {/* Experience Timeline */}
            <div className="mt-16 space-y-6">
              <AnimatedSection direction="up" delay={0.1}>
                <h3 className="text-3xl font-bold mb-8 text-center">
                  Experience
                </h3>
              </AnimatedSection>

              <StaggerChildren staggerDelay={0.06}>
                {experience.map((exp, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card3D>
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {exp.role}
                        </h4>
                        <p className="text-xl font-semibold">{exp.company}</p>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
                        <p className="flex items-center gap-2">
                          <Calendar size={16} />
                          {exp.period}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={16} />
                          {exp.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {exp.description}
                    </p>
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">
                            •
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {highlight}
                          </span>
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
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" delay={0}>
              <h2 className="text-4xl sm:text-5xl font-bold text-center mb-8">
                Featured{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
            </AnimatedSection>

            <FadeInSection delay={0.02}>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      activeFilter === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
                    }`}
                    aria-pressed={activeFilter === category}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </FadeInSection>

            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Card3D className="h-full">
                      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full flex flex-col">
                        <div
                          className={`h-2 bg-gradient-to-r ${project.gradient}`}
                        />
                        <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold mb-3">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <ExternalLink size={18} />
                            Live Demo
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:underline"
                          >
                            <Github size={18} />
                            Code
                          </motion.button>
                        </div>
                        </div>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" delay={0}>
              <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
                What I{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Offer
                </span>
              </h2>
            </AnimatedSection>

            <StaggerChildren staggerDelay={0.05}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <motion.div key={idx} variants={itemVariants}>
                      <Card3D className="h-full">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all h-full">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className={`w-16 h-16 rounded-lg bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4`}
                          >
                            <Icon size={32} className="text-white" />
                          </motion.div>
                          <h3 className="text-xl font-bold mb-3">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
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
        <section id="contact" className="py-20 relative overflow-hidden">
          {/* Animated background effects */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 50, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 dark:from-cyan-500/5 dark:via-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl"
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection direction="up" delay={0}>
              <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
                Get In{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </h2>
            </AnimatedSection>

            <FadeInSection delay={0.05}>
              <Card3D>
                <form
                  onSubmit={handleSubmit}
                  className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                >
                {/* Gradient border glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Animated corner lights */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-transparent dark:from-blue-500/20 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1.2, 1, 1.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/30 to-transparent dark:from-purple-500/20 rounded-full blur-2xl"
                />
                {/* Status Message */}
                <AnimatePresence>
                  {submitStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`relative z-10 p-4 rounded-lg ${
                        submitStatus.type === 'success'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700'
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  <label className="block text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isSubmitting || isPending}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div className="relative z-10">
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isSubmitting || isPending}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="relative z-10">
                  <label className="block text-sm font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    disabled={isSubmitting || isPending}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    placeholder="Your message..."
                  />
                </div>

                <motion.button
                  whileHover={!isSubmitting && !isPending ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting && !isPending ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="relative z-10 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting || isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      {submitMessage || 'Sending...'}
                    </>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
                </form>
              </Card3D>
            </FadeInSection>

            <AnimatedSection direction="up" delay={0.08}>
              <div className="mt-12 text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Or reach me directly at:
                </p>
                <a
                  href="mailto:hssahil2913@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-semibold"
                >
                  hssahil2913@gmail.com
                </a>
                <p className="text-gray-600 dark:text-gray-400">
                  +92-302-4891399
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sahil Ijaz
                </p>
                <p className="text-gray-400 mt-2">Full Stack Developer</p>
              </div>

              <div className="flex gap-6">
                {[
                  { Icon: Github, href: "https://github.com/SahilIjaz" },
                  {
                    Icon: Linkedin,
                    href: "https://www.linkedin.com/in/sahil-ijaz-a75b15281/",
                  },
                  { Icon: Mail, href: "mailto:hssahil2913@gmail.com" },
                ].map(({ Icon, href }, idx) => (
                  <motion.a
                    key={idx}
                    href={href}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>© 2025 Sahil Ijaz. All rights reserved.</p>
              <p className="mt-2">
                Built with Next.js, Tailwind CSS & Framer Motion
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;