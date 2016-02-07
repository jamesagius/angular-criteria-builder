'use strict';

var app = angular.module('myApp', [
    'ui.bootstrap','ui.grid','ui.grid.resizeColumns', 'ui.grid.selection', 'ui.grid.saveState', 'ui.grid.pagination'
]);

app.directive('pstd', function($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            function stringIt(someObject) {
                var j = '';
                angular.forEach(someObject, function(value, key) {
                    if (jQuery.type(value) === "string") {
                        j = j + key + ": '" + value + "',";
                    } else if (jQuery.type(value) === "boolean") {
                        if (value == false) {
                            j = j + key + ": '" + 'PSFALSE' + "',";
                        } else {
                            j = j + key + ": '" + 'PSTRUE' + "',";
                        }
                    } else if(jQuery.type(value) === "number") {
                        j = j + key + ": " + value + " ,";
                    } else {
                        j = j + key + ": {" + stringIt(value) + "},";
                    }
                }, j);
                j = j.substring(0, j.length-1);
                return j;
            }

            try {
                var value = JSON.parse(attrs.pstd);
                if (value == true || value == false) {
                    element.html(value);
                } else if (jQuery.type(value) === "number"){
                    element.html(value);
                } else {
                    var jsonString = stringIt(value);
                    element.html("<div'><table class=\"table table-condensed table-bordered table-hover\" style=\"margin-bottom: 0px\" >" +
                        "<tr ng-repeat=\"(k,v) in { " + jsonString + " }\"><td style=\"font-weight: bold; color: black\">{{k}}</td>" +
                        "<td style=\"font-weight: normal; color: darkgreen\" pstd=\"{{v}}\"></td></tr></table></div>");
                }
            } catch (err) {
                var value = attrs.pstd;
                if (jQuery.type(value) === "string") {
                    if (value == 'PSFALSE') {
                        element.html('false');
                    } else if (value == 'PSTRUE') {
                        element.html('true');
                    } else {
                        element.html(value);
                    }
                } else {
                    console.log('unknown value type: ' + value);
                }
            }
            element.removeAttr("pstd");
            $compile(element)(scope);
        }
    }
});

app.controller('nestedGridCtrl', function($scope,$rootScope,$log, uiGridColumnMenuService, myservice) {

    $scope.myservice = myservice;
    var height = $("#mygrid").innerHeight();
    height = (height-2);

    $scope.innerGridStyle = {height: height};

    $scope.gridOptions = {
        data: myservice.dataset,
        paginationPageSizes: [10, 50, 100],
        paginationPageSize: 10,
        multiSelect: false,
        enableRowSelection: true,
        onRegisterApi: function (gridApi){
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                $scope.rowEntity = row.entity;
            });
        },
        appScopeProvider: {
            onDblClick : function(row) {

                $scope.gridApi.selection.toggleRowSelection(row.entity);

                if ($scope.gridApi.selection.getSelectedRows().length > 0) {
                    $rootScope.$broadcast('psRowSelectEventOpen',row.entity);
                } else {
                    $rootScope.$broadcast('psRowSelectEventClose');
                }
            }
        },

        rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" style=\"cursor: pointer;\" " +
        "ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" " +
        "class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"

    };

});

app.service('myservice', function() {
});

app.controller('quickviewCtrl', function($scope, $rootScope, myservice) {

    $scope.myservice = myservice;
    var height = $("#mygrid").innerHeight();
    height = (height-2);
    $scope.mystyle = { 'max-height': '500px', width: $scope.myservice.width, overflow: 'auto'};
    $scope.gridOptions = {
        data: [$scope.myservice.data]
    };

    $scope.$watch('myservice.width', function(newValue, oldValue) {
        $scope.mystyle = { 'max-height': '500px', width: newValue, overflow: 'auto'};
    });

    $scope.$watch('myservice.data', function(newValue, oldValue) {
        $scope.gridOptions.data.splice(0,1);
        $scope.gridOptions.data.push(newValue);
    });

});

app.controller('mainCtrl', function($scope,uiGridConstants,myservice) {

    $scope.$on('psRowSelectEventOpen', function(event,data){
        $scope.gridOptions.columnDefs[0].visible = true;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);

        if ($scope.gridApi.saveState.save().columns[0].width == '25%') {
            var gridWidth = $("#mygrid").innerWidth();
            var calculatedLeftWidth = (gridWidth * .25);
            myservice.width = calculatedLeftWidth;
        }

        myservice.data = data;
    });

    $scope.$on('psRowSelectEventClose', function(event) {
        $scope.gridOptions.columnDefs[0].visible = false;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    });

    $scope.myservice = myservice;

    myservice.dataset = [];
    for (var x=0;x<1000;x++) {
        myservice.dataset.push(
            {
                a: guid(),b: guid(),
                c: { c_1: guid(), c_2: guid()},
                d: { d_1: [guid(),guid(),guid()]},
                e: { e_1: true, e_2: 100, e_3: guid()},
                f: { f_1: [{ f_1_a: guid()},{ f_1_b: guid()},{ f_1_c: guid()}]}
            }
        );
    }

    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    $scope.gridOptions = {
        data: [],
        columnDefs: [
            { field: 'quickview', displayName: 'LHS', width: '25%', visible: false, headerCellTemplate: 'quickviewHeader.html' },
            { field: 'nestedgrid', displayName: 'RHS', headerCellTemplate: 'nestedgridHeader.html'}
        ],
        enableColumnMenus: false,
        onRegisterApi: function (gridApi){
            $scope.gridApi = gridApi;

            gridApi.colResizable.on.columnSizeChanged($scope,function(colDef, deltaChange){
                var s = $scope.gridApi.saveState.save();
                var leftWidth = s.columns[0].width
                myservice.width = leftWidth;
            });

        }
    }

});
