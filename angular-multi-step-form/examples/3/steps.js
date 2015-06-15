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
