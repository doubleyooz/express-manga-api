import {
  createReview,
  deleteReview,
  findReview,
  listReview,
  updateReview,
} from "../../../helpers/review.helper.js";
import { scanToken, userToken } from "../../../mocks/jwt.mock.js";

import { review, review2, review3 } from "../../../mocks/review.mock.js";

const describeif = condition => (condition ? describe : describe.skip);
const runAll = true;

describe("review", () => {
  describeif(runAll)("should accept", () => {
    let mockToken = userToken(review.user_id);
    let mockToken2 = userToken(review2.user_id);

    createReview(review, mockToken);
    createReview(review3, mockToken);
    createReview(review2, mockToken2);
    updateReview(
      {
        text: "This one is absolutely terrible, there are no words in this world to express how bad it is",
        _id: 1,
      },
      mockToken,
      "update text",
    );

    findReview(review2);
    listReview([review3, review], { user_id: review.user_id }, 2);
    // listReview([review2], { user_id: review2.user_id }, 1);
    deleteReview(review, mockToken);
    deleteReview(review2, mockToken2);
  });
});
