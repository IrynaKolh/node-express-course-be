export const buildResponse = (statusCode: number, body: any, headers = {}) => {
  const defaultHeaders = {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
  };
  return {
    statusCode,
    headers: { ...headers, ...defaultHeaders },
    body: JSON.stringify(body || {}),
  };
};
