import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Carts } from './entities/carts.entity';
import { CartItems } from './entities/cart_items.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'), // RDS endpoint
          port: configService.get('DB_PORT'), // RDS port
          username: configService.get('DB_USER'), // RDS username
          password: configService.get('DB_PASSWORD'), // RDS password
          database: configService.get('DB_NAME'), // Your database name
          synchronize: false, // Set to true only in development
          logging: false, // Enable query logging for debugging (optional)
          ssl: {
            rejectUnauthorized: false, // Disable strict certificate checking; set to `true` in production with valid RDS certificates.
          },
          entities: [Carts, CartItems], // Specify your entities here
        };
      },
    }),
    TypeOrmModule.forFeature([Carts, CartItems]),
  ],
  providers: [ConfigService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
