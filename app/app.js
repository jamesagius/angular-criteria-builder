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
                    element.html("<div'><table class=\"table table-condensed table-bordered table-hover\" >" +
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
        data: [
            { 'keyA': 'valA1', 'keyB': {a: 'valBa'}, 'keyC' : 'valC'},
            { 'keyA': 'valA2', 'keyB': {a: 'valBb'}, 'keyC' : 'valC'},
            { 'keyA': 'valA3', 'keyB': {a: 'valBc'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            myservice.bigRow,
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'},
            { 'keyA': 'valA4', 'keyB': {a: 'valBd'}, 'keyC' : 'valC'}

        ],
        paginationPageSizes: [10, 20, 30],
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
console.log('init: ' + $scope.myservice.width);
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

    $scope.gridOptions = {
        data: [],
        columnDefs: [
            { field: 'quickview', displayName: 'Q', width: '25%', visible: false, headerCellTemplate: 'quickviewHeader.html' },
            { field: 'nestedgrid', displayName: 'G', headerCellTemplate: 'nestedgridHeader.html'}
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

    myservice.bigRow = {
        'prop_a': 'val_a',
        'prop_bool': true,
        'prop_num': 10,
        'prop_negnum': -10,
        'prop_negnumdeci': -10.1,
        'prop_b': {
            'prop_b_1': 'prop_b_val1',
            'prop_b_2': 'prop_b_val2',
            'prop_b_bool': false,
            'prop_b_3': {
                b_3_numNeg10: -10,
                b_3_numNeg10deci: -10.3,
                b_3_a: 'val_b3a',
                b_3_b: 'val_b3b',
                b_3_c: 'val_b3c',
                b_3_d: {
                    prop_3_b_d_1: 'val_3bd1',
                    prop_3_b_d_2: 'val_3bd2',
                    prop_3_b_d_3: [15,'val_a','val_b',{c: 'val_cc'}, {c_bool: true}],
                },
                b_3_num20: 20
            }
        },
        'prop_c': [
            {'c_1': 'val_c_1'},
            {'c_1': 'val_c_2'},
            {'c_1': { c_1_a: 'val_c1a', c_1_b: 'val_c1b'}}
        ],
        'prop_d': 'val_d'
    };

});
