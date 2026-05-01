export const filterByTech = (projects, tech) => {
  return projects.filter(p => p.tech.includes(tech));
};
