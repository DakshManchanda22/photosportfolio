const BASE =
  "https://res.cloudinary.com/dakshscloud/image/upload";

export const cdnImage = (filename) =>
  `${BASE}/w_1400,c_limit,q_auto,f_auto/${filename}`;

