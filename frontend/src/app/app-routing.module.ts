import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [
  { path: 'login', component: UserComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'list', component: TaskListComponent },
  { path: 'tasks', component: TasksComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
