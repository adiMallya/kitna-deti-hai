import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, AfterUpdate, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterUpdate()
  logUpdates() {
    console.log(`User by the id ${this.id} updated`);
  }
}
