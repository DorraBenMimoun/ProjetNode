import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { orderBy } from 'lodash';


@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html'
})
export class TaskModalComponent implements OnInit { 
  @Input() task!: any;
  @Output() close = new EventEmitter<void>();

  openEditModal() {
    this.showEditModal = true;
  }
  
  closeEditModal() {
    this.showEditModal = false;
  }

  loadTask(){
    
  }
  

  newComment: string = '';
  comments: any[] = [];  
  showEditModal: boolean = false;



  constructor(private commentService: CommentService,
        private toastr: ToastrService
    
  ) {}

   userId = localStorage.getItem('userId');


 
  ngOnInit(): void {
    this.loadComments();  
  }

 
  loadComments() {
    this.commentService.getCommentsByTask(this.task._id).subscribe({
      next: (data) => {
        this.comments = data;  // Stocker les commentaires récupérés
        this.comments = orderBy(this.comments, 'createdAt', 'asc'); // Trier par date croissante

      },
      error: (err) => {
        console.error('Erreur lors de la récupération des commentaires', err);
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  addComment() {
    if (this.newComment.trim()) {
      const commentText = this.newComment.trim();

      this.commentService.addComment(this.task._id, commentText).subscribe({
        next: () => {
          console.log('Commentaire ajouté avec succès');
          this.loadComments();

          this.toastr.success('Commentaire ajouté avec succès', 'Succès');

        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du commentaire', err);
          this.toastr.error('Erreur lors de l\'ajout du commentaire', 'Erreur');
        }
      });

      this.newComment = '';
    }
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        console.log('Commentaire supprimé avec succès');
        this.loadComments();
        this.toastr.success('Commentaire supprimé avec succès', 'Succès');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du commentaire', err);
        this.toastr.error('Erreur lors de la suppression du commentaire', 'Erreur');
      }
    });
  }

 
}
