(function() {
    "use strict";

    angular.module("app.admin")
        .controller("ReportDetailsController", ReportDetailsController);

    ReportDetailsController.$inject = ["$stateParams", "reportsService"];

    function ReportDetailsController($stateParams, reportsService) {
        var vm = this;
        activate();
        
        function activate() {
            getResultsDetail($stateParams.session_id);
        }
        
        function getResultsDetail(session_id) {
            reportsService.getResultsDetail(session_id).then(function(data) {
                vm.detail = data;
            });
        }
    }
})();