import bcrypt from 'bcrypt';

function generateHash(password: string) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return hash;
    });
  });
}
