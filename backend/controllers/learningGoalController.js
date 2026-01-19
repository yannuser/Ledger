import LearningGoal from "../models/LearningGoal.js";
import User from "../models/User.js"


const createLearningGoal = async (req,res) => {
    try {
            const {title, description, status, author} = req.body;

            const userExists = await User.findById(author);
            if (!userExists) {
                return res.status(404).json({ message: "Author not found" });
            }
            
            const learningGoal = await LearningGoal.create({
                title, 
                description : description || null, 
                status,
                author
            })
        
            res.status(201).json({
                message: "Learning goal created successfully!",
                learningGoal
            })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
};

const updateLearningGoal = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const learningGoal = await LearningGoal.findById(req.params.id);
        
        if (!learningGoal) {
            return res.status(404).json({ message: "Learning goal not found" });
        }

        if (title) learningGoal.title = title;
        if (description) learningGoal.description = description;
        if (status) learningGoal.status = status;

        const updatedGoal = await learningGoal.save();

        res.status(200).json({
            message: "Learning goal successfully updated!",
            learningGoal: updatedGoal
        });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

const deleteLearningGoal = async (req, res) => {
    try {
        // 1. Find and Delete in one step
        // We use await here so the code waits for MongoDB to finish
        const learningGoal = await LearningGoal.findByIdAndDelete(req.params.id);

        //  Check if something was actually deleted
        if (!learningGoal) {
            return res.status(404).json({ message: "Learning goal not found!" });
        }
        
        res.status(200).json({ message: "Learning goal deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getLearningGoalsByUser =  async (req, res) => {
        try {
            const { id } = req.query;
            
            const goals = await LearningGoal.find({ id });
            
            res.status(200).json(goals);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};

const getLearningGoal = async (req, res) => {
    try {
        const {id} = req.query ;
        const goal = await LearningGoal.findById(id);

        res.status(200).json(goal)
    } catch (error) {
            res.status(500).json({ error: error.message });
    }
}

const learningGoalControllers = {createLearningGoal, updateLearningGoal, deleteLearningGoal, getLearningGoalsByUser, getLearningGoal}
export default learningGoalControllers;