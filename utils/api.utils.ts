const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL2 = process.env.NEXT_PUBLIC_API_URL2;
import axios from "axios";

export const orgLogin = async (username: string, password: string) => {
  try {
    console.log(username, password);
    const response = await axios.post(
      `${API_URL}/login`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Fixed syntax: moved to config object root
      }
    );
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const orgSignup = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/signup`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Fixed syntax: moved to config object root
      }
    );
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

export const getOrgDetails = async () => {
  const response = await axios.get(`${API_URL}/detailed/info`, {
    withCredentials: true,
  });
  return response.data;
};

export const getShipments = async () => {
  const response = await axios.get(`${API_URL}/shipments`, {
    withCredentials: true,
  });
  return response.data;
};

export const saveOrgContact = async (email: string) => {
  const response = await axios.post(
    `${API_URL}/contactInfo`,
    { email },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const addSourceAddress = async (address: any) => {
  console.log(address);
  const response = await axios.post(
    `${API_URL}/add/source`,
    { ...address },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const addDestinationAddress = async (address: any) => {
  const response = await axios.post(
    `${API_URL}/add/destination`,
    { ...address },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getItemStatus = async (item: any) => {
  const response = await axios.post(
    `${API_URL2}/india/api/check-export-compliance`,
    {
      ...item,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const addItem = async (item: any) => {
  const response = await axios.post(
    `${API_URL}/add/item`,
    { ...item },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const indiaCheckCompliance = async (item: any) => {
  const response = await axios.post(
    `${API_URL2}/india/api/check-export-compliance`,
    { ...item },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const usCheckCompliance = async (item: any) => {
  const response = await axios.post(
    `${API_URL2}/us/api/check-export-compliance`,
    { ...item },
    { withCredentials: true }
  );
  return response.data;
};

export const getHsCode = async (itemName: any) => {
  const response = await axios.post(
    `${API_URL2}/india/api/find-by-description`,
    {
      description: itemName,
    }
  );
  return response.data;
};

export const saveShipmentDetails = async (shipmentDetails: any) => {
  const response = await axios.post(
    `${API_URL}/shipment/box`,
    { ...shipmentDetails },
    { withCredentials: true }
  );
  return response.data;
};

export const shipmentCreate = async (shipmentDetails: any) => {
  console.log("shipmentDetails: ", shipmentDetails);
  const response = await axios.post(
    `${API_URL}/shipment/create`,
    { ...shipmentDetails },
    { withCredentials: true }
  );
  return response.data;
};

export const shipmentBox = async (data: any) => {
  console.log("data: ", data);
  const response = await axios.post(
    `${API_URL}/shipment/box`,
    { ...data },
    { withCredentials: true }
  );
  return response.data;
};

export const getReport = async (data: any) => {
  console.log(data, "report data");
  const response = await axios.post(
    `${API_URL2}/api/check-shipment-compliance`,
    { ...data },
    { withCredentials: true }
  );
  return response.data;
};
