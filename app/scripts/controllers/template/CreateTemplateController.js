/*global mifosX _  CKEDITOR */
(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateTemplateController: function (scope, resourceFactory, location, $rootScope) {
            scope.mappers = [];
            scope.formData = {};
            scope.datatableTemplateKeys = [];
            resourceFactory.templateResource.getTemplateDetails({resourceType: 'template'}, function (data) {
                scope.template = data;
                scope.advanceOption = 'false';
                scope.oneAtATime = 'true';
                scope.formData.entity = data.entities[0].id;
                scope.formData.type = data.types[0].id;
                scope.templateKeyEntity = "Client";
                scope.clientKeys();
                scope.mappers.push({
                    mappersorder: 0,
                    mapperskey: "client",
                    mappersvalue: "clients/{{clientId}}?tenantIdentifier=" + $rootScope.tenantIdentifier,
                    defaultAddIcon: 'true'
                });
            });

            scope.clientKeys = function () {
                scope.templateKeys = ["{{client.accountNo}}", "{{client.status.value}}", "{{client.fullname}}",
                    "{{client.displayName}}", "{{client.officeName}}", "{{#client.groups}}", "{{/client.groups}}"];
                scope.templateEntity = [
                    {"entityName": "Client",
                        "templateKeys": scope.templateKeys}
                ];
                CKEDITOR.instances.templateeditor.setData('');
            };

            scope.loanKeys = function () {
                CKEDITOR.instances.templateeditor.setData('');
                scope.loanTemplateKeys = ["{{loan.accountNo}}", "{{loan.status.value}}", "{{loan.loanProductId}}",
                    "{{loan.loanProductName}}", "{{loan.loanProductDescription}}"];
                scope.repaymentTemplateKeys = ["{{loan.repaymentSchedule.loanTermInDays}}", "{{loan.repaymentSchedule.totalPrincipalDisbursed}}",
                    "{{loan.repaymentSchedule.totalPrincipalExpected}}", "{{loan.repaymentSchedule.totalPrincipalPaid}}",
                    "{{loan.repaymentSchedule.totalInterestCharged}}", "{{loan.repaymentSchedule.totalFeeChargesCharged}}",
                    "{{loan.repaymentSchedule.totalPenaltyChargesCharged}}", "{{loan.repaymentSchedule.totalWaived}}",
                    "{{loan.repaymentSchedule.totalWrittenOff}}", "{{loan.repaymentSchedule.totalRepaymentExpected}}",
                    "{{loan.repaymentSchedule.totalRepayment}}", "{{loan.repaymentSchedule.totalPaidInAdvance}}",
                    "{{loan.repaymentSchedule.totalPaidLate}}", "{{loan.repaymentSchedule.totalOutstanding}}"];
                scope.templateEntity = [
                    {"entityName": "Loan",
                        "templateKeys": scope.loanTemplateKeys
                    },
                    {"entityName": "Repayment Schedule",
                        "templateKeys": scope.repaymentTemplateKeys
                    }
                ];
            };

            //TODO
            scope.datatablesKeys = function(){
                CKEDITOR.instances.templateeditor.setData('');
                scope.templateEntity.splice(0,scope.templateEntity.length);
                for(i=0; i<scope.template.datatablesKeys.length; i++){
                 scope.datatableTemplateKeys[i] = scope.template.datatablesKeys[i];
                    scope.templateEntity.push({"entityName": scope.datatableTemplateKeys[i].registeredTableName,
                        "templateKeys": scope.datatableTemplateKeys[i].templateKeys});
                }

            };

            scope.entityChange = function (entityId) {
                scope.mappers.splice(0, 1);
                if (entityId == 1) {
                    scope.mappers.push({
                        mappersorder: 0,
                        mapperskey: "loan",
                        mappersvalue: "loans/{{loanId}}?associations=all&tenantIdentifier=" + $rootScope.tenantIdentifier,
                        defaultAddIcon: 'true'
                    });
                    scope.loanKeys();
                    scope.templateKeyEntity = "Loan";
                } else if(entityId == 0){
                    scope.templateKeyEntity = "Client";
                    scope.mappers.push({
                        mappersorder: 0,
                        mapperskey: "client",
                        mappersvalue: "clients/{{clientId}}?tenantIdentifier=" + $rootScope.tenantIdentifier,
                        defaultAddIcon: 'true'
                    });
                    scope.clientKeys();
                }else if(entityId == 2){
                    scope.templateKeyEntity = "datatable";
                    scope.datatablesKeys();
                    scope.mappers.push({
                        mappersorder: 0,
                        mapperskey: scope.datatableTemplateKeys[0].templateMapper.mapperKey,
                        mappersvalue: scope.datatableTemplateKeys[0].templateMapper.mapperValue+ $rootScope.tenantIdentifier,
                        defaultAddIcon: 'true'
                    });

                }
            };

            scope.templateKeySelected = function (templateKey) {
                CKEDITOR.instances.templateeditor.insertText(templateKey);
            };

            scope.addMapperKeyValue = function () {
                scope.mappers.push({
                    mappersorder: scope.mappers.length,
                    mapperskey: "",
                    mappersvalue: ""
                });
            };

            scope.deleteMapperKeyValue = function (index) {
                scope.mappers.splice(index, 1);
            };

            scope.updateMapper = function(entityName){
                if(scope.templateKeyEntity == "datatable"){
                    found = false;
                    i = 0;
                    while(!found && i <= scope.template.datatablesKeys.length){
                        if(scope.datatableTemplateKeys[i].registeredTableName == entityName){
                            scope.mappers[0].mappersvalue = scope.datatableTemplateKeys[i].templateMapper.mapperValue+ $rootScope.tenantIdentifier;
                            found = true;
                        }else
                            i++;
                    }
                }
            };

            scope.advanceOptionClick = function () {
                if (scope.advanceOption == 'false') {
                    scope.advanceOption = 'true';
                } else {
                    scope.advanceOption = 'false';
                }
            };

            scope.submit = function () {
                for (var i in scope.mappers) {
                    delete scope.mappers[i].defaultAddIcon;
                }
                this.formData.mappers = scope.mappers;
                this.formData.text = CKEDITOR.instances.templateeditor.getData();
                resourceFactory.templateResource.save(this.formData, function (data) {
                    location.path('/viewtemplate/' + data.resourceId);
                });
            };


        }
    });
    mifosX.ng.application.controller('CreateTemplateController', ['$scope', 'ResourceFactory', '$location', '$rootScope', mifosX.controllers.CreateTemplateController]).run(function ($log) {
        $log.info("CreateTemplateController initialized");
    });
}(mifosX.controllers || {}));
