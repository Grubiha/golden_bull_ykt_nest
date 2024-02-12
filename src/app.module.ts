import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EditorsModule } from './editors/editors.module';

@Module({
  imports: [UsersModule, EditorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
