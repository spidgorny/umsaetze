(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],2:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],3:[function(require,module,exports){
/**
 * @version: 1.0 Alpha-1
 * @author: Coolite Inc. http://www.coolite.com/
 * @date: 2008-05-13
 * @copyright: Copyright (c) 2006-2008, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * @license: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * @website: http://www.datejs.com/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|aft(er)?|from|hence)/i,subtract:/^(\-|bef(ore)?|ago)/i,yesterday:/^yes(terday)?/i,today:/^t(od(ay)?)?/i,tomorrow:/^tom(orrow)?/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^mn|min(ute)?s?/i,hour:/^h(our)?s?/i,week:/^w(eek)?s?/i,month:/^m(onth)?s?/i,day:/^d(ay)?s?/i,year:/^y(ear)?s?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a(?!u|p)|p)/i},timezones:[{name:"UTC",offset:"-000"},{name:"GMT",offset:"-000"},{name:"EST",offset:"-0500"},{name:"EDT",offset:"-0400"},{name:"CST",offset:"-0600"},{name:"CDT",offset:"-0500"},{name:"MST",offset:"-0700"},{name:"MDT",offset:"-0600"},{name:"PST",offset:"-0800"},{name:"PDT",offset:"-0700"}]};
(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo,p=function(s,l){if(!l){l=2;}
return("000"+s).slice(l*-1);};$P.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};$P.setTimeToNow=function(){var n=new Date();this.setHours(n.getHours());this.setMinutes(n.getMinutes());this.setSeconds(n.getSeconds());this.setMilliseconds(n.getMilliseconds());return this;};$D.today=function(){return new Date().clearTime();};$D.compare=function(date1,date2){if(isNaN(date1)||isNaN(date2)){throw new Error(date1+" - "+date2);}else if(date1 instanceof Date&&date2 instanceof Date){return(date1<date2)?-1:(date1>date2)?1:0;}else{throw new TypeError(date1+" - "+date2);}};$D.equals=function(date1,date2){return(date1.compareTo(date2)===0);};$D.getDayNumberFromName=function(name){var n=$C.dayNames,m=$C.abbreviatedDayNames,o=$C.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s||o[i].toLowerCase()==s){return i;}}
return-1;};$D.getMonthNumberFromName=function(name){var n=$C.monthNames,m=$C.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};$D.isLeapYear=function(year){return((year%4===0&&year%100!==0)||year%400===0);};$D.getDaysInMonth=function(year,month){return[31,($D.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};$D.getTimezoneAbbreviation=function(offset){var z=$C.timezones,p;for(var i=0;i<z.length;i++){if(z[i].offset===offset){return z[i].name;}}
return null;};$D.getTimezoneOffset=function(name){var z=$C.timezones,p;for(var i=0;i<z.length;i++){if(z[i].name===name.toUpperCase()){return z[i].offset;}}
return null;};$P.clone=function(){return new Date(this.getTime());};$P.compareTo=function(date){return Date.compare(this,date);};$P.equals=function(date){return Date.equals(this,date||new Date());};$P.between=function(start,end){return this.getTime()>=start.getTime()&&this.getTime()<=end.getTime();};$P.isAfter=function(date){return this.compareTo(date||new Date())===1;};$P.isBefore=function(date){return(this.compareTo(date||new Date())===-1);};$P.isToday=function(){return this.isSameDay(new Date());};$P.isSameDay=function(date){return this.clone().clearTime().equals(date.clone().clearTime());};$P.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};$P.addSeconds=function(value){return this.addMilliseconds(value*1000);};$P.addMinutes=function(value){return this.addMilliseconds(value*60000);};$P.addHours=function(value){return this.addMilliseconds(value*3600000);};$P.addDays=function(value){this.setDate(this.getDate()+value);return this;};$P.addWeeks=function(value){return this.addDays(value*7);};$P.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,$D.getDaysInMonth(this.getFullYear(),this.getMonth())));return this;};$P.addYears=function(value){return this.addMonths(value*12);};$P.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.milliseconds){this.addMilliseconds(x.milliseconds);}
if(x.seconds){this.addSeconds(x.seconds);}
if(x.minutes){this.addMinutes(x.minutes);}
if(x.hours){this.addHours(x.hours);}
if(x.weeks){this.addWeeks(x.weeks);}
if(x.months){this.addMonths(x.months);}
if(x.years){this.addYears(x.years);}
if(x.days){this.addDays(x.days);}
return this;};var $y,$m,$d;$P.getWeek=function(){var a,b,c,d,e,f,g,n,s,w;$y=(!$y)?this.getFullYear():$y;$m=(!$m)?this.getMonth()+1:$m;$d=(!$d)?this.getDate():$d;if($m<=2){a=$y-1;b=(a/4|0)-(a/100|0)+(a/400|0);c=((a-1)/4|0)-((a-1)/100|0)+((a-1)/400|0);s=b-c;e=0;f=$d-1+(31*($m-1));}else{a=$y;b=(a/4|0)-(a/100|0)+(a/400|0);c=((a-1)/4|0)-((a-1)/100|0)+((a-1)/400|0);s=b-c;e=s+1;f=$d+((153*($m-3)+2)/5)+58+s;}
g=(a+b)%7;d=(f+g-e)%7;n=(f+3-d)|0;if(n<0){w=53-((g-s)/5|0);}else if(n>364+s){w=1;}else{w=(n/7|0)+1;}
$y=$m=$d=null;return w;};$P.getISOWeek=function(){$y=this.getUTCFullYear();$m=this.getUTCMonth()+1;$d=this.getUTCDate();return p(this.getWeek());};$P.setWeek=function(n){return this.moveToDayOfWeek(1).addWeeks(n-this.getWeek());};$D._validate=function(n,min,max,name){if(typeof n=="undefined"){return false;}else if(typeof n!="number"){throw new TypeError(n+" is not a Number.");}else if(n<min||n>max){throw new RangeError(n+" is not a valid value for "+name+".");}
return true;};$D.validateMillisecond=function(value){return $D._validate(value,0,999,"millisecond");};$D.validateSecond=function(value){return $D._validate(value,0,59,"second");};$D.validateMinute=function(value){return $D._validate(value,0,59,"minute");};$D.validateHour=function(value){return $D._validate(value,0,23,"hour");};$D.validateDay=function(value,year,month){return $D._validate(value,1,$D.getDaysInMonth(year,month),"day");};$D.validateMonth=function(value){return $D._validate(value,0,11,"month");};$D.validateYear=function(value){return $D._validate(value,0,9999,"year");};$P.set=function(config){if($D.validateMillisecond(config.millisecond)){this.addMilliseconds(config.millisecond-this.getMilliseconds());}
if($D.validateSecond(config.second)){this.addSeconds(config.second-this.getSeconds());}
if($D.validateMinute(config.minute)){this.addMinutes(config.minute-this.getMinutes());}
if($D.validateHour(config.hour)){this.addHours(config.hour-this.getHours());}
if($D.validateMonth(config.month)){this.addMonths(config.month-this.getMonth());}
if($D.validateYear(config.year)){this.addYears(config.year-this.getFullYear());}
if($D.validateDay(config.day,this.getFullYear(),this.getMonth())){this.addDays(config.day-this.getDate());}
if(config.timezone){this.setTimezone(config.timezone);}
if(config.timezoneOffset){this.setTimezoneOffset(config.timezoneOffset);}
if(config.week&&$D._validate(config.week,0,53,"week")){this.setWeek(config.week);}
return this;};$P.moveToFirstDayOfMonth=function(){return this.set({day:1});};$P.moveToLastDayOfMonth=function(){return this.set({day:$D.getDaysInMonth(this.getFullYear(),this.getMonth())});};$P.moveToNthOccurrence=function(dayOfWeek,occurrence){var shift=0;if(occurrence>0){shift=occurrence-1;}
else if(occurrence===-1){this.moveToLastDayOfMonth();if(this.getDay()!==dayOfWeek){this.moveToDayOfWeek(dayOfWeek,-1);}
return this;}
return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(dayOfWeek,+1).addWeeks(shift);};$P.moveToDayOfWeek=function(dayOfWeek,orient){var diff=(dayOfWeek-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};$P.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};$P.getOrdinalNumber=function(){return Math.ceil((this.clone().clearTime()-new Date(this.getFullYear(),0,1))/86400000)+1;};$P.getTimezone=function(){return $D.getTimezoneAbbreviation(this.getUTCOffset());};$P.setTimezoneOffset=function(offset){var here=this.getTimezoneOffset(),there=Number(offset)*-6/10;return this.addMinutes(there-here);};$P.setTimezone=function(offset){return this.setTimezoneOffset($D.getTimezoneOffset(offset));};$P.hasDaylightSavingTime=function(){return(Date.today().set({month:0,day:1}).getTimezoneOffset()!==Date.today().set({month:6,day:1}).getTimezoneOffset());};$P.isDaylightSavingTime=function(){return(this.hasDaylightSavingTime()&&new Date().getTimezoneOffset()===Date.today().set({month:6,day:1}).getTimezoneOffset());};$P.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r.charAt(0)+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};$P.getElapsed=function(date){return(date||new Date())-this;};if(!$P.toISOString){$P.toISOString=function(){function f(n){return n<10?'0'+n:n;}
return'"'+this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z"';};}
$P._toString=$P.toString;$P.toString=function(format){var x=this;if(format&&format.length==1){var c=$C.formatPatterns;x.t=x.toString;switch(format){case"d":return x.t(c.shortDate);case"D":return x.t(c.longDate);case"F":return x.t(c.fullDateTime);case"m":return x.t(c.monthDay);case"r":return x.t(c.rfc1123);case"s":return x.t(c.sortableDateTime);case"t":return x.t(c.shortTime);case"T":return x.t(c.longTime);case"u":return x.t(c.universalSortableDateTime);case"y":return x.t(c.yearMonth);}}
var ord=function(n){switch(n*1){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};return format?format.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g,function(m){if(m.charAt(0)==="\\"){return m.replace("\\","");}
x.h=x.getHours;switch(m){case"hh":return p(x.h()<13?(x.h()===0?12:x.h()):(x.h()-12));case"h":return x.h()<13?(x.h()===0?12:x.h()):(x.h()-12);case"HH":return p(x.h());case"H":return x.h();case"mm":return p(x.getMinutes());case"m":return x.getMinutes();case"ss":return p(x.getSeconds());case"s":return x.getSeconds();case"yyyy":return p(x.getFullYear(),4);case"yy":return p(x.getFullYear());case"dddd":return $C.dayNames[x.getDay()];case"ddd":return $C.abbreviatedDayNames[x.getDay()];case"dd":return p(x.getDate());case"d":return x.getDate();case"MMMM":return $C.monthNames[x.getMonth()];case"MMM":return $C.abbreviatedMonthNames[x.getMonth()];case"MM":return p((x.getMonth()+1));case"M":return x.getMonth()+1;case"t":return x.h()<12?$C.amDesignator.substring(0,1):$C.pmDesignator.substring(0,1);case"tt":return x.h()<12?$C.amDesignator:$C.pmDesignator;case"S":return ord(x.getDate());default:return m;}}):this._toString();};}());
(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo,$N=Number.prototype;$P._orient=+1;$P._nth=null;$P._is=false;$P._same=false;$P._isSecond=false;$N._dateElement="day";$P.next=function(){this._orient=+1;return this;};$D.next=function(){return $D.today().next();};$P.last=$P.prev=$P.previous=function(){this._orient=-1;return this;};$D.last=$D.prev=$D.previous=function(){return $D.today().last();};$P.is=function(){this._is=true;return this;};$P.same=function(){this._same=true;this._isSecond=false;return this;};$P.today=function(){return this.same().day();};$P.weekday=function(){if(this._is){this._is=false;return(!this.is().sat()&&!this.is().sun());}
return false;};$P.at=function(time){return(typeof time==="string")?$D.parse(this.toString("d")+" "+time):this.set(time);};$N.fromNow=$N.after=function(date){var c={};c[this._dateElement]=this;return((!date)?new Date():date.clone()).add(c);};$N.ago=$N.before=function(date){var c={};c[this._dateElement]=this*-1;return((!date)?new Date():date.clone()).add(c);};var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),pxf=("Milliseconds Seconds Minutes Hours Date Week Month FullYear").split(/\s/),nth=("final first second third fourth fifth").split(/\s/),de;$P.toObject=function(){var o={};for(var i=0;i<px.length;i++){o[px[i].toLowerCase()]=this["get"+pxf[i]]();}
return o;};$D.fromObject=function(config){config.week=null;return Date.today().set(config);};var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
if(this._nth!==null){if(this._isSecond){this.addSeconds(this._orient*-1);}
this._isSecond=false;var ntemp=this._nth;this._nth=null;var temp=this.clone().moveToLastDayOfMonth();this.moveToNthOccurrence(n,ntemp);if(this>temp){throw new RangeError($D.getDayName(n)+" does not occur "+ntemp+" times in the month of "+$D.getMonthName(temp.getMonth())+" "+temp.getFullYear()+".");}
return this;}
return this.moveToDayOfWeek(n,this._orient);};};var sdf=function(n){return function(){var t=$D.today(),shift=n-t.getDay();if(n===0&&$C.firstDayOfWeek===1&&t.getDay()!==0){shift=shift+7;}
return t.addDays(shift);};};for(var i=0;i<dx.length;i++){$D[dx[i].toUpperCase()]=$D[dx[i].toUpperCase().substring(0,3)]=i;$D[dx[i]]=$D[dx[i].substring(0,3)]=sdf(i);$P[dx[i]]=$P[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};var smf=function(n){return function(){return $D.today().set({month:n,day:1});};};for(var j=0;j<mx.length;j++){$D[mx[j].toUpperCase()]=$D[mx[j].toUpperCase().substring(0,3)]=j;$D[mx[j]]=$D[mx[j].substring(0,3)]=smf(j);$P[mx[j]]=$P[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(this._isSecond){this._isSecond=false;return this;}
if(this._same){this._same=this._is=false;var o1=this.toObject(),o2=(arguments[0]||new Date()).toObject(),v="",k=j.toLowerCase();for(var m=(px.length-1);m>-1;m--){v=px[m].toLowerCase();if(o1[v]!=o2[v]){return false;}
if(k==v){break;}}
return true;}
if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$P[de]=$P[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}
$P._ss=ef("Second");var nthfn=function(n){return function(dayOfWeek){if(this._same){return this._ss(arguments[0]);}
if(dayOfWeek||dayOfWeek===0){return this.moveToNthOccurrence(dayOfWeek,n);}
this._nth=n;if(n===2&&(dayOfWeek===undefined||dayOfWeek===null)){this._isSecond=true;return this.addSeconds(this._orient);}
return this;};};for(var l=0;l<nth.length;l++){$P[nth[l]]=(l===0)?nthfn(-1):nthfn(l);}}());
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo;var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};$D.Grammar={};$D.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=(s.length==3)?"jan feb mar apr may jun jul aug sep oct nov dec".indexOf(s)/4:Number(s)-1;};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<$C.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
var now=new Date();if((this.hour||this.minute)&&(!this.month&&!this.year&&!this.day)){this.day=now.getDate();}
if(!this.year){this.year=now.getFullYear();}
if(!this.month&&this.month!==0){this.month=now.getMonth();}
if(!this.day){this.day=1;}
if(!this.hour){this.hour=0;}
if(!this.minute){this.minute=0;}
if(!this.second){this.second=0;}
if(this.meridian&&this.hour){if(this.meridian=="p"&&this.hour<12){this.hour=this.hour+12;}else if(this.meridian=="a"&&this.hour==12){this.hour=0;}}
if(this.day>$D.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
var today=$D.today();if(this.now&&!this.unit&&!this.operator){return new Date();}else if(this.now){today=new Date();}
var expression=!!(this.days&&this.days!==null||this.orient||this.operator);var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(!this.now&&"hour minute second".indexOf(this.unit)!=-1){today.setTimeToNow();}
if(this.month||this.month===0){if("year day hour minute second".indexOf(this.unit)!=-1){this.value=this.month+1;this.month=null;expression=true;}}
if(!expression&&this.weekday&&!this.day&&!this.days){var temp=Date[this.weekday]();this.day=temp.getDate();if(!this.month){this.month=temp.getMonth();}
this.year=temp.getFullYear();}
if(expression&&this.weekday&&this.unit!="month"){this.unit="day";gap=($D.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month&&this.unit=="day"&&this.operator){this.value=(this.month+1);this.month=null;}
if(this.value!=null&&this.month!=null&&this.year!=null){this.day=this.value*1;}
if(this.month&&!this.day&&this.value){today.set({day:this.value*1});if(!expression){this.day=this.value*1;}}
if(!this.month&&this.value&&this.unit=="month"&&!this.now){this.month=this.value;expression=true;}
if(expression&&(this.month||this.month===0)&&this.unit!="year"){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(!this.value&&this.operator&&this.operator!==null&&this[this.unit+"s"]&&this[this.unit+"s"]!==null){this[this.unit+"s"]=this[this.unit+"s"]+((this.operator=="add")?1:-1)+(this.value||0)*orient;}else if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
this[this.unit+"s"]=this.value*orient;}
if(this.meridian&&this.hour){if(this.meridian=="p"&&this.hour<12){this.hour=this.hour+12;}else if(this.meridian=="a"&&this.hour==12){this.hour=0;}}
if(this.weekday&&!this.day&&!this.days){var temp=Date[this.weekday]();this.day=temp.getDate();if(temp.getMonth()!==today.getMonth()){this.month=temp.getMonth();}}
if((this.month||this.month===0)&&!this.day){this.day=1;}
if(!this.orient&&!this.operator&&this.unit=="week"&&this.value&&!this.day&&!this.month){return Date.today().setWeek(this.value);}
if(expression&&this.timezone&&this.day&&this.days){this.day=this.days;}
return(expression)?today.add(this):today.set(this);}};var _=$D.Parsing.Operators,g=$D.Grammar,t=$D.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|@|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=$C.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken($C.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.m,g.s],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("second minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[$C.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw $D.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["\"yyyy-MM-ddTHH:mm:ssZ\"","yyyy-MM-ddTHH:mm:ssZ","yyyy-MM-ddTHH:mm:ssz","yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mmZ","yyyy-MM-ddTHH:mmz","yyyy-MM-ddTHH:mm","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","MMddyyyy","ddMMyyyy","Mddyyyy","ddMyyyy","Mdyyyy","dMyyyy","yyyy","Mdyy","dMyy","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};$D._parse=$D.parse;$D.parse=function(s){var r=null;if(!s){return null;}
if(s instanceof Date){return s;}
try{r=$D.Grammar.start.call({},s.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1"));}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};$D.getParseFunction=function(fx){var fn=$D.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};$D.parseExact=function(s,fx){return $D.getParseFunction(fx)(s);};}());

},{}],4:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],5:[function(require,module,exports){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      isBuffer = require('is-buffer'),
      bin = require('charenc').bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

},{"charenc":1,"crypt":2,"is-buffer":4}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Depends on Expenses to parse them
 * and retrieve the total values for each category
 */
var CategoryCollection = (function (_super) {
    __extends(CategoryCollection, _super);
    function CategoryCollection(options) {
        _super.call(this, options);
        this.categoryCount = [];
    }
    CategoryCollection.prototype.setExpenses = function (ex) {
        this.expenses = ex;
        this.listenTo(this.expenses, "change", this.change);
    };
    CategoryCollection.prototype.getCategoriesFromExpenses = function () {
        var _this = this;
        this.expenses.each(function (transaction) {
            var categoryName = transaction.get('category');
            if (categoryName) {
                _this.incrementCategoryData(categoryName, transaction);
            }
        });
        //console.log(this.categoryCount);
    };
    CategoryCollection.prototype.incrementCategoryData = function (categoryName, transaction) {
        var exists = _.findWhere(this.categoryCount, { catName: categoryName });
        if (exists) {
            exists.count++;
            exists.amount += parseFloat(transaction.get('amount'));
        }
        else {
            this.categoryCount.push({
                catName: categoryName,
                count: 0,
                amount: 0
            });
        }
    };
    CategoryCollection.prototype.change = function () {
        console.log('CategoryCollection.change');
        this.getCategoriesFromExpenses();
    };
    CategoryCollection.prototype.getCategoryCount = function () {
        if (!this.categoryCount) {
            this.getCategoriesFromExpenses();
        }
        return this.categoryCount;
    };
    CategoryCollection.prototype.getOptions = function () {
        if (!this.categoryCount) {
            this.getCategoriesFromExpenses();
        }
        var options = [];
        this.categoryCount.forEach(function (value) {
            options.push(value.catName);
        });
        return options;
    };
    return CategoryCollection;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = CategoryCollection;

},{}],7:[function(require,module,exports){
///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CategoryView = (function (_super) {
    __extends(CategoryView, _super);
    function CategoryView(options) {
        _super.call(this, options);
        this.template = _.template($('#categoryTemplate').html());
        this.setElement($('#categories'));
    }
    CategoryView.prototype.render = function () {
        var _this = this;
        var content = [];
        var categoryCount = this.model.getCategoryCount();
        var sum = _.reduce(categoryCount, function (memo, item) {
            // only expenses
            if (item.catName != 'Default' && item.amount < 0) {
                return memo + item.amount;
            }
            else {
                return memo;
            }
        }, 0);
        //console.log('sum', sum);
        categoryCount = _.sortBy(categoryCount, function (el) {
            return -el.amount;
        }).reverse();
        _.each(categoryCount, function (catCount) {
            if (catCount.catName != 'Default' && catCount.amount < 0) {
                var width = Math.round(100 * (-catCount.amount) / -sum) + '%';
                //console.log(catCount.catName, width, catCount.count, catCount.amount);
                content.push(_this.template(_.extend(catCount, {
                    width: width,
                    amount: Math.round(catCount.amount)
                })));
            }
        });
        this.$el.html(content.join('\n'));
        return this;
    };
    CategoryView.prototype.change = function () {
        console.log('model changed', this.model);
        if (this.model) {
            this.model.change();
            this.render();
        }
        else {
            console.error('Not rendering since this.model is undefined');
        }
    };
    return CategoryView;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = CategoryView;

},{}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExpenseTable = (function (_super) {
    __extends(ExpenseTable, _super);
    function ExpenseTable(options) {
        _super.call(this, options);
        this.template = _.template($('#rowTemplate').html());
        this.setElement($('#expenseTable'));
        this.listenTo(this.model, 'change', this.render.bind(this));
    }
    ExpenseTable.prototype.setCategoryList = function (list) {
        this.categoryList = list;
    };
    ExpenseTable.prototype.render = function () {
        var _this = this;
        console.log('ExpenseTable.render()', this.model.size());
        console.log(this.model);
        var rows = [];
        this.model.each(function (transaction) {
            //console.log(transaction);
            var attributes = transaction.toJSON();
            //if (attributes.amount == -15.53) {
            //console.log(attributes, transaction);
            //}
            if (attributes.hasOwnProperty('date')) {
                rows.push(_this.template(attributes));
            }
            else {
                console.log('no date', attributes);
            }
        });
        console.log('rendering', rows.length, 'rows');
        this.$el.append(rows.join('\n'));
        //console.log(this.$el);
        $('#dateFrom').html(this.model.getDateFrom().toString('yyyy-MM-dd'));
        $('#dateTill').html(this.model.getDateTill().toString('yyyy-MM-dd'));
        this.$el.on('click', 'select', this.openSelect.bind(this));
        return this;
    };
    ExpenseTable.prototype.openSelect = function (event) {
        //console.log('openSelect', this, event);
        var $select = $(event.target);
        if ($select.find('option').length == 1) {
            var defVal_1 = $select.find('option').html();
            var options = this.categoryList.getOptions();
            console.log(options);
            $.each(options, function (key, value) {
                if (value != defVal_1) {
                    $select
                        .append($("<option></option>")
                        .attr("value", value)
                        .text(value));
                }
            });
            $select.on('change', this.newCategory.bind(this));
        }
    };
    ExpenseTable.prototype.newCategory = function (event) {
        //console.log(event);
        var $select = $(event.target);
        //console.log('selected', $select.val());
        var id = $select.closest('tr').attr('data-id');
        //console.log(id);
        var transaction = this.model.get(id);
        //console.log(transaction);
        if (transaction) {
            transaction.setCategory($select.val());
        }
    };
    return ExpenseTable;
}(Backbone.View));
exports.__esModule = true;
exports["default"] = ExpenseTable;

},{}],9:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="umsaetze.ts" />
/// <reference path="Papa.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var umsaetze_1 = require('./umsaetze');
var Transaction_1 = require('./Transaction');
require('datejs');
var Expenses = (function (_super) {
    __extends(Expenses, _super);
    function Expenses() {
        _super.apply(this, arguments);
        this.attributes = null;
        this.model = Transaction_1["default"];
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';
    }
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        console.log('csvUrl', this.csvUrl);
        return $.get(this.csvUrl, function (response, xhr) {
            var csv = Papa.parse(response, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });
            //console.log(csv);
            if (false) {
                _.each(csv.data, _this.processRow.bind(_this));
                _this.processDone(csv.data.length, options);
            }
            else {
                umsaetze_1.asyncLoop(csv.data, _this.processRow.bind(_this), _this.processDone.bind(_this, options));
            }
        });
    };
    Expenses.prototype.processRow = function (row, i, length) {
        var percent = Math.round(100 * i / length);
        //console.log(row);
        $('.progress .progress-bar').width(percent + '%');
        if (row && row.amount) {
            this.add(new Transaction_1["default"](row));
        }
        //this.trigger('change');
    };
    Expenses.prototype.processDone = function (count, options) {
        console.log('asyncLoop finished', count);
        if (options.success) {
            options.success.call();
        }
        this.trigger('change');
    };
    Expenses.prototype.getDateFrom = function () {
        var min = new Date().valueOf();
        this.each(function (row) {
            var date = Date.parse(row.get('date'));
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getDateTill = function () {
        var min = new Date('1970-01-01').valueOf();
        this.each(function (row) {
            var date = Date.parse(row.get('date'));
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    return Expenses;
}(Backbone.Collection));
exports.__esModule = true;
exports["default"] = Expenses;

},{"./Transaction":10,"./umsaetze":11,"datejs":3}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../typings/index.d.ts"/>
///<reference path="../node_modules/backbone-typings/backbone.d.ts"/>
var md5 = require('md5');
var Transaction = (function (_super) {
    __extends(Transaction, _super);
    function Transaction(attributes, options) {
        _super.call(this, attributes, options);
        this.set('id', md5(this.get('date') + this.get('amount')));
    }
    Transaction.prototype.sign = function () {
        return this.amount >= 0 ? 'positive' : 'negative';
    };
    Transaction.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        json.sign = this.sign();
        json.id = this.id;
        return json;
    };
    Transaction.prototype.setCategory = function (category) {
        this.set('category', category);
    };
    return Transaction;
}(Backbone.Model));
exports.__esModule = true;
exports["default"] = Transaction;

},{"md5":5}],11:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
/// <reference path="../node_modules/backbone-typings/backbone.d.ts" />
/// <reference path="Expenses.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Expenses_1 = require('./Expenses');
var ExpenseTable_1 = require('./ExpenseTable');
var CategoryView_1 = require('./CategoryView');
var CategoryCollection_1 = require("./CategoryCollection");
function asyncLoop(arr, callback, done) {
    (function loop(i) {
        callback(arr[i], i, arr.length); //callback when the loop goes on
        if (i < arr.length) {
            setTimeout(function () { loop(++i); }, 1); //rerun when condition is true
        }
        else {
            if (done) {
                done(arr.length); //callback when the loop ends
            }
        }
    }(0)); //start with 0
}
exports.asyncLoop = asyncLoop;
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView(options) {
        var _this = this;
        _super.call(this, options);
        console.log('construct AppView');
        this.setElement($('#app'));
        this.model = new Expenses_1["default"]();
        this.categoryList = new CategoryCollection_1["default"]();
        this.categoryList.setExpenses(this.model);
        this.table = new ExpenseTable_1["default"]({
            model: this.model,
            el: $('#expenseTable')
        });
        this.table.setCategoryList(this.categoryList);
        this.categories = new CategoryView_1["default"]({
            model: this.categoryList
        });
        console.log('category view model', this.categories.model);
        this.startLoading();
        this.model.fetch({
            success: function () {
                _this.stopLoading();
            }
        });
        this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.model, "change", this.table.render);
        //this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
    }
    AppView.prototype.startLoading = function () {
        console.log('startLoading');
        var template = _.template($('#loadingBar').html());
        this.$el.html(template());
    };
    AppView.prototype.stopLoading = function () {
        console.log('stopLoading');
        this.$el.html('Done');
    };
    AppView.prototype.render = function () {
        console.log('AppView.render()', this.model.size());
        if (this.model && this.model.size()) {
            //this.table.render();
            this.$el.html('Table shown');
            this.categories.change();
        }
        else {
            this.startLoading();
        }
        return this;
    };
    return AppView;
}(Backbone.View));
$(function () {
    var app = new AppView();
    app.render();
});

},{"./CategoryCollection":6,"./CategoryView":7,"./ExpenseTable":8,"./Expenses":9}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2hhcmVuYy9jaGFyZW5jLmpzIiwibm9kZV9tb2R1bGVzL2NyeXB0L2NyeXB0LmpzIiwibm9kZV9tb2R1bGVzL2RhdGVqcy9saWIvZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWQ1L21kNS5qcyIsInNyYy9DYXRlZ29yeUNvbGxlY3Rpb24uanMiLCJzcmMvQ2F0ZWdvcnlWaWV3LmpzIiwic3JjL0V4cGVuc2VUYWJsZS5qcyIsInNyYy9FeHBlbnNlcy5qcyIsInNyYy9UcmFuc2FjdGlvbi5qcyIsInNyYy91bXNhZXR6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY2hhcmVuYyA9IHtcbiAgLy8gVVRGLTggZW5jb2RpbmdcbiAgdXRmODoge1xuICAgIC8vIENvbnZlcnQgYSBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICByZXR1cm4gY2hhcmVuYy5iaW4uc3RyaW5nVG9CeXRlcyh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSkpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIHN0cmluZ1xuICAgIGJ5dGVzVG9TdHJpbmc6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShjaGFyZW5jLmJpbi5ieXRlc1RvU3RyaW5nKGJ5dGVzKSkpO1xuICAgIH1cbiAgfSxcblxuICAvLyBCaW5hcnkgZW5jb2RpbmdcbiAgYmluOiB7XG4gICAgLy8gQ29udmVydCBhIHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBzdHJpbmdUb0J5dGVzOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgICAgICBieXRlcy5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRik7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgc3RyaW5nXG4gICAgYnl0ZXNUb1N0cmluZzogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIHN0ciA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICBzdHIucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKSk7XG4gICAgICByZXR1cm4gc3RyLmpvaW4oJycpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaGFyZW5jO1xuIiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgYmFzZTY0bWFwXG4gICAgICA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJyxcblxuICBjcnlwdCA9IHtcbiAgICAvLyBCaXQtd2lzZSByb3RhdGlvbiBsZWZ0XG4gICAgcm90bDogZnVuY3Rpb24obiwgYikge1xuICAgICAgcmV0dXJuIChuIDw8IGIpIHwgKG4gPj4+ICgzMiAtIGIpKTtcbiAgICB9LFxuXG4gICAgLy8gQml0LXdpc2Ugcm90YXRpb24gcmlnaHRcbiAgICByb3RyOiBmdW5jdGlvbihuLCBiKSB7XG4gICAgICByZXR1cm4gKG4gPDwgKDMyIC0gYikpIHwgKG4gPj4+IGIpO1xuICAgIH0sXG5cbiAgICAvLyBTd2FwIGJpZy1lbmRpYW4gdG8gbGl0dGxlLWVuZGlhbiBhbmQgdmljZSB2ZXJzYVxuICAgIGVuZGlhbjogZnVuY3Rpb24obikge1xuICAgICAgLy8gSWYgbnVtYmVyIGdpdmVuLCBzd2FwIGVuZGlhblxuICAgICAgaWYgKG4uY29uc3RydWN0b3IgPT0gTnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBjcnlwdC5yb3RsKG4sIDgpICYgMHgwMEZGMDBGRiB8IGNyeXB0LnJvdGwobiwgMjQpICYgMHhGRjAwRkYwMDtcbiAgICAgIH1cblxuICAgICAgLy8gRWxzZSwgYXNzdW1lIGFycmF5IGFuZCBzd2FwIGFsbCBpdGVtc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuLmxlbmd0aDsgaSsrKVxuICAgICAgICBuW2ldID0gY3J5cHQuZW5kaWFuKG5baV0pO1xuICAgICAgcmV0dXJuIG47XG4gICAgfSxcblxuICAgIC8vIEdlbmVyYXRlIGFuIGFycmF5IG9mIGFueSBsZW5ndGggb2YgcmFuZG9tIGJ5dGVzXG4gICAgcmFuZG9tQnl0ZXM6IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW107IG4gPiAwOyBuLS0pXG4gICAgICAgIGJ5dGVzLnB1c2goTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGJpZy1lbmRpYW4gMzItYml0IHdvcmRzXG4gICAgYnl0ZXNUb1dvcmRzOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgd29yZHMgPSBbXSwgaSA9IDAsIGIgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyssIGIgKz0gOClcbiAgICAgICAgd29yZHNbYiA+Pj4gNV0gfD0gYnl0ZXNbaV0gPDwgKDI0IC0gYiAlIDMyKTtcbiAgICAgIHJldHVybiB3b3JkcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBiaWctZW5kaWFuIDMyLWJpdCB3b3JkcyB0byBhIGJ5dGUgYXJyYXlcbiAgICB3b3Jkc1RvQnl0ZXM6IGZ1bmN0aW9uKHdvcmRzKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBiID0gMDsgYiA8IHdvcmRzLmxlbmd0aCAqIDMyOyBiICs9IDgpXG4gICAgICAgIGJ5dGVzLnB1c2goKHdvcmRzW2IgPj4+IDVdID4+PiAoMjQgLSBiICUgMzIpKSAmIDB4RkYpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIGhleCBzdHJpbmdcbiAgICBieXRlc1RvSGV4OiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgaGV4ID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaGV4LnB1c2goKGJ5dGVzW2ldID4+PiA0KS50b1N0cmluZygxNikpO1xuICAgICAgICBoZXgucHVzaCgoYnl0ZXNbaV0gJiAweEYpLnRvU3RyaW5nKDE2KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGV4LmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgaGV4IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBoZXhUb0J5dGVzOiBmdW5jdGlvbihoZXgpIHtcbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGMgPSAwOyBjIDwgaGV4Lmxlbmd0aDsgYyArPSAyKVxuICAgICAgICBieXRlcy5wdXNoKHBhcnNlSW50KGhleC5zdWJzdHIoYywgMiksIDE2KSk7XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBieXRlIGFycmF5IHRvIGEgYmFzZS02NCBzdHJpbmdcbiAgICBieXRlc1RvQmFzZTY0OiBmdW5jdGlvbihieXRlcykge1xuICAgICAgZm9yICh2YXIgYmFzZTY0ID0gW10sIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgdmFyIHRyaXBsZXQgPSAoYnl0ZXNbaV0gPDwgMTYpIHwgKGJ5dGVzW2kgKyAxXSA8PCA4KSB8IGJ5dGVzW2kgKyAyXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCA0OyBqKyspXG4gICAgICAgICAgaWYgKGkgKiA4ICsgaiAqIDYgPD0gYnl0ZXMubGVuZ3RoICogOClcbiAgICAgICAgICAgIGJhc2U2NC5wdXNoKGJhc2U2NG1hcC5jaGFyQXQoKHRyaXBsZXQgPj4+IDYgKiAoMyAtIGopKSAmIDB4M0YpKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBiYXNlNjQucHVzaCgnPScpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2U2NC5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJhc2UtNjQgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIGJhc2U2NFRvQnl0ZXM6IGZ1bmN0aW9uKGJhc2U2NCkge1xuICAgICAgLy8gUmVtb3ZlIG5vbi1iYXNlLTY0IGNoYXJhY3RlcnNcbiAgICAgIGJhc2U2NCA9IGJhc2U2NC5yZXBsYWNlKC9bXkEtWjAtOStcXC9dL2lnLCAnJyk7XG5cbiAgICAgIGZvciAodmFyIGJ5dGVzID0gW10sIGkgPSAwLCBpbW9kNCA9IDA7IGkgPCBiYXNlNjQubGVuZ3RoO1xuICAgICAgICAgIGltb2Q0ID0gKytpICUgNCkge1xuICAgICAgICBpZiAoaW1vZDQgPT0gMCkgY29udGludWU7XG4gICAgICAgIGJ5dGVzLnB1c2goKChiYXNlNjRtYXAuaW5kZXhPZihiYXNlNjQuY2hhckF0KGkgLSAxKSlcbiAgICAgICAgICAgICYgKE1hdGgucG93KDIsIC0yICogaW1vZDQgKyA4KSAtIDEpKSA8PCAoaW1vZDQgKiAyKSlcbiAgICAgICAgICAgIHwgKGJhc2U2NG1hcC5pbmRleE9mKGJhc2U2NC5jaGFyQXQoaSkpID4+PiAoNiAtIGltb2Q0ICogMikpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9XG4gIH07XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBjcnlwdDtcbn0pKCk7XG4iLCIvKipcclxuICogQHZlcnNpb246IDEuMCBBbHBoYS0xXHJcbiAqIEBhdXRob3I6IENvb2xpdGUgSW5jLiBodHRwOi8vd3d3LmNvb2xpdGUuY29tL1xyXG4gKiBAZGF0ZTogMjAwOC0wNS0xM1xyXG4gKiBAY29weXJpZ2h0OiBDb3B5cmlnaHQgKGMpIDIwMDYtMjAwOCwgQ29vbGl0ZSBJbmMuIChodHRwOi8vd3d3LmNvb2xpdGUuY29tLykuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqIEBsaWNlbnNlOiBMaWNlbnNlZCB1bmRlciBUaGUgTUlUIExpY2Vuc2UuIFNlZSBsaWNlbnNlLnR4dCBhbmQgaHR0cDovL3d3dy5kYXRlanMuY29tL2xpY2Vuc2UvLiBcclxuICogQHdlYnNpdGU6IGh0dHA6Ly93d3cuZGF0ZWpzLmNvbS9cclxuICovXHJcbkRhdGUuQ3VsdHVyZUluZm89e25hbWU6XCJlbi1VU1wiLGVuZ2xpc2hOYW1lOlwiRW5nbGlzaCAoVW5pdGVkIFN0YXRlcylcIixuYXRpdmVOYW1lOlwiRW5nbGlzaCAoVW5pdGVkIFN0YXRlcylcIixkYXlOYW1lczpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXSxhYmJyZXZpYXRlZERheU5hbWVzOltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxzaG9ydGVzdERheU5hbWVzOltcIlN1XCIsXCJNb1wiLFwiVHVcIixcIldlXCIsXCJUaFwiLFwiRnJcIixcIlNhXCJdLGZpcnN0TGV0dGVyRGF5TmFtZXM6W1wiU1wiLFwiTVwiLFwiVFwiLFwiV1wiLFwiVFwiLFwiRlwiLFwiU1wiXSxtb250aE5hbWVzOltcIkphbnVhcnlcIixcIkZlYnJ1YXJ5XCIsXCJNYXJjaFwiLFwiQXByaWxcIixcIk1heVwiLFwiSnVuZVwiLFwiSnVseVwiLFwiQXVndXN0XCIsXCJTZXB0ZW1iZXJcIixcIk9jdG9iZXJcIixcIk5vdmVtYmVyXCIsXCJEZWNlbWJlclwiXSxhYmJyZXZpYXRlZE1vbnRoTmFtZXM6W1wiSmFuXCIsXCJGZWJcIixcIk1hclwiLFwiQXByXCIsXCJNYXlcIixcIkp1blwiLFwiSnVsXCIsXCJBdWdcIixcIlNlcFwiLFwiT2N0XCIsXCJOb3ZcIixcIkRlY1wiXSxhbURlc2lnbmF0b3I6XCJBTVwiLHBtRGVzaWduYXRvcjpcIlBNXCIsZmlyc3REYXlPZldlZWs6MCx0d29EaWdpdFllYXJNYXg6MjAyOSxkYXRlRWxlbWVudE9yZGVyOlwibWR5XCIsZm9ybWF0UGF0dGVybnM6e3Nob3J0RGF0ZTpcIk0vZC95eXl5XCIsbG9uZ0RhdGU6XCJkZGRkLCBNTU1NIGRkLCB5eXl5XCIsc2hvcnRUaW1lOlwiaDptbSB0dFwiLGxvbmdUaW1lOlwiaDptbTpzcyB0dFwiLGZ1bGxEYXRlVGltZTpcImRkZGQsIE1NTU0gZGQsIHl5eXkgaDptbTpzcyB0dFwiLHNvcnRhYmxlRGF0ZVRpbWU6XCJ5eXl5LU1NLWRkVEhIOm1tOnNzXCIsdW5pdmVyc2FsU29ydGFibGVEYXRlVGltZTpcInl5eXktTU0tZGQgSEg6bW06c3NaXCIscmZjMTEyMzpcImRkZCwgZGQgTU1NIHl5eXkgSEg6bW06c3MgR01UXCIsbW9udGhEYXk6XCJNTU1NIGRkXCIseWVhck1vbnRoOlwiTU1NTSwgeXl5eVwifSxyZWdleFBhdHRlcm5zOntqYW46L15qYW4odWFyeSk/L2ksZmViOi9eZmViKHJ1YXJ5KT8vaSxtYXI6L15tYXIoY2gpPy9pLGFwcjovXmFwcihpbCk/L2ksbWF5Oi9ebWF5L2ksanVuOi9eanVuKGUpPy9pLGp1bDovXmp1bCh5KT8vaSxhdWc6L15hdWcodXN0KT8vaSxzZXA6L15zZXAodChlbWJlcik/KT8vaSxvY3Q6L15vY3Qob2Jlcik/L2ksbm92Oi9ebm92KGVtYmVyKT8vaSxkZWM6L15kZWMoZW1iZXIpPy9pLHN1bjovXnN1KG4oZGF5KT8pPy9pLG1vbjovXm1vKG4oZGF5KT8pPy9pLHR1ZTovXnR1KGUocyhkYXkpPyk/KT8vaSx3ZWQ6L153ZShkKG5lc2RheSk/KT8vaSx0aHU6L150aCh1KHIocyhkYXkpPyk/KT8pPy9pLGZyaTovXmZyKGkoZGF5KT8pPy9pLHNhdDovXnNhKHQodXJkYXkpPyk/L2ksZnV0dXJlOi9ebmV4dC9pLHBhc3Q6L15sYXN0fHBhc3R8cHJldihpb3VzKT8vaSxhZGQ6L14oXFwrfGFmdChlcik/fGZyb218aGVuY2UpL2ksc3VidHJhY3Q6L14oXFwtfGJlZihvcmUpP3xhZ28pL2kseWVzdGVyZGF5Oi9eeWVzKHRlcmRheSk/L2ksdG9kYXk6L150KG9kKGF5KT8pPy9pLHRvbW9ycm93Oi9edG9tKG9ycm93KT8vaSxub3c6L15uKG93KT8vaSxtaWxsaXNlY29uZDovXm1zfG1pbGxpKHNlY29uZCk/cz8vaSxzZWNvbmQ6L15zZWMob25kKT9zPy9pLG1pbnV0ZTovXm1ufG1pbih1dGUpP3M/L2ksaG91cjovXmgob3VyKT9zPy9pLHdlZWs6L153KGVlayk/cz8vaSxtb250aDovXm0ob250aCk/cz8vaSxkYXk6L15kKGF5KT9zPy9pLHllYXI6L155KGVhcik/cz8vaSxzaG9ydE1lcmlkaWFuOi9eKGF8cCkvaSxsb25nTWVyaWRpYW46L14oYVxcLj9tP1xcLj98cFxcLj9tP1xcLj8pL2ksdGltZXpvbmU6L14oKGUoc3xkKXR8YyhzfGQpdHxtKHN8ZCl0fHAoc3xkKXQpfCgoZ210KT9cXHMqKFxcK3xcXC0pXFxzKlxcZFxcZFxcZFxcZD8pfGdtdHx1dGMpL2ksb3JkaW5hbFN1ZmZpeDovXlxccyooc3R8bmR8cmR8dGgpL2ksdGltZUNvbnRleHQ6L15cXHMqKFxcOnxhKD8hdXxwKXxwKS9pfSx0aW1lem9uZXM6W3tuYW1lOlwiVVRDXCIsb2Zmc2V0OlwiLTAwMFwifSx7bmFtZTpcIkdNVFwiLG9mZnNldDpcIi0wMDBcIn0se25hbWU6XCJFU1RcIixvZmZzZXQ6XCItMDUwMFwifSx7bmFtZTpcIkVEVFwiLG9mZnNldDpcIi0wNDAwXCJ9LHtuYW1lOlwiQ1NUXCIsb2Zmc2V0OlwiLTA2MDBcIn0se25hbWU6XCJDRFRcIixvZmZzZXQ6XCItMDUwMFwifSx7bmFtZTpcIk1TVFwiLG9mZnNldDpcIi0wNzAwXCJ9LHtuYW1lOlwiTURUXCIsb2Zmc2V0OlwiLTA2MDBcIn0se25hbWU6XCJQU1RcIixvZmZzZXQ6XCItMDgwMFwifSx7bmFtZTpcIlBEVFwiLG9mZnNldDpcIi0wNzAwXCJ9XX07XG4oZnVuY3Rpb24oKXt2YXIgJEQ9RGF0ZSwkUD0kRC5wcm90b3R5cGUsJEM9JEQuQ3VsdHVyZUluZm8scD1mdW5jdGlvbihzLGwpe2lmKCFsKXtsPTI7fVxucmV0dXJuKFwiMDAwXCIrcykuc2xpY2UobCotMSk7fTskUC5jbGVhclRpbWU9ZnVuY3Rpb24oKXt0aGlzLnNldEhvdXJzKDApO3RoaXMuc2V0TWludXRlcygwKTt0aGlzLnNldFNlY29uZHMoMCk7dGhpcy5zZXRNaWxsaXNlY29uZHMoMCk7cmV0dXJuIHRoaXM7fTskUC5zZXRUaW1lVG9Ob3c9ZnVuY3Rpb24oKXt2YXIgbj1uZXcgRGF0ZSgpO3RoaXMuc2V0SG91cnMobi5nZXRIb3VycygpKTt0aGlzLnNldE1pbnV0ZXMobi5nZXRNaW51dGVzKCkpO3RoaXMuc2V0U2Vjb25kcyhuLmdldFNlY29uZHMoKSk7dGhpcy5zZXRNaWxsaXNlY29uZHMobi5nZXRNaWxsaXNlY29uZHMoKSk7cmV0dXJuIHRoaXM7fTskRC50b2RheT1mdW5jdGlvbigpe3JldHVybiBuZXcgRGF0ZSgpLmNsZWFyVGltZSgpO307JEQuY29tcGFyZT1mdW5jdGlvbihkYXRlMSxkYXRlMil7aWYoaXNOYU4oZGF0ZTEpfHxpc05hTihkYXRlMikpe3Rocm93IG5ldyBFcnJvcihkYXRlMStcIiAtIFwiK2RhdGUyKTt9ZWxzZSBpZihkYXRlMSBpbnN0YW5jZW9mIERhdGUmJmRhdGUyIGluc3RhbmNlb2YgRGF0ZSl7cmV0dXJuKGRhdGUxPGRhdGUyKT8tMTooZGF0ZTE+ZGF0ZTIpPzE6MDt9ZWxzZXt0aHJvdyBuZXcgVHlwZUVycm9yKGRhdGUxK1wiIC0gXCIrZGF0ZTIpO319OyRELmVxdWFscz1mdW5jdGlvbihkYXRlMSxkYXRlMil7cmV0dXJuKGRhdGUxLmNvbXBhcmVUbyhkYXRlMik9PT0wKTt9OyRELmdldERheU51bWJlckZyb21OYW1lPWZ1bmN0aW9uKG5hbWUpe3ZhciBuPSRDLmRheU5hbWVzLG09JEMuYWJicmV2aWF0ZWREYXlOYW1lcyxvPSRDLnNob3J0ZXN0RGF5TmFtZXMscz1uYW1lLnRvTG93ZXJDYXNlKCk7Zm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspe2lmKG5baV0udG9Mb3dlckNhc2UoKT09c3x8bVtpXS50b0xvd2VyQ2FzZSgpPT1zfHxvW2ldLnRvTG93ZXJDYXNlKCk9PXMpe3JldHVybiBpO319XG5yZXR1cm4tMTt9OyRELmdldE1vbnRoTnVtYmVyRnJvbU5hbWU9ZnVuY3Rpb24obmFtZSl7dmFyIG49JEMubW9udGhOYW1lcyxtPSRDLmFiYnJldmlhdGVkTW9udGhOYW1lcyxzPW5hbWUudG9Mb3dlckNhc2UoKTtmb3IodmFyIGk9MDtpPG4ubGVuZ3RoO2krKyl7aWYobltpXS50b0xvd2VyQ2FzZSgpPT1zfHxtW2ldLnRvTG93ZXJDYXNlKCk9PXMpe3JldHVybiBpO319XG5yZXR1cm4tMTt9OyRELmlzTGVhcFllYXI9ZnVuY3Rpb24oeWVhcil7cmV0dXJuKCh5ZWFyJTQ9PT0wJiZ5ZWFyJTEwMCE9PTApfHx5ZWFyJTQwMD09PTApO307JEQuZ2V0RGF5c0luTW9udGg9ZnVuY3Rpb24oeWVhcixtb250aCl7cmV0dXJuWzMxLCgkRC5pc0xlYXBZZWFyKHllYXIpPzI5OjI4KSwzMSwzMCwzMSwzMCwzMSwzMSwzMCwzMSwzMCwzMV1bbW9udGhdO307JEQuZ2V0VGltZXpvbmVBYmJyZXZpYXRpb249ZnVuY3Rpb24ob2Zmc2V0KXt2YXIgej0kQy50aW1lem9uZXMscDtmb3IodmFyIGk9MDtpPHoubGVuZ3RoO2krKyl7aWYoeltpXS5vZmZzZXQ9PT1vZmZzZXQpe3JldHVybiB6W2ldLm5hbWU7fX1cbnJldHVybiBudWxsO307JEQuZ2V0VGltZXpvbmVPZmZzZXQ9ZnVuY3Rpb24obmFtZSl7dmFyIHo9JEMudGltZXpvbmVzLHA7Zm9yKHZhciBpPTA7aTx6Lmxlbmd0aDtpKyspe2lmKHpbaV0ubmFtZT09PW5hbWUudG9VcHBlckNhc2UoKSl7cmV0dXJuIHpbaV0ub2Zmc2V0O319XG5yZXR1cm4gbnVsbDt9OyRQLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBEYXRlKHRoaXMuZ2V0VGltZSgpKTt9OyRQLmNvbXBhcmVUbz1mdW5jdGlvbihkYXRlKXtyZXR1cm4gRGF0ZS5jb21wYXJlKHRoaXMsZGF0ZSk7fTskUC5lcXVhbHM9ZnVuY3Rpb24oZGF0ZSl7cmV0dXJuIERhdGUuZXF1YWxzKHRoaXMsZGF0ZXx8bmV3IERhdGUoKSk7fTskUC5iZXR3ZWVuPWZ1bmN0aW9uKHN0YXJ0LGVuZCl7cmV0dXJuIHRoaXMuZ2V0VGltZSgpPj1zdGFydC5nZXRUaW1lKCkmJnRoaXMuZ2V0VGltZSgpPD1lbmQuZ2V0VGltZSgpO307JFAuaXNBZnRlcj1mdW5jdGlvbihkYXRlKXtyZXR1cm4gdGhpcy5jb21wYXJlVG8oZGF0ZXx8bmV3IERhdGUoKSk9PT0xO307JFAuaXNCZWZvcmU9ZnVuY3Rpb24oZGF0ZSl7cmV0dXJuKHRoaXMuY29tcGFyZVRvKGRhdGV8fG5ldyBEYXRlKCkpPT09LTEpO307JFAuaXNUb2RheT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmlzU2FtZURheShuZXcgRGF0ZSgpKTt9OyRQLmlzU2FtZURheT1mdW5jdGlvbihkYXRlKXtyZXR1cm4gdGhpcy5jbG9uZSgpLmNsZWFyVGltZSgpLmVxdWFscyhkYXRlLmNsb25lKCkuY2xlYXJUaW1lKCkpO307JFAuYWRkTWlsbGlzZWNvbmRzPWZ1bmN0aW9uKHZhbHVlKXt0aGlzLnNldE1pbGxpc2Vjb25kcyh0aGlzLmdldE1pbGxpc2Vjb25kcygpK3ZhbHVlKTtyZXR1cm4gdGhpczt9OyRQLmFkZFNlY29uZHM9ZnVuY3Rpb24odmFsdWUpe3JldHVybiB0aGlzLmFkZE1pbGxpc2Vjb25kcyh2YWx1ZSoxMDAwKTt9OyRQLmFkZE1pbnV0ZXM9ZnVuY3Rpb24odmFsdWUpe3JldHVybiB0aGlzLmFkZE1pbGxpc2Vjb25kcyh2YWx1ZSo2MDAwMCk7fTskUC5hZGRIb3Vycz1mdW5jdGlvbih2YWx1ZSl7cmV0dXJuIHRoaXMuYWRkTWlsbGlzZWNvbmRzKHZhbHVlKjM2MDAwMDApO307JFAuYWRkRGF5cz1mdW5jdGlvbih2YWx1ZSl7dGhpcy5zZXREYXRlKHRoaXMuZ2V0RGF0ZSgpK3ZhbHVlKTtyZXR1cm4gdGhpczt9OyRQLmFkZFdlZWtzPWZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gdGhpcy5hZGREYXlzKHZhbHVlKjcpO307JFAuYWRkTW9udGhzPWZ1bmN0aW9uKHZhbHVlKXt2YXIgbj10aGlzLmdldERhdGUoKTt0aGlzLnNldERhdGUoMSk7dGhpcy5zZXRNb250aCh0aGlzLmdldE1vbnRoKCkrdmFsdWUpO3RoaXMuc2V0RGF0ZShNYXRoLm1pbihuLCRELmdldERheXNJbk1vbnRoKHRoaXMuZ2V0RnVsbFllYXIoKSx0aGlzLmdldE1vbnRoKCkpKSk7cmV0dXJuIHRoaXM7fTskUC5hZGRZZWFycz1mdW5jdGlvbih2YWx1ZSl7cmV0dXJuIHRoaXMuYWRkTW9udGhzKHZhbHVlKjEyKTt9OyRQLmFkZD1mdW5jdGlvbihjb25maWcpe2lmKHR5cGVvZiBjb25maWc9PVwibnVtYmVyXCIpe3RoaXMuX29yaWVudD1jb25maWc7cmV0dXJuIHRoaXM7fVxudmFyIHg9Y29uZmlnO2lmKHgubWlsbGlzZWNvbmRzKXt0aGlzLmFkZE1pbGxpc2Vjb25kcyh4Lm1pbGxpc2Vjb25kcyk7fVxuaWYoeC5zZWNvbmRzKXt0aGlzLmFkZFNlY29uZHMoeC5zZWNvbmRzKTt9XG5pZih4Lm1pbnV0ZXMpe3RoaXMuYWRkTWludXRlcyh4Lm1pbnV0ZXMpO31cbmlmKHguaG91cnMpe3RoaXMuYWRkSG91cnMoeC5ob3Vycyk7fVxuaWYoeC53ZWVrcyl7dGhpcy5hZGRXZWVrcyh4LndlZWtzKTt9XG5pZih4Lm1vbnRocyl7dGhpcy5hZGRNb250aHMoeC5tb250aHMpO31cbmlmKHgueWVhcnMpe3RoaXMuYWRkWWVhcnMoeC55ZWFycyk7fVxuaWYoeC5kYXlzKXt0aGlzLmFkZERheXMoeC5kYXlzKTt9XG5yZXR1cm4gdGhpczt9O3ZhciAkeSwkbSwkZDskUC5nZXRXZWVrPWZ1bmN0aW9uKCl7dmFyIGEsYixjLGQsZSxmLGcsbixzLHc7JHk9KCEkeSk/dGhpcy5nZXRGdWxsWWVhcigpOiR5OyRtPSghJG0pP3RoaXMuZ2V0TW9udGgoKSsxOiRtOyRkPSghJGQpP3RoaXMuZ2V0RGF0ZSgpOiRkO2lmKCRtPD0yKXthPSR5LTE7Yj0oYS80fDApLShhLzEwMHwwKSsoYS80MDB8MCk7Yz0oKGEtMSkvNHwwKS0oKGEtMSkvMTAwfDApKygoYS0xKS80MDB8MCk7cz1iLWM7ZT0wO2Y9JGQtMSsoMzEqKCRtLTEpKTt9ZWxzZXthPSR5O2I9KGEvNHwwKS0oYS8xMDB8MCkrKGEvNDAwfDApO2M9KChhLTEpLzR8MCktKChhLTEpLzEwMHwwKSsoKGEtMSkvNDAwfDApO3M9Yi1jO2U9cysxO2Y9JGQrKCgxNTMqKCRtLTMpKzIpLzUpKzU4K3M7fVxuZz0oYStiKSU3O2Q9KGYrZy1lKSU3O249KGYrMy1kKXwwO2lmKG48MCl7dz01My0oKGctcykvNXwwKTt9ZWxzZSBpZihuPjM2NCtzKXt3PTE7fWVsc2V7dz0obi83fDApKzE7fVxuJHk9JG09JGQ9bnVsbDtyZXR1cm4gdzt9OyRQLmdldElTT1dlZWs9ZnVuY3Rpb24oKXskeT10aGlzLmdldFVUQ0Z1bGxZZWFyKCk7JG09dGhpcy5nZXRVVENNb250aCgpKzE7JGQ9dGhpcy5nZXRVVENEYXRlKCk7cmV0dXJuIHAodGhpcy5nZXRXZWVrKCkpO307JFAuc2V0V2Vlaz1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5tb3ZlVG9EYXlPZldlZWsoMSkuYWRkV2Vla3Mobi10aGlzLmdldFdlZWsoKSk7fTskRC5fdmFsaWRhdGU9ZnVuY3Rpb24obixtaW4sbWF4LG5hbWUpe2lmKHR5cGVvZiBuPT1cInVuZGVmaW5lZFwiKXtyZXR1cm4gZmFsc2U7fWVsc2UgaWYodHlwZW9mIG4hPVwibnVtYmVyXCIpe3Rocm93IG5ldyBUeXBlRXJyb3IobitcIiBpcyBub3QgYSBOdW1iZXIuXCIpO31lbHNlIGlmKG48bWlufHxuPm1heCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IobitcIiBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgXCIrbmFtZStcIi5cIik7fVxucmV0dXJuIHRydWU7fTskRC52YWxpZGF0ZU1pbGxpc2Vjb25kPWZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gJEQuX3ZhbGlkYXRlKHZhbHVlLDAsOTk5LFwibWlsbGlzZWNvbmRcIik7fTskRC52YWxpZGF0ZVNlY29uZD1mdW5jdGlvbih2YWx1ZSl7cmV0dXJuICRELl92YWxpZGF0ZSh2YWx1ZSwwLDU5LFwic2Vjb25kXCIpO307JEQudmFsaWRhdGVNaW51dGU9ZnVuY3Rpb24odmFsdWUpe3JldHVybiAkRC5fdmFsaWRhdGUodmFsdWUsMCw1OSxcIm1pbnV0ZVwiKTt9OyRELnZhbGlkYXRlSG91cj1mdW5jdGlvbih2YWx1ZSl7cmV0dXJuICRELl92YWxpZGF0ZSh2YWx1ZSwwLDIzLFwiaG91clwiKTt9OyRELnZhbGlkYXRlRGF5PWZ1bmN0aW9uKHZhbHVlLHllYXIsbW9udGgpe3JldHVybiAkRC5fdmFsaWRhdGUodmFsdWUsMSwkRC5nZXREYXlzSW5Nb250aCh5ZWFyLG1vbnRoKSxcImRheVwiKTt9OyRELnZhbGlkYXRlTW9udGg9ZnVuY3Rpb24odmFsdWUpe3JldHVybiAkRC5fdmFsaWRhdGUodmFsdWUsMCwxMSxcIm1vbnRoXCIpO307JEQudmFsaWRhdGVZZWFyPWZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gJEQuX3ZhbGlkYXRlKHZhbHVlLDAsOTk5OSxcInllYXJcIik7fTskUC5zZXQ9ZnVuY3Rpb24oY29uZmlnKXtpZigkRC52YWxpZGF0ZU1pbGxpc2Vjb25kKGNvbmZpZy5taWxsaXNlY29uZCkpe3RoaXMuYWRkTWlsbGlzZWNvbmRzKGNvbmZpZy5taWxsaXNlY29uZC10aGlzLmdldE1pbGxpc2Vjb25kcygpKTt9XG5pZigkRC52YWxpZGF0ZVNlY29uZChjb25maWcuc2Vjb25kKSl7dGhpcy5hZGRTZWNvbmRzKGNvbmZpZy5zZWNvbmQtdGhpcy5nZXRTZWNvbmRzKCkpO31cbmlmKCRELnZhbGlkYXRlTWludXRlKGNvbmZpZy5taW51dGUpKXt0aGlzLmFkZE1pbnV0ZXMoY29uZmlnLm1pbnV0ZS10aGlzLmdldE1pbnV0ZXMoKSk7fVxuaWYoJEQudmFsaWRhdGVIb3VyKGNvbmZpZy5ob3VyKSl7dGhpcy5hZGRIb3Vycyhjb25maWcuaG91ci10aGlzLmdldEhvdXJzKCkpO31cbmlmKCRELnZhbGlkYXRlTW9udGgoY29uZmlnLm1vbnRoKSl7dGhpcy5hZGRNb250aHMoY29uZmlnLm1vbnRoLXRoaXMuZ2V0TW9udGgoKSk7fVxuaWYoJEQudmFsaWRhdGVZZWFyKGNvbmZpZy55ZWFyKSl7dGhpcy5hZGRZZWFycyhjb25maWcueWVhci10aGlzLmdldEZ1bGxZZWFyKCkpO31cbmlmKCRELnZhbGlkYXRlRGF5KGNvbmZpZy5kYXksdGhpcy5nZXRGdWxsWWVhcigpLHRoaXMuZ2V0TW9udGgoKSkpe3RoaXMuYWRkRGF5cyhjb25maWcuZGF5LXRoaXMuZ2V0RGF0ZSgpKTt9XG5pZihjb25maWcudGltZXpvbmUpe3RoaXMuc2V0VGltZXpvbmUoY29uZmlnLnRpbWV6b25lKTt9XG5pZihjb25maWcudGltZXpvbmVPZmZzZXQpe3RoaXMuc2V0VGltZXpvbmVPZmZzZXQoY29uZmlnLnRpbWV6b25lT2Zmc2V0KTt9XG5pZihjb25maWcud2VlayYmJEQuX3ZhbGlkYXRlKGNvbmZpZy53ZWVrLDAsNTMsXCJ3ZWVrXCIpKXt0aGlzLnNldFdlZWsoY29uZmlnLndlZWspO31cbnJldHVybiB0aGlzO307JFAubW92ZVRvRmlyc3REYXlPZk1vbnRoPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2V0KHtkYXk6MX0pO307JFAubW92ZVRvTGFzdERheU9mTW9udGg9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zZXQoe2RheTokRC5nZXREYXlzSW5Nb250aCh0aGlzLmdldEZ1bGxZZWFyKCksdGhpcy5nZXRNb250aCgpKX0pO307JFAubW92ZVRvTnRoT2NjdXJyZW5jZT1mdW5jdGlvbihkYXlPZldlZWssb2NjdXJyZW5jZSl7dmFyIHNoaWZ0PTA7aWYob2NjdXJyZW5jZT4wKXtzaGlmdD1vY2N1cnJlbmNlLTE7fVxuZWxzZSBpZihvY2N1cnJlbmNlPT09LTEpe3RoaXMubW92ZVRvTGFzdERheU9mTW9udGgoKTtpZih0aGlzLmdldERheSgpIT09ZGF5T2ZXZWVrKXt0aGlzLm1vdmVUb0RheU9mV2VlayhkYXlPZldlZWssLTEpO31cbnJldHVybiB0aGlzO31cbnJldHVybiB0aGlzLm1vdmVUb0ZpcnN0RGF5T2ZNb250aCgpLmFkZERheXMoLTEpLm1vdmVUb0RheU9mV2VlayhkYXlPZldlZWssKzEpLmFkZFdlZWtzKHNoaWZ0KTt9OyRQLm1vdmVUb0RheU9mV2Vlaz1mdW5jdGlvbihkYXlPZldlZWssb3JpZW50KXt2YXIgZGlmZj0oZGF5T2ZXZWVrLXRoaXMuZ2V0RGF5KCkrNyoob3JpZW50fHwrMSkpJTc7cmV0dXJuIHRoaXMuYWRkRGF5cygoZGlmZj09PTApP2RpZmYrPTcqKG9yaWVudHx8KzEpOmRpZmYpO307JFAubW92ZVRvTW9udGg9ZnVuY3Rpb24obW9udGgsb3JpZW50KXt2YXIgZGlmZj0obW9udGgtdGhpcy5nZXRNb250aCgpKzEyKihvcmllbnR8fCsxKSklMTI7cmV0dXJuIHRoaXMuYWRkTW9udGhzKChkaWZmPT09MCk/ZGlmZis9MTIqKG9yaWVudHx8KzEpOmRpZmYpO307JFAuZ2V0T3JkaW5hbE51bWJlcj1mdW5jdGlvbigpe3JldHVybiBNYXRoLmNlaWwoKHRoaXMuY2xvbmUoKS5jbGVhclRpbWUoKS1uZXcgRGF0ZSh0aGlzLmdldEZ1bGxZZWFyKCksMCwxKSkvODY0MDAwMDApKzE7fTskUC5nZXRUaW1lem9uZT1mdW5jdGlvbigpe3JldHVybiAkRC5nZXRUaW1lem9uZUFiYnJldmlhdGlvbih0aGlzLmdldFVUQ09mZnNldCgpKTt9OyRQLnNldFRpbWV6b25lT2Zmc2V0PWZ1bmN0aW9uKG9mZnNldCl7dmFyIGhlcmU9dGhpcy5nZXRUaW1lem9uZU9mZnNldCgpLHRoZXJlPU51bWJlcihvZmZzZXQpKi02LzEwO3JldHVybiB0aGlzLmFkZE1pbnV0ZXModGhlcmUtaGVyZSk7fTskUC5zZXRUaW1lem9uZT1mdW5jdGlvbihvZmZzZXQpe3JldHVybiB0aGlzLnNldFRpbWV6b25lT2Zmc2V0KCRELmdldFRpbWV6b25lT2Zmc2V0KG9mZnNldCkpO307JFAuaGFzRGF5bGlnaHRTYXZpbmdUaW1lPWZ1bmN0aW9uKCl7cmV0dXJuKERhdGUudG9kYXkoKS5zZXQoe21vbnRoOjAsZGF5OjF9KS5nZXRUaW1lem9uZU9mZnNldCgpIT09RGF0ZS50b2RheSgpLnNldCh7bW9udGg6NixkYXk6MX0pLmdldFRpbWV6b25lT2Zmc2V0KCkpO307JFAuaXNEYXlsaWdodFNhdmluZ1RpbWU9ZnVuY3Rpb24oKXtyZXR1cm4odGhpcy5oYXNEYXlsaWdodFNhdmluZ1RpbWUoKSYmbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpPT09RGF0ZS50b2RheSgpLnNldCh7bW9udGg6NixkYXk6MX0pLmdldFRpbWV6b25lT2Zmc2V0KCkpO307JFAuZ2V0VVRDT2Zmc2V0PWZ1bmN0aW9uKCl7dmFyIG49dGhpcy5nZXRUaW1lem9uZU9mZnNldCgpKi0xMC82LHI7aWYobjwwKXtyPShuLTEwMDAwKS50b1N0cmluZygpO3JldHVybiByLmNoYXJBdCgwKStyLnN1YnN0cigyKTt9ZWxzZXtyPShuKzEwMDAwKS50b1N0cmluZygpO3JldHVyblwiK1wiK3Iuc3Vic3RyKDEpO319OyRQLmdldEVsYXBzZWQ9ZnVuY3Rpb24oZGF0ZSl7cmV0dXJuKGRhdGV8fG5ldyBEYXRlKCkpLXRoaXM7fTtpZighJFAudG9JU09TdHJpbmcpeyRQLnRvSVNPU3RyaW5nPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZihuKXtyZXR1cm4gbjwxMD8nMCcrbjpuO31cbnJldHVybidcIicrdGhpcy5nZXRVVENGdWxsWWVhcigpKyctJytcbmYodGhpcy5nZXRVVENNb250aCgpKzEpKyctJytcbmYodGhpcy5nZXRVVENEYXRlKCkpKydUJytcbmYodGhpcy5nZXRVVENIb3VycygpKSsnOicrXG5mKHRoaXMuZ2V0VVRDTWludXRlcygpKSsnOicrXG5mKHRoaXMuZ2V0VVRDU2Vjb25kcygpKSsnWlwiJzt9O31cbiRQLl90b1N0cmluZz0kUC50b1N0cmluZzskUC50b1N0cmluZz1mdW5jdGlvbihmb3JtYXQpe3ZhciB4PXRoaXM7aWYoZm9ybWF0JiZmb3JtYXQubGVuZ3RoPT0xKXt2YXIgYz0kQy5mb3JtYXRQYXR0ZXJuczt4LnQ9eC50b1N0cmluZztzd2l0Y2goZm9ybWF0KXtjYXNlXCJkXCI6cmV0dXJuIHgudChjLnNob3J0RGF0ZSk7Y2FzZVwiRFwiOnJldHVybiB4LnQoYy5sb25nRGF0ZSk7Y2FzZVwiRlwiOnJldHVybiB4LnQoYy5mdWxsRGF0ZVRpbWUpO2Nhc2VcIm1cIjpyZXR1cm4geC50KGMubW9udGhEYXkpO2Nhc2VcInJcIjpyZXR1cm4geC50KGMucmZjMTEyMyk7Y2FzZVwic1wiOnJldHVybiB4LnQoYy5zb3J0YWJsZURhdGVUaW1lKTtjYXNlXCJ0XCI6cmV0dXJuIHgudChjLnNob3J0VGltZSk7Y2FzZVwiVFwiOnJldHVybiB4LnQoYy5sb25nVGltZSk7Y2FzZVwidVwiOnJldHVybiB4LnQoYy51bml2ZXJzYWxTb3J0YWJsZURhdGVUaW1lKTtjYXNlXCJ5XCI6cmV0dXJuIHgudChjLnllYXJNb250aCk7fX1cbnZhciBvcmQ9ZnVuY3Rpb24obil7c3dpdGNoKG4qMSl7Y2FzZSAxOmNhc2UgMjE6Y2FzZSAzMTpyZXR1cm5cInN0XCI7Y2FzZSAyOmNhc2UgMjI6cmV0dXJuXCJuZFwiO2Nhc2UgMzpjYXNlIDIzOnJldHVyblwicmRcIjtkZWZhdWx0OnJldHVyblwidGhcIjt9fTtyZXR1cm4gZm9ybWF0P2Zvcm1hdC5yZXBsYWNlKC8oXFxcXCk/KGRkP2Q/ZD98TU0/TT9NP3x5eT95P3k/fGhoP3xISD98bW0/fHNzP3x0dD98UykvZyxmdW5jdGlvbihtKXtpZihtLmNoYXJBdCgwKT09PVwiXFxcXFwiKXtyZXR1cm4gbS5yZXBsYWNlKFwiXFxcXFwiLFwiXCIpO31cbnguaD14LmdldEhvdXJzO3N3aXRjaChtKXtjYXNlXCJoaFwiOnJldHVybiBwKHguaCgpPDEzPyh4LmgoKT09PTA/MTI6eC5oKCkpOih4LmgoKS0xMikpO2Nhc2VcImhcIjpyZXR1cm4geC5oKCk8MTM/KHguaCgpPT09MD8xMjp4LmgoKSk6KHguaCgpLTEyKTtjYXNlXCJISFwiOnJldHVybiBwKHguaCgpKTtjYXNlXCJIXCI6cmV0dXJuIHguaCgpO2Nhc2VcIm1tXCI6cmV0dXJuIHAoeC5nZXRNaW51dGVzKCkpO2Nhc2VcIm1cIjpyZXR1cm4geC5nZXRNaW51dGVzKCk7Y2FzZVwic3NcIjpyZXR1cm4gcCh4LmdldFNlY29uZHMoKSk7Y2FzZVwic1wiOnJldHVybiB4LmdldFNlY29uZHMoKTtjYXNlXCJ5eXl5XCI6cmV0dXJuIHAoeC5nZXRGdWxsWWVhcigpLDQpO2Nhc2VcInl5XCI6cmV0dXJuIHAoeC5nZXRGdWxsWWVhcigpKTtjYXNlXCJkZGRkXCI6cmV0dXJuICRDLmRheU5hbWVzW3guZ2V0RGF5KCldO2Nhc2VcImRkZFwiOnJldHVybiAkQy5hYmJyZXZpYXRlZERheU5hbWVzW3guZ2V0RGF5KCldO2Nhc2VcImRkXCI6cmV0dXJuIHAoeC5nZXREYXRlKCkpO2Nhc2VcImRcIjpyZXR1cm4geC5nZXREYXRlKCk7Y2FzZVwiTU1NTVwiOnJldHVybiAkQy5tb250aE5hbWVzW3guZ2V0TW9udGgoKV07Y2FzZVwiTU1NXCI6cmV0dXJuICRDLmFiYnJldmlhdGVkTW9udGhOYW1lc1t4LmdldE1vbnRoKCldO2Nhc2VcIk1NXCI6cmV0dXJuIHAoKHguZ2V0TW9udGgoKSsxKSk7Y2FzZVwiTVwiOnJldHVybiB4LmdldE1vbnRoKCkrMTtjYXNlXCJ0XCI6cmV0dXJuIHguaCgpPDEyPyRDLmFtRGVzaWduYXRvci5zdWJzdHJpbmcoMCwxKTokQy5wbURlc2lnbmF0b3Iuc3Vic3RyaW5nKDAsMSk7Y2FzZVwidHRcIjpyZXR1cm4geC5oKCk8MTI/JEMuYW1EZXNpZ25hdG9yOiRDLnBtRGVzaWduYXRvcjtjYXNlXCJTXCI6cmV0dXJuIG9yZCh4LmdldERhdGUoKSk7ZGVmYXVsdDpyZXR1cm4gbTt9fSk6dGhpcy5fdG9TdHJpbmcoKTt9O30oKSk7XG4oZnVuY3Rpb24oKXt2YXIgJEQ9RGF0ZSwkUD0kRC5wcm90b3R5cGUsJEM9JEQuQ3VsdHVyZUluZm8sJE49TnVtYmVyLnByb3RvdHlwZTskUC5fb3JpZW50PSsxOyRQLl9udGg9bnVsbDskUC5faXM9ZmFsc2U7JFAuX3NhbWU9ZmFsc2U7JFAuX2lzU2Vjb25kPWZhbHNlOyROLl9kYXRlRWxlbWVudD1cImRheVwiOyRQLm5leHQ9ZnVuY3Rpb24oKXt0aGlzLl9vcmllbnQ9KzE7cmV0dXJuIHRoaXM7fTskRC5uZXh0PWZ1bmN0aW9uKCl7cmV0dXJuICRELnRvZGF5KCkubmV4dCgpO307JFAubGFzdD0kUC5wcmV2PSRQLnByZXZpb3VzPWZ1bmN0aW9uKCl7dGhpcy5fb3JpZW50PS0xO3JldHVybiB0aGlzO307JEQubGFzdD0kRC5wcmV2PSRELnByZXZpb3VzPWZ1bmN0aW9uKCl7cmV0dXJuICRELnRvZGF5KCkubGFzdCgpO307JFAuaXM9ZnVuY3Rpb24oKXt0aGlzLl9pcz10cnVlO3JldHVybiB0aGlzO307JFAuc2FtZT1mdW5jdGlvbigpe3RoaXMuX3NhbWU9dHJ1ZTt0aGlzLl9pc1NlY29uZD1mYWxzZTtyZXR1cm4gdGhpczt9OyRQLnRvZGF5PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2FtZSgpLmRheSgpO307JFAud2Vla2RheT1mdW5jdGlvbigpe2lmKHRoaXMuX2lzKXt0aGlzLl9pcz1mYWxzZTtyZXR1cm4oIXRoaXMuaXMoKS5zYXQoKSYmIXRoaXMuaXMoKS5zdW4oKSk7fVxucmV0dXJuIGZhbHNlO307JFAuYXQ9ZnVuY3Rpb24odGltZSl7cmV0dXJuKHR5cGVvZiB0aW1lPT09XCJzdHJpbmdcIik/JEQucGFyc2UodGhpcy50b1N0cmluZyhcImRcIikrXCIgXCIrdGltZSk6dGhpcy5zZXQodGltZSk7fTskTi5mcm9tTm93PSROLmFmdGVyPWZ1bmN0aW9uKGRhdGUpe3ZhciBjPXt9O2NbdGhpcy5fZGF0ZUVsZW1lbnRdPXRoaXM7cmV0dXJuKCghZGF0ZSk/bmV3IERhdGUoKTpkYXRlLmNsb25lKCkpLmFkZChjKTt9OyROLmFnbz0kTi5iZWZvcmU9ZnVuY3Rpb24oZGF0ZSl7dmFyIGM9e307Y1t0aGlzLl9kYXRlRWxlbWVudF09dGhpcyotMTtyZXR1cm4oKCFkYXRlKT9uZXcgRGF0ZSgpOmRhdGUuY2xvbmUoKSkuYWRkKGMpO307dmFyIGR4PShcInN1bmRheSBtb25kYXkgdHVlc2RheSB3ZWRuZXNkYXkgdGh1cnNkYXkgZnJpZGF5IHNhdHVyZGF5XCIpLnNwbGl0KC9cXHMvKSxteD0oXCJqYW51YXJ5IGZlYnJ1YXJ5IG1hcmNoIGFwcmlsIG1heSBqdW5lIGp1bHkgYXVndXN0IHNlcHRlbWJlciBvY3RvYmVyIG5vdmVtYmVyIGRlY2VtYmVyXCIpLnNwbGl0KC9cXHMvKSxweD0oXCJNaWxsaXNlY29uZCBTZWNvbmQgTWludXRlIEhvdXIgRGF5IFdlZWsgTW9udGggWWVhclwiKS5zcGxpdCgvXFxzLykscHhmPShcIk1pbGxpc2Vjb25kcyBTZWNvbmRzIE1pbnV0ZXMgSG91cnMgRGF0ZSBXZWVrIE1vbnRoIEZ1bGxZZWFyXCIpLnNwbGl0KC9cXHMvKSxudGg9KFwiZmluYWwgZmlyc3Qgc2Vjb25kIHRoaXJkIGZvdXJ0aCBmaWZ0aFwiKS5zcGxpdCgvXFxzLyksZGU7JFAudG9PYmplY3Q9ZnVuY3Rpb24oKXt2YXIgbz17fTtmb3IodmFyIGk9MDtpPHB4Lmxlbmd0aDtpKyspe29bcHhbaV0udG9Mb3dlckNhc2UoKV09dGhpc1tcImdldFwiK3B4ZltpXV0oKTt9XG5yZXR1cm4gbzt9OyRELmZyb21PYmplY3Q9ZnVuY3Rpb24oY29uZmlnKXtjb25maWcud2Vlaz1udWxsO3JldHVybiBEYXRlLnRvZGF5KCkuc2V0KGNvbmZpZyk7fTt2YXIgZGY9ZnVuY3Rpb24obil7cmV0dXJuIGZ1bmN0aW9uKCl7aWYodGhpcy5faXMpe3RoaXMuX2lzPWZhbHNlO3JldHVybiB0aGlzLmdldERheSgpPT1uO31cbmlmKHRoaXMuX250aCE9PW51bGwpe2lmKHRoaXMuX2lzU2Vjb25kKXt0aGlzLmFkZFNlY29uZHModGhpcy5fb3JpZW50Ki0xKTt9XG50aGlzLl9pc1NlY29uZD1mYWxzZTt2YXIgbnRlbXA9dGhpcy5fbnRoO3RoaXMuX250aD1udWxsO3ZhciB0ZW1wPXRoaXMuY2xvbmUoKS5tb3ZlVG9MYXN0RGF5T2ZNb250aCgpO3RoaXMubW92ZVRvTnRoT2NjdXJyZW5jZShuLG50ZW1wKTtpZih0aGlzPnRlbXApe3Rocm93IG5ldyBSYW5nZUVycm9yKCRELmdldERheU5hbWUobikrXCIgZG9lcyBub3Qgb2NjdXIgXCIrbnRlbXArXCIgdGltZXMgaW4gdGhlIG1vbnRoIG9mIFwiKyRELmdldE1vbnRoTmFtZSh0ZW1wLmdldE1vbnRoKCkpK1wiIFwiK3RlbXAuZ2V0RnVsbFllYXIoKStcIi5cIik7fVxucmV0dXJuIHRoaXM7fVxucmV0dXJuIHRoaXMubW92ZVRvRGF5T2ZXZWVrKG4sdGhpcy5fb3JpZW50KTt9O307dmFyIHNkZj1mdW5jdGlvbihuKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgdD0kRC50b2RheSgpLHNoaWZ0PW4tdC5nZXREYXkoKTtpZihuPT09MCYmJEMuZmlyc3REYXlPZldlZWs9PT0xJiZ0LmdldERheSgpIT09MCl7c2hpZnQ9c2hpZnQrNzt9XG5yZXR1cm4gdC5hZGREYXlzKHNoaWZ0KTt9O307Zm9yKHZhciBpPTA7aTxkeC5sZW5ndGg7aSsrKXskRFtkeFtpXS50b1VwcGVyQ2FzZSgpXT0kRFtkeFtpXS50b1VwcGVyQ2FzZSgpLnN1YnN0cmluZygwLDMpXT1pOyREW2R4W2ldXT0kRFtkeFtpXS5zdWJzdHJpbmcoMCwzKV09c2RmKGkpOyRQW2R4W2ldXT0kUFtkeFtpXS5zdWJzdHJpbmcoMCwzKV09ZGYoaSk7fVxudmFyIG1mPWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbigpe2lmKHRoaXMuX2lzKXt0aGlzLl9pcz1mYWxzZTtyZXR1cm4gdGhpcy5nZXRNb250aCgpPT09bjt9XG5yZXR1cm4gdGhpcy5tb3ZlVG9Nb250aChuLHRoaXMuX29yaWVudCk7fTt9O3ZhciBzbWY9ZnVuY3Rpb24obil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuICRELnRvZGF5KCkuc2V0KHttb250aDpuLGRheToxfSk7fTt9O2Zvcih2YXIgaj0wO2o8bXgubGVuZ3RoO2orKyl7JERbbXhbal0udG9VcHBlckNhc2UoKV09JERbbXhbal0udG9VcHBlckNhc2UoKS5zdWJzdHJpbmcoMCwzKV09ajskRFtteFtqXV09JERbbXhbal0uc3Vic3RyaW5nKDAsMyldPXNtZihqKTskUFtteFtqXV09JFBbbXhbal0uc3Vic3RyaW5nKDAsMyldPW1mKGopO31cbnZhciBlZj1mdW5jdGlvbihqKXtyZXR1cm4gZnVuY3Rpb24oKXtpZih0aGlzLl9pc1NlY29uZCl7dGhpcy5faXNTZWNvbmQ9ZmFsc2U7cmV0dXJuIHRoaXM7fVxuaWYodGhpcy5fc2FtZSl7dGhpcy5fc2FtZT10aGlzLl9pcz1mYWxzZTt2YXIgbzE9dGhpcy50b09iamVjdCgpLG8yPShhcmd1bWVudHNbMF18fG5ldyBEYXRlKCkpLnRvT2JqZWN0KCksdj1cIlwiLGs9ai50b0xvd2VyQ2FzZSgpO2Zvcih2YXIgbT0ocHgubGVuZ3RoLTEpO20+LTE7bS0tKXt2PXB4W21dLnRvTG93ZXJDYXNlKCk7aWYobzFbdl0hPW8yW3ZdKXtyZXR1cm4gZmFsc2U7fVxuaWYoaz09dil7YnJlYWs7fX1cbnJldHVybiB0cnVlO31cbmlmKGouc3Vic3RyaW5nKGoubGVuZ3RoLTEpIT1cInNcIil7ais9XCJzXCI7fVxucmV0dXJuIHRoaXNbXCJhZGRcIitqXSh0aGlzLl9vcmllbnQpO307fTt2YXIgbmY9ZnVuY3Rpb24obil7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5fZGF0ZUVsZW1lbnQ9bjtyZXR1cm4gdGhpczt9O307Zm9yKHZhciBrPTA7azxweC5sZW5ndGg7aysrKXtkZT1weFtrXS50b0xvd2VyQ2FzZSgpOyRQW2RlXT0kUFtkZStcInNcIl09ZWYocHhba10pOyROW2RlXT0kTltkZStcInNcIl09bmYoZGUpO31cbiRQLl9zcz1lZihcIlNlY29uZFwiKTt2YXIgbnRoZm49ZnVuY3Rpb24obil7cmV0dXJuIGZ1bmN0aW9uKGRheU9mV2Vlayl7aWYodGhpcy5fc2FtZSl7cmV0dXJuIHRoaXMuX3NzKGFyZ3VtZW50c1swXSk7fVxuaWYoZGF5T2ZXZWVrfHxkYXlPZldlZWs9PT0wKXtyZXR1cm4gdGhpcy5tb3ZlVG9OdGhPY2N1cnJlbmNlKGRheU9mV2VlayxuKTt9XG50aGlzLl9udGg9bjtpZihuPT09MiYmKGRheU9mV2Vlaz09PXVuZGVmaW5lZHx8ZGF5T2ZXZWVrPT09bnVsbCkpe3RoaXMuX2lzU2Vjb25kPXRydWU7cmV0dXJuIHRoaXMuYWRkU2Vjb25kcyh0aGlzLl9vcmllbnQpO31cbnJldHVybiB0aGlzO307fTtmb3IodmFyIGw9MDtsPG50aC5sZW5ndGg7bCsrKXskUFtudGhbbF1dPShsPT09MCk/bnRoZm4oLTEpOm50aGZuKGwpO319KCkpO1xuKGZ1bmN0aW9uKCl7RGF0ZS5QYXJzaW5nPXtFeGNlcHRpb246ZnVuY3Rpb24ocyl7dGhpcy5tZXNzYWdlPVwiUGFyc2UgZXJyb3IgYXQgJ1wiK3Muc3Vic3RyaW5nKDAsMTApK1wiIC4uLidcIjt9fTt2YXIgJFA9RGF0ZS5QYXJzaW5nO3ZhciBfPSRQLk9wZXJhdG9ycz17cnRva2VuOmZ1bmN0aW9uKHIpe3JldHVybiBmdW5jdGlvbihzKXt2YXIgbXg9cy5tYXRjaChyKTtpZihteCl7cmV0dXJuKFtteFswXSxzLnN1YnN0cmluZyhteFswXS5sZW5ndGgpXSk7fWVsc2V7dGhyb3cgbmV3ICRQLkV4Y2VwdGlvbihzKTt9fTt9LHRva2VuOmZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbihzKXtyZXR1cm4gXy5ydG9rZW4obmV3IFJlZ0V4cChcIl5cXHMqXCIrcytcIlxccypcIikpKHMpO307fSxzdG9rZW46ZnVuY3Rpb24ocyl7cmV0dXJuIF8ucnRva2VuKG5ldyBSZWdFeHAoXCJeXCIrcykpO30sdW50aWw6ZnVuY3Rpb24ocCl7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciBxeD1bXSxyeD1udWxsO3doaWxlKHMubGVuZ3RoKXt0cnl7cng9cC5jYWxsKHRoaXMscyk7fWNhdGNoKGUpe3F4LnB1c2gocnhbMF0pO3M9cnhbMV07Y29udGludWU7fVxuYnJlYWs7fVxucmV0dXJuW3F4LHNdO307fSxtYW55OmZ1bmN0aW9uKHApe3JldHVybiBmdW5jdGlvbihzKXt2YXIgcng9W10scj1udWxsO3doaWxlKHMubGVuZ3RoKXt0cnl7cj1wLmNhbGwodGhpcyxzKTt9Y2F0Y2goZSl7cmV0dXJuW3J4LHNdO31cbnJ4LnB1c2goclswXSk7cz1yWzFdO31cbnJldHVybltyeCxzXTt9O30sb3B0aW9uYWw6ZnVuY3Rpb24ocCl7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByPW51bGw7dHJ5e3I9cC5jYWxsKHRoaXMscyk7fWNhdGNoKGUpe3JldHVybltudWxsLHNdO31cbnJldHVybltyWzBdLHJbMV1dO307fSxub3Q6ZnVuY3Rpb24ocCl7cmV0dXJuIGZ1bmN0aW9uKHMpe3RyeXtwLmNhbGwodGhpcyxzKTt9Y2F0Y2goZSl7cmV0dXJuW251bGwsc107fVxudGhyb3cgbmV3ICRQLkV4Y2VwdGlvbihzKTt9O30saWdub3JlOmZ1bmN0aW9uKHApe3JldHVybiBwP2Z1bmN0aW9uKHMpe3ZhciByPW51bGw7cj1wLmNhbGwodGhpcyxzKTtyZXR1cm5bbnVsbCxyWzFdXTt9Om51bGw7fSxwcm9kdWN0OmZ1bmN0aW9uKCl7dmFyIHB4PWFyZ3VtZW50c1swXSxxeD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkscng9W107Zm9yKHZhciBpPTA7aTxweC5sZW5ndGg7aSsrKXtyeC5wdXNoKF8uZWFjaChweFtpXSxxeCkpO31cbnJldHVybiByeDt9LGNhY2hlOmZ1bmN0aW9uKHJ1bGUpe3ZhciBjYWNoZT17fSxyPW51bGw7cmV0dXJuIGZ1bmN0aW9uKHMpe3RyeXtyPWNhY2hlW3NdPShjYWNoZVtzXXx8cnVsZS5jYWxsKHRoaXMscykpO31jYXRjaChlKXtyPWNhY2hlW3NdPWU7fVxuaWYociBpbnN0YW5jZW9mICRQLkV4Y2VwdGlvbil7dGhyb3cgcjt9ZWxzZXtyZXR1cm4gcjt9fTt9LGFueTpmdW5jdGlvbigpe3ZhciBweD1hcmd1bWVudHM7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByPW51bGw7Zm9yKHZhciBpPTA7aTxweC5sZW5ndGg7aSsrKXtpZihweFtpXT09bnVsbCl7Y29udGludWU7fVxudHJ5e3I9KHB4W2ldLmNhbGwodGhpcyxzKSk7fWNhdGNoKGUpe3I9bnVsbDt9XG5pZihyKXtyZXR1cm4gcjt9fVxudGhyb3cgbmV3ICRQLkV4Y2VwdGlvbihzKTt9O30sZWFjaDpmdW5jdGlvbigpe3ZhciBweD1hcmd1bWVudHM7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByeD1bXSxyPW51bGw7Zm9yKHZhciBpPTA7aTxweC5sZW5ndGg7aSsrKXtpZihweFtpXT09bnVsbCl7Y29udGludWU7fVxudHJ5e3I9KHB4W2ldLmNhbGwodGhpcyxzKSk7fWNhdGNoKGUpe3Rocm93IG5ldyAkUC5FeGNlcHRpb24ocyk7fVxucngucHVzaChyWzBdKTtzPXJbMV07fVxucmV0dXJuW3J4LHNdO307fSxhbGw6ZnVuY3Rpb24oKXt2YXIgcHg9YXJndW1lbnRzLF89XztyZXR1cm4gXy5lYWNoKF8ub3B0aW9uYWwocHgpKTt9LHNlcXVlbmNlOmZ1bmN0aW9uKHB4LGQsYyl7ZD1kfHxfLnJ0b2tlbigvXlxccyovKTtjPWN8fG51bGw7aWYocHgubGVuZ3RoPT0xKXtyZXR1cm4gcHhbMF07fVxucmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByPW51bGwscT1udWxsO3ZhciByeD1bXTtmb3IodmFyIGk9MDtpPHB4Lmxlbmd0aDtpKyspe3RyeXtyPXB4W2ldLmNhbGwodGhpcyxzKTt9Y2F0Y2goZSl7YnJlYWs7fVxucngucHVzaChyWzBdKTt0cnl7cT1kLmNhbGwodGhpcyxyWzFdKTt9Y2F0Y2goZXgpe3E9bnVsbDticmVhazt9XG5zPXFbMV07fVxuaWYoIXIpe3Rocm93IG5ldyAkUC5FeGNlcHRpb24ocyk7fVxuaWYocSl7dGhyb3cgbmV3ICRQLkV4Y2VwdGlvbihxWzFdKTt9XG5pZihjKXt0cnl7cj1jLmNhbGwodGhpcyxyWzFdKTt9Y2F0Y2goZXkpe3Rocm93IG5ldyAkUC5FeGNlcHRpb24oclsxXSk7fX1cbnJldHVybltyeCwocj9yWzFdOnMpXTt9O30sYmV0d2VlbjpmdW5jdGlvbihkMSxwLGQyKXtkMj1kMnx8ZDE7dmFyIF9mbj1fLmVhY2goXy5pZ25vcmUoZDEpLHAsXy5pZ25vcmUoZDIpKTtyZXR1cm4gZnVuY3Rpb24ocyl7dmFyIHJ4PV9mbi5jYWxsKHRoaXMscyk7cmV0dXJuW1tyeFswXVswXSxyWzBdWzJdXSxyeFsxXV07fTt9LGxpc3Q6ZnVuY3Rpb24ocCxkLGMpe2Q9ZHx8Xy5ydG9rZW4oL15cXHMqLyk7Yz1jfHxudWxsO3JldHVybihwIGluc3RhbmNlb2YgQXJyYXk/Xy5lYWNoKF8ucHJvZHVjdChwLnNsaWNlKDAsLTEpLF8uaWdub3JlKGQpKSxwLnNsaWNlKC0xKSxfLmlnbm9yZShjKSk6Xy5lYWNoKF8ubWFueShfLmVhY2gocCxfLmlnbm9yZShkKSkpLHB4LF8uaWdub3JlKGMpKSk7fSxzZXQ6ZnVuY3Rpb24ocHgsZCxjKXtkPWR8fF8ucnRva2VuKC9eXFxzKi8pO2M9Y3x8bnVsbDtyZXR1cm4gZnVuY3Rpb24ocyl7dmFyIHI9bnVsbCxwPW51bGwscT1udWxsLHJ4PW51bGwsYmVzdD1bW10sc10sbGFzdD1mYWxzZTtmb3IodmFyIGk9MDtpPHB4Lmxlbmd0aDtpKyspe3E9bnVsbDtwPW51bGw7cj1udWxsO2xhc3Q9KHB4Lmxlbmd0aD09MSk7dHJ5e3I9cHhbaV0uY2FsbCh0aGlzLHMpO31jYXRjaChlKXtjb250aW51ZTt9XG5yeD1bW3JbMF1dLHJbMV1dO2lmKHJbMV0ubGVuZ3RoPjAmJiFsYXN0KXt0cnl7cT1kLmNhbGwodGhpcyxyWzFdKTt9Y2F0Y2goZXgpe2xhc3Q9dHJ1ZTt9fWVsc2V7bGFzdD10cnVlO31cbmlmKCFsYXN0JiZxWzFdLmxlbmd0aD09PTApe2xhc3Q9dHJ1ZTt9XG5pZighbGFzdCl7dmFyIHF4PVtdO2Zvcih2YXIgaj0wO2o8cHgubGVuZ3RoO2orKyl7aWYoaSE9ail7cXgucHVzaChweFtqXSk7fX1cbnA9Xy5zZXQocXgsZCkuY2FsbCh0aGlzLHFbMV0pO2lmKHBbMF0ubGVuZ3RoPjApe3J4WzBdPXJ4WzBdLmNvbmNhdChwWzBdKTtyeFsxXT1wWzFdO319XG5pZihyeFsxXS5sZW5ndGg8YmVzdFsxXS5sZW5ndGgpe2Jlc3Q9cng7fVxuaWYoYmVzdFsxXS5sZW5ndGg9PT0wKXticmVhazt9fVxuaWYoYmVzdFswXS5sZW5ndGg9PT0wKXtyZXR1cm4gYmVzdDt9XG5pZihjKXt0cnl7cT1jLmNhbGwodGhpcyxiZXN0WzFdKTt9Y2F0Y2goZXkpe3Rocm93IG5ldyAkUC5FeGNlcHRpb24oYmVzdFsxXSk7fVxuYmVzdFsxXT1xWzFdO31cbnJldHVybiBiZXN0O307fSxmb3J3YXJkOmZ1bmN0aW9uKGdyLGZuYW1lKXtyZXR1cm4gZnVuY3Rpb24ocyl7cmV0dXJuIGdyW2ZuYW1lXS5jYWxsKHRoaXMscyk7fTt9LHJlcGxhY2U6ZnVuY3Rpb24ocnVsZSxyZXBsKXtyZXR1cm4gZnVuY3Rpb24ocyl7dmFyIHI9cnVsZS5jYWxsKHRoaXMscyk7cmV0dXJuW3JlcGwsclsxXV07fTt9LHByb2Nlc3M6ZnVuY3Rpb24ocnVsZSxmbil7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByPXJ1bGUuY2FsbCh0aGlzLHMpO3JldHVybltmbi5jYWxsKHRoaXMsclswXSksclsxXV07fTt9LG1pbjpmdW5jdGlvbihtaW4scnVsZSl7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByeD1ydWxlLmNhbGwodGhpcyxzKTtpZihyeFswXS5sZW5ndGg8bWluKXt0aHJvdyBuZXcgJFAuRXhjZXB0aW9uKHMpO31cbnJldHVybiByeDt9O319O3ZhciBfZ2VuZXJhdG9yPWZ1bmN0aW9uKG9wKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYXJncz1udWxsLHJ4PVtdO2lmKGFyZ3VtZW50cy5sZW5ndGg+MSl7YXJncz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO31lbHNlIGlmKGFyZ3VtZW50c1swXWluc3RhbmNlb2YgQXJyYXkpe2FyZ3M9YXJndW1lbnRzWzBdO31cbmlmKGFyZ3Mpe2Zvcih2YXIgaT0wLHB4PWFyZ3Muc2hpZnQoKTtpPHB4Lmxlbmd0aDtpKyspe2FyZ3MudW5zaGlmdChweFtpXSk7cngucHVzaChvcC5hcHBseShudWxsLGFyZ3MpKTthcmdzLnNoaWZ0KCk7cmV0dXJuIHJ4O319ZWxzZXtyZXR1cm4gb3AuYXBwbHkobnVsbCxhcmd1bWVudHMpO319O307dmFyIGd4PVwib3B0aW9uYWwgbm90IGlnbm9yZSBjYWNoZVwiLnNwbGl0KC9cXHMvKTtmb3IodmFyIGk9MDtpPGd4Lmxlbmd0aDtpKyspe19bZ3hbaV1dPV9nZW5lcmF0b3IoX1tneFtpXV0pO31cbnZhciBfdmVjdG9yPWZ1bmN0aW9uKG9wKXtyZXR1cm4gZnVuY3Rpb24oKXtpZihhcmd1bWVudHNbMF1pbnN0YW5jZW9mIEFycmF5KXtyZXR1cm4gb3AuYXBwbHkobnVsbCxhcmd1bWVudHNbMF0pO31lbHNle3JldHVybiBvcC5hcHBseShudWxsLGFyZ3VtZW50cyk7fX07fTt2YXIgdng9XCJlYWNoIGFueSBhbGxcIi5zcGxpdCgvXFxzLyk7Zm9yKHZhciBqPTA7ajx2eC5sZW5ndGg7aisrKXtfW3Z4W2pdXT1fdmVjdG9yKF9bdnhbal1dKTt9fSgpKTsoZnVuY3Rpb24oKXt2YXIgJEQ9RGF0ZSwkUD0kRC5wcm90b3R5cGUsJEM9JEQuQ3VsdHVyZUluZm87dmFyIGZsYXR0ZW5BbmRDb21wYWN0PWZ1bmN0aW9uKGF4KXt2YXIgcng9W107Zm9yKHZhciBpPTA7aTxheC5sZW5ndGg7aSsrKXtpZihheFtpXWluc3RhbmNlb2YgQXJyYXkpe3J4PXJ4LmNvbmNhdChmbGF0dGVuQW5kQ29tcGFjdChheFtpXSkpO31lbHNle2lmKGF4W2ldKXtyeC5wdXNoKGF4W2ldKTt9fX1cbnJldHVybiByeDt9OyRELkdyYW1tYXI9e307JEQuVHJhbnNsYXRvcj17aG91cjpmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXt0aGlzLmhvdXI9TnVtYmVyKHMpO307fSxtaW51dGU6ZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5taW51dGU9TnVtYmVyKHMpO307fSxzZWNvbmQ6ZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5zZWNvbmQ9TnVtYmVyKHMpO307fSxtZXJpZGlhbjpmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXt0aGlzLm1lcmlkaWFuPXMuc2xpY2UoMCwxKS50b0xvd2VyQ2FzZSgpO307fSx0aW1lem9uZTpmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1zLnJlcGxhY2UoL1teXFxkXFwrXFwtXS9nLFwiXCIpO2lmKG4ubGVuZ3RoKXt0aGlzLnRpbWV6b25lT2Zmc2V0PU51bWJlcihuKTt9ZWxzZXt0aGlzLnRpbWV6b25lPXMudG9Mb3dlckNhc2UoKTt9fTt9LGRheTpmdW5jdGlvbih4KXt2YXIgcz14WzBdO3JldHVybiBmdW5jdGlvbigpe3RoaXMuZGF5PU51bWJlcihzLm1hdGNoKC9cXGQrLylbMF0pO307fSxtb250aDpmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXt0aGlzLm1vbnRoPShzLmxlbmd0aD09Myk/XCJqYW4gZmViIG1hciBhcHIgbWF5IGp1biBqdWwgYXVnIHNlcCBvY3Qgbm92IGRlY1wiLmluZGV4T2YocykvNDpOdW1iZXIocyktMTt9O30seWVhcjpmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1OdW1iZXIocyk7dGhpcy55ZWFyPSgocy5sZW5ndGg+Mik/bjoobisoKChuKzIwMDApPCRDLnR3b0RpZ2l0WWVhck1heCk/MjAwMDoxOTAwKSkpO307fSxyZGF5OmZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbigpe3N3aXRjaChzKXtjYXNlXCJ5ZXN0ZXJkYXlcIjp0aGlzLmRheXM9LTE7YnJlYWs7Y2FzZVwidG9tb3Jyb3dcIjp0aGlzLmRheXM9MTticmVhaztjYXNlXCJ0b2RheVwiOnRoaXMuZGF5cz0wO2JyZWFrO2Nhc2VcIm5vd1wiOnRoaXMuZGF5cz0wO3RoaXMubm93PXRydWU7YnJlYWs7fX07fSxmaW5pc2hFeGFjdDpmdW5jdGlvbih4KXt4PSh4IGluc3RhbmNlb2YgQXJyYXkpP3g6W3hdO2Zvcih2YXIgaT0wO2k8eC5sZW5ndGg7aSsrKXtpZih4W2ldKXt4W2ldLmNhbGwodGhpcyk7fX1cbnZhciBub3c9bmV3IERhdGUoKTtpZigodGhpcy5ob3VyfHx0aGlzLm1pbnV0ZSkmJighdGhpcy5tb250aCYmIXRoaXMueWVhciYmIXRoaXMuZGF5KSl7dGhpcy5kYXk9bm93LmdldERhdGUoKTt9XG5pZighdGhpcy55ZWFyKXt0aGlzLnllYXI9bm93LmdldEZ1bGxZZWFyKCk7fVxuaWYoIXRoaXMubW9udGgmJnRoaXMubW9udGghPT0wKXt0aGlzLm1vbnRoPW5vdy5nZXRNb250aCgpO31cbmlmKCF0aGlzLmRheSl7dGhpcy5kYXk9MTt9XG5pZighdGhpcy5ob3VyKXt0aGlzLmhvdXI9MDt9XG5pZighdGhpcy5taW51dGUpe3RoaXMubWludXRlPTA7fVxuaWYoIXRoaXMuc2Vjb25kKXt0aGlzLnNlY29uZD0wO31cbmlmKHRoaXMubWVyaWRpYW4mJnRoaXMuaG91cil7aWYodGhpcy5tZXJpZGlhbj09XCJwXCImJnRoaXMuaG91cjwxMil7dGhpcy5ob3VyPXRoaXMuaG91cisxMjt9ZWxzZSBpZih0aGlzLm1lcmlkaWFuPT1cImFcIiYmdGhpcy5ob3VyPT0xMil7dGhpcy5ob3VyPTA7fX1cbmlmKHRoaXMuZGF5PiRELmdldERheXNJbk1vbnRoKHRoaXMueWVhcix0aGlzLm1vbnRoKSl7dGhyb3cgbmV3IFJhbmdlRXJyb3IodGhpcy5kYXkrXCIgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIGRheXMuXCIpO31cbnZhciByPW5ldyBEYXRlKHRoaXMueWVhcix0aGlzLm1vbnRoLHRoaXMuZGF5LHRoaXMuaG91cix0aGlzLm1pbnV0ZSx0aGlzLnNlY29uZCk7aWYodGhpcy50aW1lem9uZSl7ci5zZXQoe3RpbWV6b25lOnRoaXMudGltZXpvbmV9KTt9ZWxzZSBpZih0aGlzLnRpbWV6b25lT2Zmc2V0KXtyLnNldCh7dGltZXpvbmVPZmZzZXQ6dGhpcy50aW1lem9uZU9mZnNldH0pO31cbnJldHVybiByO30sZmluaXNoOmZ1bmN0aW9uKHgpe3g9KHggaW5zdGFuY2VvZiBBcnJheSk/ZmxhdHRlbkFuZENvbXBhY3QoeCk6W3hdO2lmKHgubGVuZ3RoPT09MCl7cmV0dXJuIG51bGw7fVxuZm9yKHZhciBpPTA7aTx4Lmxlbmd0aDtpKyspe2lmKHR5cGVvZiB4W2ldPT1cImZ1bmN0aW9uXCIpe3hbaV0uY2FsbCh0aGlzKTt9fVxudmFyIHRvZGF5PSRELnRvZGF5KCk7aWYodGhpcy5ub3cmJiF0aGlzLnVuaXQmJiF0aGlzLm9wZXJhdG9yKXtyZXR1cm4gbmV3IERhdGUoKTt9ZWxzZSBpZih0aGlzLm5vdyl7dG9kYXk9bmV3IERhdGUoKTt9XG52YXIgZXhwcmVzc2lvbj0hISh0aGlzLmRheXMmJnRoaXMuZGF5cyE9PW51bGx8fHRoaXMub3JpZW50fHx0aGlzLm9wZXJhdG9yKTt2YXIgZ2FwLG1vZCxvcmllbnQ7b3JpZW50PSgodGhpcy5vcmllbnQ9PVwicGFzdFwifHx0aGlzLm9wZXJhdG9yPT1cInN1YnRyYWN0XCIpPy0xOjEpO2lmKCF0aGlzLm5vdyYmXCJob3VyIG1pbnV0ZSBzZWNvbmRcIi5pbmRleE9mKHRoaXMudW5pdCkhPS0xKXt0b2RheS5zZXRUaW1lVG9Ob3coKTt9XG5pZih0aGlzLm1vbnRofHx0aGlzLm1vbnRoPT09MCl7aWYoXCJ5ZWFyIGRheSBob3VyIG1pbnV0ZSBzZWNvbmRcIi5pbmRleE9mKHRoaXMudW5pdCkhPS0xKXt0aGlzLnZhbHVlPXRoaXMubW9udGgrMTt0aGlzLm1vbnRoPW51bGw7ZXhwcmVzc2lvbj10cnVlO319XG5pZighZXhwcmVzc2lvbiYmdGhpcy53ZWVrZGF5JiYhdGhpcy5kYXkmJiF0aGlzLmRheXMpe3ZhciB0ZW1wPURhdGVbdGhpcy53ZWVrZGF5XSgpO3RoaXMuZGF5PXRlbXAuZ2V0RGF0ZSgpO2lmKCF0aGlzLm1vbnRoKXt0aGlzLm1vbnRoPXRlbXAuZ2V0TW9udGgoKTt9XG50aGlzLnllYXI9dGVtcC5nZXRGdWxsWWVhcigpO31cbmlmKGV4cHJlc3Npb24mJnRoaXMud2Vla2RheSYmdGhpcy51bml0IT1cIm1vbnRoXCIpe3RoaXMudW5pdD1cImRheVwiO2dhcD0oJEQuZ2V0RGF5TnVtYmVyRnJvbU5hbWUodGhpcy53ZWVrZGF5KS10b2RheS5nZXREYXkoKSk7bW9kPTc7dGhpcy5kYXlzPWdhcD8oKGdhcCsob3JpZW50Km1vZCkpJW1vZCk6KG9yaWVudCptb2QpO31cbmlmKHRoaXMubW9udGgmJnRoaXMudW5pdD09XCJkYXlcIiYmdGhpcy5vcGVyYXRvcil7dGhpcy52YWx1ZT0odGhpcy5tb250aCsxKTt0aGlzLm1vbnRoPW51bGw7fVxuaWYodGhpcy52YWx1ZSE9bnVsbCYmdGhpcy5tb250aCE9bnVsbCYmdGhpcy55ZWFyIT1udWxsKXt0aGlzLmRheT10aGlzLnZhbHVlKjE7fVxuaWYodGhpcy5tb250aCYmIXRoaXMuZGF5JiZ0aGlzLnZhbHVlKXt0b2RheS5zZXQoe2RheTp0aGlzLnZhbHVlKjF9KTtpZighZXhwcmVzc2lvbil7dGhpcy5kYXk9dGhpcy52YWx1ZSoxO319XG5pZighdGhpcy5tb250aCYmdGhpcy52YWx1ZSYmdGhpcy51bml0PT1cIm1vbnRoXCImJiF0aGlzLm5vdyl7dGhpcy5tb250aD10aGlzLnZhbHVlO2V4cHJlc3Npb249dHJ1ZTt9XG5pZihleHByZXNzaW9uJiYodGhpcy5tb250aHx8dGhpcy5tb250aD09PTApJiZ0aGlzLnVuaXQhPVwieWVhclwiKXt0aGlzLnVuaXQ9XCJtb250aFwiO2dhcD0odGhpcy5tb250aC10b2RheS5nZXRNb250aCgpKTttb2Q9MTI7dGhpcy5tb250aHM9Z2FwPygoZ2FwKyhvcmllbnQqbW9kKSklbW9kKToob3JpZW50Km1vZCk7dGhpcy5tb250aD1udWxsO31cbmlmKCF0aGlzLnVuaXQpe3RoaXMudW5pdD1cImRheVwiO31cbmlmKCF0aGlzLnZhbHVlJiZ0aGlzLm9wZXJhdG9yJiZ0aGlzLm9wZXJhdG9yIT09bnVsbCYmdGhpc1t0aGlzLnVuaXQrXCJzXCJdJiZ0aGlzW3RoaXMudW5pdCtcInNcIl0hPT1udWxsKXt0aGlzW3RoaXMudW5pdCtcInNcIl09dGhpc1t0aGlzLnVuaXQrXCJzXCJdKygodGhpcy5vcGVyYXRvcj09XCJhZGRcIik/MTotMSkrKHRoaXMudmFsdWV8fDApKm9yaWVudDt9ZWxzZSBpZih0aGlzW3RoaXMudW5pdCtcInNcIl09PW51bGx8fHRoaXMub3BlcmF0b3IhPW51bGwpe2lmKCF0aGlzLnZhbHVlKXt0aGlzLnZhbHVlPTE7fVxudGhpc1t0aGlzLnVuaXQrXCJzXCJdPXRoaXMudmFsdWUqb3JpZW50O31cbmlmKHRoaXMubWVyaWRpYW4mJnRoaXMuaG91cil7aWYodGhpcy5tZXJpZGlhbj09XCJwXCImJnRoaXMuaG91cjwxMil7dGhpcy5ob3VyPXRoaXMuaG91cisxMjt9ZWxzZSBpZih0aGlzLm1lcmlkaWFuPT1cImFcIiYmdGhpcy5ob3VyPT0xMil7dGhpcy5ob3VyPTA7fX1cbmlmKHRoaXMud2Vla2RheSYmIXRoaXMuZGF5JiYhdGhpcy5kYXlzKXt2YXIgdGVtcD1EYXRlW3RoaXMud2Vla2RheV0oKTt0aGlzLmRheT10ZW1wLmdldERhdGUoKTtpZih0ZW1wLmdldE1vbnRoKCkhPT10b2RheS5nZXRNb250aCgpKXt0aGlzLm1vbnRoPXRlbXAuZ2V0TW9udGgoKTt9fVxuaWYoKHRoaXMubW9udGh8fHRoaXMubW9udGg9PT0wKSYmIXRoaXMuZGF5KXt0aGlzLmRheT0xO31cbmlmKCF0aGlzLm9yaWVudCYmIXRoaXMub3BlcmF0b3ImJnRoaXMudW5pdD09XCJ3ZWVrXCImJnRoaXMudmFsdWUmJiF0aGlzLmRheSYmIXRoaXMubW9udGgpe3JldHVybiBEYXRlLnRvZGF5KCkuc2V0V2Vlayh0aGlzLnZhbHVlKTt9XG5pZihleHByZXNzaW9uJiZ0aGlzLnRpbWV6b25lJiZ0aGlzLmRheSYmdGhpcy5kYXlzKXt0aGlzLmRheT10aGlzLmRheXM7fVxucmV0dXJuKGV4cHJlc3Npb24pP3RvZGF5LmFkZCh0aGlzKTp0b2RheS5zZXQodGhpcyk7fX07dmFyIF89JEQuUGFyc2luZy5PcGVyYXRvcnMsZz0kRC5HcmFtbWFyLHQ9JEQuVHJhbnNsYXRvcixfZm47Zy5kYXRlUGFydERlbGltaXRlcj1fLnJ0b2tlbigvXihbXFxzXFwtXFwuXFwsXFwvXFx4MjddKykvKTtnLnRpbWVQYXJ0RGVsaW1pdGVyPV8uc3Rva2VuKFwiOlwiKTtnLndoaXRlU3BhY2U9Xy5ydG9rZW4oL15cXHMqLyk7Zy5nZW5lcmFsRGVsaW1pdGVyPV8ucnRva2VuKC9eKChbXFxzXFwsXXxhdHxAfG9uKSspLyk7dmFyIF9DPXt9O2cuY3Rva2VuPWZ1bmN0aW9uKGtleXMpe3ZhciBmbj1fQ1trZXlzXTtpZighZm4pe3ZhciBjPSRDLnJlZ2V4UGF0dGVybnM7dmFyIGt4PWtleXMuc3BsaXQoL1xccysvKSxweD1bXTtmb3IodmFyIGk9MDtpPGt4Lmxlbmd0aDtpKyspe3B4LnB1c2goXy5yZXBsYWNlKF8ucnRva2VuKGNba3hbaV1dKSxreFtpXSkpO31cbmZuPV9DW2tleXNdPV8uYW55LmFwcGx5KG51bGwscHgpO31cbnJldHVybiBmbjt9O2cuY3Rva2VuMj1mdW5jdGlvbihrZXkpe3JldHVybiBfLnJ0b2tlbigkQy5yZWdleFBhdHRlcm5zW2tleV0pO307Zy5oPV8uY2FjaGUoXy5wcm9jZXNzKF8ucnRva2VuKC9eKDBbMC05XXwxWzAtMl18WzEtOV0pLyksdC5ob3VyKSk7Zy5oaD1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXigwWzAtOV18MVswLTJdKS8pLHQuaG91cikpO2cuSD1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXihbMC0xXVswLTldfDJbMC0zXXxbMC05XSkvKSx0LmhvdXIpKTtnLkhIPV8uY2FjaGUoXy5wcm9jZXNzKF8ucnRva2VuKC9eKFswLTFdWzAtOV18MlswLTNdKS8pLHQuaG91cikpO2cubT1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXihbMC01XVswLTldfFswLTldKS8pLHQubWludXRlKSk7Zy5tbT1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXlswLTVdWzAtOV0vKSx0Lm1pbnV0ZSkpO2cucz1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXihbMC01XVswLTldfFswLTldKS8pLHQuc2Vjb25kKSk7Zy5zcz1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXlswLTVdWzAtOV0vKSx0LnNlY29uZCkpO2cuaG1zPV8uY2FjaGUoXy5zZXF1ZW5jZShbZy5ILGcubSxnLnNdLGcudGltZVBhcnREZWxpbWl0ZXIpKTtnLnQ9Xy5jYWNoZShfLnByb2Nlc3MoZy5jdG9rZW4yKFwic2hvcnRNZXJpZGlhblwiKSx0Lm1lcmlkaWFuKSk7Zy50dD1fLmNhY2hlKF8ucHJvY2VzcyhnLmN0b2tlbjIoXCJsb25nTWVyaWRpYW5cIiksdC5tZXJpZGlhbikpO2cuej1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXigoXFwrfFxcLSlcXHMqXFxkXFxkXFxkXFxkKXwoKFxcK3xcXC0pXFxkXFxkXFw6P1xcZFxcZCkvKSx0LnRpbWV6b25lKSk7Zy56ej1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXigoXFwrfFxcLSlcXHMqXFxkXFxkXFxkXFxkKXwoKFxcK3xcXC0pXFxkXFxkXFw6P1xcZFxcZCkvKSx0LnRpbWV6b25lKSk7Zy56eno9Xy5jYWNoZShfLnByb2Nlc3MoZy5jdG9rZW4yKFwidGltZXpvbmVcIiksdC50aW1lem9uZSkpO2cudGltZVN1ZmZpeD1fLmVhY2goXy5pZ25vcmUoZy53aGl0ZVNwYWNlKSxfLnNldChbZy50dCxnLnp6el0pKTtnLnRpbWU9Xy5lYWNoKF8ub3B0aW9uYWwoXy5pZ25vcmUoXy5zdG9rZW4oXCJUXCIpKSksZy5obXMsZy50aW1lU3VmZml4KTtnLmQ9Xy5jYWNoZShfLnByb2Nlc3MoXy5lYWNoKF8ucnRva2VuKC9eKFswLTJdXFxkfDNbMC0xXXxcXGQpLyksXy5vcHRpb25hbChnLmN0b2tlbjIoXCJvcmRpbmFsU3VmZml4XCIpKSksdC5kYXkpKTtnLmRkPV8uY2FjaGUoXy5wcm9jZXNzKF8uZWFjaChfLnJ0b2tlbigvXihbMC0yXVxcZHwzWzAtMV0pLyksXy5vcHRpb25hbChnLmN0b2tlbjIoXCJvcmRpbmFsU3VmZml4XCIpKSksdC5kYXkpKTtnLmRkZD1nLmRkZGQ9Xy5jYWNoZShfLnByb2Nlc3MoZy5jdG9rZW4oXCJzdW4gbW9uIHR1ZSB3ZWQgdGh1IGZyaSBzYXRcIiksZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy53ZWVrZGF5PXM7fTt9KSk7Zy5NPV8uY2FjaGUoXy5wcm9jZXNzKF8ucnRva2VuKC9eKDFbMC0yXXwwXFxkfFxcZCkvKSx0Lm1vbnRoKSk7Zy5NTT1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXigxWzAtMl18MFxcZCkvKSx0Lm1vbnRoKSk7Zy5NTU09Zy5NTU1NPV8uY2FjaGUoXy5wcm9jZXNzKGcuY3Rva2VuKFwiamFuIGZlYiBtYXIgYXByIG1heSBqdW4ganVsIGF1ZyBzZXAgb2N0IG5vdiBkZWNcIiksdC5tb250aCkpO2cueT1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXihcXGRcXGQ/KS8pLHQueWVhcikpO2cueXk9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oXFxkXFxkKS8pLHQueWVhcikpO2cueXl5PV8uY2FjaGUoXy5wcm9jZXNzKF8ucnRva2VuKC9eKFxcZFxcZD9cXGQ/XFxkPykvKSx0LnllYXIpKTtnLnl5eXk9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oXFxkXFxkXFxkXFxkKS8pLHQueWVhcikpO19mbj1mdW5jdGlvbigpe3JldHVybiBfLmVhY2goXy5hbnkuYXBwbHkobnVsbCxhcmd1bWVudHMpLF8ubm90KGcuY3Rva2VuMihcInRpbWVDb250ZXh0XCIpKSk7fTtnLmRheT1fZm4oZy5kLGcuZGQpO2cubW9udGg9X2ZuKGcuTSxnLk1NTSk7Zy55ZWFyPV9mbihnLnl5eXksZy55eSk7Zy5vcmllbnRhdGlvbj1fLnByb2Nlc3MoZy5jdG9rZW4oXCJwYXN0IGZ1dHVyZVwiKSxmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXt0aGlzLm9yaWVudD1zO307fSk7Zy5vcGVyYXRvcj1fLnByb2Nlc3MoZy5jdG9rZW4oXCJhZGQgc3VidHJhY3RcIiksZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5vcGVyYXRvcj1zO307fSk7Zy5yZGF5PV8ucHJvY2VzcyhnLmN0b2tlbihcInllc3RlcmRheSB0b21vcnJvdyB0b2RheSBub3dcIiksdC5yZGF5KTtnLnVuaXQ9Xy5wcm9jZXNzKGcuY3Rva2VuKFwic2Vjb25kIG1pbnV0ZSBob3VyIGRheSB3ZWVrIG1vbnRoIHllYXJcIiksZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy51bml0PXM7fTt9KTtnLnZhbHVlPV8ucHJvY2VzcyhfLnJ0b2tlbigvXlxcZFxcZD8oc3R8bmR8cmR8dGgpPy8pLGZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbigpe3RoaXMudmFsdWU9cy5yZXBsYWNlKC9cXEQvZyxcIlwiKTt9O30pO2cuZXhwcmVzc2lvbj1fLnNldChbZy5yZGF5LGcub3BlcmF0b3IsZy52YWx1ZSxnLnVuaXQsZy5vcmllbnRhdGlvbixnLmRkZCxnLk1NTV0pO19mbj1mdW5jdGlvbigpe3JldHVybiBfLnNldChhcmd1bWVudHMsZy5kYXRlUGFydERlbGltaXRlcik7fTtnLm1keT1fZm4oZy5kZGQsZy5tb250aCxnLmRheSxnLnllYXIpO2cueW1kPV9mbihnLmRkZCxnLnllYXIsZy5tb250aCxnLmRheSk7Zy5kbXk9X2ZuKGcuZGRkLGcuZGF5LGcubW9udGgsZy55ZWFyKTtnLmRhdGU9ZnVuY3Rpb24ocyl7cmV0dXJuKChnWyRDLmRhdGVFbGVtZW50T3JkZXJdfHxnLm1keSkuY2FsbCh0aGlzLHMpKTt9O2cuZm9ybWF0PV8ucHJvY2VzcyhfLm1hbnkoXy5hbnkoXy5wcm9jZXNzKF8ucnRva2VuKC9eKGRkP2Q/ZD98TU0/TT9NP3x5eT95P3k/fGhoP3xISD98bW0/fHNzP3x0dD98eno/ej8pLyksZnVuY3Rpb24oZm10KXtpZihnW2ZtdF0pe3JldHVybiBnW2ZtdF07fWVsc2V7dGhyb3cgJEQuUGFyc2luZy5FeGNlcHRpb24oZm10KTt9fSksXy5wcm9jZXNzKF8ucnRva2VuKC9eW15kTXloSG1zdHpdKy8pLGZ1bmN0aW9uKHMpe3JldHVybiBfLmlnbm9yZShfLnN0b2tlbihzKSk7fSkpKSxmdW5jdGlvbihydWxlcyl7cmV0dXJuIF8ucHJvY2VzcyhfLmVhY2guYXBwbHkobnVsbCxydWxlcyksdC5maW5pc2hFeGFjdCk7fSk7dmFyIF9GPXt9O3ZhciBfZ2V0PWZ1bmN0aW9uKGYpe3JldHVybiBfRltmXT0oX0ZbZl18fGcuZm9ybWF0KGYpWzBdKTt9O2cuZm9ybWF0cz1mdW5jdGlvbihmeCl7aWYoZnggaW5zdGFuY2VvZiBBcnJheSl7dmFyIHJ4PVtdO2Zvcih2YXIgaT0wO2k8ZngubGVuZ3RoO2krKyl7cngucHVzaChfZ2V0KGZ4W2ldKSk7fVxucmV0dXJuIF8uYW55LmFwcGx5KG51bGwscngpO31lbHNle3JldHVybiBfZ2V0KGZ4KTt9fTtnLl9mb3JtYXRzPWcuZm9ybWF0cyhbXCJcXFwieXl5eS1NTS1kZFRISDptbTpzc1pcXFwiXCIsXCJ5eXl5LU1NLWRkVEhIOm1tOnNzWlwiLFwieXl5eS1NTS1kZFRISDptbTpzc3pcIixcInl5eXktTU0tZGRUSEg6bW06c3NcIixcInl5eXktTU0tZGRUSEg6bW1aXCIsXCJ5eXl5LU1NLWRkVEhIOm1telwiLFwieXl5eS1NTS1kZFRISDptbVwiLFwiZGRkLCBNTU0gZGQsIHl5eXkgSDptbTpzcyB0dFwiLFwiZGRkIE1NTSBkIHl5eXkgSEg6bW06c3Mgenp6XCIsXCJNTWRkeXl5eVwiLFwiZGRNTXl5eXlcIixcIk1kZHl5eXlcIixcImRkTXl5eXlcIixcIk1keXl5eVwiLFwiZE15eXl5XCIsXCJ5eXl5XCIsXCJNZHl5XCIsXCJkTXl5XCIsXCJkXCJdKTtnLl9zdGFydD1fLnByb2Nlc3MoXy5zZXQoW2cuZGF0ZSxnLnRpbWUsZy5leHByZXNzaW9uXSxnLmdlbmVyYWxEZWxpbWl0ZXIsZy53aGl0ZVNwYWNlKSx0LmZpbmlzaCk7Zy5zdGFydD1mdW5jdGlvbihzKXt0cnl7dmFyIHI9Zy5fZm9ybWF0cy5jYWxsKHt9LHMpO2lmKHJbMV0ubGVuZ3RoPT09MCl7cmV0dXJuIHI7fX1jYXRjaChlKXt9XG5yZXR1cm4gZy5fc3RhcnQuY2FsbCh7fSxzKTt9OyRELl9wYXJzZT0kRC5wYXJzZTskRC5wYXJzZT1mdW5jdGlvbihzKXt2YXIgcj1udWxsO2lmKCFzKXtyZXR1cm4gbnVsbDt9XG5pZihzIGluc3RhbmNlb2YgRGF0ZSl7cmV0dXJuIHM7fVxudHJ5e3I9JEQuR3JhbW1hci5zdGFydC5jYWxsKHt9LHMucmVwbGFjZSgvXlxccyooXFxTKihcXHMrXFxTKykqKVxccyokLyxcIiQxXCIpKTt9Y2F0Y2goZSl7cmV0dXJuIG51bGw7fVxucmV0dXJuKChyWzFdLmxlbmd0aD09PTApP3JbMF06bnVsbCk7fTskRC5nZXRQYXJzZUZ1bmN0aW9uPWZ1bmN0aW9uKGZ4KXt2YXIgZm49JEQuR3JhbW1hci5mb3JtYXRzKGZ4KTtyZXR1cm4gZnVuY3Rpb24ocyl7dmFyIHI9bnVsbDt0cnl7cj1mbi5jYWxsKHt9LHMpO31jYXRjaChlKXtyZXR1cm4gbnVsbDt9XG5yZXR1cm4oKHJbMV0ubGVuZ3RoPT09MCk/clswXTpudWxsKTt9O307JEQucGFyc2VFeGFjdD1mdW5jdGlvbihzLGZ4KXtyZXR1cm4gJEQuZ2V0UGFyc2VGdW5jdGlvbihmeCkocyk7fTt9KCkpO1xyXG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIoZnVuY3Rpb24oKXtcclxuICB2YXIgY3J5cHQgPSByZXF1aXJlKCdjcnlwdCcpLFxyXG4gICAgICB1dGY4ID0gcmVxdWlyZSgnY2hhcmVuYycpLnV0ZjgsXHJcbiAgICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyksXHJcbiAgICAgIGJpbiA9IHJlcXVpcmUoJ2NoYXJlbmMnKS5iaW4sXHJcblxyXG4gIC8vIFRoZSBjb3JlXHJcbiAgbWQ1ID0gZnVuY3Rpb24gKG1lc3NhZ2UsIG9wdGlvbnMpIHtcclxuICAgIC8vIENvbnZlcnQgdG8gYnl0ZSBhcnJheVxyXG4gICAgaWYgKG1lc3NhZ2UuY29uc3RydWN0b3IgPT0gU3RyaW5nKVxyXG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVuY29kaW5nID09PSAnYmluYXJ5JylcclxuICAgICAgICBtZXNzYWdlID0gYmluLnN0cmluZ1RvQnl0ZXMobWVzc2FnZSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBtZXNzYWdlID0gdXRmOC5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgZWxzZSBpZiAoaXNCdWZmZXIobWVzc2FnZSkpXHJcbiAgICAgIG1lc3NhZ2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtZXNzYWdlLCAwKTtcclxuICAgIGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG1lc3NhZ2UpKVxyXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS50b1N0cmluZygpO1xyXG4gICAgLy8gZWxzZSwgYXNzdW1lIGJ5dGUgYXJyYXkgYWxyZWFkeVxyXG5cclxuICAgIHZhciBtID0gY3J5cHQuYnl0ZXNUb1dvcmRzKG1lc3NhZ2UpLFxyXG4gICAgICAgIGwgPSBtZXNzYWdlLmxlbmd0aCAqIDgsXHJcbiAgICAgICAgYSA9ICAxNzMyNTg0MTkzLFxyXG4gICAgICAgIGIgPSAtMjcxNzMzODc5LFxyXG4gICAgICAgIGMgPSAtMTczMjU4NDE5NCxcclxuICAgICAgICBkID0gIDI3MTczMzg3ODtcclxuXHJcbiAgICAvLyBTd2FwIGVuZGlhblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1baV0gPSAoKG1baV0gPDwgIDgpIHwgKG1baV0gPj4+IDI0KSkgJiAweDAwRkYwMEZGIHxcclxuICAgICAgICAgICAgICgobVtpXSA8PCAyNCkgfCAobVtpXSA+Pj4gIDgpKSAmIDB4RkYwMEZGMDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGFkZGluZ1xyXG4gICAgbVtsID4+PiA1XSB8PSAweDgwIDw8IChsICUgMzIpO1xyXG4gICAgbVsoKChsICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGw7XHJcblxyXG4gICAgLy8gTWV0aG9kIHNob3J0Y3V0c1xyXG4gICAgdmFyIEZGID0gbWQ1Ll9mZixcclxuICAgICAgICBHRyA9IG1kNS5fZ2csXHJcbiAgICAgICAgSEggPSBtZDUuX2hoLFxyXG4gICAgICAgIElJID0gbWQ1Ll9paTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpICs9IDE2KSB7XHJcblxyXG4gICAgICB2YXIgYWEgPSBhLFxyXG4gICAgICAgICAgYmIgPSBiLFxyXG4gICAgICAgICAgY2MgPSBjLFxyXG4gICAgICAgICAgZGQgPSBkO1xyXG5cclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgMF0sICA3LCAtNjgwODc2OTM2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE3LCAgNjA2MTA1ODE5KTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDRdLCAgNywgLTE3NjQxODg5Nyk7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDVdLCAxMiwgIDEyMDAwODA0MjYpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsgN10sIDIyLCAtNDU3MDU5ODMpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA4XSwgIDcsICAxNzcwMDM1NDE2KTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTBdLCAxNywgLTQyMDYzKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krMTJdLCAgNywgIDE4MDQ2MDM2ODIpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krMTRdLCAxNywgLTE1MDIwMDIyOTApO1xyXG4gICAgICBiID0gRkYoYiwgYywgZCwgYSwgbVtpKzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDFdLCAgNSwgLTE2NTc5NjUxMCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDZdLCAgOSwgLTEwNjk1MDE2MzIpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA1XSwgIDUsIC03MDE1NTg2OTEpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzEwXSwgIDksICAzODAxNjA4Myk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krIDRdLCAyMCwgLTQwNTUzNzg0OCk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krIDldLCAgNSwgIDU2ODQ0NjQzOCk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krMTRdLCAgOSwgLTEwMTk4MDM2OTApO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKyAzXSwgMTQsIC0xODczNjM5NjEpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsxM10sICA1LCAtMTQ0NDY4MTQ2Nyk7XHJcbiAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBtW2krIDJdLCAgOSwgLTUxNDAzNzg0KTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbiAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBtW2krMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgNV0sICA0LCAtMzc4NTU4KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKzE0XSwgMjMsIC0zNTMwOTU1Nik7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDFdLCAgNCwgLTE1MzA5OTIwNjApO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyA0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsgN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krMTNdLCAgNCwgIDY4MTI3OTE3NCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDBdLCAxMSwgLTM1ODUzNzIyMik7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDZdLCAyMywgIDc2MDI5MTg5KTtcclxuICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIG1baSsgOV0sICA0LCAtNjQwMzY0NDg3KTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIG1baSsxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcclxuXHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDBdLCAgNiwgLTE5ODYzMDg0NCk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDYsICAxNzAwNDg1NTcxKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsgM10sIDEwLCAtMTg5NDk4NjYwNik7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgOF0sICA2LCAgMTg3MzMxMzM1OSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krMTNdLCAyMSwgIDEzMDkxNTE2NDkpO1xyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDYsIC0xNDU1MjMwNzApO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsgMl0sIDE1LCAgNzE4Nzg3MjU5KTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbiAgICAgIGEgPSAoYSArIGFhKSA+Pj4gMDtcclxuICAgICAgYiA9IChiICsgYmIpID4+PiAwO1xyXG4gICAgICBjID0gKGMgKyBjYykgPj4+IDA7XHJcbiAgICAgIGQgPSAoZCArIGRkKSA+Pj4gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY3J5cHQuZW5kaWFuKFthLCBiLCBjLCBkXSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gQXV4aWxpYXJ5IGZ1bmN0aW9uc1xyXG4gIG1kNS5fZmYgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgYyB8IH5iICYgZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5fZ2cgID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiICYgZCB8IGMgJiB+ZCkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG4gIG1kNS5faGggID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxuICAgIHZhciBuID0gYSArIChiIF4gYyBeIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2lpICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYyBeIChiIHwgfmQpKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcblxyXG4gIC8vIFBhY2thZ2UgcHJpdmF0ZSBibG9ja3NpemVcclxuICBtZDUuX2Jsb2Nrc2l6ZSA9IDE2O1xyXG4gIG1kNS5fZGlnZXN0c2l6ZSA9IDE2O1xyXG5cclxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobWVzc2FnZSA9PT0gdW5kZWZpbmVkIHx8IG1lc3NhZ2UgPT09IG51bGwpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSWxsZWdhbCBhcmd1bWVudCAnICsgbWVzc2FnZSk7XHJcblxyXG4gICAgdmFyIGRpZ2VzdGJ5dGVzID0gY3J5cHQud29yZHNUb0J5dGVzKG1kNShtZXNzYWdlLCBvcHRpb25zKSk7XHJcbiAgICByZXR1cm4gb3B0aW9ucyAmJiBvcHRpb25zLmFzQnl0ZXMgPyBkaWdlc3RieXRlcyA6XHJcbiAgICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLmFzU3RyaW5nID8gYmluLmJ5dGVzVG9TdHJpbmcoZGlnZXN0Ynl0ZXMpIDpcclxuICAgICAgICBjcnlwdC5ieXRlc1RvSGV4KGRpZ2VzdGJ5dGVzKTtcclxuICB9O1xyXG5cclxufSkoKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbi8qKlxyXG4gKiBEZXBlbmRzIG9uIEV4cGVuc2VzIHRvIHBhcnNlIHRoZW1cclxuICogYW5kIHJldHJpZXZlIHRoZSB0b3RhbCB2YWx1ZXMgZm9yIGVhY2ggY2F0ZWdvcnlcclxuICovXHJcbnZhciBDYXRlZ29yeUNvbGxlY3Rpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKENhdGVnb3J5Q29sbGVjdGlvbiwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIENhdGVnb3J5Q29sbGVjdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeUNvdW50ID0gW107XHJcbiAgICB9XHJcbiAgICBDYXRlZ29yeUNvbGxlY3Rpb24ucHJvdG90eXBlLnNldEV4cGVuc2VzID0gZnVuY3Rpb24gKGV4KSB7XHJcbiAgICAgICAgdGhpcy5leHBlbnNlcyA9IGV4O1xyXG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5leHBlbnNlcywgXCJjaGFuZ2VcIiwgdGhpcy5jaGFuZ2UpO1xyXG4gICAgfTtcclxuICAgIENhdGVnb3J5Q29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0Q2F0ZWdvcmllc0Zyb21FeHBlbnNlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZXhwZW5zZXMuZWFjaChmdW5jdGlvbiAodHJhbnNhY3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIGNhdGVnb3J5TmFtZSA9IHRyYW5zYWN0aW9uLmdldCgnY2F0ZWdvcnknKTtcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuaW5jcmVtZW50Q2F0ZWdvcnlEYXRhKGNhdGVnb3J5TmFtZSwgdHJhbnNhY3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmNhdGVnb3J5Q291bnQpO1xyXG4gICAgfTtcclxuICAgIENhdGVnb3J5Q29sbGVjdGlvbi5wcm90b3R5cGUuaW5jcmVtZW50Q2F0ZWdvcnlEYXRhID0gZnVuY3Rpb24gKGNhdGVnb3J5TmFtZSwgdHJhbnNhY3Rpb24pIHtcclxuICAgICAgICB2YXIgZXhpc3RzID0gXy5maW5kV2hlcmUodGhpcy5jYXRlZ29yeUNvdW50LCB7IGNhdE5hbWU6IGNhdGVnb3J5TmFtZSB9KTtcclxuICAgICAgICBpZiAoZXhpc3RzKSB7XHJcbiAgICAgICAgICAgIGV4aXN0cy5jb3VudCsrO1xyXG4gICAgICAgICAgICBleGlzdHMuYW1vdW50ICs9IHBhcnNlRmxvYXQodHJhbnNhY3Rpb24uZ2V0KCdhbW91bnQnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhdGVnb3J5Q291bnQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBjYXROYW1lOiBjYXRlZ29yeU5hbWUsXHJcbiAgICAgICAgICAgICAgICBjb3VudDogMCxcclxuICAgICAgICAgICAgICAgIGFtb3VudDogMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgQ2F0ZWdvcnlDb2xsZWN0aW9uLnByb3RvdHlwZS5jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NhdGVnb3J5Q29sbGVjdGlvbi5jaGFuZ2UnKTtcclxuICAgICAgICB0aGlzLmdldENhdGVnb3JpZXNGcm9tRXhwZW5zZXMoKTtcclxuICAgIH07XHJcbiAgICBDYXRlZ29yeUNvbGxlY3Rpb24ucHJvdG90eXBlLmdldENhdGVnb3J5Q291bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhdGVnb3J5Q291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzRnJvbUV4cGVuc2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNhdGVnb3J5Q291bnQ7XHJcbiAgICB9O1xyXG4gICAgQ2F0ZWdvcnlDb2xsZWN0aW9uLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jYXRlZ29yeUNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2F0ZWdvcmllc0Zyb21FeHBlbnNlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcnlDb3VudC5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBvcHRpb25zLnB1c2godmFsdWUuY2F0TmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENhdGVnb3J5Q29sbGVjdGlvbjtcclxufShCYWNrYm9uZS5Db2xsZWN0aW9uKSk7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ2F0ZWdvcnlDb2xsZWN0aW9uO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DYXRlZ29yeUNvbGxlY3Rpb24uanMubWFwIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2JhY2tib25lLXR5cGluZ3MvYmFja2JvbmUuZC50c1wiLz5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBDYXRlZ29yeVZpZXcgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKENhdGVnb3J5VmlldywgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIENhdGVnb3J5VmlldyhvcHRpb25zKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI2NhdGVnb3J5VGVtcGxhdGUnKS5odG1sKCkpO1xyXG4gICAgICAgIHRoaXMuc2V0RWxlbWVudCgkKCcjY2F0ZWdvcmllcycpKTtcclxuICAgIH1cclxuICAgIENhdGVnb3J5Vmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBbXTtcclxuICAgICAgICB2YXIgY2F0ZWdvcnlDb3VudCA9IHRoaXMubW9kZWwuZ2V0Q2F0ZWdvcnlDb3VudCgpO1xyXG4gICAgICAgIHZhciBzdW0gPSBfLnJlZHVjZShjYXRlZ29yeUNvdW50LCBmdW5jdGlvbiAobWVtbywgaXRlbSkge1xyXG4gICAgICAgICAgICAvLyBvbmx5IGV4cGVuc2VzXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmNhdE5hbWUgIT0gJ0RlZmF1bHQnICYmIGl0ZW0uYW1vdW50IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lbW8gKyBpdGVtLmFtb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZW1vO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc3VtJywgc3VtKTtcclxuICAgICAgICBjYXRlZ29yeUNvdW50ID0gXy5zb3J0QnkoY2F0ZWdvcnlDb3VudCwgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtZWwuYW1vdW50O1xyXG4gICAgICAgIH0pLnJldmVyc2UoKTtcclxuICAgICAgICBfLmVhY2goY2F0ZWdvcnlDb3VudCwgZnVuY3Rpb24gKGNhdENvdW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjYXRDb3VudC5jYXROYW1lICE9ICdEZWZhdWx0JyAmJiBjYXRDb3VudC5hbW91bnQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSBNYXRoLnJvdW5kKDEwMCAqICgtY2F0Q291bnQuYW1vdW50KSAvIC1zdW0pICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjYXRDb3VudC5jYXROYW1lLCB3aWR0aCwgY2F0Q291bnQuY291bnQsIGNhdENvdW50LmFtb3VudCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnB1c2goX3RoaXMudGVtcGxhdGUoXy5leHRlbmQoY2F0Q291bnQsIHtcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBNYXRoLnJvdW5kKGNhdENvdW50LmFtb3VudClcclxuICAgICAgICAgICAgICAgIH0pKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiRlbC5odG1sKGNvbnRlbnQuam9pbignXFxuJykpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIENhdGVnb3J5Vmlldy5wcm90b3R5cGUuY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdtb2RlbCBjaGFuZ2VkJywgdGhpcy5tb2RlbCk7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCByZW5kZXJpbmcgc2luY2UgdGhpcy5tb2RlbCBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENhdGVnb3J5VmlldztcclxufShCYWNrYm9uZS5WaWV3KSk7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ2F0ZWdvcnlWaWV3O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DYXRlZ29yeVZpZXcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBFeHBlbnNlVGFibGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEV4cGVuc2VUYWJsZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEV4cGVuc2VUYWJsZShvcHRpb25zKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3Jvd1RlbXBsYXRlJykuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnQoJCgnI2V4cGVuc2VUYWJsZScpKTtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIEV4cGVuc2VUYWJsZS5wcm90b3R5cGUuc2V0Q2F0ZWdvcnlMaXN0ID0gZnVuY3Rpb24gKGxpc3QpIHtcclxuICAgICAgICB0aGlzLmNhdGVnb3J5TGlzdCA9IGxpc3Q7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZVRhYmxlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygnRXhwZW5zZVRhYmxlLnJlbmRlcigpJywgdGhpcy5tb2RlbC5zaXplKCkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubW9kZWwpO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdGhpcy5tb2RlbC5lYWNoKGZ1bmN0aW9uICh0cmFuc2FjdGlvbikge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRyYW5zYWN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0cmFuc2FjdGlvbi50b0pTT04oKTtcclxuICAgICAgICAgICAgLy9pZiAoYXR0cmlidXRlcy5hbW91bnQgPT0gLTE1LjUzKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYXR0cmlidXRlcywgdHJhbnNhY3Rpb24pO1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoJ2RhdGUnKSkge1xyXG4gICAgICAgICAgICAgICAgcm93cy5wdXNoKF90aGlzLnRlbXBsYXRlKGF0dHJpYnV0ZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBkYXRlJywgYXR0cmlidXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVuZGVyaW5nJywgcm93cy5sZW5ndGgsICdyb3dzJyk7XHJcbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kKHJvd3Muam9pbignXFxuJykpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy4kZWwpO1xyXG4gICAgICAgICQoJyNkYXRlRnJvbScpLmh0bWwodGhpcy5tb2RlbC5nZXREYXRlRnJvbSgpLnRvU3RyaW5nKCd5eXl5LU1NLWRkJykpO1xyXG4gICAgICAgICQoJyNkYXRlVGlsbCcpLmh0bWwodGhpcy5tb2RlbC5nZXREYXRlVGlsbCgpLnRvU3RyaW5nKCd5eXl5LU1NLWRkJykpO1xyXG4gICAgICAgIHRoaXMuJGVsLm9uKCdjbGljaycsICdzZWxlY3QnLCB0aGlzLm9wZW5TZWxlY3QuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZVRhYmxlLnByb3RvdHlwZS5vcGVuU2VsZWN0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb3BlblNlbGVjdCcsIHRoaXMsIGV2ZW50KTtcclxuICAgICAgICB2YXIgJHNlbGVjdCA9ICQoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICBpZiAoJHNlbGVjdC5maW5kKCdvcHRpb24nKS5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICB2YXIgZGVmVmFsXzEgPSAkc2VsZWN0LmZpbmQoJ29wdGlvbicpLmh0bWwoKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmNhdGVnb3J5TGlzdC5nZXRPcHRpb25zKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkLmVhY2gob3B0aW9ucywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBkZWZWYWxfMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkKFwiPG9wdGlvbj48L29wdGlvbj5cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ2YWx1ZVwiLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQodmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzZWxlY3Qub24oJ2NoYW5nZScsIHRoaXMubmV3Q2F0ZWdvcnkuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIEV4cGVuc2VUYWJsZS5wcm90b3R5cGUubmV3Q2F0ZWdvcnkgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50KTtcclxuICAgICAgICB2YXIgJHNlbGVjdCA9ICQoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdzZWxlY3RlZCcsICRzZWxlY3QudmFsKCkpO1xyXG4gICAgICAgIHZhciBpZCA9ICRzZWxlY3QuY2xvc2VzdCgndHInKS5hdHRyKCdkYXRhLWlkJyk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpZCk7XHJcbiAgICAgICAgdmFyIHRyYW5zYWN0aW9uID0gdGhpcy5tb2RlbC5nZXQoaWQpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codHJhbnNhY3Rpb24pO1xyXG4gICAgICAgIGlmICh0cmFuc2FjdGlvbikge1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5zZXRDYXRlZ29yeSgkc2VsZWN0LnZhbCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEV4cGVuc2VUYWJsZTtcclxufShCYWNrYm9uZS5WaWV3KSk7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXhwZW5zZVRhYmxlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1FeHBlbnNlVGFibGUuanMubWFwIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvYmFja2JvbmUtdHlwaW5ncy9iYWNrYm9uZS5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInVtc2FldHplLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIlBhcGEuZC50c1wiIC8+XHJcblwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgdW1zYWV0emVfMSA9IHJlcXVpcmUoJy4vdW1zYWV0emUnKTtcclxudmFyIFRyYW5zYWN0aW9uXzEgPSByZXF1aXJlKCcuL1RyYW5zYWN0aW9uJyk7XHJcbnJlcXVpcmUoJ2RhdGVqcycpO1xyXG52YXIgRXhwZW5zZXMgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEV4cGVuc2VzLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRXhwZW5zZXMoKSB7XHJcbiAgICAgICAgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1vZGVsID0gVHJhbnNhY3Rpb25fMVtcImRlZmF1bHRcIl07XHJcbiAgICAgICAgdGhpcy5jc3ZVcmwgPSAnLi4vdW1zYWV0emUtMTA5MDcyOS0yMDE2LTA3LTI3LTAwLTExLTI5LmNhdC5jc3YnO1xyXG4gICAgfVxyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjc3ZVcmwnLCB0aGlzLmNzdlVybCk7XHJcbiAgICAgICAgcmV0dXJuICQuZ2V0KHRoaXMuY3N2VXJsLCBmdW5jdGlvbiAocmVzcG9uc2UsIHhocikge1xyXG4gICAgICAgICAgICB2YXIgY3N2ID0gUGFwYS5wYXJzZShyZXNwb25zZSwge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZHluYW1pY1R5cGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNraXBFbXB0eUxpbmVzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNzdik7XHJcbiAgICAgICAgICAgIGlmIChmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgXy5lYWNoKGNzdi5kYXRhLCBfdGhpcy5wcm9jZXNzUm93LmJpbmQoX3RoaXMpKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnByb2Nlc3NEb25lKGNzdi5kYXRhLmxlbmd0aCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1bXNhZXR6ZV8xLmFzeW5jTG9vcChjc3YuZGF0YSwgX3RoaXMucHJvY2Vzc1Jvdy5iaW5kKF90aGlzKSwgX3RoaXMucHJvY2Vzc0RvbmUuYmluZChfdGhpcywgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLnByb2Nlc3NSb3cgPSBmdW5jdGlvbiAocm93LCBpLCBsZW5ndGgpIHtcclxuICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGgucm91bmQoMTAwICogaSAvIGxlbmd0aCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhyb3cpO1xyXG4gICAgICAgICQoJy5wcm9ncmVzcyAucHJvZ3Jlc3MtYmFyJykud2lkdGgocGVyY2VudCArICclJyk7XHJcbiAgICAgICAgaWYgKHJvdyAmJiByb3cuYW1vdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKG5ldyBUcmFuc2FjdGlvbl8xW1wiZGVmYXVsdFwiXShyb3cpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy90aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfTtcclxuICAgIEV4cGVuc2VzLnByb3RvdHlwZS5wcm9jZXNzRG9uZSA9IGZ1bmN0aW9uIChjb3VudCwgb3B0aW9ucykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdhc3luY0xvb3AgZmluaXNoZWQnLCBjb3VudCk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MuY2FsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfTtcclxuICAgIEV4cGVuc2VzLnByb3RvdHlwZS5nZXREYXRlRnJvbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbWluID0gbmV3IERhdGUoKS52YWx1ZU9mKCk7XHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGUgPSBEYXRlLnBhcnNlKHJvdy5nZXQoJ2RhdGUnKSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRlIDwgbWluKSB7XHJcbiAgICAgICAgICAgICAgICBtaW4gPSBkYXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG1pbik7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLmdldERhdGVUaWxsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtaW4gPSBuZXcgRGF0ZSgnMTk3MC0wMS0wMScpLnZhbHVlT2YoKTtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IERhdGUucGFyc2Uocm93LmdldCgnZGF0ZScpKTtcclxuICAgICAgICAgICAgaWYgKGRhdGUgPiBtaW4pIHtcclxuICAgICAgICAgICAgICAgIG1pbiA9IGRhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUobWluKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRXhwZW5zZXM7XHJcbn0oQmFja2JvbmUuQ29sbGVjdGlvbikpO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4cGVuc2VzO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1FeHBlbnNlcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIvPlxyXG4vLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvYmFja2JvbmUtdHlwaW5ncy9iYWNrYm9uZS5kLnRzXCIvPlxyXG52YXIgbWQ1ID0gcmVxdWlyZSgnbWQ1Jyk7XHJcbnZhciBUcmFuc2FjdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoVHJhbnNhY3Rpb24sIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBUcmFuc2FjdGlvbihhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgYXR0cmlidXRlcywgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2lkJywgbWQ1KHRoaXMuZ2V0KCdkYXRlJykgKyB0aGlzLmdldCgnYW1vdW50JykpKTtcclxuICAgIH1cclxuICAgIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFtb3VudCA+PSAwID8gJ3Bvc2l0aXZlJyA6ICduZWdhdGl2ZSc7XHJcbiAgICB9O1xyXG4gICAgVHJhbnNhY3Rpb24ucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIganNvbiA9IF9zdXBlci5wcm90b3R5cGUudG9KU09OLmNhbGwodGhpcyk7XHJcbiAgICAgICAganNvbi5zaWduID0gdGhpcy5zaWduKCk7XHJcbiAgICAgICAganNvbi5pZCA9IHRoaXMuaWQ7XHJcbiAgICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9O1xyXG4gICAgVHJhbnNhY3Rpb24ucHJvdG90eXBlLnNldENhdGVnb3J5ID0gZnVuY3Rpb24gKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2NhdGVnb3J5JywgY2F0ZWdvcnkpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBUcmFuc2FjdGlvbjtcclxufShCYWNrYm9uZS5Nb2RlbCkpO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFRyYW5zYWN0aW9uO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1UcmFuc2FjdGlvbi5qcy5tYXAiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9iYWNrYm9uZS10eXBpbmdzL2JhY2tib25lLmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiRXhwZW5zZXMudHNcIiAvPlxyXG5cInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIEV4cGVuc2VzXzEgPSByZXF1aXJlKCcuL0V4cGVuc2VzJyk7XHJcbnZhciBFeHBlbnNlVGFibGVfMSA9IHJlcXVpcmUoJy4vRXhwZW5zZVRhYmxlJyk7XHJcbnZhciBDYXRlZ29yeVZpZXdfMSA9IHJlcXVpcmUoJy4vQ2F0ZWdvcnlWaWV3Jyk7XHJcbnZhciBDYXRlZ29yeUNvbGxlY3Rpb25fMSA9IHJlcXVpcmUoXCIuL0NhdGVnb3J5Q29sbGVjdGlvblwiKTtcclxuZnVuY3Rpb24gYXN5bmNMb29wKGFyciwgY2FsbGJhY2ssIGRvbmUpIHtcclxuICAgIChmdW5jdGlvbiBsb29wKGkpIHtcclxuICAgICAgICBjYWxsYmFjayhhcnJbaV0sIGksIGFyci5sZW5ndGgpOyAvL2NhbGxiYWNrIHdoZW4gdGhlIGxvb3AgZ29lcyBvblxyXG4gICAgICAgIGlmIChpIDwgYXJyLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgbG9vcCgrK2kpOyB9LCAxKTsgLy9yZXJ1biB3aGVuIGNvbmRpdGlvbiBpcyB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgZG9uZShhcnIubGVuZ3RoKTsgLy9jYWxsYmFjayB3aGVuIHRoZSBsb29wIGVuZHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0oMCkpOyAvL3N0YXJ0IHdpdGggMFxyXG59XHJcbmV4cG9ydHMuYXN5bmNMb29wID0gYXN5bmNMb29wO1xyXG52YXIgQXBwVmlldyA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoQXBwVmlldywgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEFwcFZpZXcob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NvbnN0cnVjdCBBcHBWaWV3Jyk7XHJcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50KCQoJyNhcHAnKSk7XHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyBFeHBlbnNlc18xW1wiZGVmYXVsdFwiXSgpO1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcnlMaXN0ID0gbmV3IENhdGVnb3J5Q29sbGVjdGlvbl8xW1wiZGVmYXVsdFwiXSgpO1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcnlMaXN0LnNldEV4cGVuc2VzKHRoaXMubW9kZWwpO1xyXG4gICAgICAgIHRoaXMudGFibGUgPSBuZXcgRXhwZW5zZVRhYmxlXzFbXCJkZWZhdWx0XCJdKHtcclxuICAgICAgICAgICAgbW9kZWw6IHRoaXMubW9kZWwsXHJcbiAgICAgICAgICAgIGVsOiAkKCcjZXhwZW5zZVRhYmxlJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRhYmxlLnNldENhdGVnb3J5TGlzdCh0aGlzLmNhdGVnb3J5TGlzdCk7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yaWVzID0gbmV3IENhdGVnb3J5Vmlld18xW1wiZGVmYXVsdFwiXSh7XHJcbiAgICAgICAgICAgIG1vZGVsOiB0aGlzLmNhdGVnb3J5TGlzdFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjYXRlZ29yeSB2aWV3IG1vZGVsJywgdGhpcy5jYXRlZ29yaWVzLm1vZGVsKTtcclxuICAgICAgICB0aGlzLnN0YXJ0TG9hZGluZygpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuZmV0Y2goe1xyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zdG9wTG9hZGluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcImNoYW5nZVwiLCB0aGlzLnJlbmRlcik7XHJcbiAgICAgICAgLy90aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwiY2hhbmdlXCIsIHRoaXMudGFibGUucmVuZGVyKTtcclxuICAgICAgICAvL3RoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJjaGFuZ2VcIiwgdGhpcy5jYXRlZ29yaWVzLmNoYW5nZSk7IC8vIHdyb25nIG1vZGVsIGluc2lkZSA/IHdmdD8hXHJcbiAgICB9XHJcbiAgICBBcHBWaWV3LnByb3RvdHlwZS5zdGFydExvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0TG9hZGluZycpO1xyXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI2xvYWRpbmdCYXInKS5odG1sKCkpO1xyXG4gICAgICAgIHRoaXMuJGVsLmh0bWwodGVtcGxhdGUoKSk7XHJcbiAgICB9O1xyXG4gICAgQXBwVmlldy5wcm90b3R5cGUuc3RvcExvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3BMb2FkaW5nJyk7XHJcbiAgICAgICAgdGhpcy4kZWwuaHRtbCgnRG9uZScpO1xyXG4gICAgfTtcclxuICAgIEFwcFZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQXBwVmlldy5yZW5kZXIoKScsIHRoaXMubW9kZWwuc2l6ZSgpKTtcclxuICAgICAgICBpZiAodGhpcy5tb2RlbCAmJiB0aGlzLm1vZGVsLnNpemUoKSkge1xyXG4gICAgICAgICAgICAvL3RoaXMudGFibGUucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwoJ1RhYmxlIHNob3duJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcy5jaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRMb2FkaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBBcHBWaWV3O1xyXG59KEJhY2tib25lLlZpZXcpKTtcclxuJChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgYXBwID0gbmV3IEFwcFZpZXcoKTtcclxuICAgIGFwcC5yZW5kZXIoKTtcclxufSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVtc2FldHplLmpzLm1hcCJdfQ==
