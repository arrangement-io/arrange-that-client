import axios from 'axios';
import { getBearer, logout } from 'services/authService'

import { base_url } from './serviceTypes';

axios.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';

const defaultOpts = {
}

export const post = (opts) => {
    return request({
        ...defaultOpts,
        ...opts,
        method: 'POST'
    });
};

export const put = (opts) => {
    return request({
        ...defaultOpts,
        ...opts,
        method: 'PUT'
    });
};

export const get = (opts) => {
    return request({
        ...defaultOpts,
        ...opts,
        method: 'GET'
    });
};

export const del = (opts) => {
    return request({
        ...defaultOpts,
        ...opts,
        method: 'DELETE'
    });
};

export const getAuthenticated = (opts) => {
    return request({
        ...defaultOpts,
        ...opts,
        method: 'GET',
        headers: {"Authorization": "Bearer " + getBearer()}
    })
}

export const postAuthenticated = (opts) => {
    return request({
        ...defaultOpts,
        ...opts,
        method: 'POST',
        headers: {"Authorization": "Bearer " + getBearer()}
    })
}

const request = (opts) => {
    const payload = {
        ...opts,
        url: base_url() + opts.url
    }
    return axios(payload)
        .then(response => {
            return Promise.resolve(response)
        })
        .catch(err => {
            if (err && err.response) {
                return Promise.reject(err.response);
            } else {
                return Promise.reject(err.message);
            }
        });
};

export default request;