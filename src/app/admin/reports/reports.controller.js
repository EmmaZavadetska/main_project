(function() {
    "use strict";

    angular.module("app.admin")
        .controller("ReportsController", ReportsController);

    ReportsController.$inject = ["reportsService"];

    function ReportsController(reportsService) {
        var vm = this;
        vm.report = {};
        vm.reportsFormCollapsed = true;
        vm.headElements = reportsService.getHeaderOfReport();
        vm.showReportsForm = showReportsForm;
        vm.hideReportsForm = hideReportsForm;
        vm.createReport = createReport;
        vm.updateSelectpickerBySubject = updateSelectpickerBySubject;
        activate();

        function activate() {
            getSubjects();
        }

        function showReportsForm() {
            vm.reportsFormCollapsed = false;
            vm.report = {};
        }

        function hideReportsForm() {
            vm.reportsFormCollapsed = true;
            vm.report = {};
            vm.groupsList = undefined;
            vm.testsList = undefined;
        }

        function createReport() {
            reportsService.getReport(vm.report.selectedGroup, vm.report.selectedTest).then(function(data) {
                vm.results = data;
            });
            hideReportsForm();
        }

        function getSubjects() {
            reportsService.getSubjects().then(function(data) {
                vm.subjectsList = data;
            });
        }

        function updateSelectpickerBySubject() {
            updateGroupsBySubject();
            updateTestsBySubject();
        }
        
        function updateGroupsBySubject() {
            reportsService.updateGroupsBySubject(vm.report.selectedSubject).then(function(data) {
                vm.groupsList = data;
            });
        }

        function updateTestsBySubject() {
            reportsService.updateTestsBySubject(vm.report.selectedSubject).then(function(data) {
                vm.testsList = data;
            });
        }
    }
})();