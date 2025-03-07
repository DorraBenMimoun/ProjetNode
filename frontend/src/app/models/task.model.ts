export interface Task {
    _id?: string;
    title: string;
    description: string;
    checklist?: ChecklistItem[];
    status: "TO_DO" | "DOING" | "DONE";
    dateDebut?: Date;
    dateTerminee?: Date;
    createdBy: string; // ID de l'utilisateur qui a créé la tâche
    doneBy?: string; // ID de l'utilisateur qui a terminé la tâche
    archived: boolean;
    project: string; // ID du projet auquel appartient la tâche
    comments?: Comment[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ChecklistItem {
    title: string;
    done: boolean;
  }
  export interface Comment {
    _id?: string;
    text: string;
    author: string; // ID de l'utilisateur
    task: string; // ID de la tâche associée
    createdAt?: Date;
  }
  