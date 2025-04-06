import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartStatuses } from '../models';
import { PutCartPayload } from 'src/order/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Carts } from 'src/database/entities/carts.entity';
import { Repository } from 'typeorm';
import { CartItems } from 'src/database/entities/cart_items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Carts)
    private readonly cartRepository: Repository<Carts>,
    @InjectRepository(CartItems)
    private readonly cartItemsRepository: Repository<CartItems>,
  ) {}

  async findByUserId(userId: string): Promise<Carts> {
    return await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });
  }

  async findOrCreateByUserId(userId: string): Promise<Carts> {
    const userCart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });

    if (userCart) {
      return userCart;
    }

    try {
      const newCart = this.cartRepository.create({
        user_id: userId,
        status: CartStatuses.OPEN,
      });

      return this.cartRepository.save(newCart);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating cart');
    }
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<Carts> {
    const userCart = await this.findByUserId(userId);

    if (!userCart) {
      throw new NotFoundException('Cart not found');
    }
    if (userCart.status !== CartStatuses.OPEN) {
      throw new BadRequestException('Cart is not open');
    }

    const existingCartItem = await this.cartItemsRepository.findOne({
      where: {
        cart_id: userCart.id,
        product_id: payload.product.id,
      },
    });

    if (existingCartItem) {
      if (payload.count === 0) {
        // Remove the item if count is 0
        await this.cartItemsRepository.delete({
          cart_id: userCart.id,
          product_id: payload.product.id,
        });
      } else {
        // Update the item count
        existingCartItem.count = payload.count;
        await this.cartItemsRepository.save(existingCartItem);
      }
    } else if (payload.count > 0) {
      // Add a new item if it doesn't exist and count > 0
      const newCartItem = this.cartItemsRepository.create({
        cart_id: userCart.id,
        product_id: payload.product.id,
        count: payload.count,
      });
      await this.cartItemsRepository.save(newCartItem);
    }

    return await this.findOrCreateByUserId(userId);
  }

  removeByUserId(userId): void {
    this.cartRepository.delete({ user_id: userId });
  }
}
