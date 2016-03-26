(function() {
    "use strict";

    angular.module("app.admin")
        .controller("ReportsController", ReportsController);

    ReportsController.$inject = ["reportsService"];

    function ReportsController(reportsService) {
        var vm = this;
        vm.report = {};
        vm.reportsFormCollapsed = true;
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
        }

        function createReport() {
            reportsService.getReport(vm.report.selectedGroup_id, vm.report.selectedTest_id).then(function(data) {
            
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
            reportsService.updateGroupsBySubject(vm.report.selectedSubject_id).then(function(data) {
                vm.groupsList = data;
            });
        }

        function updateTestsBySubject() {
            reportsService.updateTestsBySubject(vm.report.selectedSubject_id).then(function(data) {
                vm.testsList = data;
            });
        }
    }
})();