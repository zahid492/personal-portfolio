/* 
 * angular-disqus 1.1.0
 * http://github.com/kirstein/angular-disqus
 * 
 * Licensed under the MIT license
 */
!function(a,b){"use strict";var c=a.module("ngDisqus",[]);c.provider("$disqus",function(){function c(){return document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]}function d(){return l||b.disqus_shortname}function e(a,b){return"//"+a+".disqus.com/"+b}function f(a){var b=document.createElement("script");return b.type="text/javascript",b.async=!0,b.src=a,b}function g(a,b){var c,d,e=a.getElementsByTagName("script");for(d=0;d<e.length;d+=1)if(c=e[d],~c.src.indexOf(b))return!0;return!1}function h(a,c,d){b.disqus_identifier=a,b.disqus_url=c,b.disqus_shortname=d}function i(){var c=b.DISQUSWIDGETS;c&&a.isFunction(c.getCount)&&c.getCount()}function j(a,c){b.DISQUS.reset({reload:!0,config:function(){this.page.identifier=c,this.page.url=a.absUrl()}})}function k(a,b){var d=c(),h=e(a,b);g(d,h)||d.appendChild(f(h))}var l,m="embed.js",n="count.js";this.setShortname=function(a){l=a},this.$get=["$location",function(c){function e(e){var f=d();if(!a.isDefined(f))throw new Error("No disqus shortname defined");if(!a.isDefined(e))throw new Error("No disqus thread id defined");a.isDefined(b.DISQUS)?j(c,e):(h(e,c.absUrl(),f),k(f,m))}function f(a){h(a,c.absUrl(),l),k(d(),m),k(d(),n),i()}return{commit:e,getShortname:d,loadCount:f}}]}),c.directive("disqus",["$disqus",function(b){return{restrict:"AC",replace:!0,scope:{id:"=disqus"},template:'<div id="disqus_thread"></div>',link:function(c){c.$watch("id",function(c){a.isDefined(c)&&b.commit(c)})}}}]),c.directive("disqusIdentifier",["$disqus",function(a){return{restrict:"A",link:function(b,c,d){a.loadCount(d.disqusIdentifier)}}}])}(angular,this);