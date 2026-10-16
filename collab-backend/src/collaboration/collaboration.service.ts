import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Operation } from './types/collaboration.types';

@Injectable()
export class CollaborationService {
  constructor(private readonly logger: Logger) {}

  // TODO: Validate and presist the data
  handleOperation(client: Socket, operation: Operation) {
    this.logger.log('Recived operation', operation);
    this.logger.log('From client', client);
    return operation;
  }
}
