// ============================================
// ForumX — auth.js
// Group 15 | Web Technology Project
// This file handles Login, Register,
// Logout and Session Management
// ============================================


// ============================================
// SECTION 1 — REGISTER NEW USER
// ============================================

function registerUser(name, username, email, password) {
  let users = getUsers()

  // Check if email already exists
  let emailExists = users.find(u => u.email === email)
  if (emailExists) {
    return { success: false, message: "This email is already registered!" }
  }

  // Check if username already exists
  let usernameExists = users.find(u => u.username === username)
  if (usernameExists) {
    return { success: false, message: "This username is already taken!" }
  }

  // Check all fields are filled
  if (!name || !username || !email || !password) {
    return { success: false, message: "All fields are required!" }
  }

  // Check password length
  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters!" }
  }

  // Create new user object
  let newUser = {
    id:         generateId(users),
    name:       name,
    username:   username,
    email:      email,
    password:   password,
    role:       "member",
    joinDate:   new Date().toISOString(),
    lastActive: new Date().toISOString(),
    postCount:  0,
    isBanned:   false,
    avatar:     name.slice(0, 2).toUpperCase()
  }

  // Save to localStorage
  users.push(newUser)
  saveUsers(users)

  // Log the activity
  logActivity(newUser.id, newUser.username, "Registered a new account")

  return { success: true, message: "Account created successfully! Please login.", user: newUser }
}


// ============================================
// SECTION 2 — LOGIN USER
// ============================================

function loginUser(email, password) {
  let users = getUsers()

  // Find user by email
  let user = users.find(u => u.email === email)

  // User not found
  if (!user) {
    return { success: false, message: "No account found with this email!" }
  }

  // Wrong password
  if (user.password !== password) {
    return { success: false, message: "Incorrect password. Please try again!" }
  }

  // Check if banned
  if (user.isBanned) {
    return { success: false, message: "Your account has been suspended. Contact admin." }
  }

  // Update last active time
  let allUsers = getUsers()
  let idx = allUsers.findIndex(u => u.id === user.id)
  allUsers[idx].lastActive = new Date().toISOString()
  saveUsers(allUsers)

  // Save current user to session
  saveCurrentUser(user)

  // Log the activity
  logActivity(user.id, user.username, "Logged into ForumX")

  return { success: true, message: "Login successful! Welcome back " + user.name, user: user }
}


// ============================================
// SECTION 3 — LOGOUT USER
// ============================================

function logoutUser() {
  let user = getCurrentUser()
  if (user) {
    logActivity(user.id, user.username, "Logged out of ForumX")
  }
  saveCurrentUser(null)
  return { success: true, message: "You have been logged out successfully!" }
}


// ============================================
// SECTION 4 — CHECK IF LOGGED IN
// ============================================

function isLoggedIn() {
  let user = getCurrentUser()
  return user !== null && user !== undefined
}


// ============================================
// SECTION 5 — GET CURRENT USER ROLE
// ============================================

function getUserRole() {
  let user = getCurrentUser()
  if (!user) return "guest"
  return user.role
}


// ============================================
// SECTION 6 — ROLE CHECK FUNCTIONS
// ============================================

function isAdmin() {
  return getUserRole() === "admin"
}

function isModerator() {
  let role = getUserRole()
  return role === "moderator" || role === "admin"
}

function isMember() {
  return isLoggedIn()
}


// ============================================
// SECTION 7 — UPDATE USER PROFILE
// ============================================

function updateProfile(userId, newName, newUsername) {
  let users = getUsers()
  let idx = users.findIndex(u => u.id === userId)

  if (idx === -1) {
    return { success: false, message: "User not found!" }
  }

  // Check username taken by someone else
  let taken = users.find(u => u.username === newUsername && u.id !== userId)
  if (taken) {
    return { success: false, message: "Username already taken!" }
  }

  users[idx].name     = newName
  users[idx].username = newUsername
  saveUsers(users)

  // Update current session too
  let current = getCurrentUser()
  if (current && current.id === userId) {
    current.name     = newName
    current.username = newUsername
    saveCurrentUser(current)
  }

  logActivity(userId, newUsername, "Updated their profile")
  return { success: true, message: "Profile updated successfully!" }
}


// ============================================
// SECTION 8 — CHANGE PASSWORD
// ============================================

function changePassword(userId, oldPassword, newPassword) {
  let users = getUsers()
  let idx = users.findIndex(u => u.id === userId)

  if (idx === -1) {
    return { success: false, message: "User not found!" }
  }

  if (users[idx].password !== oldPassword) {
    return { success: false, message: "Old password is incorrect!" }
  }

  if (newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters!" }
  }

  users[idx].password = newPassword
  saveUsers(users)

  logActivity(userId, users[idx].username, "Changed their password")
  return { success: true, message: "Password changed successfully!" }
}


// ============================================
// SECTION 9 — GET USER BY ID
// ============================================

function getUserById(userId) {
  let users = getUsers()
  return users.find(u => u.id === userId) || null
}


// ============================================
// SECTION 10 — GET USER STATS
// ============================================

function getUserStats(userId) {
  let topics  = getTopics().filter(t => t.authorId === userId)
  let replies = getReplies().filter(r => r.authorId === userId)
  let user    = getUserById(userId)

  return {
    totalPosts:   topics.length + replies.length,
    totalTopics:  topics.length,
    totalReplies: replies.length,
    joinDate:     user ? user.joinDate : "N/A",
    lastActive:   user ? user.lastActive : "N/A",
    role:         user ? user.role : "N/A"
  }
}