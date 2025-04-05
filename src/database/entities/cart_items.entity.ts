import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Carts } from './carts.entity';

@Entity()
export class CartItems {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  cart_id: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  product_id: string;

  @Column({ type: 'integer', nullable: false }) count: number;

  @ManyToOne(() => Carts, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: Carts;
}
