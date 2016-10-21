'use strict';

angular.module('ng-smart-float', ['ng-number-filter']).directive('smartFloat', function ($filter) {

    function removeMultipleCommas(input) {
        input = input.split(',');
        var result = '';
        for (var i = 0; i < input.length; i++) {
            if (i == 1) {
                result += ',';
            }
            result += input[i];
        }
        return result;
    }

    function toViewValue(modelValue, scope) {
        var decimalPart = ('' + modelValue).split('.')[1];
        var decimalScale = getDecimalScale(scope, decimalPart);

        var viewValue = (!isNaN(parseFloat(modelValue)) && isFinite(modelValue)) ? $filter('euroNumber')(modelValue, decimalScale) : modelValue;
        if(!viewValue) {
            return '';
        }
        return '' + viewValue;
    }

    function getDecimalScale(scope, decimalPart){
        if(!scope.decimalScale){
            return undefined;
        }
        return decimalPart && scope.decimalScale === true ? decimalPart.length : parseInt(scope.decimalScale);
    }

    function isPresent(value){
        return !!value || value === 0;
    }

    return {
        require: 'ngModel',
        scope: {
            dotAllowed: '=?',
            decimalScale: '=?',
            max: '=?',
            min: '=?'
        },
        link: function (scope, elm, attrs, ctrl) {
            scope.dotAllowed = scope.dotAllowed === undefined;
            ctrl.$parsers.unshift(function (viewValue) {
                var inputValue = viewValue;
                if (!!scope.max) {
                    ctrl.$validators.max = function(modelValue, viewValue) {
                        return !isPresent(modelValue) || modelValue.length == 0 || modelValue <= scope.max;
                    }
                }
                if (!!scope.min) {
                    ctrl.$validators.min = function(modelValue, viewValue) {
                        return !isPresent(modelValue) || modelValue.length == 0 || modelValue >= scope.min;
                    }
                }
                if (viewValue) {
                    viewValue = scope.dotAllowed ? viewValue.replace(/[^0-9+,.]/g, '') : viewValue.replace(/[^0-9,]/g, '') ;
                    if(scope.decimalScale === 0)
                        viewValue = viewValue.replace(',','');
                    viewValue = removeMultipleCommas(viewValue);
                    viewValue = viewValue === ',' ? '0,' : viewValue;
                    viewValue = viewValue.trim();
                    if(scope.decimalScale && viewValue.length > 0) {
                        var split = viewValue.split(',');
                        var decimalPart = split[1];
                        var decimalScale = getDecimalScale(scope, decimalPart);

                        if(decimalPart && decimalPart.length > decimalScale){
                            viewValue = split[0] + ',' + decimalPart.substring(0, decimalScale);
                        }
                    }
                }
                if(inputValue !== viewValue){
                    ctrl.$setViewValue(viewValue);
                    ctrl.$render();
                }
                if(viewValue)
                    viewValue = viewValue.toString().replace(/[\.]/g, '').replace(/[,]/g, '.');
                return isNaN(parseFloat(viewValue)) ? '' : viewValue;
            });
            ctrl.$formatters.unshift(function (modelValue) {
                return toViewValue(modelValue, scope);
            });
        }
    };
});
