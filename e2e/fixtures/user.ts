export const userWithoutEmail = {
  _id: 'user',
  name: 'user',
  password: 'password',
  type: 'user'
};

export const userWithEmail = {
  ...userWithoutEmail,
  email: 'email@email.com'
};
