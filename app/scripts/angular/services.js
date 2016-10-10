'use strict';

var services = angular.module('app.services', ['ngResource']);

services.factory('UsersFactory', function ($resource) {
    return $resource('/user', {}, {
        create: { method: 'POST' }
    })
});

services.factory('UserFactory', function ($resource) {
    return $resource('/user/:id', {}, {
        get: { method: 'GET' }
    })
});

