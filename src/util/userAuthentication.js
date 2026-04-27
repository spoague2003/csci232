import getUsers from "@/data/users.js"

export const authenticateUser = async function(username, password) {

    console.log(`Logging in ${username}/${password}`)

    const storedUsers = JSON.parse(localStorage.getItem("users"))

    const users = storedUsers || getUsers()
    console.log(users)

    const user = users.find((obj) => obj.username == username && obj.password == password)

    if (user) {
        console.log('User authenticated')
        const safeUser = {...user}
        return structuredClone(safeUser)
    }

    console.log("User not found")
    
    return null
}