(function() {
    "use strict";

    angular.module("app.admin")
        .factory("reportsService", reportsService);

    reportsService.$inject = ["$http", "BASE_URL", "URL", "groupsService"];

    function reportsService($http, BASE_URL, URL, groupsService) {
        var service = {
            getGroups: getGroups(),
            getReport: getReport()

        };

        return service;

        function _successCallback(response) {
            return response.data;
        }
        function _errorCallback(response) {
            return response;
        }
        
        function getGroups() {
            return groupsService.getGroups().then(_successCallback, _errorCallback);
        }
        
        function getReport(group_id, test_id) {

            
            return "Report";
        }
    }

})();