angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/partials/example.html',
    '<div ng-include="\'examples/\' + exampleId + \'/partial.html\'"></div>\n' +
    '\n' +
    '<tabset>\n' +
    '    <tab heading="JavaScript">\n' +
    '        <div hljs include="\'examples/\' + exampleId + \'/steps.js\'" language="javascript"></div>\n' +
    '    </tab>\n' +
    '\n' +
    '    <tab heading="HTML">\n' +
    '        <div hljs include="\'examples/\' + exampleId + \'/partial.html\'" language="html"></div>\n' +
    '    </tab>\n' +
    '</tabset>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/1/partial.html',
    '<multi-step-container steps="steps" class="simple-prev-next">\n' +
    '    <button ng-disabled="$isFirst()" class="btn btn-default" ng-click="$previousStep()">\n' +
    '        <span class="fa fa-chevron-left"></span>\n' +
    '        Previous\n' +
    '    </button>\n' +
    '\n' +
    '    <strong ng-bind-template="{{$getActiveIndex()}}. {{$getActiveStep().title}}"></strong>\n' +
    '\n' +
    '    <button ng-disabled="$isLast()" class="btn btn-default" ng-click="$nextStep()">\n' +
    '        Next\n' +
    '        <span class="fa fa-chevron-right"></span>\n' +
    '    </button>\n' +
    '</multi-step-container>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/1/step1.html',
    '<div class="well">\n' +
    '    <h4>Install with bower</h4>\n' +
    '\n' +
    '    <div hljs source="\'bower install --save angular-multi-step-form\'" language="sh"></div>\n' +
    '\n' +
    '    <h4>Download from Github</h4>\n' +
    '\n' +
    '    <a href="https://github.com/troch/angular-multi-step-form/tree/master/dist">https://github.com/troch/angular-multi-step-form/tree/master/dist</a>\n' +
    '</div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/1/step2.html',
    '<div class="well">\n' +
    '    <h4>Include it in your application</h4>\n' +
    '\n' +
    '    <div hljs include="\'examples/1/include-in-app\'" language="javascript"></div>\n' +
    '</div>\n' +
    '\n' +
    '<script type="text/ng-template" id="examples/1/include-in-app">\n' +
    '    angular.module(\'myApp\', [\n' +
    '        \'multiStepForm\'\n' +
    '    ]);\n' +
    '</script>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/1/step3.html',
    '<div class="well">\n' +
    '    <h4>Create your steps:</h4>\n' +
    '\n' +
    '    <div hljs include="\'examples/1/create-your-steps\'" language="javascript"></div>\n' +
    '\n' +
    '    <h4>Run them in your view:</h4>\n' +
    '\n' +
    '    <div hljs include="\'examples/1/run-your-steps\'" language="html"></div>\n' +
    '</div>\n' +
    '\n' +
    '<script type="text/ng-template" id="examples/1/create-your-steps">\n' +
    '    $scope.steps = [\n' +
    '        {template: \'Hello <button class="btn btn-default" ng-click="$nextStep()">Next</button>\'},\n' +
    '        {template: \'World <button class="btn btn-default" ng-click="$previousStep()">Previous</button>\'}\n' +
    '    ];\n' +
    '</script>\n' +
    '\n' +
    '<script type="text/ng-template" id="examples/1/run-your-steps">\n' +
    '    <multi-step-container steps="steps"></multi-step-container>\n' +
    '</script>\n' +
    '');
}]);
