import * as argon2 from "argon2";

async function generate() {
  const password = "Admin@123";

  const hash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  console.log(" Generated Hash:\n");
  console.log(hash);
}

generate();
