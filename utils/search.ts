interface SearchableProject {
  name: string;
  description: string;
}

export const searchProjects = <T extends SearchableProject>(projects: T[], query: string): T[] => {
  return projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );
};
