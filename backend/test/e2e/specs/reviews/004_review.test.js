import { review, review2 } from '../../../mocks/review.mock.js';

import { createReview, updateReview } from '../../../helpers/review.helper.js';
import jwt from '../../../../src/utils/jwt.util.js';

describe('Review', () => {
    let mockToken = jwt.generateJwt(
        {
            _id: review.user_id,
            role: 'User',
            token_version: 0,
        },
        1,
    );

    let mockToken2 = jwt.generateJwt(
        {
            _id: review2.user_id,
            role: 'User',
            token_version: 0,
        },
        1,
    );

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
});
