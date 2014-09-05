/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Story Set Filter execution', function() {

    var storySetFilter,
        stories;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        inject(function($injector){
            storySetFilter = $injector.get('$filter')('storySet');
        });
    });
    beforeEach(function() {
        stories = [
            {
                title: 'First story',
                sets: [1,2]
            },
            {
                title: 'Second story',
                sets: [1]
            },
            {
                title: 'Third story',
                sets: [2]
            }
        ];
    });

    it('should keep all stories in case of a clear filter', function () {
        var filteredStories = storySetFilter(stories,null);
        expect(filteredStories.length).to.equal(3);
        expect(filteredStories[0].title).to.equal('First story');
        expect(filteredStories[1].title).to.equal('Second story');
        expect(filteredStories[2].title).to.equal('Third story');
    });

    it('should filter stories in case they do not match the filter', function () {
        var filteredStories = storySetFilter(stories,2);
        expect(filteredStories.length).to.equal(2);
        expect(filteredStories[0].title).to.equal('First story');
        expect(filteredStories[1].title).to.equal('Third story');
    });

});
