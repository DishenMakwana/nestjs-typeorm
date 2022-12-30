import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Code } from './code.entity';
import { Role } from './role.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  last_name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  mobile: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  status: boolean;

  @Column()
  role_id: number;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
  })
  deleted_at: Date;

  @OneToMany(() => Code, (code) => code.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  codes: Code[];

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    eager: true,
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;
}
