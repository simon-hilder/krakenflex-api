import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';

const baseUrl = 'https://api.krakenflex.systems/interview-tests-mock-api/v1';

interface Outage {
    id: string,
    begin: string,
    end: string
}

const getOutages = async (req: Request, res: Response, next: NextFunction) => {
    let result: AxiosResponse = await axios.get(`${baseUrl}/outages`);
    let outages: [Outage] = result.data;
    return res.status(200).json({
        message: outages
    });
}

export default { getOutages }