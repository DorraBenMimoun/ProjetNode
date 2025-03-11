import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../services/task.service'; // Remplace par ton vrai service

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html'
})
export class TaskEditModalComponent {
  @Input() task: any = {};
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>(); // Pour notifier la maj

  private title = '';
  private description = '';
  private hasSaved = false;

  ngOnInit(){
    this.title = this.task.title;
    this.description = this.task.description;
  }

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}

  onClose() {
    this.close.emit();
    if(!this.hasSaved){
      this.task.title = this.title;
      this.task.description = this.description;
    }

  }

  onSubmit() {
    this.taskService.updateTask(this.task._id, this.task).subscribe({
      next: () => {
        this.toastr.success('Tâche modifiée avec succès', 'Succès');
        this.updated.emit(); // Événement pour signaler la maj
        this.hasSaved = true;
        this.onClose(); // Fermer le modal
      },
      error: () => {
        this.toastr.error('Erreur lors de la modification', 'Erreur');
        }
    });
  }
}
