export const typeDefs = `#graphql
    type User {
        id: ID!
        name: String!,
        email: String!,
        phone: String!
    }
    type Event {
        id: ID!,
        name: String!,
        date: String!,
        organizer: User!
    }
    type Inscription {
        id: ID!,
        user_id: User!,
        event_id: Event!,
        date: String!
    }

    type Query {
        getUser:[User!]!
        getEvent:[Event!]!
        getInscription:[Inscription!]!
    }
    type Mutation {
        addUser(name:String!, email:String!, phone:String!):User!
        addEvent(name:String!, date:String!, organizer:ID!):Event!
        addInscription(user_id:ID!, event_id:ID!, date:String!):Inscription!
    }
`