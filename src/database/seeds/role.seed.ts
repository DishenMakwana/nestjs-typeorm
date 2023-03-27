import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../entities';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);

    await roleRepository.insert([
      {
        id: 1,
        name: 'admin',
      },
      {
        id: 2,
        name: 'user',
      },
    ]);

    console.log('Role seeded successfully.');
  }
}
