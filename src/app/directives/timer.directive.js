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
                var endTimeSaved = false;
                scope.$watch("duration", function() {
                    if (scope.duration === undefined) {
                        element.html("");
                    } else {
                        getTimeStamp().then(function(response) {
                            var timeStamp = response;
                            console.log(timeStamp);
                            var timeDifference, time, hours, mins, secs;
                            var endTime = +new Date() + 1000 * 60 * scope.duration;
                            if (endTimeSaved === false) {
                                saveEndTime(timeStamp);
                            }
                            updateTimer();
                            checkTime();
                            
                            function updateTimer() {
                                timeDifference = endTime - (+new Date());
                                if (timeDifference <= 0) {
                                    element.html("Час вичерпано");
                                    endTest();
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
                                getEndTime().then(function(response) {
                                    var endTime = response.endTime;
                                    getTimeStamp().then(function (response) {
                                        var serverTimeDiff = response.curtime - endTime;
                                        console.log(serverTimeDiff, "---", timeDifference);
                                        if (Math.abs(serverTimeDiff - timeDifference) <= TIME_DELAY) {
                                            // console.log("<<< TIME_DELAY");
                                            $timeout(checkTime, 2000);
                                        } else {
                                            // console.log(">>> TIME_DELAY");
                                            timeDifference = serverTimeDiff;
                                            $timeout(checkTime, 2000);
                                        }
                                    });
                                });
                                
                            }
                        });
                    }
                });
                
                function endTest() {
                    scope.finishTest();
                    $state.go("user.results");
                }

                function getTimeStamp() {
                    return testPlayerService.getTimeStamp().then(function(response) {
                       return response; 
                    });
                }

                function getEndTime() {
                    return testPlayerService.getEndTime().then(function(response) {
                        return response;
                    });
                }

                function saveEndTime(timeStamp) {
                    var timeForTest = {};
                    timeForTest.startTime = +new Date(timeStamp.curtime);
                    timeForTest.duration = 1000 * 60 * scope.duration;
                    timeForTest.endTime = +new Date(timeStamp.curtime) + 1000 * 60 * scope.duration;
                    console.log(timeForTest);

                    return testPlayerService.saveEndTime(angular.toJson(timeForTest)).then(function (response) {
                        endTimeSaved = true;
                        console.log("saveEndTime");
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