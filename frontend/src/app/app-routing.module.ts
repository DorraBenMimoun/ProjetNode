import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjetComponent } from './projet/projet.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'task', component: TasksComponent},
  { path: 'project', component: ProjetComponent},
  { path: 'login', component: UserComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'dashboard/project', component: ProjetComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
