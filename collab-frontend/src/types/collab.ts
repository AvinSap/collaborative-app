export const COLLABEVENT = {
  OPERATION: 'operation',
  JOIN_BOARD: 'join_board',
} as const

export type OperationType =
  | 'object.created'
  | 'object.updated'
  | 'object.deleted'
  | 'object.moved'

export interface Operation {
  operationId: string
  boardId: string
  clientId: string
  type: OperationType
  payload: unknown
}