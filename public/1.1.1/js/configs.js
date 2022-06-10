angularApp.config(function ($routeProvider, $locationProvider, $mdThemingProvider) {


    $mdThemingProvider.definePalette('skillresultsPalette', {
        '50': 'ff0000',
        '100': 'ff0000',
        '200': 'ff0000',
        '300': 'ff0000',
        '400': 'ff0000',
        '500': '1b77ba', //Primary Custom Color - Bright Blue
        '600': '26a4fc', //Secondary Custom Color - Medium Blue
        '700': 'ff0000',
        '800': 'ff0000',
        '900': 'ff0000',
        'A100': 'ff0000',
        'A200': '26a4fc', //Accent Color - Bright Blue
        'A400': '00ff00',
        'A700': '00ff00',
        'contrastDefaultColor': 'light', // whether, by default, text (contrast)
        // on this palette should be dark or light

        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
        'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('skillresultsPalette')
        .accentPalette('skillresultsPalette')
        .warnPalette('deep-orange')
        .backgroundPalette('grey');




    $routeProvider

        //Routes for User Areas 

        .when('/', {
            controller: 'user_homeCtrl',
            templateUrl: '/1.1.1/html/user/user_home.html',
            routedata: {
                secure: true,
                title: 'Home',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/skills/', {
            controller: 'user_skillsCtrl',
            templateUrl: '/1.1.1/html/user/user_skills.html',
            routedata: {
                secure: true,
                title: 'My Skills',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/addskills/', {
            controller: 'user_addskillsCtrl',
            templateUrl: '/1.1.1/html/user/user_addskills.html',
            routedata: {
                secure: true,
                title: 'Add Skills',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/addskill/:id/:type', {
            controller: 'user_addskillCtrl',
            templateUrl: '/1.1.1/html/user/user_addskill.html',
            routedata: {
                secure: true,
                title: 'Add Skill',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/editskill/:id/:type', {
            controller: 'user_editskillCtrl',
            templateUrl: '/1.1.1/html/user/user_editskill.html',
            routedata: {
                secure: true,
                title: 'Edit a Skill',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/wishlist/', {
            controller: 'user_wishlistCtrl',
            templateUrl: '/1.1.1/html/user/user_wishlist.html',
            routedata: {
                secure: true,
                title: 'Skill Wishlist',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/addwishlists/', {
            controller: 'user_addwishlistsCtrl',
            templateUrl: '/1.1.1/html/user/user_addwishlists.html',
            routedata: {
                secure: true,
                title: 'Add Wishlists',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/addwishlist/:id/:type', {
            controller: 'user_addwishlistCtrl',
            templateUrl: '/1.1.1/html/user/user_addwishlist.html',
            routedata: {
                secure: true,
                title: 'Add Wishlist',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/editwishlist/:id/:type', {
            controller: 'user_editwishlistCtrl',
            templateUrl: '/1.1.1/html/user/user_editwishlist.html',
            routedata: {
                secure: true,
                title: 'Edit a Wishlist',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/education/', {
            controller: 'user_educationCtrl',
            templateUrl: '/1.1.1/html/user/user_education.html',
            routedata: {
                secure: true,
                title: 'Education',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adddegree/', {
            controller: 'user_adddegreeCtrl',
            templateUrl: '/1.1.1/html/user/user_adddegree.html',
            routedata: {
                secure: true,
                title: 'Add Degree',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })
    
        .when('/addcertification/', {
            controller: 'user_addcertificationCtrl',
            templateUrl: '/1.1.1/html/user/user_addcertification.html',
            routedata: {
                secure: true,
                title: 'Add Certification',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/editeducation/:id', {
            controller: 'user_editeducationCtrl',
            templateUrl: '/1.1.1/html/user/user_editeducation.html',
            routedata: {
                secure: true,
                title: 'Edit Education',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/reports/', {
            controller: 'user_reportsCtrl',
            templateUrl: '/1.1.1/html/user/user_reports.html',
            routedata: {
                secure: true,
                title: 'Reports and Dashboards',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/search/', {
            controller: 'user_searchCtrl',
            templateUrl: '/1.1.1/html/user/user_search.html',
            routedata: {
                secure: true,
                title: 'Skill Search',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/settings/', {
            controller: 'user_settingsCtrl',
            templateUrl: '/1.1.1/html/user/user_settings.html',
            routedata: {
                secure: true,
                title: 'My Settings',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/help/', {
            controller: 'user_helpCtrl',
            templateUrl: '/1.1.1/html/user/user_help.html',
            routedata: {
                secure: true,
                title: 'Help Area',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/user/:id', {
            controller: 'user_viewCtrl',
            templateUrl: '/1.1.1/html/user/user_view.html',
            routedata: {
                secure: true,
                title: 'View User Area',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        //Routes for Report Areas 

        .when('/reports/usersbyskill/', {
            controller: 'reports_usersbyskillCtrl',
            templateUrl: '/1.1.1/html/reports/usersbyskill.html',
            routedata: {
                secure: true,
                title: 'Users By Skill',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/reports/skillsbyorganization/', {
            controller: 'reports_skillsbyorganizationCtrl',
            templateUrl: '/1.1.1/html/reports/skillsbyorganization.html',
            routedata: {
                secure: true,
                title: 'Skills By Organization',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/reports/wishlistsbyorganization/', {
            controller: 'reports_wishlistsbyorganizationCtrl',
            templateUrl: '/1.1.1/html/reports/wishlistsbyorganization.html',
            routedata: {
                secure: true,
                title: 'Wishlists By Organization',
                area: 'user'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        //Routes for Admin Areas 

        .when('/admin/', {
            controller: 'admin_homeCtrl',
            templateUrl: '/1.1.1/html/admin/admin_home.html',
            routedata: {
                secure: true,
                title: 'Admin Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminusers/', {
            controller: 'admin_usersCtrl',
            templateUrl: '/1.1.1/html/admin/admin_users.html',
            routedata: {
                secure: true,
                title: 'User Account Managment',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminedituser/:id', {
            controller: 'admin_edituserCtrl',
            templateUrl: '/1.1.1/html/admin/admin_edituser.html',
            routedata: {
                secure: true,
                title: 'User Edit',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminadduser/', {
            controller: 'admin_adduserCtrl',
            templateUrl: '/1.1.1/html/admin/admin_adduser.html',
            routedata: {
                secure: true,
                title: 'Add New User',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminimport/', {
            controller: 'admin_importCtrl',
            templateUrl: '/1.1.1/html/admin/admin_import.html',
            routedata: {
                secure: true,
                title: 'Admin User Import',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminskills/', {
            controller: 'admin_skillsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_skills.html',
            routedata: {
                secure: true,
                title: 'Skill Catalog Managment',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddarea/', {
            controller: 'admin_addareaCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addarea.html',
            routedata: {
                secure: true,
                title: 'Add a Skill Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditarea/:id', {
            controller: 'admin_editareaCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editarea.html',
            routedata: {
                secure: true,
                title: 'Edit a Skill Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admindeletearea/:areaid', {
            controller: 'admin_deleteareaCtrl',
            templateUrl: '/1.1.1/html/admin/admin_deletearea.html',
            routedata: {
                secure: true,
                title: 'Delete a Skill Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddcategory/:areaid/:areatype', {
            controller: 'admin_addcategoryCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addcategory.html',
            routedata: {
                secure: true,
                title: 'Add a Skill category',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditcategory/:id', {
            controller: 'admin_editcategoryCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editcategory.html',
            routedata: {
                secure: true,
                title: 'Edit Skill category',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admindeletecategory/:categoryid', {
            controller: 'admin_deletecategoryCtrl',
            templateUrl: '/1.1.1/html/admin/admin_deletecategory.html',
            routedata: {
                secure: true,
                title: 'Delete a Skill category',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddskill/:categoryid/:categorytype', {
            controller: 'admin_addskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addskill.html',
            routedata: {
                secure: true,
                title: 'Add a Skill',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditskill/:id', {
            controller: 'admin_editskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editskill.html',
            routedata: {
                secure: true,
                title: 'Edit a Skill',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admindeleteskill/:skillid', {
            controller: 'admin_deleteskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_deleteskill.html',
            routedata: {
                secure: true,
                title: 'Delete a Skill Selection',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminpositions/', {
            controller: 'admin_positionsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_positions.html',
            routedata: {
                secure: true,
                title: 'Positions',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminposition/:id', {
            controller: 'admin_positionCtrl',
            templateUrl: '/1.1.1/html/admin/admin_position.html',
            routedata: {
                secure: true,
                title: 'Position',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddposition/', {
            controller: 'admin_addpositionCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addposition.html',
            routedata: {
                secure: true,
                title: 'Add Position',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddpositoneducation/:id', {
            controller: 'admin_addpositioneducationCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addpositioneducation.html',
            routedata: {
                secure: true,
                title: 'Add Position Education',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddpostionskills/:id', {
            controller: 'admin_addpositionskillsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addpositionskills.html',
            routedata: {
                secure: true,
                title: 'Add Position Skills',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddpostionskill/:positionid/:id/:type', {
            controller: 'admin_addpositionskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addpositionskill.html',
            routedata: {
                secure: true,
                title: 'Add Position Skill',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditposition/:id', {
            controller: 'admin_editpositionCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editposition.html',
            routedata: {
                secure: true,
                title: 'Edit Position',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditpositionskill/:id/:type', {
            controller: 'admin_editpositionskillCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editpositionskill.html',
            routedata: {
                secure: true,
                title: 'Edit Position Skill',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminaddpositionduty/:id', {
            controller: 'admin_addpositiondutyCtrl',
            templateUrl: '/1.1.1/html/admin/admin_addpositionduty.html',
            routedata: {
                secure: true,
                title: 'Add Position Duty',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admineditpositionduty/:id', {
            controller: 'admin_editpositiondutyCtrl',
            templateUrl: '/1.1.1/html/admin/admin_editpositionduty.html',
            routedata: {
                secure: true,
                title: 'Edit Position Duty',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/admincampaigns/', {
            controller: 'admin_campaignsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_campaigns.html',
            routedata: {
                secure: true,
                title: 'SkillResults Campaigns',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminsettings/', {
            controller: 'admin_settingsCtrl',
            templateUrl: '/1.1.1/html/admin/admin_settings.html',
            routedata: {
                secure: true,
                title: 'Global Settings',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminhelp/', {
            controller: 'admin_helpCtrl',
            templateUrl: '/1.1.1/html/admin/admin_help.html',
            routedata: {
                secure: true,
                title: 'Admin Help Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        .when('/adminquickstart/', {
            controller: 'admin_helpCtrl',
            templateUrl: '/1.1.1/html/admin/admin_quickstart.html',
            routedata: {
                secure: true,
                title: 'Admin QuickStart Area',
                area: 'admin'
            },
            resolve: {
                message: function (General) {
                    return General.routeload();
                }
            }
        })

        //Public Routes for Login and Authentication Areas 

        .when('/login/', {
            controller: 'loginCtrl',
            templateUrl: '/1.1.1/html/login/login.html',
            routedata: {
                secure: false,
                title: 'Login',
                area: 'admin'
            }
        })

        .when('/auth/:userid/:authkey01/:authkey02/', {
            controller: 'authCtrl',
            templateUrl: '/1.1.1/html/login/auth.html',
            routedata: {
                secure: false,
                title: 'Auth',
                area: 'admin'
            }
        })

        .when('/register/:plan', {
            controller: 'registerCtrl',
            templateUrl: '/1.1.1/html/register/register.html',
            routedata: {
                secure: false,
                title: 'Register',
                area: 'admin'
            }
        })

        .when('/test/', {
            controller: 'testCtrl',
            templateUrl: '/1.1.1/html/test.html',
            routedata: {
                secure: false,
                title: 'Test',
                area: 'admin'
            }
        })

        //If the Route is not found
        .otherwise({
            redirectTo: '/'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

});
