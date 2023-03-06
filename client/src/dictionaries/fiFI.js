export const fiFI = {
  // User info
  username: 'Käyttäjänimi',
  firstname: 'Etunimi',
  lastname: 'Sukunimi',
  email: 'Sähköposti',
  password: 'Salasana',
  password_repeat: 'Repeat password',
  profile_picture: 'Profiilikuva',
  language: 'Kieli',

  // Videos
  comments: 'Kommentit',
  resolution: 'Resoluutio',
  subtitles: 'Tekstitykset',

  //Buttons
  logIn: 'Kirjaudu sisään',
  signUp: 'Rekisteröidy',
  search: 'Haku',
  sortBy: 'Lajittele',

  //messages
  m_landing: 'KATSO UUSIMMAT ELOKUVAT HYPERTUBESTA',
  m_movies_search: 'Search for your movies here',
  m_loading: 'Vittu oota...',
  m_page_end:
    "You arrived to the bottom of the page! Please search for the movie if you couldn't find what you were looking for yet",
  m_link_sent: 'The link has been sent',
  m_signup_email:
    'Please follow the instructions on the email to finish setting up your profile',
  m_create_account: 'Create an account',
  m_already_account: 'Already have an account? Log in!',

  //Signup errors
  e_firstname_add: 'Please add first name',
  e_firstname_length:
    "Your first name can't realistically be over 1000 characters",
  e_lastname_add: 'Please add last name',
  e_lastname_length:
    "Your last name can't realistically be over 1000 characters",
  e_username_add: 'Please add username',
  e_username_length:
    "Your username can't be over 60 characters. It's just arbitary limit that I came up with, in fact our database would handle usernames up to 1000 characters but it would probably break the styling of the page so we just gonna have it like this now.",
  e_username_taken: 'Username is already taken',
  e_password_add: 'Please add password',
  e_password_requirements:
    'Password must be at least 8 characters and contain only letters and numbers',
  e_email_add: 'Please add your email',
  e_email_proper: 'Please add proper email',
  e_email_taken: 'Email already in use',
  e_password_match: 'Passwords do not match!',
}
