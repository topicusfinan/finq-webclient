'use strict';
/*global Bloodhound:false */

/**
 * @ngdoc function
 * @name finqApp.service.story:reportSearch
 * @description
 * # Report search service
 *
 * Makes it possible to execute a search within a list of reports. This service
 * should be initialized with the full list of reports before any searches can
 * be performed using the `suggest` function.
 *
 */
angular.module('finqApp.service')
    .service('reportSearch', ['config', function (configProvider) {
        var reports,
            searchList = {};

        var setupList = function() {
            searchList.reports = [];
            angular.forEach(reports, function(report) {
                searchList.reports.push({
                    report: report.id,
                    title: report.title
                });
            });
        };

        this.initialize = function(reportList, forceReload) {
            if (reports !== undefined && !forceReload) {
                return;
            }
            reports = reportList;
            setupList();

            searchList.engine = new Bloodhound({
                datumTokenizer: function(d) {
                    return Bloodhound.tokenizers.whitespace(d.title);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: configProvider.client().maxSearchResults,
                local: searchList.reports
            });
            searchList.engine.initialize();
        };

        this.suggest = function(query) {
            if (searchList.engine === undefined) {
                throw new Error('Report search has not been initialized');
            }
            var ids = [];
            searchList.engine.get(query, function(suggestions) {
                angular.forEach(suggestions, function(suggestion) {
                    ids.push(suggestion.report);
                });
            });
            return ids;
        };

    }]);
