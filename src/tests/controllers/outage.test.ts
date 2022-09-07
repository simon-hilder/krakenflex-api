import { describe, expect, test } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Request, Response, NextFunction } from 'express';
import controller from '../../controllers/outage';
import { BaseUrl, ApiConfig } from '../../constants';

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockNext: Partial<NextFunction>;

beforeEach(() => {
    mockRequest = {};
    mockResponse = {
        status: jest.fn().mockReturnValue({ json: () => {} })
    };
});

describe('getOutages', () => {
    test('Calls expected KrakenFlex API endpoint', () => {
        const spy = jest.spyOn(axios, 'get');
        const mock = new MockAdapter(axios);
        mock.onGet().reply(200, {});
        controller.getOutages(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);
        expect(spy).toHaveBeenCalledWith(`${BaseUrl}/outages`, ApiConfig);
    });
})


