import { createContext, useContext, useReducer } from "react";

import qland from "../../backend/artifacts/contracts/QapturLand.sol/QapturLand.json";
import qco2 from "../../backend/artifacts/contracts/QapturCo2.sol/QapturCo2.json";

const ProjectsContext = createContext(null);

const ProjectsDispatchContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, dispatch] = useReducer(projectsReducer, initialProjects);

  return (
    <ProjectsContext.Provider value={projects}>
      <ProjectsDispatchContext.Provider value={dispatch}>
        {children}
      </ProjectsDispatchContext.Provider>
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}

export function useProjectsDispatch() {
  return useContext(ProjectsDispatchContext);
}

function projectsReducer(projects, action) {
  switch (action.type) {
    case "add": {
      return { ...projects, array: [...projects.array, action.project] };
    }
    case "updateSupply": {
      return {
        ...projects,
        array: projects.array.map((project) => {
          if (project.id === action.projectId) {
            return { ...project, availableSupply: action.newSupply };
          } else {
            return project;
          }
        }),
      };
    }
    // purge context on disconnect
    case "clear": {
      return initialProjects;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialProjects = {
  qlandAbi: qland.abi,
  qco2Abi: qco2.abi,
  array: [
    /*
    { // structure based on json
      id: 1,
      name: "",
      description: "",
      image: "",
      url: "",
      qlandAddr: "",
      qco2Addr: "",
      supply: "",
      availableSupply: "",
      price: ""
      attributes: "",
    },
    */
  ],
};
