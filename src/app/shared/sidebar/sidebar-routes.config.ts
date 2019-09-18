import { RouteInfo } from "./sidebar.metadata";
 
//Sidebar menu Routes and data
export const ROUTES = [
  {
    path: "/personal-info",
    title: "Introduction",
    name:"Personal Info",
    ids : "",
    sectionname : "Personal Info",
    type : "section-personal-info",
    icon : "ft-user"
},
{
  path: "/introduction",
  title: "Introduction",
  sectionname : "Introduction",
  type : "summary",
  icon : "ft-user",
  // type : "section-text" to be work on old app
},
  {
    path: "/summary",
    type : "section-text"
  },
  {
    path: "/work-experience", 
    type : "section-work"
  },
  {
    path: "/education",
    type : "section-education" 
  },
  { 
    path: "/languages",
    type : "section-languages"
  },
  { 
    path: "/skills",
    type : "section-skillset"
  },
  { 
    path: "/empty-space",
    type : "section-empty-space"
  },
  {
    path: "/awards",
    type : "section-awards" 
  },
  {
    path: "/certifications",
    type : "section-certifications" 
  },
  {
    path: "/courses",
    type : "section-courses"
  },
  { 
    path: "/skills-competences",
    type : "section-skillset"
  },
  { 
    path: "/hobbies",
    type : "section-Hobbies"
  },
  {
    path: "/interests",
    type : "section-interests" 
  },
  {
    path: "/portfolio",
    type : "section-portfolio" 
  },
  {
    path: "/clients-logos",
    type : "section-logos" 
  },
  {
    path: "/software",
    type : "section-software" 
  },
  {
    path: "/free-text",
    type : "section-free-text-inside" 
  },
  {
    path: "/references",
    type : "section-references" 
  },
  {
    path: "/world-map",
    type : "section-world-map" 
  },
  {
    path: "/publications",
    type : "section-publications" 
  },
  {
    path: "/computer-skills",
    type : "section-skillset" 
  }

  // {
  //   path: "/areas-of-expertise",
  //   type : "section-interests" 
  // }
];
