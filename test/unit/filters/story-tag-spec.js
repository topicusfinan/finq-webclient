/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Story Tag Filter execution', function() {

    var storyTagFilter,
        stories;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        inject(function($injector){
            storyTagFilter = $injector.get('$filter')('storyTag');
        });
    });
    beforeEach(function() {
        stories = [
            {
                title: 'First story',
                tags: ['test','tag']
            },
            {
                title: 'Second story',
                tags: ['test']
            },
            {
                title: 'Third story',
                tags: ['tag']
            }
        ];
    });

    it('should keep all stories in case of a clear filter', function () {
        var filteredStories = storyTagFilter(stories,null);
        expect(filteredStories.length).to.equal(3);
        expect(filteredStories[0].title).to.equal('First story');
        expect(filteredStories[1].title).to.equal('Second story');
        expect(filteredStories[2].title).to.equal('Third story');
    });

    it('should filter stories in case they do not match the filter', function () {
        var filteredStories = storyTagFilter(stories,'tag');
        expect(filteredStories.length).to.equal(2);
        expect(filteredStories[0].title).to.equal('First story');
        expect(filteredStories[1].title).to.equal('Third story');
    });

});
