import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRespostiory = getCustomRepository(UsersRepository);
        const surveysRespostiory = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRespostiory.findOne({ email });
        const surveyAlreadyExists = await surveysRespostiory.findOne({ id: survey_id });

        if (!userAlreadyExists) {
            return response.status(400).json({
                error: 'User does not exists!',
            });
        }

        if (!surveyAlreadyExists) {
            return response.status(400).json({
                error: 'Survey does not exists!',
            });
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);
        return response.status(201).json(surveyUser);
    }
}

export { SendMailController };
