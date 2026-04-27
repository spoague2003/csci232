import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import getUsers from '@/data/users'
import router from '@/router'


export const useMessengerStore = defineStore('messenger', () => {

  // STATE
  const user = ref(null)
  const username = ref('')
  const password = ref('')
  const isLoggedIn = ref(false)
  const showPassword = ref(false)
  const requests = ref([])
  const chats = ref([])
  const loginError = ref(false)
  const activeChat = ref(null)
  const createErrors = ref([])
  const createSuccess = ref(false)

  const storedUser = JSON.parse(localStorage.getItem('user'))
  const storedUsers = JSON.parse(localStorage.getItem('users')) || getUsers()

  if (storedUser) {
    const fullUser = storedUsers.find(
      u => u.username === storedUser.username
    )

    if (fullUser) {
      user.value = fullUser
      isLoggedIn.value = true
    }
  }

  // MESSAGES
  const currentMessages = ref([]);

  async function setActiveChat(chat) {
    activeChat.value = chat
    currentMessages.value = []
    await getMessages()
    console.log('Active group chat:', chat?.group_name || 'none')
  }

  async function sendMessage(text) {
    console.log(activeChat.value)
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    if (!text.trim() || !activeChat.value) return

    try {
      const response = await fetch(
        `${host}/chat/${activeChat.value._id}/message`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            message: text,
            group_id: activeChat.value._id
          })
        }
      )

      let result = null
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        console.log('Non-JSON response:', await response.text())
      }

      if (response.ok && result) {
        currentMessages.value.push(result)
        console.log('Message sent:', result)
      } else {
        console.log('Failed to send message', response.status)
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function createChat(groupName) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    if (!groupName.trim()) {
      alert('Group name must be non-empty')
      return
    }

    const url = host + '/chat'
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        group_name: groupName,
        chat_type: "group"
      })
    }

    console.log('POST /chat')

    try {
      const response = await fetch(url, options)

      console.log('Status:', response.status)

      let result = null
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      }

      if (response.ok && result) {
        console.log('Chat created', result)
        user.value.chat_sessions.push(result._id)
        await loadChats()
      }
    }
    catch (error) {
      console.log(error)
      createErrors.value = ['Server connection failed']
    }
  }

  async function getChat(chat) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    const url = host + `/chat/${chat}`

    const options = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url, options)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.log('Non-JSON response from server')
        return
      }

      const result = await response.json()

      if (response.ok) {
        console.log('Chat data acquired:', result)
        return result
      } else {
        console.log('Chat not found:', result)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  async function invitetoChat(friendId) {
    if (!activeChat.value) return

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    const url = host + `/chat/${activeChat.value._id}/invitation/${friendId}`
    const options = {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        console.log('Invite failed:', await response.text())
        return
      }

      alert('User invited to group')
    }
    catch (error) {
      console.log(error)
    }
  }

  async function acceptChatInvite(invite, answer) {
    console.log('Invite passed in:', invite)
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    try {
      const accept = answer === 1
      const chatId = invite.chat.chatId
      const requestId = invite._id

      const url = `${host}/chat/${chatId}/invitation/${requestId}?accept=${accept}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log('Status:', response.status)

      if (response.ok) {
        console.log(`Invite ${accept ? 'accepted' : 'declined'}`)
        user.value = await getProfile()
        await loadChats()
      } else {
        console.log('Failed to update invite')
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function leaveChat(chat) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')
    console.log('token:', token)
    console.log('chat:', JSON.stringify(chat))

    if (!chat) return

    const url = host + `/chat/${chat._id}/membership`
    const options = {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url, options)

      if (response.ok) {
        console.log('Chat left')
        user.value = await getProfile()
        await loadChats()
        activeChat.value = null
        currentMessages.value = []
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  async function getMessages() {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    if (!activeChat.value) return

    try {
      const response = await fetch(
        `${host}/chat/${activeChat.value._id}/messages`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      currentMessages.value = data.messages || data

      console.log('Messages loaded:', currentMessages.value)

    } catch (error) {
      console.log(error)
    }
  }
  // FRIENDS
  async function sendFriendRequest(targetUsername) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    try {
      if (!targetUsername || targetUsername.trim() === '') {
        alert('Please enter a username')
        return
      }

      const searchUrl = `${host}/users?search=${encodeURIComponent(targetUsername.trim())}&limit=10&skip=0`
      console.log('Search URL:', searchUrl)

      const searchResponse = await fetch(searchUrl, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!searchResponse.ok) {
        console.log('Search failed:', searchResponse.status)
        return
      }

      const result = await searchResponse.json()
      console.log('Search response:', result)

      const targetUser = result.users[0]

      if (!targetUser) {
        alert('User not found')
        return
      }

      const requestUrl = `${host}/friend-request/${targetUser._id}`

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log('Status:', response.status)

      if (response.ok) {
        alert('Friend request sent!')
        await getFriendRequests()
      } else {
        console.log('Failed to send request')
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function acceptFriendRequest(request, answer) {
    console.log('Request passed in:', request)

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    try {
      const accept = answer === 1

      const requestId = request.id || request._id || request

      const url = `${host}/friend-request/${requestId}?accept=${accept}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log('Status:', response.status)

      if (response.ok) {
        console.log(`Request ${accept ? 'accepted' : 'declined'}`)
        await getFriendRequests()
        const updatedUser = await getProfile()
        user.value = updatedUser
      } else {
        console.log('Failed to update request')
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function getFriendRequests() {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')

    try {
      const response = await fetch(`${host}/friend-requests`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      console.log('Fetch requests status:', response.status)

      if (!response.ok) {
        console.log('Failed to fetch requests')
        return
      }

      const data = await response.json()
      console.log('Requests:', data)

      requests.value = data.requests || data

    } catch (error) {
      console.log(error)
    }
  }

  async function removeFriend(friend) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const token = localStorage.getItem('authToken')
    console.log(friend)

    const url = host + `/friend/${friend.userId}`
    const options = {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
    console.log('Remove URL:', url)

    try {
      const response = await fetch(url, options)

      console.log('Response status:', response.status)

      if (response.ok) {
        console.log('Friend removed')
        user.value = await getProfile()
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  // ACCOUNTS
  async function createAccount(user) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + '/user'
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    }

    console.log('POST /user')

    createErrors.value = []
    createSuccess.value = false

    try {
      const response = await fetch(url, options)

      console.log('Status:', response.status)

      let result = null
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      }

      if (response.status === 201) {
        createSuccess.value = true
        router.push('/sign-in')
        setTimeout(() => {
          createSuccess.value = false
        }, 4000)
        return
      }

      if (response.status === 400) {
        createErrors.value = Object.values(result.errors).map(err => err.message)
        return
      }

      if (response.status === 409) {
        createErrors.value = ['Username or email already exists']
        return
      }
    }
    catch (error) {
      console.log(error)
      createErrors.value = ['Server connection failed']
    }
  }

  async function login(username, password) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + '/user/login'
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    }

    try {
      const response = await fetch(url, options)

      console.log('Status:', response.status)

      let result = null
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      }

      if (!response.ok) {
        console.log('Invalid credentials')
        loginError.value = true
        return
      }

      user.value = result.user
      localStorage.setItem('username', result.user.username)
      localStorage.setItem('authToken', result.authToken)
      console.log(user.value)
      console.log(localStorage)

      isLoggedIn.value = true

      router.push('/home')
      loginError.value = false
    }
    catch (error) {
      console.log(error)
    }
  }

  function logout() {
    user.value = {}
    isLoggedIn.value = false

    username.value = ''
    password.value = ''
    localStorage.clear()
    activeChat.value = null
    currentMessages.value = []
  }

  async function getProfile() {
    console.log('Fetching profile')

    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'

    const url = host + '/user'
    const token = localStorage.getItem('authToken')
    console.log(token)
    const options = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }

    const response = await fetch(url, options)

    if (response.ok) {
      console.log('user data aquired')
      const data = await response.json()
      console.log(data)
      return data
    }

    console.log('error fetching data')
  }

  // HELPERS
  function refreshCurrentUser(updatedUsers) {
    const updatedUser = updatedUsers.find(
      u => u.username === user.value?.username
    )

    if (updatedUser) {
      user.value = updatedUser
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  function loadCurrentUser() {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || getUsers()

    const updatedUser = storedUsers.find(
      u => u.username === user.value?.username
    )

    if (updatedUser) {
      user.value = updatedUser
    }
  }

  async function loadChats() {
    const sessions = user.value?.chat_sessions || []
    const results = await Promise.all(sessions.map(id => getChat(id)))
    chats.value = results.filter(Boolean)
  }

  return {
    user,
    username,
    password,
    isLoggedIn,
    showPassword,
    currentMessages,
    loginError,
    requests,
    chats,
    activeChat,
    createErrors,
    createSuccess,

    login,
    logout,
    getProfile,
    createAccount,
    sendMessage,
    createChat,
    getChat,
    getMessages,
    invitetoChat,
    acceptChatInvite,
    leaveChat,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    removeFriend,
    refreshCurrentUser,
    loadCurrentUser,
    loadChats,
    setActiveChat
  }
})