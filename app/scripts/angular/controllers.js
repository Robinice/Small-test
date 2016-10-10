
var app = angular.module('app.controllers', ['ui.bootstrap','ngAnimate']);



app.controller('ActiveCtrl', ['$scope','UsersFactory','$location','$modal','$state',
    '$log','$timeout',function($scope, UsersFactory, $location, $modal,$state, $log,$timeout){
        $scope.state = 1;
        $scope.user = {num:"",name:"",mobile:""};

        $scope.errorMessage = "";
        $scope.submitted = false;
        $scope.signupFrom = function(){
            alert("123");
        };
        $scope.postdata =function(){

            $scope.errorMessage = "";
            $scope.isShow = true;
            $scope.change = function(){
                $scope.isShow = false;

            };
            UsersFactory.create($scope.user ,function(data){

                if (data.code==200){
                    // call page + id  data.id
                    $state.go("projects",{id:data.id});
                    $scope.state = 0;
                }
                else if(data.code == 301){
                    //alert(data.msg);
                }else{
                    //alert(data.msg);
                    $scope.errorMessage = data.msg;
                }

            })
        }


    }]);

app.controller('RecordCtrl', ['$scope','UserFactory','$location','$modal',
    '$log','$stateParams',function($scope, UserFactory, $location, $modal, $log,$stateParams){
        UserFactory.get({id:$stateParams.id},function(data){
            if (data.code==200){
                $scope.name = data.data.name;
                $scope.msg = data.data.msg;
                $scope.createTime =data.data.createTime;
                $scope.prize = data.data.prize;
            }else{
                console.log("数据读取错误！");
            }


        })
    }]);


