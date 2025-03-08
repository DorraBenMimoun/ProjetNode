import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjetComponent } from './projet/projet.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { Dashboard2Component } from './components/dashboard2/dashboard2.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'task', component: TasksComponent},
  { path: 'project', component: ProjetComponent},
  { path: 'login', component: UserComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'home', component: HomeComponent},
  { path: 'dashboard2', component: Dashboard2Component},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
