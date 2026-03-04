import Feedback from '../models/Feedback.model.js';

/**
 * @desc    Create feedback
 * @route   POST /api/feedback
 * @access  Public
 */
export const createFeedback = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      subject,
      message,
      user: req.user?.id || null
    });

    res.status(201).json({
      success: true,
      feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's feedback
 * @route   GET /api/feedback
 * @access  Private
 */
export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback
    });
  } catch (error) {
    next(error);
  }
};
