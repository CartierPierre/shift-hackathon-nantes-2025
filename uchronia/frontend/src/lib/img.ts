export const getImagePath = (imageUrl: string) => {
  console.log("getImagePath: ", imageUrl);
  if (imageUrl.includes("amazonaws.com")) {
    return imageUrl;
  }

  return `https://uchronia-backend.deploymate.xyz/${imageUrl}`;
};
