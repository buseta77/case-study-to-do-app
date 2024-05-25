# simple-to-do-app
A simple to-do app built with React and Express

To launch the app, follow these steps:

1. Clone the repository to your local
2. Go to backend folder "cd backend"
3. Run "npm install"
4. Run migrations to setup database "knex migrate:latest"
5. Create an ".env" file in backend folder and add JWT_SECRET_KEY env variable into it, you can generate a UUID with running:
 node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
5. Run "npm start" to start backend server
6. Go back and go to frontend folder "cd ../frontend"
7. Run "npm install"
8. Run "npm run start" to start frontend server
9. Backend should operate at the port 3000, and frontend at the port 3001
10. App has a signup page, so you can register your own user from there and then login with that user