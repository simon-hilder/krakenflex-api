import { describe, expect, test } from '@jest/globals';
import axios from 'axios';
import sinon from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import { Request, Response, NextFunction } from 'express';
import { Outage, getOutages } from '../../controllers/outage';
import { BaseUrl, ApiConfig } from '../../constants';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockNext: Partial<NextFunction>;
const mockAxios = new MockAdapter(axios);

beforeEach(() => {
    mockRequest = {};
});

describe('getOutages', () => {
    test('Calls expected KrakenFlex API endpoint', () => {
        const spy = jest.spyOn(axios, 'get');
        mockAxios.onGet().reply(200, {});
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        getOutages(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(`${BaseUrl}/outages`, ApiConfig);
    });

    test('Returns 200 with Outages data, on success response from KrakenFlex API', async () => {
        const outages: [Outage] = [{
            id: 'test',
            begin: 'test',
            end: 'test'
        }];
        mockAxios.onGet().reply(200, outages);
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await getOutages(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(outages);
    });

    test('Returns status code with error message, on failed response from KrakenFlex API', async () => {
        const expectedError = 'Request failed with status code 500';
        mockAxios.onGet().reply(500, '');
        mockResponse = {
            status: jest.fn(),
            send: jest.fn()
        }
        const spy = jest.spyOn(mockResponse, 'send');
        await getOutages(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(expectedError);
    });
})


