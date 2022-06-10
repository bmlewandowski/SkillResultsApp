//User Area Controllers

angularApp.controller("user_homeCtrl", function ($scope) {

    console.log('Home Controller Processed');

});

angularApp.controller("user_skillsCtrl", function ($scope, $rootScope, $http) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};

        //Load Data Models
        $scope.loaduserskills();

    };

    //Change Row Color Based on Rating
    $scope.ratingstyle = function (value) {

        if (value.rating < 26) {
            return {
                color: "red"
            }
        }

        if (value.rating > 25 && value.rating < 51) {
            return {
                color: "orange"
            }
        }

        if (value.rating > 50 && value.rating < 75) {
            return {
                color: "blue"
            }
        }

        if (value.rating > 75) {
            return {
                color: "green"
            }
        }

    };

    //Load User Skills Function
    $scope.loaduserskills = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/UserSkills/GetUsersSkills/' + $rootScope.user.userId + "/master", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(masterdata) {


            $http.get('https://skillresultsapi.azurewebsites.net/api/UserSkills/GetUsersSkills/' + $rootScope.user.userId + "/custom", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(customdata) {

                $scope.userskills = masterdata.data.concat(customdata.data);

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    //Download CSV of Skills
    $scope.downloadcsv = function () {

        var a = document.createElement("a");
        var csv = Papa.unparse($scope.userskills);

        if (window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'userskills.csv');
        } else {

            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
            a.target = '_blank';
            a.download = 'userskills.csv';
            document.body.appendChild(a);
            a.click();
        }
    };

    $scope.initialize();

    console.log('Skills Controller Processed');

});

angularApp.controller("user_addskillsCtrl", function ($scope, $rootScope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};
        $scope.searchskills = [];
        $scope.searchtext = "";
        $scope.areasloading = false;
        $scope.categoriesloading = false;
        $scope.skillsloading = false;

        //Load Data Models
        $scope.loadsearchskills();

        //Call the Load Area Data Function to populate the view
        $scope.loadareas();
    };

    //Load Skills Function
    $scope.loadsearchskills = function () {

        var allskills = [];

        $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function (masterdata) {

            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function (customdata) {

                $scope.allskills = masterdata.data.concat(customdata.data);

                //loop through scope to 
                angular.forEach($scope.allskills, function (value, key) {
                    var skill = {
                        name: value.name,
                        value: value.name.toLowerCase(),
                        description: value.description,
                        id: value.id,
                        type: value.type
                    };
                    allskills.push(skill);
                });

                $scope.searchskills = allskills;

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
        });

    };

    //Function - Load Area Data
    $scope.loadareas = function () {

        $scope.areasloading = true;

        //Initialze the Area Model
        $scope.areas = [];

        //Make a call to get the Master Areas
        $http.get('https://skillresultsapi.azurewebsites.net/api/AreasMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.areas = response.data;

            //Make a call to the Custom Areas
            $http.get('https://skillresultsapi.azurewebsites.net/api/AreasCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Add the Custom Areas to the Areas Model
                $scope.areas = $scope.areas.concat(response.data);

                //Sort the Areas Scope
                $scope.sortObj($scope.areas);

                $scope.areasloading = false;

                //If this is the first time here, select the first Area in the List
                if ($rootScope.admin_catalog_state.currentArea == 0) {

                    console.log('First time Here:')
                    console.log('Selecting - ID: ' + $scope.areas[0].id + ' Type: ' + $scope.areas[0].type)


                    $scope.selectArea($scope.areas[0].id, $scope.areas[0].type);

                    //Otherwise, call the select Area function
                } else {

                    console.log('Navigating back:')
                    console.log('Selecting - ID: ' + $rootScope.admin_catalog_state.currentArea + ' Type: ' + $rootScope.admin_catalog_state.currentAreaType)

                    $scope.selectArea($rootScope.admin_catalog_state.currentArea, $rootScope.admin_catalog_state.currentAreaType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                //Log the Error
                console.log(response);
                $scope.areasloading = false;

            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
            $scope.areasloading = false;

        });

    };

    //Function - Load Category Data
    $scope.loadcategories = function (areaid, areatype) {

        $scope.categoriesloading = true;

        //initialize the categories
        $scope.categories = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (areatype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaMasters/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Check for Null Data
                if (!response.data.length == 0) {

                    //Populate the Category Model with the response data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    $scope.categoriesloading = false;

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //The catagory is empty, so clear the skills as well. 
                    $scope.skills = [];
                    $scope.categoriesloading = false;

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.categoriesloading = false;

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaCustoms/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Check for Null Data
                if (response.data[0]) {

                    //Populate the Category Model with the reponse data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    $scope.categoriesloading = false;

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //the custom category is empty, so clear out the skills as well
                    $scope.skills = [];
                    $scope.categoriesloading = false;

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.categoriesloading = false;

            });

        };

    };

    //Function - Load Skill Data
    $scope.loadskills = function (categoryid, categorytype) {

        $scope.skillsloading = true;

        //initialize the categories
        $scope.skills = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (categorytype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupMasters/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the response data
                $scope.skills = response.data;

                $scope.skillsloading = false;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    //Make sure there is a first skill to select
                    if ($scope.selectSkill($scope.skills[0])) {
                        $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);
                    }

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.skillsloading = false;

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupCustoms/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the reponse data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                $scope.skillsloading = false;

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.skillsloading = false;

            });

        };

    };

    //Function - Select Area
    $scope.selectArea = function (id, type) {

        //Set the Current Area Selection 
        $rootScope.admin_catalog_state.currentArea = id;
        $rootScope.admin_catalog_state.currentAreaType = type;

        //Load the categories
        $scope.loadcategories(id, type);

    };

    //Function - Select Category
    $scope.selectCategory = function (id, type) {

        $rootScope.admin_catalog_state.currentCategory = id;
        $rootScope.admin_catalog_state.currentCategoryType = type;

        //$rootScope.admin_catalog_state.currentSkill = 0;
        //$rootScope.admin_catalog_state.currentSkillType = '';

        $scope.loadskills(id, type);

    };

    //Function - Select Skill
    $scope.selectSkill = function (id, type) {

        $rootScope.admin_catalog_state.currentSkill = id;
        $rootScope.admin_catalog_state.currentSkillType = type;

    };

    //Function - Sort The Areas Model by Name
    $scope.sortObj = function (object) {

        //Sort Areas Aphabetically
        object.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    };

    $scope.initialize();

    console.log('Add Skills Controller Processed');

});

angularApp.controller("user_addskillCtrl", function ($scope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Load the Data
        $scope.loadskill();
    };

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/UserSkills/GetSelectedSkill/' + $routeParams.id + "/" + $routeParams.type, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {
            console.log(response);
            $scope.skill = response.data[0];
            //Set selected skill id and rating to 0 to disable button
            $scope.skill.rating = 0;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        var dataObj = {
            SkillId: $scope.skill.id,
            Rating: $scope.skill.rating,
            Type: $scope.skill.type
        };

        //TODO: Check for UserSkill: Add Controller Function to see IF EXISTS

        $http.post('https://skillresultsapi.azurewebsites.net/api/UserSkills', dataObj, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $location.path('/skills/');

            console.log(response);

        }, function errorCallback(response) {

            console.log("Add User Skill Failed");
        });


    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/addskills/');
    };

    $scope.initialize();

    console.log('Add Skill Area Controller Processed');

});

angularApp.controller("user_editskillCtrl", function ($scope, $http, $routeParams, $location) {

    $scope.initialize = function () {
        //Initialize the data models
        $scope.skill = {};

        //Load the Data
        $scope.loadskill();

    };

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/UserSkills/' + $routeParams.id + "/" + $routeParams.type, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.skill = response.data[0];

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        ////Make a Rest Call
        var req = {
            method: 'PUT',
            url: 'https://skillresultsapi.azurewebsites.net/api/UserSkills/' + $scope.skill.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            data: $scope.skill
        }
        console.log(req)
        $http(req)
            //On Success of the REST call
            .then(function (response) {

                $location.path('/skills/');

                //On Failure of the REST call
            }, function (response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/skills/');
    };

    $scope.initialize();

    console.log('Edit Skill Area Controller Processed');

});

angularApp.controller("user_wishlistCtrl", function ($scope, $rootScope, $http) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};

        //Load Data Models
        $scope.loaduserskills();

    };

    //Change Row Color Based on Rating
    $scope.ratingstyle = function (value) {

        if (value.rating < 26) {
            return {
                color: "red"
            }
        }

        if (value.rating > 25 && value.rating < 51) {
            return {
                color: "orange"
            }
        }

        if (value.rating > 50 && value.rating < 75) {
            return {
                color: "blue"
            }
        }

        if (value.rating > 75) {
            return {
                color: "green"
            }
        }

    };

    //Load User Skills Function
    $scope.loaduserskills = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/UserWishlists/GetUsersWishlists/' + $rootScope.user.userId + "/master", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(masterdata) {


            $http.get('https://skillresultsapi.azurewebsites.net/api/UserWishlists/GetUsersWishlists/' + $rootScope.user.userId + "/custom", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(customdata) {

                $scope.userskills = masterdata.data.concat(customdata.data);

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    //Download CSV of Wishlist
    $scope.downloadcsv = function () {

        var a = document.createElement("a");
        var csv = Papa.unparse($scope.userskills);

        if (window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'wishlist.csv');
        } else {

            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
            a.target = '_blank';
            a.download = 'wishlist.csv';
            document.body.appendChild(a);
            a.click();
        }
    };

    $scope.initialize();

    console.log('Wishlist Controller Processed');


});

angularApp.controller("user_addwishlistsCtrl", function ($scope, $rootScope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};
        $scope.searchskills = [];
        $scope.searchtext = "";

        //Load Data Models
        $scope.loadsearchskills();

        //Call the Load Area Data Function to populate the view
        $scope.loadareas();
    };

    //Load Skills Function
    $scope.loadsearchskills = function () {

        var allskills = [];

        $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function (masterdata) {

            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function (customdata) {

                $scope.allskills = masterdata.data.concat(customdata.data);

                //loop through scope to 
                angular.forEach($scope.allskills, function (value, key) {
                    var skill = {
                        name: value.name,
                        value: value.name.toLowerCase(),
                        description: value.description,
                        id: value.id,
                        type: value.type
                    };
                    allskills.push(skill);
                });

                $scope.searchskills = allskills;

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
        });

    };

    //Function - Load Area Data
    $scope.loadareas = function () {

        //Initialze the Area Model
        $scope.areas = [];

        //Make a call to get the Master Areas
        $http.get('https://skillresultsapi.azurewebsites.net/api/AreasMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.areas = response.data;

            //Make a call to the Custom Areas
            $http.get('https://skillresultsapi.azurewebsites.net/api/AreasCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Add the Custom Areas to the Areas Model
                $scope.areas = $scope.areas.concat(response.data);

                //Sort the Areas Scope
                $scope.sortObj($scope.areas);

                //If this is the first time here, select the first Area in the List
                if ($rootScope.admin_catalog_state.currentArea == 0) {

                    console.log('First time Here:')
                    console.log('Selecting - ID: ' + $scope.areas[0].id + ' Type: ' + $scope.areas[0].type)


                    $scope.selectArea($scope.areas[0].id, $scope.areas[0].type);

                    //Otherwise, call the select Area function
                } else {

                    console.log('Navigating back:')
                    console.log('Selecting - ID: ' + $rootScope.admin_catalog_state.currentArea + ' Type: ' + $rootScope.admin_catalog_state.currentAreaType)

                    $scope.selectArea($rootScope.admin_catalog_state.currentArea, $rootScope.admin_catalog_state.currentAreaType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                //Log the Error
                console.log(response);

            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function - Load Category Data
    $scope.loadcategories = function (areaid, areatype) {

        //initialize the categories
        $scope.categories = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (areatype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaMasters/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Check for Null Data
                if (!response.data.length == 0) {

                    //Populate the Category Model with the response data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //The catagory is empty, so clear the skills as well. 
                    $scope.skills = [];

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaCustoms/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Check for Null Data
                if (response.data[0]) {

                    //Populate the Category Model with the reponse data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //the custom category is empty, so clear out the skills as well
                    $scope.skills = [];

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

        };

    };

    //Function - Load Skill Data
    $scope.loadskills = function (categoryid, categorytype) {

        //initialize the categories
        $scope.skills = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (categorytype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupMasters/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the response data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupCustoms/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the reponse data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);

            });

        };

    };

    //Function - Select Area
    $scope.selectArea = function (id, type) {

        //Set the Current Area Selection 
        $rootScope.admin_catalog_state.currentArea = id;
        $rootScope.admin_catalog_state.currentAreaType = type;

        //Load the categories
        $scope.loadcategories(id, type);

    };

    //Function - Select Category
    $scope.selectCategory = function (id, type) {

        $rootScope.admin_catalog_state.currentCategory = id;
        $rootScope.admin_catalog_state.currentCategoryType = type;

        //$rootScope.admin_catalog_state.currentSkill = 0;
        //$rootScope.admin_catalog_state.currentSkillType = '';

        $scope.loadskills(id, type);

    };

    //Function - Select Skill
    $scope.selectSkill = function (id, type) {

        $rootScope.admin_catalog_state.currentSkill = id;
        $rootScope.admin_catalog_state.currentSkillType = type;

    };

    //Function - Sort The Areas Model by Name
    $scope.sortObj = function (object) {

        //Sort Areas Aphabetically
        object.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    };

    $scope.initialize();

    console.log('Add Wishlists Controller Processed');

});

angularApp.controller("user_addwishlistCtrl", function ($scope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Load the Data
        $scope.loadskill();
    };

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/UserWishlists/GetSelectedWishlist/' + $routeParams.id + "/" + $routeParams.type, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {
            console.log(response);
            $scope.skill = response.data[0];
            //Set selected skill id and rating to 0 to disable button
            $scope.skill.rating = 0;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        var dataObj = {
            SkillId: $scope.skill.id,
            Rating: $scope.skill.rating,
            Priority: $scope.skill.priority,
            Type: $scope.skill.type
        };

        $http.post('https://skillresultsapi.azurewebsites.net/api/UserWishlists', dataObj, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $location.path('/wishlist/');

            console.log(response);

        }, function errorCallback(response) {

            console.log("Add User Wishlist Failed");
        });


    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/addskills/');
    };

    $scope.initialize();

    console.log('Add Wishlist Area Controller Processed');

});

angularApp.controller("user_editwishlistCtrl", function ($scope, $http, $routeParams, $location) {

    $scope.initialize = function () {
        //Initialize the data models
        $scope.skill = {};

        //Load the Data
        $scope.loadskill();

    };

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/UserWishlists/' + $routeParams.id + "/" + $routeParams.type, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.skill = response.data[0];

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        ////Make a Rest Call
        var req = {
            method: 'PUT',
            url: 'https://skillresultsapi.azurewebsites.net/api/UserWishlists/' + $scope.skill.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            data: $scope.skill
        }
        console.log(req)
        $http(req)
            //On Success of the REST call
            .then(function (response) {

                $location.path('/wishlist/');

                //On Failure of the REST call
            }, function (response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/wishlist/');
    };

    $scope.initialize();

    console.log('Edit Wishlist Area Controller Processed');

});

angularApp.controller("user_educationCtrl", function ($scope, $rootScope, $http) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.usereducations = {};
        $scope.usercerts = {};

        //Load Data Models
        $scope.loadusereducation();
        $scope.loadusercerts();

    };

    //Load User Skills Function
    $scope.loadusereducation = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/GetDegreesByUser/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            $scope.usereducations = response.data;
            console.log($scope.usereducations);

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };
    
    //Load User Certs Function
    $scope.loadusercerts = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/GetCertsByUser/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            $scope.usercerts = response.data;
            console.log($scope.usercerts);

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    $scope.initialize();

    console.log('Education Controller Processed');

});

angularApp.controller("user_adddegreeCtrl", function ($scope, $http, $location, $rootScope) {

    //Function to Initialize the Controller
    $scope.initialize = function () {

        $scope.forms = {};

        //Initialize View State
        $scope.viewloading = false;

        //Initialize the Form State
        $scope.degreeformState = {
            institution_disabled: true,
            institutionCustom_hidden: true,
            degreetype_disabled: true
        };

        //Initalize Data Models
        $scope.degreeformData = {
            state: '',
            institution: '',
            otherinstitution: false,
            otherinstitutiondesc: '',
            degreetype: '',
            degreelevel: '',
            major: '',
            othermajor: false,
            othermajordesc: '',
            minor: '',
            otherminor: false,
            otherminordesc: '',
            completed: true,
            completiondate: '',
        };

        $scope.institutions = [];
        $scope.fields = [];

        //Load Form Data
        $scope.states = $rootScope.states;
        $scope.loaddegreelevels();
        $scope.loaddegreetypes();
        $scope.loadfields();

    };

    //Function that runs everytime a dropdown item is selected for US State
    $scope.selectState = function () {
        $scope.loadInstitutions($scope.degreeformData.state);
        $scope.degreeformState.institution_disabled = false;
        $scope.degreeformData.otherinstitution = false;
        $scope.degreeformData.institution = '';
        $scope.degreeformState.institutionCustom_hidden = true;
    };

    //Function that runs everytime a custom institution is selected
    $scope.selectCustomInstitution = function () {
        $scope.degreeformData.institution = 'custom';
        $scope.degreeformData.otherinstitution = true;
        $scope.degreeformState.institutionCustom_hidden = false;
    };

    //Function that runs everytime a custom institution modified
    $scope.clearcustomInstitution = function () {
        $scope.degreeformState.institutionCustom_hidden = true;
        $scope.degreeformData.otherinstitution = false;
        $scope.degreeformData.otherinstitutiondesc = '';

    };

    //Function that runs everytime a degree level is selected
    $scope.selectDegreelevel = function () {
        $scope.degreeformState.degreetype_disabled = false;
        $scope.degreeformData.degreetype = '';
    };

    //Function to load Institutions by State
    $scope.loadInstitutions = function (stateID) {

        //Clear any previous data
        $scope.institutions = [];

        //Make a call to get Institutions
        $http.get('https://skillresultsapi.azurewebsites.net/api/GetInstitutionsByState/' + stateID, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Institutions ot the Scope
            $scope.institutions = response.data;

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Load Degree Levels
    $scope.loaddegreelevels = function () {

        //Make a call to get Degree Levels
        $http.get('https://skillresultsapi.azurewebsites.net/api/DegreeLevels', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.degreelevels = response.data;

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Load Degree Types
    $scope.loaddegreetypes = function () {

        //Make a call to get Degree Types
        $http.get('https://skillresultsapi.azurewebsites.net/api/DegreeTypes/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.degreetypes = response.data;

            console.log(response);

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Make a call to load Major/Minor Fields
    $scope.loadfields = function () {

        //Make a call to get Degree Levels
        $http.get('https://skillresultsapi.azurewebsites.net/api/Fields', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.fields = response.data;

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Submit Form
    $scope.submitform = function () {

        //Map the Form Data to the Submit Data Format
        $scope.degreesubmitData = {
            institution: $scope.degreeformData.institution.id,
            otherinstitution: $scope.degreeformData.otherinstitution,
            otherinstitutiondesc: $scope.degreeformData.otherinstitutiondesc,
            degreelevel: $scope.degreeformData.degreelevel,
            degreetype: $scope.degreeformData.degreetype,
            major: $scope.degreeformData.major.id,
            othermajor: $scope.degreeformData.othermajor,
            othermajordesc: $scope.degreeformData.othermajordesc,
            minor: $scope.degreeformData.minor.id,
            otherminor: $scope.degreeformData.otherminor,
            otherminordesc: $scope.degreeformData.otherminordesc,
            completed: $scope.degreeformData.completed,
            completiondate: $scope.degreeformData.completiondate
        };

        console.log($scope.degreesubmitData);

        $http.post('https://skillresultsapi.azurewebsites.net/api/UserEducations', $scope.degreesubmitData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $location.path('/education/');

            console.log(response);

        }, function errorCallback(response) {

            console.log("Add User Skill Failed");

        });

    };

    $scope.initialize();

});

angularApp.controller("user_addcertificationCtrl", function ($scope, $http, $location, $rootScope) {


    //Function to Initialize the Controller
    $scope.initialize = function () {

        //Initialize View State
        $scope.viewloading = false;

        //Initialize the Form State
        $scope.certformState = {
            customcertname_hidden: true,
            customcertname_hidden: true,
            customcertname_hidden: true,
        };

        //Initalize Data Models
        
        $scope.certformData = {
            CertId:0,
            Cert:'',
            CertOther:false,
            CertOtherName:'',
            CertOtherDescription:'',
            CertOtherAwardedby:'',
            Date:''
        };

        $scope.certifications = [];

        //Load Form Data
        $scope.loadcertifications();

    };

    //Function that runs everytime a custom cert is selected
    $scope.selectCustomInstitution = function () {
        $scope.certformData.CertOther=true;
        $scope.certformData.Cert = 'custom';
    };

    //Function that runs everytime a custom cert modified
    $scope.clearcustomInstitution = function () {
//        $scope.degreeformState.institutionCustom_hidden = true;
//        $scope.degreeformData.otherinstitution = false;
//        $scope.degreeformData.otherinstitutiondesc = '';
    };

    //Function to Load Certifications Levels
    $scope.loadcertifications = function () {

        //Make a call to get Degree Levels
        $http.get('https://skillresultsapi.azurewebsites.net/api/certifications', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.certifications = response.data;
            console.log($scope.certifications);

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Submit Form
    $scope.submitform = function () {
        
        $scope.certformData.CertId = $scope.certformData.Cert.id;

        console.log($scope.certformData);

        $http.post('https://skillresultsapi.azurewebsites.net/api/UserCertifications', $scope.certformData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $location.path('/education/');

            console.log(response);

        }, function errorCallback(response) {

            console.log("Add User Skill Failed");

        });

    };

    $scope.initialize();


});

angularApp.controller("user_editeducationCtrl", function ($scope, $http) {

    $scope.initialize = function () {


    };

    $scope.initialize();

    console.log('Edit Education Controller Processed');

});

angularApp.controller("user_reportsCtrl", function ($scope) {

    console.log('Reports Controller Processed');

});

angularApp.controller("user_searchCtrl", function ($scope, $http, $location) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.searchtext = "";
        $scope.skills = [];
        $scope.users = [];
        //Load Data Models
        $scope.loadskills();
        $scope.loadusers();
    };

    //Load Skills Function
    $scope.loadskills = function () {

        var allskills = [];

        $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function (masterdata) {

            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function (customdata) {

                $scope.allskills = masterdata.data.concat(customdata.data);

                //loop through scope to 
                angular.forEach($scope.allskills, function (value, key) {
                    var skill = {
                        name: value.name,
                        value: value.name.toLowerCase(),
                        description: value.description,
                        id: value.id,
                        type: value.type
                    };
                    allskills.push(skill);
                });

                $scope.skills = allskills;

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
        });

    };

    $scope.loadusers = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/OrganizationUsers/GetOrganizationsUsers', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
            //On Success Response from API
        }).then(function successCallback(response) {

            $scope.users = response.data;

            //on Fail, log the failure data.
        }, function errorCallback(response) {


            console.log(response);

        });

    };

    $scope.addskill = function (id, type) {

        $location.path('/addskill/' + id + '/' + type);

    };

    $scope.viewuser = function (id) {

        $location.path('/user/' + id);
    };

    $scope.initialize();

    console.log('Search Controller Processed');

});

angularApp.controller("user_settingsCtrl", function ($scope) {

    console.log('User Settings Controller Processed');

});

angularApp.controller("user_helpCtrl", function ($scope) {

    console.log('User Help Controller Processed');

});

angularApp.controller("user_viewCtrl", function ($scope, $http, $routeParams) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.userskills = {};
        $scope.userwishlists = {};
        $scope.viewuser = {};

        //Load Data Models
        $scope.loaduser();
        $scope.loaduserskills();
        $scope.loaduserwishlists();

    };

    //Change Row Color Based on Rating
    $scope.ratingstyle = function (value) {

        if (value.rating < 26) {
            return {
                color: "red"
            }
        }

        if (value.rating > 25 && value.rating < 51) {
            return {
                color: "orange"
            }
        }

        if (value.rating > 50 && value.rating < 75) {
            return {
                color: "blue"
            }
        }

        if (value.rating > 75) {
            return {
                color: "green"
            }
        }

    };

    //Load User Object
    $scope.loaduser = function (id) {

        $http.get('https://skillresultsapi.azurewebsites.net/api/Authenticate/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(viewuser) {

            $scope.viewuser = viewuser.data[0];

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    //Load User Skills Function
    $scope.loaduserskills = function (id) {

        $http.get('https://skillresultsapi.azurewebsites.net/api/UserSkills/GetUsersSkills/' + $routeParams.id + "/master", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(masterdata) {


            $http.get('https://skillresultsapi.azurewebsites.net/api/UserSkills/GetUsersSkills/' + $routeParams.id + "/custom", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(customdata) {

                $scope.userskills = masterdata.data.concat(customdata.data);

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    //Load User Wishlists
    $scope.loaduserwishlists = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/UserWishlists/GetUsersWishlists/' + $routeParams.id + "/master", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(masterdata) {


            $http.get('https://skillresultsapi.azurewebsites.net/api/UserWishlists/GetUsersWishlists/' + $routeParams.id + "/custom", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(customdata) {

                $scope.userwishlists = masterdata.data.concat(customdata.data);

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    $scope.initialize();

    console.log('View User Controller Processed');

});

//Report Controllers

angularApp.controller("reports_usersbyskillCtrl", function ($scope, $http, $timeout) {

    //Function to Initialze the Controller and View. 
    $scope.initialize = function () {

        //Initialize View State
        $scope.viewloading = true;
        $scope.reportloading = 'nodata';
        //Initalize Data Models
        $scope.searchtext = "";
        $scope.skills = [];
        $scope.reportdata = [];
        //Load Data Models
        $scope.loadskills();
    };

    //Fuction to load data for Report Parameters
    $scope.loadskills = function () {

        var allskills = [];

        $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function (masterdata) {

            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function (customdata) {

                $scope.allskills = masterdata.data.concat(customdata.data);

                //loop through scope to 
                angular.forEach($scope.allskills, function (value, key) {
                    var skill = {
                        name: value.name,
                        value: value.name.toLowerCase(),
                        description: value.description,
                        id: value.id,
                        type: value.type
                    };
                    allskills.push(skill);
                });

                $scope.skills = allskills;


                //Wait for a moment and then...
                $timeout(function () {
                    $scope.viewloading = false;
                }, 800);



                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
        });

    };

    //Function to Get Report Data
    $scope.getreportdata = function (skillid) {

        $scope.reportloading = 'loading';

        $http.get('https://skillresultsapi.azurewebsites.net/api/reports/usersbyskill/' + skillid, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $scope.reportdata = response.data;

            $scope.reportloading = 'loaded';

            console.log($scope.reportdata);


        }, function errorCallback(response) {

            console.log(response);
            $scope.reportloading = 'loaded';

        });

    };

    //Download CSV of Report
    $scope.downloadcsv = function () {

        var a = document.createElement("a");
        var csv = Papa.unparse($scope.reportdata);

        if (window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'report_usersbyskill.csv');
        } else {

            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
            a.target = '_blank';
            a.download = 'report_usersbyskill.csv';
            document.body.appendChild(a);
            a.click();
        }
    };

    //Initialize the Controller
    $scope.initialize();

});

angularApp.controller("reports_skillsbyorganizationCtrl", function ($scope, $http, $timeout) {

    //Function to Initialze the Controller and View. 
    $scope.initialize = function () {

        //Initalize Data Models
        $scope.reportloading = true;
        $scope.reportdata = [];

        $scope.getreportdata();

    };

    //Function to Get Report Data
    $scope.getreportdata = function (skillid) {

        $http.get('https://skillresultsapi.azurewebsites.net/api/reports/organizationskills/master', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(masterdata) {


            $http.get('https://skillresultsapi.azurewebsites.net/api/reports/organizationskills/custom', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(customdata) {

                $scope.reportdata = masterdata.data.concat(customdata.data);
                $scope.reportloading = false;
                console.log($scope.reportdata);

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);
                $scope.reportloading = false;

            });

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);
            $scope.reportloading = false;

        });

    };

    //Download CSV of Report
    $scope.downloadcsv = function () {

        var a = document.createElement("a");
        var csv = Papa.unparse($scope.reportdata);

        if (window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'report_orgskills.csv');
        } else {

            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
            a.target = '_blank';
            a.download = 'report_orgskills.csv';
            document.body.appendChild(a);
            a.click();
        }
    };

    //Initialize the Controller
    $scope.initialize();

});

angularApp.controller("reports_wishlistsbyorganizationCtrl", function ($scope, $http, $timeout) {

    //Function to Initialze the Controller and View. 
    $scope.initialize = function () {

        //Initalize Data Models
        $scope.reportloading = true;
        $scope.reportdata = [];

        $scope.getreportdata();

    };

    //Function to Get Report Data
    $scope.getreportdata = function (skillid) {

        $http.get('https://skillresultsapi.azurewebsites.net/api/reports/orgwishlist/master', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(masterdata) {


            $http.get('https://skillresultsapi.azurewebsites.net/api/reports/orgwishlist/custom', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(customdata) {

                $scope.reportdata = masterdata.data.concat(customdata.data);
                $scope.reportloading = false;
                console.log($scope.reportdata);

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);
                $scope.reportloading = false;

            });

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);
            $scope.reportloading = false;

        });

    };

    //Download CSV of Report
    $scope.downloadcsv = function () {

        var a = document.createElement("a");
        var csv = Papa.unparse($scope.reportdata);

        if (window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'report_wishlistbyorg.csv');
        } else {

            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
            a.target = '_blank';
            a.download = 'report_wishlistbyorg.csv';
            document.body.appendChild(a);
            a.click();
        }
    };

    //Initialize the Controller
    $scope.initialize();

});

//Admin Area Controllers

angularApp.controller("admin_homeCtrl", function ($scope) {

    console.log('Admin Home Controller Processed');

});

angularApp.controller("admin_usersCtrl", function ($scope, $http, $location, $mdDialog, $q, UserFactory) {

    //Function to Initialze the Controller
    $scope.initialize = function () {

        $scope.orgusers = {};
        $scope.userlimit = {};
        $scope.importedusers = [];
        $scope.uploadstatus = false;
        $scope.currenttab = 0;
        $scope.getmaxusers();
        $scope.getorgusers();
    };

    //Function
    $scope.getorgusers = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/organizationusers/GetOrganizationsUsers/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $scope.orgusers = response.data;
            console.log($scope.orgusers);
            //$scope.orgid = $scope.orgusers[0].orgId;

        }, function errorCallback(response) {

            console.log("Failed");
        });
    };

    //Function
    $scope.getmaxusers = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/organizationusers/GetOrganizationMaxUsers/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $scope.userlimit = response.data;

        }, function errorCallback(response) {

            console.log("Failed");
        });
    };

    //Function
    $scope.maxusers = function () {
        //TODO: Tie to max users in database 
        if ($scope.orgusers.length > $scope.userlimit) {

            return true;

        } else {

            return false;

        }
    };

    //Function
    $scope.showConfirmAll = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Send Link to All?')
            .textContent('Authentication Login Links will be sent ALL users.')
            .ariaLabel('Send All Login Links')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        //Decided Confirm
        $mdDialog.show(confirm).then(function () {
            //Send Login Link to User
            console.log('Confirm Clicked');

            //Call the Factory
            UserFactory.send($scope.orgusers)

                //User send succeeded
                .then(function () {

                    //Log the Success
                    console.log('Factory Call Succeeded');
                    $scope.emailAllSuccess = true;

                })

                //User send failed
                .catch(function (error) {

                    //Log the Error
                    console.log('Factory Call Failed');
                    console.log(error.message);

                });

            //Decided Cancel
        }, function () {

            console.log('Cancel Clicked');

        });
    };

    //Function
    $scope.showConfirmSingle = function (usremail) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Send Link?')
            .textContent('An Authentication Login Link will be sent to the user.')
            .ariaLabel('Send Login Link')
            //.targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        //Decided Confirm
        $mdDialog.show(confirm).then(function () {
            //Send Login Link to User
            $scope.sendlogin(usremail);

            //Decided Cancel
        }, function () {
            console.log('Cancelled');
        });
    };

    //Function
    $scope.sendlogin = function (usremail) {

        var dataObj = {
            email: usremail,
            template: "adminSentTemplate.html",
        };

        $http.post('https://skillresultsapi.azurewebsites.net/api/authenticate', dataObj, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function (response) {

            console.log("Login Link Sent to User");
            //console.log(response.data);

        }, function errorCallback(response) {

            console.log("Login Failed");
        });

    };

    //Function
    $scope.fileloaded = function () {
        console.log('loaded');
        $scope.readcsv();
    };

    //Function
    $scope.readcsv = function () {

        $scope.importedusers = [];

        var filename = document.getElementById("csvImport");
        if (filename.value.length < 1) {
            //($scope.warning = "Please upload a file");
        } else {

            var file = filename.files[0];
            if (filename.files[0]) {

                var reader = new FileReader();
                reader.onload = function (e) {

                    //parse carriage return csv as json array
                    var data = Papa.parse(e.target.result, {
                        //call oncomplete as config option
                        complete: function (results, file) {
                            //apply results to scope
                            $scope.importedusers = results.data;
                            $scope.uploadstatus = true;
                        },
                        header: true
                    });

                    //show import button
                    $scope.divconfirm = false;
                    //force digest
                    $scope.$apply();

                }
                //read the file import and trigger the onload
                reader.readAsText(filename.files[0]);

            }

            return false;
        }

    };

    //Function
    $scope.importusers = function () {
        UserFactory.import($scope.importedusers);
        $scope.initialize();
    };

    //Download CSV of Organization Users
    $scope.downloadcsv = function () {

        var a = document.createElement("a");
        var csv = Papa.unparse($scope.orgusers);

        if (window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'orgusers.csv');
        } else {

            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
            a.target = '_blank';
            a.download = 'orgusers.csv';
            document.body.appendChild(a);
            a.click();
        }
    };

    //Call the Function to Initialize the Controlller
    $scope.initialize();

});

angularApp.controller("admin_edituserCtrl", function ($scope, $http, $routeParams, $location) {

    //Initialize the data models
    $scope.initialize = function () {

        $scope.edituser = {};
        $scope.loaduser();

    };

    //Function to Load the Form Data
    $scope.loaduser = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/OrganizationUsers/GetOrgUser/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.edituser = response.data;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('https://skillresultsapi.azurewebsites.net/api/OrganizationUsers/' + $routeParams.id, $scope.edituser, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $location.path('/adminusers/');

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminusers/');
    };

    $scope.initialize();

    console.log('Edit User Controller Processed');

});

angularApp.controller("admin_adduserCtrl", function ($scope, $http, $routeParams, $location) {

    //Initialize the controller
    $scope.initialize = function () {
        $scope.user = {};
    };

    //Function to Add a User
    $scope.submit = function () {

        console.log($scope.user);

        var dataObj = {
            Email: $scope.user.email,
            FirstName: $scope.user.firstname,
            LastName: $scope.user.lastname,
            ReportsTo: $scope.user.reportsto,

        };

        $http.post('https://skillresultsapi.azurewebsites.net/api/account/registeruser', dataObj, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            console.log(response);
            $location.path('/adminusers/');

        }, function errorCallback(response) {

            console.log("Add User Failed");
        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminusers/');
    };

    $scope.initialize();

});

angularApp.controller("admin_importCtrl", function ($scope, $http, $location, $mdDialog, $q, UserFactory) {

    $scope.initialize = function () {

        $scope.orgusers = {};
        $scope.userlimit = {};
        $scope.importedusers = [];
        $scope.divconfirm = true;
        $scope.getmaxusers();
        $scope.getorgusers();
        $scope.import = {};
        $scope.import.type = "emailonly";

    };

    $scope.fileloaded = function () {
        console.log('loaded');
    };

    $scope.getorgusers = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/organizationusers/GetOrganizationsUsers/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $scope.orgusers = response.data;
            //$scope.orgid = $scope.orgusers[0].orgId;

        }, function errorCallback(response) {

            console.log("Failed");
        });
    };

    $scope.getmaxusers = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/organizationusers/GetOrganizationMaxUsers/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $scope.userlimit = response.data;

        }, function errorCallback(response) {

            console.log("Failed");
        });
    };

    $scope.maxusers = function () {
        //TODO: Tie to max users in database 
        if ($scope.orgusers.length > $scope.userlimit) {

            return true;

        } else {

            return false;

        }
    };

    $scope.readcsv = function (form) {

        $scope.importedusers = [];

        var filename = document.getElementById("csvImport");
        if (filename.value.length < 1) {
            //($scope.warning = "Please upload a file");
        } else {

            var file = filename.files[0];
            if (filename.files[0]) {

                var reader = new FileReader();
                reader.onload = function (e) {

                    //user comma seperated list of email addresses as import and validate
                    if ($scope.import.type == "emailonly") {

                        var rows = e.target.result.split("\n");
                        for (var i = 0; i < rows.length; i++) {

                            var cells = rows[i].split(",");
                            for (var j = 0; j < cells.length; j++) {

                                //make sure email isn't empty
                                if (cells[j].length > 5) {

                                    //trim whitespace
                                    var useremail = cells[j].trim();

                                    //make sure it is valid email address
                                    var regex = /^.+@.+\..+$/;

                                    if (regex.test(useremail)) {
                                        var regextest = false;
                                    } else {
                                        var regextest = true;
                                    }

                                    var impuser = {
                                        id: i,
                                        email: useremail,
                                        valid: regextest
                                    };

                                    //push user information to scope
                                    $scope.importedusers.push(impuser);

                                    //force digest
                                    $scope.$apply();

                                }
                            }
                        }
                    }

                    //otherwise use the fully populated comma seperated carriage return array for import
                    else {

                        //parse carriage return csv as json array
                        var data = Papa.parse(e.target.result, {
                            //call oncomplete as config option
                            complete: function (results, file) {
                                //apply results to scope
                                $scope.importedusers = results.data;
                            },
                            header: true
                        });

                    }

                    //show import button
                    $scope.divconfirm = false;
                    //force digest
                    $scope.$apply();

                }
                //read the file import and trigger the onload
                reader.readAsText(filename.files[0]);

            }

            return false;
        }

    };

    $scope.submit = function () {

        UserFactory.import($scope.importedusers, $scope.import.type);
        $location.path('/adminusers/');
    };

    $scope.cancel = function () {
        $location.path('/adminusers/');
    };

    $scope.initialize();

    console.log('Admin Users Controller Processed');

});

angularApp.controller("admin_skillsCtrl", function ($scope, $rootScope, $http) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.areasloading = false;
        $scope.categoriesloading = false;
        $scope.skillsloading = false;

        //Call the Load Area Data Function to populate the view
        $scope.loadareas();

    };

    //Function - Load Area Data
    $scope.loadareas = function () {

        $scope.areasloading = true;

        //Initialze the Area Model
        $scope.areas = [];

        //Make a call to get the Master Areas
        $http.get('https://skillresultsapi.azurewebsites.net/api/AreasMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.areas = response.data;

            //Make a call to the Custom Areas
            $http.get('https://skillresultsapi.azurewebsites.net/api/AreasCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Add the Custom Areas to the Areas Model
                $scope.areas = $scope.areas.concat(response.data);

                //Sort the Areas Scope
                $scope.sortObj($scope.areas);
                $scope.areasloading = false;

                console.log('Area Model Loaded');


                //If this is the first time here, select the first Area in the List
                if ($rootScope.admin_catalog_state.currentArea == 0) {

                    console.log('First time Here:')
                    console.log('Selecting - ID: ' + $scope.areas[0].id + ' Type: ' + $scope.areas[0].type)


                    $scope.selectArea($scope.areas[0].id, $scope.areas[0].type);

                    //Otherwise, call the select Area function
                } else {

                    console.log('Navigating back:')
                    console.log('Selecting - ID: ' + $rootScope.admin_catalog_state.currentArea + ' Type: ' + $rootScope.admin_catalog_state.currentAreaType)

                    $scope.selectArea($rootScope.admin_catalog_state.currentArea, $rootScope.admin_catalog_state.currentAreaType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                //Log the Error
                console.log(response);
                $scope.areasloading = false;

            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
            $scope.areasloading = false;

        });

    };

    //Function - Load Category Data
    $scope.loadcategories = function (areaid, areatype) {

        $scope.categoriesloading = true;

        //initialize the categories
        $scope.categories = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (areatype == "master") {

            console.log('Parent Area is Master - Loading Master Catagories (plus any customs added to the master area)')

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaMasters/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                console.log(response.data.length);

                //Check for Null Data
                if (!response.data.length == 0) {

                    //Populate the Category Model with the response data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    $scope.categoriesloading = false;

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //The catagory is empty, so clear the skills as well. 
                    $scope.skills = [];
                    $scope.categoriesloading = false;

                };



                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.categoriesloading = false;

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            console.log('Parent Area is Custom - Loading Custom Catagories')

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaCustoms/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                console.log(response.data);

                //Check for Null Data
                if (response.data[0]) {

                    console.log('catagory not null');

                    //Populate the Category Model with the reponse data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    $scope.categoriesloading = false;

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    console.log('catagory is null');
                    $scope.categoriesloading = false;

                    //the custom category is empty, so clear out the skills as well
                    $scope.skills = [];

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.categoriesloading = false;

            });

        };

    };

    //Function - Load Skill Data
    $scope.loadskills = function (categoryid, categorytype) {

        $scope.skillsloading = true;

        //initialize the categories
        $scope.skills = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (categorytype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupMasters/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the response data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                $scope.skillsloading = false;

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    //Make sure there is a first skill to select
                    if ($scope.selectSkill($scope.skills[0])) {
                        $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);
                    }

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.skillsloading = false;

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupCustoms/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the reponse data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                $scope.skillsloading = false;

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.skillsloading = false;

            });

        };

    };

    //Function - Select Area
    $scope.selectArea = function (id, type) {

        //Set the Current Area Selection 
        $rootScope.admin_catalog_state.currentArea = id;
        $rootScope.admin_catalog_state.currentAreaType = type;

        //Load the categories
        $scope.loadcategories(id, type);

    };

    //Function - Select Category
    $scope.selectCategory = function (id, type) {

        console.log('Catagory Selected');

        $rootScope.admin_catalog_state.currentCategory = id;
        $rootScope.admin_catalog_state.currentCategoryType = type;

        //$rootScope.admin_catalog_state.currentSkill = 0;
        //$rootScope.admin_catalog_state.currentSkillType = '';

        $scope.loadskills(id, type);

    };

    //Function - Select Skill
    $scope.selectSkill = function (id, type) {

        $rootScope.admin_catalog_state.currentSkill = id;
        $rootScope.admin_catalog_state.currentSkillType = type;

    };

    //Function - Sort The Areas Model by Name
    $scope.sortObj = function (object) {

        //Sort Areas Aphabetically
        object.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    };

    $scope.initialize();

    console.log('Admin Skills Controller Processed');

});

angularApp.controller("admin_addareaCtrl", function ($scope, $http, $location) {

    $scope.initialize = function () {

        //Initialize the data models
        $scope.area = {
            Type: "custom",
            Description: ''
        };

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Set Created date
        $scope.area.Created = new Date();

        //Make a Rest Call
        $http.post('https://skillresultsapi.azurewebsites.net/api/AreasCustoms/', $scope.area, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.area = response.data;

            $location.path('/adminskills/');

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    $scope.initialize();

    console.log('Admin Add Area Controller Processed');

});

angularApp.controller("admin_editareaCtrl", function ($scope, $http, $routeParams, $location) {


    $scope.initialize = function () {

        //Initialize the data models
        $scope.area = {};

        //Load the Data
        $scope.loadarea();
    };

    //Function to Load the Form Data
    $scope.loadarea = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/AreasCustoms/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.area = response.data;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('https://skillresultsapi.azurewebsites.net/api/AreasCustoms/' + $routeParams.id, $scope.area, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $location.path('/adminskills/');

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    $scope.initialize();

    console.log('Admin Edit Area Controller Processed');

});

angularApp.controller("admin_deleteareaCtrl", function ($scope, $http, $routeParams, SkillFactory, CategoryFactory, AreaFactory) {

    //Looping Function to populate all the skills connected with each category
    $scope.populateSkills = function (categoryarrayid) {

        //Get the categoryID from the categoryarrayid
        categoryid = $scope.categories[categoryarrayid].id


        $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupCustoms/' + categoryid + '/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Skills to the Category Model
            $scope.categories[categoryarrayid].skills = response.data;

            //Increment the categoryarrayid
            categoryarrayid = categoryarrayid + 1;

            //Check to see we are done adding skills or we have more to do:
            if (categoryarrayid < $scope.categories.length) {

                //Still more skills to delete, so keep going...
                $scope.populateSkills(categoryarrayid);

            }

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log('error!');
            console.log(response);

        });

    };

    //Function to Load the Category Model (with Skills)
    $scope.populateCategory = function (categoryid) {

        //Make a call to get everything under with the target area
        $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaCustoms/' + categoryid + '/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Populate the Skills Model with the reponse data for the UI
            $scope.categories = response.data;

            //Call the populateSkills Function to load all the skills for each category
            $scope.populateSkills(0);

            //Get the lenght of the Skills Array to remove
            //$scope.length = $scope.skills.length;

            console.log($scope.categories);

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Self Calling Function to loop through and delete all skills connected to the category
    $scope.deleteskillloop = function (categoryarrayid, skillarrayid) {

        //get the skill id to delete from the skillarrayid
        skillid = $scope.categories[categoryarrayid].skills[skillarrayid].id;

        //Call the Factory
        SkillFactory.delete(skillid)

            //Factory call succeeded
            .then(function (result) {

                //Log the Success
                console.log('Factory Call Succeeded');

                //Update the Display by marking the skill deleted
                //$scope.skills[id].status = "deleted";

                //Increase the Counter
                skillarrayid = skillarrayid + 1;

                //Check to see we are done deleting skills or we have more to do:
                if (skillarrayid < $scope.categories[categoryarrayid].skills.length) {

                    //Still more skills to delete, so keep going...
                    $scope.deleteskillloop(categoryarrayid, skillarrayid);

                } else {

                    console.log('All Skills Deleted!');

                    //Get the CategoryID from the CategoryArrayID
                    categoryid = $scope.categories[categoryarrayid].id;

                    //Call the Factory
                    CategoryFactory.delete(categoryid)

                        //Category Delete Succeeded
                        .then(function (result) {

                            //Log the Success
                            console.log('Factory Call Succeeded');

                            //Re-direct the User to the console projects page 
                            // $location.path('/adminskills/');

                        })

                        //Category Delete Failed
                        .catch(function (error) {

                            //Log the Error
                            console.log('Factory Delete Category Failed');
                            console.log(error.message);

                        });
                }
            })

            //Project creation failed
            .catch(function (error) {

                //Log the Error
                console.log('Factory Call Failed');
                console.log(error.message);

            });
    };

    //Function to Remove all the Categories
    $scope.deletecategoryloop = function (categoryarrayid) {

        //Get the categoryID from the current categoryarrayid
        categoryid = $scope.categories[categoryarrayid].id;

        //Call the function to remove all the skills from the Category
        $scope.deleteskillloop(categoryarrayid, 0);

        //increase the categoryarray by 1
        categoryarrayid = categoryarrayid + 1;

        //Check to see we are done deleting categories or we have more to do:
        if (categoryarrayid < $scope.categories.length) {

            //Still more skills to delete, so keep going...
            $scope.deletecategoryloop(categoryarrayid);

        } else {

            //Call the Factory to Delete the Area
            AreaFactory.delete($routeParams.areaid)

                //Category Delete Succeeded
                .then(function (result) {

                    //Log the Success
                    console.log('Factory Call Succeeded');

                    //Re-direct the User to the console projects page 
                    // $location.path('/adminskills/');

                })

                //Category Delete Failed
                .catch(function (error) {

                    //Log the Error
                    console.log('Factory Delete Category Failed');
                    console.log(error.message);

                });



            console.log('all done...');

        };

    };

    //Function to Delete the Category and all skills. 
    $scope.delete = function () {

        console.log('delete');

        $scope.deletecategoryloop(0);

    };

    //Call the function to Load the Data
    $scope.populateCategory($routeParams.areaid);

    console.log('Admin Delete Area Controller Processed');

});

angularApp.controller("admin_addcategoryCtrl", function ($scope, $rootScope, $http, $routeParams, $location) {

    //Initialize the data models
    $scope.category = {
        Type: "custom",
        Description: ''
    };

    $scope.areacategoriesmasters = {
        AreaId: $routeParams.areaid,
        AreaType: $routeParams.areatype,
        Type: "custom",
        CategoryId: 0
    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Set Created date
        $scope.category.Created = new Date();

        //Make a Rest Call
        $http.post('https://skillresultsapi.azurewebsites.net/api/CategoriesCustoms/', $scope.category, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }


            //On Success of the REST call
        }).then(function (response) {

            console.log(response);

            $scope.areacategoriesmasters.CategoryId = response.data.id;
            $scope.areacategoriesmasters.CategoryType = response.data.type;

            //Make a second Rest Call
            $http.post('https://skillresultsapi.azurewebsites.net/api/AreaCategoriesCustoms/', $scope.areacategoriesmasters, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success of the REST call
            }).then(function (response) {

                console.log(response);

                $location.path('/adminskills/');

                //On Failure of the REST call
            }, function errorCallback(response) {
                console.log(response);
            });

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log($scope.skill);

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    console.log('Admin Add Category Controller Processed');

});

angularApp.controller("admin_editcategoryCtrl", function ($scope, $http, $routeParams, $location) {

    //Initialize the data models
    $scope.category = {};

    //Function to Load the Form Data
    $scope.loadcategory = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesCustoms/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }


            //On Success of the REST call
        }).then(function (response) {

            $scope.category = response.data;

            console.log($scope.category);

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('https://skillresultsapi.azurewebsites.net/api/CategoriesCustoms/' + $routeParams.id, $scope.category, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $location.path('/adminskills/');

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    //Load the Data
    $scope.loadcategory();

    console.log('Admin Edit Category Controller Processed');

});

angularApp.controller("admin_deletecategoryCtrl", function ($scope, $routeParams, $location, $http, SkillFactory, CategoryFactory) {

    //Make a call to get the Custom Categories
    $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupCustoms/' + $routeParams.categoryid + '/', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }

        //On Success Response from API
    }).then(function successCallback(response) {

        //Populate the Skills Model with the reponse data for the UI
        $scope.skills = response.data;

        //Get the lenght of the Skills Array to remove
        $scope.length = $scope.skills.length;

        console.log($scope.skills);

        //on Fail, log the failure data.
    }, function errorCallback(response) {

        console.log(response);

    });


    //Self Calling Function to loop through and delete all skills connected to the category
    //-------------------------------------------------------------------------------------
    $scope.deleteskillloop = function (id) {

        //Call the Factory
        SkillFactory.delete($scope.skills[id].id)

            //Project update succeeded
            .then(function (result) {

                //Log the Success
                console.log('Factory Call Succeeded');

                //Update the Display by marking the skill deleted
                $scope.skills[id].status = "deleted";

                //Increase the Counter
                id = id + 1;

                //Check to see we are done deleting skills or we have more to do:
                if (id < $scope.length) {

                    //Still more skills to delete, so keep going...
                    $scope.deleteskillloop(id);

                } else {

                    console.log('All Skills Deleted!');

                    //Call the Factory
                    CategoryFactory.delete($routeParams.categoryid)

                        //Project update succeeded
                        .then(function (result) {

                            //Log the Success
                            console.log('Factory Call Succeeded');

                            //Re-direct the User to the console projects page 
                            $location.path('/adminskills/');

                        })

                        //Project creation failed
                        .catch(function (error) {

                            //Log the Error
                            console.log('Factory Call Failed');
                            console.log(error.message);

                        });
                }
            })

            //Project creation failed
            .catch(function (error) {

                //Log the Error
                console.log('Factory Call Failed');
                console.log(error.message);

            });
    };


    //Function to Delete the Category and all skills. 
    $scope.delete = function () {

        console.log('delete');

        $scope.deleteskillloop(0);

    };

    console.log('Admin Delete Category Controller Processed');

});

angularApp.controller("admin_addskillCtrl", function ($scope, $http, $routeParams, $location) {

    //Initialize the data models
    $scope.skill = {
        Hidden: false,
        Type: "custom",
        Description: ''
    };

    $scope.categoryskillsmaster = {
        CategoryId: $routeParams.categoryid,
        CategoryType: $routeParams.categorytype,
        Type: "custom",
        SkillId: ''
    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Set Created date
        $scope.skill.Created = new Date();

        //Make a Rest Call
        $http.post('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms/', $scope.skill, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.categoryskillsmaster.SkillId = response.data.id;
            $scope.categoryskillsmaster.SkillType = response.data.type;

            //Make a second Rest Call
            $http.post('https://skillresultsapi.azurewebsites.net/api/CategorySkillsCustoms/', $scope.categoryskillsmaster, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success of the REST call
            }).then(function (response) {

                $location.path('/adminskills/');

                //On Failure of the REST call
            }, function errorCallback(response) {
                console.log(response);
            });

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    console.log('Admin Add Skill Controller Processed');

});

angularApp.controller("admin_editskillCtrl", function ($scope, $http, $routeParams, $location) {

    //Initialize the data models
    $scope.skill = {};

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.skill = response.data;

            console.log($scope.skill);

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms/' + $routeParams.id, $scope.skill, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $location.path('/adminskills/');

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminskills/');
    };

    //Load the Data
    $scope.loadskill();

    console.log('Admin Edit Skill Controller Processed');

});

angularApp.controller("admin_deleteskillCtrl", function ($scope, $rootScope, $location, $routeParams, SkillFactory) {

    //Populate the 
    $scope.skillid = $routeParams.skillid;

    //Function to call the Project Factory and edit the project. 
    $scope.delete = function () {

        //Call the Factory
        SkillFactory.delete($scope.skillid)

            //Project update succeeded
            .then(function (result) {

                //Log the Success
                console.log('Factory Call Succeeded');
                console.log(result);


                //Reset the Current Skill in the Root Scope
                $rootScope.admin_catalog_state.currentSkill = 0;

                //Re-direct the User to the console projects page 
                $location.path('/adminskills/');

            })

            //Project creation failed
            .catch(function (error) {

                //Log the Error
                console.log('Factory Call Failed');
                console.log(error.message);

            });

    };

    console.log('Admin Delete Skill Controller Processed');

});

angularApp.controller("admin_positionsCtrl", function ($scope, $location, $http) {

    $scope.initialize = function () {

        $scope.positions = {};
        $scope.getpositions();
    };

    $scope.getpositions = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/positions/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $scope.positions = response.data;

        }, function errorCallback(response) {

            console.log("Failed");
        });
    };

    //Download CSV of Positions
    $scope.downloadcsv = function () {

        var a = document.createElement("a");
        var csv = Papa.unparse($scope.positions);

        if (window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
                type: "text/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, 'positions.csv');
        } else {

            a.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(csv);
            a.target = '_blank';
            a.download = 'positions.csv';
            document.body.appendChild(a);
            a.click();
        }
    };

    $scope.initialize();

    console.log('Positions Controller Processed');

});

angularApp.controller("admin_positionCtrl", function ($scope, $location, $routeParams, $http, $mdDialog) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.position = {};
        $scope.positioneducations = {};
        $scope.positionskills = {};
        $scope.positionduties = {};

        //Load Data Models
        $scope.loadposition();
        $scope.loadpositioneducation();
        $scope.loadpositionskills();
        $scope.loadpositionduties();
    };

    //Load Position Details
    $scope.loadposition = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/Positions/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.position = response.data;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Load Position Education
    $scope.loadpositioneducation = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/GetEducationByPosition/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            $scope.positioneducations = response.data;

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    //Load Position Skills
    $scope.loadpositionskills = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/PositionSkills/GetPositionsSkills/' + $routeParams.id + "/master", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(masterdata) {


            $http.get('https://skillresultsapi.azurewebsites.net/api/PositionSkills/GetPositionsSkills/' + $routeParams.id + "/custom", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(customdata) {

                $scope.positionskills = masterdata.data.concat(customdata.data);

                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

            });

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    //Load Position Duties
    $scope.loadpositionduties = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/Duties/GetPositionDuties/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            $scope.positionduties = response.data;

            //on Fail, log the failure data.

        }, function errorCallback(response) {


            console.log(response);

        });

    };

    $scope.showConfirmEducation = function (id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Delete Education')
            .textContent('Are you sure you want to delete this education?')
            .ariaLabel('Delete Education')
            //.targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        //Decided Confirm
        $mdDialog.show(confirm).then(function () {

            //Take Action
            console.log("Confirmed");

            //Make a Rest Call
            $http.delete('https://skillresultsapi.azurewebsites.net/api/PositionEducations/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Succsess of the REST call
            }).then(function (response) {

                console.log(response);
                $scope.loadpositioneducation();


                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log('Delete Failed');

            });


            //Decided Cancel
        }, function () {
            console.log('Cancelled');
        });
    };

    $scope.showConfirmSkill = function (id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Delete Skill')
            .textContent('Are you sure you want to delete this skill?')
            .ariaLabel('Delete Skill')
            //.targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        //Decided Confirm
        $mdDialog.show(confirm).then(function () {

            //Take Action
            console.log("Confirmed");

            //Make a Rest Call
            $http.delete('https://skillresultsapi.azurewebsites.net/api/PositionSkills/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Succsess of the REST call
            }).then(function (response) {

                console.log(response);
                $scope.loadpositionskills();

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log('Delete Failed');

            });


            //Decided Cancel
        }, function () {
            console.log('Cancelled');
        });
    };

    $scope.showConfirmDuty = function (id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Delete Duty')
            .textContent('Are you sure you want to delete this duty?')
            .ariaLabel('Delete Duty')
            //.targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        //Decided Confirm
        $mdDialog.show(confirm).then(function () {

            //Take Action
            console.log("Confirmed");

            //Make a Rest Call
            $http.delete('https://skillresultsapi.azurewebsites.net/api/Duties/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Succsess of the REST call
            }).then(function (response) {

                console.log(response);
                $scope.loadpositionduties();

                //On Failure of the REST call
            }, function errorCallback(response) {

                console.log('Delete Failed');

            });

            //Decided Cancel
        }, function () {
            console.log('Cancelled');
        });
    };

    $scope.initialize();

    console.log('Position Controller Processed');

});

angularApp.controller("admin_addpositionCtrl", function ($scope, $location, $http) {

    //Initialize the data models
    $scope.position = {
        Description: ''
    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Set Created date
        $scope.position.Created = new Date();

        //Make a Rest Call
        $http.post('https://skillresultsapi.azurewebsites.net/api/Positions/', $scope.position, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.position = response.data;

            $location.path('/adminposition/' + response.data.id);

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminpositions/');
    };

    console.log('Add Position Controller Processed');

});

angularApp.controller("admin_addpositioneducationCtrl", function ($scope, $location, $routeParams, $http) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.formData = {
            positionid: $routeParams.id,
            major: '',
            othermajor: false,
            othermajordesc: '',
            minor: '',
            otherminor: false,
            otherminordesc: '',
            certification: '',
            othercertification: false,
            othercertificationdesc: '',
            completed: true,
            completiondate: ''

        };
        $scope.certificationSelected = false;
        $scope.enableMajorMinor = false;
        $scope.enableCertification = false;
        $scope.enableCompletion = false;
        $scope.selectedInstitution = {};
        $scope.selectedField = {};
        $scope.degreelevels = [];
        $scope.degreetypes = [];
        $scope.majors = [];
        $scope.minors = [];
        $scope.certifications = [];

        //Populate Data Models
        $scope.loaddegreelevels();
        $scope.loadfields();
        $scope.loadcertifications();

    };

    //Make a call to load Major/Minor Fields
    $scope.loadfields = function () {

        //Make a call to get Degree Levels
        $http.get('https://skillresultsapi.azurewebsites.net/api/Fields', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.majors = response.data;
            $scope.minors = response.data;

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Make a call to get Degree Levels for Dropdown
    $scope.loaddegreelevels = function () {

        //Make a call to get Degree Levels
        $http.get('https://skillresultsapi.azurewebsites.net/api/DegreeLevels', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.degreelevels = response.data;

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Load Certifications
    $scope.loadcertifications = function () {

        //Make a call to get Certifications
        $http.get('https://skillresultsapi.azurewebsites.net/api/Certifications/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Certifications to the Scope
            $scope.certifications = response.data;

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Select Certification
    $scope.selectCertification = function (value) {

        //other certification selected
        if (value == 0) {
            $scope.certificationSelected = true;
            $scope.enableCertification = false;
            $scope.selectedField.title01 = document.getElementById("othercertificationdesc").value;
            $scope.enableCompletion = true;

        } else {
            $scope.certificationSelected = true;
            $scope.formData.certification = value.id;
            $scope.enableCertification = false;
            $scope.selectedField.title01 = value.name;
            $scope.enableCompletion = true;
        }

    };

    //Called when Other Certification Checked
    $scope.othercertificationchecked = function () {

        if ($scope.formData.othercertification) {

            $scope.certifications = [];

        } else {

            $scope.loadcertifications();
        }

    };

    //Function to Search Degree Type by Degree Level
    $scope.searchdegreelevel = function (degreelevel) {

        //Show Major/Minor or Certified/Licensed
        if (degreelevel < 3) {
            $scope.enableMajorMinor = false;
            $scope.enableCertification = true;

            //Load Certifications
            $scope.loadcertifications();

        } else {
            $scope.enableMajorMinor = true;
            $scope.enableCertification = false;
        }

        //Make a call to get Degree Types
        $http.get('https://skillresultsapi.azurewebsites.net/api/GetDegreeTypebyLevel/' + degreelevel, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Apply to degreetypes scope
            $scope.degreetypes = response.data;

            //Set default Certified or Licensed if only option
            if (degreelevel < 3) {

                //Set default dropdown value
                $scope.formData.degreetype = degreelevel;


                //Show/Hide Major/Minor or Certificate/License
                //$scope.selectdegreetype(degreelevel);
            }

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Submit Form
    $scope.submitform = function () {

        //If Certificate/License
        if ($scope.formData.degreelevel < 3) {

            $scope.formData = {

                positionid: $routeParams.id,
                degreelevel: $scope.formData.degreelevel,
                degreetype: $scope.formData.degreetype,
                major: $scope.formData.certification,
                othermajor: $scope.formData.othercertification,
                othermajordesc: $scope.formData.othercertificationdesc,
                minor: $scope.formData.minor,
                otherminor: $scope.formData.otherminor,
                otherminordesc: $scope.formData.otherminordesc,

            };

        }
        //Else Associates or above
        else {

            $scope.formData = {

                positionid: $routeParams.id,
                degreelevel: $scope.formData.degreelevel,
                degreetype: $scope.formData.degreetype,
                major: $scope.formData.major,
                othermajor: $scope.formData.othermajor,
                othermajordesc: $scope.formData.othermajordesc,
                minor: $scope.formData.minor,
                otherminor: $scope.formData.otherminor,
                otherminordesc: $scope.formData.otherminordesc,

            };

            $http.post('https://skillresultsapi.azurewebsites.net/api/PositionEducations', $scope.formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }
            }).then(function (response) {

                console.log(response);
                $location.path('/adminposition/' + $routeParams.id);


            }, function errorCallback(response) {

                console.log("Add Position Skill Failed");
            });

        }

    };

    //Clear Form
    $scope.clear = function () {

        //Reset Form
        $scope.initialize();

    };

    $scope.initialize();

    console.log('Add Position Education Controller Processed');

});

angularApp.controller("admin_addpositionskillsCtrl", function ($scope, $rootScope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Initalize Data Models
        $scope.searchskills = [];
        $scope.searchtext = "";
        $scope.position = {};
        $scope.position.id = $routeParams.id;
        $scope.areasloading = false;
        $scope.categoriesloading = false;
        $scope.skillsloading = false;

        //Load Data Models
        $scope.loadsearchskills();

        //Call the Load Area Data Function to populate the view
        $scope.loadareas();
    };

    //Load Skills Function
    $scope.loadsearchskills = function () {

        var allskills = [];

        $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function (masterdata) {

            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function (customdata) {

                $scope.allskills = masterdata.data.concat(customdata.data);

                //loop through scope to 
                angular.forEach($scope.allskills, function (value, key) {
                    var skill = {
                        name: value.name,
                        value: value.name.toLowerCase(),
                        description: value.description,
                        id: value.id,
                        type: value.type
                    };
                    allskills.push(skill);
                });

                $scope.searchskills = allskills;

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
        });

    };

    //Function - Load Area Data
    $scope.loadareas = function () {

        $scope.areasloading = true;

        //Initialze the Area Model
        $scope.areas = [];

        //Make a call to get the Master Areas
        $http.get('https://skillresultsapi.azurewebsites.net/api/AreasMasters', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success Response from API
        }).then(function successCallback(response) {

            //Add the Master Areas to the Areas Model
            $scope.areas = response.data;

            //Make a call to the Custom Areas
            $http.get('https://skillresultsapi.azurewebsites.net/api/AreasCustoms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Add the Custom Areas to the Areas Model
                $scope.areas = $scope.areas.concat(response.data);

                //Sort the Areas Scope
                $scope.sortObj($scope.areas);

                $scope.areasloading = false;

                //If this is the first time here, select the first Area in the List
                if ($rootScope.admin_catalog_state.currentArea == 0) {

                    console.log('First time Here:')
                    console.log('Selecting - ID: ' + $scope.areas[0].id + ' Type: ' + $scope.areas[0].type)


                    $scope.selectArea($scope.areas[0].id, $scope.areas[0].type);

                    //Otherwise, call the select Area function
                } else {

                    console.log('Navigating back:')
                    console.log('Selecting - ID: ' + $rootScope.admin_catalog_state.currentArea + ' Type: ' + $rootScope.admin_catalog_state.currentAreaType)

                    $scope.selectArea($rootScope.admin_catalog_state.currentArea, $rootScope.admin_catalog_state.currentAreaType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                //Log the Error
                console.log(response);
                $scope.areasloading = false;

            });

            //on Fail, log the failure data.
        }, function errorCallback(response) {

            console.log(response);
            $scope.areasloading = false;

        });

    };

    //Function - Load Category Data
    $scope.loadcategories = function (areaid, areatype) {

        $scope.categoriesloading = true;

        //initialize the categories
        $scope.categories = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (areatype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaMasters/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Check for Null Data
                if (!response.data.length == 0) {

                    //Populate the Category Model with the response data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);

                    $scope.categoriesloading = false;

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //The catagory is empty, so clear the skills as well. 
                    $scope.skills = [];

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.categoriesloading = false;

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/CategoriesbyAreaCustoms/' + areaid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Check for Null Data
                if (response.data[0]) {

                    //Populate the Category Model with the reponse data
                    $scope.categories = response.data;

                    //Sort the Category Scope
                    $scope.sortObj($scope.categories);
                    $scope.categoriesloading = false;

                    //If this is the first time here, select the first Area in the List
                    if (!$scope.categories.find(o => o.id === $rootScope.admin_catalog_state.currentCategory && o.type === $rootScope.admin_catalog_state.currentCategoryType) || $rootScope.admin_catalog_state.currentCategory == 0) {

                        $scope.selectCategory($scope.categories[0].id, $scope.categories[0].type);

                        //Otherwise, call the select Area function
                    } else {

                        $scope.selectCategory($rootScope.admin_catalog_state.currentCategory, $rootScope.admin_catalog_state.currentCategoryType);

                    };

                } else {

                    //the custom category is empty, so clear out the skills as well
                    $scope.skills = [];
                    $scope.categoriesloading = false;

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.categoriesloading = false;

            });

        };

    };

    //Function - Load Skill Data
    $scope.loadskills = function (categoryid, categorytype) {

        $scope.skillsloading = true;

        //initialize the categories
        $scope.skills = [];

        //If the Parent Area is a Master, call the get Category by Master Area Endpoint.
        if (categorytype == "master") {

            //Make a call to get the Master (& possibly custom) Categories in the Master Area
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupMasters/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the response data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                $scope.skillsloading = false;

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    //Make sure there is a first skill to select
                    if ($scope.selectSkill($scope.skills[0])) {
                        $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);
                    }

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.skillsloading = false;

            });

            //Otherwise, if the Parent Area is a Custom, just grab all the custom areas. 
        } else {

            //Make a call to get the Custom Categories
            $http.get('https://skillresultsapi.azurewebsites.net/api/SkillsGroupCustoms/' + categoryid + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                }

                //On Success Response from API
            }).then(function successCallback(response) {

                //Populate the Category Model with the reponse data
                $scope.skills = response.data;

                //Sort the Category Scope
                $scope.sortObj($scope.skills);

                $scope.skillsloading = false;

                //If this is the first time here, select the first Skill in the List
                if ($rootScope.admin_catalog_state.currentSkill == 0) {

                    $scope.selectSkill($scope.skills[0].id, $scope.skills[0].type);

                    //Otherwise, call the select Area function
                } else {

                    $scope.selectSkill($rootScope.admin_catalog_state.currentSkill, $rootScope.admin_catalog_state.currentSkillType);

                };

                //on Fail, log the failure data.
            }, function errorCallback(response) {

                console.log(response);
                $scope.skillsloading = false;

            });

        };

    };

    //Function - Select Area
    $scope.selectArea = function (id, type) {

        //Set the Current Area Selection 
        $rootScope.admin_catalog_state.currentArea = id;
        $rootScope.admin_catalog_state.currentAreaType = type;

        //Load the categories
        $scope.loadcategories(id, type);

    };

    //Function - Select Category
    $scope.selectCategory = function (id, type) {

        $rootScope.admin_catalog_state.currentCategory = id;
        $rootScope.admin_catalog_state.currentCategoryType = type;

        //$rootScope.admin_catalog_state.currentSkill = 0;
        //$rootScope.admin_catalog_state.currentSkillType = '';

        $scope.loadskills(id, type);

    };

    //Function - Select Skill
    $scope.selectSkill = function (id, type) {

        $rootScope.admin_catalog_state.currentSkill = id;
        $rootScope.admin_catalog_state.currentSkillType = type;

    };

    //Function - Sort The Areas Model by Name
    $scope.sortObj = function (object) {

        //Sort Areas Aphabetically
        object.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });

    };

    $scope.initialize();

    console.log('Add Position Skills Controller Processed');

});

angularApp.controller("admin_addpositionskillCtrl", function ($scope, $http, $routeParams, $location) {

    $scope.initialize = function () {

        //Load the Data
        $scope.loadskill();
    };

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/PositionSkills/GetSelectedPositionSkill/' + $routeParams.id + "/" + $routeParams.type, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {
            console.log(response);
            $scope.skill = response.data[0];
            //Set selected skill id and rating to 0 to disable button
            $scope.skill.rating = 0;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        var dataObj = {
            PositionId: $routeParams.positionid,
            SkillId: $scope.skill.id,
            Rating: $scope.skill.rating,
            Priority: $scope.skill.priority,
            Type: $scope.skill.type
        };

        $http.post('https://skillresultsapi.azurewebsites.net/api/PositionSkills', dataObj, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then(function (response) {

            $location.path('/adminposition/' + $routeParams.positionid);

            console.log(response);

        }, function errorCallback(response) {

            console.log("Add Position Skill Failed");
        });


    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminposition/' + $routeParams.id);
    };

    $scope.initialize();

    console.log('Add Position Skill Controller Processed');

});

angularApp.controller("admin_editpositionCtrl", function ($scope, $location, $routeParams, $http) {

    $scope.initialize = function () {

        //Initialize the data models
        $scope.position = {};

        //Load the Data
        $scope.loadposition();
    };

    //Function to Load the Form Data
    $scope.loadposition = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/Positions/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.position = response.data;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('https://skillresultsapi.azurewebsites.net/api/Positions/' + $routeParams.id, $scope.position, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $location.path('/adminposition/' + $routeParams.id);

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminposition/' + $routeParams.id);
    };

    $scope.initialize();

    console.log('Edit Position Controller Processed');

});

angularApp.controller("admin_editpositionskillCtrl", function ($scope, $location, $routeParams, $http) {

    $scope.initialize = function () {
        //Initialize the data models
        $scope.skill = {};

        //Load the Data
        $scope.loadskill();

    };

    //Function to Load the Form Data
    $scope.loadskill = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/PositionSkills/' + $routeParams.id + "/" + $routeParams.type, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.skill = response.data[0];

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        ////Make a Rest Call
        var req = {
            method: 'PUT',
            url: 'https://skillresultsapi.azurewebsites.net/api/PositionSkills/' + $scope.skill.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            data: $scope.skill
        }
        console.log(req)
        $http(req)
            //On Success of the REST call
            .then(function (response) {
                console.log($scope.skill);
                $location.path('/adminposition/' + $scope.skill.positionId);

                //On Failure of the REST call
            }, function (response) {

                console.log(response);

            });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminposition/' + $scope.skill.positionId);
    };

    $scope.initialize();



    console.log('Edit Position Skill Controller Processed');

});

angularApp.controller("admin_addpositiondutyCtrl", function ($scope, $location, $routeParams, $http) {

    $scope.initialize = function () {

        //Initialize the data models
        $scope.duty = {
            PositionId: $routeParams.id
        };

    };

    //Function to Submit the Form
    $scope.submit = function () {

        var dataObj = {
            PositionId: $routeParams.id,
            Name: $scope.duty.name,
            Description: $scope.duty.description,

        };

        $http.post('https://skillresultsapi.azurewebsites.net/api/Duties', dataObj, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $location.path('/adminposition/' + $routeParams.id);

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminposition/' + $routeParams.id);
    };

    $scope.initialize();

    console.log('Add Position Duty Controller Processed');

});

angularApp.controller("admin_editpositiondutyCtrl", function ($scope, $location, $routeParams, $http) {

    $scope.initialize = function () {

        //Initialize the data models
        $scope.duty = {};

        //Load the Data
        $scope.loadduty();
    };

    //Function to Load the Form Data
    $scope.loadduty = function () {

        //Make a Rest Call
        $http.get('https://skillresultsapi.azurewebsites.net/api/Duties/' + $routeParams.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $scope.duty = response.data;

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Make a Rest Call
        $http.put('https://skillresultsapi.azurewebsites.net/api/Duties/' + $routeParams.id, $scope.duty, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }

            //On Success of the REST call
        }).then(function (response) {

            $location.path('/adminposition/' + $routeParams.id);
            //$location.path('/adminposition/' + $scope.skill.positionId);

            //On Failure of the REST call
        }, function errorCallback(response) {

            console.log(response);

        });

    };

    //Function to Cancel the Form
    $scope.cancel = function () {
        $location.path('/adminposition/' + $routeParams.id);
    };

    $scope.initialize();

    console.log('Edit Position Duty Controller Processed');

});

angularApp.controller("admin_campaignsCtrl", function ($scope) {

    console.log('Admin Campaigns Controller Processed');

});

angularApp.controller("admin_settingsCtrl", function ($scope) {

    console.log('Admin Settings Controller Processed');

});

angularApp.controller("admin_helpCtrl", function ($scope) {

    console.log('Admin Help Controller Processed');

});

angularApp.controller("admin_quickstartCtrl", function ($scope) {

    console.log('Admin QuickStart Controller Processed');

});

//Authentication Controllers

angularApp.controller("loginCtrl", function ($scope, $http, $location) {

    //Establish the View State
    $scope.state = {
        mode: "login",
        status: ""
    };

    //Function to Send Login Email
    $scope.loginemail = function () {

        $http.get('https://skillresultsapi.azurewebsites.net/api/GetEmailExists?email=' + $scope.loginemail.email, {
            headers: {
                'Content-Type': 'application/json',
            }

            //On Success Response from API
        }).then(function successCallback(viewuser) {

            $scope.state.mode = "working";

            var dataObj = {
                email: $scope.loginemail.email,
                template: "loginTemplate.html",
            };

            $http.post('https://skillresultsapi.azurewebsites.net/api/authenticate', dataObj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {

                $scope.state.mode = "sent";

                //DELETE THIS FOR PRODUCTION
                $scope.secureloginlink = response.data;
                console.log(response);

            }, function errorCallback(response) {

                $scope.form.error = "* " + response.data;

            });


            //on Fail, log the failure data.

        }, function errorCallback(response) {

            console.log(response);

            //TODO: Give User Feedback That They Don't Exist

            $location.path('/register/trial/');

        });

    };

});

angularApp.controller("authCtrl", function ($scope, $location, $routeParams, $http) {

    //Get the Route Parameters
    $scope.routeparams = {
        UserId: $routeParams.userid,
        Authkey01: $routeParams.authkey01,
        Authkey02: $routeParams.authkey02
    };

    $scope.authfailed = {};

    //Call the Authenticate EndPoint
    $http({
        method: 'GET',
        url: 'https://skillresultsapi.azurewebsites.net/api/authenticate?UserId=' + $scope.routeparams.UserId + '&Authkey01=' + $scope.routeparams.Authkey01 + '&Authkey02=' + $scope.routeparams.Authkey02

    }).then(function successCallback(response) {

        localStorage.setItem('accessToken', response.data.access_token);
        $location.path('/');

    }, function errorCallback(response) {

        console.log("ERROR: " + response);
        $scope.authfailed.show = true;


    });

});

angularApp.controller("registerCtrl", function ($scope, $location, $routeParams, $http, $timeout, $rootScope) {

    //Function to Initialize the Controller
    $scope.initialize = function () {

        //Establish the View State
        $scope.state = {
            mode: "register",
            status: ""
        };

        $scope.states = $rootScope.states;


        if ($routeParams.plan == 'trial') {
            $scope.registrationdata = {
                email: '',
                organizationname: '',
                organizationaddress: '',
                organizationcity: '',
                organizationstate: '',
                organizationzip: '',
                priceplan: 'skillresultsfree',
                cardtoken: ''
            };
        }

        if ($routeParams.plan == 'professional') {
            $scope.registrationdata = {
                email: '',
                organizationname: '',
                organizationaddress: '',
                organizationcity: '',
                organizationstate: '',
                organizationzip: '',
                priceplan: 'skillresultsprom',
                cardtoken: ''
            };
        }

        if ($routeParams.plan == 'enterprise') {
            $scope.registrationdata = {
                email: '',
                organizationname: '',
                organizationaddress: '',
                organizationcity: '',
                organizationstate: '',
                organizationzip: '',
                priceplan: 'skillresultsentm',
                cardtoken: ''
            };
        }


        // Create a Stripe client.
        $scope.stripe = Stripe('pk_live_VwKntor0pda1yvt1lT7Xugrm');

        // Create an instance of Elements
        $scope.elements = $scope.stripe.elements();

        // Custom styling passed to the CC Element
        var style = {
            base: {
                color: '#32325d',
                lineHeight: '18px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '18px',
                '::placeholder': {
                    color: '#757575'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        // Create an instance of the card Element
        $scope.card = $scope.elements.create('card', {
            style: style
        });


        //Wait for everything in the View to load before mounting the Card Element. 
        angular.element(function () {
            // Add an instance of the card Element into the `card-element` <div>
            $scope.card.mount('#card-element');
        });



    };

    //Function to Assign the Payment Plan
    $scope.selectpayment = function (plan) {

        $scope.registrationdata.priceplan = plan;

    };

    //Function to Generate the Stripe Credit Card Token
    $scope.gettoken = function () {

        //Switch to Working State and Set the Status
        $scope.state.status = "Processing Card Information"
        console.log("Generating Card Token");

        $scope.stripe.createToken($scope.card).then(function (result) {
            if (result.error) {
                // Inform the user if there was an error.
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the token to your server.
                stripeTokenHandler(result.token);
            }
        });

        //Function to add the token to the Registration Data
        function stripeTokenHandler(token) {

            // Insert the token ID into the form so it gets submitted to the server
            var form = document.getElementById('payment-form');
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token.id);
            form.appendChild(hiddenInput);
            $scope.registrationdata.cardtoken = token.id;

            //Kick off the Create Customer Process
            console.log("Generated Card Token");

            //Wait for a moment and then kick off the Create Customer Process
            $timeout(function () {
                $scope.createcustomer();
            }, 2000);
        }
    };

    //Function to Create the Stripe Customer
    $scope.createcustomer = function () {

        //Switch to Working State and Set the Status
        $scope.state.status = "Creating Customer Record..."
        console.log("Creating Stripe Customer");

        //Create the Stripe Customer First... 
        var customerObj = {
            email: $scope.registrationdata.email,
            organizationname: $scope.registrationdata.organizationname,
            organizationaddress: $scope.registrationdata.organizationaddress,
            organizationcity: $scope.registrationdata.organizationcity,
            organizationstate: $scope.registrationdata.organizationstate,
            organizationzip: $scope.registrationdata.organizationzip,
            priceplan: $scope.registrationdata.priceplan,
            cardtoken: $scope.registrationdata.cardtoken
        };

        $http.post('https://skillresultsapi.azurewebsites.net/api/createcustomer', customerObj, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

            console.log("Stripe Customer Created");

            //Wait for a moment and then kick off the register account process
            $timeout(function () {
                $scope.register();
            }, 2000);

        }, function errorCallback(response) {

            console.log(response.data);
            $scope.form.error = "* " + response.data.message;

        });

    };

    //Function to Register with the SkillResults Application
    $scope.register = function () {

        //Switch to Working State and Set the Status
        $scope.state.status = "Creating SkillResults Login...";
        console.log("Creating SkillResults Account");

        var dataObj = {
            email: $scope.registrationdata.email,
            organization: $scope.registrationdata.organizationname,
            maxusers: 50,
        };

        $http.post('https://skillresultsapi.azurewebsites.net/api/account/registeradmin', dataObj, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

            console.log(response);
            localStorage.setItem('accessToken', response.data.access_token);
            localStorage.setItem('userName', response.data.userName);
            localStorage.setItem('userId', response.data.userId);
            $location.path('/admin/');

        }, function errorCallback(response) {

            console.log(response.data);
            $scope.form.error = "* " + response.data.message;

        });

    };

    //Function to Submit the Form
    $scope.submit = function () {

        //Stop form from submitting on empty string from initialization
        if ($scope.registrationdata.email != '')

        {

            $http.get('https://skillresultsapi.azurewebsites.net/api/GetEmailExists?email=' + $scope.registrationdata.email, {
                headers: {
                    'Content-Type': 'application/json',
                }

                //On Success Response from API
            }).then(function successCallback(viewuser) {

                console.log("User Already Exists");

                //TODO: Give User Feedback That They Already Exist

                $location.path('/login/');


                //on Fail, log the failure data.

            }, function errorCallback(response) {


                console.log(response);

                //Switch to Working State and Set the Status
                $scope.state.mode = "working";
                $scope.state.status = "registration started..."

                //Detect if we are registering a free account or a paid account
                if ($scope.registrationdata.priceplan == "skillresultsfree") {

                    //Wait for a moment and then kick off the create customer
                    $timeout(function () {
                        $scope.createcustomer();
                    }, 2000);

                } else {

                    //Wait for a moment and then kick off the generate credit card token process
                    $timeout(function () {
                        $scope.gettoken();
                    }, 2000);

                }


            });

        }

    };

    //Initialize the Controller
    $scope.initialize();

});


//Test Controller 

angularApp.controller("testCtrl", function ($scope, $http) {

    $scope.states = [
        {
            "name": "Alabama",
            "abbreviation": "AL"
    },
        {
            "name": "Alaska",
            "abbreviation": "AK"
    },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
    },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
    },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
    },
        {
            "name": "California",
            "abbreviation": "CA"
    },
        {
            "name": "Colorado",
            "abbreviation": "CO"
    },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
    },
        {
            "name": "Delaware",
            "abbreviation": "DE"
    },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
    },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
    },
        {
            "name": "Florida",
            "abbreviation": "FL"
    },
        {
            "name": "Georgia",
            "abbreviation": "GA"
    },
        {
            "name": "Guam",
            "abbreviation": "GU"
    },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
    },
        {
            "name": "Idaho",
            "abbreviation": "ID"
    },
        {
            "name": "Illinois",
            "abbreviation": "IL"
    },
        {
            "name": "Indiana",
            "abbreviation": "IN"
    },
        {
            "name": "Iowa",
            "abbreviation": "IA"
    },
        {
            "name": "Kansas",
            "abbreviation": "KS"
    },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
    },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
    },
        {
            "name": "Maine",
            "abbreviation": "ME"
    },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
    },
        {
            "name": "Maryland",
            "abbreviation": "MD"
    },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
    },
        {
            "name": "Michigan",
            "abbreviation": "MI"
    },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
    },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
    },
        {
            "name": "Missouri",
            "abbreviation": "MO"
    },
        {
            "name": "Montana",
            "abbreviation": "MT"
    },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
    },
        {
            "name": "Nevada",
            "abbreviation": "NV"
    },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
    },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
    },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
    },
        {
            "name": "New York",
            "abbreviation": "NY"
    },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
    },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
    },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
    },
        {
            "name": "Ohio",
            "abbreviation": "OH"
    },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
    },
        {
            "name": "Oregon",
            "abbreviation": "OR"
    },
        {
            "name": "Palau",
            "abbreviation": "PW"
    },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
    },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
    },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
    },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
    },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
    },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
    },
        {
            "name": "Texas",
            "abbreviation": "TX"
    },
        {
            "name": "Utah",
            "abbreviation": "UT"
    },
        {
            "name": "Vermont",
            "abbreviation": "VT"
    },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
    },
        {
            "name": "Virginia",
            "abbreviation": "VA"
    },
        {
            "name": "Washington",
            "abbreviation": "WA"
    },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
    },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
    },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
    }];

    //
    //    $http.get('https://skillresultsapi.azurewebsites.net/api/reports/usersbyskill/276', {
    //        headers: {
    //            'Content-Type': 'application/json',
    //            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    //        }
    //    }).then(function (response) {
    //
    //        console.log(response);
    //
    //    }, function errorCallback(response) {
    //
    //        console.log(response);
    //
    //    });
    //
    //
    //    console.log('Test Controller Processed');

});
