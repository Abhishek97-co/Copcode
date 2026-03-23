import { nanoid } from "nanoid";

export const generateRoomId = () => {
  const seg = () => nanoid(4).toLowerCase();
  return `${seg()}-${seg()}-${seg()}`;
};