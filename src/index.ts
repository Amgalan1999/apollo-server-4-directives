import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express, { Application } from "express"
import http from "http"
import cors from "cors"
import bodyParser from "body-parser";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { getAuthorizedSchema, upperDirectiveTransformer } from "./directives";

(async () => {
    let schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })

    const app: Application = express()
    const httpServer = http.createServer(app)

    schema = getAuthorizedSchema(schema, "auth")
    schema = upperDirectiveTransformer(schema, "auth")

    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    })

    await server.start()

    app.use(cors(), bodyParser.json(), expressMiddleware(server, {
        context: async () => {
            return {
                "username": "hawkeye",
                "type": "employee",
                "roles": [],
                "iat": 1654104898,
                "exp": 1656696898
            }
        }
    }))

    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000`);
})();