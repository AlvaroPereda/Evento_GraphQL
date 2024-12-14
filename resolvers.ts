import { Collection, ObjectId } from "mongodb";
import { EventModel, InscriptionModel, UserModel } from "./type.ts";

type Context = {
    EventCollection: Collection<EventModel>,
    InscriptionCollection: Collection<InscriptionModel>,
    UserCollection: Collection<UserModel>
}

export const resolvers = {
    User: {
        id: (parent:UserModel) => parent._id?.toString()
    },
    Event: {
        id: (parent:EventModel) => parent._id?.toString(),
        date: (parent:EventModel) => parent.date.toString(),
        organizer: async(
            parent:EventModel,
            _:unknown,
            context: Context
        ) => await context.UserCollection.findOne({_id: parent.organizer})
    },
    Inscription: {
        id: (parent:InscriptionModel) => parent._id?.toString(),
        user_id: async (
            parent:InscriptionModel,
            _:unknown,
            context: Context
        ) => await context.UserCollection.findOne({_id: parent.user_id}),
        event_id: async (
            parent:InscriptionModel,
            _:unknown,
            context: Context
        ) => await context.EventCollection.findOne({_id: parent.event_id}),
        date: (parent:InscriptionModel) => parent.date.toString()
    },

    Query: {
        getUser: async(
            _:unknown,
            __:unknown,
            context: Context
        ):Promise<UserModel[]> => await context.UserCollection.find().toArray(),
        getEvent: async(
            _:unknown,
            __:unknown,
            context: Context
        ):Promise<EventModel[]> => await context.EventCollection.find().toArray(),
        getInscription: async(
            _:unknown,
            __:unknown,
            context: Context
        ):Promise<InscriptionModel[]> => await context.InscriptionCollection.find().toArray(),
    },
    Mutation: {
        addUser: async(
            _:unknown,
            args: { name:string, email:string, phone:string },
            context: Context
        ):Promise<UserModel> => {
            const { insertedId } = await context.UserCollection.insertOne({...args})
            return {
                _id: insertedId,
                ...args
            } 
        },
        addEvent: async(
            _:unknown,
            args: { name:string, date:string, organizer:string },
            context: Context
        ):Promise<EventModel> => {
            const { name, date, organizer } = args
            const { insertedId } = await context.EventCollection.insertOne({
                name,
                date: new Date(date),
                organizer: new ObjectId(organizer)
            })
            return {
                _id: insertedId,
                name,
                date: new Date(date),
                organizer: new ObjectId(organizer)
            }
        },
        addInscription: async(
            _:unknown,
            args: { user_id:string, event_id:string, date:string },
            context: Context
        ):Promise<InscriptionModel> => {
            const { user_id, event_id, date } = args
            const { insertedId } = await context.InscriptionCollection.insertOne({
                date: new Date(date),
                event_id: new ObjectId(event_id),
                user_id: new ObjectId(user_id)
            })
            return {
                _id: insertedId,
                date: new Date(date),
                event_id: new ObjectId(event_id),
                user_id: new ObjectId(user_id)
            }
        }
    }
}