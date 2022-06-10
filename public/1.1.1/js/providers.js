//Factory for executing code before a route loads. Primary used to establish Login State.  
angularApp.factory("General", function ($q, $http, $rootScope, $location) {

    //initialize the factory object
    var factory = {};

    //Function to run before every secure route load
    factory.routeload = function () {

        //Create the Defered Promise Object
        var defer = $q.defer()

        //Authentication Check on Application Start
        if (localStorage.getItem('accessToken')) {

            //The User has a token in local storage, so populate the Global User Object.
            $http.get('https://skillresultsapi.azurewebsites.net/api/Account/UserObject/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
                //On Success Response from API
            }).then(function successCallback(response) {

                $rootScope.user = response.data[0];

                //console.log($rootScope.user);

                //resolve the promise and return the data
                defer.resolve();

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

                //The Token has failed, so log the user out
                localStorage.removeItem('accessToken');

                $location.path(/login/);

            });

        } else {

            //The User is not Authenticated, Redirect to the Login Page
            console.log('you are not logged in...')

            $location.path(/login/);

        }

        //Return the Promise to the caller
        return defer.promise;

    };

    //Return the Factory code
    return factory;

});

//Factory - Areas
angularApp.factory("AreaFactory", function ($q, $http) {

    //initialize the factory object
    var factory = {};

    //Create Area Function
    factory.create = function () {

        console.log('create area');

    };

    //Read Area Function
    factory.read = function () {

        console.log('read area');

    };

    //Update Area Function
    factory.update = function () {

        console.log('update area');

    };

    //Delete Area Function
    factory.delete = function (areaid) {

        //Log the Factory Status
        console.log('Delete Started');

        //Create the Defered Promise Object
        var defer = $q.defer()

        //Make a Rest Call
        $http.delete('https://skillresultsapi.azurewebsites.net/api/AreasCustoms/' + areaid, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Succsess of the REST call
        }).then(function (response) {

            //resolve the promise and return the data
            defer.resolve();

            //On Failure of the REST call
        }, function errorCallback(response) {

            //Log the Factory Status
            console.log('Delete Failed');

            //reject the promise with an error
            defer.reject(response);

        });

        //Return the Promise to the caller
        return defer.promise;

    };

    //Return the Factory code
    return factory;

});

//Factory - Categories
angularApp.factory("CategoryFactory", function ($q, $http) {

    //initialize the factory object
    var factory = {};

    //Create Category Function
    factory.create = function () {

        console.log('create category');

    };

    //Read Category Function
    factory.read = function () {

        console.log('read category');

    };

    //Update Category Function
    factory.update = function () {

        console.log('update category');

    };

    //Delete Category Function
    factory.delete = function (categoryid) {

        //Log the Factory Status
        console.log('Delete Started');

        //Create the Defered Promise Object
        var defer = $q.defer()

        //Make a Rest Call
        $http.delete('https://skillresultsapi.azurewebsites.net/api/CategoriesCustoms/' + categoryid, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Succsess of the REST call
        }).then(function (response) {

            //Make a second Rest Call
            $http.delete('https://skillresultsapi.azurewebsites.net/api/AreaCategoriesCustoms/' + categoryid, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Succsess of the REST call
            }).then(function (response) {

                //Log the Factory Status
                console.log('Delete Complete');

                //resolve the promise and return the data
                defer.resolve();

                //On Failure of the REST call
            }, function errorCallback(response) {

                //Log the Factory Status
                console.log('Delete Failed');

                //reject the promise with an error
                defer.reject(response);

            });

            //On Failure of the REST call
        }, function errorCallback(response) {

            //Log the Factory Status
            console.log('Delete Failed');

            //reject the promise with an error
            defer.reject(response);

        });

        //Return the Promise to the caller
        return defer.promise;

    };

    //Return the Factory code
    return factory;

});

//Factory - Skills
angularApp.factory("SkillFactory", function ($q, $http) {

    //initialize the factory object
    var factory = {};

    //Create Skill Function
    factory.create = function () {

        console.log('create skill');

    };

    //Read Skill Function
    factory.read = function () {

        console.log('read skill');

    };

    //Update Skill Function
    factory.update = function () {

        console.log('update skill');

    };

    //Delete Skill Function
    factory.delete = function (skillid) {

        //Log the Factory Status
        console.log('Delete Started');

        //Create the Defered Promise Object
        var defer = $q.defer()

        //Make a Rest Call
        $http.delete('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms/' + skillid, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Succsess of the REST call
        }).then(function (response) {

            //Make a second Rest Call
            $http.delete('https://skillresultsapi.azurewebsites.net/api/CategorySkillsCustoms/' + skillid, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Succsess of the REST call
            }).then(function (response) {

                //Log the Factory Status
                console.log('Delete Complete');

                //resolve the promise and return the data
                defer.resolve();

                //On Failure of the REST call
            }, function errorCallback(response) {

                //Log the Factory Status
                console.log('Delete Failed');

                //reject the promise with an error
                defer.reject(error);

            });

            //On Failure of the REST call
        }, function errorCallback(response) {

            //Log the Factory Status
            console.log('Delete Failed');

            //reject the promise with an error
            defer.reject(error);

        });

        //Return the Promise to the caller
        return defer.promise;

    };

    //Return the Factory code
    return factory;

});

//Factory - Users
angularApp.factory("UserFactory", function ($q, $http) {

    //initialize the factory object
    var factory = {};

    //Create User Function
    factory.send = function (orgusers) {

        //Create the Defered Promise Object
        var defer = $q.defer()

        angular.forEach(orgusers, function (value, key) {


            var dataObj = {
                email: value.userName,
                template: "adminSentTemplate.html",
            };

            $http.post('https://skillresultsapi.azurewebsites.net/api/authenticate', dataObj, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {

                console.log("Login Link Sent to User " + value.userName);
                //console.log(response.data);

            }, function errorCallback(response) {

                console.log("Login Link Send Failed to " + value.userName);
            });

        });

        console.log('User Factory Reached');

        //resolve the promise and return the data
        defer.resolve();
        return defer.promise;

    };

    //Create User Function
    factory.create = function () {

        console.log('create user');

    };

    //Read User Function
    factory.read = function () {

        console.log('read user');

    };

    //Update User Function
    factory.update = function () {

        console.log('update user');

    };

    //Import User Function
    factory.import = function (importedusers) {

        angular.forEach(importedusers, function (value, key) {

            var dataObj = {};

            dataObj = {
                email: value.email,
                firstname: value.firstname,
                lastname: value.lastname,
                reportsto: value.reportsto,

            };

            $http.post('https://skillresultsapi.azurewebsites.net/api/account/registeruser', dataObj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                console.log(value.email + " imported");

            }, function errorCallback(response) {

                console.log("Add Users Failed");
            });

        }, );

    };

    //Delete User Function
    factory.delete = function () {

        console.log('delete user');

    };

    //Return the Factory code
    return factory;

});
