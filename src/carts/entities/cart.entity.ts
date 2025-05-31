import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { CartItem } from "../../cart_items/entities/cart_item.entity";

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
    items: CartItem[];
    
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    total: number;

    @Column({ default: false })
    isOrdered: boolean;
}
