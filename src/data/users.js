import User from "@/models/User";

const users = []

function getUsers() {
    return structuredClone(users)
}

export default getUsers;