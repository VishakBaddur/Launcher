// Main entry point for the MCP server
// We're using the Express server (test-server.ts) instead of the MCP SDK
// because it's more reliable and easier to work with

import './test-server';

console.log('Starting Launcher MCP Server...');
console.log('The server will be available at http://localhost:3001');
console.log('Use npm run dev to start the server'); 