import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../entities';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    await userRepository.insert([
      {
        first_name: 'demo',
        last_name: 'patel',
        email: 'demo@patel.com',
        name: 'demo',
        mobile: '1234567890',
        password:
          '$2a$12$HmSz3YBjh9WsGbTyYZzMb.MBp/Fs7e.YnCw.ecaFIRp8Mw3clVx66',
        status: true,
        role_id: 1,
      },
    ]);

    console.log('User seeded successfully.');
  }
}
