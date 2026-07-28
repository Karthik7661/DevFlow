"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Registration endpoint: verify Firebase token, create MySQL record
router.post('/register', auth_middleware_1.verifyToken, auth_controller_1.register);
// Login endpoint: verify Firebase token, update lastLogin timestamp
router.post('/login', auth_middleware_1.verifyToken, auth_controller_1.login);
// Profile endpoints
router.get('/me', auth_middleware_1.verifyToken, auth_controller_1.getMe);
router.put('/profile', auth_middleware_1.verifyToken, auth_controller_1.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map