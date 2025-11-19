const Task = require('../models/Task.model');
const User = require('../models/User.model');

exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    // Regular users can only see their own tasks
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }
    
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
      priority: priority || task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};