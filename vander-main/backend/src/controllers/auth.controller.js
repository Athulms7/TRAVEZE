import User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    console.log('Registration attempt with data:', req.body);
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, phone: !!phone, password: !!password });
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: name, email, phone, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Create new user
    console.log('Creating new user with email:', email);
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    // Generate token
    const token = user.generateAuthToken();
    console.log('User created successfully:', user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login attempt with data:', req.body);
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Generate token
    const token = user.generateAuthToken();
    console.log('User logged in successfully:', user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 