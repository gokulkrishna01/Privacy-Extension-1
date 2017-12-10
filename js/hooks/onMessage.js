"use strict";


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  
  /**
   * Handle passed request and return single result.
   *
   * @param   {Object} request
   * @returns {Mixed|Boolean}
   */
  var handleRequest = function (request) {
    var result;
    if (typeof request === 'object') {
      if (request.hasOwnProperty('action') && typeof request.action === 'string') {
        var arr = request.action.split('.'),
          controller = (typeof arr[0] !== 'undefined') ? arr[0] : null,
          method = (typeof arr[1] !== 'undefined') ? arr[1] : null,
          params = (typeof request.data === 'object') ? request.data : {};
        if (typeof controller === 'string' && typeof method === 'string') {
          if (typeof API[controller][method] === 'function') {
            result = API[controller][method](params);
          } else {
            console.warn('Unknown controller.method: "' + controller + '.' + method + '"');
          }
        } else {
          console.warn('Invalid controller.method: "' + controller + '.' + method + '"');
        }
      }
    }
    return result;
  };

  // Process passes request(s)
  var result;
  if (Object.prototype.toString.call(request) === '[object Array]') {
    result = [];
    for (var i = 0; i <= request.length - 1; i++) {
      result.push(handleRequest(request[i]));
    }
  } else {
    result = handleRequest(request);
  }
  sendResponse(result);
  return true;
});
