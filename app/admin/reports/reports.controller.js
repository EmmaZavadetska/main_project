(function() {
    "use strict";

    angular.module("app.admin")
        .controller("ReportsController", ReportsController);

    ReportsController.$inject = ["reportsService"];

    function ReportsController(reportsService) {
        var vm = this;
        vm.showReportsForm = showReportsForm;
        vm.hideReportsForm = hideReportsForm;
        vm.createReport = createReport;
        vm.updateTestsByGroup = updateTestsByGroup;
        activate();

        function activate() {
            
        }

        function showReportsForm() {
            vm.reportsFormCollapsed = false;
            vm.report = {};
        }

        function hideReportsForm() {
            vm.reportsFormCollapsed = true;
            vm.report = {};
        }

        function getGroups() {
            reportsService.getGroups().then(function(data) {
                vm.groupsList = Array.isArray(data) ?  data : [];
            });
        }
    }
})();