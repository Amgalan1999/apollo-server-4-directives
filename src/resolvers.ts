export default {
    Query: {
        get_user: () => {
            return {
                username: "amgalan__",
                email: "amgalan@gmail.com",
            }
        },
        get_users: () => {
            return [
                {
                    username: "amgalan__",
                    email: "amgalan@gmail.com",
                },
                {
                    username: "test__",
                    email: "test@gmail.com",
                }
            ]
        }
    }
}