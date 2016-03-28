(function(){
    "use strict";

    angular.module("app.admin.groups")
        .filter("startFrom", function() {
            return function(input, start) {
                if(input) {
                    start = +start; //parse to int
                    return input.slice(start);
                }
                return [];
            }
        })
})();