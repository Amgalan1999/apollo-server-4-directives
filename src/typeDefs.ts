export default `#graphql

    directive @auth(permissions: [String!]) on FIELD_DEFINITION

    type User {
        username: String
        email: String
    }

    type Query {
        get_user: User @auth(permissions: ["aa", "bb"])
        get_users: [User]
    }
`