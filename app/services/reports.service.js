(function() {
    "use strict";

    angular.module("app.admin")
        .factory("reportsService", reportsService);

    reportsService.$inject = ["$http", "$q", "BASE_URL", "URL", "groupsService", "testsService", "subjectsService"];

    function reportsService($http, $q, BASE_URL, URL, groupsService, testsService, subjectsService) {
        var service = {
            getSubjects: getSubjects,
            getReport: getReport,
            updateGroupsBySubject: updateGroupsBySubject,
            updateTestsBySubject: updateTestsBySubject

        };

        return service;

        function _successCallback(data) {
            console.log(data);
            return data;
        }
        function _errorCallback(response) {
            return response;
        }

        function getSubjects() {
            return subjectsService.getAllSubjects().then(_successCallback, _errorCallback);
        }

        function _uniqueItemsArray(arrayOfObjects, propertyOfObject) {
            var uniqueItemsList = [];
            for (var i = 0; i < arrayOfObjects.length; i++) {
                if(uniqueItemsList.indexOf((arrayOfObjects[i])[propertyOfObject]) === -1){
                    uniqueItemsList.push((arrayOfObjects[i])[propertyOfObject]);
                }
            }

            return uniqueItemsList;
        }

        function _getTimesTableBySubjects(subject_id) {
            console.log("_getTimesTableBySubjects");
            return $http.get(BASE_URL + "/timeTable/getTimeTablesForSubject/" + subject_id).then(_successCallback, _errorCallback);
        }

        // function _filterByProperty(item, array, propertyName) {
        //     console.log("_filterByProperty");
        //     return array.indexOf(item[propertyName]) > -1;
        // }

        function _getGroupsBySubject(arrayOfIdGroups) {
            console.log("_getGroupsBySubject");
            return groupsService.getGroups().then(function(data) {
                var groups = data;
                var groupsBySubject = groups.filter(function(item) {
                    console.log("_filterByProperty");
                    return arrayOfIdGroups.indexOf(item["group_id"]) > -1;
                });
                return groupsBySubject;
            });
        }

        function updateGroupsBySubject(subject_id) {
            console.log("updateGroupsBySubject");
            //when used serviceTimeTable replace response,response.data to data
            return _getTimesTableBySubjects(subject_id).then(function(response) {
                var uniqueIdGroups = _uniqueItemsArray(response.data, "group_id");
                return _getGroupsBySubject(uniqueIdGroups);
            });
        }

        function updateTestsBySubject(subject_id) {
            console.log("updateTestsBySubject");
            return testsService.getTestsBySubject(subject_id).then(_successCallback, _errorCallback);
        }

        function getReport(group_id, test_id) {
            
            return "Report";
        }
    }

})();