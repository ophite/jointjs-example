/**
 * Created by administrator on 2/23/16.
 */
'use strict';

define(['angular'], function(angular) {
	angular.module('myApp.version.version-directive', [])
		.directive('appVersion', ['version', function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
			};
		}]);
});
