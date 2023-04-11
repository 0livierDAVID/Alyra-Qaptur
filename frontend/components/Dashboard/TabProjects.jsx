import { Box, Grid } from "@mui/material";
import TabProjectCard from "./helper/TabProjectCard";
import { useEffect, useState } from "react";
import Project from "@/pages/projects/[id]";

export default function TabProjects({ projects, userProjects }) {
  const [projectList, setProjectList] = useState([]);
  useEffect(() => {
    if (projects.length > 0 && userProjects.length > 0) {
      let list = [];
      userProjects.map((uProject) => {
        const current = projects.find((project) => uProject.id === project.id);
        list.push({
          id: uProject.id,
          name: current.name,
          image: current.image,
          country: current.attributes.country,
          nbShare: uProject.balance,
        });
      });
      setProjectList(list);
    }
  }, [projects, userProjects]);
  return (
    <Box>
      <Grid container spacing={1}>
        {projectList.map((project) => (
          <TabProjectCard key={project.id} {...project} />
        ))}
      </Grid>
    </Box>
  );
}
