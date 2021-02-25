import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRespostiory = getCustomRepository(UsersRepository);
        const surveysRespostiory = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRespostiory.findOne({ email });
        const survey = await surveysRespostiory.findOne({ id: survey_id });

        if (!userAlreadyExists) {
            return response.status(400).json({
                error: 'User does not exists!',
            });
        }

        if (!survey) {
            return response.status(400).json({
                error: 'Survey does not exists!',
            });
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);

        await SendMailService.execute(email, survey.title, survey.description);

        return response.status(201).json(surveyUser);
    }
}

export { SendMailController };
