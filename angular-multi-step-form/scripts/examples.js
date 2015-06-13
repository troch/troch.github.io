'use strict';

angular

.module('msfDemo', ['ngAnimate', 'ngRoute', 'multiStepForm'])

.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                template: '<div class="alert alert-warning">This page is work in progress, come back to check later!</div>'
                // controller: ''
            })
            .when('/how-to-use', {
                controller: 'HowToInstallCtrl',
                templateUrl: '/angular-multi-step-form/partials/example1.html'
            })
            .otherwise('/home');
    }
])

.controller('HowToInstallCtrl', [
    '$scope',
    function ($scope) {
        $scope.steps = [
            {
                template: '<div class="well">Install with bower, or download sources</div>',
                title: 'Get the source'
            },
            {
                template: '<div class="well">Include source in your app and add dependency</div>',
                title: 'Add it to your app'
            },
            {
                template: '<div class="well">Configure your multi step form</div>',
                title: 'Create your multi step forms / wizzards'
            },
            {
                template: '<div class="well">More docs available on Github</div>',
                title: 'Read the docs'
            }
        ];
    }
])
