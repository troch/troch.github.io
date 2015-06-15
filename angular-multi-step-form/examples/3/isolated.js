.controller('IsolatedStepCtrl', [
    '$scope',
    'multiStepFormScope',
    function ($scope, multiStepForm) {
        $scope.model = angular.copy(multiStepForm.model);

        $scope.$on('$destroy', function () {
            multiStepForm.model = angular.copy($scope.model);
        });
    }
]);
