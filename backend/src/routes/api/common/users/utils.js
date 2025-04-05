const axios = require('axios')
const getDealerCred = async (DealerCred,arkapiurl) => {
  const userData = await fetch(`${arkapiurl}/login/public/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(DealerCred)
  })
    .then(response => response.json())
  return userData
}

exports.checkIfUserExists = async (phoneNumber,orgObj) => {
  if (phoneNumber) {
    const DealerCred={companyName:orgObj.name,userName:orgObj.dealerName,password:orgObj.password}
    const BaseUrl=orgObj.arkapiurl
    const userData = await getDealerCred(DealerCred,BaseUrl)
    if (userData?.success) {
      const user = await fetch(`${orgObj.arkapiurl}/admin/public/api/v1/username/${phoneNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + userData?.data?.token,
          },
        })
        .then(response => response.json())
      return user
    }
  }
}
exports.sendOtp = async (mobile,BaseUrl,templateId,authKey) => {
  console.log("Sending OTP to mobile:", mobile);
  console.log("BaseUrl:", BaseUrl);
  console.log("TemplateId:", templateId);
  console.log("AuthKey:", authKey);
  const options = {
    method: 'POST',
    url: `${BaseUrl}/api/v5/otp?template_id${templateId}=&mobile=${mobile}&otp_length=6&authkey=${authKey}`,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
  };

  try {
    const response = await axios(options);
    const data = response.data;
    // Check if the response type is 'success'
    if (data && data.type === 'success') {
      data.success = true; // Add 'success: true' to the response object
      data.message = `Otp has been sent to ${mobile}`; // Add customer message
    }
    else if (data?.type == "error") {
      data.success = false
    }
    else {
      data.success = false

    }
    return data
  }
  catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to generate OTP' };
  }
}
