import EffortRecord from "../models/EffortRecord.js";
import LearningGoal from "../models/LearningGoal.js";

const createEffort = async (req, res) => {
    try {
        const { title, description, goalId, authorId } = req.body;

        const effort = await EffortRecord.create({
            title,
            description,
            goal: goalId || null,
            author: authorId
        });

        if (goalId) {
            await LearningGoal.findByIdAndUpdate(goalId, {
                $push: { efforts: effort._id }
            });
        }

        res.status(201).json(effort);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getEffortsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const efforts = await EffortRecord.find({ author: userId }).populate('goal', 'title');
        res.status(200).json(efforts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEffort = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, goalId } = req.body;

        const oldEffort = await EffortRecord.findById(id);
        
        // If the goal link is changing, we need to clean up the LearningGoal arrays
        if (goalId !== undefined && oldEffort.goal?.toString() !== goalId) {
            // Remove from old goal array
            if (oldEffort.goal) {
                await LearningGoal.findByIdAndUpdate(oldEffort.goal, { $pull: { efforts: id } });
            }
            // Add to new goal array
            if (goalId) {
                await LearningGoal.findByIdAndUpdate(goalId, { $push: { efforts: id } });
            }
        }

        const updatedEffort = await EffortRecord.findByIdAndUpdate(
            id, 
            { title, description, goal: goalId || null },
            { new: true }
        );

        res.status(200).json(updatedEffort);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteEffort = async (req, res) => {
    try {
        const effort = await EffortRecord.findByIdAndDelete(req.params.id);
        
        // Cleanup: If it was linked to a goal, remove it from the goal's list
        if (effort && effort.goal) {
            await LearningGoal.findByIdAndUpdate(effort.goal, {
                $pull: { efforts: effort._id }
            });
        }

        res.status(200).json({ message: "Effort deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const learningEffortControllers = { createEffort, getEffortsByUser, updateEffort, deleteEffort };
export default learningEffortControllers;