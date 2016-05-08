(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("AnswerController", AnswerController);

    AnswerController.$inject = ["$stateParams","answersService", "questionsService", "customDialog"];

    function AnswerController($stateParams, answersService, questionsService, customDialog) {
        var vm = this;
        vm.headElements = answersService.getHeader();
        vm.trueAnswers = answersService.getTypeOfAnswer();
        vm.formCollapsed = true;
        vm.hideForm = hideForm;
        vm.showForm = showForm;
        vm.saveAnswer = saveAnswer;
        vm.removeAnswer = removeAnswer;
        vm.image;
        activate();


        function activate (){
            answersService.getAnswersByQuestion($stateParams.question_id).then(function(data){
                if (Array.isArray(data)) {
                    vm.list = data;
                } else {
                    vm.list = [];
                }
            });

            questionsService.getOneQuestion($stateParams.question_id).then(function (data) {
                vm.currentQuestion = data[0];
                vm.questionType = questionType (vm.currentQuestion.type);
            })
        }

        function showForm(answerItem) {
            vm.formCollapsed = false;
            vm.trueAnswers[1].disabled = answersService.disableChoice(vm.list, vm.currentQuestion.type);
            vm.image = null;
            if (answerItem === undefined) {
                vm.answerItem = {};
            } else {
                vm.answerItem = answerItem;
                if (answerItem.attachment != "") {
                    vm.image = answerItem.attachment;
                }
            }
        }

        function hideForm() {
            vm.formCollapsed = true;
            vm.answerItem = {};
            vm.image = null;
        }

        function saveAnswer() {
            if (vm.image != null) {
                vm.answerItem.attachment = vm.image;
            }
            customDialog.openConfirmationDialog().then(function() {
                answersService.saveAnswer(vm.answerItem, $stateParams.question_id).then(function (data) {
                    activate();
                    hideForm();
                });
            });
        }

        function removeAnswer(answer) {
            customDialog.openDeleteDialog(answer).then(function(){
                answersService.removeAnswer(answer.answer_id).then(function (data) {
                    hideForm();
                    activate();
                });
            });
        }


        function questionType(searchValue) {
            var questionType = questionsService.getTypes()
                .filter (function (obj) {
                    return obj.VALUE === searchValue;
                });

            return questionType[0].NAME;
        }
    }
})();