exports.handleErrorResponse = (res, errorCode, errorMessage) => {
    //Logger to log this response
    var errorObject = {
      success: false,
      errors: errorMessage,
      status: errorCode
    }
    res.json(errorObject)
  }
  exports.handleErrorObject = (res, errorCode, errorObject) => {
    //Logger to log this response
    var errorObject = {
      success: false,
      errors: errorObject,
      status: errorCode
    }
    res.json(errorObject)
  }
  
  exports.handleSuccessResponse = (res, successMessage) => {
    //Logger to log this response
    var successObject = {
      success: true,
      message: successMessage,
      status: 200
    }
    res.json(successObject)
  }
  exports.handleSuccessCreated = (res, successMessage) => {
    //Logger to log this response
    var successObject = {
      success: true,
      message: successMessage,
      status: 201
    }
    res.json(successObject)
  }
  
  
  exports.handleException = (res, err) => {
    //Logger to log this response
    statusCode = err.status || 500
    const isProduction = process.env.NODE_ENV === 'production'
    var exceptionObject = {
      success: false,
      status: statusCode,
      message: err.message,
    }
    if(!isProduction) {exceptionObject['error'] = err }
    res.json(exceptionObject)
  }
  
  exports.handleSuccessObject = (res, responseObject,additionaldata={}) =>{
    //Logger to log this response
    var successObject = {
      success: true,
      data: responseObject,
      ...additionaldata,
      status: 200
    }
    res.json(successObject)
  }
  exports.handleSuccessWithMessageObject = (res, responseObject,message) =>{
    //Logger to log this response
    var successObject = {
      success: true,
      data: responseObject,
      message:message,
      status: 200
    }
    res.json(successObject)
  }

  

  