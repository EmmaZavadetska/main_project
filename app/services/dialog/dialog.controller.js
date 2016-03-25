(function () {
  "use strict";

    angular.module("custom.dialog").controller("dialogController", dialogController);

    dialogController.$inject = ["$uibModalInstance", "dialogData"];

    function dialogController($modalInstance, dialogData){
      var vm = this;     
      vm.data = dialogData;
      vm.return = function (button) {        
        if (button.dismiss) {          
          $modalInstance.dismiss(button.value || button.label);
        }
        else {          
          $modalInstance.close(button.value || button.label);
        }
      };
    }

})();
