interface ProjectWithTech {
  tech: string[];
}

export const filterByTech = <T extends ProjectWithTech>(projects: T[], tech: string): T[] => {
  return projects.filter((p) => p.tech.includes(tech));
};
