// Generated by CoffeeScript 1.4.0
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require(['components/map-route', 'components/input/date-time', 'components/input/number-input'], function(MapRoute, DateTime, NumberInput) {
  var RideSharer;
  RideSharer = (function() {

    function RideSharer() {
      this.toJson = __bind(this.toJson, this);

      this.setButton = __bind(this.setButton, this);

      var _this = this;
      this.mapOptions = {
    	        center: new google.maps.LatLng(1.352083, 103.819836),
    	        zoom: 11,
    	        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map($('#map_canvas')[0], this.mapOptions);
      this.departure = new DateTime($('#share-departure'), $('#share-departure-date'), $('#share-departure-time'));
      this.route = new MapRoute($('#share-route'), this.map, $('#share-from'), $('#share-to'), $('#share-trip-length'));
      this.message = $('#share-message');
      this.womenOnly = $('#share-women-only');
      this.spots = new NumberInput($('#share-spots').parent().parent(), $('#share-spots'), true);
      this.shareButton = $('#share-button');
      this.shareButton.click(function() {
        var data;
        if (_this.shareButton.hasClass('disabled')) {
          return;
        }
        data = _this.toJson();
        if (data === null) {
          return;
        }
        console.log(data);
        return $.ajax({
          url: '/share_post.php',
          type: 'POST',
          data: {
            'data': JSON.stringify(data)
          },
          success: function(data) {
            var error, json;
            console.log(data);
            error = 'Unknown Error!';
            json = JSON.parse(data);
            if (json) {
              if (json['status'] === 'OK') {
                _this.setButton('disabled btn btn-success', json['msg']);
                return;
              } else {
                error = json['msg'];
              }
            }
            return _this.setButton('disabled btn btn-danger', error);
          },
          error: function(data) {
            return _this.setButton('disabled btn btn-danger', 'Error!');
          }
        });
      });
    }

    RideSharer.prototype.setButton = function(btnClass, msg) {
      this.shareButton.attr('class', btnClass);
      return this.shareButton.text(msg);
    };

    RideSharer.prototype.toJson = function() {
      var json, key, value;
      json = {
        departure: this.departure.getDateTime(),
        route: this.route.toJson(),
        message: this.message.val(),
        women_only: this.womenOnly.prop('checked'),
        spots: this.spots.getValue()
      };
      for (key in json) {
        value = json[key];
        if (value === null) {
          return null;
        }
      }
      return json;
    };

    return RideSharer;

  })();
  return new RideSharer();
});
