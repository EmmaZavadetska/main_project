(function() {
    "use strict";

    angular.module("app.user")
        .directive("timer", timer);

    timer.$inject = ["$timeout", "$state", "TIME_DELAY", "testPlayerService"];

    function timer($timeout, $state, TIME_DELAY, testPlayerService) {
        var directive = {
            scope: {
                duration: "=",
                finishTest: "&"
            },
            link: function(scope, element) {
                scope.$watch("duration", function() {
                    if (scope.duration === undefined) {
                        element.html("00:00:00");
                    } else {
                        getTimeStamp().then(function(response) {
                            var timeStamp = response;
                            var timeDifference, time, hours, mins, secs;
                            var endTime = +new Date() + 1000 * 60 * scope.duration;
                            updateTimer();
                            checkTime();

                            function updateTimer() {
                                timeDifference = endTime - (+new Date());
                                if (timeDifference <= 0) {
                                    element.html("Час вичерпано");
                                } else {
                                    time = new Date(timeDifference);
                                    hours = time.getUTCHours();
                                    mins = time.getUTCMinutes();
                                    secs = time.getUTCSeconds();
                                    element.html((hours ? (twoDigits(hours) + ":") : "") + twoDigits(mins) + ":" + twoDigits(secs));
                                    $timeout(updateTimer, time.getUTCMilliseconds() + 500);
                                }
                            }

                            function checkTime() {
                                getTimeStamp().then(function (response) {
                                    if ((response.curtime - timeStamp.curtime) <= (60 * scope.duration + TIME_DELAY)) {
                                        $timeout(checkTime, 2000);
                                    } else {
                                        scope.finishTest();
                                        $state.go("user.results");
                                    }
                                });
                            }
                        });
                    }
                });
                
                function getTimeStamp() {
                    return testPlayerService.getTimeStamp().then(function(response) {
                       return response; 
                    });
                }

                function twoDigits(n) {
                    return (n <= 9 ? "0" + n : n);
                }
            }
        };

        return directive;
    }
})();