import { Router } from 'express';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
router.post('/users', userController.create);

const surveyController = new SurveyController();
router.post('/surveys', surveyController.create);

export { router };
