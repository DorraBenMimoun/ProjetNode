import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProjetComponent } from './projet/projet.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: UserComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'list', component: TaskListComponent },
  { path: 'task', component: TasksComponent},
  { path: 'project', component: ProjetComponent},
  { path: 'login', component: UserComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'home', component: HomeComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
