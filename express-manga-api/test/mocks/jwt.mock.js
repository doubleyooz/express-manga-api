import jwt from '../../src/utils/jwt.util';

const userToken = _id => {
    return jwt.generateJwt(
        {
            _id: _id,
            role: 'User',
            token_version: 0,
        },
        1,
    );
};

const scanToken = _id => {   
    return jwt.generateJwt(
        {
            _id: _id,
            role: 'Scan',
            token_version: 0,
        },
        1,
    );
};

const corruptedToken = _id => {   
    return jwt.generateJwt(
        {
            _id: _id,
            role: '',
            token_version: 0,
        },
        2,
    );
};

export { userToken, scanToken, corruptedToken };
