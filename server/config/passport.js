import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { pool } from './database.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await pool.query(
          'SELECT * FROM users WHERE github_id = $1',
          [profile.id]
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }


        const newUser = await pool.query(
          `INSERT INTO users (github_id, username, email, avatar_url) 
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [
            profile.id,
            profile.username,
            profile.emails?.[0]?.value || null,
            profile.photos?.[0]?.value || null,
          ]
        );

        done(null, newUser.rows[0]);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
