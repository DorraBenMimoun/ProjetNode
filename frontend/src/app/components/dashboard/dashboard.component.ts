import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface Task {
  _id?: string;
  title: string;
  description?: string;
  status?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<Task[]>('http://localhost:9091/tasks/').subscribe(
      (data) => (this.tasks = data),
      (error) => console.error('Error fetching tasks', error)
    );
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const newTask: Task = { title: this.newTaskTitle, description: this.newTaskDescription };
    
    this.http.post<Task>('http://localhost:9091/tasks/', newTask).subscribe(
      (task) => {
        this.tasks.push(task);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      (error) => console.error('Error adding task', error)
    );
  }

  deleteTask(id: string) {
    this.http.delete(`http://localhost:9091/tasks/${id}`).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task._id !== id);
      },
      (error) => console.error('Error deleting task', error)
    );
  }

  updateTask(task: Task) {
    this.http.put(`http://localhost:9091/tasks/${task._id}`, task).subscribe(
      (updatedTask) => {
        const index = this.tasks.findIndex(t => t._id === task._id);
        if (index !== -1) this.tasks[index] = updatedTask as Task;
      },
      (error) => console.error('Error updating task', error)
    );
  }
  draggedElement: HTMLElement | null = null;

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  drag(event: DragEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('card')) {
      this.draggedElement = target;
      event.dataTransfer?.setData("text/plain", ""); // Requis pour Firefox
    }
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    if (this.draggedElement) {
      const column = (event.target as HTMLElement).closest('.column');
      if (column) {
        column.appendChild(this.draggedElement);
      }
      this.draggedElement = null;
    }
  }
}