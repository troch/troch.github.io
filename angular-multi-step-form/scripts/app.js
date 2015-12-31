'use strict';

angular

.module('msfDemo', ['ngAnimate', 'ngRoute', 'multiStepForm', 'ui.bootstrap', 'hljs', 'angulartics', 'angulartics.google.analytics'])

.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: '/angular-multi-step-form/partials/home.html',
                reloadOnSearch: false
                // controller: ''
            })
            .when('/getting-started', {
                controller: 'GettingStartedCtrl',
                templateUrl: '/angular-multi-step-form/partials/example.html',
                reloadOnSearch: false
            })
            .when('/using-forms', {
                controller: 'UsingFormsCtrl',
                templateUrl: '/angular-multi-step-form/partials/example.html',
                reloadOnSearch: false
            })
            .when('/saving-data', {
                controller: 'SavingDataCtrl',
                templateUrl: '/angular-multi-step-form/partials/example.html',
                reloadOnSearch: false
            })
            .when('/css-transitions', {
                controller: 'CSSTransitionsCtrl',
                templateUrl: '/angular-multi-step-form/partials/example-css.html',
                reloadOnSearch: false
            })
            .when('/cancel-finish', {
                controller: 'CancelFinishCtrl',
                templateUrl: '/angular-multi-step-form/partials/example.html',
                reloadOnSearch: false
            })
            .when('/browser-navigation', {
                controller: 'BrowserNavigationCtrl',
                templateUrl: '/angular-multi-step-form/partials/example.html',
                reloadOnSearch: false
            })
            .when('/inside-modal', {
                controller: 'InsideModalCtrl',
                templateUrl: '/angular-multi-step-form/partials/example-modal.html',
                reloadOnSearch: false
            })
            .otherwise('/home');
    }
])

.run([
    '$location',
    '$rootScope',
    function ($location, $rootScope) {
        $rootScope.$location = $location;
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
])

.controller('SavingDataCtrl', [
    '$scope',
    function ($scope) {
        $scope.exampleId = 3;

        $scope.model = {};

        $scope.steps = [
            {
                templateUrl: '/angular-multi-step-form/examples/3/step1.html',
                title: 'Saving data'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/3/step2.html',
                hasForm: true,
                title: 'Using scope inheritence'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/3/step3.html',
                hasForm: true,
                isolatedScope: true,
                controller: 'IsolatedStepCtrl',
                title: 'Isolated step scopes'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/3/step4.html',
                title: 'Your name is...'
            }
        ];
    }
])

.controller('IsolatedStepCtrl', [
    '$scope',
    'multiStepFormInstance',
    'multiStepFormScope',
    function ($scope, multiStepFormInstance, mmultiStepFormScope) {
        $scope.model = angular.copy(mmultiStepFormScope.model);

        $scope.$on('$destroy', function () {
            mmultiStepFormScope.model = angular.copy($scope.model);
        });
    }
])

.controller('CSSTransitionsCtrl', [
    '$scope',
    function ($scope) {
        $scope.exampleId = 4;

        $scope.steps = [
            {
                templateUrl: '/angular-multi-step-form/examples/4/step1.html'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/4/step2.html'
            }
        ];
    }
])

.controller('CancelFinishCtrl', [
    '$scope',
    '$location',
    '$route',
    function ($scope, $location, $route) {
        $scope.exampleId = 5;

        $scope.$route = $route;

        $scope.steps = [
            {
                templateUrl: '/angular-multi-step-form/examples/5/step1.html'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/5/step2.html'
            }
        ];

        $scope.steps2 = [
            {
                templateUrl: '/angular-multi-step-form/examples/5/step2-2.html'
            }
        ];

        $scope.cancel = function () {
            alert('Cancel has been called. You are going to be redirected home!');
            $location.path('/home');
        };

        $scope.finish = function () {
            alert('Finish has been called. You are going to be redirected home!');
            $location.path('/home');
        };
    }
])


.controller('BrowserNavigationCtrl', [
    '$scope',
    '$location',
    '$route',
    function ($scope, $location, $route) {
        $scope.exampleId = 6;

        $scope.$route = $route;

        $scope.steps = [
            {
                templateUrl: '/angular-multi-step-form/examples/6/step1.html'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/6/step.html'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/6/step.html'
            },
            {
                templateUrl: '/angular-multi-step-form/examples/6/step.html'
            }
        ];
    }
])

.controller('InsideModalCtrl', [
    '$scope',
    '$modal',
    function ($scope, $modal) {
        $scope.exampleId = 7;

        $scope.openModal = function () {
            $modal.open({
                controller: ['$scope', function ($scope) {
                    $scope.steps = [
                        {
                            templateUrl: '/angular-multi-step-form/examples/7/step.html'
                        },
                        {
                            templateUrl: '/angular-multi-step-form/examples/7/step.html'
                        },
                        {
                            templateUrl: '/angular-multi-step-form/examples/7/step.html'
                        }
                    ];
                }],
                templateUrl: '/angular-multi-step-form/examples/7/partial.html'
            });
        };
    }
]);
