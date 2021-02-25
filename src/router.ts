import { Router } from 'express';
import { SendMailController } from './controllers/SendMailController';
import { SurveyController } from './controllers/SurveyController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
router.post('/users', userController.create);

const surveyController = new SurveyController();
router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

const sendMailController = new SendMailController();
router.post('/sendMail', sendMailController.execute);
export { router };
