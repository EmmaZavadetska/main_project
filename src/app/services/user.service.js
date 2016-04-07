(function() {
    "use strict";

    angular.module("app.user")
        .factory("userService", userService);

    userService.$inject = ["$q", "authService", "studentsService", "schedulesService", "entityService"];

    function userService($q, authService, studentsService, schedulesService, entityService) {

        var service = {
            getCurrentUser: getCurrentUser,
            getSchedules: getSchedules,
            getHeader: getHeader
        };

        return service;

        function getCurrentUser () {
            var deferred = $q.defer();
            authService.isLogged()
                .then(function (data) {
                    return data.id;
                })
                .then(function (id) {
                    studentsService.getStudentById(id).then(function (response) {
                        deferred.resolve(response);
                    })
                });

            return deferred.promise
        }

        function getSchedules (group_id) {
            var deferred = $q.defer();

            schedulesService.getSchedulesForGroup(group_id).then(function (response) {
                    return response;
                })
                .then(function (schedule) {
                    var subjectIds = _getSubjectIds(schedule);
                    entityService.getEntitiesById("Subject", subjectIds).then(function (response) {
                        response.forEach(function (elem, index) {
                            elem.event_date = schedule[index].event_date;
                            elem.enabled = _checkDate(schedule[index].event_date);
                        });

                        deferred.resolve(response);
                    })
                });

            return deferred.promise
        }

        function getHeader() {

            return ["Предмет", "Дата екзамену"];
        }

        function _getSubjectIds (array) {
            var subjectIds =[];
            array.forEach(function (item) {
                subjectIds.push(item.subject_id);
            });

            return subjectIds;
        }

        function _checkDate(date) {
            var testDate = Date.parse(date);
            var nowDate = new Date();

            return nowDate >= testDate && nowDate <= (testDate + 24*60*60*1000)
        }
    }
})();