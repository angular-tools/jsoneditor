(function () {
    var module = angular.module('ng.jsoneditor', []);
    module.constant('ngJsoneditorConfig', {});

    module.directive('ngJsoneditor', ['ngJsoneditorConfig', '$timeout', function (ngJsoneditorConfig, $timeout) {
        var defaults = ngJsoneditorConfig || {};

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {'options': '=', 'ngJsoneditor': '=', 'preferText': '='},
            link: function ($scope, element, attrs, ngModel) {
                var debounceTo, debounceFrom;
                var editor;
                var internalTrigger = false;

                if (!angular.isDefined(window.JSONEditor)) {
                    throw new Error("Please add the jsoneditor.js script first!");
                }

                function _createEditor(options) {
                    var settings = angular.extend({}, defaults, options);
                    var theOptions = angular.extend({}, settings, {
                        onChange: function () {
                            if (typeof debounceTo !== 'undefined') {
                                $timeout.cancel(debounceTo);
                            }

                            debounceTo = $timeout(function () {
                                if (editor) {
                                    internalTrigger = true;
                                    var error = undefined;
                                    try {
                                        ngModel.$setViewValue($scope.preferText === true ? editor.getText() : editor.get());
                                    } catch (err) {
                                        error = err;
                                    }

                                    if (settings && settings.hasOwnProperty('onChange')) {
                                        settings.onChange(error);
                                    }
                                }
                            }, settings.timeout || 100);
                        }
                    });

                    element.html('');

                    var instance = new JSONEditor(element[0], theOptions);

                    if ($scope.ngJsoneditor instanceof Function) {
                        $timeout(function () {
                            $scope.ngJsoneditor(instance);
                        });
                    }

                    return instance;
                }

                $scope.$watch('options', function (newValue, oldValue) {
                    if (editor) {
                        for (var k in newValue) {
                            if (newValue.hasOwnProperty(k)) {
                                var v = newValue[k];

                                if (!oldValue || newValue[k] !== oldValue[k]) {
                                    if (k === 'mode') {
                                        editor.setMode(v);
                                    } else if (k === 'name') {
                                        editor.setName(v);
                                    } else if (k === 'expanded') {
                                        if (newValue[k]) {
                                            editor.expandAll && editor.expandAll()
                                        } else {
                                            editor.collapseAll && editor.collapseAll()
                                        }
                                    } else { //other settings cannot be changed without re-creating the JsonEditor
                                        editor = _createEditor(newValue);
                                        $scope.updateJsonEditor();
                                        return;
                                    }
                                }
                            }
                        }
                    } else {
                        editor = _createEditor($scope.options);
                        if ($scope.options) {
                            editor.expandAll && editor.expandAll()
                        } else {
                            editor.collapseAll && editor.collapseAll()
                        }
                    }
                }, true);

                $scope.$on('$destroy', function () {
                    //remove jsoneditor?
                });

                $scope.updateJsonEditor = function (newValue) {
                    if (internalTrigger) {
                        //ignore if called by $setViewValue (after debounceTo)
                        internalTrigger = false;
                        return;
                    }

                    if (typeof debounceFrom !== 'undefined') {
                        $timeout.cancel(debounceFrom);
                    }

                    debounceFrom = $timeout(function () {
                        if (($scope.preferText === true) && !angular.isObject(ngModel.$viewValue)) {
                            editor.setText(ngModel.$viewValue || '{}');
                        } else {
                            editor.set(ngModel.$viewValue || {});
                        }
                    }, ($scope.options && $scope.options.timeout) || 100);
                };

                ngModel.$render = $scope.updateJsonEditor;
                $scope.$watch(function () {
                    return ngModel.$modelValue;
                }, $scope.updateJsonEditor, true); //if someone changes ng-model from outside
            }
        };
    }]);
})();
