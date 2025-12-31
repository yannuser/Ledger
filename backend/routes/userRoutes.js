const router = express.Router();
const userControllers = require("../controllers/userControllers");

router.post("/register", userControllers.register);