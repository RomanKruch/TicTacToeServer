import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsoketModule } from './websoket/websoket.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WebsoketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
