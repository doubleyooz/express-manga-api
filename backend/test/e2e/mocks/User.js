const scan = {

    email: `${process.env.TEST_GMAIL}`,
    password: `${process.env.TEST_GMAIL_PASS}`,
    name: "Jojo",
    role: "Scan",
    _id: "",
    token: "",

}
const user = {

    email: `${process.env.TEST_GMAIL}`,
    password: `${process.env.TEST_GMAIL_PASS}`,
    name: "Seth",
    role: "User",
    _id: "",
    token: "",

}

const fake_user = {
    email: `25 + ${process.env.TEST_GMAIL}`,
    password: `${process.env.TEST_GMAIL_PASS_2}`,
    name: "Matt",
    role: "d2asadn",
    _id: "",
    token: "",
};
export { user, scan, fake_user }