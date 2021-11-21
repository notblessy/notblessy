import User from '../models/user';

import config from '../config';
import jwt from 'jsonwebtoken';
import bcrypt  from 'bcrypt';

import { nanoid } from 'nanoid';
import { validateAll } from '../utils/form';
import { conn } from '../database';

export const register = async (req, res) => {
  const rules = {
    name: 'required',
    email: 'required|email',
    password: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  const trx = await conn.transaction();

  try {
    const existing = await User.query().findOne({
        email: req.body.email,
    });
    if (existing) {
      return res.json({
        success: false,
        message: 'Email sudah terdaftar.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const userID = nanoid();
    const data = await User.query(trx).insert({
        email: googlePayload.email,
        name: googlePayload.name,
        role: 'CUSTOMER',
        id: userID,
        password: hashed,
    });

    const payload = {
      id: data.id,
      user_claims: {
        id: data.id,
        email: data.email,
        name: data.name,
      },
    };

    const jwtOptions = {
      issuer: config.JWT_ISSUER,
      subject: 'access',
      algorithm: config.JWT_ALGORITHM,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

    await trx.commit();

    return res.json({
      type: 'Bearer',
      token: token,
      data: data,
    });
  } catch (error) {
    await trx.rollback();
    console.error(error);

    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const login = async (req, res) => {
  const rules = {
    email: 'required',
    password: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const existing = await User.query().findOne({
        email: req.body.email,
    });

    if (!existing) {
      return res.json({
        success: false,
        message: 'Email tidak ditemukan. Daftar dahulu',
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, existing.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Password tidak cocok.',
      });
    }

    const payload = {
      id: existing.id,
      user_claims: {
        id: existing.id,
        email: existing.email,
        role: existing.role,
      },
    };

    const jwtOptions = {
      issuer: config.JWT_ISSUER,
      subject: 'access',
      algorithm: config.JWT_ALGORITHM,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

    return res.json({
      type: 'Bearer',
      token: token,
      data: existing,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.query().findById({
      id: req.user.id,
    });
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const edit = async (req, res) => {
  try {
    const user = await User.query()
    .findById(req.user.id)
    .patch({
        name: req.body.name,
        email: req.body.email
    });
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};

export const editPassword = async (req, res) => {
  const rules = {
    old_password: 'required',
    new_password: 'required',
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const existing = await User.query().findOne({
        email: req.body.email,
    });

    const isMatch = await bcrypt.compare(
      req.body.old_password,
      existing.password
    );

    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Password salah.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.new_password, salt);

    const user = await User.query()
    .findById(req.user.id)
    .patch({
        password: hashed,
    });

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: 'Something went wrong.',
    });
  }
};
