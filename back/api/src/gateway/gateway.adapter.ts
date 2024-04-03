import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { plainToInstance } from 'class-transformer';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { Session } from 'src/auth/entities/session.entity';
import { AuthenticatedSocket } from 'src/types';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

export class WebsocketAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplicationContext,
    private readonly sessionRepo: Repository<Session>,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log('Inside Websocket Adapter');
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        console.log('Client has no cookies');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const { CHAT_APP_SESSION_ID } = cookie.parse(clientCookie);
      if (!CHAT_APP_SESSION_ID) {
        console.log('CHAT_APP_SESSION_ID DOES NOT EXIST');
        return next(new Error('Not Authenticated'));
      }
      const signedCookie = cookieParser.signedCookie(
        CHAT_APP_SESSION_ID,
        process.env.COOKIE_SECRET,
      );
      if (!signedCookie) return next(new Error('Error signing cookie'));
      const sessionDB = await this.sessionRepo.findOneBy({ id: signedCookie });
      if (!sessionDB) return next(new Error('No session found'));
      const userFromJson = JSON.parse(sessionDB.json);
      if (!userFromJson.passport || !userFromJson.passport.user)
        return next(new Error('Passport or User object does not exist.'));
      const userDB = plainToInstance(
        User,
        JSON.parse(sessionDB.json).passport.user,
      );
      socket.user = userDB;
      next();
    });
    return server;
  }
}
