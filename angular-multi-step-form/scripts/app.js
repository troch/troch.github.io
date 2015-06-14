'use strict';

angular

.module('msfDemo', ['ngAnimate', 'ngRoute', 'multiStepForm', 'ui.bootstrap', 'hljs'])

.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: '/angular-multi-step-form/partials/home.html'
                // controller: ''
            })
            .when('/getting-started', {
                controller: 'GettingStartedCtrl',
                templateUrl: '/angular-multi-step-form/partials/example.html',
            })
            .when('/using-forms', {
                controller: 'UsingFormsCtrl',
                templateUrl: '/angular-multi-step-form/partials/example.html',
            })
            .otherwise('/home');
    }
])

.controller('GettingStartedCtrl', [
    '$scope',
    function ($scope) {
        $scope.exampleId = 1;

        $scope.steps = [
            {
                templateUrl: '/angular-multi-step-form/examples/1/step1.html',
                title: 'Get the source'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/1/step2.html',
                title: 'Add it to your app'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/1/step3.html',
                title: 'Create your multi step forms / wizzards'
            },
            {
                template: '<div class="well">Discover with the available examples and documentation the versatility of this lightweight angular module (6kb minified).</div>',
                title: 'Discover the examples and read the docs!'
            }
        ];
    }
])

.controller('UsingFormsCtrl', [
    '$scope',
    function ($scope) {
        $scope.exampleId = 2;

        $scope.steps = [
            {
                templateUrl: '/angular-multi-step-form/examples/2/step1.html',
                title: 'Introduction'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/2/step2.html',
                hasForm: true,
                title: 'Update validity'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/2/step3.html',
                hasForm: true,
                title: 'Automatically update validity'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/2/step4.html',
                title: 'Congratulations'
            }
        ];
    }
]);
