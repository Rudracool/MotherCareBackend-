/*
    © 2020 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define("CMSadapter.Impl.ThemeCustomizerPreview", ["require", "exports", "underscore", "Utils", "jQuery", "Url", "Environment", "sass"], function (require, exports, _, Utils, jQuery, Url_1, Environment_1, Sass) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EDITABLE_REGEX = /\/\*\s+<<\s+var:([^\s]+)\s+\*\/\s+([^\/]+)\s+\/\*\s+>>\s+\*\//gi;
    var ESCAPED_INTERPOLATION_REGEX = /\\#{/gi;
    var VARIABLE_REGEX = /\$[A-Za-z0-9_-]*|([_a-zA-Z][A-Za-z0-9_-]*)\s*\(/g;
    var FUNCTION_WHITELIST = [
        'rgb',
        'rgba',
        'red',
        'green',
        'blue',
        'mix',
        'hsl',
        'hsla',
        'hue',
        'saturation',
        'lightness',
        'adjust-hue',
        'lighten',
        'darken',
        'saturate',
        'desaturate',
        'grayscale',
        'complement',
        'invert',
        'alpha',
        'rgba',
        'opacify',
        'transparentize',
        'adjust-color',
        'scale-color',
        'change-color',
        'ie-hex-str',
        'unquote',
        'quote',
        'str-length',
        'str-insert',
        'str-index',
        'str-slice',
        'to-upper-case',
        'to-lower-case',
        'percentage',
        'round',
        'ceil',
        'floor',
        'abs',
        'min',
        'max',
        'random',
        'length',
        'nth',
        'set-nth',
        'join',
        'append',
        'zip',
        'index',
        'list-separator',
        'is-bracketed',
        'map-get',
        'map-merge',
        'map-remove',
        'map-keys',
        'map-values',
        'map-has-key',
        'keywords',
        'selector-nest',
        'selector-append',
        'selector-extend',
        'selector-replace',
        'selector-unify',
        'is-superselector',
        'simple-selectors',
        'selector-parse',
        'feature-exists',
        'variable-exists',
        'global-variable-exists',
        'function-exists',
        'mixin-exists',
        'content-exists',
        'inspect',
        'type-of',
        'unit',
        'unit-less',
        'comprable',
        'call',
        'get-function',
        'if',
        'unique-id',
        'fade_in',
        'expression',
        'calc'
    ];
    var URL_REGEX = /url\(([^)]+)(\))/g;
    var CMSAdapterImplThemeCustomizerPreview = /** @class */ (function () {
        function CMSAdapterImplThemeCustomizerPreview(application, CMS) {
            this.variablesByName = {};
            this.applicationName = application.getName();
            Sass.setWorkerUrl(Utils.getAbsoluteUrl('javascript/sass.worker.js'));
            this.CMS = CMS;
            this.sassCompiler = null;
            this.previewCSS = '';
            this.originalPreviewCSS = '';
            this.originalChangedVariables = {};
            // Ordered list, if element A depends of B, A will appear first
            this.completeSetOfVariablesInOrder = [];
            this.toProcess = null;
            this.isCompiling = false;
            // URL of the css with the metadata
            this.stylesheetHref = '';
            // variables used to synchronize CSS reloading
            this.reloadCSSRequestId = null;
            this.listenForCMS();
        }
        CMSAdapterImplThemeCustomizerPreview.prototype.listenForCMS = function () {
            var _this = this;
            var SC = Environment_1.Environment.getSC();
            if (SC.ENVIRONMENT.isExtended && SC.ENVIRONMENT.embEndpointUrl) {
                this.CMS.on('theme:config:get', function (promise) {
                    _this.loadPreviewEnvironment(CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise));
                });
                this.CMS.on('theme:styles:overrideCss', function (promise, changedVariables) {
                    if (_.size(changedVariables) > 0) {
                        _this.toProcess = {
                            promise: CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise),
                            changedVariables: changedVariables
                        };
                        _this.previewChangedVariables();
                    }
                    else {
                        // Restore theme defaults
                        _this.restoreThemeDefaults(CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise));
                    }
                });
                this.CMS.on('theme:styles:save', function (promise, changedVariables, skinId) {
                    _this.saveThemeStyles(CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise), changedVariables, skinId);
                });
                this.CMS.on('theme:styles:revertCss', function (promise) {
                    // cancel button click
                    _this.themeRevertCss(CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise));
                });
                this.CMS.on('theme:skins:add', function (promise, skin) {
                    _this.addSkin(CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise), skin);
                });
                this.CMS.on('theme:skins:remove', function (promise, skinId) {
                    _this.removeSkin(CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise), skinId);
                });
                this.CMS.on('theme:skins:edit', function (promise, skin) {
                    _this.editSkin(CMSAdapterImplThemeCustomizerPreview.wrapForLogging(promise), skin);
                });
            }
        };
        /**
         * By calling this method the sass.js compiler is going to be loaded as well as
         * the css+metadata for the current application(shopping, my account, checkout)
         * This method should be triggered when SMT admin is opened
         **/
        CMSAdapterImplThemeCustomizerPreview.prototype.loadPreviewEnvironment = function (promise) {
            // Prevent to get the css url when edition is canceled
            if (!this.stylesheetHref) {
                this.setStylesheetHref();
            }
            var loadedCSS;
            var self = this;
            // Load and add the css with metadata to the DOM
            var variablesCalculatedValuePromise = jQuery
                .ajax({
                url: self.stylesheetHref,
                dataType: 'text'
            })
                .then(function (css) {
                loadedCSS = css;
                var variablesMetadata = CMSAdapterImplThemeCustomizerPreview.extractVariablesMetadata(css);
                self.completeSetOfVariablesInOrder = self.identifyNonCompilableVariables(self.getDependenciesInOrder(variablesMetadata.values));
                self.setVariablesByName();
                self.setVariablesParent(self.completeSetOfVariablesInOrder);
                return variablesMetadata;
            });
            var SC = Environment_1.Environment.getSC();
            var themeDataPromise = jQuery
                .ajax(SC.ENVIRONMENT.embEndpointUrl)
                .then(function (themeData) {
                self.saveEndpoint = themeData.saveEndpoint;
                self.compileEndpoint = themeData.compileEndpoint;
                self.skinsEndpoint = themeData.skinsEndpoint;
                return themeData;
            });
            jQuery
                .when(variablesCalculatedValuePromise, themeDataPromise)
                .then(function (variablesMetadata, themeData) {
                var areEditableVariables = _.findWhere(self.completeSetOfVariablesInOrder, {
                    editable: true
                });
                if (areEditableVariables) {
                    self.applyLoadedCSS(loadedCSS, themeData.editedSettings)
                        .then(function (calculatedVariablesValue) {
                        // Used if theme edition is canceled
                        self.originalPreviewCSS = self.previewCSS;
                        self.originalChangedVariables = themeData.editedSettings;
                        // Remove defaults css from the dom, all stylesheets in the header are
                        // going to be removed
                        self.removeDefaultStyles();
                        var themeSettings = {
                            skins: themeData.skins,
                            userSkins: themeData.userSkins,
                            formData: {
                                values: variablesMetadata.values,
                                structure: variablesMetadata.groups,
                                warnings: variablesMetadata.warnings
                            },
                            editedSettings: themeData.editedSettings,
                            currentSettings: calculatedVariablesValue
                        };
                        var activeSkin = _.find(themeData.userSkins, function (skin) { return skin.current === true; });
                        if (activeSkin) {
                            themeSettings.skinId = activeSkin.id;
                        }
                        promise.resolve(themeSettings);
                    })
                        .fail(function (error) {
                        promise.reject({
                            errors: "Error loading or processing metadata. Details: " + JSON.stringify(error)
                        });
                    });
                }
                else {
                    // if there are not editable variables, the theme is not editable
                    promise.resolve({});
                }
            })
                .fail(function (error) {
                promise.reject({
                    errors: "Error loading or processing metadata. Details: " + JSON.stringify(error)
                });
            });
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.setVariablesParent = function (variables, parent) {
            var _this = this;
            variables.forEach(function (variable) {
                if (parent) {
                    if (!_this.variablesByName[variable.name].parents) {
                        _this.variablesByName[variable.name].parents = {};
                    }
                    _this.variablesByName[variable.name].parents[parent] = true;
                }
                if (variable.derived) {
                    _this.setVariablesParent(variable.derived, variable.name);
                }
            });
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.setVariablesByName = function () {
            for (var i = this.completeSetOfVariablesInOrder.length - 1; i >= 0; i--) {
                var variable = this.completeSetOfVariablesInOrder[i];
                this.variablesByName[variable.name] = variable;
            }
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.themeRevertCss = function (promise) {
            this.discardReload();
            this.applyLoadedCSS(this.originalPreviewCSS, this.originalChangedVariables)
                .then(promise.resolve)
                .fail(function (error) {
                promise.reject({
                    errors: "Error reverting the changes. Details: " + JSON.stringify(error)
                });
            });
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.previewChangedVariables = function () {
            if (this.toProcess !== null && !this.isCompiling) {
                this.isCompiling = true;
                var self_1 = this;
                var promise_1 = this.toProcess.promise;
                var changedVariables = this.toProcess.changedVariables;
                this.toProcess = null;
                // The back-end compilation needs to be planned before starting fron-end
                // compilation because of concurrency management
                this.themeStylesReloadValues(changedVariables);
                var reloadCSSRequestId_1 = this.reloadCSSRequestId;
                this.getVariablesCalculatedValue(changedVariables, true)
                    .then(function (variablesComputedValue) {
                    if (self_1.toProcess === null) {
                        var newCSS = self_1.replaceVariablesValueOnPreviewCSS(variablesComputedValue);
                        self_1.applyPreviewCSS(newCSS);
                        promise_1.resolve(self_1.getEditableVariablesOnly(variablesComputedValue));
                    }
                })
                    .fail(function (error) {
                    if (self_1.toProcess === null) {
                        // if the front-end compilation fails, the back-end compilation
                        // should be canceled
                        if (reloadCSSRequestId_1 === self_1.reloadCSSRequestId) {
                            self_1.discardReload();
                        }
                        promise_1.reject({
                            errors: "Error previewing. Details: " + JSON.stringify(error)
                        });
                    }
                })
                    .always(function () {
                    self_1.isCompiling = false;
                    self_1.previewChangedVariables();
                });
            }
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.saveThemeStyles = function (promise, changedVariables, skinId) {
            var self = this;
            var callbacks = {
                then: function (variablesValue) {
                    promise.resolve(variablesValue);
                    // Used if theme edition is canceled
                    self.originalPreviewCSS = self.previewCSS;
                    self.originalChangedVariables = changedVariables;
                },
                fail: function (error) {
                    promise.reject({
                        errors: "Error saving the theme. Details: " + JSON.stringify(error)
                    });
                }
            };
            self.reloadCSS(changedVariables, true, callbacks, skinId);
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.addSkin = function (promise, skin) {
            var endpoint = Utils.deepCopy(this.skinsEndpoint);
            endpoint.data.operation = 'create';
            endpoint.data.name = skin.name;
            endpoint.data.values = JSON.stringify(skin.values);
            jQuery
                .ajax(endpoint)
                .then(function (response) {
                if (response.header && response.header.status.code !== 'SUCCESS') {
                    promise.reject({
                        errors: "Error loading or processing metadata. Details: " + JSON.stringify(response)
                    });
                }
                else {
                    promise.resolve(response.result.skin_id);
                }
            })
                .fail(function (error) {
                promise.reject({
                    errors: "Error loading or processing metadata. Details: " + JSON.stringify(error)
                });
            });
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.restoreThemeDefaults = function (promise) {
            var self = this;
            var callbacks = {
                then: function (variablesValue) {
                    promise.resolve(variablesValue);
                },
                fail: function (error) {
                    promise.reject({
                        errors: "Error restoring theme defaults. Details:" + JSON.stringify(error)
                    });
                }
            };
            self.reloadCSS({}, false, callbacks);
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.reloadCSS = function (changedVariables, save, callbacks, skinId) {
            var self = this;
            var endPoint = save ? this.saveEndpoint : this.compileEndpoint;
            if (save && skinId) {
                endPoint.data.skin_id = skinId;
            }
            // Build endpoint url
            endPoint.data.skin = JSON.stringify(changedVariables);
            endPoint.data.app = this.applicationName.toLowerCase();
            // discard reloadCSS or planned reloadCSS
            self.discardReload();
            var reloadCSSRequestId = self.reloadCSSRequestId;
            function doIfIsLastReloadExec(fn) {
                reloadCSSRequestId === self.reloadCSSRequestId && fn();
            }
            var promise = jQuery.ajax(endPoint).then(function (response) {
                if (response.header && response.header.status.code !== 'SUCCESS') {
                    if (callbacks && callbacks.fail) {
                        doIfIsLastReloadExec(function () {
                            callbacks.fail(response);
                        });
                    }
                }
                else {
                    doIfIsLastReloadExec(function () {
                        self.applyLoadedCSS(response.css, changedVariables).then(function (variablesValue) {
                            if (callbacks && callbacks.then) {
                                callbacks.then(variablesValue);
                            }
                        });
                    });
                }
            });
            if (callbacks) {
                if (callbacks.fail) {
                    promise.fail(function (xhr, textStatus, errorThrown) {
                        doIfIsLastReloadExec(function () {
                            callbacks.fail(textStatus + "--" + errorThrown);
                        });
                    });
                }
                if (callbacks.always) {
                    promise.always(function (result) {
                        doIfIsLastReloadExec(function () {
                            callbacks.always(result);
                        });
                    });
                }
            }
        };
        /**
         * After previewing the changed variables a server side compilation is performed,
         * this method triggers that compilation after a wait time. If there is a pending
         * server side compilation, it will be canceled an rescheduled a new one
         */
        CMSAdapterImplThemeCustomizerPreview.prototype.themeStylesReloadValues = function (changedVariables) {
            var self = this;
            // discard reloadCSS or planned reloadCSS
            this.discardReload();
            self.reloadCSSRequestId = setTimeout(function () {
                var callbacks = {
                    then: function (variablesValue) {
                        self.CMS.trigger('theme:styles:reloadValues', {
                            errors: null,
                            values: variablesValue
                        });
                    },
                    fail: function (error) {
                        self.CMS.trigger('theme:styles:reloadValues', {
                            errors: "Error reloading values from server. Details: " + JSON.stringify(error)
                        });
                    }
                };
                self.reloadCSS(changedVariables, false, callbacks);
            }, 7000);
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.fixRelativeURLs = function (css, baseURL) {
            var output = css.replace(URL_REGEX, function (_matched, relative) {
                // remove spaces, single and double quotes
                relative = relative.trim();
                if (relative[0] === "'" || relative[0] === '"') {
                    relative = relative.substr(1, relative.length - 2);
                }
                return "url(" + new Url_1.Url(relative).resolve(baseURL).toString() + ")";
            });
            return output;
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.getEditableVariablesOnly = function (variablesCalculatedValue) {
            // Filter the variables to return only the editable ones
            var editableVariables = {};
            _.each(this.completeSetOfVariablesInOrder, function (variable) {
                if (variable.editable && variablesCalculatedValue[variable.name] !== undefined) {
                    editableVariables[variable.name] = variablesCalculatedValue[variable.name];
                }
            });
            return editableVariables;
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.applyPreviewCSS = function (css) {
            var tagId = 'nsCSSWithMetadata';
            var styleTag = document.getElementById(tagId);
            if (!styleTag) {
                styleTag = window.document.createElement('style');
                styleTag.id = tagId;
                window.document.body.appendChild(styleTag);
            }
            styleTag.innerHTML = css;
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.applyLoadedCSS = function (css, changedVariables) {
            var self = this;
            this.previewCSS = this.fixRelativeURLs(css, this.stylesheetHref);
            this.applyPreviewCSS(this.previewCSS);
            var variablesValuesFromCSS = this.extractVariablesValuesFromCSS(this.previewCSS);
            this.setVariablesDefaultValue(variablesValuesFromCSS);
            return this.getVariablesCalculatedValue(changedVariables).then(function (calculatedVariablesValue) {
                return self.getEditableVariablesOnly(calculatedVariablesValue);
            });
        };
        CMSAdapterImplThemeCustomizerPreview.extractVariablesMetadata = function (css) {
            // extract values
            var start = css.indexOf('/* values */');
            var metadata = css.substring(start + 16);
            var end = metadata.indexOf('*/');
            var values = metadata.substring(0, end);
            // extract groups
            start = metadata.indexOf('/* groups */');
            metadata = metadata.substring(start + 16);
            end = metadata.indexOf('*/');
            var groups = metadata.substring(0, end);
            // extract warnings
            var warnings = '';
            start = metadata.indexOf('/* warnings */');
            if (start >= 0) {
                metadata = metadata.substring(start + 18);
                end = metadata.indexOf('*/');
                warnings = metadata.substring(0, end);
            }
            return {
                values: JSON.parse(this.unescapeNumberSign(values)).values,
                groups: JSON.parse(this.unescapeNumberSign(groups)).groups,
                warnings: warnings
            };
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.getAffectedVariables = function (editedVariables) {
            var affectedVariables = [];
            var derivedVars = {};
            function addToDerivedVars(derivedVar) {
                derivedVars[derivedVar.name] = true;
            }
            for (var i = this.completeSetOfVariablesInOrder.length - 1; i >= 0; i--) {
                var variableName = this.completeSetOfVariablesInOrder[i].name;
                // Avoid to add duplicated variables in "affectedVariables" array
                if (editedVariables[variableName] !== undefined ||
                    derivedVars[variableName] !== undefined) {
                    affectedVariables.push(this.completeSetOfVariablesInOrder[i]);
                    _.each(this.completeSetOfVariablesInOrder[i].derived, addToDerivedVars);
                }
            }
            return affectedVariables.reverse();
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.buildDummySass = function (affectedVariables, editedVariables) {
            var self = this;
            var wrapFunction = '@function quotes-verbatim($value) {\n' +
                '  @if (type-of($value) == "string") {\n' +
                "    // SASS doesn't have str-is-quoted, and quoted and unquoted strings compare\n" +
                '    // equal. I noticed that list expressions give away whether a string is quoted,\n' +
                "    // though, so here's how we can return a string with explicit quotes.\n" +
                '    $list-expr: "#{inspect(($value, ""))}";\n' +
                '    @return str-slice($list-expr, 0, str-length($list-expr) - 4);\n' +
                '  }\n' +
                '  @else {\n' +
                '    @return $value;\n' +
                '  }\n' +
                '}\n' +
                '  \n' +
                '@function wrap($name, $value) {\n' +
                '  @if (outputstyle() != "COMPRESSED") {\n' +
                '    @if ($value) {\n' +
                '      @return unquote("/* << var:" + $name + " */ " + quotes-verbatim($value) + " /* >> */");\n' +
                '    }\n' +
                '    @return null;\n' +
                '  }\n' +
                '  @return $value;\n' +
                '};';
            var variablesDeclaration = '';
            var dummyClassBody = '';
            for (var i = affectedVariables.length - 1; i >= 0; i--) {
                var variableName = affectedVariables[i].name;
                var variableValue = void 0;
                if (editedVariables[variableName] !== undefined) {
                    variableValue = editedVariables[variableName];
                }
                else if (affectedVariables[i].nonCompilable) {
                    // use the value in the css
                    variableValue = affectedVariables[i].defaultValue;
                }
                else {
                    variableValue = affectedVariables[i].expr;
                }
                if (variableValue !== undefined) {
                    variablesDeclaration += self.buildSASSVariableDeclaration(variableName, variableValue);
                    dummyClassBody += self.buildSASSVariableUsageStatement(variableName);
                }
            }
            return wrapFunction + variablesDeclaration + "\n.dummyClass {\n" + dummyClassBody + "\n}";
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.buildDummyCSS = function (sassStr) {
            var self = this;
            var promise = jQuery.Deferred();
            var retried = false;
            function compilerHandler(compilerOutput) {
                if (compilerOutput.status === 0) {
                    promise.resolve(compilerOutput.text);
                }
                else if (!retried) {
                    retried = true;
                    self.getSassCompiler(true).compile(sassStr, compilerHandler);
                }
                else {
                    promise.reject(compilerOutput.message
                        ? compilerOutput.message
                        : 'Unexpected error compiling front-end SASS variables');
                }
            }
            self.getSassCompiler().compile(sassStr, compilerHandler);
            return promise;
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.extractVariablesValuesFromCSS = function (css) {
            var result;
            var variables = {};
            while ((result = EDITABLE_REGEX.exec(css)) !== null) {
                var name_1 = result[1];
                variables[name_1] = result[2];
            }
            return variables;
        };
        /**
         * @method replaceVariablesValueOnPreviewCSS
         * @param {variableName: String} editedVariables
         * @returns {string} copy the the attribute "previewCSS" with the supplied values changed
         */
        CMSAdapterImplThemeCustomizerPreview.prototype.replaceVariablesValueOnPreviewCSS = function (editedVariables) {
            var output = this.previewCSS.replace(EDITABLE_REGEX, function (matched, name) {
                var editedValue = editedVariables[name] !== undefined;
                if (!editedValue) {
                    return matched;
                }
                return "/* << var:" + name + " */ " + editedVariables[name] + " /* >> */";
            });
            return output;
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.addMissingDependenciesOfAffectedVariables = function (affectedVariables) {
            var _this = this;
            var variablesToCompile = [];
            var includedVariables = {};
            var addDependencies = function (variable) {
                if (!includedVariables[variable.name]) {
                    if (variable.parents) {
                        Object.keys(variable.parents).forEach(function (parentName) {
                            var parent = _this.variablesByName[parentName];
                            addDependencies(parent);
                        });
                    }
                    variablesToCompile.push(variable);
                    includedVariables[variable.name] = true;
                }
            };
            for (var i = affectedVariables.length - 1; i >= 0; i--) {
                addDependencies(affectedVariables[i]);
            }
            return variablesToCompile.reverse();
        };
        /**
         *    @method getVariablesCalculatedValue For each variable in the metadata compute his value
         *    using the supplied changes"
         *    @param changedVariables {Object} Map with all edited variables
         *    @return Promise The promise is resolved with an object with each variables and his
         *    calculated value
         * */
        CMSAdapterImplThemeCustomizerPreview.prototype.getVariablesCalculatedValue = function (changedVariables, affectedsOnly) {
            var self = this;
            var variablesToCompile = affectedsOnly
                ? this.addMissingDependenciesOfAffectedVariables(this.getAffectedVariables(changedVariables))
                : this.completeSetOfVariablesInOrder;
            var sass = this.buildDummySass(variablesToCompile, changedVariables || {});
            return this.buildDummyCSS(sass).then(function (css) {
                return self.extractVariablesValuesFromCSS(css);
            });
        };
        /**
         * @method getDependenciesInOrder The method should be called only once, when the environment
         * is initialised
         * @param Array<Object> siblings SASS variables metadata
         * @return Array<Object> Ordered list, if element A depends of B, A will appear first
         * */
        CMSAdapterImplThemeCustomizerPreview.prototype.getDependenciesInOrder = function (siblings) {
            var orderedDependencies = [];
            function find(startIndex, array, elementName) {
                for (var i = startIndex; i < array.length; i++) {
                    if (array[i].name === elementName) {
                        return i;
                    }
                }
                return -1; // not found
            }
            function mergeBranches(branch1, branch2) {
                var branch1Index = 0;
                var branch2Index = 0;
                var mergeResult = [];
                var mergedElements = {};
                while (branch1Index < branch1.length || branch2Index < branch2.length) {
                    if (branch1Index < branch1.length) {
                        var searchedElementIndex = find(branch2Index, branch2, branch1[branch1Index].name);
                        if (searchedElementIndex >= 0) {
                            while (branch2Index <= searchedElementIndex) {
                                if (!mergedElements[branch2[branch2Index].name]) {
                                    mergeResult.push(branch2[branch2Index]);
                                    mergedElements[branch2[branch2Index].name] = true;
                                }
                                branch2Index++;
                            }
                        }
                        else if (!mergedElements[orderedDependencies[branch1Index].name]) {
                            mergeResult.push(orderedDependencies[branch1Index]);
                            mergedElements[orderedDependencies[branch1Index].name] = true;
                        }
                        branch1Index++;
                    }
                    else {
                        // add all elements in  branch2 that were not included yet
                        mergeResult = mergeResult.concat(branch2.slice(branch2Index));
                        branch2Index = branch2.length;
                    }
                }
                return mergeResult;
            }
            var self = this;
            _.each(siblings, function (sibling) {
                if (sibling.derived && sibling.derived.length) {
                    var branchOrderedDependencies = self.getDependenciesInOrder(sibling.derived);
                    if (orderedDependencies.length) {
                        // merge two sets of ordered dependencies
                        orderedDependencies = mergeBranches(orderedDependencies, branchOrderedDependencies);
                    }
                    else {
                        orderedDependencies = branchOrderedDependencies;
                    }
                }
            });
            return mergeBranches(orderedDependencies, siblings);
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.buildSASSVariableDeclaration = function (name, value) {
            return name + ":" + value + ";";
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.buildSASSVariableUsageStatement = function (name) {
            var cssPropertyName = name.substring(1);
            return "\t" + cssPropertyName + ": wrap('" + name + "', " + name + ");";
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.getSassCompiler = function (cleanUp) {
            if (cleanUp === void 0) { cleanUp = false; }
            if (!this.sassCompiler) {
                this.sassCompiler = new Sass();
            }
            else if (cleanUp) {
                this.sassCompiler.destroy();
                this.sassCompiler = new Sass();
            }
            return this.sassCompiler;
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.identifyNonCompilableVariables = function (variables) {
            var availableVariables = {};
            function setAsNotCompilable(variable) {
                variable.nonCompilable = true;
                _.each(variable.derived, function (derived) {
                    setAsNotCompilable(derived);
                });
            }
            function findInFunctionsWhiteList(func) {
                return _.find(FUNCTION_WHITELIST, function (validFunc) {
                    return validFunc === func;
                });
            }
            for (var i = variables.length - 1; i >= 0; i--) {
                var variable = variables[i];
                /* The $overrides variable should not be part of metadata, is used to apply
                 * new variables values during backend compilation, pre-processor is adding
                 * it so need's to be removed during frontend compilation*/
                if (variable.name === '$overrides') {
                    setAsNotCompilable(variable);
                }
                else if (!variable.nonCompilable) {
                    // if has not been labeled as not compilable yet, check the expression
                    // parse expression to extract variables and functions
                    var parsed = variable.expr.match(VARIABLE_REGEX);
                    if (parsed) {
                        for (var j = 0; j < parsed.length; j++) {
                            var member = parsed[j];
                            if (member[0] !== '$') {
                                // if is a function must exist in the white list
                                member = member.substring(0, member.indexOf('('));
                                var isValidFunc = findInFunctionsWhiteList(member);
                                if (!isValidFunc) {
                                    setAsNotCompilable(variable);
                                }
                            }
                            else if (!availableVariables[member]) {
                                // if is a variable must exist in "availableVariables"
                                setAsNotCompilable(variable);
                            }
                        }
                    }
                    if (!variable.nonCompilable) {
                        // set the variable as existing and compilable
                        availableVariables[variables[i].name] = true;
                    }
                }
            }
            return variables;
        };
        CMSAdapterImplThemeCustomizerPreview.unescapeNumberSign = function (str) {
            return str.replace(ESCAPED_INTERPOLATION_REGEX, '#{');
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.setVariablesDefaultValue = function (variablesDefaultValue) {
            _.each(this.completeSetOfVariablesInOrder, function (variable) {
                variable.defaultValue = variablesDefaultValue[variable.name];
            });
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.setStylesheetHref = function () {
            var stylesheets = jQuery('link[rel="stylesheet"]', window.document.head);
            // Build the path to the css with the metadata
            // Get a non IE url
            var stylesheetHref = _.find(stylesheets.get(), function (linkDomElement) {
                if (!linkDomElement.href.match(/((_\d+){2}\.css(\?.*)*)$/)) {
                    return true;
                }
                return false;
            });
            // Get the url of the production css without the extension
            stylesheetHref = stylesheetHref.href.match(/(.*)(\.css(\?.*)*)$/)[1];
            this.stylesheetHref = stylesheetHref.substring(0, stylesheetHref.lastIndexOf('/') + 1) + "smt_" + stylesheetHref.substring(stylesheetHref.lastIndexOf('/') + 1) + ".css?t=" + new Date().getTime();
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.removeDefaultStyles = function () {
            var stylesheets = jQuery('link[rel="stylesheet"]', window.document.head);
            var stylesheetHref = _.find(stylesheets.get(), function (linkDomElement) {
                return /_\d+\.css(\?.*)?$/.test(linkDomElement.href);
            });
            stylesheetHref.remove();
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.discardReload = function () {
            // discard reloadCSS or planned reloadCSS
            clearTimeout(this.reloadCSSRequestId);
            this.reloadCSSRequestId = _.uniqueId('id_');
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.removeSkin = function (promise, skinId) {
            var endpoint = Utils.deepCopy(this.skinsEndpoint);
            endpoint.data.operation = 'delete';
            endpoint.data.id = skinId;
            jQuery
                .ajax(endpoint)
                .then(function (response) {
                if (response.header && response.header.status.code !== 'SUCCESS') {
                    promise.reject({
                        errors: "Error loading or processing metadata. Details: " + JSON.stringify(response)
                    });
                }
                else {
                    promise.resolve();
                }
            })
                .fail(function (error) {
                promise.reject({
                    errors: "Error loading or processing metadata. Details: " + JSON.stringify(error)
                });
            });
        };
        CMSAdapterImplThemeCustomizerPreview.prototype.editSkin = function (promise, skin) {
            var endpoint = Utils.deepCopy(this.skinsEndpoint);
            endpoint.data.operation = 'edit';
            endpoint.data.id = skin.id;
            endpoint.data.name = skin.name;
            endpoint.data.values = JSON.stringify(skin.values);
            jQuery
                .ajax(endpoint)
                .then(function (response) {
                if (response.header && response.header.status.code !== 'SUCCESS') {
                    promise.reject({
                        errors: "Error loading or processing metadata. Details: " + JSON.stringify(response)
                    });
                }
                else {
                    promise.resolve();
                }
            })
                .fail(function (error) {
                promise.reject({
                    errors: "Error loading or processing metadata. Details: " + JSON.stringify(error)
                });
            });
        };
        CMSAdapterImplThemeCustomizerPreview.wrapForLogging = function (promise) {
            return {
                resolve: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    promise.resolve.apply(promise, args);
                },
                reject: function (error) {
                    promise.reject(error);
                    console.log('Theme customizer error: ', error);
                }
            };
        };
        return CMSAdapterImplThemeCustomizerPreview;
    }());
    exports.CMSAdapterImplThemeCustomizerPreview = CMSAdapterImplThemeCustomizerPreview;
});

//# sourceMappingURL=CMSadapter.Impl.ThemeCustomizerPreview.js.map
