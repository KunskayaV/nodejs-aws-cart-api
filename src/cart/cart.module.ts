import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { Carts } from 'src/database/entities/carts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItems } from 'src/database/entities/cart_items.entity';

@Module({
  imports: [OrderModule, TypeOrmModule.forFeature([Carts, CartItems])],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
