/*
 * Copyright (c) 2015 RF Digital Corp. All Rights Reserved.
 *
 * The source code contained in this file and all intellectual property embodied in
 * or covering the source code is the property of RF Digital Corp. or its licensors.
 * Your right to use this source code and intellectual property is non-transferable,
 * non-sub licensable, revocable, and subject to terms and conditions of the
 * SIMBLEE SOFTWARE LICENSE AGREEMENT.
 * http://www.simblee.com/licenses/SimbleeSoftwareLicenseAgreement.txt
 *
 * THE SOURCE CODE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.
 *
 * This heading must NOT be removed from this file.
 */

SimbleeCloud = function(esn, userid) {
  this.myESN = esn || 0x00000000;
  this.userID = userid || 0x00000000;

  this.assignedESN = null; 

  this.active = false;

  this.onactive = null;
  this.oninactive = null;
  this.oninitial = null;
  this.onrequest = null;
  this.oncountresult = null;
};

SimbleeCloud.prototype = {};

SimbleeCloud.MAX_MODULE_PAYLOAD = 180;

SimbleeCloud.LITTLE_ENDIAN = true;

SimbleeCloud.MCS_FUNCTION_CALL = 0xffffffff;

SimbleeCloud.MCS_FUNCTION_NONE = 0;
SimbleeCloud.MCS_FUNCTION_PING = 1;
SimbleeCloud.MCS_FUNCTION_PONG = 2;
SimbleeCloud.MCS_FUNCTION_COUNT = 3;
SimbleeCloud.MCS_FUNCTION_INITIAL = 4;

/*
SimbleeCloud.prototype._var = false;
Object.defineProperty(SimbleeCloud.prototype, 'var',
  { get: function() {
      return this._var;
    },
    set: function(v) {
      this._var = v;
    } });
*/

SimbleeCloud.prototype.copyBytes = function(target, source, targetOffset, sourceOffset, length) {
  targetOffset = targetOffset || 0;
  sourceOffset = sourceOffset || 0;
  length = length || source.byteLength;

  var view = new Uint8Array(target, targetOffset);
  view.set(new Uint8Array(source, sourceOffset, length));
};

SimbleeCloud.prototype.send = function(destESN, payload) {
  var len = payload.byteLength;

  if (len > SimbleeCloud.MAX_MODULE_PAYLOAD)
    len = SimbleeCloud.MAX_MODULE_PAYLOAD;

  var msg_len = 1 + 4 + len;

  var buffer = new ArrayBuffer(1 + 4 + len);
  var view = new DataView(buffer);
  view.setUint8(0, 1 + 4 + len);
  view.setUint32(1, destESN, SimbleeCloud.LITTLE_ENDIAN);
  this.copyBytes(buffer, payload, 5, 0, len);

  this.websocket.send(buffer);
};

SimbleeCloud.prototype.onwebsocketopen = function() {
  // "this" is the websocket, not the SimbleeCloud object
  var self = this.outer;

  // start byte
  self.websocket.send("!");

  // start message (my esn, then user id for authorization)
  var payload = new ArrayBuffer(4);
  var view = new DataView(payload);
  view.setUint32(0, self.userID, SimbleeCloud.LITTLE_ENDIAN);
  self.send(self.myESN, payload);
};

SimbleeCloud.prototype.countasync = function(esn) {
  var payload = new ArrayBuffer(5);
  var view = new DataView(payload);
  view.setUint8(0, SimbleeCloud.MCS_FUNCTION_COUNT);
  view.setUint32(1, esn, SimbleeCloud.LITTLE_ENDIAN);
  this.send(SimbleeCloud.MCS_FUNCTION_CALL, payload);
};

SimbleeCloud.prototype.onmcsfunctioncall = function(requestBuffer) {
  var requestView = new DataView(requestBuffer);

  var funct = requestView.getUint8(5);

  if (funct == SimbleeCloud.MCS_FUNCTION_PING)
  {
    // console.log("ping");
    // send pong (retaining conv area)
    var responseBuffer = requestBuffer.slice(0);
    var responseView = new DataView(responseBuffer);
    responseView.setUint8(5, SimbleeCloud.MCS_FUNCTION_PONG);
    this.websocket.send(responseBuffer);
  }
  else if (funct == SimbleeCloud.MCS_FUNCTION_PONG)
  {
    // process pong
  }
  else if (funct == SimbleeCloud.MCS_FUNCTION_COUNT)
  {
    // process count result
    var result = requestView.getUint32(6, true);
    if (this.oncountresult)
      this.oncountresult(result);
  }
  else if (funct == SimbleeCloud.MCS_FUNCTION_INITIAL)
  {
     // process initial
     var esn = requestView.getUint32(6, true);
     if (this.oninitial)
       this.oninitial(esn);
  }

  // ignore unknown mcs function calls
};

SimbleeCloud.prototype.onprocess = function(buffer) {
  var view = new DataView(buffer);

  var len = view.getUint8(0);
  var originESN = view.getUint32(1, true);

  // pool response
  if (originESN == this.myESN) {
    this.assignedESN = view.getUint32(5, true);
    // console.log("assignedESN = 0x" + this.assignedESN.toString(16));
  }

  if (! this.active) {
    this.active = true;
    if (this.onactive)
      this.onactive();
  }

  // pool response
  if (originESN == this.myESN)
    return;

  if (originESN == SimbleeCloud.MCS_FUNCTION_CALL) {
    this.onmcsfunctioncall(buffer);
    return;
  }

  if (this.onrequest) {
    var payload = buffer.slice(5);
    this.onrequest(originESN, payload);
  }
};

SimbleeCloud.prototype.onwebsocketmessage = function(evt) {
  // "this" is the websocket, not the SimbleeCloud object
  var self = this.outer;

  var fileReader = new FileReader();

  fileReader.onload = function() {
    self.onprocess(this.result);
  };

  fileReader.readAsArrayBuffer(evt.data);
};

SimbleeCloud.prototype.onwebsocketerror = function(evt) {
  var code = evt.code;

  // "this" is the websocket, not the SimbleeCloud object
  var self = this.outer;
};

SimbleeCloud.prototype.onwebsocketclose = function(evt) {
  var code = evt.code;

  // See http://tools.ietf.org/html/rfc6455#section-7.4.1
  var reason;
  if (code == 1000)
    reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
  else if(code == 1001)
    reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
  else if(code == 1002)
    reason = "An endpoint is terminating the connection due to a protocol error";
  else if(code == 1003)
    reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
  else if(code == 1004)
    reason = "Reserved. The specific meaning might be defined in the future.";
  else if(code == 1005)
    reason = "No status code was actually present.";
  else if(code == 1006)
    reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
  else if(code == 1007)
    reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
  else if(code == 1008)
    reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
  else if(code == 1009)
    reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
  else if(code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
    reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
  else if(code == 1011)
    reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
  else if(code == 1015)
    reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
  else
    reason = "Unknown reason";

  // console.log("onwebsocketclose: " + code + " - " + reason);

  // "this" is the websocket, not the SimbleeCloud object
  var self = this.outer;

  if (self.active) {
    self.active = false;
    if (self.oninactive)
      self.oninactive();
  }
};

SimbleeCloud.prototype.connect = function() {
  try
  {
    this.websocket = new WebSocket("wss://connect.simbleecloud.com:443");

    this.websocket.outer = this;

    this.websocket.onopen = this.onwebsocketopen;
    this.websocket.onmessage = this.onwebsocketmessage;
    this.websocket.onerror = this.onwebsocketerror;
    this.websocket.onclose = this.onwebsocketclose;
  }
  catch(e)
  {
    console.log(e);
  }
};

