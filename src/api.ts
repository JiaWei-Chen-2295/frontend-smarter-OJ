import axios from 'axios';
import { UserControllerApi } from '../generated_new/user';
import { QuestionSetControllerApi, DefaultApi as QuestionDefaultApi } from '../generated_new/question';
import { DefaultApi as PostControllerApi } from '../generated_new/post';
import { RoomControllerApi } from '../generated_new/room';

import JSONBig from 'json-bigint';

// Create a configured axios instance
// In development, the proxy in vite.config.ts handles /api requests
// In production, requests go directly to the backend server
const request = axios.create({
    // NOTE: Do NOT set baseURL here! Let the generated API classes use their basePath.
    // baseURL is handled by the API classes based on environment
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

// Get the base URL from environment variable
// In development: '/api' (proxied by Vite)
// In production: '/api' (proxied by Nginx) or full URL if direct access
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper to get the base path. 
const USER_SERVICE_PATH = `${API_BASE_URL}/user`;
const QUESTION_SERVICE_PATH = `${API_BASE_URL}/question`;
const POST_SERVICE_PATH = `${API_BASE_URL}/post`;
const ROOM_SERVICE_PATH = `${API_BASE_URL}/room`;

// Initialize API instances
export const userApi = new UserControllerApi(undefined, USER_SERVICE_PATH, request);
// QuestionControllerApi merged into DefaultApi
export const questionApi = new QuestionDefaultApi(undefined, QUESTION_SERVICE_PATH, request);
export const questionDefaultApi = new QuestionDefaultApi(undefined, QUESTION_SERVICE_PATH, request);
export const questionSetApi = new QuestionSetControllerApi(undefined, QUESTION_SERVICE_PATH, request);
export const postApi = new PostControllerApi(undefined, POST_SERVICE_PATH, request);
export const roomApi = new RoomControllerApi(undefined, ROOM_SERVICE_PATH, request);
