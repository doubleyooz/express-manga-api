import { review, review2 } from '../../../mocks/review.mock.js';
import { userToken, scanToken } from '../../../mocks/jwt.mock.js';

import {
    createReview,
    findReview,
    listReview,
    updateReview,
} from '../../../helpers/review.helper.js';

describe('Review', () => {
   
    let mockToken = userToken(review.user_id);
    let mockToken2 = userToken(review2.user_id);

    createReview(review, mockToken);
    createReview(review, mockToken);
    createReview(review2, mockToken2);
    updateReview(
        {
            text: 'This one is absolutely terrible, there are no words in this world to express how bad it is',
            _id: 1,
        },
        mockToken,
        'update text',
    );

    findReview(review2);
    listReview([review, review], true, 2);
});
