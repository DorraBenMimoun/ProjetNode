export interface Comment {
    _id: string;
    taskId: string;
    userId: {
      _id: string;
      username: string;
    };
    text: string;
    createdAt: string;
  }
  