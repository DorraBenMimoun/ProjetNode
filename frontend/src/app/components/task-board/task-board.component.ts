// src/app/components/task-board/task-board.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnChanges {
  @Input() projectId!: string;
  @Input() projectName!: string;

  taskColumns: { [key: string]: Task[] } = {
    TO_DO: [],
    DOING: [],
    DONE: []
  };

  newTask: Task = {
    _id:'',
    title: '',
    description: '',
    status: 'TO_DO',
    archived: false,
    createdBy: 'user-id',
    project: '',
    checklist: [],
    comments: []
  };

  showAddTaskForm: boolean = false;
  statuses = ['TO_DO', 'DOING', 'DONE'];

  constructor(private taskService: TaskService, private toastr: ToastrService) {}


  ngOnChanges(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        const filtered = tasks.filter(t => t.project === this.projectId);
        this.taskColumns = {
          TO_DO: filtered.filter(t => t.status === 'TO_DO'),
          DOING: filtered.filter(t => t.status === 'DOING'),
          DONE: filtered.filter(t => t.status === 'DONE')
        };
      },
      error: (err) => console.error("Erreur tâches", err)
    });
  }

  addTask() {
    if (!this.newTask.title.trim()) return;

    const taskToSend = { ...this.newTask, projectId: this.projectId };
    this.taskService.createTask(taskToSend).subscribe({
      next: (data) => {
        console.log("Task recuperee : ", data.task);
        this.taskColumns['TO_DO'].push(data.task);
        this.showAddTaskForm = false;
        this.newTask.title = '';
        this.newTask.description = '';
        this.toastr.success('Tâche ajoutée avec succès', 'Succès');

      },
      error: (err) => {
        console.error("Erreur ajout tâche", err);
        this.toastr.error('Erreur lors de l’ajout de la tâche', 'Erreur');
      }
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.taskColumns = {
          TO_DO: this.taskColumns['TO_DO'].filter(t => t._id !== id),
          DOING: this.taskColumns['DOING'].filter(t => t._id !== id),
          DONE: this.taskColumns['DONE'].filter(t => t._id !== id)
        };

        this.toastr.success('Tâche supprimée avec succès', 'Succès');
  
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la tâche', error);
        this.toastr.error('Erreur lors de la suppression de la tâche', 'Erreur');
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    const task = event.previousContainer.data[event.previousIndex];
    const newStatus = event.container.id as Task['status'];

    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

    this.taskService.updateTask(task._id!, { status: newStatus }).subscribe({
      next: () => {
        this.toastr.success('Statut de la tâche mis à jour', 'Succès');
      },
      error: (err) => {
        console.error("Erreur maj statut", err);
        this.toastr.error('Erreur lors de la mise à jour du statut de la tâche', 'Erreur');
        transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
      }
    });
  }
}
