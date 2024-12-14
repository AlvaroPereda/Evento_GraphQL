import { MongoClient } from "mongodb"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';
import { EventModel, InscriptionModel, UserModel } from "./type.ts";
import { typeDefs } from "./typeDefs.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = "mongodb+srv://aperedas:18062004@backend.61kmp.mongodb.net/?retryWrites=true&w=majority&appName=Backend"

const client = new MongoClient(MONGO_URL)
await client.connect()
console.log("Conectado a MongoDB")

const db = client.db("Evento")
const EventCollection = db.collection<EventModel>("event")
const InscriptionCollection = db.collection<InscriptionModel>("inscription")
const UserCollection = db.collection<UserModel>("users")

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server,{
  context: async() => ({ EventCollection, InscriptionCollection, UserCollection })
})

console.log(`🚀  Server ready at: ${url}`);