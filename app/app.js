'use strict';

var app = angular.module('myApp', [
    'ui.bootstrap'
]);

app.controller('mainCtrl', function($scope) {
    $scope.fields = [
        { displayName: 'someStringField', modelName: 'someStringField', type: 'string'},
        { displayName: 'someDateField', modelName: 'someDateField', type: 'date'},
        { displayName: 'someBooleanField', modelName: 'someBooleanField', type: 'boolean'},
        { displayName: 'someIntegerField', modelName: 'someIntegerField', type: 'integer'}
    ];

    $scope.anyOrAll = 'all';

    $scope.placeholderArray = [{selected: $scope.fields[0]}];

    $scope.plus = function() {
        $scope.placeholderArray.push({value:''});
    }

    $scope.minus = function() {
        $scope.placeholderArray.pop();
    }

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    $scope.status = {
        opened: false
    };

});

app.directive('ngCriteria', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, tabsCtrl) {

            var index = attrs.ngCriteria;
            element.removeAttr( "ng-criteria" );

            scope.$watch("placeholderArray[" + index + "].selected",function(newVal,oldVal){
                if (newVal != null) {
                    element.next().remove();
                    if (element.next().is("div") || element.next().is("input")) {
                        element.next().remove();
                    }
                    if (newVal.type == 'boolean') {
                        scope.placeholderArray[index].value='true';
                        scope.placeholderArray[index].op='boolean';
                        element.parent().append( "<select ng-model='placeholderArray[" + index + "].value' " +
                            " ><option value='true' >is true</option><option value='false'>is false</option></select>" );
                        $compile(element.next())(scope);
                    } else if (newVal.type == 'date') {
                        scope.placeholderArray[index].value='';
                        scope.placeholderArray[index].op='is';
                        element.parent().append("<select ng-model='placeholderArray[" + index + "].op' >" +
                            "<option>is</option>" +
                            "<option>is after</option>" +
                            "<option>is before</option>" +
                            "<option>is in the range</option>" +
                            "</select>");
                        element.parent().append("<div class='input-group' style='margin-left: 3px'>" +
                            " <input type='text' uib-datepicker-popup='{{format}}' " +
                            " ng-model='placeholderArray[" + index + "].value'" +
                            " is-open='status.opened' datepicker-options='dateOptions'" +
                            " ng-required='true' close-text='Close' />" +
                            " <span class='input-group-btn'>" +
                            " <button type='button' class='btn btn-sm' style='padding: 2px 5px' ng-click='open($event)'>" +
                            " <i class='glyphicon glyphicon-calendar'></i></button>" +
                            " </span>" +
                            " </div>");
                        $compile(element.next())(scope);
                        $compile(element.next().next())(scope);
                    } else if (newVal.type == 'integer') {
                        scope.placeholderArray[index].value='';
                        scope.placeholderArray[index].op='is';
                        element.parent().append("<select ng-model='placeholderArray[" + index + "].op' >" +
                            "<option>is</option>" +
                            "<option>is not</option>" +
                            "<option>is greater than</option>" +
                            "<option>is less than</option>" +
                            "<option>is in the range</option>" +
                            "</select>");
                        element.parent().append( "<input type='text' style='margin-left: 3px' " +
                            "ng-model='placeholderArray[" + index + "].value'" +
                            " placeholder='Enter Value' />" );
                        $compile(element.next())(scope);
                        $compile(element.next().next())(scope);
                    } else {
                        scope.placeholderArray[index].selected = scope.fields[0];
                        scope.placeholderArray[index].value='';
                        scope.placeholderArray[index].op='contains';
                        element.parent().append("<select ng-model='placeholderArray[" + index + "].op' >" +
                            "<option>is</option>" +
                            "<option>is not</option>" +
                            "<option>contains</option>" +
                            "<option>does not contain</option>" +
                            "<option>begins with</option>" +
                            "<option>ends with</option>" +
                            "</select>");
                        element.parent().append( "<input type='text' style='margin-left: 3px' " +
                            "ng-model='placeholderArray[" + index + "].value' " +
                            "placeholder='Enter Value' />" );
                        $compile(element.next())(scope);
                        $compile(element.next().next())(scope);
                    }
                } else {
                    scope.placeholderArray[index].selected = scope.fields[0];
                    scope.placeholderArray[index].value='';
                    scope.placeholderArray[index].op='contains';
                    element.parent().append("<select ng-model='placeholderArray[" + index + "].op' >" +
                        "<option>is</option>" +
                        "<option>is not</option>" +
                        "<option>contains</option>" +
                        "<option>does nto contain</option>" +
                        "<option>begins with</option>" +
                        "<option>ends with</option>" +
                        "</select>");
                    element.parent().append( "<input type='text' style='margin-left: 3px' " +
                        "ng-model='placeholderArray[" + index + "].value' " +
                        "placeholder='Enter Value' />" );
                    $compile(element.next())(scope);
                    $compile(element.next().next())(scope);
                }
            });
        }
    };
});