'use strict';

var app = angular.module('app', ['ui.router','app.services','app.controllers']);

app.config(function ($stateProvider, $urlRouterProvider) {
	
	$stateProvider
     
        // route to show our basic form (/form)
        .state('home', {
            url: '/',
            templateUrl: '/app/views/tpl/welcome.html',
            controller: 'ActiveCtrl'
        })
         
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('projects', {
            url: '/record/:id',
            templateUrl: 'app/views/tpl/groud.html',
			controller: 'RecordCtrl'
        })
         
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/');
	
});