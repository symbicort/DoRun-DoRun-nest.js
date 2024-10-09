import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_num' })
  userNum: number;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'nickname', nullable: true })
  nickname: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @Column({ name: 'profile_img', nullable: true })
  profileImg: string;

  @Column({ name: 'refresh_key', nullable: true })
  refreshKey: string;

  @Column({ name: 'room_id', nullable: true })
  roomId: string;
}
