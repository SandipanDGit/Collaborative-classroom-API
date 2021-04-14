const passwordValidator = require('password-validator');

exports.validate_password = (password)=>{
    let schema = new passwordValidator();
    schema
    .is().min(8)        // Minimum length 8                                    
    .is().max(32)       // Maximum length 32                                  
    .has().uppercase()      // Must have uppercase letters                              
    .has().lowercase()      // Must have lowercase letters                              
    .has().digits(1)        // Must have at least 1 digits
    .has().symbols(1)       //must contain at least 1 symbol                            
    .has().not().spaces()
    //must not contain anything other than the listed below
    .has().not(/[^a-zA-Z0-9_#@$%^&*()+=\-\[\]\'\";,.\/{}|:`<>?~\\\\]/); 
    
    return schema.validate(password)
}
