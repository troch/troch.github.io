.controller('IsolatedStepCtrl', [
    '$scope',
    'multiStepFormScope',
    function ($scope, multiStepFormScope) {
        $scope.model = angular.copy(multiStepFormScope.model);

        $scope.$on('$destroy', function () {
            multiStepFormScope.model = angular.copy($scope.model);
        });
    }
]);
