import { Meteor } from 'meteor/meteor';

//export const Users = Meteor.users;


Meteor.users.helpers({
  color() {
    function hashCode(str) { // java String#hashCode
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
         hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    }

    function intToRGB(i){
      var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

      return "00000".substring(0, 6 - c.length) + c;
    }

    return '#' + intToRGB(hashCode(this._id));
  }
});