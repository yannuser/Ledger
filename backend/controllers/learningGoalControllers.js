import LearningGoal from "../models/LearningGoal.js";

const createLearningGoal = async (req,res) => {
    try {
            const {title, description, status} = req.body;
        
            const learningGoal = await LearningGoal.create({
                title, 
                description, 
                status
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
        const {title, description, status} = req.body;

        const learningGoal = await LearningGoal.findById(req.params.id);
        if(!learningGoal){
            return res.status(400).json({message: "Learning goal nont found"})
        }

        if(title)  learningGoal.title = title;
        if(description)  learningGoal.description = description;
        if(status)  learningGoal.status = status;

        res.status(201).json({
            message: "Learning goal successfully updated!",
            learningGoal
        })
    } catch (error) {
        
    }
};

const deleteLearningGoal = async (req, res) => {
    try {
        const learningGoal = LearningGoal.findById(req.params.id);
        if (!learningGoal) {
            res.status(404).json({message: "Learning not founud!"});
        }
        
        await learningGoal.remove();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllLearningGoal = async (req,res) => {
    try {
        const learningGalls = LearningGoal.find({});
        res.status(200).json({ learningGalls });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }


};

const learningGoalControllers = {createLearningGoal, updateLearningGoal, deleteLearningGoal, getAllLearningGoal}
export default learningGoalControllers;