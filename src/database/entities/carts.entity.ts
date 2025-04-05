import { CartStatuses } from 'src/cart';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItems } from './cart_items.entity';

@Entity()
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false }) user_id: string;

  @Column({
    type: 'enum',
    enum: CartStatuses,
    nullable: false,
    default: CartStatuses.OPEN,
  })
  status: CartStatuses;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => CartItems, (item) => item.cart)
  @JoinColumn({ name: 'id', referencedColumnName: 'cart_id' })
  items?: CartItems[];
}
