(function() {
    "use strict";

    angular.module("app.user")
        .controller("UserSubjectsController", UserSubjectsController);

    UserSubjectsController.$inject = [];

    function UserSubjectsController() {
        var vm = this;
    }
})();