let app = angular.module("contactApp", []);

app.controller("contactController", ($scope, $http) => {

    $scope.success = false;
    $scope.update_button = true;
    $scope.cancel_button = true;

    $scope.getData = () => {
        $http({
            method: "GET",
            url: "/contact_list/get"
        }).then( (response) => {
            $scope.information = response.data;
        });
    };

    $scope.insertContact = () => {

        $scope.process_value = "Insert";

        $scope.checkInputValidations($scope.contact, $scope.process_value);

    };

    $scope.editContact = (contact) => {

        $scope.update_button = false;
        $scope.cancel_button = false;
        $scope.insert_button = true;
        
        $scope.process_value = "Update";
        $scope.contact = angular.copy(contact);

    };

    $scope.updateContact = () => {

        $scope.checkInputValidations($scope.contact, $scope.process_value);

    };

    $scope.deleteContact = (id) => {
        
        $http({
            method: "DELETE",
            url: "/contact_list/"+id
        }).then( (response) => {
            // console.log(response);
            if(response.data.status == "Success") {
                $scope.getData();
                $scope.success = true;
                $scope.success_message = response.data.message;
            }
        });

    };

    $scope.cancelButton = () => {
        $scope.update_button = true;
        $scope.cancel_button = true;
        $scope.insert_button = false;
        $scope.contact = {};
    };

    $scope.checkInputValidations = (contact, processValue) => {

        if ( typeof contact !== 'undefined' ) {
            
            if ( ( typeof contact.name === 'undefined' ) || ( typeof contact.email === 'undefined' ) || ( typeof contact.number === 'undefined' ) ) {

                if ( typeof contact.name === 'undefined' ) {
                    angular.element( document.querySelector('.in_name') ).addClass('redInputBorder');
                } else { 
                    angular.element( document.querySelector('.in_name') ).addClass('defaultInputBorder');
                }
    
                if ( typeof contact.email === 'undefined' ) {
                    angular.element( document.querySelector('.in_email') ).addClass('redInputBorder');
                } else { 
                    angular.element( document.querySelector('.in_email') ).addClass('defaultInputBorder');
                }
    
                if ( typeof contact.number === 'undefined' ) {
                    angular.element( document.querySelector('.in_number') ).addClass('redInputBorder');
                } else { 
                    angular.element( document.querySelector('.in_number') ).addClass('defaultInputBorder');
                }

            } else {

                angular.element( document.querySelector('.in_name') ).addClass('defaultInputBorder');
                angular.element( document.querySelector('.in_email') ).addClass('defaultInputBorder');
                angular.element( document.querySelector('.in_number') ).addClass('defaultInputBorder');

                let contactName = contact.name;
                let contactEmail = contact.email;
                let contactNumber = contact.number;
                
                $http({
                    method: "POST",
                    url: "/contact_list/insertupdate",
                    data: {
                        id: contact._id,
                        name: contactName,
                        email: contactEmail,
                        number: contactNumber,
                        process: processValue
                    }
                }).then( (response) => {
                    console.log(response.data);
                    if(response.data.status == "Success") {
                        $scope.contact = {};
                        $scope.getData();
                        $scope.success = true;
                        $scope.success_message = response.data.message;

                        $scope.insert_button = false;
                        $scope.cancel_button = true;
                        $scope.update_button = true;
                    }
                });
                
            }
        
            
        } else {
            angular.element( document.querySelector('.in_name') ).addClass('redInputBorder');
            angular.element( document.querySelector('.in_email') ).addClass('redInputBorder');
            angular.element( document.querySelector('.in_number') ).addClass('redInputBorder');
            console.log("Please don't leave fields empty.");
        }
    };

});