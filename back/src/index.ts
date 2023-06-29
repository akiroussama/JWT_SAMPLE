import "reflect-metadata";
import * as jwt from "jsonwebtoken";
import dataSource from "./utils";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import WilderResolver from "./resolver/WilderResolver";
import SkillResolver from "./resolver/SkillResolver";
import UserResolver from "./resolver/UserResolver";

interface MyContext {
  token?: String;
}

const start = async (): Promise<void> => {
  await dataSource.initialize();

  const typeGraphQLgeneratedSchema = await buildSchema({
    resolvers: [WilderResolver, SkillResolver, UserResolver],
    //  une fonction qui vérifie si un utilisateur est authentifié ou non.
    authChecker: ({ context }) => {
      console.log("context from authchecker", context);
      if (context.email !== undefined) {
        return true;
      } else {
        return false;
      }
    },
  });
  const server = new ApolloServer<MyContext>({
    schema: typeGraphQLgeneratedSchema,
    /*
La fonction context vérifie si l'en-tête authorization est défini et n'est pas vide.
Si c'est le cas, elle vérifie le token JWT en utilisant la bibliothèque jsonwebtoken
 et la clé secrète (supersecretkey).
 Si le token est valide, le payload du token (qui contient les informations de l'utilisateur) 
 est renvoyé et est accessible dans tous les résolveurs. Sinon, un objet vide est retourné.
*/
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      console.log("req", req.headers.authorization);
      if (
        req.headers.authorization !== undefined &&
        req.headers.authorization !== ""
      ) {
        const payload = jwt.verify(
          req.headers.authorization.split("Bearer ")[1],
          "supersecretkey"
        );
        console.log("payload", payload);
        return payload;
      }
      return {};
    },
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at ${url}`);

  console.log("hello hot reload ?");
};

void start();
