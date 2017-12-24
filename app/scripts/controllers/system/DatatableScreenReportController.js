(function (module) {
    mifosX.controllers = _.extend(module, {
        DatatableScreenReportController: function (scope, resourceFactory, location, $http, API_VERSION, routeParams, $rootScope, $sce) {
            scope.fromEntityName = resourceFactory.getEntityFromDatatable();
            scope.fromEntityId = routeParams.entityId;

            if(scope.fromEntityName == "client"){
                scope.fromEntity = '?clientId=';
            }else if(scope.fromEntityName == "group"){
                scope.fromEntity = '?groupId=';
            }else if(scope.fromEntityName == "center"){
                scope.fromEntity = '?centerId=';
            }else if(scope.fromEntityName == "office"){
                scope.fromEntity = '?officeId=';
            }else if(scope.fromEntityName == "savingAccount"){
                scope.fromEntity = '?savings_accountId=';
            }else if(scope.fromEntityName == "loan"){
                scope.fromEntity = '?loanId=';
            }

            resourceFactory.templateResource.get({entityId: 2, typeId: 0}, function (data) {
                scope.datatableTemplateData = [];
                for (var i = 0; i < data.length; i++){
                    for (var j = 0; j < data[i].mappers.length; j++) {
                        if (data[i].mappers[j].mappervalue.includes('/' + routeParams.tableName + '/'))
                            scope.datatableTemplateData.push(data[i]);
                    }
                }
            });
            scope.print = function (template) {
                var templateWindow = window.open('', 'Screen Report', 'height=400,width=600');
                templateWindow.document.write('<html><head>');
                templateWindow.document.write('</head><body>');
                templateWindow.document.write(template);
                templateWindow.document.write('</body></html>');
                templateWindow.print();
                templateWindow.close();
            };
            scope.getDatatableTemplate = function (templateId) {
                scope.selectedTemplate = templateId;
                $http({
                    method: 'POST',
                    url: $rootScope.hostUrl + API_VERSION + '/templates/' + templateId + scope.fromEntity + scope.fromEntityId,
                    data: {}
                }).then(function (data) {
                    scope.template = $sce.trustAsHtml(data.data);
                });
            };
        }
    });
    mifosX.ng.application.controller('DatatableScreenReportController', ['$scope', 'ResourceFactory', '$location', '$http', 'API_VERSION', '$routeParams', '$rootScope', '$sce', mifosX.controllers.DatatableScreenReportController]).run(function ($log) {
        $log.info("DatatableScreenReportController initialized");
    });
}(mifosX.controllers || {}));
