// server/middleware/logging.js
// Middleware to log task-related routes
export const taskLog = (req, res, next) => {
    console.log(`Task route: ${req.method} ${req.originalUrl}`);
    console.log(`Time: ${new Date().toISOString()}`);
    next();
};

// Middleware to log incoming requests
export const logRequest = function(req, res, next){
    console.log(`Requests: ${req.method} for ${req.path}`);
    next();
}
