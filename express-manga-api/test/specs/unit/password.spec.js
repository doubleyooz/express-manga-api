import {
  hashPassword,
  matchPassword,
} from "../../../../express-manga-api-old/src/services/password.util";
import { fake_user, user } from "../../mocks/user.mock";

const itif = (condition) => (condition ? it : it.skip);

describe("Password", () => {
  describe("should work", () => {
    it("match hash with the origin string", async () => {
      const hash = await hashPassword(user.password);

      expect(await matchPassword(hash, user.password)).toBe(true);
    });

    it("match hash with the origin string with custom salts", async () => {
      const hash = await hashPassword(user.password, 12);
      expect(await matchPassword(hash, user.password)).toBe(true);
    });
  });

  describe("should fail", () => {
    it("match hash with the wrong string", async () => {
      const hash = await hashPassword(user.password);
      expect(await matchPassword(hash, fake_user.password)).toBe(false);
    });
  });
});
