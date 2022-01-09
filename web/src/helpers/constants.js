export const responsesFormat = ({ error = false, message = '', data = {}, redirect = '' }) => {
  return {
    message,
    error,
    data,
    redirect
  };
};
