export class ApiError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode,
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Success'
        this.isOperational = true  

        Error.captureStackTrace(this,this.constructor)
    }
}