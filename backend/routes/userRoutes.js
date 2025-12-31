const router = express.Router();

const userControllers = require("../controllers/userControllers");

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.post("/getLoggedInUser", userControllers.getLoggedInUser);
router.post("/reggetUserByIdister", userControllers.getUserById);
router.post("/updateUser", userControllers.updateUser);
router.post("/deleteUser", userControllers.deleteUser);