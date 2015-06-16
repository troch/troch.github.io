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
