(function() {
    "use strict";

    angular.module("app")
        .factory("authService", authService);

    authService.$inject = ["$http", "BASE_URL","URL"];

    function authService ($http, BASE_URL, URL) {
        var service = {
            login: login,
            isLogged: isLogged,
            logout: logout
        };

        return service;

        function login (credentials){

            return $http.post(BASE_URL + URL.LOGIN, credentials)
                .then(function (res){
                        return res.data;
                    },
                    function (res){
                        return res;
                    });
        }

        function isLogged(){

            return $http.get (BASE_URL + URL.IS_LOGGED)
                .then(function (res){
                        if(res.data.response === "logged") {

                            return res.data;
                        }
                    },
                    function (res){
                        
                        return res;
                    });
        }

        function logout(){
            return $http.get(BASE_URL + URL.LOGOUT)
                .then(function (res){

                        return res;
                    },
                    function (res){

                        return res;
                    });
        }
    }
})();