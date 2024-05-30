class HttpError extends Error{
    constructor(msg,errorCode){
        super(msg);                         // invokes the parent Error class's constructor with the error message msg
        this.code=errorCode;
    }
}

module.exports= HttpError;