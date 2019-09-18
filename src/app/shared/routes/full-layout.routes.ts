import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
   
  {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsNg2Module'
  },
   {
    path: 'forms',
    loadChildren: './forms/forms.module#FormModule'
  },
  {
    path: 'maps',
    loadChildren: './maps/maps.module#MapsModule'
  },
   
  {
    path: 'cards',
    loadChildren: './cards/cards.module#CardsModule'
  },



  {
    path: 'cv/:id/introduction',
    loadChildren: './sections/introduction/introduction.module#IntroductionModule'
  },
  { 
    path: 'cv/:id/edit-resume',
    loadChildren: './sections/edit-resume/edit-resume.module#EditResumeModule'
  },
  {
    path: 'cv/:id/personal-info',
    loadChildren: './sections/personal-info/personal-info.module#PersonalInfoModule'
  },
  {
    path: 'cv/:id/summary/:ids',
    loadChildren: './sections/summary/summary.module#SummaryModule'
  },
  {
    path: 'cv/:id/work-experience/:ids',
    loadChildren: './sections/work-experience/work-experience.module#WorkExperienceModule'
  },
  {
    path: 'cv/:id/education/:ids',
    loadChildren: './sections/education/education.module#EducationModule'
  },
  {
    path: 'cv/:id/languages/:ids',
    loadChildren: './sections/languages/languages.module#LanguagesModule'
  },
  {
    path: 'cv/:id/skills/:ids',
    loadChildren: './sections/skills-competences/skills-competences.module#SkillsCompetencesModule'
  },
  {
    path: 'cv/:id/empty-space',
    loadChildren: './sections/empty-space/empty-space.module#EmptySpaceModule'
  },
  {
    path: 'cv/:id/awards/:ids',
    loadChildren: './sections/awards/awards.module#AwardsModule'
  },
  {
    path: 'cv/:id/certifications/:ids',
    loadChildren: './sections/certifications/certifications.module#CertificationsModule'
  },
  {
    path: 'cv/:id/courses/:ids',
    loadChildren: './sections/courses/courses.module#CoursesModule'
  },
  {
    path: 'cv/:id/hobbies/:ids',
    loadChildren: './sections/hobbies/hobbies.module#HobbiesModule'
  },
  
  {
    path: 'cv/:id/interests/:ids',
    loadChildren: './sections/interests/interests.module#InterestsModule'
  },

  {
    path: 'cv/:id/clients-logos/:ids',
    loadChildren: './sections/clients-logos/clients-logos.module#ClientsLogosModule'
  },
  {
    path: 'cv/:id/software/:ids',
    loadChildren: './sections/software/software.module#SoftwareModule'
  },
  {
    path: 'free-text',
    loadChildren: './sections/free-text/free-text.module#FreeTextModule'
  },
  {
    path: 'cv/:id/references/:ids',
    loadChildren: './sections/references/references.module#ReferencesModule'
  },
  {
    path: 'cv/:id/world-map/:ids',
    loadChildren: './sections/world-map/world-map.module#WorldMapModule'
  },
  {
    path: 'cv/:id/portfolio/:ids',
    loadChildren: './sections/portfolio/portfolio.module#PortfolioModule'
  },
  {
    path: 'cv/:id/publications/:ids',
    loadChildren: './sections/publications/publications.module#PublicationsModule'
  },




  
 





  {
    path: 'cv/:id/skills-competences/:ids',
    loadChildren: './sections/skills-competences/skills-competences.module#SkillsCompetencesModule'
  },
 
  
  {
    path: 'cv/:id/areas-of-expertise/:ids',
    loadChildren: './sections/areas-of-expertise/areas-of-expertise.module#AreasOfExpertiseModule'
  },
  {
    path: 'cv/:id/computer-skills/:ids',
    loadChildren: './sections/computer-skills/computer-skills.module#ComputerSkillsModule'
  }
  
];