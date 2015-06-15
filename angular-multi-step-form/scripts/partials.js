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
  $templateCache.put('/angular-multi-step-form/partials/home.html',
    '<p>\n' +
    '    <strong>multiStepForm</strong> is an angular module to create multi step forms and wizards. Create your steps like your would\n' +
    '    create your views with ngRoute or ui-router!\n' +
    '</p>\n' +
    '\n' +
    '<p>It is lightweight (6kb minified) but extremely versatile and powerful. Discover what it is capable of with the following examples</p>\n' +
    '\n' +
    '<br>\n' +
    '<h3>Examples</h3>\n' +
    '\n' +
    '<ul>\n' +
    '    <li>\n' +
    '        <a href="#/getting-started"><strong>Getting started:</strong> how to install and use</a>\n' +
    '    </li>\n' +
    '\n' +
    '    <li>\n' +
    '        <a href="#/using-forms"><strong>Using forms:</strong> how to use Angular powers to your advantage</a>\n' +
    '    </li>\n' +
    '\n' +
    '    <li>\n' +
    '        <a href="#/using-forms"><strong>Saving data:</strong> how to save data entered at each step</a>\n' +
    '    </li>\n' +
    '\n' +
    '    <li>\n' +
    '        More to come\n' +
    '    </li>\n' +
    '</ul>\n' +
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

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/2/partial.html',
    '<multi-step-container steps="steps" class="simple-prev-next">\n' +
    '    <button ng-disabled="$isFirst()" class="btn btn-default" ng-click="$previousStep()">\n' +
    '        <span class="fa fa-chevron-left"></span>\n' +
    '        Previous\n' +
    '    </button>\n' +
    '\n' +
    '    <strong ng-if="$getActiveStep().hasForm" class="fa" ng-class="$getActiveStep().valid ? \'fa-check\' : \'fa-times\'"></strong>\n' +
    '\n' +
    '    <button ng-disabled="$isLast() || ($getActiveStep().hasForm && !$getActiveStep().valid)" class="btn btn-default" ng-click="$nextStep()">\n' +
    '        Next\n' +
    '        <span class="fa fa-chevron-right"></span>\n' +
    '    </button>\n' +
    '</multi-step-container>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/2/set-validity.html',
    '<form name="MyForm" form-step-validity>\n' +
    '    ...\n' +
    '</form>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/2/step1.html',
    '<div class="well">\n' +
    '    <p>You can use forms in steps, however this doesn\'t change much. Each step can take a property <strong>hasForm</strong> (true or false, false by default)\n' +
    '    but this property is harmless: it doesn\'t do anything at all.</p>\n' +
    '\n' +
    '    <p>This module is not opiniated about how to use forms. Have you ever used <a href="https://angular-ui.github.io/bootstrap/">Angular UI bootstrap modals</a>?\n' +
    '    Steps are very much like modals: isolated units of business logic. Therefore, validation and decision to whether allow navigation to the next step\n' +
    '    should be performed in each step.</p>\n' +
    '</div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/2/step2.html',
    '<div class="well">\n' +
    '    <p>\n' +
    '        However if you want to allow step navigation in your header or footer, you will need to share form validation information from your step view to the rest of\n' +
    '        the component. There are a few ways to do this:\n' +
    '    </p>\n' +
    '\n' +
    '    <p>\n' +
    '        From within the scope of your step, your can invoke <strong>$setStepValidity</strong>:\n' +
    '    </p>\n' +
    '\n' +
    '        <div hljs include="\'examples/2/toggle-validity.html\'" language="html"></div>\n' +
    '\n' +
    '    <p>\n' +
    '        <button class="btn btn-primary" ng-click="$setValidity(!$getActiveStep().valid)">Toggle Validity</button>\n' +
    '        {{$getActiveStep().valid ? \'valid\' : \'non-valid\'}}\n' +
    '    </p>\n' +
    '</div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/2/step3.html',
    '<div class="well">\n' +
    '    <p>\n' +
    '        In practive, you are likely to want to watch your form validity status and update the associated form step object:\n' +
    '        the <strong>formStepValidity</strong> directive does just that for you. Simply put it on your form element (or inside your\n' +
    '        form element)\n' +
    '\n' +
    '        <div hljs include="\'examples/2/set-validity.html\'" language="html"></div>\n' +
    '    </p>\n' +
    '\n' +
    '    <form name="MyForm" class="form-horizontal" form-step-validity>\n' +
    '        <div class="form-group">\n' +
    '            <label class="control-label col-sm-3">Required email</label>\n' +
    '\n' +
    '            <div class="col-sm-7">\n' +
    '                <input type="email" ng-model="email" name="email" class="form-control" placeholder="Email" required>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="form-group">\n' +
    '            <label class="control-label col-sm-3">Required name</label>\n' +
    '\n' +
    '            <div class="col-sm-7">\n' +
    '                <input type="text" ng-model="name" name="name" class="form-control" placeholder="Name" required>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </form>\n' +
    '</div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/2/step4.html',
    '<div class="well">\n' +
    '    Congratulations! You have passed!\n' +
    '</div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/2/toggle-validity.html',
    '<button class="btn btn-primary" ng-click="$setValidity(!$getActiveStep().valid)">Toggle Validity</button>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/3/input.html',
    '<input type="text" ng-model="model.firstName" name="firstName" class="form-control" placeholder="Enter your first name">\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/3/partial.html',
    '<multi-step-container steps="steps" class="simple-prev-next">\n' +
    '    <button ng-disabled="$isFirst()" class="btn btn-default" ng-click="$previousStep()">\n' +
    '        <span class="fa fa-chevron-left"></span>\n' +
    '        Previous\n' +
    '    </button>\n' +
    '\n' +
    '    <strong ng-bind-template="Your name is {{model.firstName}} {{model.lastName}}"></strong>\n' +
    '\n' +
    '    <button ng-disabled="$isLast()" class="btn btn-default" ng-click="$nextStep()">\n' +
    '        Next\n' +
    '        <span class="fa fa-chevron-right"></span>\n' +
    '    </button>\n' +
    '</multi-step-container>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/3/step1.html',
    '<div class="well">\n' +
    '    <h3>Steps are like modals...</h3>\n' +
    '\n' +
    '    <p>\n' +
    '        If you have played with the previous example (<a href="#/using-forms">Using forms</a>), you have noticed that if you entered an email and a name and then press next followed by previous, your data is no longer there.\n' +
    '    </p>\n' +
    '\n' +
    '    <p>\n' +
    '        This is because a step is like a view: it is instanciated when called. In other words, if you press "Next" and then "Previous", you are back where you were except that\n' +
    '        the step you are viewing has been freshly instanciated. And any data living in a step\'s scope will disappear.\n' +
    '    </p>\n' +
    '</div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/3/step2.html',
    '<div class="well">\n' +
    '    <h3>Using scope inheritence</h3>\n' +
    '\n' +
    '    <p>\n' +
    '        By default, step scopes inherit from their parent scope. In our example, we have defined in our parent scope (the view scope)\n' +
    '        a <strong>model object</strong>. That model object is used directly by the ngModel directive of the form element below:\n' +
    '    </p>\n' +
    '\n' +
    '    <div hljs include="\'examples/3/input.html\'" language="html"></div>\n' +
    '\n' +
    '    <form name="MyForm" class="form-horizontal">\n' +
    '        <div class="form-group">\n' +
    '            <label class="control-label col-sm-3">First name:</label>\n' +
    '\n' +
    '            <div class="col-sm-7">\n' +
    '                <input type="text" ng-model="model.firstName" name="firstName" class="form-control" placeholder="Enter your first name">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </form>\n' +
    '<div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/3/step3.html',
    '<div class="well">\n' +
    '    <h3>Isolated step scope</h3>\n' +
    '\n' +
    '    <p>\n' +
    '        This step has an isolated step scope, which means we cannot manipulate our data directly. Instead, we need to grab our data\n' +
    '        when a step is instanciated (i.e. when our step controller is instanciated), and we need to save our changes when we navigate\n' +
    '        away.\n' +
    '    </p>\n' +
    '\n' +
    '    <p>\n' +
    '        In an isolated step controller, we can inject <strong>multiStepFormScope</strong> which is our directive\'s scope. And we can\n' +
    '        use the $destroy event to save any data which has been modified by the user.\n' +
    '\n' +
    '        <div hljs include="\'examples/3/isolated.js\'" language="javascript"></div>\n' +
    '    </p>\n' +
    '\n' +
    '    <form name="MyForm" class="form-horizontal">\n' +
    '        <div class="form-group">\n' +
    '            <label class="control-label col-sm-3">Last name:</label>\n' +
    '\n' +
    '            <div class="col-sm-7">\n' +
    '                <input type="text" ng-model="model.lastName" name="lastName" class="form-control" placeholder="Enter your last name">\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </form>\n' +
    '</div>\n' +
    '');
}]);

angular.module('msfDemo').run(['$templateCache', function($templateCache) {
  $templateCache.put('/angular-multi-step-form/examples/3/step4.html',
    '<div class="well">\n' +
    '    <h3>And here we are...</h3>\n' +
    '\n' +
    '    <p>The previous step destruction triggered our data to be updated!</p>\n' +
    '\n' +
    '    <p>Your name is: <strong ng-bind-template="{{model.firstName}} {{model.lastName}}"></strong></p>\n' +
    '</div>\n' +
    '');
}]);
