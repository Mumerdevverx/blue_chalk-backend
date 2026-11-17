const mongoose = require('mongoose');
const ProjectOrder = require('../models/ProjectOrder');
const Work = require('../models/Work');

const ORDER_KEY = 'all-projects';
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

exports.getAllProjectsOrder = async (req, res, next) => {
  try {
    const savedOrder = await ProjectOrder.findOne({ key: ORDER_KEY }).lean();

    return res.status(200).json({
      success: true,
      data: {
        projectIds: savedOrder ? savedOrder.projectIds : []
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.saveAllProjectsOrder = async (req, res, next) => {
  try {
    const projectIds = req.body && req.body.projectIds;

    if (!Array.isArray(projectIds)) {
      return res.status(400).json({
        success: false,
        message: 'projectIds must be an array'
      });
    }

    if (projectIds.some((id) =>
      typeof id !== 'string' || !OBJECT_ID_PATTERN.test(id)
    )) {
      return res.status(400).json({
        success: false,
        message: 'projectIds must contain valid project IDs'
      });
    }

    const normalizedIds = projectIds.map((id) => id.toLowerCase());

    if (new Set(normalizedIds).size !== normalizedIds.length) {
      return res.status(400).json({
        success: false,
        message: 'projectIds must not contain duplicates'
      });
    }

    const existingWorks = await Work.find({
      _id: {
        $in: normalizedIds.map((id) => new mongoose.Types.ObjectId(id))
      }
    }).select('_id').lean();

    if (existingWorks.length !== normalizedIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more project IDs do not exist'
      });
    }

    const savedOrder = await ProjectOrder.findOneAndUpdate(
      { key: ORDER_KEY },
      { $set: { projectIds: normalizedIds } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    return res.status(200).json({
      success: true,
      data: {
        projectIds: savedOrder.projectIds
      }
    });
  } catch (error) {
    return next(error);
  }
};
