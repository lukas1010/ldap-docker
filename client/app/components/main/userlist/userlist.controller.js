angular.module('ldap-um.components.main.userlist')
    .controller('UserListController', UserListController);

UserListController.$inject = ['$state', '$localStorage', '$sessionStorage','UserlistService','NotificationService','$rootScope'];
function UserListController($state, $localStorage, $sessionStorage, UserlistService,NotificationService,$rootScope) {

    var vm = this;
    
    vm.fieldList = UserlistService.listFields;

    vm.isShowPerpageItems= false;

    vm.selectNumPerPage = selectNumPerPage;
    vm.currentNumPerPage =25;
    vm.currentPage = 1;
    vm.editUser = editUser;
    vm.currentEditUser = {};
    vm.isChecked = isChecked;
    vm.includeRole = includeRole;
    vm.updateUser = updateUser;
    vm.goLeft = goLeft;
    vm.goRight = goRight;
    vm.deleteUser = deleteUser;
    vm.updatePassword = updatePassword;
    vm.addUser = {}
    vm.addUser.objectClass = ['inetOrgPerson','organizationalPerson','person','top'];
    vm.includeAddUserRole = includeAddUserRole;
    vm.addNewUser = addNewUser;
    vm.cancelAddUser = cancelAddUser;
    vm.isMissingField = false;
    vm.isPasswordConfirm = true;
    vm.sortBy = vm.fieldList[0].bindField;
    vm.reverse = true;
    vm.sort = sort;
    vm.minPwLength = UserlistService.passwordLength;
    vm.startOfPage = 1;
    vm.endOfPage = vm.currentPage*vm.currentNumPerPage;
    vm.gotoLastPage = gotoLastPage;

    //number min max

    vm.min = UserlistService.numberRange.min;
    vm.max = UserlistService.numberRange.max;
    vm.searchFilter = filter;

    function filter () {
        if (vm.search&&vm.search.length>0) {
            var ret = [];
            for (var i in vm.datas) {
                var temp = JSON.stringify(vm.datas[i])
                // console.log(temp.indexOf(vm.search))
                if (temp.indexOf(vm.search)>-1) {
                    ret.push(vm.datas[i]) ;
                }
            }

            vm.showDatas = ret;
            vm.startOfPage = 1;
            vm.currentPage = 1;
            vm.lastPage = Math.ceil(vm.showDatas.length/vm.currentNumPerPage);
            vm.endOfPage = vm.showDatas.length < vm.currentNumPerPage ? vm.showDatas.length : vm.currentNumPerPage;
        } else {
            vm.showDatas = vm.datas;
        }    
    }




    init();

    function init () {
        UserlistService.getUsers({sizeLimit:vm.currentNumPerPage},function(err, data){
            if (err) console.log(err);
            else {
                vm.datas = data.data;
                vm.showDatas = data.data;

                showData();
            }
        })
    }

    function sort (field) {
        if (field.type == 'string') {
            if (vm.sortBy != field.bindField) {
                vm.sortBy = field.bindField;
                vm.reverse = true;
            } else {
                vm.reverse = !vm.reverse;
            }
                
        }
    }

    function cancelAddUser () {
        vm.addUser = {}
        vm.addUser.objectClass = ['inetOrgPerson','organizationalPerson','person','top'];
        vm.isEntryExists = false;
    }


    function addNewUser () {

        if (addUserValidation()){
            console.log(vm.addUser);
            UserlistService.addNewUser(vm.addUser,function(err, res){
                if (err) console.log(err);
                if (err&&err.data.lde_message=="Entry Already Exists") {
                    vm.isEntryExists = true;

                }
                else {

                    vm.isEntryExists = false;
                    $('.bs-example-modal-md2').modal('hide');
                    NotificationService.success('New user is added.')

                    vm.addUser = {}
                    vm.addUser.objectClass = ['inetOrgPerson','organizationalPerson','person','top'];
                    init();
                }
            })
        }
        
    }

    function addUserValidation() {
        if (vm.addUser.uid&&vm.addUser.cn&&vm.addUser.sn&&vm.addUser.userPassword&&vm.addUserConfirmPW&&vm.addUser.uid.length>0&&vm.addUser.cn.length>0&&vm.addUser.sn.length>0&&vm.addUser.userPassword.length>0&&vm.addUserConfirmPW.length>0) {
            vm.isMissingField = false;
        } else {
            vm.isMissingField = true;
            return false;
        }

        if (vm.addUser.userPassword!==vm.addUserConfirmPW||vm.addUser.userPassword.length<UserlistService.passwordLength) {
            vm.isPasswordConfirm = false;
            return false;
        } else {
            vm.isPasswordConfirm = true;
            return true;
        }
    }


    function updatePassword (uid) {

        if (vm.editPassword&&vm.editPassword===vm.editPasswordConfirm) {
            UserlistService.updateUser({uid:uid,changes:{userPassword:vm.editPassword}},function(err,result){
                if (err) console.log(err);
                else {
                    vm.passwordErrorMessage = false;
                    vm.passwordMessage = 'Password is updated.'
                    init();
                }
            })
        } else {
            vm.passwordErrorMessage = 'Password does not match.'
        }

    }

    function deleteUser(uid) {
        UserlistService.deleteUser(uid,function(err, res){
            if (err) console.log(err);
            else {
                NotificationService.success('User is deleted.');
                init();
            }
        })
    }
    

    function goRight() {
        if (vm.currentPage*vm.currentNumPerPage<vm.showDatas.length) {
            vm.currentPage++;
            vm.startOfPage = (vm.currentPage-1)*vm.currentNumPerPage+1;
            vm.endOfPage = vm.currentPage*vm.currentNumPerPage < vm.showDatas.length ? vm.currentPage*vm.currentNumPerPage : vm.showDatas.length;
            showData();
        }
    }

    function gotoLastPage () {
        vm.currentPage = vm.lastPage;
        vm.startOfPage = (vm.currentPage-1)*vm.currentNumPerPage+1;
        vm.endOfPage = vm.currentPage*vm.currentNumPerPage < vm.showDatas.length ? vm.currentPage*vm.currentNumPerPage : vm.showDatas.length;
        showData();
    }

    function goLeft() {
        if (vm.currentPage>1) {
            vm.currentPage--;
            vm.startOfPage = (vm.currentPage-1)*vm.currentNumPerPage+1;
            vm.endOfPage = vm.currentPage*vm.currentNumPerPage < vm.showDatas.length ? vm.currentPage*vm.currentNumPerPage : vm.showDatas.length;
            showData();
        }
    }

    function showData () {
        vm.userList = [];
        
        vm.lastPage = Math.ceil(vm.showDatas.length/vm.currentNumPerPage);
        vm.endOfPage = vm.currentPage*vm.currentNumPerPage < vm.showDatas.length ? vm.currentPage*vm.currentNumPerPage : vm.showDatas.length;         
    }

    function selectNumPerPage(num) {
        vm.currentNumPerPage = num;
        vm.currentPage = 1;
        vm.startOfPage =1;
        vm.endOfPage = vm.endOfPage = vm.currentPage*vm.currentNumPerPage < vm.showDatas.length ? vm.currentPage*vm.currentNumPerPage : vm.showDatas.length;
        vm.lastPage = Math.ceil(vm.showDatas.length/vm.currentNumPerPage);
        vm.isShowPerpageItems= false;
        showData();
    }

    function editUser (user,index) {
        angular.copy(user,vm.currentEditUser);
        vm.currentEditUserIndex = user;
    }

    function isChecked (roles, role) {
        if(roles) {
            if (roles.indexOf(role)>=0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
        
    }

    function includeAddUserRole (role) {
        var i = vm.addUser.objectClass.indexOf(role);
        if (i>=0) {
            if (role=='adimot'){
                delete vm.addUser.adimotrole;
            }
            vm.addUser.objectClass.splice(i,1);
        } else {
            vm.addUser.objectClass.push(role);
            if (role=='adimot'){
                vm.addUser.adimotrole = 0;
            }
        }
    }

    function includeRole (role) {
        var i = vm.currentEditUser.objectClass.indexOf(role);
        if (i>=0) {
            vm.currentEditUser.objectClass.splice(i,1);
        } else {
            vm.currentEditUser.objectClass.push(role);
            if (role=='adimot'){
                vm.currentEditUser.adimotrole = '0';
            }
        }
    }

    function updateUser (user) {

        var modify = {};

        for (var i in vm.currentEditUser) {
            if (i!='controls'&&!angular.equals(vm.currentEditUser[i],vm.currentEditUserIndex[i])) {
                console.log(i)
                console.log(vm.currentEditUser[i]);
                console.log(vm.currentEditUserIndex[i]);
                modify[i] = vm.currentEditUser[i];
            }
            if (i=='adimotrole'&&vm.currentEditUser.objectClass.indexOf('adimot')<0) {
                   modify.adimotrole = ''; 
            }
        }
        console.log(modify);

        UserlistService.updateUser({uid:user.uid,changes:modify},function(err,result){
            if (err) {
                vm.updateUserErrorMessage = err;
            }
            else {
                $('.bs-example-modal-md').modal('hide');
                NotificationService.success('User is updated.')
                init();
            }
        })
    }
}
