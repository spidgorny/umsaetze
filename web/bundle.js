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
        this.categoryCount = [];
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
            exists.amount += transaction.get('amount');
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
            if (item.catName != 'Default') {
                return memo + item.amount;
            }
            else {
                return memo;
            }
        }, 0);
        //console.log('sum', sum);
        categoryCount = _.sortBy(categoryCount, function (el) {
            return Math.abs(el.amount);
        }).reverse();
        _.each(categoryCount, function (catCount) {
            if (catCount.catName != 'Default') {
                var width = Math.round(100 * Math.abs(catCount.amount) / Math.abs(sum)) + '%';
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
        console.log('CategoryView changed', this.model);
        if (this.model) {
            //console.log('Calling CategoryCollection.change()');
            //this.model.change();	// called automagically
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
        // slow re-rendering of the whole table when model changes
        //this.listenTo(this.model, 'change', this.render);
    }
    ExpenseTable.prototype.setCategoryList = function (list) {
        this.categoryList = list;
    };
    ExpenseTable.prototype.render = function (options) {
        var _this = this;
        if (options && options.noRender) {
            console.log('ExpenseTable.noRender');
            return;
        }
        console.log('ExpenseTable.render()', this.model.size());
        console.log(this.model);
        var rows = [];
        this.model.each(function (transaction) {
            //console.log(transaction);
            var attributes = transaction.toJSON();
            if (attributes.visible) {
                attributes.sDate = attributes.date.toString('yyyy-MM-dd');
                rows.push(_this.template(attributes));
            }
        });
        console.log('rendering', rows.length, 'rows');
        this.$el.html(rows.join('\n'));
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
            //console.log(options);
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
        _super.call(this);
        this.attributes = null;
        this.model = Transaction_1["default"];
        this.csvUrl = '../umsaetze-1090729-2016-07-27-00-11-29.cat.csv';
        this.slowUpdateLoadingBar = _.throttle(this.updateLoadingBar, 128);
    }
    Expenses.prototype.fetch = function (options) {
        var _this = this;
        console.log('csvUrl', this.csvUrl);
        this.startLoading();
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
                _this.prevPercent = 0;
                umsaetze_1.asyncLoop(csv.data, _this.processRow.bind(_this), _this.processDone.bind(_this, options));
            }
        });
    };
    Expenses.prototype.processRow = function (row, i, length) {
        this.slowUpdateLoadingBar(i, length);
        if (row && row.amount) {
            this.add(new Transaction_1["default"](row));
        }
        //this.trigger('change');
    };
    Expenses.prototype.updateLoadingBar = function (i, length) {
        var percent = Math.round(100 * i / length);
        //console.log('updateLoadingBar', i, percent);
        if (percent != this.prevPercent) {
            //console.log(percent);
            $('.progress#loadingBar .progress-bar').width(percent + '%');
            this.prevPercent = percent;
        }
    };
    Expenses.prototype.processDone = function (count, options) {
        console.log('asyncLoop finished', count);
        if (options.success) {
            options.success.call();
        }
        console.log('Trigger change on Expenses');
        this.stopLoading();
        this.trigger('change');
    };
    Expenses.prototype.startLoading = function () {
        console.log('startLoading');
        var template = _.template($('#loadingBarTemplate').html());
        $('#app').html(template());
    };
    Expenses.prototype.stopLoading = function () {
        console.log('stopLoading');
        $('#app').html('Done');
    };
    Expenses.prototype.getDateFrom = function () {
        var min = new Date().valueOf();
        this.each(function (row) {
            var date = row.get('date').valueOf();
            if (date < min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.getDateTill = function () {
        var min = new Date('1970-01-01').valueOf();
        this.each(function (row) {
            var date = row.get('date').valueOf();
            if (date > min) {
                min = date;
            }
        });
        return new Date(min);
    };
    Expenses.prototype.filterVisible = function (q) {
        this.each(function (row) {
            if (row.get('note').indexOf(q) == -1) {
                row.set('visible', false, { noRender: true, silent: true });
            }
            else {
                row.set('visible', true, { noRender: true, silent: true });
            }
        });
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
        this.defaults = {
            visible: true
        };
        this.set('id', md5(this.get('date') + this.get('amount')));
        // number
        this.set('amount', parseFloat(this.get('amount')));
        this.set('date', new Date(Date.parse(this.get('date'))));
        this.set('visible', true);
    }
    Transaction.prototype.sign = function () {
        return this.get('amount') >= 0 ? 'positive' : 'negative';
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
        this.model.fetch();
        this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.model, "change", this.table.render);
        //this.listenTo(this.model, "change", this.categories.change); // wrong model inside ? wft?!
        $('.custom-search-form input').on('keyup', this.onSearch.bind(this));
    }
    AppView.prototype.render = function () {
        console.log('AppView.render()', this.model.size());
        this.table.render();
        //this.$el.html('Table shown');
        this.categories.change();
        return this;
    };
    AppView.prototype.onSearch = function (event) {
        var q = $(event.target).val();
        console.log(q);
        this.model.filterVisible(q);
    };
    return AppView;
}(Backbone.View));
$(function () {
    var app = new AppView();
    app.render();
});

},{"./CategoryCollection":6,"./CategoryView":7,"./ExpenseTable":8,"./Expenses":9}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY2hhcmVuYy9jaGFyZW5jLmpzIiwibm9kZV9tb2R1bGVzL2NyeXB0L2NyeXB0LmpzIiwibm9kZV9tb2R1bGVzL2RhdGVqcy9saWIvZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWQ1L21kNS5qcyIsInNyYy9DYXRlZ29yeUNvbGxlY3Rpb24uanMiLCJzcmMvQ2F0ZWdvcnlWaWV3LmpzIiwic3JjL0V4cGVuc2VUYWJsZS5qcyIsInNyYy9FeHBlbnNlcy5qcyIsInNyYy9UcmFuc2FjdGlvbi5qcyIsInNyYy91bXNhZXR6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNoYXJlbmMgPSB7XG4gIC8vIFVURi04IGVuY29kaW5nXG4gIHV0Zjg6IHtcbiAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHRvIGEgYnl0ZSBhcnJheVxuICAgIHN0cmluZ1RvQnl0ZXM6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIGNoYXJlbmMuYmluLnN0cmluZ1RvQnl0ZXModW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHN0cikpKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBzdHJpbmdcbiAgICBieXRlc1RvU3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoY2hhcmVuYy5iaW4uYnl0ZXNUb1N0cmluZyhieXRlcykpKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gQmluYXJ5IGVuY29kaW5nXG4gIGJpbjoge1xuICAgIC8vIENvbnZlcnQgYSBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgc3RyaW5nVG9CeXRlczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICAgICAgYnl0ZXMucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIHN0cmluZ1xuICAgIGJ5dGVzVG9TdHJpbmc6IGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBmb3IgKHZhciBzdHIgPSBbXSwgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgc3RyLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSkpO1xuICAgICAgcmV0dXJuIHN0ci5qb2luKCcnKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2hhcmVuYztcbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyIGJhc2U2NG1hcFxuICAgICAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLycsXG5cbiAgY3J5cHQgPSB7XG4gICAgLy8gQml0LXdpc2Ugcm90YXRpb24gbGVmdFxuICAgIHJvdGw6IGZ1bmN0aW9uKG4sIGIpIHtcbiAgICAgIHJldHVybiAobiA8PCBiKSB8IChuID4+PiAoMzIgLSBiKSk7XG4gICAgfSxcblxuICAgIC8vIEJpdC13aXNlIHJvdGF0aW9uIHJpZ2h0XG4gICAgcm90cjogZnVuY3Rpb24obiwgYikge1xuICAgICAgcmV0dXJuIChuIDw8ICgzMiAtIGIpKSB8IChuID4+PiBiKTtcbiAgICB9LFxuXG4gICAgLy8gU3dhcCBiaWctZW5kaWFuIHRvIGxpdHRsZS1lbmRpYW4gYW5kIHZpY2UgdmVyc2FcbiAgICBlbmRpYW46IGZ1bmN0aW9uKG4pIHtcbiAgICAgIC8vIElmIG51bWJlciBnaXZlbiwgc3dhcCBlbmRpYW5cbiAgICAgIGlmIChuLmNvbnN0cnVjdG9yID09IE51bWJlcikge1xuICAgICAgICByZXR1cm4gY3J5cHQucm90bChuLCA4KSAmIDB4MDBGRjAwRkYgfCBjcnlwdC5yb3RsKG4sIDI0KSAmIDB4RkYwMEZGMDA7XG4gICAgICB9XG5cbiAgICAgIC8vIEVsc2UsIGFzc3VtZSBhcnJheSBhbmQgc3dhcCBhbGwgaXRlbXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbi5sZW5ndGg7IGkrKylcbiAgICAgICAgbltpXSA9IGNyeXB0LmVuZGlhbihuW2ldKTtcbiAgICAgIHJldHVybiBuO1xuICAgIH0sXG5cbiAgICAvLyBHZW5lcmF0ZSBhbiBhcnJheSBvZiBhbnkgbGVuZ3RoIG9mIHJhbmRvbSBieXRlc1xuICAgIHJhbmRvbUJ5dGVzOiBmdW5jdGlvbihuKSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdOyBuID4gMDsgbi0tKVxuICAgICAgICBieXRlcy5wdXNoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NikpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBiaWctZW5kaWFuIDMyLWJpdCB3b3Jkc1xuICAgIGJ5dGVzVG9Xb3JkczogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIHdvcmRzID0gW10sIGkgPSAwLCBiID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrLCBiICs9IDgpXG4gICAgICAgIHdvcmRzW2IgPj4+IDVdIHw9IGJ5dGVzW2ldIDw8ICgyNCAtIGIgJSAzMik7XG4gICAgICByZXR1cm4gd29yZHM7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYmlnLWVuZGlhbiAzMi1iaXQgd29yZHMgdG8gYSBieXRlIGFycmF5XG4gICAgd29yZHNUb0J5dGVzOiBmdW5jdGlvbih3b3Jkcykge1xuICAgICAgZm9yICh2YXIgYnl0ZXMgPSBbXSwgYiA9IDA7IGIgPCB3b3Jkcy5sZW5ndGggKiAzMjsgYiArPSA4KVxuICAgICAgICBieXRlcy5wdXNoKCh3b3Jkc1tiID4+PiA1XSA+Pj4gKDI0IC0gYiAlIDMyKSkgJiAweEZGKTtcbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGJ5dGUgYXJyYXkgdG8gYSBoZXggc3RyaW5nXG4gICAgYnl0ZXNUb0hleDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIGhleCA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhleC5wdXNoKChieXRlc1tpXSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcbiAgICAgICAgaGV4LnB1c2goKGJ5dGVzW2ldICYgMHhGKS50b1N0cmluZygxNikpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhleC5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLy8gQ29udmVydCBhIGhleCBzdHJpbmcgdG8gYSBieXRlIGFycmF5XG4gICAgaGV4VG9CeXRlczogZnVuY3Rpb24oaGV4KSB7XG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBjID0gMDsgYyA8IGhleC5sZW5ndGg7IGMgKz0gMilcbiAgICAgICAgYnl0ZXMucHVzaChwYXJzZUludChoZXguc3Vic3RyKGMsIDIpLCAxNikpO1xuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH0sXG5cbiAgICAvLyBDb252ZXJ0IGEgYnl0ZSBhcnJheSB0byBhIGJhc2UtNjQgc3RyaW5nXG4gICAgYnl0ZXNUb0Jhc2U2NDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGZvciAodmFyIGJhc2U2NCA9IFtdLCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIHZhciB0cmlwbGV0ID0gKGJ5dGVzW2ldIDw8IDE2KSB8IChieXRlc1tpICsgMV0gPDwgOCkgfCBieXRlc1tpICsgMl07XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgNDsgaisrKVxuICAgICAgICAgIGlmIChpICogOCArIGogKiA2IDw9IGJ5dGVzLmxlbmd0aCAqIDgpXG4gICAgICAgICAgICBiYXNlNjQucHVzaChiYXNlNjRtYXAuY2hhckF0KCh0cmlwbGV0ID4+PiA2ICogKDMgLSBqKSkgJiAweDNGKSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYmFzZTY0LnB1c2goJz0nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlNjQuam9pbignJyk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlcnQgYSBiYXNlLTY0IHN0cmluZyB0byBhIGJ5dGUgYXJyYXlcbiAgICBiYXNlNjRUb0J5dGVzOiBmdW5jdGlvbihiYXNlNjQpIHtcbiAgICAgIC8vIFJlbW92ZSBub24tYmFzZS02NCBjaGFyYWN0ZXJzXG4gICAgICBiYXNlNjQgPSBiYXNlNjQucmVwbGFjZSgvW15BLVowLTkrXFwvXS9pZywgJycpO1xuXG4gICAgICBmb3IgKHZhciBieXRlcyA9IFtdLCBpID0gMCwgaW1vZDQgPSAwOyBpIDwgYmFzZTY0Lmxlbmd0aDtcbiAgICAgICAgICBpbW9kNCA9ICsraSAlIDQpIHtcbiAgICAgICAgaWYgKGltb2Q0ID09IDApIGNvbnRpbnVlO1xuICAgICAgICBieXRlcy5wdXNoKCgoYmFzZTY0bWFwLmluZGV4T2YoYmFzZTY0LmNoYXJBdChpIC0gMSkpXG4gICAgICAgICAgICAmIChNYXRoLnBvdygyLCAtMiAqIGltb2Q0ICsgOCkgLSAxKSkgPDwgKGltb2Q0ICogMikpXG4gICAgICAgICAgICB8IChiYXNlNjRtYXAuaW5kZXhPZihiYXNlNjQuY2hhckF0KGkpKSA+Pj4gKDYgLSBpbW9kNCAqIDIpKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfVxuICB9O1xuXG4gIG1vZHVsZS5leHBvcnRzID0gY3J5cHQ7XG59KSgpO1xuIiwiLyoqXHJcbiAqIEB2ZXJzaW9uOiAxLjAgQWxwaGEtMVxyXG4gKiBAYXV0aG9yOiBDb29saXRlIEluYy4gaHR0cDovL3d3dy5jb29saXRlLmNvbS9cclxuICogQGRhdGU6IDIwMDgtMDUtMTNcclxuICogQGNvcHlyaWdodDogQ29weXJpZ2h0IChjKSAyMDA2LTIwMDgsIENvb2xpdGUgSW5jLiAoaHR0cDovL3d3dy5jb29saXRlLmNvbS8pLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBAbGljZW5zZTogTGljZW5zZWQgdW5kZXIgVGhlIE1JVCBMaWNlbnNlLiBTZWUgbGljZW5zZS50eHQgYW5kIGh0dHA6Ly93d3cuZGF0ZWpzLmNvbS9saWNlbnNlLy4gXHJcbiAqIEB3ZWJzaXRlOiBodHRwOi8vd3d3LmRhdGVqcy5jb20vXHJcbiAqL1xyXG5EYXRlLkN1bHR1cmVJbmZvPXtuYW1lOlwiZW4tVVNcIixlbmdsaXNoTmFtZTpcIkVuZ2xpc2ggKFVuaXRlZCBTdGF0ZXMpXCIsbmF0aXZlTmFtZTpcIkVuZ2xpc2ggKFVuaXRlZCBTdGF0ZXMpXCIsZGF5TmFtZXM6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl0sYWJicmV2aWF0ZWREYXlOYW1lczpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sc2hvcnRlc3REYXlOYW1lczpbXCJTdVwiLFwiTW9cIixcIlR1XCIsXCJXZVwiLFwiVGhcIixcIkZyXCIsXCJTYVwiXSxmaXJzdExldHRlckRheU5hbWVzOltcIlNcIixcIk1cIixcIlRcIixcIldcIixcIlRcIixcIkZcIixcIlNcIl0sbW9udGhOYW1lczpbXCJKYW51YXJ5XCIsXCJGZWJydWFyeVwiLFwiTWFyY2hcIixcIkFwcmlsXCIsXCJNYXlcIixcIkp1bmVcIixcIkp1bHlcIixcIkF1Z3VzdFwiLFwiU2VwdGVtYmVyXCIsXCJPY3RvYmVyXCIsXCJOb3ZlbWJlclwiLFwiRGVjZW1iZXJcIl0sYWJicmV2aWF0ZWRNb250aE5hbWVzOltcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFwiTWF5XCIsXCJKdW5cIixcIkp1bFwiLFwiQXVnXCIsXCJTZXBcIixcIk9jdFwiLFwiTm92XCIsXCJEZWNcIl0sYW1EZXNpZ25hdG9yOlwiQU1cIixwbURlc2lnbmF0b3I6XCJQTVwiLGZpcnN0RGF5T2ZXZWVrOjAsdHdvRGlnaXRZZWFyTWF4OjIwMjksZGF0ZUVsZW1lbnRPcmRlcjpcIm1keVwiLGZvcm1hdFBhdHRlcm5zOntzaG9ydERhdGU6XCJNL2QveXl5eVwiLGxvbmdEYXRlOlwiZGRkZCwgTU1NTSBkZCwgeXl5eVwiLHNob3J0VGltZTpcImg6bW0gdHRcIixsb25nVGltZTpcImg6bW06c3MgdHRcIixmdWxsRGF0ZVRpbWU6XCJkZGRkLCBNTU1NIGRkLCB5eXl5IGg6bW06c3MgdHRcIixzb3J0YWJsZURhdGVUaW1lOlwieXl5eS1NTS1kZFRISDptbTpzc1wiLHVuaXZlcnNhbFNvcnRhYmxlRGF0ZVRpbWU6XCJ5eXl5LU1NLWRkIEhIOm1tOnNzWlwiLHJmYzExMjM6XCJkZGQsIGRkIE1NTSB5eXl5IEhIOm1tOnNzIEdNVFwiLG1vbnRoRGF5OlwiTU1NTSBkZFwiLHllYXJNb250aDpcIk1NTU0sIHl5eXlcIn0scmVnZXhQYXR0ZXJuczp7amFuOi9eamFuKHVhcnkpPy9pLGZlYjovXmZlYihydWFyeSk/L2ksbWFyOi9ebWFyKGNoKT8vaSxhcHI6L15hcHIoaWwpPy9pLG1heTovXm1heS9pLGp1bjovXmp1bihlKT8vaSxqdWw6L15qdWwoeSk/L2ksYXVnOi9eYXVnKHVzdCk/L2ksc2VwOi9ec2VwKHQoZW1iZXIpPyk/L2ksb2N0Oi9eb2N0KG9iZXIpPy9pLG5vdjovXm5vdihlbWJlcik/L2ksZGVjOi9eZGVjKGVtYmVyKT8vaSxzdW46L15zdShuKGRheSk/KT8vaSxtb246L15tbyhuKGRheSk/KT8vaSx0dWU6L150dShlKHMoZGF5KT8pPyk/L2ksd2VkOi9ed2UoZChuZXNkYXkpPyk/L2ksdGh1Oi9edGgodShyKHMoZGF5KT8pPyk/KT8vaSxmcmk6L15mcihpKGRheSk/KT8vaSxzYXQ6L15zYSh0KHVyZGF5KT8pPy9pLGZ1dHVyZTovXm5leHQvaSxwYXN0Oi9ebGFzdHxwYXN0fHByZXYoaW91cyk/L2ksYWRkOi9eKFxcK3xhZnQoZXIpP3xmcm9tfGhlbmNlKS9pLHN1YnRyYWN0Oi9eKFxcLXxiZWYob3JlKT98YWdvKS9pLHllc3RlcmRheTovXnllcyh0ZXJkYXkpPy9pLHRvZGF5Oi9edChvZChheSk/KT8vaSx0b21vcnJvdzovXnRvbShvcnJvdyk/L2ksbm93Oi9ebihvdyk/L2ksbWlsbGlzZWNvbmQ6L15tc3xtaWxsaShzZWNvbmQpP3M/L2ksc2Vjb25kOi9ec2VjKG9uZCk/cz8vaSxtaW51dGU6L15tbnxtaW4odXRlKT9zPy9pLGhvdXI6L15oKG91cik/cz8vaSx3ZWVrOi9edyhlZWspP3M/L2ksbW9udGg6L15tKG9udGgpP3M/L2ksZGF5Oi9eZChheSk/cz8vaSx5ZWFyOi9eeShlYXIpP3M/L2ksc2hvcnRNZXJpZGlhbjovXihhfHApL2ksbG9uZ01lcmlkaWFuOi9eKGFcXC4/bT9cXC4/fHBcXC4/bT9cXC4/KS9pLHRpbWV6b25lOi9eKChlKHN8ZCl0fGMoc3xkKXR8bShzfGQpdHxwKHN8ZCl0KXwoKGdtdCk/XFxzKihcXCt8XFwtKVxccypcXGRcXGRcXGRcXGQ/KXxnbXR8dXRjKS9pLG9yZGluYWxTdWZmaXg6L15cXHMqKHN0fG5kfHJkfHRoKS9pLHRpbWVDb250ZXh0Oi9eXFxzKihcXDp8YSg/IXV8cCl8cCkvaX0sdGltZXpvbmVzOlt7bmFtZTpcIlVUQ1wiLG9mZnNldDpcIi0wMDBcIn0se25hbWU6XCJHTVRcIixvZmZzZXQ6XCItMDAwXCJ9LHtuYW1lOlwiRVNUXCIsb2Zmc2V0OlwiLTA1MDBcIn0se25hbWU6XCJFRFRcIixvZmZzZXQ6XCItMDQwMFwifSx7bmFtZTpcIkNTVFwiLG9mZnNldDpcIi0wNjAwXCJ9LHtuYW1lOlwiQ0RUXCIsb2Zmc2V0OlwiLTA1MDBcIn0se25hbWU6XCJNU1RcIixvZmZzZXQ6XCItMDcwMFwifSx7bmFtZTpcIk1EVFwiLG9mZnNldDpcIi0wNjAwXCJ9LHtuYW1lOlwiUFNUXCIsb2Zmc2V0OlwiLTA4MDBcIn0se25hbWU6XCJQRFRcIixvZmZzZXQ6XCItMDcwMFwifV19O1xuKGZ1bmN0aW9uKCl7dmFyICREPURhdGUsJFA9JEQucHJvdG90eXBlLCRDPSRELkN1bHR1cmVJbmZvLHA9ZnVuY3Rpb24ocyxsKXtpZighbCl7bD0yO31cbnJldHVybihcIjAwMFwiK3MpLnNsaWNlKGwqLTEpO307JFAuY2xlYXJUaW1lPWZ1bmN0aW9uKCl7dGhpcy5zZXRIb3VycygwKTt0aGlzLnNldE1pbnV0ZXMoMCk7dGhpcy5zZXRTZWNvbmRzKDApO3RoaXMuc2V0TWlsbGlzZWNvbmRzKDApO3JldHVybiB0aGlzO307JFAuc2V0VGltZVRvTm93PWZ1bmN0aW9uKCl7dmFyIG49bmV3IERhdGUoKTt0aGlzLnNldEhvdXJzKG4uZ2V0SG91cnMoKSk7dGhpcy5zZXRNaW51dGVzKG4uZ2V0TWludXRlcygpKTt0aGlzLnNldFNlY29uZHMobi5nZXRTZWNvbmRzKCkpO3RoaXMuc2V0TWlsbGlzZWNvbmRzKG4uZ2V0TWlsbGlzZWNvbmRzKCkpO3JldHVybiB0aGlzO307JEQudG9kYXk9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IERhdGUoKS5jbGVhclRpbWUoKTt9OyRELmNvbXBhcmU9ZnVuY3Rpb24oZGF0ZTEsZGF0ZTIpe2lmKGlzTmFOKGRhdGUxKXx8aXNOYU4oZGF0ZTIpKXt0aHJvdyBuZXcgRXJyb3IoZGF0ZTErXCIgLSBcIitkYXRlMik7fWVsc2UgaWYoZGF0ZTEgaW5zdGFuY2VvZiBEYXRlJiZkYXRlMiBpbnN0YW5jZW9mIERhdGUpe3JldHVybihkYXRlMTxkYXRlMik/LTE6KGRhdGUxPmRhdGUyKT8xOjA7fWVsc2V7dGhyb3cgbmV3IFR5cGVFcnJvcihkYXRlMStcIiAtIFwiK2RhdGUyKTt9fTskRC5lcXVhbHM9ZnVuY3Rpb24oZGF0ZTEsZGF0ZTIpe3JldHVybihkYXRlMS5jb21wYXJlVG8oZGF0ZTIpPT09MCk7fTskRC5nZXREYXlOdW1iZXJGcm9tTmFtZT1mdW5jdGlvbihuYW1lKXt2YXIgbj0kQy5kYXlOYW1lcyxtPSRDLmFiYnJldmlhdGVkRGF5TmFtZXMsbz0kQy5zaG9ydGVzdERheU5hbWVzLHM9bmFtZS50b0xvd2VyQ2FzZSgpO2Zvcih2YXIgaT0wO2k8bi5sZW5ndGg7aSsrKXtpZihuW2ldLnRvTG93ZXJDYXNlKCk9PXN8fG1baV0udG9Mb3dlckNhc2UoKT09c3x8b1tpXS50b0xvd2VyQ2FzZSgpPT1zKXtyZXR1cm4gaTt9fVxucmV0dXJuLTE7fTskRC5nZXRNb250aE51bWJlckZyb21OYW1lPWZ1bmN0aW9uKG5hbWUpe3ZhciBuPSRDLm1vbnRoTmFtZXMsbT0kQy5hYmJyZXZpYXRlZE1vbnRoTmFtZXMscz1uYW1lLnRvTG93ZXJDYXNlKCk7Zm9yKHZhciBpPTA7aTxuLmxlbmd0aDtpKyspe2lmKG5baV0udG9Mb3dlckNhc2UoKT09c3x8bVtpXS50b0xvd2VyQ2FzZSgpPT1zKXtyZXR1cm4gaTt9fVxucmV0dXJuLTE7fTskRC5pc0xlYXBZZWFyPWZ1bmN0aW9uKHllYXIpe3JldHVybigoeWVhciU0PT09MCYmeWVhciUxMDAhPT0wKXx8eWVhciU0MDA9PT0wKTt9OyRELmdldERheXNJbk1vbnRoPWZ1bmN0aW9uKHllYXIsbW9udGgpe3JldHVyblszMSwoJEQuaXNMZWFwWWVhcih5ZWFyKT8yOToyOCksMzEsMzAsMzEsMzAsMzEsMzEsMzAsMzEsMzAsMzFdW21vbnRoXTt9OyRELmdldFRpbWV6b25lQWJicmV2aWF0aW9uPWZ1bmN0aW9uKG9mZnNldCl7dmFyIHo9JEMudGltZXpvbmVzLHA7Zm9yKHZhciBpPTA7aTx6Lmxlbmd0aDtpKyspe2lmKHpbaV0ub2Zmc2V0PT09b2Zmc2V0KXtyZXR1cm4geltpXS5uYW1lO319XG5yZXR1cm4gbnVsbDt9OyRELmdldFRpbWV6b25lT2Zmc2V0PWZ1bmN0aW9uKG5hbWUpe3ZhciB6PSRDLnRpbWV6b25lcyxwO2Zvcih2YXIgaT0wO2k8ei5sZW5ndGg7aSsrKXtpZih6W2ldLm5hbWU9PT1uYW1lLnRvVXBwZXJDYXNlKCkpe3JldHVybiB6W2ldLm9mZnNldDt9fVxucmV0dXJuIG51bGw7fTskUC5jbG9uZT1mdW5jdGlvbigpe3JldHVybiBuZXcgRGF0ZSh0aGlzLmdldFRpbWUoKSk7fTskUC5jb21wYXJlVG89ZnVuY3Rpb24oZGF0ZSl7cmV0dXJuIERhdGUuY29tcGFyZSh0aGlzLGRhdGUpO307JFAuZXF1YWxzPWZ1bmN0aW9uKGRhdGUpe3JldHVybiBEYXRlLmVxdWFscyh0aGlzLGRhdGV8fG5ldyBEYXRlKCkpO307JFAuYmV0d2Vlbj1mdW5jdGlvbihzdGFydCxlbmQpe3JldHVybiB0aGlzLmdldFRpbWUoKT49c3RhcnQuZ2V0VGltZSgpJiZ0aGlzLmdldFRpbWUoKTw9ZW5kLmdldFRpbWUoKTt9OyRQLmlzQWZ0ZXI9ZnVuY3Rpb24oZGF0ZSl7cmV0dXJuIHRoaXMuY29tcGFyZVRvKGRhdGV8fG5ldyBEYXRlKCkpPT09MTt9OyRQLmlzQmVmb3JlPWZ1bmN0aW9uKGRhdGUpe3JldHVybih0aGlzLmNvbXBhcmVUbyhkYXRlfHxuZXcgRGF0ZSgpKT09PS0xKTt9OyRQLmlzVG9kYXk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1NhbWVEYXkobmV3IERhdGUoKSk7fTskUC5pc1NhbWVEYXk9ZnVuY3Rpb24oZGF0ZSl7cmV0dXJuIHRoaXMuY2xvbmUoKS5jbGVhclRpbWUoKS5lcXVhbHMoZGF0ZS5jbG9uZSgpLmNsZWFyVGltZSgpKTt9OyRQLmFkZE1pbGxpc2Vjb25kcz1mdW5jdGlvbih2YWx1ZSl7dGhpcy5zZXRNaWxsaXNlY29uZHModGhpcy5nZXRNaWxsaXNlY29uZHMoKSt2YWx1ZSk7cmV0dXJuIHRoaXM7fTskUC5hZGRTZWNvbmRzPWZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gdGhpcy5hZGRNaWxsaXNlY29uZHModmFsdWUqMTAwMCk7fTskUC5hZGRNaW51dGVzPWZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gdGhpcy5hZGRNaWxsaXNlY29uZHModmFsdWUqNjAwMDApO307JFAuYWRkSG91cnM9ZnVuY3Rpb24odmFsdWUpe3JldHVybiB0aGlzLmFkZE1pbGxpc2Vjb25kcyh2YWx1ZSozNjAwMDAwKTt9OyRQLmFkZERheXM9ZnVuY3Rpb24odmFsdWUpe3RoaXMuc2V0RGF0ZSh0aGlzLmdldERhdGUoKSt2YWx1ZSk7cmV0dXJuIHRoaXM7fTskUC5hZGRXZWVrcz1mdW5jdGlvbih2YWx1ZSl7cmV0dXJuIHRoaXMuYWRkRGF5cyh2YWx1ZSo3KTt9OyRQLmFkZE1vbnRocz1mdW5jdGlvbih2YWx1ZSl7dmFyIG49dGhpcy5nZXREYXRlKCk7dGhpcy5zZXREYXRlKDEpO3RoaXMuc2V0TW9udGgodGhpcy5nZXRNb250aCgpK3ZhbHVlKTt0aGlzLnNldERhdGUoTWF0aC5taW4obiwkRC5nZXREYXlzSW5Nb250aCh0aGlzLmdldEZ1bGxZZWFyKCksdGhpcy5nZXRNb250aCgpKSkpO3JldHVybiB0aGlzO307JFAuYWRkWWVhcnM9ZnVuY3Rpb24odmFsdWUpe3JldHVybiB0aGlzLmFkZE1vbnRocyh2YWx1ZSoxMik7fTskUC5hZGQ9ZnVuY3Rpb24oY29uZmlnKXtpZih0eXBlb2YgY29uZmlnPT1cIm51bWJlclwiKXt0aGlzLl9vcmllbnQ9Y29uZmlnO3JldHVybiB0aGlzO31cbnZhciB4PWNvbmZpZztpZih4Lm1pbGxpc2Vjb25kcyl7dGhpcy5hZGRNaWxsaXNlY29uZHMoeC5taWxsaXNlY29uZHMpO31cbmlmKHguc2Vjb25kcyl7dGhpcy5hZGRTZWNvbmRzKHguc2Vjb25kcyk7fVxuaWYoeC5taW51dGVzKXt0aGlzLmFkZE1pbnV0ZXMoeC5taW51dGVzKTt9XG5pZih4LmhvdXJzKXt0aGlzLmFkZEhvdXJzKHguaG91cnMpO31cbmlmKHgud2Vla3Mpe3RoaXMuYWRkV2Vla3MoeC53ZWVrcyk7fVxuaWYoeC5tb250aHMpe3RoaXMuYWRkTW9udGhzKHgubW9udGhzKTt9XG5pZih4LnllYXJzKXt0aGlzLmFkZFllYXJzKHgueWVhcnMpO31cbmlmKHguZGF5cyl7dGhpcy5hZGREYXlzKHguZGF5cyk7fVxucmV0dXJuIHRoaXM7fTt2YXIgJHksJG0sJGQ7JFAuZ2V0V2Vlaz1mdW5jdGlvbigpe3ZhciBhLGIsYyxkLGUsZixnLG4scyx3OyR5PSghJHkpP3RoaXMuZ2V0RnVsbFllYXIoKTokeTskbT0oISRtKT90aGlzLmdldE1vbnRoKCkrMTokbTskZD0oISRkKT90aGlzLmdldERhdGUoKTokZDtpZigkbTw9Mil7YT0keS0xO2I9KGEvNHwwKS0oYS8xMDB8MCkrKGEvNDAwfDApO2M9KChhLTEpLzR8MCktKChhLTEpLzEwMHwwKSsoKGEtMSkvNDAwfDApO3M9Yi1jO2U9MDtmPSRkLTErKDMxKigkbS0xKSk7fWVsc2V7YT0keTtiPShhLzR8MCktKGEvMTAwfDApKyhhLzQwMHwwKTtjPSgoYS0xKS80fDApLSgoYS0xKS8xMDB8MCkrKChhLTEpLzQwMHwwKTtzPWItYztlPXMrMTtmPSRkKygoMTUzKigkbS0zKSsyKS81KSs1OCtzO31cbmc9KGErYiklNztkPShmK2ctZSklNztuPShmKzMtZCl8MDtpZihuPDApe3c9NTMtKChnLXMpLzV8MCk7fWVsc2UgaWYobj4zNjQrcyl7dz0xO31lbHNle3c9KG4vN3wwKSsxO31cbiR5PSRtPSRkPW51bGw7cmV0dXJuIHc7fTskUC5nZXRJU09XZWVrPWZ1bmN0aW9uKCl7JHk9dGhpcy5nZXRVVENGdWxsWWVhcigpOyRtPXRoaXMuZ2V0VVRDTW9udGgoKSsxOyRkPXRoaXMuZ2V0VVRDRGF0ZSgpO3JldHVybiBwKHRoaXMuZ2V0V2VlaygpKTt9OyRQLnNldFdlZWs9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMubW92ZVRvRGF5T2ZXZWVrKDEpLmFkZFdlZWtzKG4tdGhpcy5nZXRXZWVrKCkpO307JEQuX3ZhbGlkYXRlPWZ1bmN0aW9uKG4sbWluLG1heCxuYW1lKXtpZih0eXBlb2Ygbj09XCJ1bmRlZmluZWRcIil7cmV0dXJuIGZhbHNlO31lbHNlIGlmKHR5cGVvZiBuIT1cIm51bWJlclwiKXt0aHJvdyBuZXcgVHlwZUVycm9yKG4rXCIgaXMgbm90IGEgTnVtYmVyLlwiKTt9ZWxzZSBpZihuPG1pbnx8bj5tYXgpe3Rocm93IG5ldyBSYW5nZUVycm9yKG4rXCIgaXMgbm90IGEgdmFsaWQgdmFsdWUgZm9yIFwiK25hbWUrXCIuXCIpO31cbnJldHVybiB0cnVlO307JEQudmFsaWRhdGVNaWxsaXNlY29uZD1mdW5jdGlvbih2YWx1ZSl7cmV0dXJuICRELl92YWxpZGF0ZSh2YWx1ZSwwLDk5OSxcIm1pbGxpc2Vjb25kXCIpO307JEQudmFsaWRhdGVTZWNvbmQ9ZnVuY3Rpb24odmFsdWUpe3JldHVybiAkRC5fdmFsaWRhdGUodmFsdWUsMCw1OSxcInNlY29uZFwiKTt9OyRELnZhbGlkYXRlTWludXRlPWZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gJEQuX3ZhbGlkYXRlKHZhbHVlLDAsNTksXCJtaW51dGVcIik7fTskRC52YWxpZGF0ZUhvdXI9ZnVuY3Rpb24odmFsdWUpe3JldHVybiAkRC5fdmFsaWRhdGUodmFsdWUsMCwyMyxcImhvdXJcIik7fTskRC52YWxpZGF0ZURheT1mdW5jdGlvbih2YWx1ZSx5ZWFyLG1vbnRoKXtyZXR1cm4gJEQuX3ZhbGlkYXRlKHZhbHVlLDEsJEQuZ2V0RGF5c0luTW9udGgoeWVhcixtb250aCksXCJkYXlcIik7fTskRC52YWxpZGF0ZU1vbnRoPWZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gJEQuX3ZhbGlkYXRlKHZhbHVlLDAsMTEsXCJtb250aFwiKTt9OyRELnZhbGlkYXRlWWVhcj1mdW5jdGlvbih2YWx1ZSl7cmV0dXJuICRELl92YWxpZGF0ZSh2YWx1ZSwwLDk5OTksXCJ5ZWFyXCIpO307JFAuc2V0PWZ1bmN0aW9uKGNvbmZpZyl7aWYoJEQudmFsaWRhdGVNaWxsaXNlY29uZChjb25maWcubWlsbGlzZWNvbmQpKXt0aGlzLmFkZE1pbGxpc2Vjb25kcyhjb25maWcubWlsbGlzZWNvbmQtdGhpcy5nZXRNaWxsaXNlY29uZHMoKSk7fVxuaWYoJEQudmFsaWRhdGVTZWNvbmQoY29uZmlnLnNlY29uZCkpe3RoaXMuYWRkU2Vjb25kcyhjb25maWcuc2Vjb25kLXRoaXMuZ2V0U2Vjb25kcygpKTt9XG5pZigkRC52YWxpZGF0ZU1pbnV0ZShjb25maWcubWludXRlKSl7dGhpcy5hZGRNaW51dGVzKGNvbmZpZy5taW51dGUtdGhpcy5nZXRNaW51dGVzKCkpO31cbmlmKCRELnZhbGlkYXRlSG91cihjb25maWcuaG91cikpe3RoaXMuYWRkSG91cnMoY29uZmlnLmhvdXItdGhpcy5nZXRIb3VycygpKTt9XG5pZigkRC52YWxpZGF0ZU1vbnRoKGNvbmZpZy5tb250aCkpe3RoaXMuYWRkTW9udGhzKGNvbmZpZy5tb250aC10aGlzLmdldE1vbnRoKCkpO31cbmlmKCRELnZhbGlkYXRlWWVhcihjb25maWcueWVhcikpe3RoaXMuYWRkWWVhcnMoY29uZmlnLnllYXItdGhpcy5nZXRGdWxsWWVhcigpKTt9XG5pZigkRC52YWxpZGF0ZURheShjb25maWcuZGF5LHRoaXMuZ2V0RnVsbFllYXIoKSx0aGlzLmdldE1vbnRoKCkpKXt0aGlzLmFkZERheXMoY29uZmlnLmRheS10aGlzLmdldERhdGUoKSk7fVxuaWYoY29uZmlnLnRpbWV6b25lKXt0aGlzLnNldFRpbWV6b25lKGNvbmZpZy50aW1lem9uZSk7fVxuaWYoY29uZmlnLnRpbWV6b25lT2Zmc2V0KXt0aGlzLnNldFRpbWV6b25lT2Zmc2V0KGNvbmZpZy50aW1lem9uZU9mZnNldCk7fVxuaWYoY29uZmlnLndlZWsmJiRELl92YWxpZGF0ZShjb25maWcud2VlaywwLDUzLFwid2Vla1wiKSl7dGhpcy5zZXRXZWVrKGNvbmZpZy53ZWVrKTt9XG5yZXR1cm4gdGhpczt9OyRQLm1vdmVUb0ZpcnN0RGF5T2ZNb250aD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnNldCh7ZGF5OjF9KTt9OyRQLm1vdmVUb0xhc3REYXlPZk1vbnRoPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2V0KHtkYXk6JEQuZ2V0RGF5c0luTW9udGgodGhpcy5nZXRGdWxsWWVhcigpLHRoaXMuZ2V0TW9udGgoKSl9KTt9OyRQLm1vdmVUb050aE9jY3VycmVuY2U9ZnVuY3Rpb24oZGF5T2ZXZWVrLG9jY3VycmVuY2Upe3ZhciBzaGlmdD0wO2lmKG9jY3VycmVuY2U+MCl7c2hpZnQ9b2NjdXJyZW5jZS0xO31cbmVsc2UgaWYob2NjdXJyZW5jZT09PS0xKXt0aGlzLm1vdmVUb0xhc3REYXlPZk1vbnRoKCk7aWYodGhpcy5nZXREYXkoKSE9PWRheU9mV2Vlayl7dGhpcy5tb3ZlVG9EYXlPZldlZWsoZGF5T2ZXZWVrLC0xKTt9XG5yZXR1cm4gdGhpczt9XG5yZXR1cm4gdGhpcy5tb3ZlVG9GaXJzdERheU9mTW9udGgoKS5hZGREYXlzKC0xKS5tb3ZlVG9EYXlPZldlZWsoZGF5T2ZXZWVrLCsxKS5hZGRXZWVrcyhzaGlmdCk7fTskUC5tb3ZlVG9EYXlPZldlZWs9ZnVuY3Rpb24oZGF5T2ZXZWVrLG9yaWVudCl7dmFyIGRpZmY9KGRheU9mV2Vlay10aGlzLmdldERheSgpKzcqKG9yaWVudHx8KzEpKSU3O3JldHVybiB0aGlzLmFkZERheXMoKGRpZmY9PT0wKT9kaWZmKz03KihvcmllbnR8fCsxKTpkaWZmKTt9OyRQLm1vdmVUb01vbnRoPWZ1bmN0aW9uKG1vbnRoLG9yaWVudCl7dmFyIGRpZmY9KG1vbnRoLXRoaXMuZ2V0TW9udGgoKSsxMioob3JpZW50fHwrMSkpJTEyO3JldHVybiB0aGlzLmFkZE1vbnRocygoZGlmZj09PTApP2RpZmYrPTEyKihvcmllbnR8fCsxKTpkaWZmKTt9OyRQLmdldE9yZGluYWxOdW1iZXI9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5jZWlsKCh0aGlzLmNsb25lKCkuY2xlYXJUaW1lKCktbmV3IERhdGUodGhpcy5nZXRGdWxsWWVhcigpLDAsMSkpLzg2NDAwMDAwKSsxO307JFAuZ2V0VGltZXpvbmU9ZnVuY3Rpb24oKXtyZXR1cm4gJEQuZ2V0VGltZXpvbmVBYmJyZXZpYXRpb24odGhpcy5nZXRVVENPZmZzZXQoKSk7fTskUC5zZXRUaW1lem9uZU9mZnNldD1mdW5jdGlvbihvZmZzZXQpe3ZhciBoZXJlPXRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKSx0aGVyZT1OdW1iZXIob2Zmc2V0KSotNi8xMDtyZXR1cm4gdGhpcy5hZGRNaW51dGVzKHRoZXJlLWhlcmUpO307JFAuc2V0VGltZXpvbmU9ZnVuY3Rpb24ob2Zmc2V0KXtyZXR1cm4gdGhpcy5zZXRUaW1lem9uZU9mZnNldCgkRC5nZXRUaW1lem9uZU9mZnNldChvZmZzZXQpKTt9OyRQLmhhc0RheWxpZ2h0U2F2aW5nVGltZT1mdW5jdGlvbigpe3JldHVybihEYXRlLnRvZGF5KCkuc2V0KHttb250aDowLGRheToxfSkuZ2V0VGltZXpvbmVPZmZzZXQoKSE9PURhdGUudG9kYXkoKS5zZXQoe21vbnRoOjYsZGF5OjF9KS5nZXRUaW1lem9uZU9mZnNldCgpKTt9OyRQLmlzRGF5bGlnaHRTYXZpbmdUaW1lPWZ1bmN0aW9uKCl7cmV0dXJuKHRoaXMuaGFzRGF5bGlnaHRTYXZpbmdUaW1lKCkmJm5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKT09PURhdGUudG9kYXkoKS5zZXQoe21vbnRoOjYsZGF5OjF9KS5nZXRUaW1lem9uZU9mZnNldCgpKTt9OyRQLmdldFVUQ09mZnNldD1mdW5jdGlvbigpe3ZhciBuPXRoaXMuZ2V0VGltZXpvbmVPZmZzZXQoKSotMTAvNixyO2lmKG48MCl7cj0obi0xMDAwMCkudG9TdHJpbmcoKTtyZXR1cm4gci5jaGFyQXQoMCkrci5zdWJzdHIoMik7fWVsc2V7cj0obisxMDAwMCkudG9TdHJpbmcoKTtyZXR1cm5cIitcIityLnN1YnN0cigxKTt9fTskUC5nZXRFbGFwc2VkPWZ1bmN0aW9uKGRhdGUpe3JldHVybihkYXRlfHxuZXcgRGF0ZSgpKS10aGlzO307aWYoISRQLnRvSVNPU3RyaW5nKXskUC50b0lTT1N0cmluZz1mdW5jdGlvbigpe2Z1bmN0aW9uIGYobil7cmV0dXJuIG48MTA/JzAnK246bjt9XG5yZXR1cm4nXCInK3RoaXMuZ2V0VVRDRnVsbFllYXIoKSsnLScrXG5mKHRoaXMuZ2V0VVRDTW9udGgoKSsxKSsnLScrXG5mKHRoaXMuZ2V0VVRDRGF0ZSgpKSsnVCcrXG5mKHRoaXMuZ2V0VVRDSG91cnMoKSkrJzonK1xuZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkrJzonK1xuZih0aGlzLmdldFVUQ1NlY29uZHMoKSkrJ1pcIic7fTt9XG4kUC5fdG9TdHJpbmc9JFAudG9TdHJpbmc7JFAudG9TdHJpbmc9ZnVuY3Rpb24oZm9ybWF0KXt2YXIgeD10aGlzO2lmKGZvcm1hdCYmZm9ybWF0Lmxlbmd0aD09MSl7dmFyIGM9JEMuZm9ybWF0UGF0dGVybnM7eC50PXgudG9TdHJpbmc7c3dpdGNoKGZvcm1hdCl7Y2FzZVwiZFwiOnJldHVybiB4LnQoYy5zaG9ydERhdGUpO2Nhc2VcIkRcIjpyZXR1cm4geC50KGMubG9uZ0RhdGUpO2Nhc2VcIkZcIjpyZXR1cm4geC50KGMuZnVsbERhdGVUaW1lKTtjYXNlXCJtXCI6cmV0dXJuIHgudChjLm1vbnRoRGF5KTtjYXNlXCJyXCI6cmV0dXJuIHgudChjLnJmYzExMjMpO2Nhc2VcInNcIjpyZXR1cm4geC50KGMuc29ydGFibGVEYXRlVGltZSk7Y2FzZVwidFwiOnJldHVybiB4LnQoYy5zaG9ydFRpbWUpO2Nhc2VcIlRcIjpyZXR1cm4geC50KGMubG9uZ1RpbWUpO2Nhc2VcInVcIjpyZXR1cm4geC50KGMudW5pdmVyc2FsU29ydGFibGVEYXRlVGltZSk7Y2FzZVwieVwiOnJldHVybiB4LnQoYy55ZWFyTW9udGgpO319XG52YXIgb3JkPWZ1bmN0aW9uKG4pe3N3aXRjaChuKjEpe2Nhc2UgMTpjYXNlIDIxOmNhc2UgMzE6cmV0dXJuXCJzdFwiO2Nhc2UgMjpjYXNlIDIyOnJldHVyblwibmRcIjtjYXNlIDM6Y2FzZSAyMzpyZXR1cm5cInJkXCI7ZGVmYXVsdDpyZXR1cm5cInRoXCI7fX07cmV0dXJuIGZvcm1hdD9mb3JtYXQucmVwbGFjZSgvKFxcXFwpPyhkZD9kP2Q/fE1NP00/TT98eXk/eT95P3xoaD98SEg/fG1tP3xzcz98dHQ/fFMpL2csZnVuY3Rpb24obSl7aWYobS5jaGFyQXQoMCk9PT1cIlxcXFxcIil7cmV0dXJuIG0ucmVwbGFjZShcIlxcXFxcIixcIlwiKTt9XG54Lmg9eC5nZXRIb3Vycztzd2l0Y2gobSl7Y2FzZVwiaGhcIjpyZXR1cm4gcCh4LmgoKTwxMz8oeC5oKCk9PT0wPzEyOnguaCgpKTooeC5oKCktMTIpKTtjYXNlXCJoXCI6cmV0dXJuIHguaCgpPDEzPyh4LmgoKT09PTA/MTI6eC5oKCkpOih4LmgoKS0xMik7Y2FzZVwiSEhcIjpyZXR1cm4gcCh4LmgoKSk7Y2FzZVwiSFwiOnJldHVybiB4LmgoKTtjYXNlXCJtbVwiOnJldHVybiBwKHguZ2V0TWludXRlcygpKTtjYXNlXCJtXCI6cmV0dXJuIHguZ2V0TWludXRlcygpO2Nhc2VcInNzXCI6cmV0dXJuIHAoeC5nZXRTZWNvbmRzKCkpO2Nhc2VcInNcIjpyZXR1cm4geC5nZXRTZWNvbmRzKCk7Y2FzZVwieXl5eVwiOnJldHVybiBwKHguZ2V0RnVsbFllYXIoKSw0KTtjYXNlXCJ5eVwiOnJldHVybiBwKHguZ2V0RnVsbFllYXIoKSk7Y2FzZVwiZGRkZFwiOnJldHVybiAkQy5kYXlOYW1lc1t4LmdldERheSgpXTtjYXNlXCJkZGRcIjpyZXR1cm4gJEMuYWJicmV2aWF0ZWREYXlOYW1lc1t4LmdldERheSgpXTtjYXNlXCJkZFwiOnJldHVybiBwKHguZ2V0RGF0ZSgpKTtjYXNlXCJkXCI6cmV0dXJuIHguZ2V0RGF0ZSgpO2Nhc2VcIk1NTU1cIjpyZXR1cm4gJEMubW9udGhOYW1lc1t4LmdldE1vbnRoKCldO2Nhc2VcIk1NTVwiOnJldHVybiAkQy5hYmJyZXZpYXRlZE1vbnRoTmFtZXNbeC5nZXRNb250aCgpXTtjYXNlXCJNTVwiOnJldHVybiBwKCh4LmdldE1vbnRoKCkrMSkpO2Nhc2VcIk1cIjpyZXR1cm4geC5nZXRNb250aCgpKzE7Y2FzZVwidFwiOnJldHVybiB4LmgoKTwxMj8kQy5hbURlc2lnbmF0b3Iuc3Vic3RyaW5nKDAsMSk6JEMucG1EZXNpZ25hdG9yLnN1YnN0cmluZygwLDEpO2Nhc2VcInR0XCI6cmV0dXJuIHguaCgpPDEyPyRDLmFtRGVzaWduYXRvcjokQy5wbURlc2lnbmF0b3I7Y2FzZVwiU1wiOnJldHVybiBvcmQoeC5nZXREYXRlKCkpO2RlZmF1bHQ6cmV0dXJuIG07fX0pOnRoaXMuX3RvU3RyaW5nKCk7fTt9KCkpO1xuKGZ1bmN0aW9uKCl7dmFyICREPURhdGUsJFA9JEQucHJvdG90eXBlLCRDPSRELkN1bHR1cmVJbmZvLCROPU51bWJlci5wcm90b3R5cGU7JFAuX29yaWVudD0rMTskUC5fbnRoPW51bGw7JFAuX2lzPWZhbHNlOyRQLl9zYW1lPWZhbHNlOyRQLl9pc1NlY29uZD1mYWxzZTskTi5fZGF0ZUVsZW1lbnQ9XCJkYXlcIjskUC5uZXh0PWZ1bmN0aW9uKCl7dGhpcy5fb3JpZW50PSsxO3JldHVybiB0aGlzO307JEQubmV4dD1mdW5jdGlvbigpe3JldHVybiAkRC50b2RheSgpLm5leHQoKTt9OyRQLmxhc3Q9JFAucHJldj0kUC5wcmV2aW91cz1mdW5jdGlvbigpe3RoaXMuX29yaWVudD0tMTtyZXR1cm4gdGhpczt9OyRELmxhc3Q9JEQucHJldj0kRC5wcmV2aW91cz1mdW5jdGlvbigpe3JldHVybiAkRC50b2RheSgpLmxhc3QoKTt9OyRQLmlzPWZ1bmN0aW9uKCl7dGhpcy5faXM9dHJ1ZTtyZXR1cm4gdGhpczt9OyRQLnNhbWU9ZnVuY3Rpb24oKXt0aGlzLl9zYW1lPXRydWU7dGhpcy5faXNTZWNvbmQ9ZmFsc2U7cmV0dXJuIHRoaXM7fTskUC50b2RheT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnNhbWUoKS5kYXkoKTt9OyRQLndlZWtkYXk9ZnVuY3Rpb24oKXtpZih0aGlzLl9pcyl7dGhpcy5faXM9ZmFsc2U7cmV0dXJuKCF0aGlzLmlzKCkuc2F0KCkmJiF0aGlzLmlzKCkuc3VuKCkpO31cbnJldHVybiBmYWxzZTt9OyRQLmF0PWZ1bmN0aW9uKHRpbWUpe3JldHVybih0eXBlb2YgdGltZT09PVwic3RyaW5nXCIpPyRELnBhcnNlKHRoaXMudG9TdHJpbmcoXCJkXCIpK1wiIFwiK3RpbWUpOnRoaXMuc2V0KHRpbWUpO307JE4uZnJvbU5vdz0kTi5hZnRlcj1mdW5jdGlvbihkYXRlKXt2YXIgYz17fTtjW3RoaXMuX2RhdGVFbGVtZW50XT10aGlzO3JldHVybigoIWRhdGUpP25ldyBEYXRlKCk6ZGF0ZS5jbG9uZSgpKS5hZGQoYyk7fTskTi5hZ289JE4uYmVmb3JlPWZ1bmN0aW9uKGRhdGUpe3ZhciBjPXt9O2NbdGhpcy5fZGF0ZUVsZW1lbnRdPXRoaXMqLTE7cmV0dXJuKCghZGF0ZSk/bmV3IERhdGUoKTpkYXRlLmNsb25lKCkpLmFkZChjKTt9O3ZhciBkeD0oXCJzdW5kYXkgbW9uZGF5IHR1ZXNkYXkgd2VkbmVzZGF5IHRodXJzZGF5IGZyaWRheSBzYXR1cmRheVwiKS5zcGxpdCgvXFxzLyksbXg9KFwiamFudWFyeSBmZWJydWFyeSBtYXJjaCBhcHJpbCBtYXkganVuZSBqdWx5IGF1Z3VzdCBzZXB0ZW1iZXIgb2N0b2JlciBub3ZlbWJlciBkZWNlbWJlclwiKS5zcGxpdCgvXFxzLykscHg9KFwiTWlsbGlzZWNvbmQgU2Vjb25kIE1pbnV0ZSBIb3VyIERheSBXZWVrIE1vbnRoIFllYXJcIikuc3BsaXQoL1xccy8pLHB4Zj0oXCJNaWxsaXNlY29uZHMgU2Vjb25kcyBNaW51dGVzIEhvdXJzIERhdGUgV2VlayBNb250aCBGdWxsWWVhclwiKS5zcGxpdCgvXFxzLyksbnRoPShcImZpbmFsIGZpcnN0IHNlY29uZCB0aGlyZCBmb3VydGggZmlmdGhcIikuc3BsaXQoL1xccy8pLGRlOyRQLnRvT2JqZWN0PWZ1bmN0aW9uKCl7dmFyIG89e307Zm9yKHZhciBpPTA7aTxweC5sZW5ndGg7aSsrKXtvW3B4W2ldLnRvTG93ZXJDYXNlKCldPXRoaXNbXCJnZXRcIitweGZbaV1dKCk7fVxucmV0dXJuIG87fTskRC5mcm9tT2JqZWN0PWZ1bmN0aW9uKGNvbmZpZyl7Y29uZmlnLndlZWs9bnVsbDtyZXR1cm4gRGF0ZS50b2RheSgpLnNldChjb25maWcpO307dmFyIGRmPWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbigpe2lmKHRoaXMuX2lzKXt0aGlzLl9pcz1mYWxzZTtyZXR1cm4gdGhpcy5nZXREYXkoKT09bjt9XG5pZih0aGlzLl9udGghPT1udWxsKXtpZih0aGlzLl9pc1NlY29uZCl7dGhpcy5hZGRTZWNvbmRzKHRoaXMuX29yaWVudCotMSk7fVxudGhpcy5faXNTZWNvbmQ9ZmFsc2U7dmFyIG50ZW1wPXRoaXMuX250aDt0aGlzLl9udGg9bnVsbDt2YXIgdGVtcD10aGlzLmNsb25lKCkubW92ZVRvTGFzdERheU9mTW9udGgoKTt0aGlzLm1vdmVUb050aE9jY3VycmVuY2UobixudGVtcCk7aWYodGhpcz50ZW1wKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcigkRC5nZXREYXlOYW1lKG4pK1wiIGRvZXMgbm90IG9jY3VyIFwiK250ZW1wK1wiIHRpbWVzIGluIHRoZSBtb250aCBvZiBcIiskRC5nZXRNb250aE5hbWUodGVtcC5nZXRNb250aCgpKStcIiBcIit0ZW1wLmdldEZ1bGxZZWFyKCkrXCIuXCIpO31cbnJldHVybiB0aGlzO31cbnJldHVybiB0aGlzLm1vdmVUb0RheU9mV2VlayhuLHRoaXMuX29yaWVudCk7fTt9O3ZhciBzZGY9ZnVuY3Rpb24obil7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIHQ9JEQudG9kYXkoKSxzaGlmdD1uLXQuZ2V0RGF5KCk7aWYobj09PTAmJiRDLmZpcnN0RGF5T2ZXZWVrPT09MSYmdC5nZXREYXkoKSE9PTApe3NoaWZ0PXNoaWZ0Kzc7fVxucmV0dXJuIHQuYWRkRGF5cyhzaGlmdCk7fTt9O2Zvcih2YXIgaT0wO2k8ZHgubGVuZ3RoO2krKyl7JERbZHhbaV0udG9VcHBlckNhc2UoKV09JERbZHhbaV0udG9VcHBlckNhc2UoKS5zdWJzdHJpbmcoMCwzKV09aTskRFtkeFtpXV09JERbZHhbaV0uc3Vic3RyaW5nKDAsMyldPXNkZihpKTskUFtkeFtpXV09JFBbZHhbaV0uc3Vic3RyaW5nKDAsMyldPWRmKGkpO31cbnZhciBtZj1mdW5jdGlvbihuKXtyZXR1cm4gZnVuY3Rpb24oKXtpZih0aGlzLl9pcyl7dGhpcy5faXM9ZmFsc2U7cmV0dXJuIHRoaXMuZ2V0TW9udGgoKT09PW47fVxucmV0dXJuIHRoaXMubW92ZVRvTW9udGgobix0aGlzLl9vcmllbnQpO307fTt2YXIgc21mPWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbigpe3JldHVybiAkRC50b2RheSgpLnNldCh7bW9udGg6bixkYXk6MX0pO307fTtmb3IodmFyIGo9MDtqPG14Lmxlbmd0aDtqKyspeyREW214W2pdLnRvVXBwZXJDYXNlKCldPSREW214W2pdLnRvVXBwZXJDYXNlKCkuc3Vic3RyaW5nKDAsMyldPWo7JERbbXhbal1dPSREW214W2pdLnN1YnN0cmluZygwLDMpXT1zbWYoaik7JFBbbXhbal1dPSRQW214W2pdLnN1YnN0cmluZygwLDMpXT1tZihqKTt9XG52YXIgZWY9ZnVuY3Rpb24oail7cmV0dXJuIGZ1bmN0aW9uKCl7aWYodGhpcy5faXNTZWNvbmQpe3RoaXMuX2lzU2Vjb25kPWZhbHNlO3JldHVybiB0aGlzO31cbmlmKHRoaXMuX3NhbWUpe3RoaXMuX3NhbWU9dGhpcy5faXM9ZmFsc2U7dmFyIG8xPXRoaXMudG9PYmplY3QoKSxvMj0oYXJndW1lbnRzWzBdfHxuZXcgRGF0ZSgpKS50b09iamVjdCgpLHY9XCJcIixrPWoudG9Mb3dlckNhc2UoKTtmb3IodmFyIG09KHB4Lmxlbmd0aC0xKTttPi0xO20tLSl7dj1weFttXS50b0xvd2VyQ2FzZSgpO2lmKG8xW3ZdIT1vMlt2XSl7cmV0dXJuIGZhbHNlO31cbmlmKGs9PXYpe2JyZWFrO319XG5yZXR1cm4gdHJ1ZTt9XG5pZihqLnN1YnN0cmluZyhqLmxlbmd0aC0xKSE9XCJzXCIpe2orPVwic1wiO31cbnJldHVybiB0aGlzW1wiYWRkXCIral0odGhpcy5fb3JpZW50KTt9O307dmFyIG5mPWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbigpe3RoaXMuX2RhdGVFbGVtZW50PW47cmV0dXJuIHRoaXM7fTt9O2Zvcih2YXIgaz0wO2s8cHgubGVuZ3RoO2srKyl7ZGU9cHhba10udG9Mb3dlckNhc2UoKTskUFtkZV09JFBbZGUrXCJzXCJdPWVmKHB4W2tdKTskTltkZV09JE5bZGUrXCJzXCJdPW5mKGRlKTt9XG4kUC5fc3M9ZWYoXCJTZWNvbmRcIik7dmFyIG50aGZuPWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbihkYXlPZldlZWspe2lmKHRoaXMuX3NhbWUpe3JldHVybiB0aGlzLl9zcyhhcmd1bWVudHNbMF0pO31cbmlmKGRheU9mV2Vla3x8ZGF5T2ZXZWVrPT09MCl7cmV0dXJuIHRoaXMubW92ZVRvTnRoT2NjdXJyZW5jZShkYXlPZldlZWssbik7fVxudGhpcy5fbnRoPW47aWYobj09PTImJihkYXlPZldlZWs9PT11bmRlZmluZWR8fGRheU9mV2Vlaz09PW51bGwpKXt0aGlzLl9pc1NlY29uZD10cnVlO3JldHVybiB0aGlzLmFkZFNlY29uZHModGhpcy5fb3JpZW50KTt9XG5yZXR1cm4gdGhpczt9O307Zm9yKHZhciBsPTA7bDxudGgubGVuZ3RoO2wrKyl7JFBbbnRoW2xdXT0obD09PTApP250aGZuKC0xKTpudGhmbihsKTt9fSgpKTtcbihmdW5jdGlvbigpe0RhdGUuUGFyc2luZz17RXhjZXB0aW9uOmZ1bmN0aW9uKHMpe3RoaXMubWVzc2FnZT1cIlBhcnNlIGVycm9yIGF0ICdcIitzLnN1YnN0cmluZygwLDEwKStcIiAuLi4nXCI7fX07dmFyICRQPURhdGUuUGFyc2luZzt2YXIgXz0kUC5PcGVyYXRvcnM9e3J0b2tlbjpmdW5jdGlvbihyKXtyZXR1cm4gZnVuY3Rpb24ocyl7dmFyIG14PXMubWF0Y2gocik7aWYobXgpe3JldHVybihbbXhbMF0scy5zdWJzdHJpbmcobXhbMF0ubGVuZ3RoKV0pO31lbHNle3Rocm93IG5ldyAkUC5FeGNlcHRpb24ocyk7fX07fSx0b2tlbjpmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24ocyl7cmV0dXJuIF8ucnRva2VuKG5ldyBSZWdFeHAoXCJeXFxzKlwiK3MrXCJcXHMqXCIpKShzKTt9O30sc3Rva2VuOmZ1bmN0aW9uKHMpe3JldHVybiBfLnJ0b2tlbihuZXcgUmVnRXhwKFwiXlwiK3MpKTt9LHVudGlsOmZ1bmN0aW9uKHApe3JldHVybiBmdW5jdGlvbihzKXt2YXIgcXg9W10scng9bnVsbDt3aGlsZShzLmxlbmd0aCl7dHJ5e3J4PXAuY2FsbCh0aGlzLHMpO31jYXRjaChlKXtxeC5wdXNoKHJ4WzBdKTtzPXJ4WzFdO2NvbnRpbnVlO31cbmJyZWFrO31cbnJldHVybltxeCxzXTt9O30sbWFueTpmdW5jdGlvbihwKXtyZXR1cm4gZnVuY3Rpb24ocyl7dmFyIHJ4PVtdLHI9bnVsbDt3aGlsZShzLmxlbmd0aCl7dHJ5e3I9cC5jYWxsKHRoaXMscyk7fWNhdGNoKGUpe3JldHVybltyeCxzXTt9XG5yeC5wdXNoKHJbMF0pO3M9clsxXTt9XG5yZXR1cm5bcngsc107fTt9LG9wdGlvbmFsOmZ1bmN0aW9uKHApe3JldHVybiBmdW5jdGlvbihzKXt2YXIgcj1udWxsO3RyeXtyPXAuY2FsbCh0aGlzLHMpO31jYXRjaChlKXtyZXR1cm5bbnVsbCxzXTt9XG5yZXR1cm5bclswXSxyWzFdXTt9O30sbm90OmZ1bmN0aW9uKHApe3JldHVybiBmdW5jdGlvbihzKXt0cnl7cC5jYWxsKHRoaXMscyk7fWNhdGNoKGUpe3JldHVybltudWxsLHNdO31cbnRocm93IG5ldyAkUC5FeGNlcHRpb24ocyk7fTt9LGlnbm9yZTpmdW5jdGlvbihwKXtyZXR1cm4gcD9mdW5jdGlvbihzKXt2YXIgcj1udWxsO3I9cC5jYWxsKHRoaXMscyk7cmV0dXJuW251bGwsclsxXV07fTpudWxsO30scHJvZHVjdDpmdW5jdGlvbigpe3ZhciBweD1hcmd1bWVudHNbMF0scXg9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLHJ4PVtdO2Zvcih2YXIgaT0wO2k8cHgubGVuZ3RoO2krKyl7cngucHVzaChfLmVhY2gocHhbaV0scXgpKTt9XG5yZXR1cm4gcng7fSxjYWNoZTpmdW5jdGlvbihydWxlKXt2YXIgY2FjaGU9e30scj1udWxsO3JldHVybiBmdW5jdGlvbihzKXt0cnl7cj1jYWNoZVtzXT0oY2FjaGVbc118fHJ1bGUuY2FsbCh0aGlzLHMpKTt9Y2F0Y2goZSl7cj1jYWNoZVtzXT1lO31cbmlmKHIgaW5zdGFuY2VvZiAkUC5FeGNlcHRpb24pe3Rocm93IHI7fWVsc2V7cmV0dXJuIHI7fX07fSxhbnk6ZnVuY3Rpb24oKXt2YXIgcHg9YXJndW1lbnRzO3JldHVybiBmdW5jdGlvbihzKXt2YXIgcj1udWxsO2Zvcih2YXIgaT0wO2k8cHgubGVuZ3RoO2krKyl7aWYocHhbaV09PW51bGwpe2NvbnRpbnVlO31cbnRyeXtyPShweFtpXS5jYWxsKHRoaXMscykpO31jYXRjaChlKXtyPW51bGw7fVxuaWYocil7cmV0dXJuIHI7fX1cbnRocm93IG5ldyAkUC5FeGNlcHRpb24ocyk7fTt9LGVhY2g6ZnVuY3Rpb24oKXt2YXIgcHg9YXJndW1lbnRzO3JldHVybiBmdW5jdGlvbihzKXt2YXIgcng9W10scj1udWxsO2Zvcih2YXIgaT0wO2k8cHgubGVuZ3RoO2krKyl7aWYocHhbaV09PW51bGwpe2NvbnRpbnVlO31cbnRyeXtyPShweFtpXS5jYWxsKHRoaXMscykpO31jYXRjaChlKXt0aHJvdyBuZXcgJFAuRXhjZXB0aW9uKHMpO31cbnJ4LnB1c2goclswXSk7cz1yWzFdO31cbnJldHVybltyeCxzXTt9O30sYWxsOmZ1bmN0aW9uKCl7dmFyIHB4PWFyZ3VtZW50cyxfPV87cmV0dXJuIF8uZWFjaChfLm9wdGlvbmFsKHB4KSk7fSxzZXF1ZW5jZTpmdW5jdGlvbihweCxkLGMpe2Q9ZHx8Xy5ydG9rZW4oL15cXHMqLyk7Yz1jfHxudWxsO2lmKHB4Lmxlbmd0aD09MSl7cmV0dXJuIHB4WzBdO31cbnJldHVybiBmdW5jdGlvbihzKXt2YXIgcj1udWxsLHE9bnVsbDt2YXIgcng9W107Zm9yKHZhciBpPTA7aTxweC5sZW5ndGg7aSsrKXt0cnl7cj1weFtpXS5jYWxsKHRoaXMscyk7fWNhdGNoKGUpe2JyZWFrO31cbnJ4LnB1c2goclswXSk7dHJ5e3E9ZC5jYWxsKHRoaXMsclsxXSk7fWNhdGNoKGV4KXtxPW51bGw7YnJlYWs7fVxucz1xWzFdO31cbmlmKCFyKXt0aHJvdyBuZXcgJFAuRXhjZXB0aW9uKHMpO31cbmlmKHEpe3Rocm93IG5ldyAkUC5FeGNlcHRpb24ocVsxXSk7fVxuaWYoYyl7dHJ5e3I9Yy5jYWxsKHRoaXMsclsxXSk7fWNhdGNoKGV5KXt0aHJvdyBuZXcgJFAuRXhjZXB0aW9uKHJbMV0pO319XG5yZXR1cm5bcngsKHI/clsxXTpzKV07fTt9LGJldHdlZW46ZnVuY3Rpb24oZDEscCxkMil7ZDI9ZDJ8fGQxO3ZhciBfZm49Xy5lYWNoKF8uaWdub3JlKGQxKSxwLF8uaWdub3JlKGQyKSk7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByeD1fZm4uY2FsbCh0aGlzLHMpO3JldHVybltbcnhbMF1bMF0sclswXVsyXV0scnhbMV1dO307fSxsaXN0OmZ1bmN0aW9uKHAsZCxjKXtkPWR8fF8ucnRva2VuKC9eXFxzKi8pO2M9Y3x8bnVsbDtyZXR1cm4ocCBpbnN0YW5jZW9mIEFycmF5P18uZWFjaChfLnByb2R1Y3QocC5zbGljZSgwLC0xKSxfLmlnbm9yZShkKSkscC5zbGljZSgtMSksXy5pZ25vcmUoYykpOl8uZWFjaChfLm1hbnkoXy5lYWNoKHAsXy5pZ25vcmUoZCkpKSxweCxfLmlnbm9yZShjKSkpO30sc2V0OmZ1bmN0aW9uKHB4LGQsYyl7ZD1kfHxfLnJ0b2tlbigvXlxccyovKTtjPWN8fG51bGw7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByPW51bGwscD1udWxsLHE9bnVsbCxyeD1udWxsLGJlc3Q9W1tdLHNdLGxhc3Q9ZmFsc2U7Zm9yKHZhciBpPTA7aTxweC5sZW5ndGg7aSsrKXtxPW51bGw7cD1udWxsO3I9bnVsbDtsYXN0PShweC5sZW5ndGg9PTEpO3RyeXtyPXB4W2ldLmNhbGwodGhpcyxzKTt9Y2F0Y2goZSl7Y29udGludWU7fVxucng9W1tyWzBdXSxyWzFdXTtpZihyWzFdLmxlbmd0aD4wJiYhbGFzdCl7dHJ5e3E9ZC5jYWxsKHRoaXMsclsxXSk7fWNhdGNoKGV4KXtsYXN0PXRydWU7fX1lbHNle2xhc3Q9dHJ1ZTt9XG5pZighbGFzdCYmcVsxXS5sZW5ndGg9PT0wKXtsYXN0PXRydWU7fVxuaWYoIWxhc3Qpe3ZhciBxeD1bXTtmb3IodmFyIGo9MDtqPHB4Lmxlbmd0aDtqKyspe2lmKGkhPWope3F4LnB1c2gocHhbal0pO319XG5wPV8uc2V0KHF4LGQpLmNhbGwodGhpcyxxWzFdKTtpZihwWzBdLmxlbmd0aD4wKXtyeFswXT1yeFswXS5jb25jYXQocFswXSk7cnhbMV09cFsxXTt9fVxuaWYocnhbMV0ubGVuZ3RoPGJlc3RbMV0ubGVuZ3RoKXtiZXN0PXJ4O31cbmlmKGJlc3RbMV0ubGVuZ3RoPT09MCl7YnJlYWs7fX1cbmlmKGJlc3RbMF0ubGVuZ3RoPT09MCl7cmV0dXJuIGJlc3Q7fVxuaWYoYyl7dHJ5e3E9Yy5jYWxsKHRoaXMsYmVzdFsxXSk7fWNhdGNoKGV5KXt0aHJvdyBuZXcgJFAuRXhjZXB0aW9uKGJlc3RbMV0pO31cbmJlc3RbMV09cVsxXTt9XG5yZXR1cm4gYmVzdDt9O30sZm9yd2FyZDpmdW5jdGlvbihncixmbmFtZSl7cmV0dXJuIGZ1bmN0aW9uKHMpe3JldHVybiBncltmbmFtZV0uY2FsbCh0aGlzLHMpO307fSxyZXBsYWNlOmZ1bmN0aW9uKHJ1bGUscmVwbCl7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByPXJ1bGUuY2FsbCh0aGlzLHMpO3JldHVybltyZXBsLHJbMV1dO307fSxwcm9jZXNzOmZ1bmN0aW9uKHJ1bGUsZm4pe3JldHVybiBmdW5jdGlvbihzKXt2YXIgcj1ydWxlLmNhbGwodGhpcyxzKTtyZXR1cm5bZm4uY2FsbCh0aGlzLHJbMF0pLHJbMV1dO307fSxtaW46ZnVuY3Rpb24obWluLHJ1bGUpe3JldHVybiBmdW5jdGlvbihzKXt2YXIgcng9cnVsZS5jYWxsKHRoaXMscyk7aWYocnhbMF0ubGVuZ3RoPG1pbil7dGhyb3cgbmV3ICRQLkV4Y2VwdGlvbihzKTt9XG5yZXR1cm4gcng7fTt9fTt2YXIgX2dlbmVyYXRvcj1mdW5jdGlvbihvcCl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGFyZ3M9bnVsbCxyeD1bXTtpZihhcmd1bWVudHMubGVuZ3RoPjEpe2FyZ3M9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTt9ZWxzZSBpZihhcmd1bWVudHNbMF1pbnN0YW5jZW9mIEFycmF5KXthcmdzPWFyZ3VtZW50c1swXTt9XG5pZihhcmdzKXtmb3IodmFyIGk9MCxweD1hcmdzLnNoaWZ0KCk7aTxweC5sZW5ndGg7aSsrKXthcmdzLnVuc2hpZnQocHhbaV0pO3J4LnB1c2gob3AuYXBwbHkobnVsbCxhcmdzKSk7YXJncy5zaGlmdCgpO3JldHVybiByeDt9fWVsc2V7cmV0dXJuIG9wLmFwcGx5KG51bGwsYXJndW1lbnRzKTt9fTt9O3ZhciBneD1cIm9wdGlvbmFsIG5vdCBpZ25vcmUgY2FjaGVcIi5zcGxpdCgvXFxzLyk7Zm9yKHZhciBpPTA7aTxneC5sZW5ndGg7aSsrKXtfW2d4W2ldXT1fZ2VuZXJhdG9yKF9bZ3hbaV1dKTt9XG52YXIgX3ZlY3Rvcj1mdW5jdGlvbihvcCl7cmV0dXJuIGZ1bmN0aW9uKCl7aWYoYXJndW1lbnRzWzBdaW5zdGFuY2VvZiBBcnJheSl7cmV0dXJuIG9wLmFwcGx5KG51bGwsYXJndW1lbnRzWzBdKTt9ZWxzZXtyZXR1cm4gb3AuYXBwbHkobnVsbCxhcmd1bWVudHMpO319O307dmFyIHZ4PVwiZWFjaCBhbnkgYWxsXCIuc3BsaXQoL1xccy8pO2Zvcih2YXIgaj0wO2o8dngubGVuZ3RoO2orKyl7X1t2eFtqXV09X3ZlY3RvcihfW3Z4W2pdXSk7fX0oKSk7KGZ1bmN0aW9uKCl7dmFyICREPURhdGUsJFA9JEQucHJvdG90eXBlLCRDPSRELkN1bHR1cmVJbmZvO3ZhciBmbGF0dGVuQW5kQ29tcGFjdD1mdW5jdGlvbihheCl7dmFyIHJ4PVtdO2Zvcih2YXIgaT0wO2k8YXgubGVuZ3RoO2krKyl7aWYoYXhbaV1pbnN0YW5jZW9mIEFycmF5KXtyeD1yeC5jb25jYXQoZmxhdHRlbkFuZENvbXBhY3QoYXhbaV0pKTt9ZWxzZXtpZihheFtpXSl7cngucHVzaChheFtpXSk7fX19XG5yZXR1cm4gcng7fTskRC5HcmFtbWFyPXt9OyRELlRyYW5zbGF0b3I9e2hvdXI6ZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5ob3VyPU51bWJlcihzKTt9O30sbWludXRlOmZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbigpe3RoaXMubWludXRlPU51bWJlcihzKTt9O30sc2Vjb25kOmZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbigpe3RoaXMuc2Vjb25kPU51bWJlcihzKTt9O30sbWVyaWRpYW46ZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5tZXJpZGlhbj1zLnNsaWNlKDAsMSkudG9Mb3dlckNhc2UoKTt9O30sdGltZXpvbmU6ZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49cy5yZXBsYWNlKC9bXlxcZFxcK1xcLV0vZyxcIlwiKTtpZihuLmxlbmd0aCl7dGhpcy50aW1lem9uZU9mZnNldD1OdW1iZXIobik7fWVsc2V7dGhpcy50aW1lem9uZT1zLnRvTG93ZXJDYXNlKCk7fX07fSxkYXk6ZnVuY3Rpb24oeCl7dmFyIHM9eFswXTtyZXR1cm4gZnVuY3Rpb24oKXt0aGlzLmRheT1OdW1iZXIocy5tYXRjaCgvXFxkKy8pWzBdKTt9O30sbW9udGg6ZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5tb250aD0ocy5sZW5ndGg9PTMpP1wiamFuIGZlYiBtYXIgYXByIG1heSBqdW4ganVsIGF1ZyBzZXAgb2N0IG5vdiBkZWNcIi5pbmRleE9mKHMpLzQ6TnVtYmVyKHMpLTE7fTt9LHllYXI6ZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIG49TnVtYmVyKHMpO3RoaXMueWVhcj0oKHMubGVuZ3RoPjIpP246KG4rKCgobisyMDAwKTwkQy50d29EaWdpdFllYXJNYXgpPzIwMDA6MTkwMCkpKTt9O30scmRheTpmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXtzd2l0Y2gocyl7Y2FzZVwieWVzdGVyZGF5XCI6dGhpcy5kYXlzPS0xO2JyZWFrO2Nhc2VcInRvbW9ycm93XCI6dGhpcy5kYXlzPTE7YnJlYWs7Y2FzZVwidG9kYXlcIjp0aGlzLmRheXM9MDticmVhaztjYXNlXCJub3dcIjp0aGlzLmRheXM9MDt0aGlzLm5vdz10cnVlO2JyZWFrO319O30sZmluaXNoRXhhY3Q6ZnVuY3Rpb24oeCl7eD0oeCBpbnN0YW5jZW9mIEFycmF5KT94Olt4XTtmb3IodmFyIGk9MDtpPHgubGVuZ3RoO2krKyl7aWYoeFtpXSl7eFtpXS5jYWxsKHRoaXMpO319XG52YXIgbm93PW5ldyBEYXRlKCk7aWYoKHRoaXMuaG91cnx8dGhpcy5taW51dGUpJiYoIXRoaXMubW9udGgmJiF0aGlzLnllYXImJiF0aGlzLmRheSkpe3RoaXMuZGF5PW5vdy5nZXREYXRlKCk7fVxuaWYoIXRoaXMueWVhcil7dGhpcy55ZWFyPW5vdy5nZXRGdWxsWWVhcigpO31cbmlmKCF0aGlzLm1vbnRoJiZ0aGlzLm1vbnRoIT09MCl7dGhpcy5tb250aD1ub3cuZ2V0TW9udGgoKTt9XG5pZighdGhpcy5kYXkpe3RoaXMuZGF5PTE7fVxuaWYoIXRoaXMuaG91cil7dGhpcy5ob3VyPTA7fVxuaWYoIXRoaXMubWludXRlKXt0aGlzLm1pbnV0ZT0wO31cbmlmKCF0aGlzLnNlY29uZCl7dGhpcy5zZWNvbmQ9MDt9XG5pZih0aGlzLm1lcmlkaWFuJiZ0aGlzLmhvdXIpe2lmKHRoaXMubWVyaWRpYW49PVwicFwiJiZ0aGlzLmhvdXI8MTIpe3RoaXMuaG91cj10aGlzLmhvdXIrMTI7fWVsc2UgaWYodGhpcy5tZXJpZGlhbj09XCJhXCImJnRoaXMuaG91cj09MTIpe3RoaXMuaG91cj0wO319XG5pZih0aGlzLmRheT4kRC5nZXREYXlzSW5Nb250aCh0aGlzLnllYXIsdGhpcy5tb250aCkpe3Rocm93IG5ldyBSYW5nZUVycm9yKHRoaXMuZGF5K1wiIGlzIG5vdCBhIHZhbGlkIHZhbHVlIGZvciBkYXlzLlwiKTt9XG52YXIgcj1uZXcgRGF0ZSh0aGlzLnllYXIsdGhpcy5tb250aCx0aGlzLmRheSx0aGlzLmhvdXIsdGhpcy5taW51dGUsdGhpcy5zZWNvbmQpO2lmKHRoaXMudGltZXpvbmUpe3Iuc2V0KHt0aW1lem9uZTp0aGlzLnRpbWV6b25lfSk7fWVsc2UgaWYodGhpcy50aW1lem9uZU9mZnNldCl7ci5zZXQoe3RpbWV6b25lT2Zmc2V0OnRoaXMudGltZXpvbmVPZmZzZXR9KTt9XG5yZXR1cm4gcjt9LGZpbmlzaDpmdW5jdGlvbih4KXt4PSh4IGluc3RhbmNlb2YgQXJyYXkpP2ZsYXR0ZW5BbmRDb21wYWN0KHgpOlt4XTtpZih4Lmxlbmd0aD09PTApe3JldHVybiBudWxsO31cbmZvcih2YXIgaT0wO2k8eC5sZW5ndGg7aSsrKXtpZih0eXBlb2YgeFtpXT09XCJmdW5jdGlvblwiKXt4W2ldLmNhbGwodGhpcyk7fX1cbnZhciB0b2RheT0kRC50b2RheSgpO2lmKHRoaXMubm93JiYhdGhpcy51bml0JiYhdGhpcy5vcGVyYXRvcil7cmV0dXJuIG5ldyBEYXRlKCk7fWVsc2UgaWYodGhpcy5ub3cpe3RvZGF5PW5ldyBEYXRlKCk7fVxudmFyIGV4cHJlc3Npb249ISEodGhpcy5kYXlzJiZ0aGlzLmRheXMhPT1udWxsfHx0aGlzLm9yaWVudHx8dGhpcy5vcGVyYXRvcik7dmFyIGdhcCxtb2Qsb3JpZW50O29yaWVudD0oKHRoaXMub3JpZW50PT1cInBhc3RcInx8dGhpcy5vcGVyYXRvcj09XCJzdWJ0cmFjdFwiKT8tMToxKTtpZighdGhpcy5ub3cmJlwiaG91ciBtaW51dGUgc2Vjb25kXCIuaW5kZXhPZih0aGlzLnVuaXQpIT0tMSl7dG9kYXkuc2V0VGltZVRvTm93KCk7fVxuaWYodGhpcy5tb250aHx8dGhpcy5tb250aD09PTApe2lmKFwieWVhciBkYXkgaG91ciBtaW51dGUgc2Vjb25kXCIuaW5kZXhPZih0aGlzLnVuaXQpIT0tMSl7dGhpcy52YWx1ZT10aGlzLm1vbnRoKzE7dGhpcy5tb250aD1udWxsO2V4cHJlc3Npb249dHJ1ZTt9fVxuaWYoIWV4cHJlc3Npb24mJnRoaXMud2Vla2RheSYmIXRoaXMuZGF5JiYhdGhpcy5kYXlzKXt2YXIgdGVtcD1EYXRlW3RoaXMud2Vla2RheV0oKTt0aGlzLmRheT10ZW1wLmdldERhdGUoKTtpZighdGhpcy5tb250aCl7dGhpcy5tb250aD10ZW1wLmdldE1vbnRoKCk7fVxudGhpcy55ZWFyPXRlbXAuZ2V0RnVsbFllYXIoKTt9XG5pZihleHByZXNzaW9uJiZ0aGlzLndlZWtkYXkmJnRoaXMudW5pdCE9XCJtb250aFwiKXt0aGlzLnVuaXQ9XCJkYXlcIjtnYXA9KCRELmdldERheU51bWJlckZyb21OYW1lKHRoaXMud2Vla2RheSktdG9kYXkuZ2V0RGF5KCkpO21vZD03O3RoaXMuZGF5cz1nYXA/KChnYXArKG9yaWVudCptb2QpKSVtb2QpOihvcmllbnQqbW9kKTt9XG5pZih0aGlzLm1vbnRoJiZ0aGlzLnVuaXQ9PVwiZGF5XCImJnRoaXMub3BlcmF0b3Ipe3RoaXMudmFsdWU9KHRoaXMubW9udGgrMSk7dGhpcy5tb250aD1udWxsO31cbmlmKHRoaXMudmFsdWUhPW51bGwmJnRoaXMubW9udGghPW51bGwmJnRoaXMueWVhciE9bnVsbCl7dGhpcy5kYXk9dGhpcy52YWx1ZSoxO31cbmlmKHRoaXMubW9udGgmJiF0aGlzLmRheSYmdGhpcy52YWx1ZSl7dG9kYXkuc2V0KHtkYXk6dGhpcy52YWx1ZSoxfSk7aWYoIWV4cHJlc3Npb24pe3RoaXMuZGF5PXRoaXMudmFsdWUqMTt9fVxuaWYoIXRoaXMubW9udGgmJnRoaXMudmFsdWUmJnRoaXMudW5pdD09XCJtb250aFwiJiYhdGhpcy5ub3cpe3RoaXMubW9udGg9dGhpcy52YWx1ZTtleHByZXNzaW9uPXRydWU7fVxuaWYoZXhwcmVzc2lvbiYmKHRoaXMubW9udGh8fHRoaXMubW9udGg9PT0wKSYmdGhpcy51bml0IT1cInllYXJcIil7dGhpcy51bml0PVwibW9udGhcIjtnYXA9KHRoaXMubW9udGgtdG9kYXkuZ2V0TW9udGgoKSk7bW9kPTEyO3RoaXMubW9udGhzPWdhcD8oKGdhcCsob3JpZW50Km1vZCkpJW1vZCk6KG9yaWVudCptb2QpO3RoaXMubW9udGg9bnVsbDt9XG5pZighdGhpcy51bml0KXt0aGlzLnVuaXQ9XCJkYXlcIjt9XG5pZighdGhpcy52YWx1ZSYmdGhpcy5vcGVyYXRvciYmdGhpcy5vcGVyYXRvciE9PW51bGwmJnRoaXNbdGhpcy51bml0K1wic1wiXSYmdGhpc1t0aGlzLnVuaXQrXCJzXCJdIT09bnVsbCl7dGhpc1t0aGlzLnVuaXQrXCJzXCJdPXRoaXNbdGhpcy51bml0K1wic1wiXSsoKHRoaXMub3BlcmF0b3I9PVwiYWRkXCIpPzE6LTEpKyh0aGlzLnZhbHVlfHwwKSpvcmllbnQ7fWVsc2UgaWYodGhpc1t0aGlzLnVuaXQrXCJzXCJdPT1udWxsfHx0aGlzLm9wZXJhdG9yIT1udWxsKXtpZighdGhpcy52YWx1ZSl7dGhpcy52YWx1ZT0xO31cbnRoaXNbdGhpcy51bml0K1wic1wiXT10aGlzLnZhbHVlKm9yaWVudDt9XG5pZih0aGlzLm1lcmlkaWFuJiZ0aGlzLmhvdXIpe2lmKHRoaXMubWVyaWRpYW49PVwicFwiJiZ0aGlzLmhvdXI8MTIpe3RoaXMuaG91cj10aGlzLmhvdXIrMTI7fWVsc2UgaWYodGhpcy5tZXJpZGlhbj09XCJhXCImJnRoaXMuaG91cj09MTIpe3RoaXMuaG91cj0wO319XG5pZih0aGlzLndlZWtkYXkmJiF0aGlzLmRheSYmIXRoaXMuZGF5cyl7dmFyIHRlbXA9RGF0ZVt0aGlzLndlZWtkYXldKCk7dGhpcy5kYXk9dGVtcC5nZXREYXRlKCk7aWYodGVtcC5nZXRNb250aCgpIT09dG9kYXkuZ2V0TW9udGgoKSl7dGhpcy5tb250aD10ZW1wLmdldE1vbnRoKCk7fX1cbmlmKCh0aGlzLm1vbnRofHx0aGlzLm1vbnRoPT09MCkmJiF0aGlzLmRheSl7dGhpcy5kYXk9MTt9XG5pZighdGhpcy5vcmllbnQmJiF0aGlzLm9wZXJhdG9yJiZ0aGlzLnVuaXQ9PVwid2Vla1wiJiZ0aGlzLnZhbHVlJiYhdGhpcy5kYXkmJiF0aGlzLm1vbnRoKXtyZXR1cm4gRGF0ZS50b2RheSgpLnNldFdlZWsodGhpcy52YWx1ZSk7fVxuaWYoZXhwcmVzc2lvbiYmdGhpcy50aW1lem9uZSYmdGhpcy5kYXkmJnRoaXMuZGF5cyl7dGhpcy5kYXk9dGhpcy5kYXlzO31cbnJldHVybihleHByZXNzaW9uKT90b2RheS5hZGQodGhpcyk6dG9kYXkuc2V0KHRoaXMpO319O3ZhciBfPSRELlBhcnNpbmcuT3BlcmF0b3JzLGc9JEQuR3JhbW1hcix0PSRELlRyYW5zbGF0b3IsX2ZuO2cuZGF0ZVBhcnREZWxpbWl0ZXI9Xy5ydG9rZW4oL14oW1xcc1xcLVxcLlxcLFxcL1xceDI3XSspLyk7Zy50aW1lUGFydERlbGltaXRlcj1fLnN0b2tlbihcIjpcIik7Zy53aGl0ZVNwYWNlPV8ucnRva2VuKC9eXFxzKi8pO2cuZ2VuZXJhbERlbGltaXRlcj1fLnJ0b2tlbigvXigoW1xcc1xcLF18YXR8QHxvbikrKS8pO3ZhciBfQz17fTtnLmN0b2tlbj1mdW5jdGlvbihrZXlzKXt2YXIgZm49X0Nba2V5c107aWYoIWZuKXt2YXIgYz0kQy5yZWdleFBhdHRlcm5zO3ZhciBreD1rZXlzLnNwbGl0KC9cXHMrLykscHg9W107Zm9yKHZhciBpPTA7aTxreC5sZW5ndGg7aSsrKXtweC5wdXNoKF8ucmVwbGFjZShfLnJ0b2tlbihjW2t4W2ldXSksa3hbaV0pKTt9XG5mbj1fQ1trZXlzXT1fLmFueS5hcHBseShudWxsLHB4KTt9XG5yZXR1cm4gZm47fTtnLmN0b2tlbjI9ZnVuY3Rpb24oa2V5KXtyZXR1cm4gXy5ydG9rZW4oJEMucmVnZXhQYXR0ZXJuc1trZXldKTt9O2cuaD1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXigwWzAtOV18MVswLTJdfFsxLTldKS8pLHQuaG91cikpO2cuaGg9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oMFswLTldfDFbMC0yXSkvKSx0LmhvdXIpKTtnLkg9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oWzAtMV1bMC05XXwyWzAtM118WzAtOV0pLyksdC5ob3VyKSk7Zy5ISD1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXihbMC0xXVswLTldfDJbMC0zXSkvKSx0LmhvdXIpKTtnLm09Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oWzAtNV1bMC05XXxbMC05XSkvKSx0Lm1pbnV0ZSkpO2cubW09Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL15bMC01XVswLTldLyksdC5taW51dGUpKTtnLnM9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oWzAtNV1bMC05XXxbMC05XSkvKSx0LnNlY29uZCkpO2cuc3M9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL15bMC01XVswLTldLyksdC5zZWNvbmQpKTtnLmhtcz1fLmNhY2hlKF8uc2VxdWVuY2UoW2cuSCxnLm0sZy5zXSxnLnRpbWVQYXJ0RGVsaW1pdGVyKSk7Zy50PV8uY2FjaGUoXy5wcm9jZXNzKGcuY3Rva2VuMihcInNob3J0TWVyaWRpYW5cIiksdC5tZXJpZGlhbikpO2cudHQ9Xy5jYWNoZShfLnByb2Nlc3MoZy5jdG9rZW4yKFwibG9uZ01lcmlkaWFuXCIpLHQubWVyaWRpYW4pKTtnLno9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oKFxcK3xcXC0pXFxzKlxcZFxcZFxcZFxcZCl8KChcXCt8XFwtKVxcZFxcZFxcOj9cXGRcXGQpLyksdC50aW1lem9uZSkpO2cueno9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oKFxcK3xcXC0pXFxzKlxcZFxcZFxcZFxcZCl8KChcXCt8XFwtKVxcZFxcZFxcOj9cXGRcXGQpLyksdC50aW1lem9uZSkpO2cuenp6PV8uY2FjaGUoXy5wcm9jZXNzKGcuY3Rva2VuMihcInRpbWV6b25lXCIpLHQudGltZXpvbmUpKTtnLnRpbWVTdWZmaXg9Xy5lYWNoKF8uaWdub3JlKGcud2hpdGVTcGFjZSksXy5zZXQoW2cudHQsZy56enpdKSk7Zy50aW1lPV8uZWFjaChfLm9wdGlvbmFsKF8uaWdub3JlKF8uc3Rva2VuKFwiVFwiKSkpLGcuaG1zLGcudGltZVN1ZmZpeCk7Zy5kPV8uY2FjaGUoXy5wcm9jZXNzKF8uZWFjaChfLnJ0b2tlbigvXihbMC0yXVxcZHwzWzAtMV18XFxkKS8pLF8ub3B0aW9uYWwoZy5jdG9rZW4yKFwib3JkaW5hbFN1ZmZpeFwiKSkpLHQuZGF5KSk7Zy5kZD1fLmNhY2hlKF8ucHJvY2VzcyhfLmVhY2goXy5ydG9rZW4oL14oWzAtMl1cXGR8M1swLTFdKS8pLF8ub3B0aW9uYWwoZy5jdG9rZW4yKFwib3JkaW5hbFN1ZmZpeFwiKSkpLHQuZGF5KSk7Zy5kZGQ9Zy5kZGRkPV8uY2FjaGUoXy5wcm9jZXNzKGcuY3Rva2VuKFwic3VuIG1vbiB0dWUgd2VkIHRodSBmcmkgc2F0XCIpLGZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbigpe3RoaXMud2Vla2RheT1zO307fSkpO2cuTT1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXigxWzAtMl18MFxcZHxcXGQpLyksdC5tb250aCkpO2cuTU09Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oMVswLTJdfDBcXGQpLyksdC5tb250aCkpO2cuTU1NPWcuTU1NTT1fLmNhY2hlKF8ucHJvY2VzcyhnLmN0b2tlbihcImphbiBmZWIgbWFyIGFwciBtYXkganVuIGp1bCBhdWcgc2VwIG9jdCBub3YgZGVjXCIpLHQubW9udGgpKTtnLnk9Xy5jYWNoZShfLnByb2Nlc3MoXy5ydG9rZW4oL14oXFxkXFxkPykvKSx0LnllYXIpKTtnLnl5PV8uY2FjaGUoXy5wcm9jZXNzKF8ucnRva2VuKC9eKFxcZFxcZCkvKSx0LnllYXIpKTtnLnl5eT1fLmNhY2hlKF8ucHJvY2VzcyhfLnJ0b2tlbigvXihcXGRcXGQ/XFxkP1xcZD8pLyksdC55ZWFyKSk7Zy55eXl5PV8uY2FjaGUoXy5wcm9jZXNzKF8ucnRva2VuKC9eKFxcZFxcZFxcZFxcZCkvKSx0LnllYXIpKTtfZm49ZnVuY3Rpb24oKXtyZXR1cm4gXy5lYWNoKF8uYW55LmFwcGx5KG51bGwsYXJndW1lbnRzKSxfLm5vdChnLmN0b2tlbjIoXCJ0aW1lQ29udGV4dFwiKSkpO307Zy5kYXk9X2ZuKGcuZCxnLmRkKTtnLm1vbnRoPV9mbihnLk0sZy5NTU0pO2cueWVhcj1fZm4oZy55eXl5LGcueXkpO2cub3JpZW50YXRpb249Xy5wcm9jZXNzKGcuY3Rva2VuKFwicGFzdCBmdXR1cmVcIiksZnVuY3Rpb24ocyl7cmV0dXJuIGZ1bmN0aW9uKCl7dGhpcy5vcmllbnQ9czt9O30pO2cub3BlcmF0b3I9Xy5wcm9jZXNzKGcuY3Rva2VuKFwiYWRkIHN1YnRyYWN0XCIpLGZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbigpe3RoaXMub3BlcmF0b3I9czt9O30pO2cucmRheT1fLnByb2Nlc3MoZy5jdG9rZW4oXCJ5ZXN0ZXJkYXkgdG9tb3Jyb3cgdG9kYXkgbm93XCIpLHQucmRheSk7Zy51bml0PV8ucHJvY2VzcyhnLmN0b2tlbihcInNlY29uZCBtaW51dGUgaG91ciBkYXkgd2VlayBtb250aCB5ZWFyXCIpLGZ1bmN0aW9uKHMpe3JldHVybiBmdW5jdGlvbigpe3RoaXMudW5pdD1zO307fSk7Zy52YWx1ZT1fLnByb2Nlc3MoXy5ydG9rZW4oL15cXGRcXGQ/KHN0fG5kfHJkfHRoKT8vKSxmdW5jdGlvbihzKXtyZXR1cm4gZnVuY3Rpb24oKXt0aGlzLnZhbHVlPXMucmVwbGFjZSgvXFxEL2csXCJcIik7fTt9KTtnLmV4cHJlc3Npb249Xy5zZXQoW2cucmRheSxnLm9wZXJhdG9yLGcudmFsdWUsZy51bml0LGcub3JpZW50YXRpb24sZy5kZGQsZy5NTU1dKTtfZm49ZnVuY3Rpb24oKXtyZXR1cm4gXy5zZXQoYXJndW1lbnRzLGcuZGF0ZVBhcnREZWxpbWl0ZXIpO307Zy5tZHk9X2ZuKGcuZGRkLGcubW9udGgsZy5kYXksZy55ZWFyKTtnLnltZD1fZm4oZy5kZGQsZy55ZWFyLGcubW9udGgsZy5kYXkpO2cuZG15PV9mbihnLmRkZCxnLmRheSxnLm1vbnRoLGcueWVhcik7Zy5kYXRlPWZ1bmN0aW9uKHMpe3JldHVybigoZ1skQy5kYXRlRWxlbWVudE9yZGVyXXx8Zy5tZHkpLmNhbGwodGhpcyxzKSk7fTtnLmZvcm1hdD1fLnByb2Nlc3MoXy5tYW55KF8uYW55KF8ucHJvY2VzcyhfLnJ0b2tlbigvXihkZD9kP2Q/fE1NP00/TT98eXk/eT95P3xoaD98SEg/fG1tP3xzcz98dHQ/fHp6P3o/KS8pLGZ1bmN0aW9uKGZtdCl7aWYoZ1tmbXRdKXtyZXR1cm4gZ1tmbXRdO31lbHNle3Rocm93ICRELlBhcnNpbmcuRXhjZXB0aW9uKGZtdCk7fX0pLF8ucHJvY2VzcyhfLnJ0b2tlbigvXlteZE15aEhtc3R6XSsvKSxmdW5jdGlvbihzKXtyZXR1cm4gXy5pZ25vcmUoXy5zdG9rZW4ocykpO30pKSksZnVuY3Rpb24ocnVsZXMpe3JldHVybiBfLnByb2Nlc3MoXy5lYWNoLmFwcGx5KG51bGwscnVsZXMpLHQuZmluaXNoRXhhY3QpO30pO3ZhciBfRj17fTt2YXIgX2dldD1mdW5jdGlvbihmKXtyZXR1cm4gX0ZbZl09KF9GW2ZdfHxnLmZvcm1hdChmKVswXSk7fTtnLmZvcm1hdHM9ZnVuY3Rpb24oZngpe2lmKGZ4IGluc3RhbmNlb2YgQXJyYXkpe3ZhciByeD1bXTtmb3IodmFyIGk9MDtpPGZ4Lmxlbmd0aDtpKyspe3J4LnB1c2goX2dldChmeFtpXSkpO31cbnJldHVybiBfLmFueS5hcHBseShudWxsLHJ4KTt9ZWxzZXtyZXR1cm4gX2dldChmeCk7fX07Zy5fZm9ybWF0cz1nLmZvcm1hdHMoW1wiXFxcInl5eXktTU0tZGRUSEg6bW06c3NaXFxcIlwiLFwieXl5eS1NTS1kZFRISDptbTpzc1pcIixcInl5eXktTU0tZGRUSEg6bW06c3N6XCIsXCJ5eXl5LU1NLWRkVEhIOm1tOnNzXCIsXCJ5eXl5LU1NLWRkVEhIOm1tWlwiLFwieXl5eS1NTS1kZFRISDptbXpcIixcInl5eXktTU0tZGRUSEg6bW1cIixcImRkZCwgTU1NIGRkLCB5eXl5IEg6bW06c3MgdHRcIixcImRkZCBNTU0gZCB5eXl5IEhIOm1tOnNzIHp6elwiLFwiTU1kZHl5eXlcIixcImRkTU15eXl5XCIsXCJNZGR5eXl5XCIsXCJkZE15eXl5XCIsXCJNZHl5eXlcIixcImRNeXl5eVwiLFwieXl5eVwiLFwiTWR5eVwiLFwiZE15eVwiLFwiZFwiXSk7Zy5fc3RhcnQ9Xy5wcm9jZXNzKF8uc2V0KFtnLmRhdGUsZy50aW1lLGcuZXhwcmVzc2lvbl0sZy5nZW5lcmFsRGVsaW1pdGVyLGcud2hpdGVTcGFjZSksdC5maW5pc2gpO2cuc3RhcnQ9ZnVuY3Rpb24ocyl7dHJ5e3ZhciByPWcuX2Zvcm1hdHMuY2FsbCh7fSxzKTtpZihyWzFdLmxlbmd0aD09PTApe3JldHVybiByO319Y2F0Y2goZSl7fVxucmV0dXJuIGcuX3N0YXJ0LmNhbGwoe30scyk7fTskRC5fcGFyc2U9JEQucGFyc2U7JEQucGFyc2U9ZnVuY3Rpb24ocyl7dmFyIHI9bnVsbDtpZighcyl7cmV0dXJuIG51bGw7fVxuaWYocyBpbnN0YW5jZW9mIERhdGUpe3JldHVybiBzO31cbnRyeXtyPSRELkdyYW1tYXIuc3RhcnQuY2FsbCh7fSxzLnJlcGxhY2UoL15cXHMqKFxcUyooXFxzK1xcUyspKilcXHMqJC8sXCIkMVwiKSk7fWNhdGNoKGUpe3JldHVybiBudWxsO31cbnJldHVybigoclsxXS5sZW5ndGg9PT0wKT9yWzBdOm51bGwpO307JEQuZ2V0UGFyc2VGdW5jdGlvbj1mdW5jdGlvbihmeCl7dmFyIGZuPSRELkdyYW1tYXIuZm9ybWF0cyhmeCk7cmV0dXJuIGZ1bmN0aW9uKHMpe3ZhciByPW51bGw7dHJ5e3I9Zm4uY2FsbCh7fSxzKTt9Y2F0Y2goZSl7cmV0dXJuIG51bGw7fVxucmV0dXJuKChyWzFdLmxlbmd0aD09PTApP3JbMF06bnVsbCk7fTt9OyRELnBhcnNlRXhhY3Q9ZnVuY3Rpb24ocyxmeCl7cmV0dXJuICRELmdldFBhcnNlRnVuY3Rpb24oZngpKHMpO307fSgpKTtcclxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNyeXB0ID0gcmVxdWlyZSgnY3J5cHQnKSxcclxuICAgICAgdXRmOCA9IHJlcXVpcmUoJ2NoYXJlbmMnKS51dGY4LFxyXG4gICAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpLFxyXG4gICAgICBiaW4gPSByZXF1aXJlKCdjaGFyZW5jJykuYmluLFxyXG5cclxuICAvLyBUaGUgY29yZVxyXG4gIG1kNSA9IGZ1bmN0aW9uIChtZXNzYWdlLCBvcHRpb25zKSB7XHJcbiAgICAvLyBDb252ZXJ0IHRvIGJ5dGUgYXJyYXlcclxuICAgIGlmIChtZXNzYWdlLmNvbnN0cnVjdG9yID09IFN0cmluZylcclxuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmNvZGluZyA9PT0gJ2JpbmFyeScpXHJcbiAgICAgICAgbWVzc2FnZSA9IGJpbi5zdHJpbmdUb0J5dGVzKG1lc3NhZ2UpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbWVzc2FnZSA9IHV0Zjguc3RyaW5nVG9CeXRlcyhtZXNzYWdlKTtcclxuICAgIGVsc2UgaWYgKGlzQnVmZmVyKG1lc3NhZ2UpKVxyXG4gICAgICBtZXNzYWdlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWVzc2FnZSwgMCk7XHJcbiAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShtZXNzYWdlKSlcclxuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UudG9TdHJpbmcoKTtcclxuICAgIC8vIGVsc2UsIGFzc3VtZSBieXRlIGFycmF5IGFscmVhZHlcclxuXHJcbiAgICB2YXIgbSA9IGNyeXB0LmJ5dGVzVG9Xb3JkcyhtZXNzYWdlKSxcclxuICAgICAgICBsID0gbWVzc2FnZS5sZW5ndGggKiA4LFxyXG4gICAgICAgIGEgPSAgMTczMjU4NDE5MyxcclxuICAgICAgICBiID0gLTI3MTczMzg3OSxcclxuICAgICAgICBjID0gLTE3MzI1ODQxOTQsXHJcbiAgICAgICAgZCA9ICAyNzE3MzM4Nzg7XHJcblxyXG4gICAgLy8gU3dhcCBlbmRpYW5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBtW2ldID0gKChtW2ldIDw8ICA4KSB8IChtW2ldID4+PiAyNCkpICYgMHgwMEZGMDBGRiB8XHJcbiAgICAgICAgICAgICAoKG1baV0gPDwgMjQpIHwgKG1baV0gPj4+ICA4KSkgJiAweEZGMDBGRjAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBhZGRpbmdcclxuICAgIG1bbCA+Pj4gNV0gfD0gMHg4MCA8PCAobCAlIDMyKTtcclxuICAgIG1bKCgobCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsO1xyXG5cclxuICAgIC8vIE1ldGhvZCBzaG9ydGN1dHNcclxuICAgIHZhciBGRiA9IG1kNS5fZmYsXHJcbiAgICAgICAgR0cgPSBtZDUuX2dnLFxyXG4gICAgICAgIEhIID0gbWQ1Ll9oaCxcclxuICAgICAgICBJSSA9IG1kNS5faWk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xyXG5cclxuICAgICAgdmFyIGFhID0gYSxcclxuICAgICAgICAgIGJiID0gYixcclxuICAgICAgICAgIGNjID0gYyxcclxuICAgICAgICAgIGRkID0gZDtcclxuXHJcbiAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBtW2krIDBdLCAgNywgLTY4MDg3NjkzNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDFdLCAxMiwgLTM4OTU2NDU4Nik7XHJcbiAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBtW2krIDJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKyA0XSwgIDcsIC0xNzY0MTg4OTcpO1xyXG4gICAgICBkID0gRkYoZCwgYSwgYiwgYywgbVtpKyA1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIG1baSsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krIDddLCAyMiwgLTQ1NzA1OTgzKTtcclxuICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIG1baSsgOF0sICA3LCAgMTc3MDAzNTQxNik7XHJcbiAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBtW2krIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTcsIC00MjA2Myk7XHJcbiAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBtW2krMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG4gICAgICBhID0gRkYoYSwgYiwgYywgZCwgbVtpKzEyXSwgIDcsICAxODA0NjAzNjgyKTtcclxuICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIG1baSsxM10sIDEyLCAtNDAzNDExMDEpO1xyXG4gICAgICBjID0gRkYoYywgZCwgYSwgYiwgbVtpKzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIG1baSsxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XHJcblxyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyAxXSwgIDUsIC0xNjU3OTY1MTApO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyA2XSwgIDksIC0xMDY5NTAxNjMyKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgMF0sIDIwLCAtMzczODk3MzAyKTtcclxuICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIG1baSsgNV0sICA1LCAtNzAxNTU4NjkxKTtcclxuICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIG1baSsxMF0sICA5LCAgMzgwMTYwODMpO1xyXG4gICAgICBjID0gR0coYywgZCwgYSwgYiwgbVtpKzE1XSwgMTQsIC02NjA0NzgzMzUpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG4gICAgICBhID0gR0coYSwgYiwgYywgZCwgbVtpKyA5XSwgIDUsICA1Njg0NDY0MzgpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKzE0XSwgIDksIC0xMDE5ODAzNjkwKTtcclxuICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIG1baSsgM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIG1baSsgOF0sIDIwLCAgMTE2MzUzMTUwMSk7XHJcbiAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBtW2krMTNdLCAgNSwgLTE0NDQ2ODE0NjcpO1xyXG4gICAgICBkID0gR0coZCwgYSwgYiwgYywgbVtpKyAyXSwgIDksIC01MTQwMzc4NCk7XHJcbiAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBtW2krIDddLCAxNCwgIDE3MzUzMjg0NzMpO1xyXG4gICAgICBiID0gR0coYiwgYywgZCwgYSwgbVtpKzEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcclxuXHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDVdLCAgNCwgLTM3ODU1OCk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKzExXSwgMTYsICAxODM5MDMwNTYyKTtcclxuICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIG1baSsxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKyAxXSwgIDQsIC0xNTMwOTkyMDYwKTtcclxuICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIG1baSsgNF0sIDExLCAgMTI3Mjg5MzM1Myk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krIDddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG4gICAgICBhID0gSEgoYSwgYiwgYywgZCwgbVtpKzEzXSwgIDQsICA2ODEyNzkxNzQpO1xyXG4gICAgICBkID0gSEgoZCwgYSwgYiwgYywgbVtpKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG4gICAgICBjID0gSEgoYywgZCwgYSwgYiwgbVtpKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xyXG4gICAgICBiID0gSEgoYiwgYywgZCwgYSwgbVtpKyA2XSwgMjMsICA3NjAyOTE4OSk7XHJcbiAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBtW2krIDldLCAgNCwgLTY0MDM2NDQ4Nyk7XHJcbiAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBtW2krMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbiAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBtW2krMTVdLCAxNiwgIDUzMDc0MjUyMCk7XHJcbiAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBtW2krIDJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG4gICAgICBhID0gSUkoYSwgYiwgYywgZCwgbVtpKyAwXSwgIDYsIC0xOTg2MzA4NDQpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKyA3XSwgMTAsICAxMTI2ODkxNDE1KTtcclxuICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIG1baSsxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDVdLCAyMSwgLTU3NDM0MDU1KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsxMl0sICA2LCAgMTcwMDQ4NTU3MSk7XHJcbiAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBtW2krIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG4gICAgICBjID0gSUkoYywgZCwgYSwgYiwgbVtpKzEwXSwgMTUsIC0xMDUxNTIzKTtcclxuICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIG1baSsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XHJcbiAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBtW2krIDhdLCAgNiwgIDE4NzMzMTMzNTkpO1xyXG4gICAgICBkID0gSUkoZCwgYSwgYiwgYywgbVtpKzE1XSwgMTAsIC0zMDYxMTc0NCk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDZdLCAxNSwgLTE1NjAxOTgzODApO1xyXG4gICAgICBiID0gSUkoYiwgYywgZCwgYSwgbVtpKzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIG1baSsgNF0sICA2LCAtMTQ1NTIzMDcwKTtcclxuICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIG1baSsxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XHJcbiAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBtW2krIDJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbiAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBtW2krIDldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG4gICAgICBhID0gKGEgKyBhYSkgPj4+IDA7XHJcbiAgICAgIGIgPSAoYiArIGJiKSA+Pj4gMDtcclxuICAgICAgYyA9IChjICsgY2MpID4+PiAwO1xyXG4gICAgICBkID0gKGQgKyBkZCkgPj4+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNyeXB0LmVuZGlhbihbYSwgYiwgYywgZF0pO1xyXG4gIH07XHJcblxyXG4gIC8vIEF1eGlsaWFyeSBmdW5jdGlvbnNcclxuICBtZDUuX2ZmICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGMgfCB+YiAmIGQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2dnICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiAmIGQgfCBjICYgfmQpICsgKHggPj4+IDApICsgdDtcclxuICAgIHJldHVybiAoKG4gPDwgcykgfCAobiA+Pj4gKDMyIC0gcykpKSArIGI7XHJcbiAgfTtcclxuICBtZDUuX2hoICA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbiAgICB2YXIgbiA9IGEgKyAoYiBeIGMgXiBkKSArICh4ID4+PiAwKSArIHQ7XHJcbiAgICByZXR1cm4gKChuIDw8IHMpIHwgKG4gPj4+ICgzMiAtIHMpKSkgKyBiO1xyXG4gIH07XHJcbiAgbWQ1Ll9paSAgPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG4gICAgdmFyIG4gPSBhICsgKGMgXiAoYiB8IH5kKSkgKyAoeCA+Pj4gMCkgKyB0O1xyXG4gICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcclxuICB9O1xyXG5cclxuICAvLyBQYWNrYWdlIHByaXZhdGUgYmxvY2tzaXplXHJcbiAgbWQ1Ll9ibG9ja3NpemUgPSAxNjtcclxuICBtZDUuX2RpZ2VzdHNpemUgPSAxNjtcclxuXHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWVzc2FnZSwgb3B0aW9ucykge1xyXG4gICAgaWYgKG1lc3NhZ2UgPT09IHVuZGVmaW5lZCB8fCBtZXNzYWdlID09PSBudWxsKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lsbGVnYWwgYXJndW1lbnQgJyArIG1lc3NhZ2UpO1xyXG5cclxuICAgIHZhciBkaWdlc3RieXRlcyA9IGNyeXB0LndvcmRzVG9CeXRlcyhtZDUobWVzc2FnZSwgb3B0aW9ucykpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgb3B0aW9ucy5hc0J5dGVzID8gZGlnZXN0Ynl0ZXMgOlxyXG4gICAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5hc1N0cmluZyA/IGJpbi5ieXRlc1RvU3RyaW5nKGRpZ2VzdGJ5dGVzKSA6XHJcbiAgICAgICAgY3J5cHQuYnl0ZXNUb0hleChkaWdlc3RieXRlcyk7XHJcbiAgfTtcclxuXHJcbn0pKCk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG4vKipcclxuICogRGVwZW5kcyBvbiBFeHBlbnNlcyB0byBwYXJzZSB0aGVtXHJcbiAqIGFuZCByZXRyaWV2ZSB0aGUgdG90YWwgdmFsdWVzIGZvciBlYWNoIGNhdGVnb3J5XHJcbiAqL1xyXG52YXIgQ2F0ZWdvcnlDb2xsZWN0aW9uID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhDYXRlZ29yeUNvbGxlY3Rpb24sIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBDYXRlZ29yeUNvbGxlY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcnlDb3VudCA9IFtdO1xyXG4gICAgfVxyXG4gICAgQ2F0ZWdvcnlDb2xsZWN0aW9uLnByb3RvdHlwZS5zZXRFeHBlbnNlcyA9IGZ1bmN0aW9uIChleCkge1xyXG4gICAgICAgIHRoaXMuZXhwZW5zZXMgPSBleDtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuZXhwZW5zZXMsIFwiY2hhbmdlXCIsIHRoaXMuY2hhbmdlKTtcclxuICAgIH07XHJcbiAgICBDYXRlZ29yeUNvbGxlY3Rpb24ucHJvdG90eXBlLmdldENhdGVnb3JpZXNGcm9tRXhwZW5zZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmNhdGVnb3J5Q291bnQgPSBbXTtcclxuICAgICAgICB0aGlzLmV4cGVuc2VzLmVhY2goZnVuY3Rpb24gKHRyYW5zYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBjYXRlZ29yeU5hbWUgPSB0cmFuc2FjdGlvbi5nZXQoJ2NhdGVnb3J5Jyk7XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmluY3JlbWVudENhdGVnb3J5RGF0YShjYXRlZ29yeU5hbWUsIHRyYW5zYWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5jYXRlZ29yeUNvdW50KTtcclxuICAgIH07XHJcbiAgICBDYXRlZ29yeUNvbGxlY3Rpb24ucHJvdG90eXBlLmluY3JlbWVudENhdGVnb3J5RGF0YSA9IGZ1bmN0aW9uIChjYXRlZ29yeU5hbWUsIHRyYW5zYWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGV4aXN0cyA9IF8uZmluZFdoZXJlKHRoaXMuY2F0ZWdvcnlDb3VudCwgeyBjYXROYW1lOiBjYXRlZ29yeU5hbWUgfSk7XHJcbiAgICAgICAgaWYgKGV4aXN0cykge1xyXG4gICAgICAgICAgICBleGlzdHMuY291bnQrKztcclxuICAgICAgICAgICAgZXhpc3RzLmFtb3VudCArPSB0cmFuc2FjdGlvbi5nZXQoJ2Ftb3VudCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXRlZ29yeUNvdW50LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgY2F0TmFtZTogY2F0ZWdvcnlOYW1lLFxyXG4gICAgICAgICAgICAgICAgY291bnQ6IDAsXHJcbiAgICAgICAgICAgICAgICBhbW91bnQ6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIENhdGVnb3J5Q29sbGVjdGlvbi5wcm90b3R5cGUuY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDYXRlZ29yeUNvbGxlY3Rpb24uY2hhbmdlJyk7XHJcbiAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzRnJvbUV4cGVuc2VzKCk7XHJcbiAgICB9O1xyXG4gICAgQ2F0ZWdvcnlDb2xsZWN0aW9uLnByb3RvdHlwZS5nZXRDYXRlZ29yeUNvdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jYXRlZ29yeUNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2F0ZWdvcmllc0Zyb21FeHBlbnNlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jYXRlZ29yeUNvdW50O1xyXG4gICAgfTtcclxuICAgIENhdGVnb3J5Q29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2F0ZWdvcnlDb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzLmdldENhdGVnb3JpZXNGcm9tRXhwZW5zZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmNhdGVnb3J5Q291bnQuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKHZhbHVlLmNhdE5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBDYXRlZ29yeUNvbGxlY3Rpb247XHJcbn0oQmFja2JvbmUuQ29sbGVjdGlvbikpO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENhdGVnb3J5Q29sbGVjdGlvbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Q2F0ZWdvcnlDb2xsZWN0aW9uLmpzLm1hcCIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9iYWNrYm9uZS10eXBpbmdzL2JhY2tib25lLmQudHNcIi8+XHJcblwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgQ2F0ZWdvcnlWaWV3ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhDYXRlZ29yeVZpZXcsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBDYXRlZ29yeVZpZXcob3B0aW9ucykge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfLnRlbXBsYXRlKCQoJyNjYXRlZ29yeVRlbXBsYXRlJykuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnQoJCgnI2NhdGVnb3JpZXMnKSk7XHJcbiAgICB9XHJcbiAgICBDYXRlZ29yeVZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gW107XHJcbiAgICAgICAgdmFyIGNhdGVnb3J5Q291bnQgPSB0aGlzLm1vZGVsLmdldENhdGVnb3J5Q291bnQoKTtcclxuICAgICAgICB2YXIgc3VtID0gXy5yZWR1Y2UoY2F0ZWdvcnlDb3VudCwgZnVuY3Rpb24gKG1lbW8sIGl0ZW0pIHtcclxuICAgICAgICAgICAgLy8gb25seSBleHBlbnNlc1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5jYXROYW1lICE9ICdEZWZhdWx0Jykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lbW8gKyBpdGVtLmFtb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtZW1vO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc3VtJywgc3VtKTtcclxuICAgICAgICBjYXRlZ29yeUNvdW50ID0gXy5zb3J0QnkoY2F0ZWdvcnlDb3VudCwgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhlbC5hbW91bnQpO1xyXG4gICAgICAgIH0pLnJldmVyc2UoKTtcclxuICAgICAgICBfLmVhY2goY2F0ZWdvcnlDb3VudCwgZnVuY3Rpb24gKGNhdENvdW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjYXRDb3VudC5jYXROYW1lICE9ICdEZWZhdWx0Jykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gTWF0aC5yb3VuZCgxMDAgKiBNYXRoLmFicyhjYXRDb3VudC5hbW91bnQpIC8gTWF0aC5hYnMoc3VtKSkgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNhdENvdW50LmNhdE5hbWUsIHdpZHRoLCBjYXRDb3VudC5jb3VudCwgY2F0Q291bnQuYW1vdW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQucHVzaChfdGhpcy50ZW1wbGF0ZShfLmV4dGVuZChjYXRDb3VudCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IE1hdGgucm91bmQoY2F0Q291bnQuYW1vdW50KVxyXG4gICAgICAgICAgICAgICAgfSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuJGVsLmh0bWwoY29udGVudC5qb2luKCdcXG4nKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgQ2F0ZWdvcnlWaWV3LnByb3RvdHlwZS5jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0NhdGVnb3J5VmlldyBjaGFuZ2VkJywgdGhpcy5tb2RlbCk7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnQ2FsbGluZyBDYXRlZ29yeUNvbGxlY3Rpb24uY2hhbmdlKCknKTtcclxuICAgICAgICAgICAgLy90aGlzLm1vZGVsLmNoYW5nZSgpO1x0Ly8gY2FsbGVkIGF1dG9tYWdpY2FsbHlcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCByZW5kZXJpbmcgc2luY2UgdGhpcy5tb2RlbCBpcyB1bmRlZmluZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENhdGVnb3J5VmlldztcclxufShCYWNrYm9uZS5WaWV3KSk7XHJcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XHJcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ2F0ZWdvcnlWaWV3O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DYXRlZ29yeVZpZXcuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBFeHBlbnNlVGFibGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEV4cGVuc2VUYWJsZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEV4cGVuc2VUYWJsZShvcHRpb25zKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3Jvd1RlbXBsYXRlJykuaHRtbCgpKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnQoJCgnI2V4cGVuc2VUYWJsZScpKTtcclxuICAgICAgICAvLyBzbG93IHJlLXJlbmRlcmluZyBvZiB0aGUgd2hvbGUgdGFibGUgd2hlbiBtb2RlbCBjaGFuZ2VzXHJcbiAgICAgICAgLy90aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdjaGFuZ2UnLCB0aGlzLnJlbmRlcik7XHJcbiAgICB9XHJcbiAgICBFeHBlbnNlVGFibGUucHJvdG90eXBlLnNldENhdGVnb3J5TGlzdCA9IGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeUxpc3QgPSBsaXN0O1xyXG4gICAgfTtcclxuICAgIEV4cGVuc2VUYWJsZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubm9SZW5kZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0V4cGVuc2VUYWJsZS5ub1JlbmRlcicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdFeHBlbnNlVGFibGUucmVuZGVyKCknLCB0aGlzLm1vZGVsLnNpemUoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5tb2RlbCk7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICB0aGlzLm1vZGVsLmVhY2goZnVuY3Rpb24gKHRyYW5zYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codHJhbnNhY3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRyYW5zYWN0aW9uLnRvSlNPTigpO1xyXG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlcy52aXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnNEYXRlID0gYXR0cmlidXRlcy5kYXRlLnRvU3RyaW5nKCd5eXl5LU1NLWRkJyk7XHJcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goX3RoaXMudGVtcGxhdGUoYXR0cmlidXRlcykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlbmRlcmluZycsIHJvd3MubGVuZ3RoLCAncm93cycpO1xyXG4gICAgICAgIHRoaXMuJGVsLmh0bWwocm93cy5qb2luKCdcXG4nKSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLiRlbCk7XHJcbiAgICAgICAgJCgnI2RhdGVGcm9tJykuaHRtbCh0aGlzLm1vZGVsLmdldERhdGVGcm9tKCkudG9TdHJpbmcoJ3l5eXktTU0tZGQnKSk7XHJcbiAgICAgICAgJCgnI2RhdGVUaWxsJykuaHRtbCh0aGlzLm1vZGVsLmdldERhdGVUaWxsKCkudG9TdHJpbmcoJ3l5eXktTU0tZGQnKSk7XHJcbiAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrJywgJ3NlbGVjdCcsIHRoaXMub3BlblNlbGVjdC5iaW5kKHRoaXMpKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBFeHBlbnNlVGFibGUucHJvdG90eXBlLm9wZW5TZWxlY3QgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdvcGVuU2VsZWN0JywgdGhpcywgZXZlbnQpO1xyXG4gICAgICAgIHZhciAkc2VsZWN0ID0gJChldmVudC50YXJnZXQpO1xyXG4gICAgICAgIGlmICgkc2VsZWN0LmZpbmQoJ29wdGlvbicpLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZWYWxfMSA9ICRzZWxlY3QuZmluZCgnb3B0aW9uJykuaHRtbCgpO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuY2F0ZWdvcnlMaXN0LmdldE9wdGlvbnMoKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvcHRpb25zKTtcclxuICAgICAgICAgICAgJC5lYWNoKG9wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT0gZGVmVmFsXzEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJChcIjxvcHRpb24+PC9vcHRpb24+XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwidmFsdWVcIiwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KHZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2VsZWN0Lm9uKCdjaGFuZ2UnLCB0aGlzLm5ld0NhdGVnb3J5LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBFeHBlbnNlVGFibGUucHJvdG90eXBlLm5ld0NhdGVnb3J5ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudCk7XHJcbiAgICAgICAgdmFyICRzZWxlY3QgPSAkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2VsZWN0ZWQnLCAkc2VsZWN0LnZhbCgpKTtcclxuICAgICAgICB2YXIgaWQgPSAkc2VsZWN0LmNsb3Nlc3QoJ3RyJykuYXR0cignZGF0YS1pZCcpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgIHZhciB0cmFuc2FjdGlvbiA9IHRoaXMubW9kZWwuZ2V0KGlkKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRyYW5zYWN0aW9uKTtcclxuICAgICAgICBpZiAodHJhbnNhY3Rpb24pIHtcclxuICAgICAgICAgICAgdHJhbnNhY3Rpb24uc2V0Q2F0ZWdvcnkoJHNlbGVjdC52YWwoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBFeHBlbnNlVGFibGU7XHJcbn0oQmFja2JvbmUuVmlldykpO1xyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV4cGVuc2VUYWJsZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RXhwZW5zZVRhYmxlLmpzLm1hcCIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2JhY2tib25lLXR5cGluZ3MvYmFja2JvbmUuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ1bXNhZXR6ZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJQYXBhLmQudHNcIiAvPlxyXG5cInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcclxudmFyIHVtc2FldHplXzEgPSByZXF1aXJlKCcuL3Vtc2FldHplJyk7XHJcbnZhciBUcmFuc2FjdGlvbl8xID0gcmVxdWlyZSgnLi9UcmFuc2FjdGlvbicpO1xyXG5yZXF1aXJlKCdkYXRlanMnKTtcclxudmFyIEV4cGVuc2VzID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhFeHBlbnNlcywgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEV4cGVuc2VzKCkge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5tb2RlbCA9IFRyYW5zYWN0aW9uXzFbXCJkZWZhdWx0XCJdO1xyXG4gICAgICAgIHRoaXMuY3N2VXJsID0gJy4uL3Vtc2FldHplLTEwOTA3MjktMjAxNi0wNy0yNy0wMC0xMS0yOS5jYXQuY3N2JztcclxuICAgICAgICB0aGlzLnNsb3dVcGRhdGVMb2FkaW5nQmFyID0gXy50aHJvdHRsZSh0aGlzLnVwZGF0ZUxvYWRpbmdCYXIsIDEyOCk7XHJcbiAgICB9XHJcbiAgICBFeHBlbnNlcy5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NzdlVybCcsIHRoaXMuY3N2VXJsKTtcclxuICAgICAgICB0aGlzLnN0YXJ0TG9hZGluZygpO1xyXG4gICAgICAgIHJldHVybiAkLmdldCh0aGlzLmNzdlVybCwgZnVuY3Rpb24gKHJlc3BvbnNlLCB4aHIpIHtcclxuICAgICAgICAgICAgdmFyIGNzdiA9IFBhcGEucGFyc2UocmVzcG9uc2UsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGR5bmFtaWNUeXBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBza2lwRW1wdHlMaW5lczogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjc3YpO1xyXG4gICAgICAgICAgICBpZiAoZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChjc3YuZGF0YSwgX3RoaXMucHJvY2Vzc1Jvdy5iaW5kKF90aGlzKSk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5wcm9jZXNzRG9uZShjc3YuZGF0YS5sZW5ndGgsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMucHJldlBlcmNlbnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdW1zYWV0emVfMS5hc3luY0xvb3AoY3N2LmRhdGEsIF90aGlzLnByb2Nlc3NSb3cuYmluZChfdGhpcyksIF90aGlzLnByb2Nlc3NEb25lLmJpbmQoX3RoaXMsIG9wdGlvbnMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIEV4cGVuc2VzLnByb3RvdHlwZS5wcm9jZXNzUm93ID0gZnVuY3Rpb24gKHJvdywgaSwgbGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5zbG93VXBkYXRlTG9hZGluZ0JhcihpLCBsZW5ndGgpO1xyXG4gICAgICAgIGlmIChyb3cgJiYgcm93LmFtb3VudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZChuZXcgVHJhbnNhY3Rpb25fMVtcImRlZmF1bHRcIl0ocm93KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vdGhpcy50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuICAgIH07XHJcbiAgICBFeHBlbnNlcy5wcm90b3R5cGUudXBkYXRlTG9hZGluZ0JhciA9IGZ1bmN0aW9uIChpLCBsZW5ndGgpIHtcclxuICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGgucm91bmQoMTAwICogaSAvIGxlbmd0aCk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRlTG9hZGluZ0JhcicsIGksIHBlcmNlbnQpO1xyXG4gICAgICAgIGlmIChwZXJjZW50ICE9IHRoaXMucHJldlBlcmNlbnQpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhwZXJjZW50KTtcclxuICAgICAgICAgICAgJCgnLnByb2dyZXNzI2xvYWRpbmdCYXIgLnByb2dyZXNzLWJhcicpLndpZHRoKHBlcmNlbnQgKyAnJScpO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZQZXJjZW50ID0gcGVyY2VudDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLnByb2Nlc3NEb25lID0gZnVuY3Rpb24gKGNvdW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2FzeW5jTG9vcCBmaW5pc2hlZCcsIGNvdW50KTtcclxuICAgICAgICBpZiAob3B0aW9ucy5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuc3VjY2Vzcy5jYWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUcmlnZ2VyIGNoYW5nZSBvbiBFeHBlbnNlcycpO1xyXG4gICAgICAgIHRoaXMuc3RvcExvYWRpbmcoKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfTtcclxuICAgIEV4cGVuc2VzLnByb3RvdHlwZS5zdGFydExvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0TG9hZGluZycpO1xyXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI2xvYWRpbmdCYXJUZW1wbGF0ZScpLmh0bWwoKSk7XHJcbiAgICAgICAgJCgnI2FwcCcpLmh0bWwodGVtcGxhdGUoKSk7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLnN0b3BMb2FkaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdG9wTG9hZGluZycpO1xyXG4gICAgICAgICQoJyNhcHAnKS5odG1sKCdEb25lJyk7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLmdldERhdGVGcm9tID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtaW4gPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHJvdy5nZXQoJ2RhdGUnKS52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIGlmIChkYXRlIDwgbWluKSB7XHJcbiAgICAgICAgICAgICAgICBtaW4gPSBkYXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG1pbik7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLmdldERhdGVUaWxsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtaW4gPSBuZXcgRGF0ZSgnMTk3MC0wMS0wMScpLnZhbHVlT2YoKTtcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKHJvdykge1xyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHJvdy5nZXQoJ2RhdGUnKS52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIGlmIChkYXRlID4gbWluKSB7XHJcbiAgICAgICAgICAgICAgICBtaW4gPSBkYXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKG1pbik7XHJcbiAgICB9O1xyXG4gICAgRXhwZW5zZXMucHJvdG90eXBlLmZpbHRlclZpc2libGUgPSBmdW5jdGlvbiAocSkge1xyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgICAgICAgIGlmIChyb3cuZ2V0KCdub3RlJykuaW5kZXhPZihxKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgcm93LnNldCgndmlzaWJsZScsIGZhbHNlLCB7IG5vUmVuZGVyOiB0cnVlLCBzaWxlbnQ6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByb3cuc2V0KCd2aXNpYmxlJywgdHJ1ZSwgeyBub1JlbmRlcjogdHJ1ZSwgc2lsZW50OiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEV4cGVuc2VzO1xyXG59KEJhY2tib25lLkNvbGxlY3Rpb24pKTtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeHBlbnNlcztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RXhwZW5zZXMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL2JhY2tib25lLXR5cGluZ3MvYmFja2JvbmUuZC50c1wiLz5cclxudmFyIG1kNSA9IHJlcXVpcmUoJ21kNScpO1xyXG52YXIgVHJhbnNhY3Rpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFRyYW5zYWN0aW9uLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gVHJhbnNhY3Rpb24oYXR0cmlidXRlcywgb3B0aW9ucykge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGF0dHJpYnV0ZXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc2V0KCdpZCcsIG1kNSh0aGlzLmdldCgnZGF0ZScpICsgdGhpcy5nZXQoJ2Ftb3VudCcpKSk7XHJcbiAgICAgICAgLy8gbnVtYmVyXHJcbiAgICAgICAgdGhpcy5zZXQoJ2Ftb3VudCcsIHBhcnNlRmxvYXQodGhpcy5nZXQoJ2Ftb3VudCcpKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ2RhdGUnLCBuZXcgRGF0ZShEYXRlLnBhcnNlKHRoaXMuZ2V0KCdkYXRlJykpKSk7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3Zpc2libGUnLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnYW1vdW50JykgPj0gMCA/ICdwb3NpdGl2ZScgOiAnbmVnYXRpdmUnO1xyXG4gICAgfTtcclxuICAgIFRyYW5zYWN0aW9uLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGpzb24gPSBfc3VwZXIucHJvdG90eXBlLnRvSlNPTi5jYWxsKHRoaXMpO1xyXG4gICAgICAgIGpzb24uc2lnbiA9IHRoaXMuc2lnbigpO1xyXG4gICAgICAgIGpzb24uaWQgPSB0aGlzLmlkO1xyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfTtcclxuICAgIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5zZXRDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xyXG4gICAgICAgIHRoaXMuc2V0KCdjYXRlZ29yeScsIGNhdGVnb3J5KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVHJhbnNhY3Rpb247XHJcbn0oQmFja2JvbmUuTW9kZWwpKTtcclxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcclxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBUcmFuc2FjdGlvbjtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VHJhbnNhY3Rpb24uanMubWFwIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvYmFja2JvbmUtdHlwaW5ncy9iYWNrYm9uZS5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkV4cGVuc2VzLnRzXCIgLz5cclxuXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn07XHJcbnZhciBFeHBlbnNlc18xID0gcmVxdWlyZSgnLi9FeHBlbnNlcycpO1xyXG52YXIgRXhwZW5zZVRhYmxlXzEgPSByZXF1aXJlKCcuL0V4cGVuc2VUYWJsZScpO1xyXG52YXIgQ2F0ZWdvcnlWaWV3XzEgPSByZXF1aXJlKCcuL0NhdGVnb3J5VmlldycpO1xyXG52YXIgQ2F0ZWdvcnlDb2xsZWN0aW9uXzEgPSByZXF1aXJlKFwiLi9DYXRlZ29yeUNvbGxlY3Rpb25cIik7XHJcbmZ1bmN0aW9uIGFzeW5jTG9vcChhcnIsIGNhbGxiYWNrLCBkb25lKSB7XHJcbiAgICAoZnVuY3Rpb24gbG9vcChpKSB7XHJcbiAgICAgICAgY2FsbGJhY2soYXJyW2ldLCBpLCBhcnIubGVuZ3RoKTsgLy9jYWxsYmFjayB3aGVuIHRoZSBsb29wIGdvZXMgb25cclxuICAgICAgICBpZiAoaSA8IGFyci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IGxvb3AoKytpKTsgfSwgMSk7IC8vcmVydW4gd2hlbiBjb25kaXRpb24gaXMgdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGRvbmUpIHtcclxuICAgICAgICAgICAgICAgIGRvbmUoYXJyLmxlbmd0aCk7IC8vY2FsbGJhY2sgd2hlbiB0aGUgbG9vcCBlbmRzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KDApKTsgLy9zdGFydCB3aXRoIDBcclxufVxyXG5leHBvcnRzLmFzeW5jTG9vcCA9IGFzeW5jTG9vcDtcclxudmFyIEFwcFZpZXcgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEFwcFZpZXcsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBBcHBWaWV3KG9wdGlvbnMpIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnY29uc3RydWN0IEFwcFZpZXcnKTtcclxuICAgICAgICB0aGlzLnNldEVsZW1lbnQoJCgnI2FwcCcpKTtcclxuICAgICAgICB0aGlzLm1vZGVsID0gbmV3IEV4cGVuc2VzXzFbXCJkZWZhdWx0XCJdKCk7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeUxpc3QgPSBuZXcgQ2F0ZWdvcnlDb2xsZWN0aW9uXzFbXCJkZWZhdWx0XCJdKCk7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeUxpc3Quc2V0RXhwZW5zZXModGhpcy5tb2RlbCk7XHJcbiAgICAgICAgdGhpcy50YWJsZSA9IG5ldyBFeHBlbnNlVGFibGVfMVtcImRlZmF1bHRcIl0oe1xyXG4gICAgICAgICAgICBtb2RlbDogdGhpcy5tb2RlbCxcclxuICAgICAgICAgICAgZWw6ICQoJyNleHBlbnNlVGFibGUnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudGFibGUuc2V0Q2F0ZWdvcnlMaXN0KHRoaXMuY2F0ZWdvcnlMaXN0KTtcclxuICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBuZXcgQ2F0ZWdvcnlWaWV3XzFbXCJkZWZhdWx0XCJdKHtcclxuICAgICAgICAgICAgbW9kZWw6IHRoaXMuY2F0ZWdvcnlMaXN0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NhdGVnb3J5IHZpZXcgbW9kZWwnLCB0aGlzLmNhdGVnb3JpZXMubW9kZWwpO1xyXG4gICAgICAgIHRoaXMubW9kZWwuZmV0Y2goKTtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsIFwiY2hhbmdlXCIsIHRoaXMucmVuZGVyKTtcclxuICAgICAgICAvL3RoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgXCJjaGFuZ2VcIiwgdGhpcy50YWJsZS5yZW5kZXIpO1xyXG4gICAgICAgIC8vdGhpcy5saXN0ZW5Ubyh0aGlzLm1vZGVsLCBcImNoYW5nZVwiLCB0aGlzLmNhdGVnb3JpZXMuY2hhbmdlKTsgLy8gd3JvbmcgbW9kZWwgaW5zaWRlID8gd2Z0PyFcclxuICAgICAgICAkKCcuY3VzdG9tLXNlYXJjaC1mb3JtIGlucHV0Jykub24oJ2tleXVwJywgdGhpcy5vblNlYXJjaC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIEFwcFZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQXBwVmlldy5yZW5kZXIoKScsIHRoaXMubW9kZWwuc2l6ZSgpKTtcclxuICAgICAgICB0aGlzLnRhYmxlLnJlbmRlcigpO1xyXG4gICAgICAgIC8vdGhpcy4kZWwuaHRtbCgnVGFibGUgc2hvd24nKTtcclxuICAgICAgICB0aGlzLmNhdGVnb3JpZXMuY2hhbmdlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgQXBwVmlldy5wcm90b3R5cGUub25TZWFyY2ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgcSA9ICQoZXZlbnQudGFyZ2V0KS52YWwoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhxKTtcclxuICAgICAgICB0aGlzLm1vZGVsLmZpbHRlclZpc2libGUocSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEFwcFZpZXc7XHJcbn0oQmFja2JvbmUuVmlldykpO1xyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBhcHAgPSBuZXcgQXBwVmlldygpO1xyXG4gICAgYXBwLnJlbmRlcigpO1xyXG59KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dW1zYWV0emUuanMubWFwIl19
