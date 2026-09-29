export interface JoinBoardPayload {
  boardId: string;
}

export type OperationType =
  'object.created' | 'object.updated' | 'object.deleted' | 'object.moved';

export interface Operation {
  operationId: string;
  boardId: string;
  clientId: string;
  type: OperationType;
  payload: unknown;
}
