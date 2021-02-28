import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

/* --------------------

NET PROMOTERS SCORE 
DETRACTORS: 0 - 6
PASSIVES: 7 - 8
PROMOTERS: 9 - 10

NPS = promoters - detractors / (answers * 100)

-------------------- */

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveyUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        });

        const detractors = surveyUsers.filter(survey => survey.value >= 0 && survey.value <= 6).length;
        const passive = surveyUsers.filter(survey => survey.value >= 7 && survey.value <= 8).length;
        const promoters = surveyUsers.filter(survey => survey.value >= 9 && survey.value <= 10).length;

        const totalAnswers = surveyUsers.length;
        const calculate = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(2));

        return response.status(200).json({
            survey_id,
            detractors,
            passive,
            promoters,
            totalAnswers,
            NPS: calculate,
        });
    }
}

export { NpsController };
