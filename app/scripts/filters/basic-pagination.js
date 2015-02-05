'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:basicPagination
 * @description
 * # Paginate a 2 dimensional list
 */
angular.module('finqApp.filter')
    .filter('basicPagination', function () {
        return function (items, iteration, maxItems) {
            var filteredItems = [],
                i,
                maxLength = Math.min((iteration + 1) * maxItems, items.length);

            for (i = iteration * maxItems; i < maxLength; i++) {
                filteredItems.push(items[i]);
            }

            return filteredItems;
        };
    });
