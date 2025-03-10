// src/app/components/task-board/task-board.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { Task } from '../../models/task.model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnChanges {
  @Input() projectId!: string;
  @Input() projectName!: string;

  tasks: Task[] = [];
  newTask: Task = {
    _id: '',
    title: '',
    description: '',
    status: 'TO_DO',
    archived: false,
    createdBy: 'user-id',
    project: '',
    checklist: [],
    comments: []
  };

  showAddTaskForm = false;
  showArchived = false;
  statuses = ['TO_DO', 'DOING', 'DONE'];

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) {}

  ngOnChanges() {
    this.loadTasks();
  }

  loadTasks() {
    this.projectService.getTasksByProjectId(this.projectId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.error('Erreur tâches', err);
        this.toastr.error('Erreur lors de la récupération des tâches', 'Erreur');
      }
    });
  }

  addTask() {
    if (!this.newTask.title.trim()) return;

    const taskToSend = { ...this.newTask, projectId: this.projectId };
    this.taskService.createTask(taskToSend).subscribe({
      next: (data) => {
        this.tasks.push(data.task);
        this.showAddTaskForm = false;
        this.newTask.title = '';
        this.newTask.description = '';
        this.toastr.success('Tâche ajoutée avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Erreur ajout tâche', err);
        this.toastr.error('Erreur lors de l’ajout de la tâche', 'Erreur');
      }
    });
  }

  archiveTask(task: Task): void {
    this.taskService.archiveTask(task._id).subscribe({
      next: () => {
        task.archived = true;
        this.toastr.success('Tâche archivée avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Erreur archivage tâche', err);
        this.toastr.error('Erreur lors de l’archivage de la tâche', 'Erreur');
      }
    });
  }

  restoreTask(id: string): void {
    this.taskService.unarchiveTask(id).subscribe({
      next: () => {
        const task = this.tasks.find(t => t._id === id);
        if (task) task.archived = false;
        this.toastr.success('Tâche restaurée avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Erreur restauration tâche', err);
        this.toastr.error('Erreur lors de la restauration de la tâche', 'Erreur');
      }
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t._id !== id);
        this.toastr.success('Tâche supprimée avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Erreur suppression tâche', err);
        this.toastr.error('Erreur lors de la suppression de la tâche', 'Erreur');
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>, status: string) {
    const task = event.previousContainer.data[event.previousIndex];
    const newStatus = status as Task['status'];

    this.taskService.updateTask(task._id!, { status: newStatus }).subscribe({
      next: () => {
        task.status = newStatus;
        this.toastr.success('Statut de la tâche mis à jour', 'Succès');
      },
      error: (err) => {
        console.error('Erreur maj statut', err);
        this.toastr.error('Erreur lors de la mise à jour du statut de la tâche', 'Erreur');
      }
    });
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status && !task.archived);
  }

  getArchivedTasks(): Task[] {
    return this.tasks.filter(task => task.archived);
  }
}
