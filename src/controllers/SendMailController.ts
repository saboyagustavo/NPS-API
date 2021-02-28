import { Request, Response } from 'express';
import { resolve } from 'path';
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

        const user = await usersRespostiory.findOne({ email });
        const survey = await surveysRespostiory.findOne({ id: survey_id });

        if (!user) {
            return response.status(400).json({
                error: 'User does not exists!',
            });
        }

        if (!survey) {
            return response.status(400).json({
                error: 'Survey does not exists!',
            });
        }

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

        const surveysUsers = await surveysUsersRepository.findOne({
            where: [{ user_id: user.id, survey_id: survey.id }, { value: null }],
            relations: ['user', 'survey'],
        });

        if (surveysUsers && surveysUsers.value !== null) {
            return response.status(400).json({
                error: 'This user has already answered this survey!',
            });
        }

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: '',
            link: process.env.URL_MAIL,
        };

        if (surveysUsers) {
            variables.id = surveysUsers.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveysUsers);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);

        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);
        return response.status(201).json(surveyUser);
    }
}

export { SendMailController };
