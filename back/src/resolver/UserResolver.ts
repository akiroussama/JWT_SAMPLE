import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import { Arg, Mutation, Query, Resolver } from "type-graphql";
import dataSource from "../utils";
import { User } from "../entity/User";

@Resolver()
class UserResolver {
  @Mutation(() => String)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<String> {
    const user = new User();
    user.email = email;
    /* Un nouvel utilisateur est créé et son mot de passe est haché à l'aide de la bibliothèque argon2,
 qui est une bibliothèque de hachage de mot de passe sécurisée. */
    user.hashedPassword = await argon2.hash(password);
    await dataSource.getRepository(User).save(user);
    return "user created";
  }

  @Query(() => String)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<String> {
    const user = await dataSource
      .getRepository(User)
      .findOneByOrFail({ email });

    try {
      if (await argon2.verify(user.hashedPassword, password)) {
        /* Si le mot de passe est valide, un token JWT est créé et renvoyé au client. */
        const token = jwt.sign({ email }, "supersecretkey");
        return token;
      } else {
        return "error";
      }
    } catch (err) {
      console.log(err);
      return "error";
    }
  }
}

export default UserResolver;
