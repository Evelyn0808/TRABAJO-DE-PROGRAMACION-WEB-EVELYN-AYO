import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ProductosModule , TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '1234',
  port: 5432,
  database: 'Tabla Tienda Web',
  autoLoadEntities: true,
  synchronize: true,

  }), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
