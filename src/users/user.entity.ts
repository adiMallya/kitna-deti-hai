import { Entity, Column, PrimaryGeneratedColumn, AfterUpdate } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @AfterUpdate()
  logUpdates() {
    console.log(`User by the id ${this.id} updated`);
  }
}
