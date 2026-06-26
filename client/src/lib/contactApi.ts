import API from "./authApi";

export const sendContactMessage = async (
  contactData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }
) => {
  const response = await API.post(
    "/contact/send",
    contactData
  );

  return response.data;
};

export const getAllMessages =
  async () => {
    const response = await API.get(
      "/contact/messages"
    );

    return response.data;
  };