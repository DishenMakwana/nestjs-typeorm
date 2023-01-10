import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../user/entities';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.first_name = faker.name.firstName('male');
  user.last_name = faker.name.lastName('male');
  user.email = faker.internet.email(user.first_name, user.last_name);
  user.password = faker.internet.password();
  user.name = faker.name.firstName('male');
  user.mobile = faker.phone.phoneNumber();
  user.status = true;
  user.role_id = 1;

  return user;
});
