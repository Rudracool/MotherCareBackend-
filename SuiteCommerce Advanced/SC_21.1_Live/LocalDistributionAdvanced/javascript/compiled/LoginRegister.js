/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("LoginRegister", ["require", "exports", "Utils", "LoginRegister.Login.View", "LoginRegister.Register.View", "LoginRegister.View", "LoginRegister.ForgotPassword.View", "LoginRegister.ResetPassword.View", "LoginRegister.Component"], function (require, exports, Utils, LoginView, RegisterView, LoginRegisterView, ForgotPasswordView, ResetPasswordView, LoginRegisterComponent) {
    "use strict";
    // @class LoginRegisterModule @extend ApplicationModule
    var LoginRegister = {
        mountToApp: function (application) {
            var modulesConfig = application.getConfig().modulesConfig;
            if (modulesConfig.LoginRegister.startRouter) {
                var pageType = application.getComponent('PageType');
                pageType.registerPageType({
                    name: 'login-register',
                    routes: ['login-register', 'login-register?*params'],
                    view: LoginRegisterView,
                    defaultTemplate: {
                        name: 'login_register.tpl',
                        displayName: 'Login Register Default',
                        thumbnail: '/path/to/login_register_tpl.png'
                    }
                });
                pageType.registerPageType({
                    name: 'forgot-password',
                    routes: ['forgot-password', 'forgot-password?*params'],
                    view: ForgotPasswordView,
                    defaultTemplate: {
                        name: 'login_register_forgot_password.tpl',
                        displayName: 'Forgot Password Default',
                        thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-forgot-password.png')
                    }
                });
                pageType.registerPageType({
                    name: 'reset-password',
                    routes: ['reset-password', 'reset-password?*params'],
                    view: ResetPasswordView,
                    defaultTemplate: {
                        name: 'login_register_reset_password.tpl',
                        displayName: 'Reset Password Default',
                        thumbnail: '/path/to/login_register_reset_password_tpl.png'
                    }
                });
                pageType.registerPageType({
                    name: 'register',
                    routes: ['register', 'register?*params'],
                    view: RegisterView,
                    defaultTemplate: {
                        name: 'login_register_register.tpl',
                        displayName: 'Register Default',
                        thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-register.png')
                    }
                });
                pageType.registerPageType({
                    name: 'login',
                    routes: ['login', 'login?*params'],
                    view: LoginView,
                    defaultTemplate: {
                        name: 'login_register_login.tpl',
                        displayName: 'Login Default',
                        thumbnail: Utils.getThemeAbsoluteUrlOfNonManagedResources('img/default-layout-login.png')
                    }
                });
            }
            return LoginRegisterComponent(application);
        }
    };
    return LoginRegister;
});

//# sourceMappingURL=LoginRegister.js.map
