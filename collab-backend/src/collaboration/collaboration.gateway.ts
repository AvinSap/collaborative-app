import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { COLLABEVENT } from './enum/collaboration.enum';
import { CollaborationService } from './collaboration.service';
import { Socket } from 'socket.io';
import { JoinBoardPayload, Operation } from './types/collaboration.types';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class CollaborationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly collaborationService: CollaborationService,
    private readonly logger: Logger,
  ) {}

  afterInit() {
    this.logger.log('Collaboration gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(COLLABEVENT.JOIN_BOARD)
  handleJoinBoard(client: Socket, payload: JoinBoardPayload) {
    void client.join(payload.boardId);

    return {
      boardId: payload.boardId,
      joined: true,
    };
  }

  @SubscribeMessage(COLLABEVENT.OPERATION)
  handleOperation(client: Socket, operation: Operation) {
    const processedOperation = this.collaborationService.handleOperation(
      client,
      operation,
    );

    client.broadcast
      .to(operation.boardId)
      .emit(COLLABEVENT.OPERATION, processedOperation);
  }
}
