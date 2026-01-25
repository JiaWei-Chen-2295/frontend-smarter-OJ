import axios from 'axios';
import { UserControllerApi } from '../generated_new/user';
import { QuestionControllerApi, QuestionSetControllerApi } from '../generated_new/question';
import { DefaultApi as PostControllerApi } from '../generated_new/post';
import { RoomControllerApi } from '../generated_new/room';

import JSONBig from 'json-bigint';

// Create a configured axios instance
// The proxy in vite.config.ts handles /api requests to the backend
const request = axios.create({
    withCredentials: true, // Typically needed for session/cookies
    transformResponse: [
        (data) => {
            try {
                // Ensure that we don't break simple strings or empty responses
                if (typeof data === 'string') {
                    // storeAsString: true -> large numbers become strings, safe numbers stay numbers
                    return JSONBig({ storeAsString: true }).parse(data);
                }
                return data;
            } catch (error) {
                // Fallback to original data if parsing fails (e.g. non-JSON string)
                return data;
            }
        }
    ]
});

// Helper to get the base path. 
const USER_SERVICE_PATH = '/api/user';
const QUESTION_SERVICE_PATH = '/api/question';
const POST_SERVICE_PATH = '/api/post';
const ROOM_SERVICE_PATH = '/api/room';

// Initialize API instances
export const userApi = new UserControllerApi(undefined, USER_SERVICE_PATH, request);
export const questionApi = new QuestionControllerApi(undefined, QUESTION_SERVICE_PATH, request);
export const questionSetApi = new QuestionSetControllerApi(undefined, QUESTION_SERVICE_PATH, request);
export const postApi = new PostControllerApi(undefined, POST_SERVICE_PATH, request);
export const roomApi = new RoomControllerApi(undefined, ROOM_SERVICE_PATH, request);
