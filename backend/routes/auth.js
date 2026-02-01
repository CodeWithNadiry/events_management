import express from 'express'
import { login, signup } from '../controllers/auth-controller.js';
import { body } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', [
  body('email').
  isEmail().
  withMessage('Please enter a valid email')
  .custom(async value => {
    const userDoc = await User.findOne({email: value})
    if (userDoc) {
      return Promise.reject('E-mail already exists.')
    }
  })
  .normalizeEmail(),
  body('password').not().isEmpty().trim().isLength({min: 5})
], signup)

router.post('/login', login)

export default router;