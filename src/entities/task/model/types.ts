export interface CreateTaskInput {
  title: string;
  body?: string;
}

export interface CreateTaskCommentInput {
  body: string;
}

export interface UpdateTaskStatusInput {
  statusId: string;
}
