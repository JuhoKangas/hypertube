### HYPERTUBE

Video streaming app made with ReactJS, Node.js, Express.js, PostgreSQL & Tailwind CSS.

Please, note that this project is a work in progess.

- You will need to create a .env file at the root of the client directory containing values for the following:
  GITHUB_OAUTH_CLIENT_SECRET
  GITHUB_CLIENT_ID
  GITHUB_OAUTH_REDIRECT_URL=http://localhost:3000/callback/github

  REACT_APP_CLIENT_ID
  REACT_APP_CLIENT_SECRET
  REACT_APP_REDIRECT_URL=http://localhost:3001/oauth/42direct

- You will need to create a .env file at the root of the server directory containing containing values for the following:
  OMDB_API_KEY
  PGUSER
  PGHOST=localhost
  PGPASSWORD
  PGDATABASE
  SECRET
  PGPORT
  MATCHATEAM_PWD

  EMAIL_PASSWORD
  EMAIL_ADDRESS

  GITHUB_OAUTH_CLIENT_SECRET
  GITHUB_CLIENT_ID
  GITHUB_OAUTH_REDIRECT_URL=http://localhost:3000/callback/github

  REACT_APP_CLIENT_ID
  REACT_APP_CLIENT_SECRET
  REACT_APP_REDIRECT_URL=http://localhost:3001/oauth/42direct

- In the server directory run "npm i". Then run "npm run dev"
- In the client directory run "npm i". Then run "npm start"
- Have fun!
