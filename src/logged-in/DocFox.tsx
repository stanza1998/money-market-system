// Import Axios (assuming you've installed it)
import axios from 'axios';
import React from 'react';

const DocFox = () => {

  const generateTokenUrl = 'https://us-central1-ijgmms.cloudfunctions.net/generateToken';

  interface IKYCApplication{
    applicationId:string, 
    kyc_entity_type: string,
    status: string,
  }

  const getKYCapplications = async () => {
    try {
      const response = await axios.get(generateTokenUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      const tokenData = response.data.data;

      const applications: IKYCApplication[] = []

      tokenData.forEach((tokenData:any )=> {
        const application : IKYCApplication=  {
          applicationId: tokenData.id,
          kyc_entity_type: tokenData.attributes.kyc_entity_type_name,
          status: tokenData.attributes.status.status
        }
        applications.push(application)
      });

      console.log(applications);

    } catch (error) {
      console.log(error);
      ;
    }
  };

  return (
    <div>
      <button onClick={getKYCapplications}>Get DocFox Data</button>
    </div>
  )
}

export default DocFox






