(function() {
    "use strict";

    angular.module("app.user")
        .controller("UserQuestionController", UserQuestionController);

    UserQuestionController.$inject = [];

    function UserQuestionController() {
        var vm = this;
    }
})();