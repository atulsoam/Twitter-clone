import express from "express"
import { AuthMiddleWare } from "../middleWare/auth_middleware.js"
import { AllNotification,deletNotification } from "../controllers/notification_controller.js"

const NotificationRoutes = express.Router()

NotificationRoutes.get("/",AuthMiddleWare ,AllNotification)

NotificationRoutes.delete("/",AuthMiddleWare, deletNotification)


export default NotificationRoutes