import passport from 'passport';
import { Strategy } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { ExtractJwt } from 'passport-jwt';
import { JWT_SECRET } from '../config';

import Employee from '../models/employee';

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await Employee.findById(payload.sub);

        if (!user) return done(null, false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

// Passport local
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
    },
    async (username, password, done) => {
      try {
        const user = await Employee.findOne({ username });

        if (!user) return done(null, false);

        const isCorrectPassword = await user.isValidPassword(password);

        if (!isCorrectPassword) return done(null, false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);
