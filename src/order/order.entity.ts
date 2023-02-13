import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  issuedDate: string;

  @Column()
  product: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: {
      from: (value) => parseFloat(value),
      to: (value) => value.toString(),
    },
  })
  total: number;
}
