export const setSession = (data) => {
  if (typeof data !== 'object') throw new Error(`${data} is not an object`);
  localStorage.setItem('session', JSON.stringify(data));
};

export const getSession = () => {
  const dataSession = localStorage.getItem('session');
  return dataSession ? JSON.parse(dataSession) : {};
};

export const removeSession = () => {
  localStorage.removeItem('session');
  // And others, maybe you can put token in different variable
};
