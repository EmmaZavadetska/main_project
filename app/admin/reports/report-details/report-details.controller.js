(function() {
    "use strict";

    angular.module("app.admin")
        .controller("ReportDetailsController", ReportDetailsController);

    ReportDetailsController.$inject = ["reportsService"];

    function ReportDetailsController(reportsService) {
        var vm = this;
    }
})();