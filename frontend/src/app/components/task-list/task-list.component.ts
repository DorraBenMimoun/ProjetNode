import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: string;
  doneBy?: string;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task._id !== id);
    });
  }

  setInProgress(id: string): void {
    this.taskService.setTaskInProgress(id).subscribe((updatedTask) => {
      this.tasks = this.tasks.map((task) =>
        task._id === id ? updatedTask : task
      );
    });
  }

  setCompleted(id: string): void {
    this.taskService.setTaskCompleted(id).subscribe((updatedTask) => {
      this.tasks = this.tasks.map((task) =>
        task._id === id ? updatedTask : task
      );
    });
  }
}
