import LearningGoal from "../models/LearningGoal.js";

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
            const { authorId } = req.params;
            
            // Use .populate('author') to get user details instead of just the ID
            const goals = await LearningGoal.find({ author: authorId }).populate('author', 'firstName lastName email');
            
            res.status(200).json(goals);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

const learningGoalControllers = {createLearningGoal, updateLearningGoal, deleteLearningGoal, getLearningGoalsByUser}
export default learningGoalControllers;