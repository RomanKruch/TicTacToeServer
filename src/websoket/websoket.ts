import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type PlayerValue = 'X' | 'O';

type FieldItem = PlayerValue | '';

interface Player {
  id: string;
  value: PlayerValue;
}

interface GameMoveData {
  index: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },

})
export class Websoket implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // constructor() {
  //   this.server.path('qwe');
  // }

  field = new Array<FieldItem>(9).fill('');
  players: Player[] = [];
  readonly values: PlayerValue[] = ['X', 'O'];

  onModuleInit() {
    this.server.path('qwe');
    this.server.on('connect', (socket) => {
      // if (this.players.length === 2) {
      //   console.log('disss', this.players.length);
      //   socket.disconnect();
      //   return;
      // }

      const currentValue = this.values[this.players.length];

      this.players.push({
        id: socket.id,
        value: currentValue,
      });
      console.log('Connected:  ' + socket.id);

      // this.server.emit('userConnect', {
      //   players: this.players,
      // });

      socket.emit('onUserConnect', {
        id: socket.id,
        currentValue,
        field: this.field,
      });
    });
  }

  @SubscribeMessage('onGameMove')
  onGameMove(
    @MessageBody('index') index: string,
    @ConnectedSocket() client: Socket,
  ) {
    const value = this.players.find((player) => player.id === client.id).value;
    this.field[index] = value;

    this.server.emit('onGameMove', {
      currentPlayer: client.id,
      field: this.field,
    });

    WINNING_COMBINATIONS.forEach((value) => {
      const [a, b, c] = value;

      if (
        this.field[a] === this.field[b] &&
        this.field[a] === this.field[c] &&
        this.field[a]
      ) {
        this.server.emit('onGameEnd', {
          winnerId: client.id,
          winnerValue: this.field[a],
        });
        console.log('WIN !!!!!!', this.field[a]);
        this.server.close();
        return;
      }
    });
  }
}
