import axios from 'axios';

import { base_url } from './serviceTypes';

axios.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';

const defaultOpts = {
};

const request = (opts) => {
    const payload = {
        ...opts,
        url: base_url() + opts.url,
    };
    return axios(payload)
        .then(response => Promise.resolve(response))
        .catch((err) => {
            if (err && err.response) {
                return Promise.reject(err.response);
            }
            return Promise.reject(err.message);
        });
};

export const post = opts => request({
    ...defaultOpts,
    ...opts,
    method: 'POST',
});

export const put = opts => request({
    ...defaultOpts,
    ...opts,
    method: 'PUT',
});

export const get = opts => request({
    ...defaultOpts,
    ...opts,
    method: 'GET',
});

export const del = opts => request({
    ...defaultOpts,
    ...opts,
    method: 'DELETE',
});

export const getAuthenticated = opts => request({
    ...defaultOpts,
    ...opts,
    method: 'GET',
    withCredentials: true,
});

export const postAuthenticated = opts => request({
    ...defaultOpts,
    ...opts,
    method: 'POST',
    withCredentials: true,
});

export default request;
