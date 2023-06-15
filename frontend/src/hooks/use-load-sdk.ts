import { useEffect, useState } from 'react';

// Add global onUbbleReady on the window
interface WindowWithUbble extends Window {
  onUbbleReady: () => void;
}
declare let window: WindowWithUbble;

export const useLoadSDK = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.onUbbleReady = () => {
      setLoaded(true);
    };
    let node: HTMLScriptElement;
    try {
      const scriptElement = document.createElement('script');
      scriptElement.type = 'application/javascript';
      scriptElement.id = 'ubble-sdk-js';
      scriptElement.innerHTML = `!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";var r=window.UbbleScriptLoader||{loaded:!1,loading:!1,version:"0.0.2"};r.loading||(r.loading=!0,function(){var e=[];r.ready=function(t){r.loaded?t&&t():t&&e.push(t)};var t=document.createElement("script");t.type="text/javascript",t.id="ubble-widgetapi-script",t.src="https://cdn.ubble.ai/ubble-idv-sdk-0.0.2.js",t.async=!0;var n=document.getElementsByTagName("script");n&&n[0].parentNode?n[0].parentNode.insertBefore(t,n[0]):document.body.appendChild(t),t.onload=function(){r.loaded=!0,window.onUbbleReady(),e.forEach((function(e){e()}))}}())}]);`;

      node = document.head.appendChild(scriptElement);
      setLoaded(false);
    } catch (ex) {
      console.error('Error appending ubble-sdk script');
      console.error(ex);
    }

    // Remove script
    return () => {
      node?.remove();
    };
  }, []);

  return { loaded };
};
