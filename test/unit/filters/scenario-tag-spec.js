/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Scenario Tag Filter execution', function() {

    var scenarioTagFilter,
        story;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            scenarioTagFilter = $injector.get('$filter')('scenarioTagFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock) {
        story = storyServiceMock.books[0].stories[0];
    }));

    it('should keep all scenarios in case of a clear filter', function () {
        var filteredScenarios = scenarioTagFilter(story.scenarios,story.tags,[]);
        expect(filteredScenarios.length).to.equal(2);
        expect(filteredScenarios[0].title).to.equal(story.scenarios[0].title);
        expect(filteredScenarios[1].title).to.equal(story.scenarios[1].title);
    });

    it('should filter scenarios in case they do not match the filter', function () {
        var filteredScenarios = scenarioTagFilter(story.scenarios,story.tags,[1]);
        expect(filteredScenarios.length).to.equal(1);
        expect(filteredScenarios[0].title).to.equal(story.scenarios[1].title);
    });

});
