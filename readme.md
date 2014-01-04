# Sticky WebSockets

## Introduction

It wraps the basic websocket object and tries to reconnect to the server if it loses connection.
It works exactly like a websocket client.
`var ws = new stickyWebSocket("ws://awesome:port");`
supports onopen, onclose, onconnecting, onerror events 
use ws.send() and ws.close() to send and close respectively

## Note

uses the exponential backoff algorithm from 
http://dthain.blogspot.nl/2009/02/exponential-backoff-in-distributed.html

## found an error?

Well, this just came out another [project](https://github.com/hardfire/mekespo) I was working on an might have errors. I like pull requests more,if not then be a good person and report the errors so that we can fix them :D

Note : I have not tested this thoroughly but it is kind of a small and cute library and should work in general. putting it on github might help someone who wants to do something similar
