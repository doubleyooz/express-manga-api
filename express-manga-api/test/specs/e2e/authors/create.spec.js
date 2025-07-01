import mongoose from "mongoose";

import { createAuthor } from "../../../helpers/author.helper.js";
import { artist, bad_artist, writer } from "../../../mocks/author.mock.js";
import { scanToken } from "../../../mocks/jwt.mock.js";

const describeif = condition => (condition ? describe : describe.skip);
const runAll = true;

function wrongProperty(property, change) {
  let temp = { ...artist };
  // can't send a null value
  if (change)
    temp[property] = change;
  else delete temp[property];

  return temp;
}

describe("author", () => {
  let mockToken = scanToken(mongoose.Types.ObjectId().toString());

  describeif(runAll)("should accept", () => {
    createAuthor(artist, mockToken, 200);
    createAuthor(writer, mockToken, 200);
  });

  describeif(runAll)("should reject", () => {
    describeif(runAll)("invalid arguments", () => {
      createAuthor(bad_artist, mockToken, 400);
      describeif(runAll)("invalid name", () => {
        describeif(runAll)("invalid type", () => {
          createAuthor(wrongProperty("name", 2), mockToken, 400);

          // createAuthor(wrongProperty('name',true), mockToken, 400);

          // createAuthor(wrongProperty('name', false), mockToken, 400);

          // createAuthor(wrongProperty('name', ['']), mockToken, 400);

          /* createAuthor(
                        wrongProperty('name', JSON.stringify({ ...artist })),
                        mockToken,
                        400,
                    ); */

          // createAuthor(wrongProperty('name'), mockToken, 400);
        });

        describeif(runAll)("invalid format", () => {
          createAuthor(wrongProperty("name", ""), mockToken, 400);

          createAuthor(wrongProperty("name", "s"), mockToken, 400);

          createAuthor(wrongProperty("name", "sd"), mockToken, 400);

          createAuthor(
            wrongProperty("name", "\n\n\n"),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("name", "       "),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty(
              "name",
              "more than 20 characters for sure",
            ),
            mockToken,
            400,
          );
        });
      });

      describeif(runAll)("invalid types", () => {
        describeif(runAll)("invalid type", () => {
          createAuthor(wrongProperty("types", 3), mockToken, 400);

          createAuthor(
            wrongProperty("types", JSON.stringify(artist)),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", "true"),
            mockToken,
            400,
          );

          createAuthor(wrongProperty("types", false), mockToken, 400);

          createAuthor(wrongProperty("types"), mockToken, 400);

          createAuthor(
            wrongProperty("types", [54, 25, 0]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", [true, false, true]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", [true, false, 2]),
            mockToken,
            400,
          );
        });

        describeif(runAll)("invalid format", () => {
          createAuthor(wrongProperty("types", ""), mockToken, 400);

          createAuthor(
            wrongProperty("types", "sass"),
            mockToken,
            400,
          );

          createAuthor(wrongProperty("types", []), mockToken, 400);

          createAuthor(
            wrongProperty("types", ["sass"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", ["saas", "32123"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", ["writer", "dasdas"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", ["artist", "dasdas"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", ["artist", "artist"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", ["writer", "writer"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", [
              "artist",
              "writer",
              "something",
            ]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", ["artist", "writer", 32]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("types", "/artist|writer/"),
            mockToken,
            400,
          );
        });
      });

      describeif(runAll)("invalid birthDate", () => {
        const wrongBirthDate = (change) => {
          let temp = { ...artist };
          temp.deathDate = "2020-12-10";
          // can't send a null value
          if (change)
            temp.birthDate = change;
          else delete temp.birthDate;

          return temp;
        };

        describeif(runAll)("invalid type", () => {
          createAuthor(wrongBirthDate(3), mockToken, 400);

          createAuthor(wrongBirthDate(["sass"]), mockToken, 400);

          createAuthor(
            wrongBirthDate(["saas", "32123"]),
            mockToken,
            400,
          );

          createAuthor(wrongBirthDate([54, 25, 0]), mockToken, 400);

          createAuthor(
            wrongBirthDate(JSON.stringify(artist)),
            mockToken,
            400,
          );

          createAuthor(wrongBirthDate(), mockToken, 400);
        });

        describeif(runAll)("invalid format", () => {
          createAuthor(wrongBirthDate(""), mockToken, 400);

          createAuthor(wrongBirthDate("sass"), mockToken, 400);

          createAuthor(wrongBirthDate("22/15/2012"), mockToken, 400);

          createAuthor(wrongBirthDate("22/15/2000"), mockToken, 400);

          createAuthor(wrongBirthDate("2222/12/30"), mockToken, 400);

          createAuthor(
            wrongBirthDate("2222/december/30"),
            mockToken,
            400,
          );

          createAuthor(wrongBirthDate("1980/02/20"), mockToken, 400);
        });

        describeif(runAll)("invalid date", () => {
          createAuthor(
            wrongBirthDate("ds-dsas-2012"),
            mockToken,
            400,
          );

          createAuthor(wrongBirthDate("1900-02-30"), mockToken, 400);

          createAuthor(wrongBirthDate("1903-02-29"), mockToken, 400);

          createAuthor(wrongBirthDate("2000-15-15"), mockToken, 400);

          createAuthor(wrongBirthDate("2000-06-1"), mockToken, 400);

          createAuthor(wrongBirthDate("2000-6-01"), mockToken, 400);

          createAuthor(wrongBirthDate("2000-6-1"), mockToken, 400);

          createAuthor(wrongBirthDate("2030-10-23"), mockToken, 400);

          createAuthor(wrongBirthDate("1000-06-01"), mockToken, 400);
        });

        describeif(runAll)(
          "invalid birthDate and deathDate relation",
          () => {
            createAuthor(
              wrongBirthDate("2019-12-22"),
              mockToken,
              400,
            );

            createAuthor(
              wrongBirthDate("2022-02-05"),
              mockToken,
              400,
            );

            createAuthor(
              wrongBirthDate("2015-04-29"),
              mockToken,
              400,
            );

            createAuthor(
              wrongBirthDate("2030-05-15"),
              mockToken,
              400,
            );

            createAuthor(
              wrongBirthDate("2019-06-10"),
              mockToken,
              400,
            );

            createAuthor(
              wrongBirthDate("1900-06-06"),
              mockToken,
              400,
            );

            createAuthor(
              wrongBirthDate("1905-06-10"),
              mockToken,
              400,
            );

            createAuthor(
              wrongBirthDate("1000-06-01"),
              mockToken,
              400,
            );
          },
        );
      });

      describeif(runAll)("invalid deathDate", () => {
        const wrongDeathDate = (change) => {
          let temp = { ...artist };
          temp.birthDate = "1912-12-10";
          // can't send a null value
          if (change)
            temp.deathDate = change;
          else delete temp.deathDate;

          return temp;
        };

        describeif(runAll)("invalid type", () => {
          createAuthor(wrongDeathDate(3), mockToken, 400);

          createAuthor(wrongDeathDate(["sass"]), mockToken, 400);

          createAuthor(
            wrongDeathDate(["saas", "32123"]),
            mockToken,
            400,
          );

          createAuthor(wrongDeathDate([54, 25, 0]), mockToken, 400);

          createAuthor(
            wrongDeathDate(JSON.stringify(artist)),
            mockToken,
            400,
          );

          createAuthor(wrongDeathDate(), mockToken, 400);
        });

        describeif(runAll)("invalid format", () => {
          createAuthor(wrongDeathDate(""), mockToken, 400);

          createAuthor(wrongDeathDate("sass"), mockToken, 400);

          createAuthor(wrongDeathDate("22/15/2012"), mockToken, 400);

          createAuthor(wrongDeathDate("22/15/2000"), mockToken, 400);

          createAuthor(wrongDeathDate("2222/12/30"), mockToken, 400);

          createAuthor(
            wrongDeathDate("2222/december/30"),
            mockToken,
            400,
          );

          createAuthor(wrongDeathDate("1980/02/20"), mockToken, 400);
        });

        describeif(runAll)("invalid date", () => {
          createAuthor(
            wrongDeathDate("ds-dsas-2012"),
            mockToken,
            400,
          );

          createAuthor(wrongDeathDate("1900-02-30"), mockToken, 400);

          createAuthor(wrongDeathDate("1903-02-29"), mockToken, 400);

          createAuthor(wrongDeathDate("2000-15-15"), mockToken, 400);

          createAuthor(wrongDeathDate("2000-06-1"), mockToken, 400);

          createAuthor(wrongDeathDate("2000-6-01"), mockToken, 400);

          createAuthor(wrongDeathDate("2000-6-1"), mockToken, 400);

          createAuthor(wrongDeathDate("1000-06-01"), mockToken, 400);
        });

        describeif(runAll)(
          "invalid birthDate and deathDate relation",
          () => {
            createAuthor(
              wrongDeathDate("2013-12-22"),
              mockToken,
              400,
            );

            createAuthor(
              wrongDeathDate("2032-02-05"),
              mockToken,
              400,
            );

            createAuthor(
              wrongDeathDate("1911-04-29"),
              mockToken,
              400,
            );

            createAuthor(
              wrongDeathDate("1912-12-10"),
              mockToken,
              400,
            );

            createAuthor(
              wrongDeathDate("2019-06-10"),
              mockToken,
              400,
            );

            createAuthor(
              wrongDeathDate("1900-06-06"),
              mockToken,
              400,
            );

            createAuthor(
              wrongDeathDate("1905-06-10"),
              mockToken,
              400,
            );

            createAuthor(
              wrongDeathDate("1000-06-01"),
              mockToken,
              400,
            );
          },
        );
      });

      describeif(runAll)("invalid biography", () => {
        describeif(runAll)("invalid type", () => {
          createAuthor(wrongProperty("biography", 2), mockToken, 400);

          createAuthor(
            wrongProperty("biography", -52),
            mockToken,
            400,
          );

          // createAuthor(wrongProperty('biography', true), mockToken, 400);

          createAuthor(
            wrongProperty("biography", false),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("biography", [""]),
            mockToken,
            400,
          );

          createAuthor(wrongProperty("biography"), mockToken, 400);
        });

        describeif(runAll)("invalid format", () => {
          createAuthor(
            wrongProperty("biography", ""),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty(
              "biography",
              "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
            ),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("biography", "sd"),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("biography", "   "),
            mockToken,
            400,
          );
        });
      });

      describeif(runAll)("invalid social Media", () => {
        describeif(runAll)("invalid type", () => {
          createAuthor(
            wrongProperty("socialMedia", 3),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", JSON.stringify(artist)),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", "true"),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", false),
            mockToken,
            400,
          );

          createAuthor(wrongProperty("socialMedia"), mockToken, 400);

          createAuthor(
            wrongProperty("socialMedia", [54, 25, 0]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", [true, false, true]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", ""),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", "sassf"),
            mockToken,
            400,
          );
        });

        describeif(runAll)("invalid format", () => {
          createAuthor(
            wrongProperty("socialMedia", []),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", ["sass"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", ["saas", "32123"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", ["writer", "dasdas"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", ["artist", "dasdas"]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", [
              "artist",
              "writer",
              "something",
            ]),
            mockToken,
            400,
          );

          createAuthor(
            wrongProperty("socialMedia", ["artist", "writer", 32]),
            mockToken,
            400,
          );

          describeif(runAll)("invalid url", () => {
            createAuthor(
              wrongProperty("socialMedia", [
                "http://socialm.co/khj",
                "https://soc.ialmco/khj",
                "http://socialmco/khjk/hjk",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "http://socialm.co/khj",
                "http://socialmco/khj",
                "https://social.mco/khjk/hjk",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "https://socialmco/khj",
                "http://social.mco/khj",
                "http://social.mco/khjk/hjk",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "https://socialm.co/khj",
                "hsttp://socialm.co/khj",
                "http://socialm.co/khjk/hjk",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "httpsw://socialm.co/khj",
                "http://socialm.co/khj",
                "http://social.mco/khjk/hjk",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "http://social.dsmco/khj",
                "http://social.mco/khj",
                "htts23p://social.mco/khjk/hjk",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "http://soc.dsaial.dsmco",
                "http://social.mco/khj",
                "http://social.mco/khjk/hjk",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "http://social.dsmco/khj",
                "http://social.mco/khj",
                "https://social.mco",
              ]),
              mockToken,
              400,
            );

            createAuthor(
              wrongProperty("socialMedia", [
                "http://social.dsmco/khj",
                "http://social.mco",
                "http://social.mco/khjk/hjk",
              ]),
              mockToken,
              400,
            );
          });
        });
      });
    });
  });
});
