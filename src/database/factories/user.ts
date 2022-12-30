import { define } from 'typeorm-seeding';
import { User } from '../../user/entities/user.entity';

define(User, (fake) => {
  const user = new User();
  user.name = fake.name.firstName();

  return user;
});
