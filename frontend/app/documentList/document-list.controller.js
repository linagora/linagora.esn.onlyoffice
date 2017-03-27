(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('documentListController', documentListController);

    function documentListController($scope, _, OnlyOfficeRestangular, paginator) {

      $scope.getExtensionfromFileName = function(filename) {
        return filename.split('.').pop();
      };

      $scope.removeDocument = function(file) {
        OnlyOfficeRestangular.one('files', file._id).remove().then(function() {
          _.pull($scope.documents, file)
        });
      };

      function updateData(err, items, page) {
          if (err) {
            $scope.error = true;
          } else {
            if (items) {
              $scope.documents = items;
            }
            $scope.currentPageNb = page;
          }
        }

      $scope.initPager = function(nbItemsPerPage) {
        (function(offset, limit, callback){
          var options = {limit: limit, offset: offset};
          var loader = {
            getItems: function(items, offset, limit, callback) {
              return callback(null, items.slice(offset, offset + limit));
            },
            loadNextItems: function(callback) {
              $scope.loading = true;
              offset += limit;
              var newOptions = {limit: limit, offset: offset};
              OnlyOfficeRestangular.all('files').getList(newOptions).then(function(response) {
                return callback(null, response.data);
              }, function(err) {
                return callback(err);
              }).finally(function() {
                $scope.loading = false;
              });
            }
          };
          $scope.error = false;
          $scope.loading = true;
          OnlyOfficeRestangular.all('files').getList().then(function(response) {
            $scope.pager = paginator(response.data, nbItemsPerPage, response.data.length, loader);
            return callback(null);
          }, function(err) {
            return callback(err);
          }).finally(function() {
            $scope.loading = false;
          });
        })(0,10, function(err) {
          if (err) {
            $scope.error = true;
            return;
          }
          $scope.totalNotifications = $scope.pager.getTotalItems();
          $scope.lastPageNb = $scope.pager.getLastPage();
          $scope.pager.currentPage(updateData);
        });
      };

      $scope.nextPage = function() {
        return $scope.pager.nextPage(updateData);
      };

      $scope.previousPage = function() {
        return $scope.pager.previousPage(updateData);
      };

      $scope.initPager(10);
    }
})();
