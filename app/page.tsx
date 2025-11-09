'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Twitter, ExternalLink, Download, 
  Code2, Database, Cloud, Zap, MessageSquare, Menu, X,
  Sun, Moon, ChevronDown, MapPin, Calendar, Building2
} from 'lucide-react';

// Data from CV
const projectsData = [
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

const skills = [
  { name: "Node.js", icon: Code2, color: "text-green-500" },
  { name: "Next.js", icon: Code2, color: "text-gray-900 dark:text-white" },
  { name: "React.js", icon: Code2, color: "text-blue-500" },
  { name: "Nest.js", icon: Code2, color: "text-red-500" },
  { name: "MongoDB", icon: Database, color: "text-green-600" },
  { name: "PostgreSQL", icon: Database, color: "text-blue-600" },
  { name: "AWS", icon: Cloud, color: "text-orange-500" },
  { name: "Socket.io", icon: Zap, color: "text-purple-500" }
];

const services = [
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

const experience = [
  {
    company: "Bridge Zone",
    role: "Backend Developer",
    location: "Lahore, Pakistan",
    period: "July 2024 – Present",
    description: "Mobile app development company specializing in scalable digital solutions",
    highlights: [
      "Engineered and maintained over 5 real-time backend services",
      "Designed scalable architectures using Node.js and Express",
      "Integrated Socket.IO, Stripe, and Agora services",
      "Deployed applications on AWS EC2 and managed media via S3"
    ]
  }
];

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const categories = ['All', ...new Set(projectsData.map(p => p.category))];
  const filteredProjects = activeFilter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeFilter);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! This is a demo - integrate with EmailJS or your backend.');
    setFormData({ name: '', email: '', message: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
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
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2"
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
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-blue-600 dark:hover:text-blue-400"
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 mb-4"
              >
                Hi, I'm
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Sahil Ijaz
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl sm:text-3xl text-gray-700 dark:text-gray-300 mb-4"
              >
                Full Stack Developer
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
              >
                Next.js & Node.js Specialist | Turning ideas into interactive
                web experiences
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
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

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full font-semibold flex items-center gap-2"
                >
                  <Download size={20} />
                  Download Resume
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex gap-6 justify-center mt-12"
              >
                {[
                  { Icon: Github, href: "#" },
                  { Icon: Linkedin, href: "#" },
                  { Icon: Twitter, href: "#" },
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
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <ChevronDown size={32} className="text-gray-400" />
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl font-bold text-center mb-16"
              >
                About{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Me
                </span>
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div variants={itemVariants} className="space-y-6">
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
                    <span className="font-semibold">Bridge Zone</span> in
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
                        Bridge Zone - Backend Developer
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
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill, idx) => {
                      const Icon = skill.icon;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                          <Icon className={`${skill.color} mb-2`} size={24} />
                          <p className="font-semibold">{skill.name}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Experience Timeline */}
              <motion.div variants={itemVariants} className="mt-16">
                <h3 className="text-3xl font-bold mb-8 text-center">
                  Experience
                </h3>
                {experience.map((exp, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg"
                  >
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
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl font-bold text-center mb-8"
              >
                Featured{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Projects
                </span>
              </motion.h2>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      activeFilter === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -10 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                    >
                      <div
                        className={`h-2 bg-gradient-to-r ${project.gradient}`}
                      />
                      <div className="p-6">
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl font-bold text-center mb-16"
              >
                What I{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Offer
                </span>
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all"
                    >
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
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl font-bold text-center mb-16"
              >
                Get In{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Touch
                </span>
              </motion.h2>

              <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg space-y-6"
              >
                <div>
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
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
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
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
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
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Send Message
                </motion.button>
              </motion.form>

              <motion.div
                variants={itemVariants}
                className="mt-12 text-center space-y-4"
              >
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
              </motion.div>
            </motion.div>
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
              <p>© 2024 Sahil Ijaz. All rights reserved.</p>
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