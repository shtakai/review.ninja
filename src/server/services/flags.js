'use strict';

var reference = function(sha, path, position) {
    return sha + '/' + path + 'R' + position;
};

module.exports = {

    review: function(comments) {

        // input: all review comments
        // output: number of open/closed issues

        var threads = {};

        var open = 0;
        var closed = 0;

        var negative = /\!\bfix\b|\!\bresolve\b/g;
        var positive = /\!\bfixed\b|\!\bresolved\b|\!\bcompleted\b/g;

        comments.forEach(function(comment) {
            var ref = reference(comment.original_commit_id, comment.path, comment.original_position);
            threads[ref] = threads[ref] || [];
            threads[ref].push(comment);
        });

        for(var ref in threads) {

            var state = null;

            for(var i = 0; i < threads[ref].length; i++) {

                var neg = threads[ref][i].body.match(negative);
                var pos = threads[ref][i].body.match(positive);

                if(neg) {
                    state = 'open';
                } else if(pos && !neg) {
                    state = 'closed';
                }
            }

            open = state === 'open' ? open + 1 : open;
            closed = state === 'closed' ? closed + 1 : closed;
        }

        return {open: open, closed: closed};
    },

    star: function(comment) {

        // input: single conversation comment
        // output: true or false (true to create a ninja star)
        var starRegex = /\!star|\!ninjastar|\+1|\:thumbsup\:|\:star\:/g;
        var unstarRegex = /\!unstar|\-1|\:thumbsdown\:/g;
        return !!comment.match(starRegex) && !comment.match(unstarRegex);
    },

    unstar: function(comment) {
        var unstarRegex = /\!unstar|\-1|\:thumbsdown\:/g;
        return !!comment.match(unstarRegex);
    }

};
