export interface CreateTaskInput {
  title: string;
  body?: string;
  priority?: string;
}

export interface CreateTaskCommentInput {
  body: string;
}

export interface UpdateTaskStatusInput {
  workflowId: string;
}
