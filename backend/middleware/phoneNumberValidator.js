const phoneNumberValidator = (req, res, next) => {
    // Get both phone and newPhone from the request body
    let { phone, newPhone } = req.body; 

    // Determine which phone number to validate: phone or newPhone
    const phoneToValidate = phone || newPhone;

    // Validate phone number
    if (phoneToValidate.length === 10) {
        // If the phone number is 10 digits, prepend '91'
        req.body.phone = '91' + phoneToValidate; // Assuming you want to store the modified phone number in 'phone'
    } else if (phoneToValidate.length === 12) {
        // If phone number is 12 digits, check if it starts with '91'
        if (!phoneToValidate.startsWith('91')) {
            return res.status(400).send('Invalid phone number. Must start with 91.');
        }
    } else {
        // If phone number is neither 10 nor 12 digits, it's invalid
        return res.status(400).send('Invalid phone number. Must be 10 or 12 digits.');
    }

    // If using both phone and newPhone, set both in req.body for future use
    if (newPhone) {
        req.body.newPhone = '91' + newPhone; // Update newPhone if it's provided
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports = phoneNumberValidator;
